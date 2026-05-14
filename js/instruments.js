// PanelCanvas — Instrument Configurations
// Detector IDs match actual FCS channel names (with -A suffix stripped).
// Laser codes: UV=355nm, V=405nm, B=488nm, YG=561nm, R=638nm

const INSTRUMENTS = {

  's6msk': {
    id: 's6msk',
    name: 'MSK S6 Spectral',
    shortName: 'S6',
    institution: 'Memorial Sloan Kettering',
    laserColors: { UV:'#7C6FF7', V:'#4B40C8', B:'#2E7ED4', YG:'#C98A1A', R:'#C93A3A' },
    // Maps canonical laser code → FCS parameter prefix for this instrument
    laserPrefix: { UV:'U', V:'V', B:'B', YG:'G', R:'R' },
    detectors: [
      // UV 355nm array (10 det)
      {id:'U809',laser:'UV',wl:809}, {id:'U736',laser:'UV',wl:736},
      {id:'U695',laser:'UV',wl:695}, {id:'U660',laser:'UV',wl:660},
      {id:'U610',laser:'UV',wl:610}, {id:'U585',laser:'UV',wl:585},
      {id:'U540',laser:'UV',wl:540}, {id:'U515',laser:'UV',wl:515},
      {id:'U446',laser:'UV',wl:446}, {id:'U379',laser:'UV',wl:379},
      // Violet 405nm array (14 det)
      {id:'V845',laser:'V',wl:845}, {id:'V785',laser:'V',wl:785},
      {id:'V750',laser:'V',wl:750}, {id:'V710',laser:'V',wl:710},
      {id:'V680',laser:'V',wl:680}, {id:'V660',laser:'V',wl:660},
      {id:'V615',laser:'V',wl:615}, {id:'V595',laser:'V',wl:595},
      {id:'V576',laser:'V',wl:576}, {id:'V540',laser:'V',wl:540},
      {id:'V510',laser:'V',wl:510}, {id:'V470',laser:'V',wl:470},
      {id:'V450',laser:'V',wl:450}, {id:'V427',laser:'V',wl:427},
      // Blue 488nm array (9 det, SSC excluded)
      {id:'B810',laser:'B',wl:810}, {id:'B750',laser:'B',wl:750},
      {id:'B710',laser:'B',wl:710}, {id:'B675',laser:'B',wl:675},
      {id:'B660',laser:'B',wl:660}, {id:'B602',laser:'B',wl:602},
      {id:'B576',laser:'B',wl:576}, {id:'B537',laser:'B',wl:537},
      {id:'B510',laser:'B',wl:510},
      // Yellow-Green 561nm array (9 det)
      {id:'G825',laser:'YG',wl:825}, {id:'G780',laser:'YG',wl:780},
      {id:'G750',laser:'YG',wl:750}, {id:'G730',laser:'YG',wl:730},
      {id:'G695',laser:'YG',wl:695}, {id:'G670',laser:'YG',wl:670},
      {id:'G660',laser:'YG',wl:660}, {id:'G602',laser:'YG',wl:602},
      {id:'G585',laser:'YG',wl:585},
      // Red 638nm array (6 det)
      {id:'R780',laser:'R',wl:780}, {id:'R730',laser:'R',wl:730},
      {id:'R710',laser:'R',wl:710}, {id:'R680',laser:'R',wl:680},
      {id:'R675',laser:'R',wl:675}, {id:'R660',laser:'R',wl:660}
    ]
  },

  'a5se': {
    id: 'a5se',
    name: 'Symphony A5 SE',
    shortName: 'A5 SE',
    institution: 'Humanitas Research Hospital',
    laserColors: { UV:'#7C6FF7', V:'#4B40C8', B:'#2E7ED4', YG:'#C98A1A', R:'#C93A3A' },
    laserPrefix: { UV:'UV', V:'V', B:'B', YG:'YG', R:'R' },
    detectors: [
      // UV 355nm array (10 det)
      {id:'UV379',laser:'UV',wl:379}, {id:'UV446',laser:'UV',wl:446},
      {id:'UV515',laser:'UV',wl:515}, {id:'UV540',laser:'UV',wl:540},
      {id:'UV585',laser:'UV',wl:585}, {id:'UV610',laser:'UV',wl:610},
      {id:'UV660',laser:'UV',wl:660}, {id:'UV695',laser:'UV',wl:695},
      {id:'UV736',laser:'UV',wl:736}, {id:'UV809',laser:'UV',wl:809},
      // Violet 405nm array (14 det)
      {id:'V427',laser:'V',wl:427}, {id:'V450',laser:'V',wl:450},
      {id:'V470',laser:'V',wl:470}, {id:'V510',laser:'V',wl:510},
      {id:'V540',laser:'V',wl:540}, {id:'V576',laser:'V',wl:576},
      {id:'V595',laser:'V',wl:595}, {id:'V615',laser:'V',wl:615},
      {id:'V660',laser:'V',wl:660}, {id:'V680',laser:'V',wl:680},
      {id:'V710',laser:'V',wl:710}, {id:'V750',laser:'V',wl:750},
      {id:'V785',laser:'V',wl:785}, {id:'V845',laser:'V',wl:845},
      // Blue 488nm array (9 det)
      {id:'B510',laser:'B',wl:510}, {id:'B537',laser:'B',wl:537},
      {id:'B576',laser:'B',wl:576}, {id:'B602',laser:'B',wl:602},
      {id:'B660',laser:'B',wl:660}, {id:'B675',laser:'B',wl:675},
      {id:'B710',laser:'B',wl:710}, {id:'B750',laser:'B',wl:750},
      {id:'B810',laser:'B',wl:810},
      // Yellow-Green 561nm array (9 det)
      {id:'YG585',laser:'YG',wl:585}, {id:'YG602',laser:'YG',wl:602},
      {id:'YG660',laser:'YG',wl:660}, {id:'YG670',laser:'YG',wl:670},
      {id:'YG695',laser:'YG',wl:695}, {id:'YG730',laser:'YG',wl:730},
      {id:'YG750',laser:'YG',wl:750}, {id:'YG780',laser:'YG',wl:780},
      {id:'YG825',laser:'YG',wl:825},
      // Red 638nm array (6 det)
      {id:'R660',laser:'R',wl:660}, {id:'R675',laser:'R',wl:675},
      {id:'R680',laser:'R',wl:680}, {id:'R710',laser:'R',wl:710},
      {id:'R730',laser:'R',wl:730}, {id:'R780',laser:'R',wl:780}
    ]
  }

};

// ── Spectrum Computation ─────────────────────────────────────────────────────
// Computes a normalized emission spectrum vector for a dye on a given instrument.
// Uses Gaussian emission model placed at dye.peak on the primary excitation laser,
// with optional cross-laser bleed for tandem dyes.
// Returns an array of values [0,1] for each detector, normalized so peak = 1.

function computeSpectrum(dye, instrumentId) {
  const inst = INSTRUMENTS[instrumentId];
  if (!inst) return null;

  const vals = inst.detectors.map(det => {
    let val = 0;

    // Primary emission: detector must be on the dye's excitation laser
    if (det.laser === dye.excite) {
      const diff = det.wl - dye.peak;
      val = Math.exp(-(diff * diff) / (2 * dye.sigma * dye.sigma));
    }

    // Cross-laser bleed (tandem dyes excited by secondary lasers)
    if (dye.bleed) {
      for (const [laser, b] of Object.entries(dye.bleed)) {
        if (det.laser === laser) {
          const diff = det.wl - b.peak;
          const contrib = Math.exp(-(diff * diff) / (2 * (b.sigma || dye.sigma) * (b.sigma || dye.sigma))) * b.weight;
          val = Math.max(val, contrib);
        }
      }
    }

    // Small realistic baseline noise on non-primary detectors
    if (val === 0 && Math.random() < 0.15) val = Math.random() * 0.008;

    return val;
  });

  // Normalize to peak = 1.0
  const max = Math.max(...vals);
  return max > 0 ? vals.map(v => parseFloat((v / max).toFixed(4))) : vals;
}

// Cached spectra store: { 'dyeName__instrumentId': Float32Array }
const _spectraCache = {};

function getSpectrum(dyeName, instrumentId) {
  const key = `${dyeName}__${instrumentId}`;
  if (_spectraCache[key]) return _spectraCache[key];
  const dye = DYES[dyeName];
  if (!dye) return null;
  const s = computeSpectrum(dye, instrumentId);
  _spectraCache[key] = s;
  return s;
}

// Utility: get laser color for a laser code
function laserColor(laserCode) {
  const colors = { UV:'#7C6FF7', V:'#4B40C8', B:'#2E7ED4', YG:'#C98A1A', R:'#C93A3A' };
  return colors[laserCode] || '#888';
}

// Utility: get detectors grouped by laser for an instrument
function getDetectorsByLaser(instrumentId) {
  const inst = INSTRUMENTS[instrumentId];
  const grouped = {};
  for (const l of ['UV','V','B','YG','R']) grouped[l] = [];
  inst.detectors.forEach(d => { if (grouped[d.laser]) grouped[d.laser].push(d); });
  return grouped;
}
