# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing site for GDB Media & Marketing (gdbmedia.com.au), a Melbourne web-design agency selling websites to Australian tradies. Hand-written static HTML/CSS/JS — **no build step, no package manager, no tests, no dependencies**. Files are served exactly as they sit in the repo.

Deploy is a push to `origin` (github.com/civord/gdb-media-site); the host reads `_redirects` (Netlify-style syntax), so there is no CI config in the repo.

## Local preview

```bash
python3 -m http.server 8000     # then open http://localhost:8000/index.html
```

Caveat: every internal link is **extensionless** (`/contact`, `/websites/website-design-for-plumbers`). A plain static server 404s on those because the extensionless→`.html` mapping lives in `_redirects` on the host. Navigate by `.html` path locally, or use a server that does extensionless resolution. `preview.html` is gitignored — it's the scratch file for one-off previews.

## Page architecture

Three tiers of page, each with a different relationship to the shared assets:

1. **Agency pages** (repo root): `index`, `websites`, `seo`, `digital-marketing`, `work`, `contact`. Link `/style.css` + `/script.js`.
2. **Trade landing pages** (`websites/website-design-for-<trade>.html`, 15 of them): the SEO surface. Same shell and assets as tier 1; each targets one trade keyword. Listed in `sitemap.xml`.
3. **Client demos** (`demos/*.html`): fully self-contained sample sites for fictional businesses (Thornwick Build Co., Callister Plumbing, …). **Each has its own inline `<style>` and inline scripts — they deliberately do not use `/style.css` or `/script.js`.** All carry `robots: noindex, nofollow`. Changing site-wide styling never touches these; changing a demo never touches the main site.

There is no templating. The header, mobile nav, and footer are **copy-pasted into every tier-1 and tier-2 page**. A nav or footer change means editing ~21 files consistently — grep for the markup and apply the same edit to all of them, or the nav silently diverges between pages.

## Shared assets

- `style.css` — the entire site's CSS. Line 1 is a single minified blob (design tokens in `:root`, base, header/nav, hero, sections, footer, work grid, contact form, FAQ). Lines 2+ are readable, commented blocks appended by later enhancements (`.call-link`, `.svc-grid`, `.logo-monogram`, `.trade-proof`). Add new rules as a labelled block at the end rather than editing the minified line.
- `script.js` — loaded on every tier-1/2 page: mobile nav toggle, desktop dropdowns (hover ≥900px, click below), and `.reveal` scroll animations via IntersectionObserver with a `prefers-reduced-motion` bypass.
- `contact.js` — contact page only. Client-side validation + POST to Web3Forms (`access_key` is a public hidden input in `contact.html`). The `botcheck` checkbox is a honeypot: when ticked it fakes a success message and sends nothing.
- `work.js` — work page only. Category filtering driven by `data-category` on `.work-card` and synced to `location.hash`. The valid category list is hardcoded in **both** `categoryLabels` and `filterFromHash()` — adding a category means editing both, plus the chip markup in `work.html`.

Design tokens live in `:root` in `style.css`: `--navy #023047`, `--teal #219ebc`, `--sky #8ecae6`, `--amber #ffb703`, `--orange #fb8500`. Fonts are Bricolage Grotesque (display) and Inter (body), loaded async from Google Fonts with a `<noscript>` fallback.

Section classes compose the page rhythm: `.page-head.on-dark`, `.services`, `.approach`, `.work-teaser`, `.faq`, `.trade-proof`, `.cta-section.on-dark`. `.reveal` on a section opts it into the scroll animation.

## Legacy root pages — do not extend

`plumbers.html`, `electricians.html`, `gardeners.html`, `barbers.html`, `music.html`, `social-media.html` at the repo root are the pre-2026-09-14 generation, superseded by `websites/website-design-for-*.html`. They are 301'd in `_redirects`, absent from `sitemap.xml`, load no JS, and only cross-link to each other — no live page links to them. Likewise `demos/belair-builders.html` and `demos/alina-homes.html` are retired (forced 301s to the anonymised `thornwick-build` / `merridew-homes` versions). Edit the current files; leave these alone.

## SEO invariants

This site's whole purpose is search and AI-search visibility, so these are load-bearing, not decoration. When adding or renaming a page, update **all** of:

- `<title>`, `<meta name="description">`, `<link rel="canonical">` (absolute `https://gdbmedia.com.au/...`, extensionless), OG + Twitter tags
- JSON-LD `@graph` in `<head>` — pages carry `Service`, `FAQPage`, and `BreadcrumbList`; the FAQ JSON-LD must mirror the visible `<details>` FAQ markup verbatim
- `sitemap.xml` (extensionless loc + `lastmod`)
- `_redirects` — add the `.html` → extensionless 301 so the page has exactly one reachable URL
- the Websites dropdown in the header and the footer nav, in every page that carries them
- `llms.txt` if the page is a top-level destination

`robots.txt` explicitly allows every major AI crawler and carries a Cloudflare `Content-Signal` line — that permissiveness is intentional; don't tighten it. Language is Australian English (`lang="en-AU"`): "optimisation", "anonymised", "colour".
