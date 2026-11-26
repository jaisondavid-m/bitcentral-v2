# Website Standards Auditor (skill)

An Agent Skill that audits any website (new, in development, or already live) against one fixed set of organization standards, then fixes the gaps after the user approves. It runs in two phases with a hard approval gate: it produces a written gap report first, then repairs only the approved items and reconciles `.gitignore` and `README.md`.

## What it covers

- Engineering and content rules: never assume, never use the em dash, always keep `.gitignore` and `README.md` current, and never change existing UI/UX when fixing.
- Git policy: a project `.gitignore` based on the organization standard (covers OS files, secrets, IDE, Node, Python, Docker, temp, build artifacts, 20+ AI coding tools, and skill-generated output files), with no tracked secrets.
- Website quality: SEO, GEO, AEO, `llms.txt`, sitemap, robots, metadata, canonical and hreflang, schema and FAQ markup, entity and knowledge graph readiness, internal links and topic clusters, Core Web Vitals, page speed, mobile, Lighthouse, custom 404, offline page, no external media, no emojis, and optional items such as Open Graph, Twitter cards, and analytics.
- **LLMO and AISEO**: LLM-optimized content structure, AI-readable `llms.txt`, structured citations, conversational intent coverage, and passage-level relevance.
- **E-E-A-T**: Experience, Expertise, Authoritativeness, and Trustworthiness signals including author bylines, Person schema, `sameAs` entity completeness, HTTPS, and a privacy page.
- **External media self-hosting**: downloads external images (converts to WebP), videos (as-is), and fonts; generates a replacement map so all `src`/`href`/`srcset`/`url()` references can be updated to local paths.
- **Caching and performance**: `Cache-Control` headers for versioned assets, HTML, fonts, and the service worker; Brotli/gzip compression; resource hints; service worker caching strategy.
- **Form validation**: statically analyzes form elements for required attributes, length limits, appropriate input types (phone, email, date, number, password, url), and label associations.
- **Interaction and CTA**: ensures anchor tags have valid destinations (not `#` or `javascript:void(0)`) and buttons declare their `type` explicitly.
- **Privacy page**: detects a missing or unlinked privacy page (RESIL-04, EEAT-04) and scaffolds one from the bundled template.
- **Terms of Service page**: detects a missing or unlinked Terms of Service page (RESIL-05) and scaffolds one from the bundled template.

## How it works

1. Establish context (lifecycle, stack, URL, locales, business type) by detection, asking only for what cannot be derived.
2. Audit: run `scripts/audit_site.py` for deterministic checks, apply the git policy, and do judgment checks by reading files. For a live URL, also inspect the served HTML and headers. Run Lighthouse when the environment allows.
3. Write `gap_identification.md` from the template, then stop and wait for approval.
4. On approval, fix the approved items in priority order, using the templates in `assets/`, filling them with real values supplied by the user.
5. Reconcile `.gitignore` (merging the standard, AI tool entries, and skill output exclusions) and `README.md` on every fix run.
6. Write `fix_summary.md` and present the changed files.

## Layout

```
website-standards-auditor/
  SKILL.md
  README.md
  references/
    coding_rules.md
    git_policy.md
    gitignore_standard.txt
    website_criteria.md
  scripts/
    audit_site.py
    download_media.py
  assets/
    gap_identification_template.md
    schema_templates.md
    robots_txt_template.txt
    llms_txt_template.md
    offline_page_template.html
    not_found_template.html
    privacy_page_template.html
    terms_page_template.html
```

## Running the scanner directly

```bash
python3 scripts/audit_site.py --path <repo-root> --out audit_findings.json
```

It writes structured findings as JSON and prints a readable summary. It never modifies the project. Use it as input to the gap report, not as the final verdict, since some items need human judgment.

## Running the media download script

Run after the gap report is approved and RESIL-03 gaps are confirmed. Always use `--dry-run` first:

```bash
# Preview what would be downloaded (no files written).
python3 scripts/download_media.py \
  --findings audit_findings.json \
  --root . \
  --out-images public/media/images \
  --out-videos public/media/videos \
  --out-fonts  public/fonts \
  --dry-run

# Download for real after reviewing the dry-run output.
python3 scripts/download_media.py \
  --findings audit_findings.json \
  --root . \
  --out-images public/media/images \
  --out-videos public/media/videos \
  --out-fonts  public/fonts
```

Images are converted to WebP (requires `pip install Pillow`). Videos are downloaded as-is. A `media_replacements.json` file is written mapping each original URL to its new local path. Use that map to update all `src`, `href`, `srcset`, and `url()` references in the project.
