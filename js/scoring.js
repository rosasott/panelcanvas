// PanelCanvas — Scoring & Validation Logic (v2 — co-expression aware)

// ── Cosine Similarity ────────────────────────────────────────────────────────
function cosineSimilarity(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na  += a[i] * a[i];
    nb  += b[i] * b[i];
  }
  return (na && nb) ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0;
}

// ── SI classification ────────────────────────────────────────────────────────
function classifySI(si, threshold = 0.7) {
  if (si >= 0.95)        return { level:'danger', label:'Indistinguishable', cssClass:'si-danger' };
  if (si >= threshold)   return { level:'warn',   label:'High conflict',     cssClass:'si-warn'   };
  if (si >= threshold - 0.15) return { level:'caution', label:'Moderate',   cssClass:'si-warn'   };
  return                        { level:'ok',     label:'Compatible',        cssClass:'si-ok'     };
}

// ── Compute full pairwise similarity matrix with co-expression annotation ──
function computePanelMatrix(panelItems, instrumentId, threshold = 0.7) {
  const validItems = panelItems.filter(p => p.dyeName);
  const names = validItems.map(p => p.dyeName);
  const markerNames = validItems.map(p => p.marker ? p.marker.name : null);
  const N = names.length;

  const spectra = names.map(n => getSpectrum(n, instrumentId));

  const matrix = Array.from({length: N}, (_, i) =>
    Array.from({length: N}, (_, j) => {
      if (i === j) return 1;
      if (!spectra[i] || !spectra[j]) return 0;
      return parseFloat(cosineSimilarity(spectra[i], spectra[j]).toFixed(3));
    })
  );

  // Collect conflicts (upper triangle)
  const conflicts = [];
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const si = matrix[i][j];
      const cls = classifySI(si, threshold);
      if (cls.level !== 'ok') {
        const bio = classifyMarkerPair(markerNames[i], markerNames[j]);
        conflicts.push({
          dye1: names[i], dye2: names[j],
          marker1: markerNames[i], marker2: markerNames[j],
          si, level: cls.level, label: cls.label,
          bioStatus: bio.status,            // 'safe' | 'problematic' | 'unknown'
          bioRelation: bio.relation,        // 'exclusive' | 'subset' | 'co-expressed' | 'independent' | null
          bioConfidence: bio.confidence
        });
      }
    }
  }
  // Sort: problematic conflicts first (highest SI), then safe (lower priority)
  conflicts.sort((a, b) => {
    if (a.bioStatus !== b.bioStatus) {
      const order = { problematic: 0, unknown: 1, safe: 2 };
      return order[a.bioStatus] - order[b.bioStatus];
    }
    return b.si - a.si;
  });

  // Worst SI per dye — but ONLY counts problematic conflicts
  const worstSI = {};
  const worstSIBiological = {};
  names.forEach((n, i) => {
    let worst = 0;
    let worstBio = 0;
    for (let j = 0; j < N; j++) {
      if (i === j) continue;
      const si = matrix[i][j];
      if (si > worst) worst = si;
      const bio = classifyMarkerPair(markerNames[i], markerNames[j]);
      if (bio.status !== 'safe' && si > worstBio) worstBio = si;
    }
    worstSI[n] = worst;
    worstSIBiological[n] = worstBio;
  });

  return { matrix, names, markerNames, conflicts, worstSI, worstSIBiological };
}

// ── Per-row worst SI (now bio-aware) ────────────────────────────────────────
function getWorstSIForDye(dyeName, panelItems, instrumentId, biologicalOnly = false) {
  const validItems = panelItems.filter(p => p.dyeName);
  const idx = validItems.findIndex(p => p.dyeName === dyeName);
  if (idx === -1) return 0;
  const myMarker = validItems[idx].marker ? validItems[idx].marker.name : null;

  const specA = getSpectrum(dyeName, instrumentId);
  if (!specA) return 0;
  let worst = 0;
  for (let i = 0; i < validItems.length; i++) {
    if (i === idx) continue;
    const otherDye = validItems[i].dyeName;
    const otherMarker = validItems[i].marker ? validItems[i].marker.name : null;
    if (biologicalOnly) {
      const bio = classifyMarkerPair(myMarker, otherMarker);
      if (bio.status === 'safe') continue;
    }
    const specB = getSpectrum(otherDye, instrumentId);
    if (!specB) continue;
    const si = cosineSimilarity(specA, specB);
    if (si > worst) worst = si;
  }
  return parseFloat(worst.toFixed(3));
}

// ── Dye suggestions — biology aware ─────────────────────────────────────────
function suggestDyes(marker, panelItems, instrumentId, limit = 5) {
  const inst = INSTRUMENTS[instrumentId];
  if (!inst) return [];

  const usedDyes = new Set(panelItems.map(p => p.dyeName).filter(Boolean));
  const candidates = Object.keys(DYES).filter(n => !usedDyes.has(n));

  const densityMap = { high: 4, medium: 3, low: 2 };
  const markerDensity = marker ? densityMap[marker.density] || 3 : 3;
  const myMarkerName = marker ? marker.name : null;

  const scored = candidates.map(dyeName => {
    const specA = getSpectrum(dyeName, instrumentId);
    if (!specA) return null;

    // Worst SI against panel — but only count biologically-problematic pairs
    let maxSI = 0;
    let maxSIBio = 0;
    for (const item of panelItems) {
      if (!item.dyeName) continue;
      const specB = getSpectrum(item.dyeName, instrumentId);
      if (!specB) continue;
      const si = cosineSimilarity(specA, specB);
      if (si > maxSI) maxSI = si;
      const otherMarkerName = item.marker ? item.marker.name : null;
      const bio = classifyMarkerPair(myMarkerName, otherMarkerName);
      if (bio.status !== 'safe' && si > maxSIBio) maxSIBio = si;
    }

    // Brightness × antigen-density match
    const dyeBrightness = getBrightnessRank(dyeName);
    const brightnessScore = markerDensity <= 2
      ? dyeBrightness
      : (5 - dyeBrightness) * 0.5 + 2;

    // Penalty: biological SI matters more than raw SI
    const siPenalty = maxSIBio * 3.5 + maxSI * 0.5;
    const score = brightnessScore - siPenalty;

    return {
      dyeName, maxSI, maxSIBio, score,
      brightness: DYES[dyeName].brightness
    };
  }).filter(Boolean);

  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}

// ── Conflict hotspots (per-detector overlap) ────────────────────────────────
function getConflictHotspots(dye1, dye2, instrumentId, topN = 5) {
  const inst = INSTRUMENTS[instrumentId];
  const specA = getSpectrum(dye1, instrumentId);
  const specB = getSpectrum(dye2, instrumentId);
  if (!specA || !specB || !inst) return [];

  return inst.detectors
    .map((det, i) => ({ det, overlap: Math.min(specA[i], specB[i]) }))
    .filter(x => x.overlap > 0.08)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, topN);
}

// ── Panel CSV export ────────────────────────────────────────────────────────
function exportPanelCSV(panelItems, instrumentId, sampleType) {
  const inst = INSTRUMENTS[instrumentId];
  const lines = [
    `# PanelCanvas Export`,
    `# Instrument: ${inst ? inst.name : instrumentId}`,
    `# Sample Type: ${sampleType || 'Not specified'}`,
    `# Date: ${new Date().toLocaleDateString()}`,
    '',
    'Marker,Fluorochrome,Laser,Density,Worst SI (any),Worst SI (biologically relevant)'
  ];
  panelItems.forEach(item => {
    if (!item.marker) return;
    const siAny = item.dyeName ? getWorstSIForDye(item.dyeName, panelItems, instrumentId, false) : '';
    const siBio = item.dyeName ? getWorstSIForDye(item.dyeName, panelItems, instrumentId, true)  : '';
    const dye = DYES[item.dyeName];
    const laser = dye ? dye.excite : '';
    const density = item.marker.density || '';
    lines.push(`"${item.marker.name}","${item.dyeName || ''}","${laser}","${density}","${siAny}","${siBio}"`);
  });
  return lines.join('\n');
}

// ── Auto-Builder: assign fluorochromes to markers ──────────────────────────
// Greedy assignment with backtracking. For each marker (sorted by density,
// low density = needs bright dye = assign first), iterate candidate dyes and
// pick the one that minimizes biological SI conflict with already-assigned.
function autoBuildPanel(markers, instrumentId, threshold = 0.7, lockedAssignments = {}) {
  const inst = INSTRUMENTS[instrumentId];
  if (!inst) return null;

  // Order markers: locked first, then by density (low first → need bright dyes)
  const densityRank = { low: 1, medium: 2, high: 3 };
  const ordered = [...markers].sort((a, b) => {
    const aLocked = lockedAssignments[a.name] ? 0 : 1;
    const bLocked = lockedAssignments[b.name] ? 0 : 1;
    if (aLocked !== bLocked) return aLocked - bLocked;
    return (densityRank[a.density] || 2) - (densityRank[b.density] || 2);
  });

  const assignments = [];
  const usedDyes = new Set();

  for (const marker of ordered) {
    // Pre-locked?
    if (lockedAssignments[marker.name]) {
      const lockedDye = lockedAssignments[marker.name];
      assignments.push({ marker, dyeName: lockedDye, locked: true });
      usedDyes.add(lockedDye);
      continue;
    }

    // Build candidate list, score each
    const partialPanel = assignments.map(a => ({
      marker: a.marker, dyeName: a.dyeName
    }));
    const candidates = suggestDyes(marker, partialPanel, instrumentId, 15);

    // Filter candidates already used (shouldn't happen via suggestDyes but defensive)
    const fresh = candidates.filter(c => !usedDyes.has(c.dyeName));
    if (fresh.length === 0) {
      assignments.push({ marker, dyeName: null, locked: false, error: 'No compatible dye found' });
      continue;
    }

    // Pick best (lowest biological SI, but also penalize raw SI to avoid surprises)
    const chosen = fresh[0];
    assignments.push({
      marker, dyeName: chosen.dyeName, locked: false,
      maxSIBio: chosen.maxSIBio
    });
    usedDyes.add(chosen.dyeName);
  }

  // Restore original input order in the returned panel
  const byName = Object.fromEntries(assignments.map(a => [a.marker.name, a]));
  return markers.map(m => byName[m.name]);
}
