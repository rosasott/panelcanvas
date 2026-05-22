// PanelCanvas — Co-expression Rules v2
// Biological relationships between markers for spectral conflict classification
// and auto-builder laser assignment logic.
//
// Primary sources:
//   Perfetto et al. 2019 Front. Immunol. PMC6820661 (quantitative ABC atlas)
//   Human Cell Atlas immune cell reference (2022)
//   HIMC Stanford immune monitoring marker co-expression database
//
// Relation types:
//   exclusive    — markers never co-expressed on same cell. Spectral conflict OK.
//   subset       — one marker is expressed on a strict subset of the other's cells.
//                  Conflict NOT OK — co-positive cells exist.
//   co-expressed — markers overlap substantially on same populations.
//                  Conflict NOT OK.
//   independent  — no consistent relationship across populations.
//                  Treat conflict at face value (NOT OK by default).
//
// Confidence:
//   'high'   — well-established, textbook biology
//   'medium' — context-dependent or population-specific
//   'low'    — emerging evidence, use with caution
//
// Default for any pair not listed: 'independent' → conflict NOT OK.

'use strict';

const COEXPRESSION_RULES = [

  // ══════════════════════════════════════════════════════════════
  // LINEAGE EXCLUSIONS — major immune compartment separations
  // ══════════════════════════════════════════════════════════════

  // T cell vs B cell
  ['CD3',  'CD19', 'exclusive', 'high'],
  ['CD3',  'CD20', 'exclusive', 'high'],
  ['CD3',  'CD79a','exclusive', 'high'],
  ['CD3',  'CD79b','exclusive', 'high'],
  ['CD3',  'IgD',  'exclusive', 'high'],
  ['CD3',  'IgM',  'exclusive', 'high'],

  // T cell vs Myeloid
  ['CD3',  'CD14', 'exclusive', 'high'],
  ['CD3',  'CD11b','exclusive', 'high'],
  ['CD3',  'CD11c','exclusive', 'high'],
  ['CD3',  'CD15', 'exclusive', 'high'],
  ['CD3',  'CD66b','exclusive', 'high'],
  ['CD3',  'CD33', 'exclusive', 'high'],
  ['CD3',  'CD68', 'exclusive', 'high'],
  ['CD3',  'CD64', 'exclusive', 'high'],
  ['CD3',  'CD163','exclusive', 'high'],

  // T cell vs NK (CD56 can be on NKT — independent)
  ['CD3',  'CD56', 'independent','high'],
  ['CD3',  'CD16', 'independent','medium'],
  ['CD3',  'NKp46','exclusive', 'high'],
  ['CD3',  'NKG2A','exclusive', 'medium'],

  // B cell vs Myeloid
  ['CD19', 'CD14', 'exclusive', 'high'],
  ['CD19', 'CD11b','exclusive', 'high'],
  ['CD19', 'CD11c','exclusive', 'high'],
  ['CD19', 'CD33', 'exclusive', 'high'],
  ['CD19', 'CD15', 'exclusive', 'high'],
  ['CD19', 'CD66b','exclusive', 'high'],
  ['CD19', 'CD68', 'exclusive', 'high'],
  ['CD20', 'CD14', 'exclusive', 'high'],
  ['CD20', 'CD11b','exclusive', 'high'],
  ['CD20', 'CD11c','exclusive', 'high'],

  // B cell vs NK
  ['CD19', 'CD56', 'exclusive', 'high'],
  ['CD19', 'CD16', 'exclusive', 'high'],
  ['CD20', 'CD56', 'exclusive', 'high'],
  ['CD20', 'CD16', 'exclusive', 'high'],

  // NK vs Myeloid
  ['CD56', 'CD14', 'exclusive', 'high'],
  ['CD56', 'CD11c','exclusive', 'high'],
  ['CD56', 'CD19', 'exclusive', 'high'],
  ['CD56', 'CD20', 'exclusive', 'high'],

  // Granulocyte vs lymphocyte
  ['CD66b','CD3',  'exclusive', 'high'],
  ['CD66b','CD19', 'exclusive', 'high'],
  ['CD66b','CD56', 'exclusive', 'high'],
  ['CD15', 'CD3',  'exclusive', 'high'],
  ['CD15', 'CD19', 'exclusive', 'high'],
  ['CD15', 'CD56', 'exclusive', 'high'],

  // ══════════════════════════════════════════════════════════════
  // T CELL SUBSETS
  // ══════════════════════════════════════════════════════════════

  // CD3 co-expression with helper/cytotoxic — CRITICAL for auto-builder
  ['CD3',  'CD4',  'co-expressed','high'],   // CD4 T cells are CD3+CD4+
  ['CD3',  'CD8',  'co-expressed','high'],   // CD8 T cells are CD3+CD8+
  ['CD3',  'CD5',  'co-expressed','high'],
  ['CD3',  'CD7',  'co-expressed','high'],
  ['CD3',  'CD2',  'co-expressed','high'],
  ['CD3',  'TCRab','co-expressed','high'],
  ['CD3',  'TCRgd','co-expressed','high'],

  // CD4 vs CD8 — mutually exclusive on conventional T cells
  ['CD4',  'CD8',  'exclusive',   'high'],

  // CD4 co-expression
  ['CD4',  'CD5',  'co-expressed','high'],
  ['CD4',  'CD7',  'co-expressed','high'],
  ['CD4',  'CD45RA','co-expressed','medium'],
  ['CD4',  'CCR7', 'co-expressed','medium'],
  ['CD4',  'CD27', 'co-expressed','medium'],
  ['CD4',  'CD28', 'co-expressed','high'],

  // CD8 co-expression
  ['CD8',  'CD5',  'co-expressed','high'],
  ['CD8',  'CD7',  'co-expressed','high'],
  ['CD8',  'CD45RA','co-expressed','medium'],
  ['CD8',  'CCR7', 'co-expressed','medium'],
  ['CD8',  'CD27', 'co-expressed','medium'],
  ['CD8',  'CD57', 'co-expressed','medium'],

  // Memory / differentiation
  ['CD45RA','CD45RO','exclusive', 'high'],
  ['CD45RA','CCR7',  'co-expressed','medium'],
  ['CD45RO','CCR7',  'co-expressed','medium'],
  ['CCR7',  'CD27',  'co-expressed','medium'],
  ['CCR7',  'CD62L', 'co-expressed','high'],
  ['CD27',  'CD28',  'co-expressed','high'],
  ['CD57',  'CD27',  'exclusive',   'medium'],
  ['CD57',  'CCR7',  'exclusive',   'medium'],
  ['CD57',  'CD28',  'exclusive',   'medium'],

  // ══════════════════════════════════════════════════════════════
  // T REGULATORY (Treg)
  // ══════════════════════════════════════════════════════════════
  ['FoxP3', 'CD4',   'subset',      'high'],
  ['FoxP3', 'CD3',   'subset',      'high'],
  ['FoxP3', 'CD25',  'co-expressed','high'],
  ['FoxP3', 'CD127', 'exclusive',   'high'],   // FoxP3hi CD127lo defines Tregs
  ['FoxP3', 'Helios','co-expressed','medium'],
  ['FoxP3', 'CTLA-4','co-expressed','high'],
  ['FoxP3', 'GITR',  'co-expressed','medium'],
  ['FoxP3', 'CCR8',  'co-expressed','medium'],
  ['FoxP3', 'CD8',   'exclusive',   'high'],
  ['FoxP3', 'CD19',  'exclusive',   'high'],
  ['CD25',  'CD127', 'exclusive',   'high'],
  ['CD25',  'CD4',   'independent', 'medium'],  // CD25 on activated non-Treg CD4 too

  // ══════════════════════════════════════════════════════════════
  // T CELL EXHAUSTION / CHECKPOINT
  // ══════════════════════════════════════════════════════════════
  ['PD-1',  'TIGIT', 'co-expressed','high'],
  ['PD-1',  'LAG-3', 'co-expressed','high'],
  ['PD-1',  'TIM-3', 'co-expressed','high'],
  ['PD-1',  'CTLA-4','co-expressed','medium'],
  ['PD-1',  '2B4',   'co-expressed','medium'],
  ['PD-1',  'CD39',  'co-expressed','high'],
  ['PD-1',  'TOX',   'co-expressed','high'],
  ['TIGIT', 'LAG-3', 'co-expressed','high'],
  ['TIGIT', 'TIM-3', 'co-expressed','high'],
  ['LAG-3', 'TIM-3', 'co-expressed','high'],
  ['PD-1',  'CD8',   'subset',      'medium'],  // exhausted CD8 T cells
  ['PD-1',  'CD4',   'independent', 'medium'],
  ['TIM-3', 'CD8',   'subset',      'medium'],
  ['LAG-3', 'CD8',   'subset',      'medium'],
  ['TIGIT', 'CD8',   'subset',      'medium'],
  ['TOX',   'CD8',   'subset',      'medium'],
  ['CD39',  'CD25',  'co-expressed','medium'],
  ['CD39',  'FoxP3', 'co-expressed','medium'],

  // ══════════════════════════════════════════════════════════════
  // T CELL ACTIVATION
  // ══════════════════════════════════════════════════════════════
  ['CD69',   'CD3',    'subset',      'medium'],
  ['CD69',   'CD25',   'co-expressed','medium'],
  ['CD69',   'HLA-DR', 'co-expressed','medium'],
  ['CD38',   'HLA-DR', 'co-expressed','high'],
  ['CD38',   'CD25',   'co-expressed','medium'],
  ['CD25',   'CD69',   'co-expressed','medium'],
  ['HLA-DR', 'CD3',    'subset',      'medium'],
  ['HLA-DR', 'CD4',    'subset',      'medium'],
  ['HLA-DR', 'CD8',    'subset',      'medium'],
  ['ICOS',   'PD-1',   'co-expressed','medium'],
  ['ICOS',   'CD4',    'subset',      'medium'],
  ['OX40',   'CD4',    'subset',      'medium'],
  ['4-1BB',  'CD8',    'subset',      'medium'],
  ['4-1BB',  'CD4',    'independent', 'medium'],
  ['CD40L',  'CD4',    'subset',      'medium'],
  ['Ki67',   'CD3',    'independent', 'high'],   // cycling cells across compartments
  ['Ki67',   'CD4',    'independent', 'medium'],
  ['Ki67',   'CD8',    'independent', 'medium'],
  ['Ki67',   'CD19',   'independent', 'medium'],

  // ══════════════════════════════════════════════════════════════
  // TISSUE RESIDENT / SPECIALIZED T CELLS
  // ══════════════════════════════════════════════════════════════
  ['CD103', 'CD8',   'subset',       'high'],
  ['CD103', 'CD4',   'independent',  'medium'],
  ['CD103', 'CD49a', 'co-expressed', 'medium'],
  ['CD161', 'CD8',   'independent',  'high'],
  ['CD161', 'CD4',   'independent',  'medium'],
  ['CD161', 'CD56',  'co-expressed', 'medium'],   // NKT-like
  ['CXCR5', 'CD4',   'subset',       'medium'],   // T follicular helper
  ['CXCR5', 'BCL-6', 'co-expressed', 'high'],
  ['CXCR5', 'PD-1',  'co-expressed', 'high'],

  // ══════════════════════════════════════════════════════════════
  // EFFECTOR FUNCTION
  // ══════════════════════════════════════════════════════════════
  ['granzyme B','CD8',       'subset',       'high'],
  ['granzyme B','perforin',  'co-expressed', 'high'],
  ['granzyme B','CD56',      'subset',       'medium'],
  ['granzyme A','granzyme B','co-expressed', 'medium'],
  ['perforin',  'CD56',      'subset',       'medium'],
  ['perforin',  'CD8',       'subset',       'medium'],
  ['IFN-g',     'CD8',       'independent',  'medium'],
  ['IFN-g',     'CD4',       'independent',  'medium'],
  ['IFN-g',     'T-bet',     'co-expressed', 'high'],
  ['IFN-g',     'TNF-a',     'co-expressed', 'medium'],
  ['IFN-g',     'IL-2',      'co-expressed', 'medium'],
  ['TNF-a',     'IL-2',      'co-expressed', 'medium'],
  ['IL-4',      'GATA-3',    'co-expressed', 'high'],
  ['IL-4',      'IFN-g',     'exclusive',    'high'],
  ['IL-17',     'RORgt',     'co-expressed', 'high'],
  ['IL-17',     'IFN-g',     'exclusive',    'medium'],
  ['IL-21',     'BCL-6',     'co-expressed', 'medium'],

  // ══════════════════════════════════════════════════════════════
  // TRANSCRIPTION FACTORS
  // ══════════════════════════════════════════════════════════════
  ['T-bet',  'GATA-3', 'exclusive',   'high'],
  ['T-bet',  'RORgt',  'exclusive',   'high'],
  ['T-bet',  'FoxP3',  'exclusive',   'medium'],
  ['T-bet',  'BCL-6',  'exclusive',   'medium'],
  ['GATA-3', 'RORgt',  'exclusive',   'high'],
  ['GATA-3', 'FoxP3',  'exclusive',   'medium'],
  ['GATA-3', 'CD4',    'subset',      'medium'],
  ['RORgt',  'CD4',    'subset',      'medium'],
  ['RORgt',  'CD8',    'independent', 'low'],
  ['BCL-6',  'CD4',    'subset',      'medium'],
  ['Eomes',  'T-bet',  'co-expressed','medium'],
  ['Eomes',  'CD8',    'independent', 'medium'],
  ['TCF-1',  'CD8',    'subset',      'medium'],
  ['TCF-1',  'PD-1',   'co-expressed','medium'],
  ['TCF-1',  'TOX',    'exclusive',   'medium'],
  ['BCL11B', 'CD3',    'co-expressed','medium'],
  ['BCL11B', 'CD56',   'exclusive',   'medium'],
  ['BCL-2',  'CD4',    'subset',      'medium'],
  ['BCL-2',  'CD8',    'subset',      'medium'],
  ['BCL-2',  'FoxP3',  'co-expressed','medium'],

  // ══════════════════════════════════════════════════════════════
  // NK CELL SUBSETS
  // ══════════════════════════════════════════════════════════════
  ['CD56',   'CD16',   'co-expressed','high'],   // NK cells co-express both
  ['CD56',   'NKp46',  'subset',      'high'],
  ['CD56',   'NKG2A',  'subset',      'high'],
  ['CD56',   'NKG2D',  'subset',      'high'],
  ['CD56',   'NKG2C',  'subset',      'medium'],
  ['CD56',   'DNAM-1', 'subset',      'high'],
  ['CD56',   'KIR',    'subset',      'medium'],
  ['CD56',   'CD57',   'subset',      'medium'],   // mature NK cells
  ['NKG2A',  'NKG2C',  'exclusive',   'high'],     // mutually exclusive NK receptors
  ['NKG2A',  'CD57',   'exclusive',   'medium'],
  ['NKG2C',  'CD57',   'co-expressed','medium'],
  ['KIR',    'NKG2A',  'independent', 'medium'],
  ['CD57',   'CD56',   'subset',      'medium'],
  ['CD57',   'NKp46',  'co-expressed','medium'],
  ['NKG2D',  'NKp46',  'co-expressed','high'],

  // ══════════════════════════════════════════════════════════════
  // B CELL SUBSETS
  // ══════════════════════════════════════════════════════════════
  ['CD19',  'CD20',  'co-expressed', 'high'],
  ['CD19',  'CD22',  'co-expressed', 'high'],
  ['CD19',  'CD79a', 'co-expressed', 'high'],
  ['CD19',  'CD79b', 'co-expressed', 'high'],
  ['CD19',  'IgD',   'subset',       'high'],
  ['CD19',  'IgM',   'subset',       'high'],
  ['CD19',  'CD24',  'subset',       'high'],
  ['CD19',  'CD10',  'subset',       'high'],
  ['CD20',  'IgD',   'subset',       'high'],
  ['IgD',   'IgM',   'co-expressed', 'medium'],   // naive B cells
  ['IgD',   'IgG',   'exclusive',    'high'],      // switched vs unswitched
  ['IgM',   'IgG',   'exclusive',    'high'],
  ['CD27',  'IgD',   'independent',  'medium'],
  ['CD27',  'CD19',  'subset',       'medium'],    // memory B cells
  ['CD38',  'CD19',  'subset',       'medium'],
  ['CD138', 'CD19',  'exclusive',    'medium'],    // plasmablasts lose CD19
  ['CD138', 'CD20',  'exclusive',    'high'],
  ['CD138', 'CD38',  'co-expressed', 'high'],
  ['CD319', 'CD138', 'co-expressed', 'high'],
  ['CD21',  'CD19',  'subset',       'high'],
  ['CD23',  'CD19',  'subset',       'medium'],

  // ══════════════════════════════════════════════════════════════
  // MYELOID / MONOCYTE SUBSETS
  // ══════════════════════════════════════════════════════════════
  ['CD14',  'CD11b', 'co-expressed', 'high'],
  ['CD14',  'CD11c', 'co-expressed', 'high'],
  ['CD14',  'CD33',  'co-expressed', 'high'],
  ['CD14',  'CD64',  'co-expressed', 'high'],
  ['CD14',  'CD68',  'co-expressed', 'medium'],
  ['CD14',  'CD163', 'co-expressed', 'medium'],
  ['CD14',  'CD16',  'independent',  'high'],    // classical vs non-classical monocytes
  ['CD16',  'CD11b', 'co-expressed', 'high'],
  ['CD11b', 'CD11c', 'co-expressed', 'high'],
  ['CD11b', 'CD33',  'co-expressed', 'high'],
  ['CD64',  'CD14',  'co-expressed', 'high'],
  ['CD64',  'CD11c', 'co-expressed', 'medium'],
  ['CD163', 'CD14',  'co-expressed', 'medium'],
  ['CD206', 'CD14',  'co-expressed', 'medium'],
  ['CD206', 'CD163', 'co-expressed', 'medium'],
  ['CD86',  'CD14',  'subset',       'medium'],
  ['CD86',  'CD11c', 'subset',       'medium'],
  ['HLA-DR','CD14',  'subset',       'high'],
  ['HLA-DR','CD11c', 'subset',       'high'],
  ['CX3CR1','CD14',  'co-expressed', 'medium'],
  ['CCR2',  'CD14',  'co-expressed', 'medium'],
  ['CCR2',  'CX3CR1','exclusive',    'medium'],   // classical vs patrolling

  // ══════════════════════════════════════════════════════════════
  // DENDRITIC CELL SUBSETS
  // ══════════════════════════════════════════════════════════════
  ['CD1c',  'CD11c', 'subset',       'high'],
  ['CD141', 'CD11c', 'subset',       'high'],
  ['CD1c',  'CD141', 'exclusive',    'high'],     // cDC1 vs cDC2
  ['XCR1',  'CD141', 'co-expressed', 'high'],
  ['XCR1',  'CD1c',  'exclusive',    'high'],
  ['CD370', 'CD141', 'co-expressed', 'high'],
  ['CD123', 'CD303', 'co-expressed', 'high'],     // pDC
  ['CD123', 'CD11c', 'exclusive',    'medium'],
  ['CD303', 'CD11c', 'exclusive',    'high'],
  ['CD303', 'CD1c',  'exclusive',    'high'],
  ['CD304', 'CD303', 'co-expressed', 'high'],     // pDC
  ['CD80',  'CD11c', 'subset',       'medium'],
  ['CD86',  'CD11c', 'subset',       'high'],
  ['CD40',  'CD80',  'co-expressed', 'medium'],
  ['CD40',  'CD86',  'co-expressed', 'medium'],
  ['PD-L1', 'CD11c', 'independent',  'medium'],
  ['PD-L1', 'CD14',  'independent',  'medium'],
  ['PD-L2', 'CD11c', 'subset',       'medium'],

  // ══════════════════════════════════════════════════════════════
  // GRANULOCYTES
  // ══════════════════════════════════════════════════════════════
  ['CD15',  'CD66b', 'co-expressed', 'high'],
  ['CD15',  'CD11b', 'co-expressed', 'high'],
  ['CD66b', 'CD11b', 'co-expressed', 'high'],
  ['CD193', 'CD66b', 'subset',       'medium'],   // eosinophils
  ['Siglec-8','CD66b','subset',      'medium'],

  // ══════════════════════════════════════════════════════════════
  // PAN-LEUKOCYTE
  // ══════════════════════════════════════════════════════════════
  ['CD45',  'CD3',   'subset',       'high'],
  ['CD45',  'CD19',  'subset',       'high'],
  ['CD45',  'CD14',  'subset',       'high'],
  ['CD45',  'CD11b', 'subset',       'high'],
  ['CD45',  'CD56',  'subset',       'high'],
  ['CD45',  'CD15',  'subset',       'high'],
  ['CD45',  'CD16',  'subset',       'high'],
  ['CD45',  'CD4',   'subset',       'high'],
  ['CD45',  'CD8',   'subset',       'high'],
  ['CD45',  'CD20',  'subset',       'high'],

  // ══════════════════════════════════════════════════════════════
  // HEMATOPOIETIC PROGENITORS
  // ══════════════════════════════════════════════════════════════
  ['CD34',  'CD45',  'independent',  'medium'],
  ['CD34',  'CD117', 'co-expressed', 'high'],
  ['CD34',  'CD133', 'co-expressed', 'high'],
  ['CD34',  'CD90',  'co-expressed', 'medium'],
  ['CD34',  'CD3',   'exclusive',    'high'],
  ['CD34',  'CD19',  'exclusive',    'high'],
  ['CD34',  'CD14',  'exclusive',    'high'],
  ['CD90',  'CD45',  'exclusive',    'medium'],
  ['CD117', 'CD34',  'co-expressed', 'high'],
  ['CD135', 'CD34',  'co-expressed', 'medium'],

  // ══════════════════════════════════════════════════════════════
  // ENDOTHELIAL / STROMAL
  // ══════════════════════════════════════════════════════════════
  ['CD31',  'CD45',  'independent',  'medium'],
  ['CD31',  'CD34',  'co-expressed', 'medium'],
  ['CD105', 'CD31',  'co-expressed', 'medium'],
  ['PDGFRA','CD45',  'exclusive',    'high'],
  ['PDGFRB','CD45',  'exclusive',    'high'],
  ['PDGFRA','PDGFRB','co-expressed', 'medium'],
  ['EpCAM', 'CD45',  'exclusive',    'high'],
  ['EpCAM', 'CD31',  'exclusive',    'high'],

  // ══════════════════════════════════════════════════════════════
  // VIABILITY — independent of all lineage markers
  // ══════════════════════════════════════════════════════════════
  ['Viability','CD3',  'independent', 'high'],
  ['Viability','CD4',  'independent', 'high'],
  ['Viability','CD8',  'independent', 'high'],
  ['Viability','CD19', 'independent', 'high'],
  ['Viability','CD45', 'independent', 'high'],
  ['Viability','CD14', 'independent', 'high'],
  ['Viability','CD56', 'independent', 'high'],
  ['Viability','CD20', 'independent', 'high'],
  ['Viability','CD16', 'independent', 'high'],
  ['Viability','CD11b','independent', 'high'],

];

// ══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════════

/**
 * Look up the co-expression rule for a pair of markers.
 * Case-insensitive. Returns {relation, confidence} or null.
 */
function getCoExpression(markerA, markerB) {
  const a = (markerA || '').trim().toLowerCase();
  const b = (markerB || '').trim().toLowerCase();
  if (!a || !b || a === b) return null;
  const rule = COEXPRESSION_RULES.find(r =>
    (r[0].toLowerCase() === a && r[1].toLowerCase() === b) ||
    (r[0].toLowerCase() === b && r[1].toLowerCase() === a)
  );
  return rule ? { relation: rule[2], confidence: rule[3] } : null;
}

/**
 * Given a relation string, decide whether a spectral conflict is
 * biologically acceptable (i.e. markers are never on the same cell).
 */
function isConflictAcceptable(relation) {
  return relation === 'exclusive';
}

/**
 * Higher-level: classify a marker pair's conflict status.
 * Returns:
 *   'safe'        — exclusive markers; spectral conflict is biologically OK
 *   'problematic' — markers co-express or overlap; conflict matters
 *   'unknown'     — no rule found; default to problematic
 */
function classifyMarkerPair(markerA, markerB) {
  const rule = getCoExpression(markerA, markerB);
  if (!rule) return { status: 'unknown', relation: null, confidence: null };
  if (isConflictAcceptable(rule.relation)) {
    return { status: 'safe', relation: rule.relation, confidence: rule.confidence };
  }
  return { status: 'problematic', relation: rule.relation, confidence: rule.confidence };
}

/**
 * Returns true if two markers must be on separate lasers
 * (co-expressed or subset — spectral mixing would land on real signal).
 */
function mustSeparateMarkers(markerA, markerB) {
  const rule = getCoExpression(markerA, markerB);
  if (!rule) return false; // unknown → don't force separation
  return rule.relation === 'co-expressed' || rule.relation === 'subset';
}

/**
 * Returns true if two markers can safely share spectral space
 * (exclusive — never on the same cell).
 */
function canShareSpectralSpace(markerA, markerB) {
  const rule = getCoExpression(markerA, markerB);
  return rule ? rule.relation === 'exclusive' : false;
}

// ── Expose globals ────────────────────────────────────────────
window.COEXPRESSION_RULES    = COEXPRESSION_RULES;
window.getCoExpression       = getCoExpression;
window.isConflictAcceptable  = isConflictAcceptable;
window.classifyMarkerPair    = classifyMarkerPair;
window.mustSeparateMarkers   = mustSeparateMarkers;
window.canShareSpectralSpace = canShareSpectralSpace;
