---
status: VERIFIED
last_verified: 2026-10-30
sources: [index.html, retail-calculator/retail-calculator.html, service-worker.js, manifest.json, pwa-installation.js, lang.js, language.js, log-worker.js, local-name-storage.js]
---
# Architecture

## Shape
Two static pages, no build, no framework (ADR-001). Each page loads shared global scripts via `<script>` tags at the end of `<body>`. Functions are global and wired with inline `onclick=`. Later scripts can override earlier functions of the same name.

### Script load order
- `index.html`: `script.js` → `local-name-storage.js` → `log-worker.js` → `pwa-installation.js` → `lang.js` → `language.js`
- `retail-calculator.html`: `../local-name-storage.js` → jsPDF (CDN) → `retail-calculator-script.js` → `../log-worker.js` → `../pwa-installation.js` → `sales-report.js` → `../lang.js` → `../language.js`

`trackEvent` (log-worker.js) is called from scripts loaded before it; that works only because calls happen on user events after load.

## i18n
- `lang.js` defines global `translations = { en: {...}, bn: {...} }` holding keys for **both** pages.
- `language.js` `switchLang(lang)` sets `innerHTML` of every `[data-translate]` and `placeholder` of every `[data-translate-placeholder]`, saves `siteLang`, rewrites the sign-up WhatsApp link text. Runs on `DOMContentLoaded` with default `bn`.
- Language switcher UI exists only on `index.html`; the calculator inherits the saved language.
- Strings built in JS (WhatsApp messages, alerts, report table, PDF) are **not** translated.

## PWA
- `manifest.json`: standalone, theme `#f8b400`, start `./index.html`.
- `service-worker.js`: precaches `urlsToCache` on install, **cache-first** fetch, deletes old caches on activate. Bump `CACHE_NAME` (`mb-poultry-cache-vN`) on every deploy that changes cached files.
- `script.js` reloads the page on `controllerchange` so a new SW takes effect.
- `pwa-installation.js`: captures `beforeinstallprompt`, shows `#installBtn`, remembers `pwaInstalled`.

## localStorage key registry
| Key | Written by | Meaning |
|---|---|---|
| `siteLang` | language.js | `en` / `bn` |
| `customerName` | local-name-storage.js | Name prefilled into order forms; also sent with telemetry |
| `shop_name` | retail-calculator-script.js | Shop name on calculator header / PDF; sent with telemetry |
| `rate_<type>` | retail-calculator-script.js | Rate per product type (4 types) |
| `selectedType` | retail-calculator-script.js | Last chosen product type |
| `salesLog` | sales-report.js | Array of sale records (schema in `domains/retail-calculator.md`) |
| `eventQueue` | log-worker.js | Pending telemetry events |
| `coords`, `user_location` | log-worker.js | Cached GPS/IP location |
| `pwaInstalled` | pwa-installation.js | `yes` once installed |

## External dependencies
| Dependency | Use |
|---|---|
| `wa.me` WhatsApp links | Orders, pre-bookings, sign-up, referrals |
| `upi://pay` deep link | Payments |
| Google Apps Script web app → Google Sheet | Telemetry (ADR-004) |
| `ipapi.co/json` | IP geolocation fallback |
| cdnjs: Font Awesome 6.5.1, jsPDF 2.5.1 | Icons, PDF export |
| Google Fonts: Montserrat, Material Symbols | Typography/icons |

CDN assets are not precached → icons/PDF export may fail offline.

## Deployment
<!-- status: NEEDS_REVIEW -->
Repo `github.com/prasunmondal/mondalbrothers`, branch `main`. A GitHub Pages Actions workflow (`.github/workflows/static.yml`, uploading `.`) existed until commit `4c9eeaf` (2025-12-14) deleted it. Current publishing mechanism (Pages "deploy from branch"? custom domain?) is **unverified** — confirm with the owner and update this section. Public short link: `https://tinyurl.com/mondalbros`.

## Related
ADR-001, ADR-003, ADR-005, `known-issues.md`
