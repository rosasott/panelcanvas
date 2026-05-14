// PanelCanvas — Dye Database (v2 — extended catalog)
// Each dye defines:
//   excite     : canonical laser (UV/V/B/YG/R)
//   peak       : emission peak wavelength (nm)
//   sigma      : emission bandwidth (nm, ~1σ of Gaussian)
//   bleed      : cross-laser excitation for tandems { laser: {peak, weight, sigma?} }
//   brightness : very-high / high / medium / low
//   category   : dye family label
//   color      : hex color for UI swatch

const DYES = {

  // ════════════════════════════════════════════════════════════
  // ── UV-excited (355 nm) ─────────────────────────────────────
  // ════════════════════════════════════════════════════════════

  'BUV395':           { excite:'UV', peak:395, sigma:38, brightness:'very-high', category:'BUV', color:'#6A4CB5' },
  'BUV496':           { excite:'UV', peak:496, sigma:40, brightness:'high',      category:'BUV', color:'#3D6FBF' },
  'BUV563':           { excite:'UV', peak:563, sigma:45, brightness:'high',      category:'BUV', color:'#4E9E6B' },
  'BUV615':           { excite:'UV', peak:615, sigma:45, brightness:'high',      category:'BUV', color:'#C08B2A' },
  'BUV661':           { excite:'UV', peak:661, sigma:48, brightness:'high',      category:'BUV', color:'#C05050' },
  'BUV737':           { excite:'UV', peak:737, sigma:55, brightness:'medium',    category:'BUV', color:'#A03060' },
  'BUV805':           { excite:'UV', peak:805, sigma:60, brightness:'medium',    category:'BUV', color:'#702080' },

  // cFluor / StarBright UV (Bio-Rad equivalents)
  'cFluor UV375':     { excite:'UV', peak:375, sigma:36, brightness:'high',      category:'cFluor', color:'#5C46A8' },
  'cFluor UV395':     { excite:'UV', peak:395, sigma:38, brightness:'high',      category:'cFluor', color:'#6A4CB5' },
  'cFluor UV440':     { excite:'UV', peak:440, sigma:40, brightness:'high',      category:'cFluor', color:'#5060B0' },
  'cFluor UV515':     { excite:'UV', peak:515, sigma:42, brightness:'high',      category:'cFluor', color:'#3080A0' },
  'cFluor UV570':     { excite:'UV', peak:570, sigma:42, brightness:'high',      category:'cFluor', color:'#509060' },
  'cFluor UV610':     { excite:'UV', peak:610, sigma:45, brightness:'high',      category:'cFluor', color:'#A07820' },
  'cFluor UV670':     { excite:'UV', peak:670, sigma:48, brightness:'high',      category:'cFluor', color:'#B05050' },
  'cFluor UV745':     { excite:'UV', peak:745, sigma:55, brightness:'medium',    category:'cFluor', color:'#A03868' },
  'cFluor UV790':     { excite:'UV', peak:790, sigma:58, brightness:'medium',    category:'cFluor', color:'#702080' },

  // StarBright UltraViolet (Bio-Rad)
  'SBUV 400':         { excite:'UV', peak:400, sigma:38, brightness:'high',      category:'StarBright', color:'#6948B0' },
  'SBUV 445':         { excite:'UV', peak:445, sigma:40, brightness:'high',      category:'StarBright', color:'#5060B0' },
  'SBUV 510':         { excite:'UV', peak:510, sigma:42, brightness:'high',      category:'StarBright', color:'#3080A0' },
  'SBUV 575':         { excite:'UV', peak:575, sigma:44, brightness:'high',      category:'StarBright', color:'#509060' },
  'SBUV 605':         { excite:'UV', peak:605, sigma:45, brightness:'high',      category:'StarBright', color:'#A07820' },
  'SBUV 665':         { excite:'UV', peak:665, sigma:48, brightness:'high',      category:'StarBright', color:'#B05050' },
  'SBUV 740':         { excite:'UV', peak:740, sigma:55, brightness:'medium',    category:'StarBright', color:'#A03868' },
  'SBUV 795':         { excite:'UV', peak:795, sigma:58, brightness:'medium',    category:'StarBright', color:'#702080' },

  // ════════════════════════════════════════════════════════════
  // ── Violet-excited (405 nm) ─────────────────────────────────
  // ════════════════════════════════════════════════════════════

  // Brilliant Violet (Sirigen / BD / BioLegend)
  'BV421':            { excite:'V', peak:421, sigma:35, brightness:'very-high', category:'BV', color:'#6040D0' },
  'BV480':            { excite:'V', peak:478, sigma:38, brightness:'high',      category:'BV', color:'#3060C0' },
  'BV510':            { excite:'V', peak:510, sigma:40, brightness:'high',      category:'BV', color:'#2880B0' },
  'BV570':            { excite:'V', peak:570, sigma:40, brightness:'high',      category:'BV', color:'#508040' },
  'BV605':            { excite:'V', peak:605, sigma:45, brightness:'high',      category:'BV', color:'#C07020' },
  'BV650':            { excite:'V', peak:650, sigma:45, brightness:'high',      category:'BV', color:'#C04040' },
  'BV711':            { excite:'V', peak:711, sigma:50, brightness:'medium',    category:'BV', color:'#A02860' },
  'BV750':            { excite:'V', peak:750, sigma:50, brightness:'medium',    category:'BV', color:'#802870' },
  'BV786':            { excite:'V', peak:786, sigma:55, brightness:'medium',    category:'BV', color:'#602080' },

  // Pacific Blue / classics
  'Pacific Blue':     { excite:'V', peak:455, sigma:38, brightness:'medium',    category:'Classic', color:'#4060B0' },
  'Pacific Orange':   { excite:'V', peak:551, sigma:40, brightness:'medium',    category:'Classic', color:'#A06030' },
  'Krome Orange':     { excite:'V', peak:528, sigma:40, brightness:'high',      category:'Classic', color:'#807030' },

  // eFluor / Super Bright (Thermo)
  'eFluor 450':       { excite:'V', peak:450, sigma:38, brightness:'high',      category:'eFluor', color:'#5040C0' },
  'eFluor 506':       { excite:'V', peak:506, sigma:40, brightness:'high',      category:'eFluor', color:'#3080B0' },
  'Super Bright 436': { excite:'V', peak:436, sigma:36, brightness:'high',      category:'SuperBright', color:'#5040D0' },
  'Super Bright 600': { excite:'V', peak:600, sigma:45, brightness:'high',      category:'SuperBright', color:'#C07020' },
  'Super Bright 645': { excite:'V', peak:645, sigma:45, brightness:'high',      category:'SuperBright', color:'#C04040' },
  'Super Bright 702': { excite:'V', peak:702, sigma:50, brightness:'medium',    category:'SuperBright', color:'#A02860' },
  'Super Bright 780': { excite:'V', peak:780, sigma:55, brightness:'medium',    category:'SuperBright', color:'#602080' },

  // cFluor / StarBright Violet
  'cFluor V420':      { excite:'V', peak:420, sigma:35, brightness:'very-high', category:'cFluor', color:'#5040C8' },
  'cFluor V435':      { excite:'V', peak:435, sigma:36, brightness:'high',      category:'cFluor', color:'#4848C0' },
  'cFluor V450':      { excite:'V', peak:450, sigma:38, brightness:'very-high', category:'cFluor', color:'#4848B8' },
  'cFluor V475':      { excite:'V', peak:475, sigma:38, brightness:'high',      category:'cFluor', color:'#3858B8' },
  'cFluor V505':      { excite:'V', peak:505, sigma:40, brightness:'high',      category:'cFluor', color:'#2878B0' },
  'cFluor V515':      { excite:'V', peak:515, sigma:40, brightness:'high',      category:'cFluor', color:'#2880A8' },
  'cFluor V547':      { excite:'V', peak:547, sigma:42, brightness:'high',      category:'cFluor', color:'#508040' },
  'cFluor V570':      { excite:'V', peak:570, sigma:42, brightness:'high',      category:'cFluor', color:'#608030' },
  'cFluor V605':      { excite:'V', peak:605, sigma:45, brightness:'high',      category:'cFluor', color:'#C07020' },
  'cFluor V610':      { excite:'V', peak:610, sigma:45, brightness:'high',      category:'cFluor', color:'#C07028' },
  'cFluor V670':      { excite:'V', peak:670, sigma:48, brightness:'high',      category:'cFluor', color:'#C04848' },
  'cFluor V715':      { excite:'V', peak:715, sigma:50, brightness:'medium',    category:'cFluor', color:'#A02860' },
  'cFluor V755':      { excite:'V', peak:755, sigma:55, brightness:'medium',    category:'cFluor', color:'#802870' },
  'cFluor V780':      { excite:'V', peak:780, sigma:55, brightness:'medium',    category:'cFluor', color:'#602080' },

  // StarBright Violet (Bio-Rad)
  'SBV 440':          { excite:'V', peak:440, sigma:36, brightness:'high',      category:'StarBright', color:'#5040C8' },
  'SBV 475':          { excite:'V', peak:475, sigma:38, brightness:'high',      category:'StarBright', color:'#3858B8' },
  'SBV 515':          { excite:'V', peak:515, sigma:40, brightness:'high',      category:'StarBright', color:'#2880A8' },
  'SBV 570':          { excite:'V', peak:570, sigma:42, brightness:'high',      category:'StarBright', color:'#608030' },
  'SBV 610':          { excite:'V', peak:610, sigma:45, brightness:'high',      category:'StarBright', color:'#C07020' },
  'SBV 670':          { excite:'V', peak:670, sigma:48, brightness:'high',      category:'StarBright', color:'#C04848' },
  'SBV 710':          { excite:'V', peak:710, sigma:50, brightness:'medium',    category:'StarBright', color:'#A02860' },
  'SBV 760':          { excite:'V', peak:760, sigma:55, brightness:'medium',    category:'StarBright', color:'#802870' },
  'SBV 790':          { excite:'V', peak:790, sigma:55, brightness:'medium',    category:'StarBright', color:'#602080' },

  // Vio (Miltenyi)
  'VioBlue':          { excite:'V', peak:450, sigma:38, brightness:'high',      category:'Vio', color:'#5040C0' },
  'VioGreen':         { excite:'V', peak:520, sigma:40, brightness:'high',      category:'Vio', color:'#3080A0' },
  'VioBright 515':    { excite:'V', peak:515, sigma:40, brightness:'high',      category:'Vio', color:'#3080A8' },
  'VioBright B515':   { excite:'B', peak:515, sigma:40, brightness:'high',      category:'Vio', color:'#30A040' },
  'VioBright R720':   { excite:'R', peak:720, sigma:50, brightness:'high',      category:'Vio', color:'#A02038' },
  'VioR667':          { excite:'V', peak:667, sigma:48, brightness:'medium',    category:'Vio', color:'#C04848',
                        bleed:{R:{peak:667,weight:0.20}} },
  'VioR720':          { excite:'V', peak:720, sigma:50, brightness:'medium',    category:'Vio', color:'#A02860',
                        bleed:{R:{peak:720,weight:0.18}} },

  // Tonbo violetFluor
  'violetFluor 450':  { excite:'V', peak:450, sigma:38, brightness:'high',      category:'Tonbo', color:'#5040B0' },
  'violetFluor 500':  { excite:'V', peak:500, sigma:40, brightness:'high',      category:'Tonbo', color:'#3080A0' },
  'violetFluor 540':  { excite:'V', peak:540, sigma:40, brightness:'high',      category:'Tonbo', color:'#508040' },
  'violetFluor 610':  { excite:'V', peak:610, sigma:45, brightness:'high',      category:'Tonbo', color:'#C07020' },
  'violetFluor 660':  { excite:'V', peak:660, sigma:45, brightness:'high',      category:'Tonbo', color:'#C04040' },

  // BioLegend Spark Violet
  'Spark Violet 423': { excite:'V', peak:423, sigma:35, brightness:'very-high', category:'Spark', color:'#5040D0' },
  'Spark Violet 538': { excite:'V', peak:538, sigma:38, brightness:'high',      category:'Spark', color:'#508040' },

  // Tag-It Violet / Zombie Violet (BioLegend)
  'Tag-It Violet':    { excite:'V', peak:450, sigma:38, brightness:'high',      category:'TrackerDye', color:'#5040D0' },
  'Zombie Violet':    { excite:'V', peak:430, sigma:38, brightness:'high',      category:'Viability', color:'#5040D0' },

  // ════════════════════════════════════════════════════════════
  // ── Blue-excited (488 nm) ───────────────────────────────────
  // ════════════════════════════════════════════════════════════

  // Classics
  'FITC':             { excite:'B', peak:519, sigma:40, brightness:'medium',    category:'Classic', color:'#30A040' },
  'AF488':            { excite:'B', peak:520, sigma:38, brightness:'high',      category:'AF', color:'#28A848' },
  'CFSE':             { excite:'B', peak:517, sigma:38, brightness:'high',      category:'TrackerDye', color:'#30A840' },
  'BB515':            { excite:'B', peak:515, sigma:38, brightness:'high',      category:'BB', color:'#28A038' },
  'BB630':            { excite:'B', peak:630, sigma:45, brightness:'medium',    category:'BB', color:'#B04020' },
  'BB660':            { excite:'B', peak:660, sigma:45, brightness:'medium',    category:'BB', color:'#C03020' },
  'BB700':            { excite:'B', peak:700, sigma:48, brightness:'high',      category:'BB', color:'#A02020' },
  'BB790':            { excite:'B', peak:790, sigma:55, brightness:'medium',    category:'BB', color:'#701820',
                        bleed:{YG:{peak:790,weight:0.15},R:{peak:790,weight:0.20}} },

  // PerCP family
  'PerCP':            { excite:'B', peak:675, sigma:50, brightness:'low',       category:'PerCP', color:'#808020' },
  'PerCP-Cy5.5':      { excite:'B', peak:695, sigma:52, brightness:'medium',    category:'PerCP', color:'#909010',
                        bleed:{R:{peak:695,weight:0.12}} },
  'PerCP-eFluor 710': { excite:'B', peak:710, sigma:50, brightness:'medium',    category:'PerCP', color:'#808018',
                        bleed:{R:{peak:710,weight:0.10}} },

  // cFluor Blue
  'cFluor B515':      { excite:'B', peak:515, sigma:38, brightness:'high',      category:'cFluor', color:'#30A040' },
  'cFluor B532':      { excite:'B', peak:532, sigma:40, brightness:'high',      category:'cFluor', color:'#40A030' },
  'cFluor B548':      { excite:'B', peak:548, sigma:42, brightness:'high',      category:'cFluor', color:'#60A028' },

  // BioLegend Spark Blue / Spark NIR (488-excited)
  'Spark Blue 550':   { excite:'B', peak:540, sigma:38, brightness:'high',      category:'Spark', color:'#A0A020' },
  'Spark Blue 574':   { excite:'B', peak:574, sigma:40, brightness:'high',      category:'Spark', color:'#B08020' },
  'Spark NIR 685':    { excite:'B', peak:685, sigma:48, brightness:'high',      category:'Spark', color:'#902020' },

  // PE-Fire (BioLegend tandems excited by blue/YG)
  'PE-Fire 640':      { excite:'YG', peak:640, sigma:48, brightness:'high',     category:'PE-Fire', color:'#C04020',
                        bleed:{B:{peak:640,weight:0.08}} },
  'PE-Fire 700':      { excite:'YG', peak:700, sigma:50, brightness:'high',     category:'PE-Fire', color:'#A02830',
                        bleed:{R:{peak:700,weight:0.15},B:{peak:700,weight:0.06}} },
  'PE-Fire 744':      { excite:'YG', peak:744, sigma:52, brightness:'high',     category:'PE-Fire', color:'#8A2030',
                        bleed:{R:{peak:744,weight:0.18},B:{peak:744,weight:0.08}} },
  'PE-Fire 810':      { excite:'YG', peak:810, sigma:60, brightness:'medium',   category:'PE-Fire', color:'#702030',
                        bleed:{R:{peak:810,weight:0.20},B:{peak:810,weight:0.12}} },

  // eFluor / NovaFluor Blue (Phitonex/Thermo)
  'eFluor 660':       { excite:'B', peak:660, sigma:45, brightness:'medium',    category:'eFluor', color:'#A03030' },
  'NovaFluor Blue 530':{ excite:'B', peak:530, sigma:38, brightness:'high',     category:'NovaFluor', color:'#30A040' },
  'NovaFluor Blue 555':{ excite:'B', peak:555, sigma:40, brightness:'high',     category:'NovaFluor', color:'#80A030' },
  'NovaFluor Blue 585':{ excite:'B', peak:585, sigma:42, brightness:'high',     category:'NovaFluor', color:'#A08020' },
  'NovaFluor Blue 610':{ excite:'B', peak:610, sigma:44, brightness:'high',     category:'NovaFluor', color:'#B07020' },
  'NovaFluor Blue 660':{ excite:'B', peak:660, sigma:46, brightness:'high',     category:'NovaFluor', color:'#A03030' },
  'NovaFluor Blue 690':{ excite:'B', peak:690, sigma:48, brightness:'high',     category:'NovaFluor', color:'#902828' },

  // KIRAVIA Blue (Sony)
  'KIRAVIA Blue 520': { excite:'B', peak:520, sigma:38, brightness:'high',      category:'KIRAVIA', color:'#30A848' },

  // Viability (Blue)
  'SPiDER Green':     { excite:'B', peak:515, sigma:42, brightness:'high',      category:'Viability', color:'#20B040' },
  '7-AAD':            { excite:'B', peak:647, sigma:55, brightness:'medium',    category:'Viability', color:'#A03050' },
  'LIVE/DEAD Blue':   { excite:'UV', peak:445, sigma:42, brightness:'high',     category:'Viability', color:'#3060B0' },
  'LIVE/DEAD Green':  { excite:'B', peak:520, sigma:42, brightness:'high',      category:'Viability', color:'#28A848' },
  'LIVE/DEAD Yellow': { excite:'V', peak:575, sigma:42, brightness:'high',      category:'Viability', color:'#A08030' },
  'LIVE/DEAD Red':    { excite:'YG', peak:615, sigma:45, brightness:'high',     category:'Viability', color:'#A03828' },
  'LIVE/DEAD Far Red':{ excite:'R', peak:720, sigma:50, brightness:'high',      category:'Viability', color:'#A02838' },
  'LIVE/DEAD NIR':    { excite:'R', peak:780, sigma:58, brightness:'high',      category:'Viability', color:'#581828' },
  'LIVE/DEAD Aqua':   { excite:'UV', peak:517, sigma:42, brightness:'high',     category:'Viability', color:'#2088B0' },
  'LIVE/DEAD Violet': { excite:'V', peak:450, sigma:40, brightness:'high',      category:'Viability', color:'#5040A0' },
  'LIVE/DEAD UV':     { excite:'UV', peak:448, sigma:42, brightness:'high',     category:'Viability', color:'#4060A0' },
  'Zombie Aqua':      { excite:'UV', peak:516, sigma:42, brightness:'high',     category:'Viability', color:'#2090B0' },
  'Zombie Green':     { excite:'UV', peak:535, sigma:42, brightness:'high',     category:'Viability', color:'#30A060' },
  'Zombie Yellow':    { excite:'V', peak:575, sigma:42, brightness:'high',      category:'Viability', color:'#A08030' },
  'Zombie Red':       { excite:'YG', peak:625, sigma:45, brightness:'high',     category:'Viability', color:'#B03828' },
  'Zombie NIR':       { excite:'R', peak:780, sigma:58, brightness:'high',      category:'Viability', color:'#601830' },
  'Ghost Dye Violet 450': { excite:'V', peak:450, sigma:38, brightness:'high',  category:'Viability', color:'#5040A0' },
  'Ghost Dye Violet 510': { excite:'V', peak:510, sigma:40, brightness:'high',  category:'Viability', color:'#3080A8' },
  'Ghost Dye Violet 540': { excite:'V', peak:540, sigma:40, brightness:'high',  category:'Viability', color:'#508040' },
  'Ghost Dye Red 780': { excite:'R', peak:780, sigma:55, brightness:'high',     category:'Viability', color:'#601830' },
  'ViaDye Red':       { excite:'R', peak:780, sigma:55, brightness:'high',      category:'Viability', color:'#601838' },
  'DAPI':             { excite:'UV', peak:461, sigma:50, brightness:'high',     category:'Viability', color:'#3050D0' },

  // ════════════════════════════════════════════════════════════
  // ── Yellow-Green-excited (561 nm) ───────────────────────────
  // ════════════════════════════════════════════════════════════

  // PE family
  'PE':               { excite:'YG', peak:578, sigma:38, brightness:'very-high', category:'PE', color:'#E08020',
                        bleed:{B:{peak:578,weight:0.08}} },
  'PE-CF594':         { excite:'YG', peak:612, sigma:45, brightness:'high',      category:'PE-tandem', color:'#C04820',
                        bleed:{B:{peak:612,weight:0.05}} },
  'PE-Dazzle594':     { excite:'YG', peak:610, sigma:44, brightness:'high',      category:'PE-tandem', color:'#C85020',
                        bleed:{B:{peak:610,weight:0.05}} },
  'PE-Cy5':           { excite:'YG', peak:667, sigma:50, brightness:'medium',    category:'PE-tandem', color:'#A04030',
                        bleed:{R:{peak:667,weight:0.22},B:{peak:667,weight:0.08}} },
  'PE-Cy5.5':         { excite:'YG', peak:695, sigma:52, brightness:'medium',    category:'PE-tandem', color:'#903030',
                        bleed:{R:{peak:695,weight:0.18},B:{peak:695,weight:0.07}} },
  'PE-Cy7':           { excite:'YG', peak:785, sigma:60, brightness:'medium',    category:'PE-tandem', color:'#702060',
                        bleed:{R:{peak:785,weight:0.18},B:{peak:785,weight:0.12}} },
  'PE-Texas Red':     { excite:'YG', peak:615, sigma:45, brightness:'high',      category:'PE-tandem', color:'#C04830',
                        bleed:{B:{peak:615,weight:0.05}} },
  'ECD':              { excite:'YG', peak:615, sigma:45, brightness:'high',      category:'PE-tandem', color:'#C04830',
                        bleed:{B:{peak:615,weight:0.05}} },

  // BioLegend Spark YG
  'Spark YG 570':     { excite:'YG', peak:570, sigma:40, brightness:'high',      category:'Spark', color:'#D08020' },
  'Spark YG 581':     { excite:'YG', peak:581, sigma:40, brightness:'high',      category:'Spark', color:'#D08828' },
  'Spark YG 593':     { excite:'YG', peak:593, sigma:42, brightness:'high',      category:'Spark', color:'#C87830' },

  // cFluor YG
  'cFluor YG584':     { excite:'YG', peak:584, sigma:38, brightness:'high',      category:'cFluor', color:'#E08020',
                        bleed:{B:{peak:584,weight:0.08}} },

  // NovaFluor Yellow (Phitonex/Thermo)
  'NovaFluor Yellow 570':{ excite:'YG', peak:570, sigma:38, brightness:'high',   category:'NovaFluor', color:'#D08020' },
  'NovaFluor Yellow 590':{ excite:'YG', peak:590, sigma:40, brightness:'high',   category:'NovaFluor', color:'#D08830' },
  'NovaFluor Yellow 610':{ excite:'YG', peak:610, sigma:42, brightness:'high',   category:'NovaFluor', color:'#C87830' },
  'NovaFluor Yellow 660':{ excite:'YG', peak:660, sigma:46, brightness:'high',   category:'NovaFluor', color:'#B06030' },
  'NovaFluor Yellow 700':{ excite:'YG', peak:700, sigma:48, brightness:'high',   category:'NovaFluor', color:'#A04830' },
  'NovaFluor Yellow 730':{ excite:'YG', peak:730, sigma:50, brightness:'medium', category:'NovaFluor', color:'#903830' },

  // Northern Lights (R&D)
  'NL557':            { excite:'YG', peak:572, sigma:40, brightness:'high',      category:'NorthernLights', color:'#D08028' },
  'NL637':            { excite:'R', peak:660, sigma:44, brightness:'high',       category:'NorthernLights', color:'#D02828' },
  'NL650':            { excite:'R', peak:660, sigma:44, brightness:'high',       category:'NorthernLights', color:'#D02830' },
  'NL750':            { excite:'R', peak:775, sigma:55, brightness:'high',       category:'NorthernLights', color:'#801028' },
  'NL850':            { excite:'R', peak:840, sigma:60, brightness:'medium',     category:'NorthernLights', color:'#601830' },

  // Other YG dyes
  'AF532':            { excite:'B', peak:553, sigma:40, brightness:'high',       category:'AF', color:'#A08020' },
  'AF555':            { excite:'YG', peak:565, sigma:40, brightness:'high',      category:'AF', color:'#D07020' },
  'AF568':            { excite:'YG', peak:603, sigma:42, brightness:'high',      category:'AF', color:'#D04020' },
  'AF594':            { excite:'YG', peak:617, sigma:42, brightness:'high',      category:'AF', color:'#C84020' },

  // ════════════════════════════════════════════════════════════
  // ── Red-excited (638 nm) ────────────────────────────────────
  // ════════════════════════════════════════════════════════════

  // APC family
  'APC':              { excite:'R', peak:660, sigma:44, brightness:'very-high', category:'APC', color:'#E02020' },
  'AF647':            { excite:'R', peak:665, sigma:44, brightness:'high',      category:'AF', color:'#D02828' },
  'APC-R700':         { excite:'R', peak:723, sigma:50, brightness:'high',      category:'APC-tandem', color:'#A01830' },
  'AF700':            { excite:'R', peak:723, sigma:50, brightness:'high',      category:'AF', color:'#981828' },
  'AF750':            { excite:'R', peak:775, sigma:55, brightness:'medium',    category:'AF', color:'#781020' },
  'APC-Cy7':          { excite:'R', peak:785, sigma:60, brightness:'medium',    category:'APC-tandem', color:'#701028',
                        bleed:{YG:{peak:785,weight:0.10}} },
  'APC-H7':           { excite:'R', peak:782, sigma:58, brightness:'medium',    category:'APC-tandem', color:'#681028',
                        bleed:{YG:{peak:782,weight:0.10}} },
  'APC-eFluor 780':   { excite:'R', peak:780, sigma:58, brightness:'medium',    category:'APC-tandem', color:'#701030',
                        bleed:{YG:{peak:780,weight:0.10}} },

  // APC-Fire (BioLegend tandems)
  'APC-Fire 750':     { excite:'R', peak:750, sigma:55, brightness:'high',      category:'APC-Fire', color:'#901028' },
  'APC-Fire 810':     { excite:'R', peak:810, sigma:60, brightness:'medium',    category:'APC-Fire', color:'#701028' },

  // cFluor Red
  'cFluor R668':      { excite:'R', peak:668, sigma:44, brightness:'very-high', category:'cFluor', color:'#D02020' },
  'cFluor R685':      { excite:'R', peak:685, sigma:46, brightness:'high',      category:'cFluor', color:'#C02830' },
  'cFluor R720':      { excite:'R', peak:720, sigma:50, brightness:'high',      category:'cFluor', color:'#A02038' },
  'cFluor R780':      { excite:'R', peak:780, sigma:58, brightness:'high',      category:'cFluor', color:'#702030' },
  'cFluor R840':      { excite:'R', peak:840, sigma:60, brightness:'medium',    category:'cFluor', color:'#601838' },

  // BioLegend Spark Red
  'Spark Red':        { excite:'R', peak:660, sigma:44, brightness:'high',      category:'Spark', color:'#D02020' },

  // NovaFluor Red
  'NovaFluor Red 660':{ excite:'R', peak:660, sigma:44, brightness:'high',      category:'NovaFluor', color:'#D02828' },
  'NovaFluor Red 685':{ excite:'R', peak:685, sigma:46, brightness:'high',      category:'NovaFluor', color:'#C02830' },
  'NovaFluor Red 700':{ excite:'R', peak:700, sigma:48, brightness:'high',      category:'NovaFluor', color:'#B02830' },
  'NovaFluor Red 710':{ excite:'R', peak:710, sigma:50, brightness:'high',      category:'NovaFluor', color:'#A02038' },
  'NovaFluor Red 780':{ excite:'R', peak:780, sigma:55, brightness:'high',      category:'NovaFluor', color:'#702030' },
  'NovaFluor Red 800':{ excite:'R', peak:800, sigma:58, brightness:'medium',    category:'NovaFluor', color:'#601830' },

  // Tonbo redFluor
  'redFluor 710':     { excite:'R', peak:710, sigma:50, brightness:'high',      category:'Tonbo', color:'#A02838' },

};

// ── Brightness rank (for antigen density recommendations) ────────────────────
const BRIGHTNESS_RANK = { 'very-high':4, 'high':3, 'medium':2, 'low':1 };

// ── Helpers ──────────────────────────────────────────────────────────────────
function getDyeLaser(dyeName)   { return DYES[dyeName] ? DYES[dyeName].excite : null; }
function getDyeColor(dyeName)   { return DYES[dyeName] ? DYES[dyeName].color  : '#888'; }
function getDyeNames(laser = null) {
  return Object.keys(DYES).filter(n => !laser || DYES[n].excite === laser).sort();
}
function getBrightnessRank(dyeName) {
  const dye = DYES[dyeName];
  return dye ? (BRIGHTNESS_RANK[dye.brightness] || 0) : 0;
}
