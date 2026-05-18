// instruments.js — PanelCanvas v0.4
// MSK Flow Cytometry Core — 9-instrument fleet
// Maintains v0.3 API (detectors[]) and adds:
//   • type: 'spectral' | 'conventional' | 'dual'
//   • defaultMode: 'spectral' | 'conventional'  (dual only)
//   • convDetectors[]  for conventional and dual instruments
'use strict';

/* ── spectral bank helper ────────────────────────────────────────
   Generates evenly-spaced bandpass bins for a laser line.
   count detectors from startNm, each widthNm wide.
   ───────────────────────────────────────────────────────────── */
function _bank(laser, startNm, count, widthNm) {
  return Array.from({ length: count }, (_, i) => ({
    laser,
    center: Math.round(startNm + (i + 0.5) * widthNm),
    width: Math.round(widthNm),
  }));
}

/* ── laser color map (UI use) ────────────────────────────────── */
const LASER_COLORS = {
  355: '#b06ef7',   // UV
  405: '#8855ff',   // Violet
  488: '#2b8cf7',   // Blue
  532: '#44cc44',   // Green
  561: '#a8cc00',   // Yellow-Green
  638: '#f74040',   // Red
  730: '#cc3366',   // Deep red
  785: '#992244',   // NIR
  808: '#661133',   // NIR
};

/* ══════════════════════════════════════════════════════════════
   INSTRUMENTS
   ══════════════════════════════════════════════════════════════ */
const INSTRUMENTS = {

  /* ──────────────────────────────────────────────────────────
     DUAL-MODE  (spectral ⇄ conventional toggle)
     ────────────────────────────────────────────────────────── */

  s6: {
    id: 's6',
    name: 'MSK S6 Spectral',
    shortName: 'S6',
    vendor: 'BD',
    model: 'BD FACSymphony S6',
    type: 'dual',
    defaultMode: 'spectral',
    location: 'MSK',
    lasers: [355, 405, 488, 561, 638],
    badge: 'Dual-mode · 49 det spectral · 5L',

    // ── spectral detectors: 9+10+10+10+10 = 49 ──────────────
    detectors: [
      ..._bank(355, 375,  9, 38),
      ..._bank(405, 430, 10, 36),
      ..._bank(488, 510, 10, 28),
      ..._bank(561, 575, 10, 27),
      ..._bank(638, 655, 10, 19),
    ],

    // ── conventional detector slots ─────────────────────────
    convDetectors: [
      // UV 355 nm
      { id:'uv_379', name:'BUV395',      laser:355, filter:'379/28', center:379, bandwidth:28,
        primaryDyes:['BUV395','DAPI','Hoechst 33342'] },
      { id:'uv_502', name:'BUV496',      laser:355, filter:'502/25', center:502, bandwidth:25,
        primaryDyes:['BUV496'] },
      { id:'uv_661', name:'BUV661',      laser:355, filter:'661/20', center:661, bandwidth:20,
        primaryDyes:['BUV661'] },
      { id:'uv_740', name:'BUV737',      laser:355, filter:'740/35', center:740, bandwidth:35,
        primaryDyes:['BUV737','BUV750'] },
      { id:'uv_810', name:'BUV805',      laser:355, filter:'810/30', center:810, bandwidth:30,
        primaryDyes:['BUV805'] },
      // V 405 nm
      { id:'v_450',  name:'BV421',       laser:405, filter:'450/40', center:450, bandwidth:40,
        primaryDyes:['BV421','eFluor450','Ghost Violet 450','LIVE/DEAD Aqua','Super Bright 436'] },
      { id:'v_479',  name:'BV480',       laser:405, filter:'479/28', center:479, bandwidth:28,
        primaryDyes:['BV480','Super Bright 480'] },
      { id:'v_524',  name:'BV510',       laser:405, filter:'524/32', center:524, bandwidth:32,
        primaryDyes:['BV510','LIVE/DEAD Blue','Super Bright 600'] },
      { id:'v_575',  name:'BV570',       laser:405, filter:'575/26', center:575, bandwidth:26,
        primaryDyes:['BV570'] },
      { id:'v_610',  name:'BV605',       laser:405, filter:'610/20', center:610, bandwidth:20,
        primaryDyes:['BV605'] },
      { id:'v_655',  name:'BV650',       laser:405, filter:'655/20', center:655, bandwidth:20,
        primaryDyes:['BV650'] },
      { id:'v_720',  name:'BV711',       laser:405, filter:'720/30', center:720, bandwidth:30,
        primaryDyes:['BV711'] },
      { id:'v_810',  name:'BV786',       laser:405, filter:'810/30', center:810, bandwidth:30,
        primaryDyes:['BV786','Ghost Near-IR','LIVE/DEAD Near-IR'] },
      // B 488 nm
      { id:'b_530',  name:'FITC',        laser:488, filter:'530/30', center:530, bandwidth:30,
        primaryDyes:['FITC','BB515','Alexa Fluor 488','CFSE','CellTrace CFSE','AF488'] },
      { id:'b_695',  name:'PerCP-Cy5.5', laser:488, filter:'695/40', center:695, bandwidth:40,
        primaryDyes:['PerCP','PerCP-Cy5.5'] },
      { id:'b_720',  name:'BB700',       laser:488, filter:'720/30', center:720, bandwidth:30,
        primaryDyes:['BB700'] },
      // YG 561 nm
      { id:'yg_586', name:'PE',          laser:561, filter:'586/15', center:586, bandwidth:15,
        primaryDyes:['PE','mCherry','R-PE'] },
      { id:'yg_610', name:'PE-CF594',    laser:561, filter:'610/20', center:610, bandwidth:20,
        primaryDyes:['PE-CF594','PE-Texas Red','mStrawberry'] },
      { id:'yg_670', name:'PE-Cy5',      laser:561, filter:'670/30', center:670, bandwidth:30,
        primaryDyes:['PE-Cy5','7-AAD'] },
      { id:'yg_695', name:'PE-Cy5.5',    laser:561, filter:'695/40', center:695, bandwidth:40,
        primaryDyes:['PE-Cy5.5'] },
      { id:'yg_780', name:'PE-Cy7',      laser:561, filter:'780/60', center:780, bandwidth:60,
        primaryDyes:['PE-Cy7'] },
      // R 638 nm
      { id:'r_660',  name:'APC',         laser:638, filter:'660/20', center:660, bandwidth:20,
        primaryDyes:['APC','Alexa Fluor 647','AF647','APC-R700'] },
      { id:'r_720',  name:'Alexa Fluor 700', laser:638, filter:'720/30', center:720, bandwidth:30,
        primaryDyes:['Alexa Fluor 700','AF700','APC-R700'] },
      { id:'r_785',  name:'APC-Cy7',     laser:638, filter:'785/70', center:785, bandwidth:70,
        primaryDyes:['APC-Cy7','APC-H7'] },
    ],
  },

  // ─────────────────────────────────────────────────────────────

  a5se: {
    id: 'a5se',
    name: 'Symphony A5 SE',
    shortName: 'A5 SE',
    vendor: 'BD',
    model: 'BD FACSymphony A5 SE',
    type: 'dual',
    defaultMode: 'spectral',
    location: 'Humanitas',
    lasers: [355, 405, 488, 561, 638],
    badge: 'Dual-mode · 48 det spectral · 5L · Humanitas',

    // ── spectral detectors: 8+10+10+10+10 = 48 ─────────────
    detectors: [
      ..._bank(355, 375,  8, 43),
      ..._bank(405, 430, 10, 36),
      ..._bank(488, 510, 10, 28),
      ..._bank(561, 575, 10, 27),
      ..._bank(638, 655, 10, 19),
    ],

    // ── conventional detector slots (A5 SE config) ──────────
    convDetectors: [
      { id:'uv_379', name:'BUV395',      laser:355, filter:'379/28', center:379, bandwidth:28,
        primaryDyes:['BUV395','DAPI'] },
      { id:'uv_502', name:'BUV496',      laser:355, filter:'502/25', center:502, bandwidth:25,
        primaryDyes:['BUV496'] },
      { id:'uv_661', name:'BUV661',      laser:355, filter:'661/20', center:661, bandwidth:20,
        primaryDyes:['BUV661'] },
      { id:'uv_740', name:'BUV737',      laser:355, filter:'740/35', center:740, bandwidth:35,
        primaryDyes:['BUV737','BUV750'] },
      { id:'uv_810', name:'BUV805',      laser:355, filter:'810/30', center:810, bandwidth:30,
        primaryDyes:['BUV805'] },
      { id:'v_450',  name:'BV421',       laser:405, filter:'450/40', center:450, bandwidth:40,
        primaryDyes:['BV421','eFluor450','Ghost Violet 450'] },
      { id:'v_479',  name:'BV480',       laser:405, filter:'479/28', center:479, bandwidth:28,
        primaryDyes:['BV480'] },
      { id:'v_524',  name:'BV510',       laser:405, filter:'524/32', center:524, bandwidth:32,
        primaryDyes:['BV510'] },
      { id:'v_575',  name:'BV570',       laser:405, filter:'575/26', center:575, bandwidth:26,
        primaryDyes:['BV570'] },
      { id:'v_610',  name:'BV605',       laser:405, filter:'610/20', center:610, bandwidth:20,
        primaryDyes:['BV605'] },
      { id:'v_655',  name:'BV650',       laser:405, filter:'655/20', center:655, bandwidth:20,
        primaryDyes:['BV650'] },
      { id:'v_720',  name:'BV711',       laser:405, filter:'720/30', center:720, bandwidth:30,
        primaryDyes:['BV711'] },
      { id:'v_810',  name:'BV786',       laser:405, filter:'810/30', center:810, bandwidth:30,
        primaryDyes:['BV786','LIVE/DEAD Near-IR'] },
      { id:'b_530',  name:'FITC',        laser:488, filter:'530/30', center:530, bandwidth:30,
        primaryDyes:['FITC','BB515','Alexa Fluor 488','CFSE'] },
      { id:'b_695',  name:'PerCP-Cy5.5', laser:488, filter:'695/40', center:695, bandwidth:40,
        primaryDyes:['PerCP','PerCP-Cy5.5'] },
      { id:'yg_586', name:'PE',          laser:561, filter:'586/15', center:586, bandwidth:15,
        primaryDyes:['PE','R-PE'] },
      { id:'yg_610', name:'PE-CF594',    laser:561, filter:'610/20', center:610, bandwidth:20,
        primaryDyes:['PE-CF594','PE-Texas Red'] },
      { id:'yg_670', name:'PE-Cy5',      laser:561, filter:'670/30', center:670, bandwidth:30,
        primaryDyes:['PE-Cy5','7-AAD'] },
      { id:'yg_695', name:'PE-Cy5.5',    laser:561, filter:'695/40', center:695, bandwidth:40,
        primaryDyes:['PE-Cy5.5'] },
      { id:'yg_780', name:'PE-Cy7',      laser:561, filter:'780/60', center:780, bandwidth:60,
        primaryDyes:['PE-Cy7'] },
      { id:'r_660',  name:'APC',         laser:638, filter:'660/20', center:660, bandwidth:20,
        primaryDyes:['APC','Alexa Fluor 647','AF647'] },
      { id:'r_720',  name:'Alexa Fluor 700', laser:638, filter:'720/30', center:720, bandwidth:30,
        primaryDyes:['Alexa Fluor 700','AF700'] },
      { id:'r_785',  name:'APC-Cy7',     laser:638, filter:'785/70', center:785, bandwidth:70,
        primaryDyes:['APC-Cy7','APC-H7'] },
    ],
  },

  /* ──────────────────────────────────────────────────────────
     SPECTRAL-ONLY
     ────────────────────────────────────────────────────────── */

  aurora5L: {
    id: 'aurora5L',
    name: 'Cytek Aurora 5L',
    shortName: 'Aurora 5L',
    vendor: 'Cytek',
    model: 'Cytek Aurora 5L',
    type: 'spectral',
    location: 'MSK',
    lasers: [355, 405, 488, 561, 638],
    badge: 'Spectral only · 64 det · 5L',

    // 16+16+14+10+8 = 64
    detectors: [
      ..._bank(355, 375, 16, 22),
      ..._bank(405, 430, 16, 23),
      ..._bank(488, 510, 14, 20),
      ..._bank(561, 575, 10, 27),
      ..._bank(638, 655,  8, 23),
    ],
    convDetectors: [],
  },

  s8: {
    id: 's8',
    name: 'FACSDiscover S8',
    shortName: 'S8',
    vendor: 'BD',
    model: 'BD FACSDiscover S8',
    type: 'spectral',
    location: 'MSK',
    lasers: [355, 405, 488, 561, 638],
    badge: 'Spectral · Imaging sorter · 78 det · 5L',

    // 22+20+16+12+8 = 78
    detectors: [
      ..._bank(355, 375, 22, 16),
      ..._bank(405, 430, 20, 18),
      ..._bank(488, 510, 16, 18),
      ..._bank(561, 575, 12, 22),
      ..._bank(638, 655,  8, 23),
    ],
    convDetectors: [],
  },

  a8: {
    id: 'a8',
    name: 'FACSDiscover A8',
    shortName: 'A8',
    vendor: 'BD',
    model: 'BD FACSDiscover A8',
    type: 'spectral',
    location: 'MSK',
    lasers: [355, 405, 488, 561, 638],
    badge: 'Spectral · Imaging analyzer · 72 det · 5L',

    // 20+18+14+12+8 = 72
    detectors: [
      ..._bank(355, 375, 20, 17),
      ..._bank(405, 430, 18, 20),
      ..._bank(488, 510, 14, 20),
      ..._bank(561, 575, 12, 22),
      ..._bank(638, 655,  8, 23),
    ],
    convDetectors: [],
  },

  id7000: {
    id: 'id7000',
    name: 'Sony ID7000',
    shortName: 'ID7000',
    vendor: 'Sony',
    model: 'Sony ID7000',
    type: 'spectral',
    location: 'MSK',
    lasers: [355, 405, 488, 561, 638],
    badge: 'Spectral only · 148 det · 5L',

    // 32+32+32+26+26 = 148
    detectors: [
      ..._bank(355, 375, 32, 15),
      ..._bank(405, 420, 32, 13),
      ..._bank(488, 500, 32, 11),
      ..._bank(561, 565, 26, 11),
      ..._bank(638, 645, 26,  8),
    ],
    convDetectors: [],
  },

  /* ──────────────────────────────────────────────────────────
     CONVENTIONAL-ONLY
     ────────────────────────────────────────────────────────── */

  fortessa1: {
    id: 'fortessa1',
    name: 'BD LSRFortessa-1',
    shortName: 'Fortessa-1',
    vendor: 'BD',
    model: 'BD LSRFortessa',
    type: 'conventional',
    location: 'MSK',
    lasers: [355, 405, 488, 561, 638],
    badge: 'Conventional · 5L · 19 det',
    detectors: [],

    convDetectors: [
      // UV 355 nm (4 slots)
      { id:'uv_379', name:'BUV395',      laser:355, filter:'379/28', center:379, bandwidth:28,
        primaryDyes:['BUV395','DAPI','Hoechst 33342'] },
      { id:'uv_502', name:'BUV496',      laser:355, filter:'502/25', center:502, bandwidth:25,
        primaryDyes:['BUV496'] },
      { id:'uv_740', name:'BUV737',      laser:355, filter:'740/35', center:740, bandwidth:35,
        primaryDyes:['BUV737','BUV750'] },
      { id:'uv_810', name:'BUV805',      laser:355, filter:'810/30', center:810, bandwidth:30,
        primaryDyes:['BUV805'] },
      // V 405 nm (6 slots)
      { id:'v_450',  name:'BV421',       laser:405, filter:'450/40', center:450, bandwidth:40,
        primaryDyes:['BV421','eFluor450','Ghost Violet 450','LIVE/DEAD Aqua'] },
      { id:'v_479',  name:'BV480',       laser:405, filter:'479/28', center:479, bandwidth:28,
        primaryDyes:['BV480'] },
      { id:'v_524',  name:'BV510',       laser:405, filter:'524/32', center:524, bandwidth:32,
        primaryDyes:['BV510','LIVE/DEAD Blue'] },
      { id:'v_610',  name:'BV605',       laser:405, filter:'610/20', center:610, bandwidth:20,
        primaryDyes:['BV605'] },
      { id:'v_655',  name:'BV650',       laser:405, filter:'655/20', center:655, bandwidth:20,
        primaryDyes:['BV650'] },
      { id:'v_810',  name:'BV786',       laser:405, filter:'810/30', center:810, bandwidth:30,
        primaryDyes:['BV786','LIVE/DEAD Near-IR'] },
      // B 488 nm (2 slots — PE on 561nm, YG laser handles tandems)
      { id:'b_530',  name:'FITC',        laser:488, filter:'530/30', center:530, bandwidth:30,
        primaryDyes:['FITC','BB515','Alexa Fluor 488','AF488','CFSE','CellTrace CFSE'] },
      { id:'b_695',  name:'PerCP-Cy5.5', laser:488, filter:'695/40', center:695, bandwidth:40,
        primaryDyes:['PerCP','PerCP-Cy5.5'] },
      // YG 561 nm (5 slots)
      { id:'yg_586', name:'PE',          laser:561, filter:'586/15', center:586, bandwidth:15,
        primaryDyes:['PE','R-PE','mCherry'] },
      { id:'yg_610', name:'PE-CF594',    laser:561, filter:'610/20', center:610, bandwidth:20,
        primaryDyes:['PE-CF594','PE-Texas Red'] },
      { id:'yg_695', name:'PE-Cy5.5',    laser:561, filter:'695/40', center:695, bandwidth:40,
        primaryDyes:['PE-Cy5.5','PE-Cy5'] },
      { id:'yg_780', name:'PE-Cy7',      laser:561, filter:'780/60', center:780, bandwidth:60,
        primaryDyes:['PE-Cy7'] },
      // R 638 nm (3 slots)
      { id:'r_660',  name:'APC',         laser:638, filter:'660/20', center:660, bandwidth:20,
        primaryDyes:['APC','Alexa Fluor 647','AF647'] },
      { id:'r_720',  name:'Alexa Fluor 700', laser:638, filter:'720/30', center:720, bandwidth:30,
        primaryDyes:['Alexa Fluor 700','AF700','APC-R700'] },
      { id:'r_785',  name:'APC-Cy7',     laser:638, filter:'785/70', center:785, bandwidth:70,
        primaryDyes:['APC-Cy7','APC-H7'] },
    ],
  },

  // ─────────────────────────────────────────────────────────────

  fortessa2: {
    id: 'fortessa2',
    name: 'BD LSRFortessa-2',
    shortName: 'Fortessa-2',
    vendor: 'BD',
    model: 'BD LSRFortessa',
    type: 'conventional',
    location: 'MSK',
    lasers: [405, 488, 561, 638],
    badge: 'Conventional · 4L · no UV · 14 det',
    detectors: [],

    convDetectors: [
      // V 405 nm (5 slots — no UV so BV421 handles the short wavelength)
      { id:'v_450',  name:'BV421',       laser:405, filter:'450/40', center:450, bandwidth:40,
        primaryDyes:['BV421','eFluor450','Ghost Violet 450','LIVE/DEAD Aqua','Pacific Blue'] },
      { id:'v_524',  name:'BV510',       laser:405, filter:'524/32', center:524, bandwidth:32,
        primaryDyes:['BV510','LIVE/DEAD Blue'] },
      { id:'v_610',  name:'BV605',       laser:405, filter:'610/20', center:610, bandwidth:20,
        primaryDyes:['BV605'] },
      { id:'v_655',  name:'BV650',       laser:405, filter:'655/20', center:655, bandwidth:20,
        primaryDyes:['BV650'] },
      { id:'v_810',  name:'BV786',       laser:405, filter:'810/30', center:810, bandwidth:30,
        primaryDyes:['BV786','LIVE/DEAD Near-IR'] },
      // B 488 nm (2 slots)
      { id:'b_530',  name:'FITC',        laser:488, filter:'530/30', center:530, bandwidth:30,
        primaryDyes:['FITC','Alexa Fluor 488','AF488','CFSE'] },
      { id:'b_695',  name:'PerCP-Cy5.5', laser:488, filter:'695/40', center:695, bandwidth:40,
        primaryDyes:['PerCP','PerCP-Cy5.5'] },
      // YG 561 nm (4 slots)
      { id:'yg_586', name:'PE',          laser:561, filter:'586/15', center:586, bandwidth:15,
        primaryDyes:['PE','R-PE'] },
      { id:'yg_610', name:'PE-CF594',    laser:561, filter:'610/20', center:610, bandwidth:20,
        primaryDyes:['PE-CF594','PE-Texas Red'] },
      { id:'yg_695', name:'PE-Cy5.5',    laser:561, filter:'695/40', center:695, bandwidth:40,
        primaryDyes:['PE-Cy5.5','PE-Cy5'] },
      { id:'yg_780', name:'PE-Cy7',      laser:561, filter:'780/60', center:780, bandwidth:60,
        primaryDyes:['PE-Cy7'] },
      // R 638 nm (3 slots)
      { id:'r_660',  name:'APC',         laser:638, filter:'660/20', center:660, bandwidth:20,
        primaryDyes:['APC','Alexa Fluor 647','AF647'] },
      { id:'r_720',  name:'Alexa Fluor 700', laser:638, filter:'720/30', center:720, bandwidth:30,
        primaryDyes:['Alexa Fluor 700','AF700'] },
      { id:'r_785',  name:'APC-Cy7',     laser:638, filter:'785/70', center:785, bandwidth:70,
        primaryDyes:['APC-Cy7','APC-H7'] },
    ],
  },

  // ─────────────────────────────────────────────────────────────

  cytoflexLX: {
    id: 'cytoflexLX',
    name: 'CytoFLEX LX Wallace',
    shortName: 'CytoFLEX LX',
    vendor: 'Beckman Coulter',
    model: 'Beckman Coulter CytoFLEX LX',
    type: 'conventional',
    location: 'MSK',
    lasers: [355, 405, 488, 561, 638, 808],
    badge: 'Conventional · 6L · 808nm NIR · 21 det',
    detectors: [],

    convDetectors: [
      // UV 355 nm (3 slots)
      { id:'uv_450', name:'UV Blue (BUV395)', laser:355, filter:'450/42', center:450, bandwidth:42,
        primaryDyes:['BUV395','DAPI','Pacific Blue','Hoechst 33342'] },
      { id:'uv_525', name:'UV Green (BUV496)',laser:355, filter:'525/40', center:525, bandwidth:40,
        primaryDyes:['BUV496','BUV523'] },
      { id:'uv_610', name:'UV Orange',        laser:355, filter:'610/20', center:610, bandwidth:20,
        primaryDyes:['BUV615','PI'] },
      // V 405 nm (5 slots)
      { id:'v_450',  name:'BV421',            laser:405, filter:'450/42', center:450, bandwidth:42,
        primaryDyes:['BV421','eFluor450','Ghost Violet 450'] },
      { id:'v_525',  name:'BV510',            laser:405, filter:'525/40', center:525, bandwidth:40,
        primaryDyes:['BV510','LIVE/DEAD Blue'] },
      { id:'v_610',  name:'BV605',            laser:405, filter:'610/20', center:610, bandwidth:20,
        primaryDyes:['BV605'] },
      { id:'v_660',  name:'BV650',            laser:405, filter:'660/8',  center:660, bandwidth:8,
        primaryDyes:['BV650'] },
      { id:'v_780',  name:'BV786',            laser:405, filter:'780/60', center:780, bandwidth:60,
        primaryDyes:['BV786','LIVE/DEAD Near-IR'] },
      // B 488 nm (2 slots)
      { id:'b_525',  name:'FITC',             laser:488, filter:'525/40', center:525, bandwidth:40,
        primaryDyes:['FITC','BB515','Alexa Fluor 488','AF488','CFSE'] },
      { id:'b_690',  name:'PerCP-Cy5.5',      laser:488, filter:'690/50', center:690, bandwidth:50,
        primaryDyes:['PerCP','PerCP-Cy5.5'] },
      // YG 561 nm (4 slots)
      { id:'yg_585', name:'PE',               laser:561, filter:'585/42', center:585, bandwidth:42,
        primaryDyes:['PE','R-PE','mCherry'] },
      { id:'yg_610', name:'PE-CF594',         laser:561, filter:'610/20', center:610, bandwidth:20,
        primaryDyes:['PE-CF594'] },
      { id:'yg_690', name:'PE-Cy5.5',         laser:561, filter:'690/50', center:690, bandwidth:50,
        primaryDyes:['PE-Cy5','PE-Cy5.5'] },
      { id:'yg_780', name:'PE-Cy7',           laser:561, filter:'780/60', center:780, bandwidth:60,
        primaryDyes:['PE-Cy7'] },
      // R 638 nm (3 slots)
      { id:'r_660',  name:'APC',              laser:638, filter:'660/8',  center:660, bandwidth:8,
        primaryDyes:['APC','Alexa Fluor 647','AF647'] },
      { id:'r_720',  name:'Alexa Fluor 700',  laser:638, filter:'720/30', center:720, bandwidth:30,
        primaryDyes:['Alexa Fluor 700','AF700'] },
      { id:'r_785',  name:'APC-Cy7',          laser:638, filter:'785/70', center:785, bandwidth:70,
        primaryDyes:['APC-Cy7','APC-H7'] },
      // NIR 808 nm (4 slots — unique to CytoFLEX LX Wallace)
      { id:'nir_660',name:'NIR-APC',          laser:808, filter:'660/10', center:660, bandwidth:10,
        primaryDyes:['APC (808nm-excitable)'] },
      { id:'nir_720',name:'NIR-AF700',        laser:808, filter:'720/30', center:720, bandwidth:30,
        primaryDyes:['Alexa Fluor 700 (808nm)','AF700 (808nm)'] },
      { id:'nir_780',name:'NIR-780',          laser:808, filter:'780/60', center:780, bandwidth:60,
        primaryDyes:['APC-Cy7 (808nm)','NIR-780 dyes'] },
      { id:'nir_840',name:'NIR-840',          laser:808, filter:'840/20', center:840, bandwidth:20,
        primaryDyes:['IRDye 800CW','NIR-808 dyes','StarBright Violet 840'] },
    ],
  },

}; // end INSTRUMENTS

/* ── ordered list for UI display ────────────────────────────────
   Groups: dual → spectral → conventional
   ──────────────────────────────────────────────────────────── */
const INSTRUMENT_ORDER = [
  // dual-mode
  's6', 'a5se',
  // spectral
  'aurora5L', 's8', 'a8', 'id7000',
  // conventional
  'fortessa1', 'fortessa2', 'cytoflexLX',
];

/* ── helpers exported to window ─────────────────────────────── */
function getInstrument(id) { return INSTRUMENTS[id] || null; }

function getActiveDetectors(instrument, mode) {
  const m = mode || instrument.defaultMode || instrument.type;
  if (m === 'conventional') return instrument.convDetectors || [];
  return instrument.detectors || [];
}

// Expose globals
window.INSTRUMENTS     = INSTRUMENTS;
window.INSTRUMENT_ORDER = INSTRUMENT_ORDER;
window.LASER_COLORS    = LASER_COLORS;
window.getInstrument   = getInstrument;
window.getActiveDetectors = getActiveDetectors;
