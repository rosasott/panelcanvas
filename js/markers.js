// PanelCanvas — Marker Database v2
// Density assignments sourced from quantitative ABC (Antibody Binding Capacity)
// data: Perfetto et al. 2019, Front. Immunol. PMC6820661
// log10 ABC ≥ 4  → 'high'    (>10,000 binding sites)
// log10 ABC 3–4  → 'medium'  (1,000–10,000 binding sites)
// log10 ABC < 3  → 'low'     (<1,000 binding sites)
// 'very low'     → intracellular or activation markers rarely expressed at rest
//
// density: 'high' | 'medium' | 'low' | 'very low'
// category: grouping for autocomplete display
// aliases: alternative names for search

const MARKERS = [

  // ── T cell lineage ──────────────────────────────────────────
  { name:'CD3',     density:'high',     category:'T cell',        aliases:['CD3e','T3'] },
  { name:'CD4',     density:'high',     category:'T cell',        aliases:['L3T4','W3/25'] },
  { name:'CD8',     density:'high',     category:'T cell',        aliases:['CD8a','Lyt-2'] },
  { name:'CD8a',    density:'high',     category:'T cell',        aliases:['CD8'] },
  { name:'CD5',     density:'high',     category:'T cell',        aliases:[] },
  { name:'CD6',     density:'high',     category:'T cell',        aliases:[] },
  { name:'CD7',     density:'high',     category:'T cell',        aliases:[] },
  { name:'CD2',     density:'high',     category:'T cell',        aliases:[] },
  { name:'TCRab',   density:'high',     category:'T cell',        aliases:['TCR alpha/beta'] },
  { name:'TCRgd',   density:'medium',   category:'T cell',        aliases:['TCR gamma/delta'] },

  // ── T cell memory / differentiation ─────────────────────────
  { name:'CD45RA',  density:'high',     category:'T cell',        aliases:['naive T'] },
  { name:'CD45RO',  density:'high',     category:'T cell',        aliases:['memory T'] },
  { name:'CCR7',    density:'medium',   category:'T cell',        aliases:['CD197'] },
  { name:'CD27',    density:'medium',   category:'T cell',        aliases:[] },
  { name:'CD28',    density:'medium',   category:'T cell',        aliases:[] },
  { name:'CD57',    density:'medium',   category:'T cell',        aliases:[] },
  { name:'CD95',    density:'medium',   category:'T cell',        aliases:['Fas','APO-1'] },
  { name:'CD122',   density:'low',      category:'T cell',        aliases:['IL-2Rb'] },

  // ── T regulatory ─────────────────────────────────────────────
  { name:'FoxP3',   density:'very low', category:'Treg',          aliases:['FOXP3'] },
  { name:'CD25',    density:'low',      category:'Treg',          aliases:['IL-2Ra'] },
  { name:'CD127',   density:'low',      category:'Treg',          aliases:['IL-7Ra'] },
  { name:'CTLA-4',  density:'very low', category:'Treg',          aliases:['CD152'] },
  { name:'Helios',  density:'very low', category:'Treg',          aliases:['IKZF2'] },

  // ── T exhaustion / checkpoint ────────────────────────────────
  { name:'PD-1',    density:'low',      category:'Exhaustion',    aliases:['CD279','PDCD1'] },
  { name:'TIM-3',   density:'low',      category:'Exhaustion',    aliases:['CD366','HAVCR2'] },
  { name:'LAG-3',   density:'low',      category:'Exhaustion',    aliases:['CD223'] },
  { name:'TIGIT',   density:'low',      category:'Exhaustion',    aliases:[] },
  { name:'TOX',     density:'very low', category:'Exhaustion',    aliases:[] },
  { name:'2B4',     density:'low',      category:'Exhaustion',    aliases:['CD244'] },
  { name:'CD39',    density:'low',      category:'Exhaustion',    aliases:['NTPDase1'] },

  // ── T activation / proliferation ────────────────────────────
  { name:'CD69',    density:'low',      category:'Activation',    aliases:['EA1'] },
  { name:'CD44',    density:'medium',   category:'Activation',    aliases:[] },
  { name:'CD38',    density:'medium',   category:'Activation',    aliases:[] },
  { name:'HLA-DR',  density:'medium',   category:'Activation',    aliases:['MHC II'] },
  { name:'Ki67',    density:'very low', category:'Proliferation', aliases:['MKI67'] },
  { name:'PCNA',    density:'very low', category:'Proliferation', aliases:[] },
  { name:'BrdU',    density:'very low', category:'Proliferation', aliases:[] },
  { name:'pS6',     density:'very low', category:'Signaling',     aliases:['phospho-S6'] },

  // ── NK cells ─────────────────────────────────────────────────
  { name:'CD56',    density:'medium',   category:'NK cell',       aliases:['NCAM','NKH-1'] },
  { name:'CD16',    density:'high',     category:'NK cell',       aliases:['FcgRIII','CD16a'] },
  { name:'NKp46',   density:'medium',   category:'NK cell',       aliases:['NCR1','CD335'] },
  { name:'NKG2A',   density:'medium',   category:'NK cell',       aliases:['CD159a'] },
  { name:'NKG2D',   density:'medium',   category:'NK cell',       aliases:['CD314'] },
  { name:'NKG2C',   density:'low',      category:'NK cell',       aliases:['CD159c'] },
  { name:'KIR',     density:'medium',   category:'NK cell',       aliases:['CD158'] },
  { name:'DNAM-1',  density:'medium',   category:'NK cell',       aliases:['CD226'] },
  { name:'perforin',density:'very low', category:'NK cell',       aliases:[] },
  { name:'granzyme B',density:'very low',category:'NK cell',      aliases:['GzmB'] },

  // ── B cells ──────────────────────────────────────────────────
  { name:'CD19',    density:'high',     category:'B cell',        aliases:[] },
  { name:'CD20',    density:'high',     category:'B cell',        aliases:['MS4A1'] },
  { name:'CD21',    density:'medium',   category:'B cell',        aliases:['CR2','C3dR'] },
  { name:'CD22',    density:'medium',   category:'B cell',        aliases:[] },
  { name:'CD23',    density:'low',      category:'B cell',        aliases:['FceRII'] },
  { name:'CD24',    density:'medium',   category:'B cell',        aliases:['HSA'] },
  { name:'CD27',    density:'medium',   category:'B cell',        aliases:[] },
  { name:'CD38',    density:'medium',   category:'B cell',        aliases:[] },
  { name:'CD79a',   density:'medium',   category:'B cell',        aliases:['Iga'] },
  { name:'CD79b',   density:'medium',   category:'B cell',        aliases:['Igb'] },
  { name:'IgD',     density:'high',     category:'B cell',        aliases:[] },
  { name:'IgM',     density:'high',     category:'B cell',        aliases:[] },
  { name:'IgG',     density:'medium',   category:'B cell',        aliases:[] },
  { name:'CD138',   density:'high',     category:'B cell',        aliases:['Syndecan-1','SDC1'] },
  { name:'CD319',   density:'medium',   category:'B cell',        aliases:['SLAMF7','CS1'] },

  // ── Monocytes / Myeloid ──────────────────────────────────────
  { name:'CD14',    density:'high',     category:'Myeloid',       aliases:['Monocyte'] },
  { name:'CD16',    density:'high',     category:'Myeloid',       aliases:['FcgRIII'] },
  { name:'CD11b',   density:'high',     category:'Myeloid',       aliases:['Mac-1','ITGAM'] },
  { name:'CD11c',   density:'high',     category:'Myeloid',       aliases:['ITGAX'] },
  { name:'CD33',    density:'high',     category:'Myeloid',       aliases:['Siglec-3'] },
  { name:'CD64',    density:'medium',   category:'Myeloid',       aliases:['FcgRI'] },
  { name:'CD68',    density:'medium',   category:'Myeloid',       aliases:['macrosialin'] },
  { name:'CD80',    density:'low',      category:'Myeloid',       aliases:['B7-1','CD28L'] },
  { name:'CD86',    density:'medium',   category:'Myeloid',       aliases:['B7-2'] },
  { name:'CD163',   density:'medium',   category:'Myeloid',       aliases:[] },
  { name:'CD206',   density:'medium',   category:'Myeloid',       aliases:['MMR','MRC1'] },
  { name:'CX3CR1',  density:'medium',   category:'Myeloid',       aliases:['fractalkine R'] },
  { name:'CCR2',    density:'low',      category:'Myeloid',       aliases:['CD192'] },

  // ── Dendritic cells ──────────────────────────────────────────
  { name:'CD1c',    density:'medium',   category:'DC',            aliases:['BDCA-1'] },
  { name:'CD303',   density:'medium',   category:'DC',            aliases:['BDCA-2','CLEC4C'] },
  { name:'CD304',   density:'medium',   category:'DC',            aliases:['BDCA-4','Neuropilin-1'] },
  { name:'CD141',   density:'low',      category:'DC',            aliases:['BDCA-3','Thrombomodulin'] },
  { name:'XCR1',    density:'low',      category:'DC',            aliases:[] },
  { name:'CD370',   density:'low',      category:'DC',            aliases:['CLEC9A','DNGR-1'] },

  // ── Granulocytes ─────────────────────────────────────────────
  { name:'CD15',    density:'high',     category:'Granulocyte',   aliases:['Lewis X','SSEA-1'] },
  { name:'CD66b',   density:'high',     category:'Granulocyte',   aliases:['CEACAM8'] },
  { name:'CD117',   density:'medium',   category:'Granulocyte',   aliases:['c-Kit','SCF-R'] },
  { name:'CD193',   density:'medium',   category:'Granulocyte',   aliases:['CCR3'] },
  { name:'Siglec-8',density:'medium',   category:'Granulocyte',   aliases:[] },

  // ── Pan-leukocyte / lineage ──────────────────────────────────
  { name:'CD45',    density:'high',     category:'Lineage',       aliases:['LCA','B220'] },
  { name:'CD43',    density:'high',     category:'Lineage',       aliases:['Leukosialin'] },
  { name:'CD44',    density:'high',     category:'Lineage',       aliases:[] },
  { name:'CD47',    density:'high',     category:'Lineage',       aliases:["don't eat me"] },
  { name:'CD48',    density:'medium',   category:'Lineage',       aliases:['SLAMF2'] },
  { name:'CD50',    density:'high',     category:'Lineage',       aliases:['ICAM-3'] },
  { name:'CD53',    density:'high',     category:'Lineage',       aliases:[] },
  { name:'CD58',    density:'high',     category:'Lineage',       aliases:['LFA-3'] },
  { name:'CD59',    density:'high',     category:'Lineage',       aliases:['protectin'] },
  { name:'CD63',    density:'medium',   category:'Lineage',       aliases:['LAMP-3'] },
  { name:'CD81',    density:'high',     category:'Lineage',       aliases:['TAPA-1'] },
  { name:'CD82',    density:'high',     category:'Lineage',       aliases:['KAI1'] },
  { name:'CD84',    density:'medium',   category:'Lineage',       aliases:['SLAMF5'] },
  { name:'CD98',    density:'high',     category:'Lineage',       aliases:['4F2','SLC3A2'] },
  { name:'CD99',    density:'high',     category:'Lineage',       aliases:['MIC2'] },
  { name:'CD100',   density:'high',     category:'Lineage',       aliases:['SEMA4D'] },

  // ── Hematopoietic progenitors ────────────────────────────────
  { name:'CD34',    density:'low',      category:'Progenitor',    aliases:['HPCA1'] },
  { name:'CD90',    density:'low',      category:'Progenitor',    aliases:['Thy-1'] },
  { name:'CD133',   density:'low',      category:'Progenitor',    aliases:['Prominin-1','AC133'] },
  { name:'CD117',   density:'medium',   category:'Progenitor',    aliases:['c-Kit'] },
  { name:'CD135',   density:'low',      category:'Progenitor',    aliases:['Flt3','CD135'] },

  // ── Adhesion / trafficking ───────────────────────────────────
  { name:'CD29',    density:'high',     category:'Adhesion',      aliases:['Integrin b1','ITGB1'] },
  { name:'CD31',    density:'high',     category:'Adhesion',      aliases:['PECAM-1'] },
  { name:'CD49a',   density:'medium',   category:'Adhesion',      aliases:['Integrin a1','VLA-1'] },
  { name:'CD49b',   density:'medium',   category:'Adhesion',      aliases:['Integrin a2','VLA-2'] },
  { name:'CD49d',   density:'medium',   category:'Adhesion',      aliases:['Integrin a4','VLA-4'] },
  { name:'CD49f',   density:'medium',   category:'Adhesion',      aliases:['Integrin a6','VLA-6'] },
  { name:'CD62L',   density:'medium',   category:'Adhesion',      aliases:['L-selectin','LAM-1'] },
  { name:'CD62P',   density:'low',      category:'Adhesion',      aliases:['P-selectin'] },
  { name:'CD103',   density:'low',      category:'Adhesion',      aliases:['Integrin aE','ITGAE'] },
  { name:'CD162',   density:'medium',   category:'Adhesion',      aliases:['PSGL-1'] },

  // ── Cytokines / functional ───────────────────────────────────
  { name:'IFN-g',   density:'very low', category:'Cytokine',      aliases:['IFNgamma','IFNG'] },
  { name:'TNF-a',   density:'very low', category:'Cytokine',      aliases:['TNFalpha','TNF'] },
  { name:'IL-2',    density:'very low', category:'Cytokine',      aliases:['IL2'] },
  { name:'IL-4',    density:'very low', category:'Cytokine',      aliases:['IL4'] },
  { name:'IL-6',    density:'very low', category:'Cytokine',      aliases:['IL6'] },
  { name:'IL-10',   density:'very low', category:'Cytokine',      aliases:['IL10'] },
  { name:'IL-17',   density:'very low', category:'Cytokine',      aliases:['IL17','IL17A'] },
  { name:'IL-21',   density:'very low', category:'Cytokine',      aliases:['IL21'] },
  { name:'granzyme A', density:'very low', category:'Cytokine',   aliases:['GzmA'] },
  { name:'granzyme B', density:'very low', category:'Cytokine',   aliases:['GzmB'] },
  { name:'perforin',   density:'very low', category:'Cytokine',   aliases:[] },

  // ── Transcription factors ────────────────────────────────────
  { name:'T-bet',   density:'very low', category:'Transcription', aliases:['TBX21'] },
  { name:'GATA-3',  density:'very low', category:'Transcription', aliases:['GATA3'] },
  { name:'RORgt',   density:'very low', category:'Transcription', aliases:['RORgamma t','RORC'] },
  { name:'BCL-6',   density:'very low', category:'Transcription', aliases:['BCL6'] },
  { name:'BCL-2',   density:'very low', category:'Transcription', aliases:['BCL2'] },
  { name:'TCF-1',   density:'very low', category:'Transcription', aliases:['TCF7'] },
  { name:'Eomes',   density:'very low', category:'Transcription', aliases:['EOMES'] },
  { name:'BCL11B',  density:'very low', category:'Transcription', aliases:[] },

  // ── Tumor / cancer markers ───────────────────────────────────
  { name:'EpCAM',   density:'high',     category:'Tumor',         aliases:['CD326','TACSTD1'] },
  { name:'HER2',    density:'medium',   category:'Tumor',         aliases:['CD340','ERBB2'] },
  { name:'EGFR',    density:'medium',   category:'Tumor',         aliases:['CD171','ERBB1'] },
  { name:'PD-L1',   density:'low',      category:'Tumor',         aliases:['CD274','B7-H1'] },
  { name:'PD-L2',   density:'low',      category:'Tumor',         aliases:['CD273','B7-DC'] },
  { name:'CD44',    density:'high',     category:'Tumor',         aliases:[] },
  { name:'CD133',   density:'low',      category:'Tumor',         aliases:['Prominin-1'] },

  // ── Viability (placeholder rows for panel display) ───────────
  { name:'Viability', density:'high',   category:'Viability',     aliases:['live dead','live/dead','viab'] },
];

// ── Lookup helpers ────────────────────────────────────────────
function getMarker(name) {
  const n = (name || '').toLowerCase().trim();
  return MARKERS.find(m =>
    m.name.toLowerCase() === n ||
    (m.aliases || []).some(a => a.toLowerCase() === n)
  ) || null;
}

function getMarkerDensity(name) {
  const m = getMarker(name);
  return m ? m.density : 'medium';
}

function getMarkersByCategory(category) {
  return MARKERS.filter(m => m.category === category);
}

// Expose globals
window.MARKERS           = MARKERS;
window.getMarker         = getMarker;
window.getMarkerDensity  = getMarkerDensity;
window.getMarkersByCategory = getMarkersByCategory;
