// scoring.js — PanelCanvas v0.4
// Unified scoring engine.  Branches on instrument.type + active mode:
//
//   spectral / dual-spectral  → cosine similarity (SI) matrix  [unchanged from v0.3]
//   conventional / dual-conv  → detector occupancy + spread table
//
// Public API (all on window):
//   scorePanel(panelRows, instrument, mode)
//     → { pairScores, detectorMap, spreadConflicts, summary }
//
//   getSpectralSI(dyeA, dyeB, instrument)
//     → 0–1  (cosine sim between synthetic emission curves)
//
//   getDetectorForDye(dyeName, instrument)
//     → convDetector object | null
//
//   classifyConvConflict(dyeA, dyeB, instrument)
//     → { level:'none'|'detector'|'spread_high'|'spread_moderate', note }
'use strict';

/* ════════════════════════════════════════════════════════════════
   PART 1 — SPECTRAL SCORING (cosine similarity)
   Unchanged from v0.3.  Generates a synthetic Gaussian emission
   curve for each dye against the instrument's detector array,
   then returns the cosine similarity between two such vectors.
   ════════════════════════════════════════════════════════════════ */

/** Synthetic dye emission parameters.
 *  Peak (nm) and sigma (nm) — approximations for scoring only.
 *  Source: manufacturer spectra viewers + published SSM data.
 */
const DYE_EMISSION = {
  // ── BUV series (UV 355nm) ────────────────────────────────────
  'BUV395':           { peak: 395, sigma: 30 },
  'BUV496':           { peak: 496, sigma: 28 },
  'BUV563':           { peak: 563, sigma: 32 },
  'BUV615':           { peak: 615, sigma: 28 },
  'BUV661':           { peak: 661, sigma: 26 },
  'BUV737':           { peak: 737, sigma: 30 },
  'BUV750':           { peak: 750, sigma: 35 },
  'BUV805':           { peak: 805, sigma: 38 },
  'DAPI':             { peak: 455, sigma: 35 },
  'Hoechst 33342':    { peak: 460, sigma: 40 },
  // ── BV / Super Bright series (Violet 405nm) ──────────────────
  'BV421':            { peak: 421, sigma: 20 },
  'Super Bright 436': { peak: 436, sigma: 22 },
  'eFluor450':        { peak: 450, sigma: 22 },
  'Ghost Violet 450': { peak: 450, sigma: 25 },
  'LIVE/DEAD Aqua':   { peak: 517, sigma: 35 },
  'LIVE/DEAD Blue':   { peak: 446, sigma: 28 },
  'Pacific Blue':     { peak: 455, sigma: 25 },
  'BV480':            { peak: 480, sigma: 22 },
  'Super Bright 480': { peak: 480, sigma: 24 },
  'BV510':            { peak: 510, sigma: 25 },
  'Super Bright 600': { peak: 600, sigma: 30 },
  'BV570':            { peak: 570, sigma: 22 },
  'BV605':            { peak: 605, sigma: 22 },
  'BV650':            { peak: 650, sigma: 22 },
  'BV711':            { peak: 711, sigma: 26 },
  'BV786':            { peak: 786, sigma: 32 },
  'LIVE/DEAD Near-IR':{ peak: 752, sigma: 40 },
  'Ghost Near-IR':    { peak: 755, sigma: 40 },
  // ── cFluor / NovaFluor / StarBright / Spark (Cytek) ─────────
  'cFluor V450':      { peak: 450, sigma: 22 },
  'cFluor V547':      { peak: 547, sigma: 24 },
  'NovaFluor Blue 510':{ peak: 510, sigma: 22 },
  'NovaFluor Blue 610':{ peak: 610, sigma: 26 },
  'NovaFluor Yellow 570':{ peak: 570, sigma: 22 },
  'NovaFluor Yellow 610':{ peak: 610, sigma: 24 },
  'NovaFluor Red 685': { peak: 685, sigma: 22 },
  'StarBright Violet 840':{ peak: 840, sigma: 40 },
  'Spark Blue 550':   { peak: 550, sigma: 24 },
  'Spark NIR 685':    { peak: 685, sigma: 26 },
  // ── FITC / Blue-laser excited ────────────────────────────────
  'FITC':             { peak: 519, sigma: 35 },
  'Alexa Fluor 488':  { peak: 519, sigma: 35 },
  'AF488':            { peak: 519, sigma: 35 },
  'BB515':            { peak: 515, sigma: 20 },
  'CFSE':             { peak: 517, sigma: 30 },
  'CellTrace CFSE':   { peak: 517, sigma: 30 },
  'PerCP':            { peak: 678, sigma: 20 },
  'PerCP-Cy5.5':      { peak: 695, sigma: 24 },
  'BB700':            { peak: 700, sigma: 26 },
  // ── PE and PE-tandems (YG 561nm) ────────────────────────────
  'PE':               { peak: 578, sigma: 30 },
  'R-PE':             { peak: 578, sigma: 30 },
  'mCherry':          { peak: 610, sigma: 30 },
  'mStrawberry':      { peak: 596, sigma: 28 },
  'PE-CF594':         { peak: 612, sigma: 28 },
  'PE-Texas Red':     { peak: 615, sigma: 28 },
  'PE-Cy5':           { peak: 667, sigma: 26 },
  '7-AAD':            { peak: 647, sigma: 38 },
  'PE-Cy5.5':         { peak: 695, sigma: 28 },
  'PE-Cy7':           { peak: 785, sigma: 35 },
  // ── APC / Red-laser excited ──────────────────────────────────
  'APC':              { peak: 660, sigma: 26 },
  'Alexa Fluor 647':  { peak: 668, sigma: 26 },
  'AF647':            { peak: 668, sigma: 26 },
  'APC-R700':         { peak: 700, sigma: 26 },
  'Alexa Fluor 700':  { peak: 723, sigma: 30 },
  'AF700':            { peak: 723, sigma: 30 },
  'APC-Cy7':          { peak: 785, sigma: 35 },
  'APC-H7':           { peak: 785, sigma: 35 },
  // ── Northern Lights / KIRAVIA / Vio / eFluor / Tonbo ────────
  'Northern Lights 637':{ peak: 637, sigma: 26 },
  'Northern Lights 557':{ peak: 557, sigma: 24 },
  'KIRAVIA Blue 520': { peak: 520, sigma: 22 },
  'Vio Bright B515':  { peak: 515, sigma: 20 },
  'Vio 515':          { peak: 515, sigma: 20 },
  'Vio 667':          { peak: 667, sigma: 22 },
  'eFluor 660':       { peak: 660, sigma: 26 },
  'Tonbo 780':        { peak: 780, sigma: 32 },
  // ── PE-Fire / APC-Fire ───────────────────────────────────────
  'PE-Fire 640':      { peak: 640, sigma: 28 },
  'PE-Fire 700':      { peak: 700, sigma: 28 },
  'PE-Fire 744':      { peak: 744, sigma: 30 },
  'PE-Fire 810':      { peak: 810, sigma: 38 },
  'APC-Fire 750':     { peak: 750, sigma: 32 },
  'APC-Fire 810':     { peak: 810, sigma: 38 },
  // ── Zombie / Ghost / LIVE-DEAD viability ────────────────────
  'Zombie Aqua':      { peak: 517, sigma: 35 },
  'Zombie Yellow':    { peak: 570, sigma: 38 },
  'Zombie Red':       { peak: 694, sigma: 38 },
  'Zombie NIR':       { peak: 752, sigma: 40 },
  'Ghost Violet 510': { peak: 510, sigma: 28 },
  'Ghost Violet 540': { peak: 540, sigma: 28 },
  'Ghost Red 780':    { peak: 780, sigma: 35 },
  'PI':               { peak: 617, sigma: 32 },
  'TO-PRO-3':         { peak: 661, sigma: 30 },
  // ── IRDye / NIR ──────────────────────────────────────────────
  'IRDye 800CW':      { peak: 794, sigma: 35 },

  // ── BD Horizon Real Dyes (RB/RV/RY/RR series) ───────────────
  // Violet laser (405nm)
  'RV544':  { peak: 544, sigma: 42 },
  'RV828':  { peak: 828, sigma: 55 },
  // Blue laser (488nm)
  'RB545':  { peak: 545, sigma: 40 },
  'RB575':  { peak: 575, sigma: 42 },
  'RB613':  { peak: 613, sigma: 44 },
  'RB670':  { peak: 670, sigma: 46 },
  'RB705':  { peak: 705, sigma: 48 },
  'RB744':  { peak: 744, sigma: 50 },
  'RB780':  { peak: 780, sigma: 52 },
  'RB824':  { peak: 824, sigma: 55 },
  // Yellow-Green laser (561nm)
  'RY586':  { peak: 586, sigma: 40 },
  'RY610':  { peak: 610, sigma: 42 },
  'RY655':  { peak: 655, sigma: 45 },
  'RY703':  { peak: 703, sigma: 48 },
  'RY743':  { peak: 743, sigma: 50 },
  'RY775':  { peak: 775, sigma: 52 },
  // Red laser (638nm)
  'RR688':  { peak: 688, sigma: 44 },
  'R718':   { peak: 718, sigma: 48 },
  'RR745':  { peak: 745, sigma: 50 },
  'RR780':  { peak: 780, sigma: 52 },
  'RR820':  { peak: 820, sigma: 55 },
};

/** Gaussian value at x given peak μ and σ */
function _gauss(x, mu, sigma) {
  return Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
}

/** Build Gaussian emission vector across instrument detector centers (fallback) */
function _gaussianEmissionVector(dyeName, detectors) {
  const params = DYE_EMISSION[dyeName];
  if (!params) return null;
  return detectors.map(d => _gauss(d.center, params.peak, params.sigma));
}

/**
 * Build emission vector for a dye across instrument detector centers.
 * Uses real FPbase spectrum if available (via spectra.js), falls back to Gaussian.
 */
function _emissionVector(dyeName, detectors) {
  // Try real spectrum first (from spectra.js)
  if (window.getRealSpectrum && window.SPECTRA_READY) {
    const realVec = window.getRealSpectrum(dyeName);
    if (realVec && window.projectOntoDetectors) {
      const projected = window.projectOntoDetectors(realVec, detectors);
      if (projected) return projected;
    }
  }
  // Fall back to Gaussian
  return _gaussianEmissionVector(dyeName, detectors);
}

/** Cosine similarity between two vectors */
function _cosine(u, v) {
  if (!u || !v || u.length !== v.length) return 0;
  let dot = 0, magU = 0, magV = 0;
  for (let i = 0; i < u.length; i++) {
    dot  += u[i] * v[i];
    magU += u[i] * u[i];
    magV += v[i] * v[i];
  }
  if (magU === 0 || magV === 0) return 0;
  return dot / (Math.sqrt(magU) * Math.sqrt(magV));
}

/**
 * Returns spectral SI (0–1) between two dyes on a given instrument.
 * Uses real spectra from FPbase when available, Gaussian otherwise.
 * instrument.detectors must be the spectral detector array.
 */
function getSpectralSI(dyeA, dyeB, instrument) {
  const dets = instrument.detectors;
  if (!dets || !dets.length) return 0;
  const u = _emissionVector(dyeA, dets);
  const v = _emissionVector(dyeB, dets);
  return parseFloat(_cosine(u, v).toFixed(4));
}

/* ════════════════════════════════════════════════════════════════
   PART 2 — CONVENTIONAL SCORING
   Detector occupancy: each convDetector slot can hold ONE primary
   dye family.  Two dyes mapping to the same slot → hard conflict.
   Spread table: known-bad pairs regardless of detector slot.
   ════════════════════════════════════════════════════════════════ */

/**
 * Finds the convDetector that owns a dye name (case-insensitive match
 * against primaryDyes array).  Returns detector object or null.
 */
function getDetectorForDye(dyeName, instrument) {
  const dets = instrument.convDetectors || [];
  const name = (dyeName || '').trim().toLowerCase();
  return dets.find(d =>
    d.primaryDyes.some(p => p.toLowerCase() === name)
  ) || null;
}

/**
 * Returns conflict classification for a pair of dyes on a conventional instrument.
 * @returns {level:'none'|'detector'|'spread_high'|'spread_moderate', note:string}
 */
function classifyConvConflict(dyeA, dyeB, instrument) {
  if (!dyeA || !dyeB || dyeA === dyeB) return { level: 'none', note: '' };

  // 1. Same-detector clash (hard conflict)
  const detA = getDetectorForDye(dyeA, instrument);
  const detB = getDetectorForDye(dyeB, instrument);
  if (detA && detB && detA.id === detB.id) {
    return {
      level: 'detector',
      note: `${dyeA} and ${dyeB} both map to the same detector slot (${detA.name} · ${detA.filter}). Only one can be used per panel.`
    };
  }

  // 2. Known-bad pair spread table
  const spread = window.getSpreadConflict
    ? window.getSpreadConflict(dyeA, dyeB)
    : null;

  if (spread) {
    return {
      level: spread.severity === 'high' ? 'spread_high' : 'spread_moderate',
      note: spread.note
    };
  }

  return { level: 'none', note: '' };
}

/* ════════════════════════════════════════════════════════════════
   PART 3 — UNIFIED scorePanel()
   ════════════════════════════════════════════════════════════════ */

/**
 * Score an entire panel for the given instrument + mode.
 *
 * @param {Array}  panelRows  — [{marker, fluorochrome, density, ...}, ...]
 * @param {Object} instrument — from INSTRUMENTS
 * @param {string} mode       — 'spectral' | 'conventional'
 * @returns {Object} result
 *   .pairScores[]    — [{markerA, markerB, dyeA, dyeB, si, convLevel, note, bioClass}]
 *   .detectorMap{}   — {detectorId → [dyeNames]} (conventional only)
 *   .detectorClashes[]— [{detector, dyes}] (conventional only)
 *   .spreadConflicts[]— [{dyeA, dyeB, severity, note}] (conventional only)
 *   .summary         — {totalPairs, conflictCount, warnCount, worstSI, worstPair}
 */
function scorePanel(panelRows, instrument, mode) {
  const activeMode = mode || instrument.defaultMode || instrument.type;
  const isConventional = (activeMode === 'conventional');

  // Filter to rows with a fluorochrome assigned
  const rows = (panelRows || []).filter(r => r.fluorochrome && r.fluorochrome !== '—');

  const pairScores = [];
  let worstSI  = 0;
  let worstPair = null;
  let conflictCount = 0;
  let warnCount = 0;

  // ── pairwise scoring ────────────────────────────────────────
  for (let i = 0; i < rows.length; i++) {
    for (let j = i + 1; j < rows.length; j++) {
      const rA = rows[i], rB = rows[j];
      const dyeA = rA.fluorochrome, dyeB = rB.fluorochrome;

      let si = 0;
      let convLevel = 'none';
      let note = '';

      if (!isConventional) {
        // Spectral mode → SI
        si = getSpectralSI(dyeA, dyeB, instrument);
        if (si > worstSI) { worstSI = si; worstPair = [rA.marker, rB.marker]; }
        if (si >= 0.9) conflictCount++;
        else if (si >= 0.7) warnCount++;
      } else {
        // Conventional mode → detector + spread
        const clash = classifyConvConflict(dyeA, dyeB, instrument);
        convLevel = clash.level;
        note = clash.note;
        if (convLevel === 'detector' || convLevel === 'spread_high') conflictCount++;
        else if (convLevel === 'spread_moderate') warnCount++;
      }

      // Biology-aware classification (from v0.3 — uses window.classifyBioConflict if present)
      let bioClass = 'real';
      if (window.classifyBioConflict) {
        bioClass = window.classifyBioConflict(rA.marker, rB.marker) || 'real';
      }

      pairScores.push({
        markerA: rA.marker, markerB: rB.marker,
        dyeA, dyeB,
        si: isConventional ? null : si,
        convLevel: isConventional ? convLevel : null,
        note: isConventional ? note : '',
        bioClass,
      });
    }
  }

  // ── detector occupancy map (conventional only) ──────────────
  const detectorMap = {};
  const detectorClashes = [];

  if (isConventional) {
    const convDets = instrument.convDetectors || [];
    convDets.forEach(d => { detectorMap[d.id] = []; });

    rows.forEach(r => {
      const det = getDetectorForDye(r.fluorochrome, instrument);
      if (det) {
        if (!detectorMap[det.id]) detectorMap[det.id] = [];
        detectorMap[det.id].push(r.fluorochrome);
      }
    });

    // Find slots with >1 dye
    Object.entries(detectorMap).forEach(([id, dyes]) => {
      if (dyes.length > 1) {
        const det = (instrument.convDetectors || []).find(d => d.id === id);
        detectorClashes.push({ detector: det, dyes });
      }
    });

    // Panel-level spread conflicts
    const dyeNames = rows.map(r => r.fluorochrome);
    const spreadConflicts = window.getSpreadConflictsForPanel
      ? window.getSpreadConflictsForPanel(dyeNames)
      : [];

    return {
      pairScores,
      detectorMap,
      detectorClashes,
      spreadConflicts,
      summary: {
        totalPairs: pairScores.length,
        conflictCount,
        warnCount,
        worstSI: null,
        worstPair: null,
        mode: 'conventional',
      }
    };
  }

  // ── spectral result ─────────────────────────────────────────
  return {
    pairScores,
    detectorMap: {},
    detectorClashes: [],
    spreadConflicts: [],
    summary: {
      totalPairs: pairScores.length,
      conflictCount,
      warnCount,
      worstSI: parseFloat(worstSI.toFixed(4)),
      worstPair,
      mode: 'spectral',
    }
  };
}

/* ════════════════════════════════════════════════════════════════
   PART 4 — DETECTOR OCCUPANCY GRID DATA
   Helper for the conventional UI panel (detector grid view).
   Returns ordered list of detector slots with occupancy status.
   ════════════════════════════════════════════════════════════════ */

/**
 * Returns detector occupancy for rendering the grid.
 * @param {Array}  panelRows
 * @param {Object} instrument
 * @returns {Array} [{detector, assignedDyes[], status:'empty'|'ok'|'clash'}]
 */
function getDetectorOccupancy(panelRows, instrument) {
  const convDets = instrument.convDetectors || [];
  const rows = (panelRows || []).filter(r => r.fluorochrome && r.fluorochrome !== '—');

  // Build dye → detector lookup
  const occupancy = convDets.map(det => {
    const assignedDyes = rows
      .filter(r => {
        const d = getDetectorForDye(r.fluorochrome, instrument);
        return d && d.id === det.id;
      })
      .map(r => ({ marker: r.marker, dye: r.fluorochrome }));

    const status = assignedDyes.length === 0
      ? 'empty'
      : assignedDyes.length === 1 ? 'ok' : 'clash';

    return { detector: det, assignedDyes, status };
  });

  return occupancy;
}

/* ── export to window ───────────────────────────────────────────── */
window.DYE_EMISSION            = DYE_EMISSION;
window.getSpectralSI           = getSpectralSI;
window.getDetectorForDye       = getDetectorForDye;
window.classifyConvConflict    = classifyConvConflict;
window.scorePanel              = scorePanel;
window.getDetectorOccupancy    = getDetectorOccupancy;
