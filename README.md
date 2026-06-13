# Dashboard de Adquisición

Dashboard interno de Detecta Security que cruza métricas de Google Ads, Pipedrive, GA4, Search Console y Google Sheets en una sola vista, con generación de informes de marketing en PDF — diseñado para escalar a medida que crecen las fuentes de datos, en lugar de depender de una herramienta de BI genérica.

## Cómo funciona

```
Google Ads API ─────┐
Pipedrive API  ─────┤
GA4 Data API   ─────┼──► Express backend (index.js) ──► Dashboard (HTML/CSS/JS)
Search Console API ─┤              │
Google Sheets API ──┤              ├──► Chat (Anthropic API)
Anthropic API ──────┘              └──► Informe PDF
                            Cruce de métricas:
                            campañas ↔ SQLs ↔ tráfico ↔ posicionamiento
```

Cada fuente se integra como un módulo independiente del backend, lo que permite agregar nuevas métricas y cruces sin depender del modelo de datos de una herramienta de terceros.

## Capturas

### Resumen ejecutivo
![Resumen ejecutivo](docs/screenshots/overview.png)

### Embudo de conversión
![Embudo de conversión](docs/screenshots/funnel.png)

## Setup

```bash
cp .env.example .env   # fill in your keys
npm install
npm start
```

En local, el dashboard estará disponible en `http://localhost:3000` (o el puerto configurado).

## Variables de entorno

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor (default: `3000`) |
| `GOOGLE_SERVICE_ACCOUNT_JSON` / `GOOGLE_SERVICE_ACCOUNT_KEY` | Credenciales de la cuenta de servicio de Google (GA4, GSC, Sheets) |
| `GOOGLE_ADS_CLIENT_ID` | OAuth2 client ID de Google Ads |
| `GOOGLE_ADS_CLIENT_SECRET` | OAuth2 client secret de Google Ads |
| `GOOGLE_ADS_REFRESH_TOKEN` | OAuth2 refresh token de Google Ads |
| `GOOGLE_ADS_DEVELOPER_TOKEN` | Developer token de Google Ads |
| `GOOGLE_ADS_CUSTOMER_ID` | ID de cuenta de Google Ads |
| `GOOGLE_ADS_LOGIN_CUSTOMER_ID` | ID de la cuenta administradora (MCC) |
| `PIPEDRIVE_API_TOKEN` | Token de API de Pipedrive |
| `PIPEDRIVE_PIPELINE_ID` | ID del pipeline de ventas a consultar |
| `PIPEDRIVE_FIELD_CALIFICACION_LEAD` | ID del campo personalizado "Calificación del Lead" |
| `PIPEDRIVE_FIELD_CALIFICACION_SQL` | ID del campo personalizado "Calificación SQL" |
| `PIPEDRIVE_FIELD_ORIGEN_SQL` | ID del campo personalizado "Origen de SQL" |
| `GA4_PROPERTY_ID` | ID de propiedad de Google Analytics 4 |
| `GOOGLE_SEARCH_CONSOLE_SITE_URL` | URL del sitio verificado en Search Console |
| `GSC_QUERY_FILTER` | Filtro de búsquedas para Search Console |
| `GOOGLE_SHEETS_AUCTION_ID` | ID de la hoja de Google Sheets con estadísticas de subasta |
| `ANTHROPIC_API_KEY` | API key de Anthropic para el chat de consultas sobre el dashboard |

## Tech stack

- **Node.js + Express** — backend y servidor de la app
- **HTML/CSS/JS vanilla** — frontend sin paso de build, despliegue simple y directo
- **Google Ads API** — métricas de campañas
- **Pipedrive API** — pipeline de ventas y SQLs
- **Google Analytics 4 Data API** — tráfico y conversiones del sitio
- **Google Search Console API** — posicionamiento orgánico
- **Google Sheets API** — tablero operativo y estadísticas de subasta
- **Anthropic API** — chat de consultas sobre los datos del dashboard

## Limitantes actuales

- Sin base de datos: todo se calcula al vuelo consultando las APIs externas en cada carga, lo que depende de su disponibilidad y límites de cuota.
- Sin autenticación: pensado para uso interno detrás de un acceso controlado, no para exponerse públicamente.
- Sin pruebas automatizadas.
- El frontend vanilla facilita el arranque rápido, pero a medida que crezcan las vistas convendría migrar a un framework para mantenibilidad.
