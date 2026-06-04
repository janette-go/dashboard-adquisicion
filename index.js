require('dotenv').config();
const express = require('express');
const path    = require('path');
const fs      = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.json());

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES COMPARTIDAS
// ─────────────────────────────────────────────────────────────────────────────

const MONTHS_ES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA COMPLETO
// ─────────────────────────────────────────────────────────────────────────────

const mockCampaigns = [
  {
    id: 'search-custodias', type: 'Search', name: 'Custodia de Transporte',
    groupCount: 5, keywordCount: 14,
    groups: [
      {
        id: 'ga', tag: 'Grupo A', name: 'Custodia de Transporte de Carga',
        qs: 6.1, qsStatus: 'yellow', landingPage: '/custodia-de-transporte-de-carga',
        metrics: { impressions: 1800, ctr: 4.2, conversions: 24, lostImprRanking: 38 },
        adRelevance: 'below_average', lpExperience: 'average',
        historicalAdRelevance: 'below_average', historicalLpExperience: 'average',
        historicalQs: 6.0, historicalCtr: 0.042,
        keywords: [
          { match: 'exact',  text: '[servicio de custodia de transportes]', qs: 5, impressions: 96,  conversions: 6 },
          { match: 'phrase', text: '"servicio de custodia de transportes"', qs: 5, impressions: 8,   conversions: 0 },
          { match: 'exact',  text: '[custodia de transporte de carga]',     qs: 6, impressions: 42,  conversions: 1 },
          { match: 'exact',  text: '[custodias de transporte]',             qs: 7, impressions: 86,  conversions: 7 },
          { match: 'phrase', text: '"custodia de transporte"',              qs: 7, impressions: 412, conversions: 6 },
          { match: 'phrase', text: '"custodia para transporte"',            qs: 8, impressions: 64,  conversions: 4 },
        ],
      },
      {
        id: 'gb', tag: 'Grupo B', note: 'Grupo más productivo',
        name: 'Custodia de Mercancías',
        qs: 6.4, qsStatus: 'yellow', landingPage: '/custodia-de-mercancias',
        metrics: { impressions: 2100, ctr: 5.1, conversions: 48, lostImprRanking: 28 },
        adRelevance: 'below_average', lpExperience: 'average',
        historicalAdRelevance: 'below_average', historicalLpExperience: 'average',
        historicalQs: 6.3, historicalCtr: 0.051,
        keywords: [
          { match: 'phrase', text: '"servicio de custodia"',  qs: 6, impressions: 580, conversions: 34, star: true },
          { match: 'phrase', text: '"custodia de mercancías"',qs: 7, impressions: 210, conversions: 8  },
          { match: 'exact',  text: '[custodia de mercancía]', qs: 6, impressions: 95,  conversions: 6  },
        ],
      },
      {
        id: 'gc', tag: 'Grupo C', name: 'Custodia Armada para Transporte',
        qs: 7, qsStatus: 'yellow', landingPage: '/custodia-armada-para-transporte',
        metrics: { impressions: 890, ctr: 3.8, conversions: 0, lostImprRanking: 22 },
        adRelevance: 'average', lpExperience: 'below_average',
        historicalAdRelevance: 'average', historicalLpExperience: 'below_average',
        historicalQs: 7.0, historicalCtr: 0.038,
        keywords: [
          { match: 'phrase', text: '"custodia armada"',           qs: 7, impressions: 310, conversions: 0 },
          { match: 'phrase', text: '"escolta vehicular"',          qs: 7, impressions: 180, conversions: 0 },
          { match: 'exact',  text: '[custodia armada transporte]', qs: 7, impressions: 130, conversions: 0 },
        ],
      },
      {
        id: 'gd', tag: 'Grupo D', note: 'LP faltante ⚠',
        name: 'Custodia Blanca (Sin Arma)',
        qs: 3, qsStatus: 'red', landingPage: '/custodia-blanca', landingPageMissing: true,
        metrics: { impressions: 340, ctr: 1.2, conversions: 0, lostImprRanking: 61 },
        adRelevance: 'below_average', lpExperience: 'below_average',
        historicalAdRelevance: 'below_average', historicalLpExperience: 'below_average',
        historicalQs: 3.0, historicalCtr: 0.012,
        keywords: [
          { match: 'phrase', text: '"custodia blanca"',  qs: 3, impressions: 180, conversions: 0 },
          { match: 'exact',  text: '[custodia sin arma]',qs: 3, impressions: 90,  conversions: 0 },
        ],
      },
      {
        id: 'ge', tag: 'Grupo E', name: 'Empresas de Custodia',
        qs: 7, qsStatus: 'yellow', landingPage: '/empresas-de-custodia',
        metrics: { impressions: 520, ctr: 6.3, conversions: 9, lostImprRanking: 18 },
        adRelevance: 'average', lpExperience: 'average',
        historicalAdRelevance: 'average', historicalLpExperience: 'average',
        historicalQs: 7.0, historicalCtr: 0.063,
        keywords: [
          { match: 'phrase', text: '"empresas de custodia"',              qs: 7, impressions: 4,  conversions: 0 },
          { match: 'exact',  text: '[empresas de custodia de transportes]',qs: 7, impressions: 31, conversions: 9 },
        ],
      },
    ],
  },
  {
    id: 'brand-detecta', type: 'Brand', name: 'Detecta Security',
    groupCount: 1, keywordCount: 2,
    groups: [
      {
        id: 'gbrand', tag: 'Brand', note: 'Modelo de referencia ⭐',
        name: 'Reconocimiento · Detecta Security',
        qs: 10, qsStatus: 'green', landingPage: 'detectasecurity.io',
        metrics: { impressions: 312, ctr: 12.4, conversions: 8, lostImprRanking: 4 },
        adRelevance: 'above_average', lpExperience: 'above_average',
        historicalAdRelevance: 'above_average', historicalLpExperience: 'above_average',
        historicalQs: 10.0, historicalCtr: 0.124,
        keywords: [
          { match: 'phrase', text: '"detecta security"', qs: 10, impressions: 249, conversions: 5 },
          { match: 'exact',  text: '[detecta security]', qs: 10, impressions: 249, conversions: 5 },
        ],
      },
    ],
  },
];

const MOCK = {
  source:  'mock',
  account: { name: 'DETECTA-CUSTODIAS', id: '720-603-7956' },
  summary: {
    gasto: 48200, conversiones: 89, cpl: 541, ctr: 4.6, cpc: 9.80, impr: 19400,
    leadsCalificados: 62, sqls: 28, clientesGanados: 9,
  },
  costoSQL:      4800,
  sqlsTotales:   28,
  sqlsPaidMedia: 18,
  sqlsOrganicos: 6,
  sqlsOutbound:  4,
  convPorMes: {
    labels: MONTHS_ES,
    data:   [12, 18, 24, 31, 28, 35, 42, 38, 29, 33, 41, 36],
  },
  sqlsPorMes: {
    labels: MONTHS_ES,
    data:   [4, 6, 8, 11, 9, 13, 15, 14, 10, 12, 15, 13],
  },
  gastoPorMes: {
    labels: MONTHS_ES,
    data:   [102000, 58000, 51000, 43000, 41000, 0, 0, 0, 0, 0, 0, 0],
  },
  costoPorSQLMes: {
    labels: MONTHS_ES,
    data:   [4250, 3200, 2800, 3600, 3900, null, null, null, null, null, null, null],
  },
  sqlsPaidOrgPorMes: {
    labels: MONTHS_ES,
    data:   [3, 5, 7, 9, 7, 0, 0, 0, 0, 0, 0, 0],
  },
  pipeline:      { leads: 62, sqls: 28, ganados: 9 },
  origenSqls:    { labels: ['Paid media','Orgánico','Referido','Directo'], data: [18, 6, 3, 1] },
  origenGanados: { labels: ['Paid media','Orgánico','Referido','Directo'], data: [5, 2, 1, 1] },
  auctionData: [
    { domain: 'detectasecurity.io (Tú)', imprShare: 41.49, topImpr: 85.26, absTopImpr: 59.25, overlap: null, outranking: null, posAbove: null },
    { domain: 'bboxsecurity.com',        imprShare: null,  topImpr: 95.56, absTopImpr: 24.44, overlap: 10.12, outranking: 20.00, posAbove: 40.65 },
    { domain: 'mspv.com.mx',             imprShare: null,  topImpr: 86.79, absTopImpr: 9.43,  overlap: 11.27, outranking: 2.56,  posAbove: 41.37 },
    { domain: 'cefeus.mx',               imprShare: null,  topImpr: 79.25, absTopImpr: 9.43,  overlap: 12.43, outranking: 25.58, posAbove: 40.17 },
    { domain: 'kaul-group.com',          imprShare: null,  topImpr: 77.78, absTopImpr: 22.22, overlap: 2.31,  outranking: 12.50, posAbove: 41.37 },
    { domain: 'cltproteccion.mx',        imprShare: null,  topImpr: 72.00, absTopImpr: 22.67, overlap: 14.45, outranking: 30.00, posAbove: 39.69 },
    { domain: 'sepromex.com.mx',         imprShare: null,  topImpr: 54.84, absTopImpr: 6.45,  overlap: 11.85, outranking: 14.63, posAbove: 40.77 },
  ],
  changes: [
    { date: '30 mayo 2026', type: 'Anuncio',    campaign: 'Grupo B', desc: 'Actualización de Título 1 incluyendo "Servicio de Custodia"' },
    { date: '28 mayo 2026', type: 'Puja',        campaign: 'Grupo A', desc: 'Ajuste de CPC máximo de $45 a $52 en keywords exactas' },
    { date: '25 mayo 2026', type: 'Keyword',     campaign: 'Grupo E', desc: 'Pausa de keyword "custodias empresariales" por QS 3' },
    { date: '22 mayo 2026', type: 'Presupuesto', campaign: 'Search',  desc: 'Aumento de presupuesto diario de $800 a $1,200' },
    { date: '18 mayo 2026', type: 'LP',          campaign: 'Grupo C', desc: 'Actualización de CTA en /custodia-armada-para-transporte' },
    { date: '15 mayo 2026', type: 'Anuncio',     campaign: 'Brand',   desc: 'Adición de extensión de sitelinks con 4 LPs adicionales' },
  ],
  campaigns: mockCampaigns,
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function num(v) {
  return v !== undefined && v !== null ? Number(v) : 0;
}

function qsColor(qs) {
  if (qs === null) return 'gray';
  return qs >= 8 ? 'green' : qs >= 6 ? 'yellow' : 'red';
}

function mostCommon(arr) {
  if (!arr.length) return null;
  const freq = {};
  arr.forEach(v => { freq[v] = (freq[v] || 0) + 1; });
  return Object.keys(freq).sort((a, b) => freq[b] - freq[a])[0];
}

// Devuelve { during, where, start, end, year, startStr, endStr }
// `during` → cláusula GAQL top-level (ej. "DURING THIS_MONTH")
// `where`  → fragmento para añadir en WHERE con AND (ej. "segments.date BETWEEN '...' AND '...'")
function parsePeriod(period = 'this_month') {
  const now   = new Date();
  const year  = now.getFullYear();
  const month = now.getMonth();
  let start, end;

  switch (period) {
    case 'today':
      start = new Date(year, month, now.getDate(), 0, 0, 0);
      end   = now;
      break;
    case 'yesterday':
      start = new Date(year, month, now.getDate() - 1, 0,  0,  0);
      end   = new Date(year, month, now.getDate() - 1, 23, 59, 59);
      break;
    case '7d': {
      // Esta semana: lunes → domingo (semana completa de lun a dom)
      const dow = now.getDay(); // 0=dom, 1=lun, ..., 6=sáb
      const daysToMon = dow === 0 ? 6 : dow - 1;
      start = new Date(year, month, now.getDate() - daysToMon, 0, 0, 0);
      end   = now;
      break;
    }
    case 'last_month':
      start = new Date(year, month - 1, 1);
      end   = new Date(year, month,     0, 23, 59, 59);
      break;
    case 'q1': start = new Date(year, 0, 1);  end = new Date(year, 2,  31, 23, 59, 59); break;
    case 'q2': start = new Date(year, 3, 1);  end = new Date(year, 5,  30, 23, 59, 59); break;
    case 'q3': start = new Date(year, 6, 1);  end = new Date(year, 8,  30, 23, 59, 59); break;
    case 'q4': start = new Date(year, 9, 1);  end = new Date(year, 11, 31, 23, 59, 59); break;
    case 'this_year':
      start = new Date(year, 0, 1, 0, 0, 0);
      end   = now;
      break;
    default:
      if (period.startsWith('month-')) {
        // month-1 … month-12
        const m = parseInt(period.split('-')[1], 10) - 1;
        start = new Date(year, m, 1, 0, 0, 0);
        end   = (m === month) ? now : new Date(year, m + 1, 0, 23, 59, 59);
      } else {
        // this_month
        start = new Date(year, month, 1, 0, 0, 0);
        end   = now;
      }
  }

  // Usa componentes locales para evitar que UTC desplace la fecha en zonas UTC-N
  const fmt = d => {
    const y  = d.getFullYear();
    const m  = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  };

  const predefined = { yesterday: 'DURING YESTERDAY', '7d': 'DURING LAST_7_DAYS', last_month: 'DURING LAST_MONTH', this_month: 'DURING THIS_MONTH' };
  const during = predefined[period] || null;
  const where  = during ? null : `segments.date BETWEEN '${fmt(start)}' AND '${fmt(end)}'`;

  const startStr = fmt(start);
  const endStr   = fmt(end);

  // Etiqueta legible para mostrar en la UI (qué fechas se están consultando)
  const fmtHuman = d => d.toLocaleDateString('es-MX', { day:'numeric', month:'short' });
  const periodLabel = startStr === endStr
    ? fmtHuman(start)
    : `${fmtHuman(start)} – ${fmtHuman(end)}`;

  return { during, where, start, end, year, startStr, endStr, periodLabel };
}

// Construye cláusula de fecha para insertar en una query GAQL
function dateClauses(periodCfg, extraWhere = '') {
  const where = [extraWhere, periodCfg.where].filter(Boolean).join('\n      AND ');
  return {
    whereFragment: where ? `AND ${where}` : '',
    duringClause:  periodCfg.during || '',
  };
}

// Agrupa deals por el campo enum "Origen de SQL" usando el mapa ID→label de Pipedrive
function groupByOrigenSQL(deals, fieldKey, optionMap) {
  const counts = {};
  for (const deal of deals) {
    const raw   = fieldKey ? deal[fieldKey] : null;
    const label = (raw != null && raw !== '')
      ? (optionMap[String(raw)] || String(raw))
      : 'Sin fuente';
    counts[label] = (counts[label] || 0) + 1;
  }
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return { labels: sorted.map(e => e[0]), data: sorted.map(e => e[1]) };
}

// Agrupa deals por mes del año dado y devuelve { labels, data } de 12 meses
function groupByMonth(deals, year) {
  const byMonth = Array(12).fill(0);
  for (const deal of deals) {
    const d = new Date(deal.add_time);
    if (d.getFullYear() === year) byMonth[d.getMonth()]++;
  }
  return { labels: MONTHS_ES, data: byMonth };
}

// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// GOOGLE SEARCH CONSOLE
// ─────────────────────────────────────────────────────────────────────────────

function getGSCAuth() {
  const { google } = require('googleapis');
  const credJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const keyFile  = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  return new google.auth.GoogleAuth({
    ...(credJson ? { credentials: JSON.parse(credJson) } : { keyFile }),
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
}

async function fetchSearchConsoleData(period) {
  const siteUrl  = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || 'https://www.detectasecurity.io/';
  const keyword  = process.env.GSC_QUERY_FILTER || 'custodia';
  const pc       = parsePeriod(period);

  try {
    const { google } = require('googleapis');
    const sc = google.searchconsole({ version: 'v1', auth: getGSCAuth() });

    const base = {
      siteUrl,
      requestBody: {
        startDate: pc.startStr,
        endDate:   pc.endStr,
        dimensionFilterGroups: [{ filters: [{
          dimension: 'query', operator: 'contains', expression: keyword,
        }] }],
      },
    };

    const yearStart = `${new Date().getFullYear()}-01-01`;
    const yearEnd   = pc.endStr;

    // Periodo anterior: misma duración, justo antes del actual
    const fmtD = d => {
      const y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,'0'), dd = String(d.getDate()).padStart(2,'0');
      return `${y}-${m}-${dd}`;
    };
    const startMs     = new Date(pc.startStr).getTime();
    const endMs       = new Date(pc.endStr).getTime();
    const durMs       = endMs - startMs + 86_400_000;
    const prevEndStr  = fmtD(new Date(startMs - 86_400_000));
    const prevStartStr= fmtD(new Date(startMs - durMs));

    const [dailyRes, queryRes, yearlyRes, prevRes] = await Promise.all([
      sc.searchanalytics.query({ ...base, requestBody: { ...base.requestBody, dimensions: ['date'], rowLimit: 1000 } }),
      sc.searchanalytics.query({ ...base, requestBody: { ...base.requestBody, dimensions: ['query'], rowLimit: 25 } }),
      sc.searchanalytics.query({ ...base, requestBody: { ...base.requestBody, startDate: yearStart, endDate: yearEnd, dimensions: ['date'], rowLimit: 1000 } }),
      sc.searchanalytics.query({ ...base, requestBody: { ...base.requestBody, startDate: prevStartStr, endDate: prevEndStr, dimensions: ['date'], rowLimit: 1000 } }),
    ]);

    const daily   = (dailyRes.data.rows  || []);
    const queries = (queryRes.data.rows  || []);
    const yearly  = (yearlyRes.data.rows || []);
    const prevRows= (prevRes.data.rows   || []);

    const prevClicks = prevRows.reduce((s,r) => s+(r.clicks||0), 0);
    const prevImpr   = prevRows.reduce((s,r) => s+(r.impressions||0), 0);
    const prevCtr    = prevImpr > 0 ? parseFloat((prevClicks/prevImpr*100).toFixed(1)) : 0;
    const prevPos    = prevRows.length ? parseFloat((prevRows.reduce((s,r)=>s+(r.position||0),0)/prevRows.length).toFixed(1)) : 0;

    const totalClicks = daily.reduce((s, r) => s + (r.clicks || 0), 0);
    const totalImpr   = daily.reduce((s, r) => s + (r.impressions || 0), 0);
    const avgCtr      = totalImpr > 0 ? parseFloat((totalClicks / totalImpr * 100).toFixed(1)) : 0;
    const avgPos      = daily.length
      ? parseFloat((daily.reduce((s, r) => s + (r.position || 0), 0) / daily.length).toFixed(1))
      : 0;

    return {
      summary: { clicks: totalClicks, impressions: totalImpr, ctr: avgCtr, position: avgPos },
      daily:   daily.map(r => ({
        date:        r.keys[0],
        clicks:      r.clicks      || 0,
        impressions: r.impressions || 0,
        ctr:         parseFloat(((r.ctr || 0) * 100).toFixed(1)),
        position:    parseFloat((r.position || 0).toFixed(1)),
      })),
      queries: queries.map(r => ({
        query:       r.keys[0],
        clicks:      r.clicks      || 0,
        impressions: r.impressions || 0,
        ctr:         parseFloat(((r.ctr || 0) * 100).toFixed(1)),
        position:    parseFloat((r.position || 0).toFixed(1)),
      })),
      daily_year: yearly.map(r => ({
        date:        r.keys[0],
        clicks:      r.clicks      || 0,
        impressions: r.impressions || 0,
        ctr:         parseFloat(((r.ctr || 0) * 100).toFixed(1)),
        position:    parseFloat((r.position || 0).toFixed(1)),
      })),
      previous: { clicks: prevClicks, impressions: prevImpr, ctr: prevCtr, position: prevPos },
      prevPeriod: `${prevStartStr} – ${prevEndStr}`,
      keyword,
    };
  } catch (e) {
    console.warn('[GSC]', e.message);
    return null;
  }
}

// GOOGLE SHEETS — estadísticas de subasta (escritas por Google Ads Script)
// ─────────────────────────────────────────────────────────────────────────────

let _auctionSheetCache = { data: null, ts: 0 };
const AUCTION_CACHE_TTL = 60 * 60 * 1000; // 1 hora

async function fetchAuctionFromSheets() {
  const sheetId = process.env.GOOGLE_SHEETS_AUCTION_ID;
  if (!sheetId) return null;

  // Cache en memoria para no leer Sheets en cada request
  if (_auctionSheetCache.data && Date.now() - _auctionSheetCache.ts < AUCTION_CACHE_TTL) {
    return _auctionSheetCache.data;
  }

  try {
    const { google } = require('googleapis');

    // Credenciales desde env var (JSON completo como string)
    const credJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    const keyFile  = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

    const auth = new google.auth.GoogleAuth({
      ...(credJson ? { credentials: JSON.parse(credJson) } : { keyFile }),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets   = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'AuctionInsights!A:H',
    });

    const rows = response.data.values || [];
    if (rows.length < 2) return [];

    // Primera fila = headers, resto = datos
    const data = rows.slice(1).map(r => ({
      domain:     r[0] || '',
      imprShare:  parseFloat(r[1]) || null,
      topImpr:    parseFloat(r[2]) || null,
      absTopImpr: parseFloat(r[3]) || null,
      overlap:    parseFloat(r[4]) || null,
      outranking: parseFloat(r[5]) || null,
      posAbove:   parseFloat(r[6]) || null,
      updated:    r[7] || '',
    })).filter(r => r.domain)
      .sort((a, b) => (b.topImpr || 0) - (a.topImpr || 0));

    _auctionSheetCache = { data, ts: Date.now() };
    console.log(`[auction sheets] ${data.length} dominios cargados desde Sheets`);
    return data;
  } catch (e) {
    console.warn('[auction sheets]', e.message);
    return null;
  }
}

// Cache de etapas del pipeline de Pipedrive
let _stageCache = null;
async function fetchPipelineStages() {
  if (_stageCache) return _stageCache;
  const token = process.env.PIPEDRIVE_API_TOKEN;
  const pid   = process.env.PIPEDRIVE_PIPELINE_ID || '';
  const resp  = await fetch(`https://api.pipedrive.com/v1/stages?pipeline_id=${pid}&api_token=${token}`);
  if (!resp.ok) return (_stageCache = {});
  const json  = await resp.json();
  _stageCache = Object.fromEntries((json.data || []).map(s => [s.id, s.name]));
  return _stageCache;
}

// Construye un resumen de deals para mostrar en el popup del dashboard
function buildDealSummaries(deals, fieldOrigen, origenMap, stageMap) {
  // Más recientes primero para que aparezcan en el popup sin necesitar "Ver todos"
  return [...deals]
    .sort((a, b) => (b.add_time || '').localeCompare(a.add_time || ''))
    .slice(0, 100).map(d => ({
    id:        d.id,
    title:     d.title || '(sin título)',
    value:     d.value != null ? `$${Number(d.value).toLocaleString('es-MX')} ${d.currency || ''}`.trim() : '–',
    status:    d.status === 'won' ? 'Ganado' : d.status === 'lost' ? 'Perdido' : 'Abierto',
    owner:     d.owner_name || d.user_id?.name || '–',
    stage:     stageMap[d.stage_id] || `Etapa ${d.stage_id || '–'}`,
    origenSQL: (() => { const r = fieldOrigen ? d[fieldOrigen] : null; return r ? (origenMap[String(r)] || String(r)) : '–'; })(),
    add_time:  (d.add_time || '').slice(0, 10),
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// CREDENCIALES Y HELPERS DE GOOGLE ADS REST
// ─────────────────────────────────────────────────────────────────────────────

// Cache del access token OAuth2 (evita una llamada extra por request)
let _tokenCache = { token: null, expiresAt: 0 };

async function getGoogleAccessToken() {
  if (_tokenCache.token && Date.now() < _tokenCache.expiresAt) return _tokenCache.token;
  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     process.env.GOOGLE_ADS_CLIENT_ID,
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
      grant_type:    'refresh_token',
    }),
  });
  const json = await resp.json();
  if (!json.access_token) throw new Error(`OAuth2: ${json.error_description || JSON.stringify(json)}`);
  _tokenCache = { token: json.access_token, expiresAt: Date.now() + (json.expires_in - 60) * 1000 };
  return json.access_token;
}

// Llama directamente a la REST API de Google Ads (sin librería npm)
// Necesario para campos como auction_insight.domain que la librería no expone
async function googleAdsRESTSearch(query) {
  const token     = await getGoogleAccessToken();
  const customerId = (process.env.GOOGLE_ADS_CUSTOMER_ID || '').replace(/-/g, '');
  const loginId   = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID;
  const headers   = {
    'Authorization':   `Bearer ${token}`,
    'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
    'Content-Type':    'application/json',
  };
  if (loginId && loginId.trim()) headers['login-customer-id'] = loginId.trim();

  // Detecta la versión disponible (prueba v18, v17, v16)
  for (const ver of ['v18', 'v17', 'v16']) {
    const url  = `https://googleads.googleapis.com/${ver}/customers/${customerId}/googleAds:search`;
    const resp = await fetch(url, {
      method: 'POST', headers,
      body: JSON.stringify({ query, pageSize: 10000 }),
    });
    const text = await resp.text();
    if (text.trimStart().startsWith('<')) continue; // HTML → versión incorrecta, prueba la siguiente
    const json = JSON.parse(text);
    if (!resp.ok) {
      const msg = json.error?.message
        || json.error?.details?.[0]?.errors?.[0]?.message
        || JSON.stringify(json.error).slice(0, 300);
      throw new Error(msg);
    }
    console.log(`[auction REST] usando ${ver}`);
    return json.results || [];
  }
  throw new Error('Ninguna versión de la REST API disponible (v18/v17/v16)');
}

const ADS_CREDS = {
  developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
  clientId:       process.env.GOOGLE_ADS_CLIENT_ID,
  clientSecret:   process.env.GOOGLE_ADS_CLIENT_SECRET,
  refreshToken:   process.env.GOOGLE_ADS_REFRESH_TOKEN,
  customerId:     process.env.GOOGLE_ADS_CUSTOMER_ID,
};

function hasAdsCreds()      { return Object.values(ADS_CREDS).every(v => v && v.trim()); }
function hasPipedriveCreds(){ const t = process.env.PIPEDRIVE_API_TOKEN; return !!(t && t.trim()); }

// ─────────────────────────────────────────────────────────────────────────────
// PIPEDRIVE
// ─────────────────────────────────────────────────────────────────────────────

// Cache del mapa ID→label del campo enum "Origen de SQL"
let _origenOptionMap = null;

async function getPipedriveOrigenMap() {
  if (_origenOptionMap) return _origenOptionMap;
  const token    = process.env.PIPEDRIVE_API_TOKEN;
  const fieldKey = process.env.PIPEDRIVE_FIELD_ORIGEN_SQL || '';
  if (!fieldKey) return (_origenOptionMap = {});

  const resp = await fetch(`https://api.pipedrive.com/v1/dealFields?limit=500&api_token=${token}`);
  if (!resp.ok) return (_origenOptionMap = {});
  const json = await resp.json();
  if (!json.success || !json.data) return (_origenOptionMap = {});

  const field = json.data.find(f => f.key === fieldKey);
  _origenOptionMap = field?.options
    ? Object.fromEntries(field.options.map(opt => [String(opt.id), opt.label]))
    : {};
  return _origenOptionMap;
}

async function fetchPipedriveDeals() {
  const token      = process.env.PIPEDRIVE_API_TOKEN;
  const pipelineId = process.env.PIPEDRIVE_PIPELINE_ID;
  const base       = 'https://api.pipedrive.com/v1';
  let all = [], start = 0;

  while (true) {
    const pipelineParam = pipelineId ? `&pipeline_id=${pipelineId}` : '';
    const url  = `${base}/deals?api_token=${token}&status=all_not_deleted&limit=500&start=${start}${pipelineParam}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Pipedrive ${resp.status} ${resp.statusText}`);
    const json = await resp.json();
    if (!json.success || !Array.isArray(json.data) || !json.data.length) break;
    all   = all.concat(json.data);
    start += 500;
    if (!json.additional_data?.pagination?.more_items_in_collection) break;
  }
  return all;
}

// ─────────────────────────────────────────────────────────────────────────────
// STATE TRACKING: registra cuándo se detectó por primera vez cada calificación
// ─────────────────────────────────────────────────────────────────────────────

const STATE_FILE = path.join(__dirname, 'deals_state.json');

function loadState() {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); }
  catch { return { initialized: false, deals: {} }; }
}

function saveState(state) {
  try { fs.writeFileSync(STATE_FILE, JSON.stringify(state)); }
  catch (e) { console.warn('[state]', e.message); }
}

function localDateStr(d) {
  const y  = d.getFullYear();
  const m  = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

// Actualiza el estado con los deals actuales y retorna el estado.
// - Primera ejecución (initialized=false): usa add_time como proxy de la fecha
//   de calificación (deals de Q1 → aparecen en Q1, deals de mayo → en mayo).
// - Ejecuciones siguientes: los deals recién calificados reciben la fecha de hoy.
// - Si un campo se borra, se elimina el registro.
function updateQualState(deals, fieldCalLead, fieldCalSQL) {
  const state   = loadState();
  const todayStr = localDateStr(new Date());
  let changed   = false;

  for (const deal of deals) {
    const id      = String(deal.id);
    const rec     = state.deals[id] || {};
    const hasLead = fieldCalLead ? (deal[fieldCalLead] != null && deal[fieldCalLead] !== '') : false;
    const hasSQL  = fieldCalSQL  ? (deal[fieldCalSQL]  != null && deal[fieldCalSQL]  !== '') : false;

    // Fecha de calificación como lead
    if (hasLead && !rec.leadSet) {
      rec.leadSet = state.initialized
        ? todayStr
        : (deal.add_time || todayStr).slice(0, 10);
      changed = true;
    } else if (!hasLead && rec.leadSet) {
      delete rec.leadSet; changed = true;
    }

    // Fecha de calificación como SQL
    if (hasSQL && !rec.sqlSet) {
      rec.sqlSet = state.initialized
        ? todayStr
        : (deal.add_time || todayStr).slice(0, 10);
      changed = true;
    } else if (!hasSQL && rec.sqlSet) {
      delete rec.sqlSet; changed = true;
    }

    if (rec.leadSet || rec.sqlSet) state.deals[id] = rec;
    else delete state.deals[id];
  }

  if (!state.initialized) { state.initialized = true; changed = true; }
  if (changed) saveState(state);
  return state;
}

async function processPipedrive(deals, period, origenMap, stageMap = {}) {
  const { start, end, year } = parsePeriod(period);
  const fieldCalLead = process.env.PIPEDRIVE_FIELD_CALIFICACION_LEAD || '';
  const fieldCalSQL  = process.env.PIPEDRIVE_FIELD_CALIFICACION_SQL  || '';
  const fieldOrigen  = process.env.PIPEDRIVE_FIELD_ORIGEN_SQL        || '';

  const isSQL  = d => fieldCalSQL  ? (d[fieldCalSQL]  != null && d[fieldCalSQL]  !== '') : false;
  const isLead = d => fieldCalLead ? (d[fieldCalLead] != null && d[fieldCalLead] !== '') : false;

  const getLabel  = d => {
    const raw = fieldOrigen ? d[fieldOrigen] : null;
    if (raw == null || raw === '') return '';
    return origenMap[String(raw)] || String(raw);
  };
  const isSQLPaid = d => isSQL(d) && /paid/i.test(getLabel(d));
  const isSQLOrg  = d => isSQL(d) && /org/i.test(getLabel(d));
  const isSQLOut  = d => isSQL(d) && /outbound/i.test(getLabel(d));

  const startStr = localDateStr(start);
  const endStr   = localDateStr(end);

  // Leads y SQLs: deals CREADOS en el periodo (add_time) que tienen el campo
  // calificado lleno. Así, calificar un deal de enero hoy lo cuenta en enero.
  const leadDeals = deals.filter(d => {
    if (!isLead(d)) return false;
    const addStr = (d.add_time || '').slice(0, 10);
    return addStr >= startStr && addStr <= endStr;
  });
  const sqlDeals = deals.filter(d => {
    if (!isSQL(d)) return false;
    const addStr = (d.add_time || '').slice(0, 10);
    return addStr >= startStr && addStr <= endStr;
  });

  // Clientes ganados: compara el string de fecha directamente para evitar
  // conversiones de timezone (Pipedrive devuelve "YYYY-MM-DD HH:MM:SS" en la
  // zona horaria de la cuenta, que coincide con nuestros startStr/endStr locales)
  const wonDeals = deals.filter(d => {
    if (!d.won_time) return false;
    const wonStr = d.won_time.slice(0, 10); // "2026-06-01" de "2026-06-01 19:30:00"
    return wonStr >= startStr && wonStr <= endStr;
  });

  // updatedInPeriod por add_time: para el donut de origen y gráficos de tendencia
  const updatedInPeriod = deals.filter(d => {
    const t = new Date(d.add_time);
    return t >= start && t <= end;
  });

  // SQLs del año completo para gráficos mensuales
  const sqlsPaidOrganicoPorMes = Array(12).fill(0);
  const sqlsYear = [];
  for (const deal of deals) {
    const t = new Date(deal.add_time);
    if (t.getFullYear() !== year) continue;
    if (isSQL(deal)) sqlsYear.push(deal);
    if (isSQLPaid(deal) || isSQLOrg(deal)) sqlsPaidOrganicoPorMes[t.getMonth()]++;
  }

  const sqlsPaidDeals = updatedInPeriod.filter(isSQLPaid);
  const sqlsOrgDeals  = updatedInPeriod.filter(isSQLOrg);
  const sqlsOutDeals  = updatedInPeriod.filter(isSQLOut);

  // Origen: solo SQLs calificados (calificación SQL llena), agrupados por origen
  // El total coincide con el número de SQLs del resumen ejecutivo
  const dealsByOrigin = {};
  for (const deal of sqlDeals) {
    const label = getLabel(deal) || 'Sin fuente';
    if (!dealsByOrigin[label]) dealsByOrigin[label] = [];
    if (dealsByOrigin[label].length < 100) {
      dealsByOrigin[label].push({
        id:        deal.id,
        title:     deal.title || '(sin título)',
        value:     deal.value != null ? `$${Number(deal.value).toLocaleString('es-MX')} ${deal.currency||''}`.trim() : '–',
        status:    deal.status === 'won' ? 'Ganado' : deal.status === 'lost' ? 'Perdido' : 'Abierto',
        owner:     deal.owner_name || deal.user_id?.name || '–',
        stage:     (stageMap||{})[deal.stage_id] || `Etapa ${deal.stage_id||'–'}`,
        origenSQL: label,
        add_time:  (deal.add_time||'').slice(0,10),
      });
    }
  }

  return {
    pipeline:      { leads: leadDeals.length, sqls: sqlDeals.length, ganados: wonDeals.length },
    origenSqls:    groupByOrigenSQL(sqlDeals, fieldOrigen, origenMap),
    origenGanados: groupByOrigenSQL(wonDeals, fieldOrigen, origenMap),
    sqlsPorMes:    groupByMonth(sqlsYear, year),
    sqlsPaidOrganicoPorMes,
    totals: {
      leadsCalificados: leadDeals.length,
      sqls:             sqlDeals.length,
      clientesGanados:  wonDeals.length,
      sqlsPaidMedia:    sqlsPaidDeals.length,
      sqlsOrganicos:    sqlsOrgDeals.length,
      sqlsOutbound:     sqlsOutDeals.length,
    },
    dealLists: {
      leads:    buildDealSummaries(leadDeals,    fieldOrigen, origenMap, stageMap),
      sqls:     buildDealSummaries(sqlDeals,     fieldOrigen, origenMap, stageMap),
      ganados:  buildDealSummaries(wonDeals,     fieldOrigen, origenMap, stageMap),
      sqlsPaid: buildDealSummaries(sqlsPaidDeals,fieldOrigen, origenMap, stageMap),
      sqlsOrg:  buildDealSummaries(sqlsOrgDeals, fieldOrigen, origenMap, stageMap),
    },
    dealsByOrigin,
    _debug: {
      totalFetched:    deals.length,
      updatedInPeriod_update: updatedInPeriod.length,  // filtrado por update_time
      conLeadField:    leadDeals.length,
      conSQLField:     sqlDeals.length,
      wonDeals:        wonDeals.length,
      conOrigenFilled: sqlDeals.length,
      fieldCalLead,
      fieldCalSQL,
      sampleDeal: updatedInPeriod[0] ? {
        id:          updatedInPeriod[0].id,
        pipeline_id: updatedInPeriod[0].pipeline_id,
        add_time:    updatedInPeriod[0].add_time,
        update_time: updatedInPeriod[0].update_time,
        won_time:    updatedInPeriod[0].won_time,
        leadVal:     updatedInPeriod[0][fieldCalLead],
        sqlVal:      updatedInPeriod[0][fieldCalSQL],
        origenVal:   updatedInPeriod[0][fieldOrigen],
      } : null,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// GOOGLE ADS
// ─────────────────────────────────────────────────────────────────────────────

const CHANGE_TYPE_ES = {
  AD: 'Anuncio', AD_GROUP_AD: 'Anuncio', AD_GROUP: 'Grupo',
  AD_GROUP_CRITERION: 'Keyword', AD_GROUP_BID_MODIFIER: 'Puja',
  CAMPAIGN: 'Campaña', CAMPAIGN_BUDGET: 'Presupuesto',
  CAMPAIGN_CRITERION: 'Segmentación', FEED: 'Feed', FEED_ITEM: 'Feed item',
};

async function fetchFromGoogleAds(period = 'this_month') {
  const { GoogleAdsApi } = require('google-ads-api');
  const pc      = parsePeriod(period);
  const dateWhere = `AND segments.date BETWEEN '${pc.startStr}' AND '${pc.endStr}'`;

  const client = new GoogleAdsApi({
    client_id:       ADS_CREDS.clientId,
    client_secret:   ADS_CREDS.clientSecret,
    developer_token: ADS_CREDS.developerToken,
  });
  const loginId  = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID;
  const customer = client.Customer({
    customer_id:       ADS_CREDS.customerId,
    refresh_token:     ADS_CREDS.refreshToken,
    ...(loginId && loginId.trim() ? { login_customer_id: loginId.trim() } : {}),
  });

  // ── Query 1: resumen de cuenta (FROM campaign — incluye pausadas, sin filtros de grupo) ──
  // GAQL exige WHERE antes de DURING; usamos siempre BETWEEN con fechas explícitas
  // para evitar ese problema y para que funcione igual con todos los periodos.
  const summaryQ = `
    SELECT
      metrics.cost_micros, metrics.conversions, metrics.ctr,
      metrics.impressions,  metrics.clicks
    FROM campaign
    WHERE segments.date BETWEEN '${pc.startStr}' AND '${pc.endStr}'
  `;

  // ── Query 2: árbol campaña→grupo ─────────────────────────────────────────────
  // segments.date en WHERE (sin SELECT) filtra el periodo sin desagregar por día
  const adGroupQ = `
    SELECT
      campaign.id, campaign.name, campaign.advertising_channel_type,
      ad_group.id, ad_group.name,
      metrics.impressions, metrics.conversions, metrics.ctr,
      metrics.search_rank_lost_impression_share
    FROM ad_group
    WHERE campaign.status = 'ENABLED'
      AND ad_group.status = 'ENABLED'
      ${dateWhere}
  `;

  // ── Query 3a: TODAS las keywords activas (sin filtro de fecha)
  // ad_group_criterion devuelve todas sin importar si tuvieron actividad
  const kwAllQ = `
    SELECT
      campaign.id, ad_group.id,
      ad_group_criterion.keyword.text,
      ad_group_criterion.keyword.match_type,
      ad_group_criterion.quality_info.quality_score,
      ad_group_criterion.quality_info.creative_quality_score,
      ad_group_criterion.quality_info.post_click_quality_score,
      ad_group_criterion.quality_info.search_predicted_ctr
    FROM ad_group_criterion
    WHERE campaign.status = 'ENABLED'
      AND ad_group.status = 'ENABLED'
      AND ad_group_criterion.status = 'ENABLED'
      AND ad_group_criterion.type = 'KEYWORD'
      AND ad_group_criterion.negative = false
  `;

  // ── Query 3b: métricas del periodo para keywords con actividad
  const keywordQ = `
    SELECT
      campaign.id, ad_group.id,
      ad_group_criterion.keyword.text,
      ad_group_criterion.keyword.match_type,
      metrics.impressions, metrics.conversions,
      metrics.cost_micros, metrics.clicks,
      metrics.historical_quality_score,
      metrics.historical_creative_quality_score,
      metrics.historical_landing_page_quality_score,
      metrics.historical_search_predicted_ctr
    FROM keyword_view
    WHERE campaign.status = 'ENABLED'
      AND ad_group.status = 'ENABLED'
      AND ad_group_criterion.status = 'ENABLED'
      AND ad_group_criterion.negative = false
      ${dateWhere}
  `;

  // ── Query 3c: métricas mensuales del año en curso por keyword ────────────────
  const keywordMonthlyQ = `
    SELECT
      ad_group.id,
      ad_group_criterion.keyword.text,
      ad_group_criterion.keyword.match_type,
      segments.month,
      metrics.impressions, metrics.conversions, metrics.cost_micros, metrics.clicks,
      metrics.historical_quality_score,
      metrics.historical_creative_quality_score,
      metrics.historical_landing_page_quality_score,
      metrics.historical_search_predicted_ctr
    FROM keyword_view
    WHERE campaign.status = 'ENABLED'
      AND ad_group.status = 'ENABLED'
      AND ad_group_criterion.status = 'ENABLED'
      AND ad_group_criterion.negative = false
      AND segments.date BETWEEN '${pc.year}-01-01' AND '${pc.endStr}'
  `;
  const monthlyQ = `
    SELECT segments.month, metrics.conversions, metrics.cost_micros
    FROM campaign
    WHERE segments.date BETWEEN '${pc.year}-01-01' AND '${pc.year}-12-31'
  `;

  // ── Query 5: historial de cambios (últimos 30 días, ventana fija) ─────────────
  // change_event requiere BETWEEN con inicio y fin explícitos
  const changeStart = new Date(Date.now() - 29 * 86_400_000)
    .toISOString().replace('T', ' ').slice(0, 19);
  const changeEnd = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const changesQ = `
    SELECT
      change_event.change_date_time,
      change_event.change_resource_type,
      change_event.changed_fields,
      change_event.user_email,
      campaign.name,
      ad_group.name
    FROM change_event
    WHERE change_event.change_date_time BETWEEN '${changeStart}' AND '${changeEnd}'
    ORDER BY change_event.change_date_time DESC
    LIMIT 25
  `;

  // Ejecuta en paralelo; kwAllRows = lista completa, keywordRows = métricas del periodo
  const [summaryRows, adGroupRows, kwAllRows, keywordRows, monthlyRows, kwMonthlyRows] = await Promise.all([
    customer.query(summaryQ),
    customer.query(adGroupQ),
    customer.query(kwAllQ),
    customer.query(keywordQ),
    customer.query(monthlyQ),
    customer.query(keywordMonthlyQ),
  ]);

  let changesRows = [];
  try { changesRows = await customer.query(changesQ); }
  catch (e) {
    const msg = e?.message || e?.errors?.[0]?.message || JSON.stringify(e?.failure||e).slice(0,200);
    console.warn('[change_event]', msg);
  }

  // ── Query 5: estadísticas de subasta via REST API directa ────────────────────
  // La librería npm no expone auction_insight.domain; la REST API sí lo permite.
  let auctionData = [];
  try {
    const auctionQ = `
      SELECT
        auction_insight.domain,
        metrics.auction_insight_search_impression_share,
        metrics.auction_insight_search_top_impression_percentage,
        metrics.auction_insight_search_absolute_top_impression_percentage,
        metrics.auction_insight_search_overlap_rate,
        metrics.auction_insight_search_outranking_share,
        metrics.auction_insight_search_position_above_rate
      FROM campaign
      WHERE campaign.status IN ('ENABLED', 'PAUSED')
        AND segments.date BETWEEN '${pc.startStr}' AND '${pc.endStr}'
    `;
    const rows = await googleAdsRESTSearch(auctionQ);
    // Agregar por dominio (un row por campaña×dominio)
    const byDomain = {};
    for (const row of rows) {
      const domain = row.auctionInsight?.domain || 'Desconocido';
      if (!byDomain[domain]) byDomain[domain] = { n:0, is:0, ti:0, ati:0, or:0, ou:0, pa:0 };
      const m = row.metrics || {}, d = byDomain[domain];
      d.n++;
      d.is  += parseFloat(m.auctionInsightSearchImpressionShare || 0);
      d.ti  += parseFloat(m.auctionInsightSearchTopImpressionPercentage || 0);
      d.ati += parseFloat(m.auctionInsightSearchAbsoluteTopImpressionPercentage || 0);
      d.or  += parseFloat(m.auctionInsightSearchOverlapRate || 0);
      d.ou  += parseFloat(m.auctionInsightSearchOutrankingShare || 0);
      d.pa  += parseFloat(m.auctionInsightSearchPositionAboveRate || 0);
    }
    const p100 = v => parseFloat((v * 100).toFixed(1));
    auctionData = Object.entries(byDomain)
      .map(([domain, d]) => ({
        domain,
        imprShare:  p100(d.is  / d.n),
        topImpr:    p100(d.ti  / d.n),
        absTopImpr: p100(d.ati / d.n),
        overlap:    p100(d.or  / d.n),
        outranking: p100(d.ou  / d.n),
        posAbove:   p100(d.pa  / d.n),
      }))
      .sort((a, b) => b.imprShare - a.imprShare);
    console.log(`[auction REST] ${auctionData.length} competidores para ${pc.startStr}–${pc.endStr}`);
  } catch (e) {
    console.warn('[auction REST]', e.message);
  }

  // ── Resumen a nivel cuenta (FROM campaign — fuente autoritativa) ───────────────
  let totalCost = 0, totalConv = 0, totalImpr = 0, totalClicks = 0;
  for (const row of summaryRows) {
    totalCost   += num(row.metrics.cost_micros);
    totalConv   += num(row.metrics.conversions);
    totalImpr   += num(row.metrics.impressions);
    totalClicks += num(row.metrics.clicks);
  }
  const gasto = parseFloat((totalCost / 1e6).toFixed(2));
  const convs = Math.round(totalConv);
  const ctr   = totalImpr > 0 ? parseFloat((totalClicks / totalImpr * 100).toFixed(2)) : 0;
  const cpl   = convs > 0     ? parseFloat((gasto / convs).toFixed(2)) : 0;
  const cpc   = totalClicks > 0 ? parseFloat((gasto / totalClicks).toFixed(2)) : 0;

  const summary = { gasto, conversiones: convs, cpl, ctr, cpc, impr: totalImpr };

  // ── Conversiones y gasto por mes ──────────────────────────────────────────────
  const byMonth      = Array(12).fill(0);
  const byMonthGasto = Array(12).fill(0);
  for (const row of monthlyRows) {
    const m = row.segments?.month; // formato "2026-05-01"
    if (m) {
      const idx = parseInt(m.split('-')[1], 10) - 1;
      if (idx >= 0 && idx < 12) {
        byMonth[idx]      += num(row.metrics.conversions);
        byMonthGasto[idx] += num(row.metrics.cost_micros);
      }
    }
  }
  const convPorMes  = { labels: MONTHS_ES, data: byMonth.map(v => Math.round(v)) };
  const gastoPorMes = { labels: MONTHS_ES, data: byMonthGasto.map(v => parseFloat((v / 1e6).toFixed(2))) };

  // ── Árbol campaña → grupo → keywords ──────────────────────────────────────
  const campaignMap = {};
  const adGroupMap  = {};

  for (const row of adGroupRows) {
    const cId  = String(row.campaign.id);
    const agId = String(row.ad_group.id);

    if (!campaignMap[cId]) {
      // advertising_channel_type viene como entero enum de la API
      const CHANNEL = { 2:'Search', 3:'Display', 4:'Shopping', 6:'Video', 9:'Smart', 10:'Performance Max' };
      campaignMap[cId] = {
        id:     `campaign-${cId}`,
        type:   CHANNEL[row.campaign.advertising_channel_type] || 'Other',
        name:   row.campaign.name,
        groups: [],
      };
    }

    const group = {
      id:      `ag-${agId}`,
      name:    row.ad_group.name,
      metrics: {
        impressions:     num(row.metrics.impressions),
        ctr:             parseFloat((num(row.metrics.ctr) * 100).toFixed(2)),
        conversions:     parseFloat(num(row.metrics.conversions).toFixed(2)),
        lostImprRanking: parseFloat((num(row.metrics.search_rank_lost_impression_share) * 100).toFixed(1)),
      },
      keywords: [],
    };
    adGroupMap[agId] = group;
    campaignMap[cId].groups.push(group);
  }

  // google-ads-api npm enum: 2=EXACT, 3=PHRASE, 4=BROAD (¡NO al revés!)
  const MATCH = { 2:'exact',3:'phrase',4:'broad', EXACT:'exact',PHRASE:'phrase',BROAD:'broad' };
  const resolveMatch = mt => MATCH[mt] || MATCH[String(mt).toUpperCase()] || String(mt||'').toLowerCase();

  // Paso 1: cargar TODAS las keywords (sin filtro de fecha) con QS
  for (const row of kwAllRows) {
    const agId = String(row.ad_group.id);
    if (!adGroupMap[agId]) continue;
    const qi = row.ad_group_criterion.quality_info || {};
    const kw = row.ad_group_criterion.keyword      || {};
    if (!kw.text) continue;
    adGroupMap[agId].keywords.push({
      match:       resolveMatch(kw.match_type),
      text:        kw.text,
      qs:          qi.quality_score          || null,
      adRelevance: qi.creative_quality_score || null,
      lpExperience:qi.post_click_quality_score || null,
      impressions: 0, conversions: 0, cost: 0, clicks: 0, // se actualizan en paso 2
      historicalQs: null, historicalAdRelevance: null,
      historicalLpExperience: null, historicalCtr: null,
    });
  }

  // Paso 2: mezclar métricas del periodo desde keyword_view
  const kwMetricsMap = {};
  for (const row of keywordRows) {
    const agId = String(row.ad_group.id);
    const kw   = row.ad_group_criterion.keyword || {};
    const key  = `${agId}::${kw.text}::${resolveMatch(kw.match_type)}`;
    kwMetricsMap[key] = {
      impressions:            num(row.metrics.impressions),
      conversions:            parseFloat(num(row.metrics.conversions).toFixed(2)),
      cost:                   num(row.metrics.cost_micros),
      clicks:                 num(row.metrics.clicks),
      historicalQs:           row.metrics.historical_quality_score              || null,
      historicalAdRelevance:  row.metrics.historical_creative_quality_score     || null,
      historicalLpExperience: row.metrics.historical_landing_page_quality_score || null,
      historicalCtr:          row.metrics.historical_search_predicted_ctr       || null,
    };
  }
  // Aplicar métricas a keywords
  for (const agId in adGroupMap) {
    adGroupMap[agId].keywords.forEach(kw => {
      const key = `${agId}::${kw.text}::${kw.match}`;
      const m   = kwMetricsMap[key];
      if (m) Object.assign(kw, m);
    });
  }

  // Paso 2b: datos mensuales por keyword (año en curso)
  const kwMonthlyMap = {};
  for (const row of kwMonthlyRows) {
    const agId  = String(row.ad_group.id);
    const kw    = row.ad_group_criterion.keyword || {};
    const key   = `${agId}::${kw.text}::${resolveMatch(kw.match_type)}`;
    const month = row.segments?.month || '';  // formato "2026-05-01"
    if (!kwMonthlyMap[key]) kwMonthlyMap[key] = {};
    kwMonthlyMap[key][month] = {
      month,
      impressions:  num(row.metrics.impressions),
      conversions:  parseFloat(num(row.metrics.conversions).toFixed(2)),
      cost:         num(row.metrics.cost_micros),
      clicks:       num(row.metrics.clicks),
      historicalQs:           row.metrics.historical_quality_score              || null,
      historicalAdRelevance:  row.metrics.historical_creative_quality_score     || null,
      historicalLpExperience: row.metrics.historical_landing_page_quality_score || null,
      historicalCtr:          row.metrics.historical_search_predicted_ctr       || null,
    };
  }
  // Adjuntar monthly a cada keyword como array ordenado por mes
  for (const agId in adGroupMap) {
    adGroupMap[agId].keywords.forEach(kw => {
      const key = `${agId}::${kw.text}::${kw.match}`;
      const byMonth = kwMonthlyMap[key] || {};
      kw.monthly = Object.values(byMonth).sort((a, b) => a.month.localeCompare(b.month));
    });
  }

  // Agrega QS y señales de calidad a nivel grupo
  for (const agId in adGroupMap) {
    const g   = adGroupMap[agId];
    const kws = g.keywords;
    if (!kws.length) continue;

    const validQs = kws.map(k => k.qs).filter(q => q > 0);
    const avgQs   = validQs.length ? validQs.reduce((a, b) => a + b, 0) / validQs.length : null;
    g.qs       = avgQs !== null ? parseFloat(avgQs.toFixed(1)) : null;
    g.qsStatus = qsColor(g.qs);

    const validHistQs = kws.map(k => k.historicalQs).filter(q => q > 0);
    g.historicalQs = validHistQs.length
      ? parseFloat((validHistQs.reduce((a, b) => a + b, 0) / validHistQs.length).toFixed(1))
      : null;

    g.adRelevance            = mostCommon(kws.map(k => k.adRelevance).filter(Boolean));
    g.lpExperience           = mostCommon(kws.map(k => k.lpExperience).filter(Boolean));
    g.historicalAdRelevance  = mostCommon(kws.map(k => k.historicalAdRelevance).filter(Boolean));
    g.historicalLpExperience = mostCommon(kws.map(k => k.historicalLpExperience).filter(Boolean));

    const validHistCtr = kws.map(k => k.historicalCtr).filter(v => v > 0);
    g.historicalCtr = validHistCtr.length
      ? parseFloat((validHistCtr.reduce((a, b) => a + b, 0) / validHistCtr.length).toFixed(4))
      : null;
  }

  const campaigns = Object.values(campaignMap).map(c => ({
    ...c,
    groupCount:   c.groups.length,
    keywordCount: c.groups.reduce((s, g) => s + g.keywords.length, 0),
  }));

  // ── Cambios recientes ──────────────────────────────────────────────────────
  const changes = changesRows.map(row => {
    const dt      = new Date(row.change_event.change_date_time);
    const dateStr = dt.toLocaleString('es-MX', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' });
    const typeKey = row.change_event.change_resource_type;
    // changed_fields puede ser string o FieldMask {paths:[...]}
    const cfRaw   = row.change_event.changed_fields;
    const fields  = (typeof cfRaw === 'string' ? cfRaw
                  : Array.isArray(cfRaw) ? cfRaw.join(',')
                  : cfRaw?.paths?.join(',') || String(cfRaw||'')).toLowerCase();
    const user    = (row.change_event.user_email || '').split('@')[0];
    const ag      = row.ad_group?.name  || '';
    const camp    = row.campaign?.name  || '';
    // Nombres cortos: quitar sufijos largos
    const agShort   = ag.replace(/\s*[|·—].*/,'').trim() || ag;
    const campShort = camp.split('|')[0].trim() || camp;
    const ctx       = agShort || campShort;

    let desc = '';
    switch (typeKey) {
      case 'AD_GROUP_CRITERION':
        if (fields.includes('status'))
          desc = `Keyword ${fields.includes('paused')||fields.includes('pause') ? 'pausada' : 'activada'} en ${ctx}`;
        else if (fields.includes('bid') || fields.includes('cpc'))
          desc = `Puja de keyword ajustada en ${ctx}`;
        else if (fields.includes('match'))
          desc = `Concordancia de keyword cambiada en ${ctx}`;
        else
          desc = `Keyword modificada en ${ctx}`;
        break;
      case 'AD':
      case 'AD_GROUP_AD':
        if (fields.includes('headline') || fields.includes('title'))
          desc = `Título de anuncio editado en ${ctx}`;
        else if (fields.includes('description'))
          desc = `Descripción de anuncio editada en ${ctx}`;
        else if (fields.includes('status'))
          desc = `Estado de anuncio cambiado en ${ctx}`;
        else if (fields.includes('final_url') || fields.includes('url'))
          desc = `URL de anuncio actualizada en ${ctx}`;
        else
          desc = `Anuncio editado en ${ctx}`;
        break;
      case 'AD_GROUP':
        if (fields.includes('cpc_bid') || fields.includes('bid'))
          desc = `Puja del grupo ajustada — ${ctx}`;
        else if (fields.includes('status'))
          desc = `Estado del grupo cambiado — ${ctx}`;
        else
          desc = `Configuración del grupo — ${ctx}`;
        break;
      case 'AD_GROUP_BID_MODIFIER':
        desc = `Modificador de puja ajustado — ${ctx}`;
        break;
      case 'CAMPAIGN':
        if (fields.includes('status'))
          desc = `Estado de campaña cambiado — ${campShort}`;
        else if (fields.includes('target') || fields.includes('bid'))
          desc = `Estrategia de puja actualizada — ${campShort}`;
        else if (fields.includes('name'))
          desc = `Nombre de campaña editado — ${campShort}`;
        else
          desc = `Configuración de campaña — ${campShort}`;
        break;
      case 'CAMPAIGN_BUDGET':
        desc = `Presupuesto de campaña modificado — ${campShort}`;
        break;
      case 'CAMPAIGN_CRITERION':
        desc = fields.includes('negative')
          ? `Exclusión añadida — ${campShort}`
          : `Segmentación actualizada — ${campShort}`;
        break;
      default:
        desc = `${CHANGE_TYPE_ES[typeKey]||typeKey} — ${ctx}`;
    }

    if (user) desc += ` · ${user}`;
    const type = CHANGE_TYPE_ES[typeKey] || typeKey || 'Cambio';
    // Guardar changed_fields para el detalle expandible
    const rawFields = fields; // ya procesado arriba
    return { date: dateStr, type, campaign: ag || camp, desc, fields: rawFields };
  });

  return { summary, convPorMes, gastoPorMes, campaigns, changes, auctionData };
}

// ─────────────────────────────────────────────────────────────────────────────
// ORQUESTACIÓN PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

async function fetchAllData(period) {
  const adsOk  = hasAdsCreds();
  const pipeOk = hasPipedriveCreds();

  if (!adsOk && !pipeOk) return { ...MOCK };

  // Intentar cargar subasta desde Sheets (independiente de Google Ads API)
  const _liveAuctionData = await fetchAuctionFromSheets().catch(() => null);

  // Google Search Console — rendimiento orgánico
  const gscData = await fetchSearchConsoleData(period).catch(() => null);

  let adsData   = null;
  let pipeData  = null;
  let adsError  = null;
  let pipeError = null;

  await Promise.all([
    adsOk && fetchFromGoogleAds(period)
              .then(d  => { adsData  = d; })
              .catch(e => {
                // google-ads-api lanza objetos con estructura propia, no Error estándar
                const detail = e?.message
                  || e?.errors?.[0]?.message
                  || (e?.failure ? JSON.stringify(e.failure) : null)
                  || JSON.stringify(e);
                adsError = detail;
                console.error('[Google Ads]', detail);
                console.error('[Google Ads raw]', JSON.stringify(e, Object.getOwnPropertyNames(e), 2));
              }),

    pipeOk && Promise.all([fetchPipedriveDeals(), getPipedriveOrigenMap(), fetchPipelineStages()])
               .then(async ([deals, origenMap, stageMap]) => { pipeData = await processPipedrive(deals, period, origenMap, stageMap); })
               .catch(e => { pipeError = e.message; console.error('[Pipedrive]', e.message); }),
  ].filter(Boolean));

  const mk = MOCK;

  const summary = {
    gasto:            adsData?.summary.gasto           ?? mk.summary.gasto,
    conversiones:     adsData?.summary.conversiones     ?? mk.summary.conversiones,
    cpl:              adsData?.summary.cpl              ?? mk.summary.cpl,
    ctr:              adsData?.summary.ctr              ?? mk.summary.ctr,
    cpc:              adsData?.summary.cpc              ?? mk.summary.cpc,
    impr:             adsData?.summary.impr             ?? mk.summary.impr,
    leadsCalificados: pipeData?.totals.leadsCalificados ?? mk.summary.leadsCalificados,
    sqls:             pipeData?.totals.sqls             ?? mk.summary.sqls,
    clientesGanados:  pipeData?.totals.clientesGanados  ?? mk.summary.clientesGanados,
  };

  // Métricas de SQL por origen
  const sqlsPaidMedia = pipeData?.totals.sqlsPaidMedia  ?? mk.sqlsPaidMedia;
  const sqlsOrganicos = pipeData?.totals.sqlsOrganicos  ?? mk.sqlsOrganicos;
  const sqlsOutbound  = pipeData?.totals.sqlsOutbound   ?? mk.sqlsOutbound;
  const sqlsTotales   = pipeData?.totals.sqls           ?? mk.sqlsTotales;

  // Costo por SQL = gasto del periodo / (SQLs paid + orgánicos)
  const sqlsPaidOrg = sqlsPaidMedia + sqlsOrganicos;
  const costoSQL = sqlsPaidOrg > 0
    ? parseFloat((summary.gasto / sqlsPaidOrg).toFixed(2))
    : null;

  // Costo por SQL mensual (gasto mensual / SQLs paid+org del mes)
  const gastoPorMesData    = adsData?.gastoPorMes?.data    ?? mk.gastoPorMes.data;
  const sqlsPaidOrgMes     = pipeData?.sqlsPaidOrganicoPorMes ?? Array(12).fill(0);
  const costoPorSQLMes = {
    labels: MONTHS_ES,
    data: gastoPorMesData.map((g, i) => {
      const s = sqlsPaidOrgMes[i];
      return (g != null && g > 0 && s > 0) ? Math.round(g / s) : null;
    }),
  };

  const source = adsData ? 'google-ads-api' : pipeData ? 'pipedrive-only' : 'mock';

  return {
    source,
    account:         { name: 'DETECTA-CUSTODIAS', id: ADS_CREDS.customerId || mk.account.id },
    summary,
    costoSQL,
    sqlsTotales,
    sqlsPaidMedia,
    sqlsOrganicos,
    sqlsOutbound,
    convPorMes:      adsData?.convPorMes      ?? mk.convPorMes,
    gastoPorMes:     { labels: MONTHS_ES, data: gastoPorMesData },
    costoPorSQLMes,
    sqlsPaidOrgPorMes: { labels: MONTHS_ES, data: sqlsPaidOrgMes },
    sqlsPorMes:      pipeData?.sqlsPorMes     ?? mk.sqlsPorMes,
    pipeline:        pipeData?.pipeline       ?? mk.pipeline,
    origenSqls:      pipeData?.origenSqls     ?? mk.origenSqls,
    origenGanados:   pipeData?.origenGanados  ?? mk.origenGanados,
    changes:         (adsData?.changes?.length ? adsData.changes : null) ?? mk.changes,
    campaigns:       adsData?.campaigns    ?? mk.campaigns,
    auctionData:     _liveAuctionData || (adsData?.auctionData?.length ? adsData.auctionData : mk.auctionData),
    gsc:             gscData,
    dealLists:       pipeData?.dealLists    ?? { leads:[], sqls:[], ganados:[], sqlsPaid:[], sqlsOrg:[] },
    dealsByOrigin:   pipeData?.dealsByOrigin ?? {},
    periodLabel:     parsePeriod(period).periodLabel,
    ...(adsError   ? { _adsError:   adsError          } : {}),
    ...(pipeError  ? { _pipeError:  pipeError         } : {}),
    ...(pipeData?._debug ? { _pipeDebug: pipeData._debug } : {}),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ENDPOINT
// ─────────────────────────────────────────────────────────────────────────────


app.get('/api/campaigns', async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  const period = req.query.period || 'this_month';
  try {
    res.json(await fetchAllData(period));
  } catch (err) {
    console.error('[fetchAllData]', err.message);
    res.status(500).json({ ...MOCK, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// ENDPOINTS DE CALIFICACIÓN DE DEALS
// ─────────────────────────────────────────────────────────────────────────────

// Cache de definiciones de campos (opciones de enums)
let _dealFieldsDefs = null;
async function fetchDealFieldDefs() {
  if (_dealFieldsDefs) return _dealFieldsDefs;
  const token = process.env.PIPEDRIVE_API_TOKEN;
  if (!token) return {};
  const resp = await fetch(`https://api.pipedrive.com/v1/dealFields?limit=500&api_token=${token}`);
  const json = await resp.json();
  if (!json.success) return {};
  const map = {};
  for (const f of (json.data || [])) {
    map[f.key] = {
      name:    f.name,
      type:    f.field_type,
      options: (f.options || []).map(o => ({ id: String(o.id), label: o.label })),
    };
  }
  _dealFieldsDefs = map;
  return map;
}

// GET /api/deals?period=X — lista deals del periodo con su estado de calificación
app.get('/api/deals', async (req, res) => {
  res.set('Cache-Control', 'no-store');
  if (!hasPipedriveCreds()) return res.status(503).json({ error: 'Sin credenciales Pipedrive' });

  const period   = req.query.period || 'this_month';
  const pc       = parsePeriod(period);
  const startStr = localDateStr(pc.start);
  const endStr   = localDateStr(pc.end);

  const fieldCalLead = process.env.PIPEDRIVE_FIELD_CALIFICACION_LEAD || '';
  const fieldCalSQL  = process.env.PIPEDRIVE_FIELD_CALIFICACION_SQL  || '';

  try {
    const [deals, fieldDefs] = await Promise.all([fetchPipedriveDeals(), fetchDealFieldDefs()]);

    const periodDeals = deals
      .filter(d => {
        const addStr = (d.add_time || '').slice(0, 10);
        return addStr >= startStr && addStr <= endStr;
      })
      .map(d => ({
        id:          d.id,
        title:       d.title,
        add_time:    d.add_time,
        person_name: d.person_name || '',
        leadVal:     fieldCalLead ? (d[fieldCalLead] ?? null) : null,
        sqlVal:      fieldCalSQL  ? (d[fieldCalSQL]  ?? null) : null,
      }))
      .sort((a, b) => a.add_time.localeCompare(b.add_time));

    res.json({
      deals:     periodDeals,
      fieldCalLead,
      fieldCalSQL,
      leadField: fieldDefs[fieldCalLead] || null,
      sqlField:  fieldDefs[fieldCalSQL]  || null,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/qualify-deal — actualiza campos de calificación en Pipedrive
app.put('/api/qualify-deal', async (req, res) => {
  res.set('Cache-Control', 'no-store');
  if (!hasPipedriveCreds()) return res.status(503).json({ error: 'Sin credenciales Pipedrive' });

  const { dealId, updates } = req.body; // updates = { fieldKey: value, ... }
  if (!dealId || !updates) return res.status(400).json({ error: 'dealId y updates requeridos' });

  const token = process.env.PIPEDRIVE_API_TOKEN;
  try {
    const resp = await fetch(`https://api.pipedrive.com/v1/deals/${dealId}?api_token=${token}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(updates),
    });
    const json = await resp.json();
    if (!json.success) return res.status(400).json({ error: json.error || 'Error de Pipedrive' });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
