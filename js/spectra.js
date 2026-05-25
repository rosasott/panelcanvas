// spectra.js — PanelCanvas v0.4
// Fetches real measured emission spectra from FPbase GraphQL API.
// Falls back to synthetic Gaussians (DYE_EMISSION) for dyes not in FPbase.
// Caches results in localStorage for 1 week to avoid repeated fetches.
//
// Public API (window):
//   initSpectra()         → Promise — call once on page load
//   getRealSpectrum(dye)  → Float32Array | null — real emission vector across nm 300-850
//   hasRealSpectrum(dye)  → Boolean
//   SPECTRA_READY         → Boolean — true after initSpectra() resolves
'use strict';

const FPBASE_ENDPOINT = 'https://www.fpbase.org/graphql/';
const CACHE_KEY = 'panelcanvas_spectra_v2';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 1 week
const SPECTRUM_MIN_NM = 300;
const SPECTRUM_MAX_NM = 850;
const SPECTRUM_STEP_NM = 2; // 2nm resolution → 276 points
const SPECTRUM_LENGTH = Math.round((SPECTRUM_MAX_NM - SPECTRUM_MIN_NM) / SPECTRUM_STEP_NM) + 1;

/* ── FPbase slug mapping ──────────────────────────────────────
   Maps PanelCanvas dye names → FPbase dye/protein slug.
   'dye' prefix = small molecule dye endpoint
   'protein' prefix = fluorescent protein endpoint
   ─────────────────────────────────────────────────────────── */
const FPBASE_MAP = {
  // ── Small molecule / organic dyes ──────────────────────────
  'FITC':               { type:'dye', slug:'fitc' },
  'CFSE':               { type:'dye', slug:'cfse' },
  'CellTrace CFSE':     { type:'dye', slug:'cfse' },
  'DAPI':               { type:'dye', slug:'dapi' },
  'Hoechst 33342':      { type:'dye', slug:'hoechst-33342' },
  'PI':                 { type:'dye', slug:'propidium-iodide' },
  '7-AAD':              { type:'dye', slug:'7-aad' },
  'TO-PRO-3':           { type:'dye', slug:'to-pro-3' },
  'Pacific Blue':       { type:'dye', slug:'pacific-blue' },
  'Pacific Orange':     { type:'dye', slug:'pacific-orange' },
  'PerCP':              { type:'dye', slug:'peridinin-chlorophyll-protein' },
  'PerCP-Cy5.5':        { type:'dye', slug:'percp-cy5-5' },
  'PE':                 { type:'dye', slug:'r-phycoerythrin' },
  'R-PE':               { type:'dye', slug:'r-phycoerythrin' },
  'APC':                { type:'dye', slug:'allophycocyanin' },
  'PE-Cy5':             { type:'dye', slug:'pe-cy5' },
  'PE-Cy5.5':           { type:'dye', slug:'pe-cy5-5' },
  'PE-Cy7':             { type:'dye', slug:'pe-cy7' },
  'PE-CF594':           { type:'dye', slug:'pe-cf594' },
  'PE-Texas Red':       { type:'dye', slug:'pe-texas-red' },
  'APC-Cy7':            { type:'dye', slug:'apc-cy7' },
  'APC-H7':             { type:'dye', slug:'apc-h7' },

  // ── Alexa Fluor ─────────────────────────────────────────────
  'Alexa Fluor 488':    { type:'dye', slug:'alexa-fluor-488' },
  'AF488':              { type:'dye', slug:'alexa-fluor-488' },
  'Alexa Fluor 532':    { type:'dye', slug:'alexa-fluor-532' },
  'AF532':              { type:'dye', slug:'alexa-fluor-532' },
  'Alexa Fluor 555':    { type:'dye', slug:'alexa-fluor-555' },
  'AF555':              { type:'dye', slug:'alexa-fluor-555' },
  'Alexa Fluor 594':    { type:'dye', slug:'alexa-fluor-594' },
  'AF594':              { type:'dye', slug:'alexa-fluor-594' },
  'Alexa Fluor 647':    { type:'dye', slug:'alexa-fluor-647' },
  'AF647':              { type:'dye', slug:'alexa-fluor-647' },
  'Alexa Fluor 700':    { type:'dye', slug:'alexa-fluor-700' },
  'AF700':              { type:'dye', slug:'alexa-fluor-700' },
  'Alexa Fluor 750':    { type:'dye', slug:'alexa-fluor-750' },
  'AF750':              { type:'dye', slug:'alexa-fluor-750' },

  // ── Brilliant Violet (BioLegend) ────────────────────────────
  'BV421':              { type:'dye', slug:'brilliant-violet-421' },
  'BV480':              { type:'dye', slug:'brilliant-violet-480' },
  'BV510':              { type:'dye', slug:'brilliant-violet-510' },
  'BV570':              { type:'dye', slug:'brilliant-violet-570' },
  'BV605':              { type:'dye', slug:'brilliant-violet-605' },
  'BV650':              { type:'dye', slug:'brilliant-violet-650' },
  'BV711':              { type:'dye', slug:'brilliant-violet-711' },
  'BV750':              { type:'dye', slug:'brilliant-violet-750' },
  'BV786':              { type:'dye', slug:'brilliant-violet-786' },

  // ── BD Horizon (BUV/BB) ─────────────────────────────────────
  'BUV395':             { type:'dye', slug:'buv395' },
  'BUV496':             { type:'dye', slug:'buv496' },
  'BUV563':             { type:'dye', slug:'buv563' },
  'BUV615':             { type:'dye', slug:'buv615' },
  'BUV661':             { type:'dye', slug:'buv661' },
  'BUV737':             { type:'dye', slug:'buv737' },
  'BUV805':             { type:'dye', slug:'buv805' },
  'BB515':              { type:'dye', slug:'bb515' },
  'BB700':              { type:'dye', slug:'bb700' },

  // ── LIVE/DEAD & Ghost (viability) ───────────────────────────
  'LIVE/DEAD Aqua':     { type:'dye', slug:'live-dead-aqua' },
  'LIVE/DEAD Blue':     { type:'dye', slug:'live-dead-blue' },
  'LIVE/DEAD Near-IR':  { type:'dye', slug:'live-dead-near-ir' },
  'LIVE/DEAD Green':    { type:'dye', slug:'live-dead-green' },
  'LIVE/DEAD Red':      { type:'dye', slug:'live-dead-red' },
  'LIVE/DEAD Far Red':  { type:'dye', slug:'live-dead-far-red' },
  'Zombie Aqua':        { type:'dye', slug:'zombie-aqua' },
  'Zombie Yellow':      { type:'dye', slug:'zombie-yellow' },
  'Zombie Red':         { type:'dye', slug:'zombie-red' },
  'Zombie NIR':         { type:'dye', slug:'zombie-nir' },
  'Ghost Dye Violet 450':{ type:'dye', slug:'ghost-dye-violet-450' },
  'Ghost Dye Violet 510':{ type:'dye', slug:'ghost-dye-violet-510' },

  // ── eFluor / NovaFluor (Thermo) ─────────────────────────────
  'eFluor 450':         { type:'dye', slug:'efluor-450' },
  'eFluor 506':         { type:'dye', slug:'efluor-506' },
  'eFluor 660':         { type:'dye', slug:'efluor-660' },
  'NovaFluor Blue 530': { type:'dye', slug:'novafluor-blue-530' },
  'NovaFluor Blue 555': { type:'dye', slug:'novafluor-blue-555' },
  'NovaFluor Blue 585': { type:'dye', slug:'novafluor-blue-585' },
  'NovaFluor Blue 610': { type:'dye', slug:'novafluor-blue-610' },
  'NovaFluor Blue 660': { type:'dye', slug:'novafluor-blue-660' },
  'NovaFluor Yellow 570':{ type:'dye', slug:'novafluor-yellow-570' },
  'NovaFluor Yellow 610':{ type:'dye', slug:'novafluor-yellow-610' },
  'NovaFluor Red 685':  { type:'dye', slug:'novafluor-red-685' },

  // ── Super Bright (BD) ───────────────────────────────────────
  'Super Bright 436':   { type:'dye', slug:'super-bright-436' },
  'Super Bright 600':   { type:'dye', slug:'super-bright-600' },
  'Super Bright 645':   { type:'dye', slug:'super-bright-645' },
  'Super Bright 702':   { type:'dye', slug:'super-bright-702' },
  'Super Bright 780':   { type:'dye', slug:'super-bright-780' },

  // ── Krome Orange / Pacific ───────────────────────────────────
  'Krome Orange':       { type:'dye', slug:'krome-orange' },

  // ── PE-Fire (BioLegend) ─────────────────────────────────────
  'PE-Fire 640':        { type:'dye', slug:'pe-fire-640' },
  'PE-Fire 700':        { type:'dye', slug:'pe-fire-700' },
  'PE-Fire 744':        { type:'dye', slug:'pe-fire-744' },
  'PE-Fire 810':        { type:'dye', slug:'pe-fire-810' },
  'APC-Fire 750':       { type:'dye', slug:'apc-fire-750' },
  'APC-Fire 810':       { type:'dye', slug:'apc-fire-810' },

  // ── APC-R700 ────────────────────────────────────────────────
  'APC-R700':           { type:'dye', slug:'apc-r700' },

  // ── IRDye ───────────────────────────────────────────────────
  'IRDye 800CW':        { type:'dye', slug:'irdye-800cw' },

  // ── Fluorescent proteins (less common in flow but present) ──
  'mCherry':            { type:'protein', slug:'mcherry' },
  'mStrawberry':        { type:'protein', slug:'mstrawberry' },
  'EGFP':               { type:'protein', slug:'egfp' },
};

/* ── Internal state ─────────────────────────────────────────── */
// Map: dye name → Float32Array of length SPECTRUM_LENGTH (normalized 0-1, 300-850nm at 2nm steps)
const _spectraCache = new Map();
let _ready = false;
let _initPromise = null;

/* ── Spectrum math helpers ──────────────────────────────────── */

/** Linear interpolation of sorted [nm, value] pairs at target nm */
function _interpolate(data, nm) {
  if (!data || data.length === 0) return 0;
  if (nm <= data[0][0]) return data[0][1];
  if (nm >= data[data.length - 1][0]) return data[data.length - 1][1];
  // Binary search
  let lo = 0, hi = data.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (data[mid][0] <= nm) lo = mid; else hi = mid;
  }
  const t = (nm - data[lo][0]) / (data[hi][0] - data[lo][0]);
  return data[lo][1] + t * (data[hi][1] - data[lo][1]);
}

/** Convert FPbase spectrum data (array of [nm, value]) to our fixed vector */
function _toVector(fpbaseData) {
  if (!fpbaseData || fpbaseData.length < 2) return null;
  // Sort by wavelength
  const sorted = [...fpbaseData].sort((a, b) => a[0] - b[0]);
  // Normalize to max=1
  const maxVal = Math.max(...sorted.map(p => p[1]), 1e-9);
  const normed = sorted.map(p => [p[0], p[1] / maxVal]);
  // Sample at our fixed grid
  const vec = new Float32Array(SPECTRUM_LENGTH);
  for (let i = 0; i < SPECTRUM_LENGTH; i++) {
    const nm = SPECTRUM_MIN_NM + i * SPECTRUM_STEP_NM;
    vec[i] = _interpolate(normed, nm);
  }
  return vec;
}

/** Serialize Float32Array to base64 for localStorage */
function _vecToB64(vec) {
  const bytes = new Uint8Array(vec.buffer);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

/** Deserialize base64 to Float32Array */
function _b64ToVec(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Float32Array(bytes.buffer);
}

/* ── LocalStorage cache ─────────────────────────────────────── */
function _loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return {};
    return parsed.data || {};
  } catch { return {}; }
}

function _saveCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch { /* quota exceeded — ignore */ }
}

/* ── FPbase GraphQL fetcher ─────────────────────────────────── */

/**
 * Fetch emission spectra for a batch of dye slugs from FPbase.
 * Returns Map: slug → Float32Array | null
 */
async function _fetchBatch(entries) {
  // Build a batched GraphQL query using aliases
  const dyeEntries    = entries.filter(e => e.type === 'dye');
  const proteinEntries= entries.filter(e => e.type === 'protein');

  let queryParts = [];

  dyeEntries.forEach(({ slug, alias }) => {
    queryParts.push(`
      ${alias}: dye(slug: "${slug}") {
        name
        defaultState {
          spectra { subtype data }
        }
      }`);
  });

  proteinEntries.forEach(({ slug, alias }) => {
    queryParts.push(`
      ${alias}: protein(slug: "${slug}") {
        name
        defaultState {
          spectra { subtype data }
        }
      }`);
  });

  if (!queryParts.length) return new Map();

  const query = `{ ${queryParts.join('\n')} }`;

  let json;
  try {
    const resp = await fetch(FPBASE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    if (!resp.ok) return new Map();
    json = await resp.json();
  } catch {
    return new Map();
  }

  const result = new Map();
  const data = json.data || {};

  [...dyeEntries, ...proteinEntries].forEach(({ slug, alias }) => {
    const entry = data[alias];
    if (!entry) { result.set(slug, null); return; }
    const state = entry.defaultState;
    if (!state) { result.set(slug, null); return; }
    const emSpectrum = (state.spectra || []).find(s => s.subtype === 'EM');
    if (!emSpectrum || !emSpectrum.data) { result.set(slug, null); return; }
    const vec = _toVector(emSpectrum.data);
    result.set(slug, vec);
  });

  return result;
}

/* ── Init ─────────────────────────────────────────────────────  */

/**
 * Initialize the spectra system.
 * Loads from cache, fetches missing dyes from FPbase in batches of 20.
 * Must be called once before scoring. Returns a Promise.
 */
async function initSpectra() {
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    const cached = _loadCache();
    const toFetch = [];

    // Determine what we need to fetch
    const dyeNames = Object.keys(FPBASE_MAP);
    dyeNames.forEach(name => {
      const { type, slug } = FPBASE_MAP[name];
      if (cached[slug] !== undefined) {
        // Load from cache
        if (cached[slug]) {
          try {
            _spectraCache.set(name, _b64ToVec(cached[slug]));
          } catch { /* corrupt cache entry */ }
        }
      } else {
        toFetch.push({ name, type, slug });
      }
    });

    // Fetch missing in batches of 20
    const BATCH_SIZE = 20;
    const newCacheEntries = {};

    for (let i = 0; i < toFetch.length; i += BATCH_SIZE) {
      const batch = toFetch.slice(i, i + BATCH_SIZE);

      // Create safe GraphQL aliases (alphanumeric + underscore only)
      const entries = batch.map(({ name, type, slug }, idx) => ({
        name,
        type,
        slug,
        alias: `dye_${i + idx}`,
      }));

      const results = await _fetchBatch(entries);

      entries.forEach(({ name, slug, alias }) => {
        const vec = results.get(slug) || null;
        if (vec) {
          _spectraCache.set(name, vec);
          newCacheEntries[slug] = _vecToB64(vec);
        } else {
          newCacheEntries[slug] = null; // mark as not found so we don't retry
        }
      });

      // Small delay between batches to be polite to FPbase
      if (i + BATCH_SIZE < toFetch.length) {
        await new Promise(r => setTimeout(r, 150));
      }
    }

    // Update localStorage cache
    const mergedCache = { ...cached, ...newCacheEntries };
    _saveCache(mergedCache);

    _ready = true;
    window.SPECTRA_READY = true;

    const hitCount = _spectraCache.size;
    const totalCount = dyeNames.length;
    console.log(`[PanelCanvas] Spectra ready: ${hitCount}/${totalCount} dyes have real spectra from FPbase`);
  })();

  return _initPromise;
}

/* ── Public accessors ───────────────────────────────────────── */

/**
 * Returns the real emission spectrum vector for a dye name,
 * or null if not available (will fall back to Gaussian in scoring.js).
 * Vector is Float32Array of length SPECTRUM_LENGTH, 300-850nm at 2nm steps, normalized 0-1.
 */
function getRealSpectrum(dyeName) {
  return _spectraCache.get(dyeName) || null;
}

function hasRealSpectrum(dyeName) {
  return _spectraCache.has(dyeName) && _spectraCache.get(dyeName) !== null;
}

/**
 * Returns the wavelength (nm) for a given vector index.
 */
function vecIndexToNm(i) {
  return SPECTRUM_MIN_NM + i * SPECTRUM_STEP_NM;
}

/**
 * Project a real spectrum vector onto instrument detector centers.
 * Returns array of floats (one per detector), normalized.
 */
function projectOntoDetectors(vec, detectors) {
  if (!vec || !detectors || !detectors.length) return null;
  return detectors.map(det => {
    const nm = det.center;
    const idx = Math.round((nm - SPECTRUM_MIN_NM) / SPECTRUM_STEP_NM);
    if (idx < 0 || idx >= SPECTRUM_LENGTH) return 0;
    // Average over ±bandwidth/2
    const halfBw = Math.round((det.width || det.bandwidth || 20) / 2 / SPECTRUM_STEP_NM);
    let sum = 0, count = 0;
    for (let i = Math.max(0, idx - halfBw); i <= Math.min(SPECTRUM_LENGTH - 1, idx + halfBw); i++) {
      sum += vec[i]; count++;
    }
    return count ? sum / count : 0;
  });
}

/**
 * Force-clear localStorage cache (for debugging / manual refresh).
 */
function clearSpectraCache() {
  localStorage.removeItem(CACHE_KEY);
  _spectraCache.clear();
  _ready = false;
  _initPromise = null;
  window.SPECTRA_READY = false;
}

/* ── Export ─────────────────────────────────────────────────── */
window.SPECTRA_READY       = false;
window.SPECTRUM_MIN_NM     = SPECTRUM_MIN_NM;
window.SPECTRUM_MAX_NM     = SPECTRUM_MAX_NM;
window.SPECTRUM_STEP_NM    = SPECTRUM_STEP_NM;
window.SPECTRUM_LENGTH     = SPECTRUM_LENGTH;
window.FPBASE_MAP          = FPBASE_MAP;

window.initSpectra         = initSpectra;
window.getRealSpectrum     = getRealSpectrum;
window.hasRealSpectrum     = hasRealSpectrum;
window.vecIndexToNm        = vecIndexToNm;
window.projectOntoDetectors = projectOntoDetectors;
window.clearSpectraCache   = clearSpectraCache;
