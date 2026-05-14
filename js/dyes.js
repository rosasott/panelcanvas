// PanelCanvas — Dye Database
// Each dye defines:
//   excite   : canonical laser (UV/V/B/YG/R)
//   peak     : emission peak wavelength (nm)
//   sigma    : emission bandwidth (nm, ~1σ of Gaussian)
//   bleed    : cross-laser excitation for tandem dyes { laser: {peak, weight, sigma?} }
//   brightness: very-high / high / medium / low (for antigen density matching)
//   category : dye family label
//   color    : approximate hex color for UI swatch

const DYES = {

  // ── UV-excited (355 nm) ─────────────────────────────────────
  'BUV395':        { excite:'UV', peak:395, sigma:38, brightness:'very-high', category:'BUV', color:'#6A4CB5' },
  'BUV496':        { excite:'UV', peak:496, sigma:40, brightness:'high',      category:'BUV', color:'#3D6FBF' },
  'BUV563':        { excite:'UV', peak:563, sigma:45, brightness:'high',      category:'BUV', color:'#4E9E6B' },
  'BUV615':        { excite:'UV', peak:615, sigma:45, brightness:'high',      category:'BUV', color:'#C08B2A' },
  'BUV661':        { excite:'UV', peak:661, sigma:48, brightness:'high',      category:'BUV', color:'#C05050' },
  'BUV737':        { excite:'UV', peak:737, sigma:55, brightness:'medium',    category:'BUV', color:'#A03060' },
  'BUV805':        { excite:'UV', peak:805, sigma:60, brightness:'medium',    category:'BUV', color:'#702080' },
  'LIVE/DEAD UV':  { excite:'UV', peak:448, sigma:42, brightness:'high',      category:'Viability', color:'#4060A0' },

  // ── Violet-excited (405 nm) ─────────────────────────────────
  'BV421':         { excite:'V', peak:421, sigma:35, brightness:'very-high', category:'BV', color:'#6040D0' },
  'BV480':         { excite:'V', peak:478, sigma:38, brightness:'high',      category:'BV', color:'#3060C0' },
  'BV510':         { excite:'V', peak:510, sigma:40, brightness:'high',      category:'BV', color:'#2880B0' },
  'BV570':         { excite:'V', peak:570, sigma:40, brightness:'high',      category:'BV', color:'#508040' },
  'BV605':         { excite:'V', peak:605, sigma:45, brightness:'high',      category:'BV', color:'#C07020' },
  'BV650':         { excite:'V', peak:650, sigma:45, brightness:'high',      category:'BV', color:'#C04040' },
  'BV711':         { excite:'V', peak:711, sigma:50, brightness:'medium',    category:'BV', color:'#A02860' },
  'BV750':         { excite:'V', peak:750, sigma:50, brightness:'medium',    category:'BV', color:'#802870' },
  'BV786':         { excite:'V', peak:786, sigma:55, brightness:'medium',    category:'BV', color:'#602080' },
  'BV421 Viability': { excite:'V', peak:430, sigma:40, brightness:'high',   category:'Viability', color:'#5040A0' },

  // ── Blue-excited (488 nm) ───────────────────────────────────
  'FITC':          { excite:'B', peak:519, sigma:40, brightness:'medium',    category:'Classic', color:'#30A040' },
  'BB515':         { excite:'B', peak:515, sigma:38, brightness:'high',      category:'BB', color:'#28A038' },
  'PerCP':         { excite:'B', peak:675, sigma:50, brightness:'low',       category:'Classic', color:'#808020' },
  'PerCP-Cy5.5':   { excite:'B', peak:695, sigma:52, brightness:'medium',    category:'Classic', color:'#909010',
                     bleed:{R:{peak:695,weight:0.12}} },
  'BB630':         { excite:'B', peak:630, sigma:45, brightness:'medium',    category:'BB', color:'#B04020' },
  'BB660':         { excite:'B', peak:660, sigma:45, brightness:'medium',    category:'BB', color:'#C03020' },
  'BB700':         { excite:'B', peak:700, sigma:48, brightness:'high',      category:'BB', color:'#A02020' },
  'BB790':         { excite:'B', peak:790, sigma:55, brightness:'medium',    category:'BB', color:'#701820',
                     bleed:{YG:{peak:790,weight:0.15},R:{peak:790,weight:0.20}} },
  'SPiDER Green':  { excite:'B', peak:515, sigma:42, brightness:'high',      category:'Viability', color:'#20B040' },
  'DAPI':          { excite:'UV', peak:461, sigma:50, brightness:'high',     category:'Viability', color:'#3050D0' },
  '7-AAD':         { excite:'B', peak:647, sigma:55, brightness:'medium',    category:'Viability', color:'#A03050' },

  // ── Yellow-Green-excited (561 nm) ───────────────────────────
  'PE':            { excite:'YG', peak:578, sigma:38, brightness:'very-high', category:'Classic', color:'#E08020',
                     bleed:{B:{peak:578,weight:0.08}} },
  'PE-CF594':      { excite:'YG', peak:612, sigma:45, brightness:'high',      category:'PE-tandem', color:'#C04820',
                     bleed:{B:{peak:612,weight:0.05}} },
  'PE-Dazzle594':  { excite:'YG', peak:610, sigma:44, brightness:'high',      category:'PE-tandem', color:'#C85020',
                     bleed:{B:{peak:610,weight:0.05}} },
  'PE-Cy5':        { excite:'YG', peak:667, sigma:50, brightness:'medium',    category:'PE-tandem', color:'#A04030',
                     bleed:{R:{peak:667,weight:0.22},B:{peak:667,weight:0.08}} },
  'PE-Cy5.5':      { excite:'YG', peak:695, sigma:52, brightness:'medium',    category:'PE-tandem', color:'#903030',
                     bleed:{R:{peak:695,weight:0.18},B:{peak:695,weight:0.07}} },
  'PE-Cy7':        { excite:'YG', peak:785, sigma:60, brightness:'medium',    category:'PE-tandem', color:'#702060',
                     bleed:{R:{peak:785,weight:0.18},B:{peak:785,weight:0.12}} },

  // ── Red-excited (638 nm) ────────────────────────────────────
  'APC':           { excite:'R', peak:660, sigma:44, brightness:'very-high', category:'Classic', color:'#E02020' },
  'AF647':         { excite:'R', peak:665, sigma:44, brightness:'high',      category:'AF', color:'#D02828' },
  'APC-R700':      { excite:'R', peak:723, sigma:50, brightness:'high',      category:'APC-tandem', color:'#A01830' },
  'AF700':         { excite:'R', peak:723, sigma:50, brightness:'high',      category:'AF', color:'#981828' },
  'APC-Cy7':       { excite:'R', peak:785, sigma:60, brightness:'medium',    category:'APC-tandem', color:'#701028',
                     bleed:{YG:{peak:785,weight:0.10}} },
  'APC-H7':        { excite:'R', peak:782, sigma:58, brightness:'medium',    category:'APC-tandem', color:'#681028',
                     bleed:{YG:{peak:782,weight:0.10}} },
  'AF750':         { excite:'R', peak:775, sigma:55, brightness:'medium',    category:'AF', color:'#781020' },

  // ── LIVE/DEAD variants ──────────────────────────────────────
  'Zombie NIR':    { excite:'R',  peak:780, sigma:58, brightness:'high',     category:'Viability', color:'#601830' },
  'Zombie Aqua':   { excite:'UV', peak:516, sigma:42, brightness:'high',     category:'Viability', color:'#2090B0' },
  'Zombie Green':  { excite:'UV', peak:535, sigma:42, brightness:'high',     category:'Viability', color:'#30A060' },
  'LIVE/DEAD Aqua':{ excite:'UV', peak:517, sigma:42, brightness:'high',     category:'Viability', color:'#2088B0' },
  'LIVE/DEAD NIR': { excite:'R',  peak:780, sigma:58, brightness:'high',     category:'Viability', color:'#581828' },
};

// ── Brightness rank (for antigen density recommendations) ────────────────────
const BRIGHTNESS_RANK = { 'very-high':4, 'high':3, 'medium':2, 'low':1 };

// ── Dye to laser lookup ──────────────────────────────────────────────────────
function getDyeLaser(dyeName) {
  return DYES[dyeName] ? DYES[dyeName].excite : null;
}

// Approximate display color for a dye (used in swatches)
function getDyeColor(dyeName) {
  return DYES[dyeName] ? DYES[dyeName].color : '#888';
}

// Get sorted dye names optionally filtered by excitation laser
function getDyeNames(laser = null) {
  return Object.keys(DYES)
    .filter(n => !laser || DYES[n].excite === laser)
    .sort();
}

// Get dye brightness rank
function getBrightnessRank(dyeName) {
  const dye = DYES[dyeName];
  return dye ? (BRIGHTNESS_RANK[dye.brightness] || 0) : 0;
}
