// conventional_spread.js — PanelCanvas v0.4
// Static table of fluorochrome pairs with problematic spillover in conventional
// (compensation-based) cytometry. Used when an instrument is in 'conventional' mode.
//
// severity: 'high'     → active conflict, flag red in UI
//           'moderate' → yellow advisory, especially relevant at high antigen density
//
// type:
//   'tandem_degradation'  — shared donor; degraded tandem creates signal in co-tandem channel
//   'detector_overlap'    — two dyes read into essentially the same detector space
//   'compensation_burden' — legitimate pair but spillover is high enough to cause spreading error
//                           in dim populations; warn but don't block
'use strict';

const CONVENTIONAL_SPREAD = [

  /* ══ PE-tandem family — internal degradation ══════════════════
     When two PE-tandems share a panel the PE donor is common.
     Degraded acceptor → free PE → bleeds into co-tandem channels.
     Mixing three PE-tandems is almost always a mistake.
     ═════════════════════════════════════════════════════════════ */
  {
    a: 'PE-Cy5', b: 'PE-Cy5.5', severity: 'high', type: 'tandem_degradation',
    note: 'PE-Cy5 and PE-Cy5.5 share the PE donor. Tandem degradation of either creates false positive signal in the co-tandem channel. Avoid pairing these dyes.'
  },
  {
    a: 'PE-Cy5', b: 'PE-Cy7', severity: 'high', type: 'tandem_degradation',
    note: 'PE-Cy5 degradation products (free PE) spill into the PE-Cy7 detector. Reserve PE-Cy5 or PE-Cy7 for rare, truly abundant antigens only.'
  },
  {
    a: 'PE-Cy5.5', b: 'PE-Cy7', severity: 'high', type: 'tandem_degradation',
    note: 'Both share PE donor. Degradation of either releases PE into the partner channel. High-density antigens partially mask the artifact; dim populations will show false signal.'
  },
  {
    a: 'PE-CF594', b: 'PE-Cy7', severity: 'moderate', type: 'tandem_degradation',
    note: 'PE-CF594 degradation releases free PE that contributes to PE-Cy7 signal. Keep antigen densities high for both if both are necessary.'
  },
  {
    a: 'PE-CF594', b: 'PE-Cy5.5', severity: 'moderate', type: 'tandem_degradation',
    note: 'PE-CF594 degradation → free PE → artefactual signal in PE-Cy5.5 channel. Acceptable if both antigens are truly abundant.'
  },
  {
    a: 'PE-CF594', b: 'PE-Cy5', severity: 'moderate', type: 'tandem_degradation',
    note: 'PE-CF594 and PE-Cy5 share the PE acceptor-donor axis. Degradation products overlap.'
  },

  /* ══ PE: direct spillover ═════════════════════════════════════ */
  {
    a: 'PE', b: 'PE-CF594', severity: 'moderate', type: 'compensation_burden',
    note: 'PE spills approximately 40% into the PE-CF594 (610/20) detector. Compensation required is high and creates significant spreading error in dim populations. Reserve PE for high-density antigens.'
  },
  {
    a: 'PE', b: 'PE-Cy5', severity: 'moderate', type: 'compensation_burden',
    note: 'PE spills ~5-10% into the PE-Cy5 (670/30) detector. Acceptable with titration; flag for dim antigens.'
  },

  /* ══ APC-tandem family ════════════════════════════════════════ */
  {
    a: 'APC', b: 'APC-Cy7', severity: 'moderate', type: 'tandem_degradation',
    note: 'APC-Cy7 degrades to free APC, increasing background in the APC channel. Especially problematic with fixation protocols. Use APC for the lower-density antigen.'
  },
  {
    a: 'APC', b: 'APC-H7', severity: 'moderate', type: 'tandem_degradation',
    note: 'Same mechanism as APC/APC-Cy7. APC-H7 is a tandem that degrades to its APC donor. Fixation accelerates degradation.'
  },
  {
    a: 'APC-Cy7', b: 'APC-H7', severity: 'moderate', type: 'detector_overlap',
    note: 'APC-Cy7 and APC-H7 have near-identical emission spectra and map to the same detector slot. Using both in one panel is not meaningful; pick one.'
  },

  /* ══ PerCP family ════════════════════════════════════════════ */
  {
    a: 'PerCP', b: 'PerCP-Cy5.5', severity: 'moderate', type: 'detector_overlap',
    note: 'PerCP (peak ~678 nm) and PerCP-Cy5.5 (peak ~695 nm) have overlapping emission in the 695/40 detector. Both are on 488nm; only one can be practically used per panel.'
  },

  /* ══ BV cascade: adjacent-detector spillover ═════════════════ */
  {
    a: 'BV421', b: 'BV510', severity: 'moderate', type: 'compensation_burden',
    note: 'BV421 has a broad emission tail that spills ~15-20% into the BV510 (524/32) detector. Compensation is routine but creates spreading error proportional to BV421 brightness. Assign high-density antigen to BV421 when pairing.'
  },
  {
    a: 'BV510', b: 'BV570', severity: 'moderate', type: 'compensation_burden',
    note: 'BV510 tail extends into the BV570 (575/26) detector. Moderate compensation burden; manageable with titration.'
  },
  {
    a: 'BV570', b: 'BV605', severity: 'moderate', type: 'compensation_burden',
    note: 'BV570 and BV605 are spectrally adjacent under 405nm excitation. Reciprocal spillover creates spreading error; separate dim antigens from these dyes.'
  },
  {
    a: 'BV605', b: 'BV650', severity: 'moderate', type: 'compensation_burden',
    note: 'BV605 spills into BV650 (655/20). The narrow 655/20 filter helps but spillover remains ~15%. Avoid dim:dim pairing of these dyes.'
  },
  {
    a: 'BV650', b: 'BV711', severity: 'moderate', type: 'compensation_burden',
    note: 'BV650 and BV711 are adjacent in the far-red region under 405nm. Moderate spillover; avoid using both for dim antigens.'
  },
  {
    a: 'BV711', b: 'BV786', severity: 'moderate', type: 'compensation_burden',
    note: 'BV711 tail reaches the BV786 (810/30) detector. Compensation required; BV786 should carry a high-density antigen when BV711 is also in the panel.'
  },

  /* ══ BUV → BV cross-laser spillover ═════════════════════════ */
  {
    a: 'BUV395', b: 'BV421', severity: 'moderate', type: 'compensation_burden',
    note: 'BUV395 (UV-excited, peak 395nm) emission tail extends into the violet BV421 (450/40) detector. Cross-laser spillover of ~5-10%; requires UV/V compensation. Use a spectrally distinct viability dye if both are in the panel.'
  },
  {
    a: 'BUV496', b: 'BV510', severity: 'moderate', type: 'compensation_burden',
    note: 'BUV496 (UV-excited, peak 496nm) spills into the BV510 (524/32) detector from the other laser line. Manageable but compensation matrix must include UV→V cross-channel terms.'
  },
  {
    a: 'BUV496', b: 'FITC', severity: 'moderate', type: 'compensation_burden',
    note: 'BUV496 emission overlaps with the FITC (530/30) detector window. The UV→Blue cross-laser spillover adds to the compensation burden; UV-off FITC compensation is typically required.'
  },

  /* ══ FITC ↔ PE classic pair ══════════════════════════════════ */
  {
    a: 'FITC', b: 'PE', severity: 'moderate', type: 'compensation_burden',
    note: 'FITC spills ~5-8% into the PE (586/15) detector. PE spills <1% back into FITC. Classic pairing that is workable but creates spreading error proportional to FITC MFI. Avoid if both antigens are dim.'
  },

  /* ══ PerCP-Cy5.5 ↔ PE-Cy7 ═══════════════════════════════════ */
  {
    a: 'PerCP-Cy5.5', b: 'PE-Cy7', severity: 'moderate', type: 'compensation_burden',
    note: 'PerCP-Cy5.5 (488nm-excited, ~695nm peak) and PE-Cy7 (561nm-excited, ~785nm peak) have detectors close together in wavelength space. Moderate reciprocal spillover; watch for splitting error in dim populations.'
  },

  /* ══ Tandem + viability combinations ════════════════════════ */
  {
    a: 'DAPI', b: 'Hoechst 33342', severity: 'high', type: 'detector_overlap',
    note: 'DAPI and Hoechst 33342 are both UV-excited DNA intercalators with nearly identical emission spectra. Using both in the same panel is functionally redundant and one will occupy the BUV395 detector slot to the exclusion of the other.'
  },
  {
    a: 'LIVE/DEAD Aqua', b: 'BV421', severity: 'moderate', type: 'detector_overlap',
    note: 'LIVE/DEAD Aqua (405nm, amine-reactive, ~517nm peak) can spill into the BV421 (450/40) channel depending on staining intensity. Consider using LIVE/DEAD Blue or a BUV viability dye instead.'
  },
  {
    a: 'Ghost Violet 450', b: 'BV421', severity: 'high', type: 'detector_overlap',
    note: 'Ghost Violet 450 and BV421 both read in the 450/40 detector under 405nm excitation. They cannot be used together as separate markers — one will mask the other.'
  },
  {
    a: 'eFluor450', b: 'BV421', severity: 'high', type: 'detector_overlap',
    note: 'eFluor450 and BV421 share the same detector slot (450/40 under 405nm). Functionally identical emission; cannot both be used as separate channels in one panel.'
  },

];

/* ── lookup helpers ─────────────────────────────────────────────
   Exposed as globals for use by scoring.js and panel-builder.html
   ────────────────────────────────────────────────────────────── */

/**
 * Returns the spread table entry for a pair of dyes, or null if not found.
 * Case-insensitive on trimmed name.
 */
function getSpreadConflict(dyeA, dyeB) {
  const a = (dyeA || '').trim().toLowerCase();
  const b = (dyeB || '').trim().toLowerCase();
  if (!a || !b || a === b) return null;
  return CONVENTIONAL_SPREAD.find(r =>
    (r.a.toLowerCase() === a && r.b.toLowerCase() === b) ||
    (r.a.toLowerCase() === b && r.b.toLowerCase() === a)
  ) || null;
}

/**
 * Returns all spread conflicts for a list of dye names.
 * Returns array of { dyeA, dyeB, severity, type, note }
 */
function getSpreadConflictsForPanel(dyeNames) {
  const conflicts = [];
  const names = dyeNames.filter(Boolean);
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      const hit = getSpreadConflict(names[i], names[j]);
      if (hit) conflicts.push({ dyeA: names[i], dyeB: names[j], ...hit });
    }
  }
  return conflicts;
}

// Expose globals
window.CONVENTIONAL_SPREAD        = CONVENTIONAL_SPREAD;
window.getSpreadConflict          = getSpreadConflict;
window.getSpreadConflictsForPanel = getSpreadConflictsForPanel;
