/**
 * Google Ads Script — Exporta estadísticas de subasta a Google Sheets
 * Instrucciones:
 * 1. Crea una hoja de Google Sheets nueva y copia su ID (el string largo en la URL)
 * 2. Pégalo en SPREADSHEET_ID abajo
 * 3. Ejecuta el script una vez manualmente
 * 4. Programa ejecución diaria en la configuración del script
 */

var SPREADSHEET_ID = 'PEGA_AQUI_EL_ID_DE_TU_HOJA'; // ← cambiar esto

function main() {
  var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = spreadsheet.getSheetByName('AuctionInsights');
  if (!sheet) sheet = spreadsheet.insertSheet('AuctionInsights');

  sheet.clearContents();
  sheet.appendRow([
    'domain', 'imprShare', 'topImpr', 'absTopImpr',
    'overlap', 'outranking', 'posAbove', 'updated'
  ]);

  var query =
    'SELECT auction_insight.domain,' +
    ' metrics.auction_insight_search_impression_share,' +
    ' metrics.auction_insight_search_top_impression_percentage,' +
    ' metrics.auction_insight_search_absolute_top_impression_percentage,' +
    ' metrics.auction_insight_search_overlap_rate,' +
    ' metrics.auction_insight_search_outranking_share,' +
    ' metrics.auction_insight_search_position_above_rate' +
    ' FROM auction_insight' +
    ' WHERE segments.date DURING LAST_30_DAYS';

  var report  = AdsApp.report(query);
  var rows    = report.rows();
  var now     = Utilities.formatDate(new Date(), 'America/Mexico_City', "yyyy-MM-dd'T'HH:mm:ss");
  var domMap  = {};

  while (rows.hasNext()) {
    var row    = rows.next();
    var domain = row['auction_insight.domain'];
    if (!domMap[domain]) domMap[domain] = { n:0, is:0, ti:0, ati:0, or:0, ou:0, pa:0 };
    var d = domMap[domain];
    d.n++;
    d.is  += parseFloat(row['metrics.auction_insight_search_impression_share']              || 0);
    d.ti  += parseFloat(row['metrics.auction_insight_search_top_impression_percentage']     || 0);
    d.ati += parseFloat(row['metrics.auction_insight_search_absolute_top_impression_percentage'] || 0);
    d.or  += parseFloat(row['metrics.auction_insight_search_overlap_rate']                 || 0);
    d.ou  += parseFloat(row['metrics.auction_insight_search_outranking_share']             || 0);
    d.pa  += parseFloat(row['metrics.auction_insight_search_position_above_rate']          || 0);
  }

  for (var domain in domMap) {
    var d = domMap[domain];
    sheet.appendRow([
      domain,
      r2(d.is  / d.n * 100),
      r2(d.ti  / d.n * 100),
      r2(d.ati / d.n * 100),
      r2(d.or  / d.n * 100),
      r2(d.ou  / d.n * 100),
      r2(d.pa  / d.n * 100),
      now
    ]);
  }

  Logger.log('Subasta actualizada: ' + Object.keys(domMap).length + ' dominios · ' + now);
}

function r2(n) { return Math.round(n * 100) / 100; }
