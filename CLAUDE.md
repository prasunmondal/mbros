# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project identity

Static, installable (PWA) website for **Mondal Brothers**, a wholesale fresh-chicken supplier delivering daily to shops and hotels (West Bengal, India). Two pages:
- `index.html` — customer storefront: order for tomorrow, occasion pre-booking, payment details, contact, referral sharing.
- `retail-calculator/retail-calculator.html` — free tool for shopkeepers: rate → kg/amount conversion, on-device sales log, PDF reports.

Vanilla HTML/CSS/JS. **No build step, no package.json, no backend, no tests.** Bilingual (English/Bengali, Bengali default).

## Critical constraints

- **No backend.** Orders go out as WhatsApp messages; all state lives in browser `localStorage` (see ADR-002, ADR-003). Don't introduce a server or storage layer without a new ADR.
- **Every user-visible string needs both `en` and `bn` entries** in `lang.js`, rendered via `data-translate` / `data-translate-placeholder` attributes.
- **Service worker is cache-first.** Any change to a cached file requires bumping `CACHE_NAME` in `service-worker.js`; any new asset must be added to `urlsToCache`. Run `node --check service-worker.js` — a syntax error there silently disables offline/PWA.
- **Scripts are plain globals loaded by `<script>` order** (no modules). Duplicate function names silently override each other — grep before adding a function.
- Use relative paths (`../x.js`), never root-absolute (`/x.js`); the site may be served from a sub-path.
- Telemetry (`log-worker.js`) sends names, location and actions to a Google Sheet. Treat changes to it as privacy-relevant.

## Commands

```bash
npx serve .                                   # local server (service worker needs http://localhost, not file://)
for f in $(git ls-files '*.js'); do node --check "$f" || echo "FAIL $f"; done   # syntax check all JS
bash scripts/check-context.sh                 # flag stale knowledge files
```

Deploy: pushing `main` publishes via GitHub Pages (mechanism unverified — see `.claude/context/architecture.md#deployment`).

## Module map

| Path | Owns |
|---|---|
| `index.html`, `script.js`, `style.css`, `header-style*.css` | Storefront page |
| `retail-calculator/` | Retail calculator page (`retail-calculator-script.js` = calc/rates/PDF, `sales-report.js` = sales log/report) |
| `lang.js` (dictionaries) + `language.js` (`switchLang`) | i18n, shared by both pages |
| `log-worker.js` | Telemetry queue → Google Apps Script → Sheet |
| `local-name-storage.js` | Syncs customer name across form fields |
| `service-worker.js`, `pwa-installation.js`, `manifest.json` | PWA / offline |

## Knowledge base — load only what the task needs

Context lives in `.claude/context/`. **Do not read it all.** Route by task:

| Task mentions… | Load |
|---|---|
| order, pre-booking, payment, UPI, bank, QR, share/referral, contact | `domains/storefront.md` |
| rate, kg, amount, sales log, report, PDF, shop name, broiler/culbird | `domains/retail-calculator.md` |
| tracking, analytics, event, sheet, location, `trackEvent` | `domains/telemetry.md` |
| i18n, service worker, cache, PWA, install, script order, storage keys, deploy | `architecture.md` |
| business terms, users, why something exists, pricing/ordering rules | `business.md` |
| bug, broken, cleanup | `known-issues.md` first |
| architectural change (storage, backend, channel, framework) | relevant `decisions/ADR-*.md` (listed in each domain file) |

Loading levels: **L0** this file → **L1** one domain file → **L2** + `business.md` / relevant `architecture.md` section / listed ADRs → **L3** source files named in the domain file's `sources:`. Expand only when evidence requires it. Cross-domain tasks: load the minimum from each affected domain.

Before editing, state the change scope briefly (domain → files → storage keys → i18n keys → SW cache impact).

## Source-of-truth order

1. Current user instruction 2. Source code 3. Config (`manifest.json`, SW cache list) 4. ADRs (`status: accepted`) 5. Context files 6. Git history.

Context files describe intent, rules and decisions — never trust them over code. If they disagree: verify in code, fix the context file, set `status: VERIFIED` and `last_verified` to today.

## Knowledge file conventions

Frontmatter on every context file: `status` (VERIFIED | STALE | NEEDS_REVIEW | HISTORICAL), `last_verified` (YYYY-MM-DD, update only when you actually verified it), `sources` (paths). Store WHY / rules / constraints / contracts; point to code by path instead of copying it. New ADR: copy `decisions/ADR-000-template.md`, next number.

## After a meaningful task — knowledge check

Answer silently; edit only on YES. Skip entirely for trivial changes (renames, styling, formatting, private refactors).

- Business rule / terminology changed? → `business.md` or domain file
- Architecture, script order, SW, i18n mechanism, deploy changed? → `architecture.md`
- New/changed `localStorage` key or event/sheet contract? → domain file + `architecture.md` key registry
- Architectural decision made or reversed? → new ADR / mark old one `superseded`
- Known issue fixed or discovered? → `known-issues.md`
- Referenced file added/moved/deleted? → update `sources:`

Mention any knowledge-file updates in the final report.
