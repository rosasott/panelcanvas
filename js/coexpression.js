// PanelCanvas — Co-expression Rules
// Curated rules describing biological relationships between markers.
// Used to determine whether a spectral conflict is acceptable (markers
// are not co-expressed on the same cells) or problematic (markers do
// co-stain the same population, so spread will land on real signal).
//
// Relation types:
//   exclusive    — markers never co-expressed on same cell. Conflicts OK.
//   subset       — one is a strict subset of the other. Conflict NOT OK.
//   co-expressed — overlapping populations. Conflict NOT OK.
//   independent  — no consistent relationship. Treat conflict at face value.
//
// Default for any pair not in this table is 'independent'.

const COEXPRESSION_RULES = [
  // Major lineage exclusions
  ['CD3','CD19','exclusive','high'],
  ['CD3','CD20','exclusive','high'],
  ['CD3','CD14','exclusive','high'],
  ['CD3','CD11b','exclusive','high'],
  ['CD3','CD11c','exclusive','high'],
  ['CD3','CD15','exclusive','high'],
  ['CD3','CD66b','exclusive','high'],
  ['CD3','CD56','independent','high'],
  ['CD3','CD16','independent','medium'],
  ['CD19','CD14','exclusive','high'],
  ['CD19','CD11b','exclusive','high'],
  ['CD19','CD11c','exclusive','high'],
  ['CD19','CD56','exclusive','high'],
  ['CD20','CD14','exclusive','high'],
  ['CD20','CD11b','exclusive','high'],
  ['CD14','CD19','exclusive','high'],
  ['CD14','CD11c','co-expressed','high'],
  ['CD14','CD16','independent','high'],
  ['CD11b','CD11c','co-expressed','high'],
  ['CD15','CD66b','co-expressed','high'],
  ['CD56','CD16','co-expressed','high'],
  ['CD56','CD19','exclusive','high'],
  ['CD56','CD20','exclusive','high'],

  // T cell subsets
  ['CD4','CD8','exclusive','high'],
  ['CD45RA','CD45RO','exclusive','high'],
  ['CD45RA','CCR7','co-expressed','medium'],
  ['CD45RO','CCR7','co-expressed','medium'],
  ['CCR7','CD27','co-expressed','medium'],
  ['CCR7','CD62L','co-expressed','high'],

  // Treg
  ['FoxP3','CD4','subset','high'],
  ['FoxP3','CD3','subset','high'],
  ['FoxP3','CD25','co-expressed','high'],
  ['FoxP3','CD127','exclusive','high'],
  ['FoxP3','Helios','co-expressed','medium'],
  ['FoxP3','CTLA-4','co-expressed','high'],
  ['FoxP3','GITR','co-expressed','medium'],
  ['FoxP3','CCR8','co-expressed','medium'],
  ['FoxP3','CD8','exclusive','high'],

  // T cell activation / exhaustion
  ['PD-1','TIGIT','co-expressed','high'],
  ['PD-1','LAG-3','co-expressed','high'],
  ['PD-1','TIM-3','co-expressed','high'],
  ['PD-1','CTLA-4','co-expressed','medium'],
  ['TIGIT','LAG-3','co-expressed','high'],
  ['TIGIT','TIM-3','co-expressed','high'],
  ['LAG-3','TIM-3','co-expressed','high'],
  ['PD-1','CD8','subset','medium'],
  ['PD-1','CD4','independent','medium'],
  ['CD25','CD69','co-expressed','medium'],
  ['CD25','HLA-DR','co-expressed','medium'],
  ['CD38','HLA-DR','co-expressed','high'],
  ['CD38','CD25','co-expressed','medium'],
  ['CD39','CD25','co-expressed','medium'],
  ['ICOS','PD-1','co-expressed','medium'],
  ['ICOS','CD4','subset','medium'],
  ['OX40','CD4','subset','medium'],
  ['4-1BB','CD8','subset','medium'],
  ['4-1BB','CD4','independent','medium'],

  // Tissue resident
  ['CD103','CD8','subset','high'],
  ['CD103','CD4','independent','medium'],
  ['CD161','CD8','independent','high'],

  // Effector
  ['Granzyme B','CD8','subset','high'],
  ['Granzyme B','Perforin','co-expressed','high'],
  ['Granzyme K','Granzyme B','independent','medium'],
  ['IFN-γ','CD8','independent','medium'],
  ['IFN-γ','T-bet','co-expressed','high'],
  ['IFN-γ','TNF-α','co-expressed','medium'],
  ['IFN-γ','IL-2','co-expressed','medium'],
  ['TNF-α','IL-2','co-expressed','medium'],
  ['IL-4','GATA-3','co-expressed','high'],
  ['IL-17','RORγt','co-expressed','high'],
  ['IL-21','BCL-6','co-expressed','medium'],

  // Transcription factor lineage
  ['T-bet','GATA-3','exclusive','high'],
  ['T-bet','RORγt','exclusive','high'],
  ['GATA-3','RORγt','exclusive','high'],
  ['T-bet','FoxP3','exclusive','medium'],
  ['EOMES','T-bet','co-expressed','medium'],
  ['EOMES','CD8','independent','medium'],

  // Proliferation
  ['Ki-67','CD3','independent','high'],

  // B cell subsets
  ['CD19','CD20','co-expressed','high'],
  ['CD19','IgD','subset','high'],
  ['CD19','IgM','subset','high'],
  ['IgD','IgM','co-expressed','medium'],
  ['CD27','IgD','independent','medium'],
  ['CD138','CD19','exclusive','medium'],
  ['CD138','CD20','exclusive','high'],
  ['CD24','CD19','subset','high'],
  ['CD10','CD19','subset','high'],

  // NK subsets
  ['CD56','CD3','exclusive','medium'],
  ['NKG2A','CD56','subset','high'],
  ['NKG2C','CD56','subset','medium'],
  ['NKG2D','CD56','subset','high'],
  ['NKp46','CD56','subset','high'],
  ['NKp44','CD56','subset','medium'],
  ['NKG2A','NKG2C','independent','medium'],
  ['KIR2DL1','CD56','subset','medium'],
  ['KIR2DL2','CD56','subset','medium'],
  ['CD57','CD56','subset','medium'],

  // DC subsets
  ['CD1c','CD11c','subset','high'],
  ['CD141','CD11c','subset','high'],
  ['XCR1','CD141','co-expressed','high'],
  ['CD1c','CD141','exclusive','high'],
  ['CD123','CD303','co-expressed','high'],
  ['CD123','CD11c','exclusive','medium'],
  ['CD303','CD11c','exclusive','high'],

  // Endothelial / stromal
  ['CD31','CD45','independent','medium'],
  ['CD31','CD34','co-expressed','medium'],
  ['CD34','CD45','independent','medium'],
  ['CD90','CD45','exclusive','medium'],
  ['CD105','CD31','co-expressed','medium'],
  ['PDGFRA','CD45','exclusive','high'],
  ['PDGFRB','CD45','exclusive','high'],
  ['PDGFRA','PDGFRB','co-expressed','medium'],

  // Co-stim
  ['CD80','CD86','co-expressed','high'],
  ['CD80','CD11c','subset','medium'],
  ['CD86','CD11c','subset','medium'],
  ['CD40','CD80','co-expressed','medium'],
  ['CD40','CD86','co-expressed','medium'],
  ['CD40L','CD4','subset','medium'],
  ['PD-L1','CD11c','independent','medium'],
  ['PD-L1','CD14','independent','medium'],
  ['PD-L2','CD11c','subset','medium'],

  // CD45 is on all leukocytes
  ['CD45','CD3','subset','high'],
  ['CD45','CD19','subset','high'],
  ['CD45','CD14','subset','high'],
  ['CD45','CD11b','subset','high'],
  ['CD45','CD56','subset','high'],
  ['CD45','CD15','subset','high'],
  ['CD45','CD16','subset','high'],

  // Viability
  ['Viability','CD3','independent','high'],
  ['Viability','CD4','independent','high'],
  ['Viability','CD8','independent','high'],
  ['Viability','CD19','independent','high'],
  ['Viability','CD45','independent','high'],
];

// Build a fast lookup map: "MARKER_A__MARKER_B" -> { relation, confidence }
// Symmetric: looking up A,B returns same as B,A
const _coExprMap = (() => {
  const map = {};
  COEXPRESSION_RULES.forEach(([a, b, rel, conf]) => {
    map[`${a}__${b}`] = { relation: rel, confidence: conf };
    map[`${b}__${a}`] = { relation: rel, confidence: conf };
  });
  return map;
})();

// Look up the relationship between two markers.
// Returns { relation, confidence } or null if no rule defined.
function getCoExpression(markerA, markerB) {
  if (!markerA || !markerB) return null;
  return _coExprMap[`${markerA}__${markerB}`] || null;
}

// Given a relation, decide whether a spectral conflict between these
// two markers is biologically acceptable.
//   exclusive    -> conflict OK (markers never on same cell)
//   subset       -> conflict NOT OK (co-positive cells exist)
//   co-expressed -> conflict NOT OK
//   independent  -> conflict NOT OK (treat at face value)
//   null         -> conflict NOT OK (no rule, assume risk)
function isConflictAcceptable(relation) {
  return relation === 'exclusive';
}

// Higher-level: given two markers in a panel, classify their conflict status.
// Returns one of:
//   'safe'           — exclusive markers; spectral conflict is biologically OK
//   'problematic'    — markers co-express or unrelated; conflict matters
//   'unknown'        — no rule, defaulting to problematic with note
function classifyMarkerPair(markerA, markerB) {
  const rule = getCoExpression(markerA, markerB);
  if (!rule) return { status: 'unknown', relation: null, confidence: null };
  if (isConflictAcceptable(rule.relation)) {
    return { status: 'safe', relation: rule.relation, confidence: rule.confidence };
  }
  return { status: 'problematic', relation: rule.relation, confidence: rule.confidence };
}
