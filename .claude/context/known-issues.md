---
status: VERIFIED
last_verified: 2026-10-30
sources: [service-worker.js, language.js, log-worker.js, retail-calculator/retail-calculator.html, retail-calculator/retail-calculator-script.js, retail-calculator/sales-report.js, index.html]
---
# Known issues & technical debt

Keep entries short. Mark `FIXED (date)` rather than deleting for one cycle, then remove.

## Open bugs
| # | Issue | Where | Status |
|---|---|---|---|
| 1 | Missing comma in `urlsToCache` → SW syntax error, offline/PWA install broken; `lang.js`/`language.js` not precached. | `service-worker.js` | FIXED 2026-10-30 (cache v5) |
| 2 | `switchLang` queried non-existent `#btnLangEn/#btnLangBn`; `updateWhatsAppText` threw on calculator page (no `.btn-whatsapp`). | `language.js` | FIXED 2026-10-30 |
| 3 | Duplicate `initLocation`; beacon used undefined `url`; 1 s flush; queue cleared even on failure. Now: single `TRACKING_URL`, 5 min flush, queue trimmed only after a successful send. Server-side errors still undetectable (`no-cors`). | `log-worker.js` | FIXED 2026-10-30 |
| 4 | Root-absolute `/pwa-installation.js`. | `retail-calculator/retail-calculator.html` | FIXED 2026-10-30 |
| 5 | Per-transaction delete filtered on non-existent `entry.time`; defined twice. | `sales-report.js` `deleteTransaction` | FIXED 2026-10-30 |
| 6 | Duplicate `downloadPdf` stub removed. `downloadCsv` is still an unused stub that only logs. | `retail-calculator-script.js` | PARTIAL |
| 8 | ~30 home-page labels rendered "undefined" (keys never added to `lang.js`). Fixed by redesign; all keys present in en + bn. | `lang.js` | FIXED 2026-10-30 |
| 7 | Orphan `retail-calc-lang.js` (outdated copy of `lang.js` keys) deleted. | `retail-calculator/` | FIXED 2026-10-30 |
| 9 | Settings and transactions dialogs were missing from the calculator HTML since `cd9b1c0` (2025-12-19): ⚙ threw, new users could not set rates. Restored in redesign. | `retail-calculator.html` | FIXED 2026-10-30 |
| 10 | Product tiles lacked `data-type`, so the selected tile was never highlighted; selection label was reset to "None" by `switchLang` on load. | `retail-calculator.html`, `retail-calculator-script.js` | FIXED 2026-10-30 |
| 11 | Editing the rate on the calculator card is not saved: `autoCalc` saves only when global `selectedType` is set, but nothing sets it (code uses `window.currentType`). Rates persist only via Settings. | `retail-calculator-script.js` `autoCalc` | OPEN |

## Data inconsistencies
- Daily report groups by `recordTimestamp` date, but transaction modal and `deleteEntireDate` filter by `saleTimestamp` date. Back-dated entries added via modal can appear under a different day than expected.

## Needs owner confirmation
- IFSC shown as `CNRB0000000` looks like a placeholder (`index.html` bank card).
- Current deployment mechanism (see `architecture.md#deployment`).

## Technical debt
- `header-style.css`, `header-style2.css` and `images/right-icon.png` are no longer used by any page (`header-style.css` is still precached by the SW). Safe to delete.
- No tests or linter.
- Strings built in JS (WhatsApp messages, alerts/prompts, PDF) are English-only.
- Product types hardcoded in several places (settings modal, `rateKeys`, `preferredOrder`, `checkRatesAndToggleCalcCard`).
- Commented-out code blocks (`openUPILink`, old window.onload).
