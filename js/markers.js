// PanelCanvas — Marker Database
// Common immunophenotyping markers for surface and intracellular panels.
// density: 'high' | 'medium' | 'low' — drives fluorochrome brightness recommendations
// category: grouping for autocomplete display
// aliases: alternative names for search

const MARKERS = [

  // ── T cell lineage ─────────────────────────────────────────
  { name:'CD3',   density:'high',   category:'T cell',     aliases:['CD3e','T3'] },
  { name:'CD4',   density:'high',   category:'T cell',     aliases:['L3T4','W3/25'] },
  { name:'CD8',   density:'high',   category:'T cell',     aliases:['CD8a','Lyt-2'] },
  { name:'CD45',  density:'high',   category:'Lineage',    aliases:['LCA','B220 (CD45R)'] },
  { name:'CD45RA',density:'high',   category:'T cell',     aliases:['naive T'] },
  { name:'CD45RO',density:'high',   category:'T cell',     aliases:['memory T'] },
  { name:'CD62L', density:'medium', category:'T cell',     aliases:['L-selectin','SELL'] },

  // ── T cell memory/subset ────────────────────────────────────
  { name:'CD27',  density:'medium', category:'T cell',     aliases:['TNFRSF7'] },
  { name:'CD28',  density:'medium', category:'T cell',     aliases:[] },
  { name:'CD95',  density:'medium', category:'T cell',     aliases:['Fas','APO-1'] },
  { name:'CD127', density:'low',    category:'T cell',     aliases:['IL-7Ra','IL7R'] },
  { name:'CCR7',  density:'medium', category:'T cell',     aliases:['CD197'] },
  { name:'CCR4',  density:'low',    category:'T cell',     aliases:['CD194'] },
  { name:'CCR5',  density:'low',    category:'T cell',     aliases:['CD195'] },
  { name:'CCR6',  density:'low',    category:'T cell',     aliases:['CD196'] },
  { name:'CXCR3', density:'low',    category:'T cell',     aliases:['CD183'] },
  { name:'CXCR5', density:'low',    category:'T cell',     aliases:['CD185'] },

  // ── T cell activation / exhaustion ─────────────────────────
  { name:'CD25',  density:'low',    category:'Activation', aliases:['IL-2Ra','IL2RA'] },
  { name:'CD38',  density:'medium', category:'Activation', aliases:[] },
  { name:'CD39',  density:'low',    category:'Activation', aliases:['ENTPD1','NTPDase-1'] },
  { name:'CD69',  density:'medium', category:'Activation', aliases:['EA1'] },
  { name:'HLA-DR',density:'high',   category:'Activation', aliases:['MHC II'] },
  { name:'PD-1',  density:'low',    category:'Checkpoint', aliases:['CD279','PDCD1'] },
  { name:'LAG-3', density:'low',    category:'Checkpoint', aliases:['CD223'] },
  { name:'TIM-3', density:'low',    category:'Checkpoint', aliases:['CD366','HAVCR2'] },
  { name:'TIGIT', density:'low',    category:'Checkpoint', aliases:[] },
  { name:'CTLA-4',density:'low',    category:'Checkpoint', aliases:['CD152'] },
  { name:'ICOS',  density:'low',    category:'Checkpoint', aliases:['CD278'] },
  { name:'OX40',  density:'low',    category:'Checkpoint', aliases:['CD134','TNFRSF4'] },
  { name:'4-1BB', density:'low',    category:'Checkpoint', aliases:['CD137','TNFRSF9'] },
  { name:'CD161', density:'medium', category:'T cell',     aliases:['NKR-P1','KLRB1'] },
  { name:'CD103', density:'low',    category:'T cell',     aliases:['Integrin αE','ITGAE'] },

  // ── Treg ────────────────────────────────────────────────────
  { name:'FoxP3', density:'low',    category:'Treg',       aliases:['FOXP3','SCURFIN'] },
  { name:'GITR',  density:'low',    category:'Treg',       aliases:['CD357','TNFRSF18'] },
  { name:'Helios',density:'low',    category:'Treg',       aliases:['IKZF2'] },
  { name:'CCR8',  density:'low',    category:'Treg',       aliases:['CD198'] },

  // ── Cytokines / Effector function ───────────────────────────
  { name:'IFN-γ', density:'low',    category:'Cytokine',   aliases:['IFNg','IFNG'] },
  { name:'TNF-α', density:'low',    category:'Cytokine',   aliases:['TNFa','TNFA'] },
  { name:'IL-2',  density:'low',    category:'Cytokine',   aliases:['IL2'] },
  { name:'IL-4',  density:'low',    category:'Cytokine',   aliases:['IL4'] },
  { name:'IL-10', density:'low',    category:'Cytokine',   aliases:['IL10'] },
  { name:'IL-17', density:'low',    category:'Cytokine',   aliases:['IL17A'] },
  { name:'IL-21', density:'low',    category:'Cytokine',   aliases:['IL21'] },
  { name:'IL-22', density:'low',    category:'Cytokine',   aliases:['IL22'] },
  { name:'Granzyme B',density:'low',category:'Effector',   aliases:['GZMB'] },
  { name:'Granzyme K',density:'low',category:'Effector',   aliases:['GZMK'] },
  { name:'Perforin',  density:'low',category:'Effector',   aliases:['PRF1'] },

  // ── Proliferation / Survival ────────────────────────────────
  { name:'Ki-67', density:'low',    category:'Proliferation', aliases:['Ki67','MKI67'] },
  { name:'BCL-2', density:'low',    category:'Survival',      aliases:['BCL2'] },
  { name:'BCL-6', density:'low',    category:'Tfh',           aliases:['BCL6'] },
  { name:'TCF1',  density:'low',    category:'Transcription', aliases:['TCF7','TCF-1'] },

  // ── Transcription factors ────────────────────────────────────
  { name:'T-bet', density:'low',    category:'Transcription', aliases:['TBX21','TBET'] },
  { name:'GATA-3',density:'low',    category:'Transcription', aliases:['GATA3'] },
  { name:'RORγt', density:'low',    category:'Transcription', aliases:['RORgT','RORC'] },
  { name:'EOMES', density:'low',    category:'Transcription', aliases:['Eomesodermin'] },

  // ── NK cells ────────────────────────────────────────────────
  { name:'CD16',  density:'high',   category:'NK/Myeloid', aliases:['FcγRIII','FCGR3A'] },
  { name:'CD56',  density:'medium', category:'NK',         aliases:['NCAM1'] },
  { name:'CD57',  density:'medium', category:'NK',         aliases:['HNK-1','B3GAT1'] },
  { name:'NKG2A', density:'medium', category:'NK',         aliases:['KLRC1','CD159a'] },
  { name:'NKG2C', density:'low',    category:'NK',         aliases:['KLRC2','CD159c'] },
  { name:'NKG2D', density:'medium', category:'NK',         aliases:['KLRK1','CD314'] },
  { name:'NKp46', density:'medium', category:'NK',         aliases:['NCR1','CD335'] },
  { name:'NKp44', density:'low',    category:'NK',         aliases:['NCR2','CD336'] },
  { name:'KIR2DL1',density:'low',   category:'NK',         aliases:['CD158a'] },
  { name:'KIR2DL2',density:'low',   category:'NK',         aliases:['CD158b'] },

  // ── B cells ──────────────────────────────────────────────────
  { name:'CD19',  density:'high',   category:'B cell',     aliases:['B4'] },
  { name:'CD20',  density:'high',   category:'B cell',     aliases:['MS4A1'] },
  { name:'CD21',  density:'high',   category:'B cell',     aliases:['CR2','C3dR'] },
  { name:'CD23',  density:'medium', category:'B cell',     aliases:['FcεRII','FCER2'] },
  { name:'CD24',  density:'high',   category:'B cell',     aliases:['HSA'] },
  { name:'IgD',   density:'high',   category:'B cell',     aliases:['IGHD'] },
  { name:'IgM',   density:'high',   category:'B cell',     aliases:['IGHM'] },
  { name:'CD138', density:'high',   category:'Plasma cell',aliases:['Syndecan-1','SDC1'] },
  { name:'CD10',  density:'medium', category:'B cell',     aliases:['Neprilysin','MME'] },

  // ── Myeloid ──────────────────────────────────────────────────
  { name:'CD14',  density:'high',   category:'Myeloid',    aliases:['Monocyte'] },
  { name:'CD11b', density:'high',   category:'Myeloid',    aliases:['Integrin αM','ITGAM'] },
  { name:'CD11c', density:'high',   category:'DC',         aliases:['Integrin αX','ITGAX'] },
  { name:'CD15',  density:'high',   category:'Myeloid',    aliases:['FUT4','Sialyl-Lex'] },
  { name:'CD33',  density:'medium', category:'Myeloid',    aliases:['Siglec-3'] },
  { name:'CD66b', density:'high',   category:'Neutrophil', aliases:['CEACAM8'] },
  { name:'CD1c',  density:'medium', category:'DC',         aliases:['BDCA-1','CD1C'] },
  { name:'CD141', density:'low',    category:'DC',         aliases:['BDCA-3','THBD'] },
  { name:'XCR1',  density:'low',    category:'DC',         aliases:['cDC1 marker'] },
  { name:'CD123', density:'medium', category:'DC/pDC',     aliases:['IL-3Ra','IL3RA'] },
  { name:'CD303', density:'low',    category:'pDC',        aliases:['BDCA-2','CLEC4C'] },

  // ── Endothelial/Stromal ──────────────────────────────────────
  { name:'CD31',  density:'high',   category:'Endothelial',aliases:['PECAM-1','PECAM1'] },
  { name:'CD34',  density:'medium', category:'Progenitor', aliases:['HSC marker'] },
  { name:'CD90',  density:'high',   category:'Stromal',    aliases:['Thy-1','THY1'] },
  { name:'CD105', density:'medium', category:'Endothelial',aliases:['Endoglin','ENG'] },
  { name:'PDGFRA',density:'low',    category:'Stromal',    aliases:['CD140a','PDGFR-α'] },
  { name:'PDGFRB',density:'low',    category:'Stromal',    aliases:['CD140b','PDGFR-β'] },

  // ── Ligands / Co-stimulation ─────────────────────────────────
  { name:'PD-L1', density:'medium', category:'Checkpoint', aliases:['CD274','B7-H1'] },
  { name:'PD-L2', density:'low',    category:'Checkpoint', aliases:['CD273','B7-DC'] },
  { name:'CD80',  density:'medium', category:'Co-stim',    aliases:['B7-1','B7.1'] },
  { name:'CD86',  density:'medium', category:'Co-stim',    aliases:['B7-2','B7.2'] },
  { name:'CD40',  density:'medium', category:'Co-stim',    aliases:['TNFRSF5'] },
  { name:'CD40L', density:'low',    category:'Co-stim',    aliases:['CD154','TNFSF5'] },
  { name:'P-Selectin',density:'medium',category:'Activation',aliases:['CD62P','SELP'] },

  // ── Viability ────────────────────────────────────────────────
  { name:'Viability', density:'high', category:'Viability', requiredCategory:'Viability', aliases:['Live/Dead','LIVE/DEAD','Zombie','7-AAD'] },

];

// Category order for display
const MARKER_CATEGORIES = [
  'Viability','Lineage','T cell','Activation','Checkpoint','Treg',
  'Cytokine','Effector','Proliferation','Survival','Transcription',
  'NK','B cell','Plasma cell','Myeloid','DC','pDC','Neutrophil',
  'Endothelial','Progenitor','Stromal','Co-stim'
];

// Search markers by query string
function searchMarkers(query, limit = 10) {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase().trim();
  const results = [];
  for (const m of MARKERS) {
    const nameMatch  = m.name.toLowerCase().includes(q);
    const aliasMatch = m.aliases.some(a => a.toLowerCase().includes(q));
    if (nameMatch || aliasMatch) results.push(m);
    if (results.length >= limit) break;
  }
  return results;
}

// Get a marker by exact name
function getMarker(name) {
  return MARKERS.find(m => m.name === name || m.aliases.includes(name)) || null;
}

// Density badge class
function densityClass(density) {
  return { high:'density-hi', medium:'density-med', low:'density-lo' }[density] || 'badge-neutral';
}
