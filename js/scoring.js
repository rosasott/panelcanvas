// PanelCanvas — Scoring & Validation Logic

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

// ── Compute full pairwise similarity matrix ──────────────────────────────────
// panelItems: [{ marker, dyeName }]
// instrumentId: string
// Returns: { matrix: N×N Float32, names: string[], conflicts: [...] }
function computePanelMatrix(panelItems, instrumentId, threshold = 0.7) {
  const dyes = panelItems.map(p => p.dyeName).filter(Boolean);
  const names = panelItems.filter(p => p.dyeName).map(p => p.dyeName);
  const N = names.length;

  // Get spectra
  const spectra = names.map(n => getSpectrum(n, instrumentId));

  // N×N matrix
  const matrix = Array.from({length: N}, (_, i) =>
    Array.from({length: N}, (_, j) => {
      if (i === j) return 1;
      if (!spectra[i] || !spectra[j]) return 0;
      return parseFloat(cosineSimilarity(spectra[i], spectra[j]).toFixed(3));
    })
  );

  // Collect conflicts (upper triangle only)
  const conflicts = [];
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const si = matrix[i][j];
      const cls = classifySI(si, threshold);
      if (cls.level !== 'ok') {
        conflicts.push({
          dye1: names[i], dye2: names[j], si,
          level: cls.level, label: cls.label
        });
      }
    }
  }
  conflicts.sort((a, b) => b.si - a.si);

  // Worst SI for each dye (vs any other dye in panel)
  const worstSI = {};
  names.forEach((n, i) => {
    let worst = 0;
    for (let j = 0; j < N; j++) {
      if (i !== j) worst = Math.max(worst, matrix[i][j]);
    }
    worstSI[n] = worst;
  });

  return { matrix, names, conflicts, worstSI };
}

// ── Per-row worst SI (vs current panel) ─────────────────────────────────────
function getWorstSIForDye(dyeName, panelItems, instrumentId) {
  const others = panelItems.filter(p => p.dyeName && p.dyeName !== dyeName);
  if (others.length === 0) return 0;
  const specA = getSpectrum(dyeName, instrumentId);
  if (!specA) return 0;
  let worst = 0;
  for (const o of others) {
    const specB = getSpectrum(o.dyeName, instrumentId);
    if (!specB) continue;
    const si = cosineSimilarity(specA, specB);
    if (si > worst) worst = si;
  }
  return parseFloat(worst.toFixed(3));
}

// ── Dye suggestions (Version A preview) ─────────────────────────────────────
// Given a marker and the current panel, suggest the best fluorochromes.
// Scoring: SI penalty (lower is better) + brightness bonus (match to density)
function suggestDyes(marker, panelItems, instrumentId, limit = 5) {
  const inst = INSTRUMENTS[instrumentId];
  if (!inst) return [];

  // Which dyes are already used?
  const usedDyes = new Set(panelItems.map(p => p.dyeName).filter(Boolean));

  const candidates = Object.keys(DYES).filter(n => !usedDyes.has(n));

  const densityMap = { high: 4, medium: 3, low: 2 };
  const markerDensity = marker ? densityMap[marker.density] || 3 : 3;

  const scored = candidates.map(dyeName => {
    const specA = getSpectrum(dyeName, instrumentId);
    if (!specA) return null;

    // Compute worst SI against current panel
    let maxSI = 0;
    for (const item of panelItems) {
      if (!item.dyeName) continue;
      const specB = getSpectrum(item.dyeName, instrumentId);
      if (!specB) continue;
      const si = cosineSimilarity(specA, specB);
      if (si > maxSI) maxSI = si;
    }

    // Brightness compatibility with antigen density
    const dyeBrightness = getBrightnessRank(dyeName);
    // High density antigen → dim dye OK (no penalty)
    // Low density antigen → needs bright dye (penalty for dim)
    const brightnessScore = markerDensity <= 2
      ? dyeBrightness                     // low density → reward brightness
      : (5 - dyeBrightness) * 0.5 + 2;   // high density → small reward for anything

    // Combined score: lower SI penalty + brightness compatibility
    const siPenalty = maxSI * 3;
    const score = brightnessScore - siPenalty;

    return { dyeName, maxSI, score, brightness: DYES[dyeName].brightness };
  }).filter(Boolean);

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// ── Top conflict detectors for a pair ───────────────────────────────────────
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

// ── Panel export (CSV) ───────────────────────────────────────────────────────
function exportPanelCSV(panelItems, instrumentId, sampleType) {
  const inst = INSTRUMENTS[instrumentId];
  const lines = [
    `# PanelCanvas Export`,
    `# Instrument: ${inst ? inst.name : instrumentId}`,
    `# Sample Type: ${sampleType || 'Not specified'}`,
    `# Date: ${new Date().toLocaleDateString()}`,
    '',
    'Marker,Fluorochrome,Laser,Density,Worst SI,Conflict Level'
  ];
  panelItems.forEach(item => {
    if (!item.marker) return;
    const si = item.dyeName
      ? getWorstSIForDye(item.dyeName, panelItems, instrumentId)
      : '';
    const cls = si !== '' ? classifySI(si).label : '';
    const dye = DYES[item.dyeName];
    const laser = dye ? dye.excite : '';
    const density = item.marker.density || '';
    lines.push(`"${item.marker.name}","${item.dyeName || ''}","${laser}","${density}","${si}","${cls}"`);
  });
  return lines.join('\n');
}
