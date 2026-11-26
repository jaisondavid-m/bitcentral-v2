# Website criteria

This is the full checklist the site is audited against. Every criterion has an ID, what it means, how to detect it, how to fix it, a severity, and when it applies. Use the IDs in `gap_identification.md`.

Severity scale: Blocking (ship stopper or security), High (clear standards failure with real impact), Medium (should fix), Low (nice to have or polish). "Applies" tells you when a criterion is relevant; mark a criterion Not applicable when its condition is not met (for example hreflang on a single language site).

## Table of contents

1. Crawl and discovery files (CRAWL)
2. On page SEO (SEO)
3. Structured data and entities (STRUCT)
4. Generative and answer engine optimization (GEO)
5. Performance, Core Web Vitals, and mobile (PERF)
6. Resilience and self contained delivery (RESIL)
7. Content and style rules (STYLE)
8. Git and repository hygiene (GIT)
9. Optional enhancements (OPT)
10. Running Lighthouse
11. How SEO, GEO, and AEO relate
12. LLMO, AISEO, and E-E-A-T

---

## 1. Crawl and discovery files (CRAWL)

**CRAWL-01 robots.txt.** A `robots.txt` at the site root that allows the right crawling, blocks what should be private, and points to the sitemap. Detect: file presence at root, a `Sitemap:` line, no accidental site wide `Disallow: /` in production. Fix: create from `assets/robots_txt_template.txt`, set sane directives, add the absolute sitemap URL. Severity: High. Applies: always.

**CRAWL-02 sitemap.xml.** A valid XML sitemap listing canonical, indexable URLs. Detect: file presence, well formed XML, URLs use the canonical host and scheme, referenced from robots.txt. Fix: generate from routes or pages, use absolute canonical URLs, keep it under the per file URL limit and split with a sitemap index if larger, reference it in robots.txt. Severity: High. Applies: always.

**CRAWL-03 llms.txt.** An `llms.txt` (and optionally `llms-full.txt`) at the site root that gives language models a clean, structured summary of the site and links to its key pages. Detect: file presence at root. Fix: create from `assets/llms_txt_template.md` with the site name, a one line description, and curated links to primary pages and docs. This supports GEO and AEO. Severity: Medium. Applies: always.

**CRAWL-04 Redirects.** Redirect rules are correct and minimal: no redirect chains, no loops, consistent trailing slash behavior, and a single canonical host and scheme (for example force https and one of www or non www). Detect: read redirect config (framework config, server rules, host config) and, for a live URL, follow redirects on key paths. Fix: collapse chains to a single hop, remove loops, standardize trailing slash and host, use permanent redirects for permanent moves. Severity: Medium. Applies: always.

---

## 2. On page SEO (SEO)

**SEO-01 Title tags.** Every page has a unique, descriptive `<title>`, roughly 50 to 60 characters. Detect: scan for `<title>` in source or head components; for live pages confirm it renders and is unique per page. Fix: add or rewrite titles, make each unique and descriptive, front load the primary term. Severity: High. Applies: always.

**SEO-02 Meta descriptions.** Every page has a unique meta description, roughly 140 to 160 characters, that reads as a useful summary. Detect: scan for `name="description"`; confirm uniqueness. Fix: write distinct descriptions per page. Severity: Medium. Applies: always.

**SEO-03 Essential meta tags.** Each page declares charset and viewport, and uses a robots meta only where intentional. Detect: scan for `charset`, `name="viewport"`, and any `name="robots"`. Fix: add `<meta charset="utf-8">` and `<meta name="viewport" content="width=device-width, initial-scale=1">`; remove stray `noindex` from production pages. Severity: High. Applies: always.

**SEO-04 Canonical tags.** Each page has a self referencing canonical link using the absolute canonical URL. Detect: scan for `rel="canonical"`; confirm it points to the canonical host. Fix: add self referencing canonicals; for duplicates point them at the preferred URL. Requires the canonical domain (ask if unknown). Severity: High. Applies: always.

**SEO-05 hreflang.** Language and region variants reference each other with `hreflang`, reciprocally, plus an `x-default`. Detect: scan for `hreflang`; check reciprocity. Fix: add a complete, reciprocal set with `x-default`. Requires the locale list (ask if unknown). Severity: High. Applies: multilingual or multiregional sites only.

**SEO-06 Heading structure.** One `<h1>` per page and a logical, sequential heading hierarchy. Detect: scan headings per page. Fix: ensure a single descriptive `<h1>` and ordered subheadings. Severity: Medium. Applies: always.

**SEO-07 Keyword mapping.** Each important page targets a clear primary topic and supporting terms, with no two pages competing for the same query. Detect: review page content and the user supplied keyword list against pages. Fix: map one primary topic per page, resolve cannibalization, reflect terms naturally in titles, headings, and copy. Note: the legacy `meta keywords` tag is not used for ranking and is not added; this is about content and information architecture. Severity: Medium. Applies: always.

**SEO-08 Internal links.** A coherent internal link structure with descriptive anchor text, no orphan pages, and no broken internal links. Detect: build the internal link graph from the source and find pages with no inbound links and links that resolve to nothing. Fix: add contextual internal links, give anchors descriptive text, repair or remove broken links. Severity: Medium. Applies: always.

---

## 3. Structured data and entities (STRUCT)

**STRUCT-01 Schema markup.** Pages carry valid JSON-LD structured data appropriate to their type (for example `Organization` and `WebSite` site wide, `BreadcrumbList` on deep pages, `Article` on posts, `Product` on product pages). Detect: scan for `application/ld+json` blocks and check they parse and match the page. Fix: add JSON-LD from `assets/schema_templates.md`, validate the syntax. Severity: High. Applies: always.

**STRUCT-02 FAQ schema.** Pages that contain a genuine question and answer section expose `FAQPage` JSON-LD. Detect: find FAQ content and check for matching markup. Fix: add `FAQPage` markup that mirrors the visible questions and answers exactly. Do not add FAQ markup where there is no visible FAQ. Severity: Medium. Applies: pages with real FAQs.

**STRUCT-03 Entity SEO.** A consistent entity definition for the organization: an `Organization` (or `LocalBusiness`) node with `name`, `url`, `logo`, and `sameAs` links to authoritative profiles, plus consistent naming and contact details across the site. Detect: check for the entity node and `sameAs`, and look for inconsistent names or contact details across pages. Fix: define one canonical entity, add `sameAs`, make naming and contact details consistent. Requires the official name and profile URLs (ask if unknown). Severity: Medium. Applies: always.

**STRUCT-04 Knowledge graph readiness.** The entity markup and `sameAs` references are complete enough to support a knowledge panel: organization node, logo, founding or contact details where appropriate, and links to recognized profiles. Detect: review the entity node for completeness. Fix: complete the entity fields and `sameAs` set. Requires organization facts (ask if unknown). Severity: Low. Applies: always.

**STRUCT-05 Topic clusters.** Content is organized into pillar pages with supporting cluster pages that link up to the pillar and across to siblings. Detect: review the content map and internal links for pillar and cluster structure. Fix: define pillars, group related pages under them, and wire the internal links. Severity: Low. Applies: content and marketing sites.

**STRUCT-06 Local SEO.** For a local or physical business: `LocalBusiness` schema with name, address, phone, geo, and opening hours, consistent NAP (name, address, phone) across the site, and any location pages structured correctly. Detect: check for `LocalBusiness` markup and NAP consistency. Fix: add `LocalBusiness` markup, make NAP consistent. Requires the real NAP (ask if unknown). Severity: Medium. Applies: local or physical businesses only.

---

## 4. Generative and answer engine optimization (GEO)

**GEO-01 llms.txt present.** Covered by CRAWL-03; listed here because it is the primary GEO and AEO signal. Severity: Medium. Applies: always.

**GEO-02 Answer ready content.** Key pages answer real questions directly and early, in clear, self contained passages that a model or answer engine can quote. Detect: review whether important questions are answered concisely near the top of the relevant page. Fix: add or restructure concise, factual answers; use clear question style headings where natural. Severity: Medium. Applies: always.

**GEO-03 Semantic, citable structure.** Content uses semantic HTML (headings, lists, tables, `article`, `section`) so machines can parse and cite it, and important facts are in text rather than locked inside images. Detect: review markup semantics and whether key facts are real text. Fix: convert key facts to text, use semantic elements, label tables and figures. Severity: Medium. Applies: always.

**GEO-04 Brand and entity consistency for AI.** The organization is described consistently across the site and matches the entity markup in STRUCT-03, so answer engines attribute content correctly. Detect: compare on page descriptions of the organization against the entity node. Fix: align them. Severity: Low. Applies: always.

---

## 5. Performance, Core Web Vitals, and mobile (PERF)

**PERF-01 Core Web Vitals.** The site meets good thresholds for Largest Contentful Paint, Interaction to Next Paint, and Cumulative Layout Shift. Detect: run Lighthouse or read field data if available (see "Running Lighthouse"). Fix: address the specific causes the report names, for example a heavy hero image for LCP, long tasks for INP, or unsized media for CLS. Severity: High. Applies: always (best measured on a live or served build).

**PERF-02 Page speed.** Assets are optimized: images are compressed and right-sized in modern formats, scripts and styles are minified and code split, render blocking resources are reduced, and caching and compression are configured. Detect: inspect asset sizes and formats, bundle output, and (for a live URL) response headers for compression and cache control. Fix: compress and convert images to WebP (see RESIL-03), lazy load below-the-fold media (`loading="lazy"`), split and defer non-critical scripts (`defer` or `type="module"`), preload critical assets with `<link rel="preload">`, enable Brotli or gzip compression at the server or host level. Severity: High. Applies: always.

**PERF-05 Caching configuration.** Correct HTTP `Cache-Control` headers are set for all asset types. Detect: for a live URL, inspect `Cache-Control`, `ETag`, and `Vary` response headers on HTML, CSS, JS, and image responses. For source, look for host config files: `_headers` (Netlify, Cloudflare Pages), `vercel.json`, `netlify.toml`, `next.config.js` headers array, nginx config, or Apache `.htaccess`. Report as Needs review if a config is found; Gap if none is found. Fix:

- **Versioned assets** (CSS/JS/images with content hashes in filenames): `Cache-Control: public, max-age=31536000, immutable`
- **HTML pages**: `Cache-Control: no-cache` (forces revalidation but allows conditional GETs)
- **API responses**: `Cache-Control: private, no-store` or a short `max-age` appropriate to the data freshness requirements
- **Fonts** (self hosted): `Cache-Control: public, max-age=31536000, immutable`
- **Service worker script** (`sw.js`): `Cache-Control: no-cache` so updates are picked up immediately
- Add `Vary: Accept-Encoding` when compression is enabled.
- Example `_headers` file for Netlify and Cloudflare Pages:
  ```
  /assets/*
    Cache-Control: public, max-age=31536000, immutable
  /*.html
    Cache-Control: no-cache
  /fonts/*
    Cache-Control: public, max-age=31536000, immutable
  ```
- Example `vercel.json` headers array:
  ```json
  { "headers": [
    { "source": "/assets/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/(.*)\\.html", "headers": [{ "key": "Cache-Control", "value": "no-cache" }] }
  ]}
  ```
- **Service worker caching strategy**: cache-first for versioned static assets (CSS, JS, images, fonts); network-first with offline fallback for HTML navigation requests; stale-while-revalidate for API calls where slight staleness is acceptable.
- Preload the primary font: `<link rel="preload" href="/fonts/primary.woff2" as="font" type="font/woff2" crossorigin>`.
- Add `<link rel="preconnect">` for the site's own API origin if separate; add `<link rel="dns-prefetch">` for any remaining approved third-party origins.

Severity: High. Applies: always.

**PERF-03 Mobile optimization.** The layout is responsive, the viewport meta is correct, tap targets are large enough and spaced, text is legible without zooming, and nothing overflows on small screens. Detect: review responsive styles and the viewport tag; test narrow widths. Fix: correct responsive rules, size and space tap targets, fix overflow. Severity: High. Applies: always.

**PERF-04 Lighthouse score optimization.** The Inspect to Lighthouse to score optimization loop is run and the Performance, Accessibility, Best Practices, and SEO categories are improved against their findings. Detect: run Lighthouse (see below) and read the per category opportunities and diagnostics. Fix: work through the named items; re-run to confirm improvement. Severity: Medium. Applies: always (record as not run if the environment cannot run it).

---

## 6. Resilience and self contained delivery (RESIL)

**RESIL-01 Custom 404 page.** A branded, helpful 404 page with navigation back into the site, not a raw server error. Detect: check for a custom not found route or page; for a live URL request a missing path and inspect the response. Fix: add a custom 404 from `assets/not_found_template.html`, wire it to the framework's not found handling, return the correct 404 status. Severity: Medium. Applies: always.

**RESIL-02 Offline or no internet page.** A graceful page shown when the user has no connection, typically a service worker with an offline fallback. Detect: check for a service worker and an offline fallback page or route. Fix: add a service worker that serves `assets/offline_page_template.html` (or the project equivalent) when the network is unavailable; cache the shell. Severity: Low. Applies: always (especially progressive web apps).

**RESIL-03 No external image, video, or media links.** Images, video, fonts, and other media are served from the site's own origin, not hot linked from third party hosts or third party CDNs, and embeds are reviewed. Detect: the scanner flags absolute http or https references to media and known media or font CDNs and third party embeds; review each. Fix using `scripts/download_media.py`:

- **Images**: run `python3 scripts/download_media.py --findings <workdir>/audit_findings.json --root <repo-root> --out-images public/media/images --dry-run` first to preview, then without `--dry-run` to download. The script converts images to WebP using Pillow if installed; otherwise it saves the original format and notes it in `fix_summary.md`. Update all `src`, `href`, `srcset`, and `url()` references to the new local WebP path. Wrap in a `<picture>` element with a WebP `<source>` and an original-format `<img>` fallback. Add explicit `width` and `height` attributes to prevent CLS. Use `loading="lazy"` for below-the-fold images and `fetchpriority="high"` for the LCP image.
- **Videos**: run the download script with `--out-videos public/media/videos`. Videos are downloaded in their original format; no re-encoding is performed. Replace the embed `src` with the local path. Add `preload="metadata"`, explicit `width` and `height`, and a `poster` attribute pointing to a self-hosted still frame. Add a `<track>` element for captions if a transcript is available.
- **Fonts**: run the download script with `--out-fonts public/fonts`. Update `@font-face` `src` declarations or framework import statements to the local path. Add `font-display: swap`. Remove any remaining CDN `@import` for fonts.
- After downloading, re-run `audit_site.py` to confirm RESIL-03 is cleared. Check the generated `media_replacements.json` for any failed downloads that need manual handling.

Severity: High. Applies: always.

**RESIL-04 Privacy page.** A privacy page is present and linked from the site footer (or a persistent navigation element). Detect: scan for a page or route named `privacy`, `privacy-policy`, or `datenschutz` in MARKUP_EXTS; scan footer-like markup for a link to a privacy URL. Fix: create from `assets/privacy_page_template.html`, inherit the project's existing design system (Rule 4 of `coding_rules.md`), wire to the framework's routing, and link from the footer. The page must include: what data is collected, why it is collected, how long it is retained, whether it is shared with third parties, cookie policy, user rights (access, deletion, portability), and a contact address. These values must be supplied by the user; do not invent legal text. Severity: Medium. Applies: always.

**RESIL-05 Terms of Service page.** A Terms of Service (or Terms and Conditions) page is present and linked from the site footer. Detect: scan for a page or route named `terms`, `terms-of-service`, `terms-and-conditions`, `tos`, or `agb` in MARKUP_EXTS; scan footer-like markup for a link to a terms URL. Fix: create from `assets/terms_page_template.html`, inherit the project's existing design system (Rule 4 of `coding_rules.md`), wire to the framework's routing, and link from the footer alongside the privacy page. The page must include at minimum: acceptance of terms, permitted and prohibited uses, intellectual property statement, disclaimers, limitation of liability, governing law, and a contact address. These values must be supplied by the user; do not invent or fabricate legal text. Severity: Medium. Applies: always.

---

## 7. Content and style rules (STYLE)

**STYLE-01 No em dash.** No em dash character (U+2014) appears in site content or code. Detect: the scanner reports every U+2014 with file and line; en dash and double hyphen used as a dash are advisory. Fix: replace each em dash with the grammatically correct alternative (comma, colon, parentheses, reworded sentence, or spaced hyphen as a last resort). Severity: Medium. Applies: always.

**STYLE-02 No emojis, use icons.** Site content uses icons rather than emojis. Detect: the scanner reports emoji characters with file and line. Fix: replace each emoji with an equivalent icon from the project's existing icon system; do not delete meaning and do not add a dependency for a single glyph. Severity: Low. Applies: always.

---

## 8. Git and repository hygiene (GIT)

These come from the mandatory git policy (`git_policy.md`) and the engineering rules (`coding_rules.md`). They are reconciled on every fix run.

**GIT-01 .gitignore conformance.** A root `.gitignore` exists and contains every required category from `gitignore_standard.txt`. Detect: the scanner compares the repository `.gitignore` against the standard and reports missing categories. Fix: merge in missing lines, keep project additions, never remove required exclusions. Severity: High. Applies: always.

**GIT-02 No tracked secrets.** No secret bearing file is tracked by git. Detect: when git is present the scanner flags tracked files matching secret patterns (`.env`, `*.pem`, `*.key`, `*.crt`, `*.p12`, `*.pfx`, `secrets.json`, `credentials.json`, `service-account.json`), with `.env.example` allowed. Fix: stop tracking the file, ensure the pattern is ignored, and advise rotating the exposed secret. Severity: Blocking. Applies: always.

**GIT-03 README up to date.** `README.md` exists and reflects the current project. Detect: check presence and whether core sections are present and current. Fix: create or update with name, description, prerequisites, setup, run and build steps, environment variables (via `.env.example`), and any newly added top level files. Severity: Medium. Applies: always.

---

## 9. Optional enhancements (OPT)

Include these in the report as optional. Implement them only if the user approves.

**OPT-01 Open Graph.** `og:` tags (title, description, type, url, image) for rich link previews. Fix: add per page Open Graph tags; self host the OG image per RESIL-03. Applies: optional.

**OPT-02 Twitter cards.** `twitter:` card tags for rich previews on that platform. Fix: add `summary_large_image` card tags. Applies: optional.

**OPT-03 Brand mentions.** Encourage and track consistent brand mentions and citations off site. This is strategy, not code; note it as advisory. Applies: optional.

**OPT-04 Google Search Console.** Site verification and Search Console setup. Fix: add the verification token or DNS record the user provides; never invent one. Applies: optional.

**OPT-05 Google Analytics.** Analytics tag setup. Fix: add the measurement ID the user provides, with attention to consent and privacy; never invent an ID. Applies: optional.

**OPT-06 Conversion tracking.** Goal and conversion event tracking. Fix: implement the events the user defines on top of the analytics setup. Applies: optional.

---

## 10. Running Lighthouse

Lighthouse needs a running page (a live URL or a local served build) and a headless Chrome. Do not assume either is present; detect first.

1. Check for tooling: `npx --yes lighthouse --version` or a local `lighthouse` binary, and a Chrome or Chromium install.
2. Make sure there is something to test: a public URL, or start the project's preview or build server locally and use that URL.
3. Run, capturing all four categories, for example:
   ```bash
   npx --yes lighthouse <url> \
     --only-categories=performance,accessibility,best-practices,seo \
     --output=json --output=html \
     --output-path=<workdir>/lighthouse-report \
     --chrome-flags="--headless --no-sandbox"
   ```
4. Read the JSON for category scores and the named opportunities and diagnostics. Use those to drive PERF and SEO fixes, then re-run to confirm.

If the environment cannot run Lighthouse (no browser, no network, no server), record PERF-04 and the Core Web Vitals items as "not run", include the exact command above in `gap_identification.md` and `fix_summary.md`, and ask the user to run it. Never fabricate a score.

---

## 11. How SEO, GEO, and AEO relate

These three overlap and share most of the work, which is why the checklist treats them together rather than as separate tracks.

- SEO (search engine optimization) targets ranking in traditional search results: crawlability, metadata, structured data, internal links, and performance.
- AEO (answer engine optimization) targets direct answers and featured snippets: concise question and answer content, FAQ schema, and clean semantic structure.
- GEO (generative engine optimization) targets being surfaced and cited by AI systems: `llms.txt`, citable text based facts, consistent entity definition, and the same structured data and semantics.
- LLMO (large language model optimization) targets how LLMs retrieve, rank, and quote site content when generating answers: clear structure, self-contained passages, explicit citations, and machine-readable metadata that lets a model attribute content correctly.
- AISEO targets discovery through AI-powered search interfaces (Perplexity, ChatGPT search, Gemini, Bing Copilot): conversational intent coverage, passage-level relevance, and structured data that AI rankers weight.
- E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) is Google's quality framework for evaluating content and sites. Strong E-E-A-T signals directly improve rankings and are increasingly used by AI systems to decide what to cite.

A site that satisfies the SEO, GEO, and AEO items here is most of the way to LLMO and AISEO; the additional work is author signals, citation structure, passage clarity, and trust signals (privacy page, contact page, HTTPS, consistent entity data).

---

## 12. LLMO, AISEO, and E-E-A-T

These criteria extend the GEO and AEO section with more specific checks for AI-driven discovery and Google's quality evaluation framework.

**LLMO-01 LLM-optimized content structure.** Key pages are written so an LLM can extract a complete, accurate answer from a single passage without needing surrounding context. Detect: review whether each important page has a clear, self-contained opening paragraph that states the topic and the main answer. Check that headings are descriptive questions or statements (not clever or vague), and that lists and tables are used for enumerable facts. Fix: rewrite vague headings as explicit questions or statements; move the main answer to the opening paragraph; convert prose lists of facts into HTML lists or tables. Severity: Medium. Applies: content and marketing sites.

**LLMO-02 AI-readable metadata and llms.txt completeness.** The `llms.txt` (CRAWL-03) is complete and useful to a language model: it names the site, states its purpose in one sentence, links to primary pages and key documentation, and avoids filler text. Detect: read `llms.txt` and check for a name line, a description line, and at least one curated link section. Fix: update from `assets/llms_txt_template.md` with real values; add a concise site description; list the five to ten most important pages with their URLs and a one-line description of each. Severity: Medium. Applies: always.

**LLMO-03 Structured citations and sourcing.** Pages that make factual claims cite their sources using `<cite>`, `<blockquote cite="...">`, or a visible references section, so LLMs can attribute claims correctly and users can verify them. Detect: scan for `<cite>` elements and `cite` attributes on `<blockquote>`; check whether factual pages include a references or sources section. Fix: add `<cite>` wrappers around source names; add `cite` attributes to blockquotes; add a references section to factual or research-oriented pages. Severity: Low. Applies: content sites with factual claims.

**AISEO-01 Conversational keyword and intent coverage.** Pages cover the natural language phrasings and follow-up questions users ask AI assistants, not only short-tail keyword variants. Detect: review page content against likely conversational queries for that topic (for example "how do I...", "what is the difference between...", "why does..."). Fix: add an FAQ section or inline answers for the top conversational queries; use question-style headings where natural; cover comparison and how-to intents on the relevant pages. Severity: Medium. Applies: content and marketing sites.

**AISEO-02 Passage-level relevance.** Each section of a page is independently useful: the heading, the first sentence of the section, and the body together answer the implied question without requiring the reader to have read earlier sections. Detect: test each `<section>` or heading-delimited block in isolation; check whether it makes sense on its own. Fix: add brief context to section openings; avoid pronouns that reference earlier sections without restating the noun; make each section independently citable. Severity: Medium. Applies: long-form content pages.

**EEAT-01 Experience signals.** Content that benefits from first-hand experience (reviews, how-to guides, case studies) includes signals that the author has direct experience: specific details, personal observations, or original data. Detect: review whether the content reads as first-hand (specific examples, concrete numbers, personal results) rather than generic (vague claims, no specifics). Fix: add specific details, original data, or first-person experience where the topic calls for it. Note: this is a content quality judgment; record as Needs review. Severity: High. Applies: pages where first-hand experience is expected by users.

**EEAT-02 Expertise signals.** Authors and contributors are identified with bylines, credentials, or schema markup. Detect: scan for `rel="author"`, `itemprop="author"`, `"@type": "Person"` in JSON-LD, `article:author` Open Graph tag, or visible author name and bio sections. Fix: add a visible author byline; add `Person` JSON-LD with `name`, `url`, and where appropriate `jobTitle` and `sameAs` links to professional profiles; link the author name to an author bio page. Requires: author name and profile URLs (ask if unknown). Severity: High. Applies: blog posts, articles, guides, and any content where authorship affects credibility.

**EEAT-03 Authoritativeness signals.** The site and its authors are linked to and cited by other authoritative sources, and the on-site entity markup (STRUCT-03, STRUCT-04) is complete enough to support a knowledge panel. Detect: check whether `sameAs` links point to recognized profiles (LinkedIn, Wikipedia, Crunchbase, industry directories); check whether author pages link to external profiles; check whether the organization is mentioned consistently in the page copy and schema. Fix: complete the `sameAs` set on the Organization node; add author `sameAs` links; ensure the organization name is used consistently across every page and matches the schema. Severity: High. Applies: always.

**EEAT-04 Trustworthiness signals.** The site demonstrates it is a legitimate, trustworthy operation. Detect: check for HTTPS (canonical and all internal links use `https://`); check for a privacy page (RESIL-04); check for a contact page with real contact details; check for an about page; check for consistent NAP if a local business (STRUCT-06); check that no page shows a browser security warning (mixed content). Fix: force HTTPS at the host level and in canonical URLs; add a privacy page (RESIL-04); add or complete the contact and about pages; fix any mixed content by self-hosting the HTTP resource. Severity: High. Applies: always.

---

## 13. Form validation (FORM)

**FORM-01 to FORM-11 Form field validation.** Form inputs use the correct semantic types and have appropriate validation constraints (min, max, maxlength, pattern, etc.). Detect: static analysis of `type` and attributes on `<input>`, `<textarea>`, and `<select>` tags in source files. Fix: apply the recommended attributes (e.g. `type="email"`, `maxlength` on text, `minlength` on passwords). Severity: Medium to High depending on the field. Applies: any site with forms.

---

## 14. Interaction and CTA (CTA)

**CTA-01 Working link destinations.** Anchor tags and Link components point to real destinations, not placeholders. Detect: static analysis of `<a>` and framework `<Link>` tags for missing `href` (or `to`) attributes, or values like `#`, empty string, or `javascript:...`. Fix: assign a valid URL or internal route to the `href` attribute. Severity: High. Applies: always.

**CTA-02 Explicit button types.** Button tags declare their type explicitly to prevent unintended form submissions. Detect: static analysis of `<button>` tags for a missing `type` attribute. Fix: add `type="button"` to buttons that are used for UI interactions and are not intended to submit a form. Severity: High. Applies: always.
