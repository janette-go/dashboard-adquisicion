# Dashboard de Adquisición

Dashboard interno para visualizar métricas de adquisición de Detecta Security: campañas de Google Ads, pipeline de ventas (Pipedrive), tráfico web (Google Analytics 4), posicionamiento orgánico (Search Console), tablero operativo desde Google Sheets e informes de marketing en PDF.

## Por qué existe

Antes de este dashboard, las métricas de adquisición vivían dispersas entre Google Ads, Pipedrive, GA4, Search Console y hojas de cálculo — revisarlas implicaba entrar a cada plataforma por separado y armar reportes a mano. Este dashboard centraliza esa información en una sola vista, conectando cada fuente vía API para tener datos actualizados sin trabajo manual, y sirve como base para la toma de decisiones de marketing (presupuesto, campañas, seguimiento de leads) y para las juntas diarias.

## Capturas

### Resumen ejecutivo
![Resumen ejecutivo](docs/screenshots/overview.png)

### Origen de SQLs y embudo de conversión
![Origen de SQLs](docs/screenshots/sqls-por-mes.png)

## Stack

- Node.js + Express
- HTML/CSS/JS vanilla (sin frameworks frontend) — sin paso de build, despliegue simple y directo
- Google Ads API
- Pipedrive API
- Google Analytics 4 Data API
- Google Search Console API
- Google Sheets API (tablero operativo y estadísticas de subasta)
- Anthropic API (chat de consultas sobre el dashboard)

## Limitantes actuales

- Sin base de datos: todo se calcula al vuelo consultando las APIs externas en cada carga, lo que depende de su disponibilidad y límites de cuota.
- Sin autenticación: pensado para uso interno detrás de un acceso controlado, no para exponerse públicamente.
- Sin pruebas automatizadas.
- El frontend vanilla facilita el arranque rápido, pero a medida que crezcan las vistas convendría migrar a un framework para mantenibilidad.

## Configuración

1. Instalar dependencias:
   ```
   npm install
   ```
2. Crear un archivo `.env` con las credenciales necesarias (ver variables usadas en `index.js`):
   - `GOOGLE_ADS_*`
   - `PIPEDRIVE_*`
   - `GA4_PROPERTY_ID`
   - `GSC_*`
   - `GOOGLE_SHEETS_AUCTION_ID`
   - `ANTHROPIC_API_KEY`

3. Iniciar el servidor:
   ```
   npm start
   ```

En local, el dashboard estará disponible en `http://localhost:3000` (o el puerto configurado).
