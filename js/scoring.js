// PanelCanvas — Scoring & Validation Logic (v3 — BD pairing logic)

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
  if (si >= 0.95)             return { level:'danger',  label:'Indistinguishable', cssClass:'si-danger' };
  if (si >= threshold)        return { level:'warn',    label:'High conflict',     cssClass:'si-warn'   };
  if (si >= threshold - 0.15) return { level:'caution', label:'Moderate',          cssClass:'si-warn'   };
  return                              { level:'ok',     label:'Compatible',        cssClass:'si-ok'     };
}

// ── Full pairwise matrix with co-expression and bio-status ──────────────────
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
          bioStatus: bio.status,
          bioRelation: bio.relation,
          bioConfidence: bio.confidence
        });
      }
    }
  }
  conflicts.sort((a, b) => {
    if (a.bioStatus !== b.bioStatus) {
      const order = { problematic: 0, unknown: 1, safe: 2 };
      return order[a.bioStatus] - order[b.bioStatus];
    }
    return b.si - a.si;
  });

  const worstSI = {};
  const worstSIBiological = {};
  names.forEach((n, i) => {
    let worst = 0, worstBio = 0;
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

// ── Per-row worst SI ────────────────────────────────────────────────────────
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

// ── Dye suggestions — BD pairing logic ──────────────────────────────────────
// Score = pairing_fit_bonus - biological_SI_penalty - raw_SI_penalty
function suggestDyes(marker, panelItems, instrumentId, limit = 5) {
  const inst = INSTRUMENTS[instrumentId];
  if (!inst) return [];

  const usedDyes = new Set(panelItems.map(p => p.dyeName).filter(Boolean));
  let candidates = Object.keys(DYES).filter(n => !usedDyes.has(n));

  // If the marker requires a specific dye category (e.g. Viability), filter accordingly.
  // This prevents the auto-builder from suggesting BUV805 for a Viability marker, etc.
  if (marker && marker.requiredCategory) {
    candidates = candidates.filter(n => DYES[n].category === marker.requiredCategory);
  }

  const myMarkerName = marker ? marker.name : null;

  const scored = candidates.map(dyeName => {
    const specA = getSpectrum(dyeName, instrumentId);
    if (!specA) return null;

    // Worst SI against panel (biological-aware)
    let maxSI = 0, maxSIBio = 0;
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

    // BD pairing fit (uses spillover + resolution ranks)
    const pairFit = classifyDyeForMarker(dyeName, marker);
    let fitBonus = 0;
    if (pairFit.fit === 'ideal')          fitBonus = 3;
    else if (pairFit.fit === 'acceptable') fitBonus = 1;
    else if (pairFit.fit === 'discouraged') fitBonus = -2;

    // Combined score: pairing fit minus SI penalties
    const score = fitBonus - (maxSIBio * 4) - (maxSI * 0.5);

    return {
      dyeName, maxSI, maxSIBio, score,
      fit: pairFit.fit,
      reason: pairFit.reason,
      spillover: getSpilloverRank(dyeName),
      resolution: getResolutionRank(dyeName)
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
    'Marker,Fluorochrome,Laser,Density,Spillover Rank,Resolution Rank,Worst SI (any),Worst SI (biological)'
  ];
  panelItems.forEach(item => {
    if (!item.marker) return;
    const siAny = item.dyeName ? getWorstSIForDye(item.dyeName, panelItems, instrumentId, false) : '';
    const siBio = item.dyeName ? getWorstSIForDye(item.dyeName, panelItems, instrumentId, true)  : '';
    const dye = DYES[item.dyeName];
    const laser = dye ? dye.excite : '';
    const density = item.marker.density || '';
    const sp = dye ? (dye.spillover || '') : '';
    const res = dye ? (dye.resolution || '') : '';
    lines.push(`"${item.marker.name}","${item.dyeName || ''}","${laser}","${density}","${sp}","${res}","${siAny}","${siBio}"`);
  });
  return lines.join('\n');
}

// ── Auto-builder — BD pairing logic + per-row explanation ──────────────────
function autoBuildPanel(markers, instrumentId, threshold = 0.7, lockedAssignments = {}) {
  const inst = INSTRUMENTS[instrumentId];
  if (!inst) return null;

  // Order: locked first, then by density (low → high; low needs bright dyes assigned first)
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
    if (lockedAssignments[marker.name]) {
      const lockedDye = lockedAssignments[marker.name];
      assignments.push({
        marker, dyeName: lockedDye, locked: true,
        reason: 'User-locked assignment'
      });
      usedDyes.add(lockedDye);
      continue;
    }

    const partialPanel = assignments.map(a => ({ marker: a.marker, dyeName: a.dyeName }));
    const candidates = suggestDyes(marker, partialPanel, instrumentId, 15);
    const fresh = candidates.filter(c => !usedDyes.has(c.dyeName));

    if (fresh.length === 0) {
      assignments.push({
        marker, dyeName: null, locked: false,
        error: 'No compatible dye found',
        reason: 'Ran out of dyes that fit the marker’s density and spillover constraints'
      });
      continue;
    }

    const chosen = fresh[0];
    // Build the explanation
    const siNote = chosen.maxSIBio > 0
      ? ` Worst biological SI vs panel: ${chosen.maxSIBio.toFixed(2)}.`
      : ' No biological conflict with assigned panel.';
    const reason = `${chosen.reason}.${siNote}`;

    assignments.push({
      marker, dyeName: chosen.dyeName, locked: false,
      maxSIBio: chosen.maxSIBio,
      fit: chosen.fit,
      reason,
      spillover: chosen.spillover,
      resolution: chosen.resolution
    });
    usedDyes.add(chosen.dyeName);
  }

  // Restore caller's original order
  const byName = Object.fromEntries(assignments.map(a => [a.marker.name, a]));
  return markers.map(m => byName[m.name]);
}
