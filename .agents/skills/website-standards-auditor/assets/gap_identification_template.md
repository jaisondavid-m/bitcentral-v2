# Gap identification report

> This is the Phase 1 deliverable. It records gaps only. No files are changed until the user approves a set of items. Replace every placeholder in angle brackets with real values, and remove this quote block in the final report.

## Context

- Project: <name>
- Lifecycle: <new | in development | live>
- Stack and framework: <detected stack>
- Live URL inspected: <url, or "none provided">
- Locales: <single locale, or the list>
- Business type: <general | local or physical business>
- Scope scanned: <directories scanned; whether the live site was fetched>
- Lighthouse: <ran, with scores | not run, command provided below>
- Scanner output: audit_findings.json

## Summary

| Category | Pass | Gap | Needs review | Not applicable | Info required |
| --- | --- | --- | --- | --- | --- |
| Crawl and discovery | | | | | |
| On page SEO | | | | | |
| Structured data | | | | | |
| GEO and AEO | | | | | |
| LLMO and AISEO | | | | | |
| E-E-A-T | | | | | |
| Performance | | | | | |
| Resilience | | | | | |
| Form validation | | | | | |
| Interaction and CTA | | | | | |
| Content and style | | | | | |
| Git hygiene | | | | | |
| Optional | | | | | |
| Total | | | | | |

Severity legend: Blocking, High, Medium, Low.
Status legend: Pass, Gap, Needs review, Not applicable, Info required.

## Findings

List every criterion. Order each category by severity, highest first. Keep one row per finding.

### Crawl and discovery

| ID | Criterion | Status | Severity | Evidence | Recommended fix | Information required |
| --- | --- | --- | --- | --- | --- | --- |
| CRAWL-01 | robots.txt | | | | | |
| CRAWL-02 | sitemap.xml | | | | | |
| CRAWL-03 | llms.txt | | | | | |
| CRAWL-04 | Redirects | | | | | |

### On page SEO

| ID | Criterion | Status | Severity | Evidence | Recommended fix | Information required |
| --- | --- | --- | --- | --- | --- | --- |
| SEO-01 | Title tags | | | | | |
| SEO-02 | Meta descriptions | | | | | |
| SEO-03 | Essential meta tags | | | | | |
| SEO-04 | Canonical tags | | | | | |
| SEO-05 | hreflang | | | | | |
| SEO-06 | Heading structure | | | | | |
| SEO-07 | Keyword mapping | | | | | |
| SEO-08 | Internal links | | | | | |

### Structured data

| ID | Criterion | Status | Severity | Evidence | Recommended fix | Information required |
| --- | --- | --- | --- | --- | --- | --- |
| STRUCT-01 | Schema markup | | | | | |
| STRUCT-02 | FAQ schema | | | | | |
| STRUCT-03 | Entity SEO | | | | | |
| STRUCT-04 | Knowledge graph readiness | | | | | |
| STRUCT-05 | Topic clusters | | | | | |
| STRUCT-06 | Local SEO | | | | | |

### GEO and AEO

| ID | Criterion | Status | Severity | Evidence | Recommended fix | Information required |
| --- | --- | --- | --- | --- | --- | --- |
| GEO-01 | llms.txt present | | | | | |
| GEO-02 | Answer ready content | | | | | |
| GEO-03 | Semantic, citable structure | | | | | |
| GEO-04 | Brand and entity consistency for AI | | | | | |

### LLMO and AISEO

| ID | Criterion | Status | Severity | Evidence | Recommended fix | Information required |
| --- | --- | --- | --- | --- | --- | --- |
| LLMO-01 | LLM-optimized content structure | | | | | |
| LLMO-02 | AI-readable metadata and llms.txt completeness | | | | | |
| LLMO-03 | Structured citations and sourcing | | | | | |
| AISEO-01 | Conversational keyword and intent coverage | | | | | |
| AISEO-02 | Passage-level relevance | | | | | |

### E-E-A-T

| ID | Criterion | Status | Severity | Evidence | Recommended fix | Information required |
| --- | --- | --- | --- | --- | --- | --- |
| EEAT-01 | Experience signals | | | | | |
| EEAT-02 | Expertise signals (author bylines, Person schema) | | | | | |
| EEAT-03 | Authoritativeness signals (sameAs, entity completeness) | | | | | |
| EEAT-04 | Trustworthiness signals (HTTPS, privacy page, contact) | | | | | |

### Performance, Core Web Vitals, and mobile

| ID | Criterion | Status | Severity | Evidence | Recommended fix | Information required |
| --- | --- | --- | --- | --- | --- | --- |
| PERF-01 | Core Web Vitals | | | | | |
| PERF-02 | Page speed | | | | | |
| PERF-03 | Mobile optimization | | | | | |
| PERF-04 | Lighthouse score optimization | | | | | |
| PERF-05 | Caching configuration | | | | | |

### Resilience

| ID | Criterion | Status | Severity | Evidence | Recommended fix | Information required |
| --- | --- | --- | --- | --- | --- | --- |
| RESIL-01 | Custom 404 page | | | | | |
| RESIL-02 | Offline / no internet page | | | | | |
| RESIL-03 | No external media links | | | | | |
| RESIL-04 | Privacy page | | | | | |
| RESIL-05 | Terms of Service page | | | | | |

### Form validation

| ID | Criterion | Status | Severity | Evidence | Recommended fix | Information required |
| --- | --- | --- | --- | --- | --- | --- |
| FORM-01 | Phone/mobile field validation | | | | | |
| FORM-02 | Email field type | | | | | |
| FORM-03 | Date/time field type | | | | | |
| FORM-04 | Number field bounds (min, max) | | | | | |
| FORM-05 | Password field security | | | | | |
| FORM-06 | URL field type | | | | | |
| FORM-07 | File input accept attribute | | | | | |
| FORM-08 | Text field maxlength | | | | | |
| FORM-09 | Textarea length limits | | | | | |
| FORM-10 | Form field label association | | | | | |
| FORM-11 | Required field attributes | | | | | |

### Interaction and CTA

| ID | Criterion | Status | Severity | Evidence | Recommended fix | Information required |
| --- | --- | --- | --- | --- | --- | --- |
| CTA-01 | Working link destinations | | | | | |
| CTA-02 | Explicit button types | | | | | |

### Content and style

| ID | Criterion | Status | Severity | Evidence | Recommended fix | Information required |
| --- | --- | --- | --- | --- | --- | --- |
| STYLE-01 | No em dash | | | | | |
| STYLE-02 | No emojis (use icons) | | | | | |

### Git hygiene

| ID | Criterion | Status | Severity | Evidence | Recommended fix | Information required |
| --- | --- | --- | --- | --- | --- | --- |
| GIT-01 | .gitignore conformance | | | | | |
| GIT-02 | No tracked secrets | | | | | |
| GIT-03 | README up to date | | | | | |

### Optional (implement only if approved)

| ID | Criterion | Status | Severity | Evidence | Recommended fix | Information required |
| --- | --- | --- | --- | --- | --- | --- |
| OPT-01 | Open Graph | | | | | |
| OPT-02 | Twitter cards | | | | | |
| OPT-03 | Brand mentions | | | | | |
| OPT-04 | Google Search Console | | | | | |
| OPT-05 | Google Analytics | | | | | |
| OPT-06 | Conversion tracking | | | | | |

## Information required from the user

List every value a fix depends on that could not be derived. Do not proceed on these items until the values arrive, and do not substitute a guess.

- <for example: canonical domain, default locale and target locales, legal or brand name, logo URL, social profile URLs, contact name address and phone, any analytics or verification IDs>

## Lighthouse

<If Lighthouse ran, put the four category scores and the top opportunities here. If it did not run, state why and include the exact command for the user to run.>

## How to proceed

Reply with one of:

- Approve all findings.
- Approve a specific set, listing the IDs (for example CRAWL-01, SEO-04, GIT-01, GIT-02).
- Request changes to this report.

Nothing in the project will be changed until you approve. Optional items will be skipped unless explicitly approved.
