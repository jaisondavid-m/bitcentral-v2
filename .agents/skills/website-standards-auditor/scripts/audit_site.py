#!/usr/bin/env python3
"""
Static website standards scanner.

Runs the deterministic part of the website standards audit over a repository or
site source tree and writes structured findings as JSON, plus a readable summary
to stdout. It never modifies the project.

What it checks:
- Presence of robots.txt, sitemap, llms.txt, a custom 404 page, an offline page,
  and a service worker.
- Metadata and structured data signals across source and template files
  (title, meta description, viewport, charset, canonical, hreflang, JSON-LD,
  FAQPage, common schema types, Open Graph, Twitter cards, analytics, search
  console verification).
- Em dash (hard) and emoji (advisory) occurrences in text bearing files.
- External image, video, audio, font, and media references (RESIL-03).
- The repository .gitignore against the bundled organization standard.
- Tracked secret files, when the tree is a git repository.
- Form field validation: phone, email, date, number/range, password, file, URL,
  label association, required attributes, and maxlength on text inputs.
- Call-to-action (CTA) validation: working link destinations (no empty or placeholder
  hrefs like '#' or 'javascript:') and explicit button types.

Usage:
    python3 audit_site.py --path <repo-root> --out <findings.json>

The script is intentionally conservative: when a signal is missing it reports
"no signal found" and a "Needs review" status rather than asserting a hard
failure, because some frameworks inject head tags at build time. Treat the JSON
as input to a human reviewed gap report, not as the final verdict.
"""

import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path

# Directories that are never part of the audited source.
EXCLUDED_DIRS = {
    ".git", "node_modules", "dist", "build", ".next", "out", "coverage",
    "__pycache__", ".cache", "tmp", "temp", "venv", "env", ".venv",
    ".pytest_cache", ".mypy_cache", ".history", ".local", "playwright-report",
    "test-results", ".svelte-kit", ".nuxt", ".astro", ".vercel", ".netlify",
}

# Extensions whose text we scan for em dashes and emojis.
TEXT_EXTS = {
    ".html", ".htm", ".md", ".mdx", ".txt", ".js", ".jsx", ".ts", ".tsx",
    ".vue", ".svelte", ".astro", ".css", ".scss", ".sass", ".less", ".json",
    ".php", ".ejs", ".njk", ".hbs", ".liquid", ".yml", ".yaml", ".xml",
}

# Extensions that may carry head tags and structured data.
MARKUP_EXTS = {
    ".html", ".htm", ".jsx", ".tsx", ".vue", ".svelte", ".astro", ".ejs",
    ".njk", ".hbs", ".liquid", ".php", ".md", ".mdx",
}

# Extensions scanned for form validation issues (superset of MARKUP_EXTS).
FORM_EXTS = {
    ".html", ".htm", ".jsx", ".tsx", ".vue", ".svelte", ".astro", ".ejs",
    ".njk", ".hbs", ".liquid", ".php",
}

# Media file extensions used to spot external media references.
MEDIA_EXTS = (
    "png", "jpg", "jpeg", "gif", "webp", "avif", "svg", "ico", "bmp",
    "mp4", "webm", "mov", "ogg", "ogv", "mp3", "wav", "m4a", "aac", "flac",
    "woff", "woff2", "ttf", "otf", "eot",
)

# Hosts that commonly serve third party media, fonts, or embeds.
MEDIA_HOSTS = (
    "fonts.googleapis.com", "fonts.gstatic.com", "use.typekit.net",
    "youtube.com", "youtu.be", "youtube-nocookie.com", "ytimg.com",
    "player.vimeo.com", "vimeo.com", "i.imgur.com", "imgur.com",
    "gravatar.com", "images.unsplash.com", "res.cloudinary.com",
    "googleusercontent.com", "ggpht.com", "fbcdn.net", "twimg.com",
    "google.com/maps", "maps.googleapis.com",
)

# Image extensions used for WebP conversion classification.
IMAGE_EXTS = {"png", "jpg", "jpeg", "gif", "webp", "avif", "svg", "ico", "bmp"}
VIDEO_EXTS = {"mp4", "webm", "mov", "ogg", "ogv"}
AUDIO_EXTS = {"mp3", "wav", "m4a", "aac", "flac"}
FONT_EXTS  = {"woff", "woff2", "ttf", "otf", "eot"}

EM_DASH = "\u2014"
EN_DASH = "\u2013"

EMOJI_RANGES = (
    (0x1F300, 0x1FAFF),
    (0x1F000, 0x1F02F),
    (0x2600, 0x27BF),
    (0x2B00, 0x2BFF),
    (0x1F1E6, 0x1F1FF),
)
VARIATION_SELECTOR = 0xFE0F

OCCURRENCE_CAP = 200
MAX_FILE_BYTES = 2_000_000


def is_emoji_char(ch):
    cp = ord(ch)
    if cp == VARIATION_SELECTOR:
        return True
    return any(lo <= cp <= hi for lo, hi in EMOJI_RANGES)


def iter_files(root):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in EXCLUDED_DIRS]
        for name in filenames:
            yield Path(dirpath) / name


def read_text(path):
    try:
        if path.stat().st_size > MAX_FILE_BYTES:
            return None
        return path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        return None


def rel(path, root):
    try:
        return str(path.relative_to(root))
    except ValueError:
        return str(path)


def find_root_file(root, names):
    """Return the first matching root level file path, or None."""
    for name in names:
        candidate = root / name
        if candidate.exists():
            return rel(candidate, root)
    return None


def detect_custom_404(root, all_files):
    patterns = ("404", "not-found", "notfound", "not_found")
    hits = []
    for p in all_files:
        stem = p.stem.lower()
        if stem in patterns and p.suffix.lower() in MARKUP_EXTS:
            hits.append(rel(p, root))
    return hits


def detect_offline(root, all_files):
    hits = []
    for p in all_files:
        stem = p.stem.lower()
        if stem in ("offline", "no-internet", "nointernet") and p.suffix.lower() in MARKUP_EXTS:
            hits.append(rel(p, root))
    return hits


def detect_service_worker(root, all_files):
    hits = []
    for p in all_files:
        name = p.name.lower()
        if name in ("sw.js", "service-worker.js", "serviceworker.js"):
            hits.append(rel(p, root))
    return hits


SIGNAL_PATTERNS = {
    "title": re.compile(r"<title|next/head|react-helmet|svelte:head|@unhead|useHead|Helmet", re.I),
    "meta_description": re.compile(r"name=['\"]description['\"]|property=['\"]description['\"]", re.I),
    "viewport": re.compile(r"name=['\"]viewport['\"]", re.I),
    "charset": re.compile(r"charset", re.I),
    "canonical": re.compile(r"rel=['\"]canonical['\"]", re.I),
    "hreflang": re.compile(r"hreflang", re.I),
    "json_ld": re.compile(r"application/ld\+json", re.I),
    "schema_organization": re.compile(r"['\"]Organization['\"]"),
    "schema_website": re.compile(r"['\"]WebSite['\"]"),
    "schema_breadcrumb": re.compile(r"['\"]BreadcrumbList['\"]"),
    "schema_localbusiness": re.compile(r"['\"]LocalBusiness['\"]"),
    "schema_faqpage": re.compile(r"['\"]FAQPage['\"]"),
    "open_graph": re.compile(r"property=['\"]og:", re.I),
    "twitter_cards": re.compile(r"name=['\"]twitter:", re.I),
    "robots_meta": re.compile(r"name=['\"]robots['\"]", re.I),
    "analytics": re.compile(r"gtag\(|googletagmanager\.com|google-analytics\.com", re.I),
    "search_console": re.compile(r"google-site-verification", re.I),
    "lang_attr": re.compile(r"<html[^>]*\blang=", re.I),
    # E-E-A-T and AISEO signals.
    "author_signal": re.compile(
        r'rel=[\'"]author[\'"]|itemprop=[\'"]author[\'"]|article:author'
        r'|[\'"]@type[\'"]\s*:\s*[\'"]Person[\'"]|class=[\'"][^\'"]*(author|byline)[^\'"]', re.I),
    "date_signal": re.compile(
        r"datePublished|dateModified|<time[^>]+datetime|article:published_time", re.I),
    "cite_signal": re.compile(r"<cite|<blockquote[^>]+cite=", re.I),
    "https_base": re.compile(r'<base[^>]+href=[\'"]http://', re.I),
    "mixed_content": re.compile(r'src=[\'"]http://|href=[\'"]http://', re.I),
}

URL_IN_ATTR = re.compile(r"""(?:src|href|content)\s*=\s*['"]([^'"]+)['"]""", re.I)
URL_IN_CSS = re.compile(r"""url\(\s*['"]?([^'")]+)['"]?\s*\)""", re.I)
SRCSET = re.compile(r"""srcset\s*=\s*['"]([^'"]+)['"]""", re.I)


def url_is_external_media(url):
    u = url.strip()
    low = u.lower()
    if not (low.startswith("http://") or low.startswith("https://") or low.startswith("//")):
        return False
    host_part = low.split("//", 1)[-1]
    if any(h in host_part for h in MEDIA_HOSTS):
        return True
    base = low.split("?", 1)[0].split("#", 1)[0]
    return any(base.endswith("." + ext) for ext in MEDIA_EXTS)


def classify_media_type(url):
    """Return image, video, audio, font, or other for an external media URL."""
    base = url.lower().split("?", 1)[0].split("#", 1)[0]
    ext = base.rsplit(".", 1)[-1] if "." in base else ""
    if ext in IMAGE_EXTS:
        return "image"
    if ext in VIDEO_EXTS:
        return "video"
    if ext in AUDIO_EXTS:
        return "audio"
    if ext in FONT_EXTS:
        return "font"
    # Classify by host if extension is ambiguous.
    low = url.lower()
    if any(h in low for h in ("fonts.googleapis.com", "fonts.gstatic.com", "use.typekit.net")):
        return "font"
    if any(h in low for h in ("youtube.com", "youtu.be", "vimeo.com", "youtube-nocookie.com")):
        return "video"
    return "other"


def scan_files(root):
    all_files = list(iter_files(root))
    signals = {k: {"present": False, "files": []} for k in SIGNAL_PATTERNS}
    em_dash_hits = []
    emoji_hits = []
    external_media_hits = []
    en_dash_count = 0
    em_dash_total = 0
    emoji_total = 0
    text_scanned = 0

    for path in all_files:
        ext = path.suffix.lower()
        if ext not in TEXT_EXTS:
            continue
        content = read_text(path)
        if content is None:
            continue
        text_scanned += 1
        relpath = rel(path, root)

        if ext in MARKUP_EXTS:
            for key, pat in SIGNAL_PATTERNS.items():
                if pat.search(content):
                    signals[key]["present"] = True
                    if len(signals[key]["files"]) < 50:
                        signals[key]["files"].append(relpath)

        # External media references (markup, css, js).
        if ext in MARKUP_EXTS or ext in {".css", ".scss", ".sass", ".less", ".js", ".jsx", ".ts", ".tsx"}:
            for lineno, line in enumerate(content.splitlines(), 1):
                for rx in (URL_IN_ATTR, URL_IN_CSS):
                    for m in rx.finditer(line):
                        if url_is_external_media(m.group(1)):
                            if len(external_media_hits) < OCCURRENCE_CAP:
                                external_media_hits.append({
                                    "file": relpath, "line": lineno,
                                    "url": m.group(1).strip()[:200],
                                    "media_type": classify_media_type(m.group(1)),
                                })
                for m in SRCSET.finditer(line):
                    for candidate in m.group(1).split(","):
                        u = candidate.strip().split(" ")[0]
                        if url_is_external_media(u):
                            if len(external_media_hits) < OCCURRENCE_CAP:
                                external_media_hits.append({
                                    "file": relpath, "line": lineno,
                                    "url": u[:200],
                                    "media_type": classify_media_type(u),
                                })

        # Em dash, en dash, emoji.
        for lineno, line in enumerate(content.splitlines(), 1):
            if EM_DASH in line:
                em_dash_total += line.count(EM_DASH)
                if len(em_dash_hits) < OCCURRENCE_CAP:
                    em_dash_hits.append({
                        "file": relpath, "line": lineno, "snippet": line.strip()[:160],
                    })
            if EN_DASH in line:
                en_dash_count += line.count(EN_DASH)
            for ch in line:
                if is_emoji_char(ch):
                    emoji_total += 1
                    if len(emoji_hits) < OCCURRENCE_CAP:
                        emoji_hits.append({
                            "file": relpath, "line": lineno, "char": ch,
                            "codepoint": "U+%04X" % ord(ch),
                            "snippet": line.strip()[:160],
                        })

    return {
        "all_files": all_files,
        "text_scanned": text_scanned,
        "signals": signals,
        "em_dash": {"total": em_dash_total, "shown": em_dash_hits,
                    "truncated": em_dash_total > len(em_dash_hits)},
        "en_dash_count": en_dash_count,
        "emoji": {"total": emoji_total, "shown": emoji_hits,
                  "truncated": emoji_total > len(emoji_hits)},
        "external_media": {"shown": external_media_hits,
                           "truncated": len(external_media_hits) >= OCCURRENCE_CAP},
    }


# ---------------------------------------------------------------------------
# Form validation detection helpers
# ---------------------------------------------------------------------------

# Matches any <input ... > or JSX-style Input component tag (single line).
_INPUT_TAG   = re.compile(r"<(?:input|Input)\b([^>]*?)/?>" , re.I | re.S)
# Matches self-closing or opening <textarea ...>.
_TEXTAREA_TAG= re.compile(r"<(?:textarea|Textarea)\b([^>]*)>", re.I | re.S)
# Matches <label ...> with a for= or htmlFor= attribute (counts labelled fields).
_LABEL_FOR   = re.compile(r"<label\b[^>]*(?:for|htmlFor)\s*=\s*['\"][^'\"]+['\"][^>]*>", re.I)
# Matches <form ...> tags.
_FORM_TAG    = re.compile(r"<(?:form|Form)\b[^>]*>", re.I)


def _attr(attrs_str, *names):
    """Return the lowercase value of the first matching attribute, or ''."""
    for name in names:
        m = re.search(
            r"\b" + re.escape(name) + r"\s*[=:]\s*[{'\"]?([^\s,}>'\"]+)['\"}]?",
            attrs_str, re.I,
        )
        if m:
            return m.group(1).lower().strip(",}{ '\"")
    return ""


def _has_attr(attrs_str, *names):
    """Return True if any of the given attribute names appear in the tag."""
    for name in names:
        if re.search(r"\b" + re.escape(name) + r"\b", attrs_str, re.I):
            return True
    return False


# Keywords in name/id/placeholder that suggest a specific semantic field type.
_PHONE_KEYWORDS    = re.compile(r"phone|mobile|tel|cell|contact.?num", re.I)
_EMAIL_KEYWORDS    = re.compile(r"email|e.?mail", re.I)
_DATE_KEYWORDS     = re.compile(r"date|dob|birth|year|month|day|expir", re.I)
_PASSWORD_KEYWORDS = re.compile(r"password|passwd|pwd", re.I)
_URL_KEYWORDS      = re.compile(r"\burl\b|website|homepage|link", re.I)
_NUMBER_KEYWORDS   = re.compile(
    r"age|weight|height|quantity|qty|amount|price|cost|count|number|num\b"
    r"|score|rating|zip|postal|pin|budget|distance|size|capacity", re.I)
_TEXT_KEYWORDS     = re.compile(r"name|title|city|street|address|company|firm|org", re.I)
_MANDATORY_KEYWORDS= re.compile(r"required|mandatory", re.I)

# ---------------------------------------------------------------------------
# Interaction and CTA detection helpers
# ---------------------------------------------------------------------------
# Matches any <a ...> or <Link ...> or <NavLink ...> tag.
_A_OPEN_TAG      = re.compile(r"<(?:a|Link|NavLink)\b([^>]*?)(?:/?>|>)", re.I | re.S)
# Matches any <button ...> or <Button ...> tag.
_BUTTON_OPEN_TAG = re.compile(r"<(?:button|Button)\b([^>]*?)(?:/?>|>)", re.I | re.S)

def detect_cta_issues(root, all_files):
    """
    Scan markup files for common Call-To-Action (CTA) gaps.
    
    Checks performed:
      - Anchor tags (<a>, <Link>): missing href, or placeholder href (#, empty, javascript:void).
      - Button tags (<button>): missing type attribute (which defaults to 'submit').
      
    Returns a dict with issues and counts.
    """
    issues = []
    a_count = 0
    button_count = 0
    
    def _add(file_rel, lineno, tag_type, issue, snippet):
        if len(issues) < OCCURRENCE_CAP:
            issues.append({
                "file": file_rel, "line": lineno,
                "tag_type": tag_type, "issue": issue,
                "snippet": snippet[:160],
            })
            
    for path in all_files:
        if path.suffix.lower() not in FORM_EXTS:
            continue
        content = read_text(path)
        if not content:
            continue
            
        relpath = rel(path, root)
        
        for m in _A_OPEN_TAG.finditer(content):
            a_count += 1
            attrs = m.group(1)
            lineno = content[:m.start()].count("\n") + 1
            snippet = m.group(0)[:160]
            
            href = _attr(attrs, "href", "to")
            if not _has_attr(attrs, "href", "to"):
                _add(relpath, lineno, "anchor", "Link is missing href (or to) attribute", snippet)
            elif href in ("", "#") or href.startswith("javascript:"):
                _add(relpath, lineno, "anchor", f"Link has placeholder destination ('{href}')", snippet)
                
        for m in _BUTTON_OPEN_TAG.finditer(content):
            button_count += 1
            attrs = m.group(1)
            lineno = content[:m.start()].count("\n") + 1
            snippet = m.group(0)[:160]
            
            if not _has_attr(attrs, "type"):
                _add(relpath, lineno, "button", "Button is missing type attribute (defaults to submit, which can cause unwanted form submissions)", snippet)
                
    return {
        "issues": issues,
        "a_count": a_count,
        "button_count": button_count,
        "truncated": len(issues) >= OCCURRENCE_CAP,
    }

def detect_form_validation(root, all_files):
    """
    Scan markup files for common form field validation gaps.

    Checks performed:
      - Phone fields: type='tel', pattern, minlength, maxlength.
      - Email fields: type='email' (not type='text').
      - Date fields: type='date' / 'datetime-local' (not type='text').
      - Number fields: type='number', min (no negatives), max, step for range.
      - Password fields: type='password', minlength, autocomplete.
      - URL fields: type='url' (not type='text').
      - File inputs: accept attribute.
      - Text inputs: maxlength on named text fields.
      - Autocomplete on email and tel fields.
      - required / aria-required on fields whose name suggests they are mandatory.
      - Textarea: minlength and maxlength.

    Returns a dict with:
        issues        list of dicts: file, line, field_type, issue, snippet
        forms_found   int
        inputs_found  int
        labels_found  int
        unlabeled_est int  (inputs_found - labels_found, floored at 0)
        truncated     bool
    """
    issues = []
    forms_found  = 0
    inputs_found = 0
    labels_found = 0

    def _add(file_rel, lineno, field_type, issue, snippet):
        if len(issues) < OCCURRENCE_CAP:
            issues.append({
                "file": file_rel, "line": lineno,
                "field_type": field_type, "issue": issue,
                "snippet": snippet[:160],
            })

    for path in all_files:
        if path.suffix.lower() not in FORM_EXTS:
            continue
        content = read_text(path)
        if not content:
            continue

        forms_found  += len(_FORM_TAG.findall(content))
        labels_found += len(_LABEL_FOR.findall(content))
        relpath = rel(path, root)

        for pat, field_kind in (
            (_INPUT_TAG,    "input"),
            (_TEXTAREA_TAG, "textarea"),
        ):
            for m in pat.finditer(content):
                attrs   = m.group(1)
                lineno  = content[:m.start()].count("\n") + 1
                snippet = m.group(0)[:160]
                ftype   = _attr(attrs, "type")
                name_id = " ".join(filter(None, [
                    _attr(attrs, "name"), _attr(attrs, "id"),
                    _attr(attrs, "placeholder"),
                ]))

                if field_kind == "input":
                    inputs_found += 1

                    # Phone / mobile
                    if ftype == "tel" or _PHONE_KEYWORDS.search(name_id):
                        if ftype not in ("tel", "number"):
                            _add(relpath, lineno, "phone",
                                 "phone/mobile field uses type='text' instead of type='tel'",
                                 snippet)
                        if not _has_attr(attrs, "pattern"):
                            _add(relpath, lineno, "phone",
                                 "phone field missing pattern attribute for format validation",
                                 snippet)
                        if not (_has_attr(attrs, "minlength") or _has_attr(attrs, "min")):
                            _add(relpath, lineno, "phone",
                                 "phone field missing minlength (recommend 7)",
                                 snippet)
                        if not (_has_attr(attrs, "maxlength") or _has_attr(attrs, "max")):
                            _add(relpath, lineno, "phone",
                                 "phone field missing maxlength (recommend 15 per E.164)",
                                 snippet)

                    # Email
                    elif _EMAIL_KEYWORDS.search(name_id) and ftype != "email":
                        _add(relpath, lineno, "email",
                             "email field uses type='text' instead of type='email'",
                             snippet)

                    # Date
                    elif _DATE_KEYWORDS.search(name_id) and ftype not in (
                            "date", "datetime-local", "month", "week"):
                        _add(relpath, lineno, "date",
                             "date field uses type='text'; use type='date' or 'datetime-local'",
                             snippet)

                    # Number / range
                    elif ftype in ("number", "range") or _NUMBER_KEYWORDS.search(name_id):
                        if ftype not in ("number", "range"):
                            _add(relpath, lineno, "number",
                                 "numeric field uses type='text' instead of type='number'",
                                 snippet)
                        if not _has_attr(attrs, "min"):
                            _add(relpath, lineno, "number",
                                 "number field missing min attribute (prevents negative values where inappropriate)",
                                 snippet)
                        if not _has_attr(attrs, "max"):
                            _add(relpath, lineno, "number",
                                 "number field missing max attribute",
                                 snippet)
                        if ftype == "range" and not _has_attr(attrs, "step"):
                            _add(relpath, lineno, "range",
                                 "range field missing step attribute",
                                 snippet)

                    # Password
                    elif ftype == "password" or _PASSWORD_KEYWORDS.search(name_id):
                        if ftype != "password":
                            _add(relpath, lineno, "password",
                                 "password field uses type='text' instead of type='password'",
                                 snippet)
                        if not _has_attr(attrs, "minlength"):
                            _add(relpath, lineno, "password",
                                 "password field missing minlength attribute (recommend 8+)",
                                 snippet)
                        if not _has_attr(attrs, "autocomplete"):
                            _add(relpath, lineno, "password",
                                 "password field missing autocomplete='new-password' or 'current-password'",
                                 snippet)

                    # URL
                    elif _URL_KEYWORDS.search(name_id) and ftype != "url":
                        _add(relpath, lineno, "url",
                             "URL field uses type='text' instead of type='url'",
                             snippet)

                    # File: accept
                    if ftype == "file" and not _has_attr(attrs, "accept"):
                        _add(relpath, lineno, "file",
                             "file input missing accept attribute (restricts allowed file types)",
                             snippet)

                    # Text inputs: maxlength
                    if ftype in ("", "text", "search") and _TEXT_KEYWORDS.search(name_id):
                        if not _has_attr(attrs, "maxlength"):
                            _add(relpath, lineno, "text",
                                 "text input missing maxlength to prevent excessively long input",
                                 snippet)

                    # Autocomplete on email / tel
                    if ftype in ("email", "tel") and not _has_attr(attrs, "autocomplete"):
                        _add(relpath, lineno, ftype,
                             f"type='{ftype}' field missing autocomplete attribute (improves UX and autofill)",
                             snippet)

                    # required / aria-required for semantically mandatory fields
                    if _MANDATORY_KEYWORDS.search(name_id):
                        if not (_has_attr(attrs, "required") or
                                _has_attr(attrs, "aria-required")):
                            _add(relpath, lineno, ftype or "input",
                                 "field name/id suggests it is required but required or aria-required is absent",
                                 snippet)

                elif field_kind == "textarea":
                    inputs_found += 1
                    if not _has_attr(attrs, "maxlength"):
                        _add(relpath, lineno, "textarea",
                             "textarea missing maxlength attribute",
                             snippet)
                    if not _has_attr(attrs, "minlength"):
                        _add(relpath, lineno, "textarea",
                             "textarea missing minlength attribute",
                             snippet)

    unlabeled_est = max(0, inputs_found - labels_found)
    return {
        "issues": issues,
        "forms_found":   forms_found,
        "inputs_found":  inputs_found,
        "labels_found":  labels_found,
        "unlabeled_est": unlabeled_est,
        "truncated":     len(issues) >= OCCURRENCE_CAP,
    }


def detect_privacy_page(root, all_files):
    """Return list of privacy page candidates and whether a footer link was found."""
    privacy_names = {"privacy", "privacy-policy", "privacy_policy", "datenschutz"}
    pages = []
    footer_link = False
    footer_re = re.compile(r"privacy|datenschutz", re.I)
    for p in all_files:
        stem = p.stem.lower()
        if stem in privacy_names and p.suffix.lower() in MARKUP_EXTS:
            pages.append(rel(p, root))
        # Check markup files for footer privacy links.
        if p.suffix.lower() in MARKUP_EXTS and not footer_link:
            content = read_text(p)
            if content and footer_re.search(content):
                # Heuristic: if the word appears near a </footer> or role="contentinfo"
                low = content.lower()
                if "</footer>" in low or 'role="contentinfo"' in low or "role='contentinfo'" in low:
                    footer_link = True
    return {"pages": pages, "footer_link_found": footer_link}


def detect_terms_page(root, all_files):
    """Return list of terms page candidates and whether a footer link was found."""
    terms_names = {
        "terms", "terms-of-service", "terms_of_service",
        "terms-and-conditions", "terms_and_conditions", "tos", "agb",
    }
    pages = []
    footer_link = False
    footer_re = re.compile(r"terms|tos|agb", re.I)
    for p in all_files:
        stem = p.stem.lower()
        if stem in terms_names and p.suffix.lower() in MARKUP_EXTS:
            pages.append(rel(p, root))
        if p.suffix.lower() in MARKUP_EXTS and not footer_link:
            content = read_text(p)
            if content and footer_re.search(content):
                low = content.lower()
                if "</footer>" in low or 'role="contentinfo"' in low or "role='contentinfo'" in low:
                    footer_link = True
    return {"pages": pages, "footer_link_found": footer_link}


def detect_caching_config(root, all_files):
    """Return a dict describing which caching config files were found."""
    config_names = {
        "_headers", "vercel.json", "netlify.toml",
        "next.config.js", "next.config.mjs", "next.config.ts",
        ".htaccess",
    }
    nginx_re = re.compile(r"cache-control|expires|add_header", re.I)
    found = []
    for p in all_files:
        name = p.name.lower()
        if name in config_names:
            found.append(rel(p, root))
        elif name.endswith(".conf") or name.endswith(".nginx"):
            content = read_text(p)
            if content and nginx_re.search(content):
                found.append(rel(p, root))
    return {"configs": found}


def load_standard_patterns():
    standard = Path(__file__).resolve().parent.parent / "references" / "gitignore_standard.txt"
    if not standard.exists():
        return None, []
    patterns = []
    for line in standard.read_text(encoding="utf-8").splitlines():
        s = line.strip()
        if not s or s.startswith("#"):
            continue
        patterns.append(s)
    return standard, patterns


def check_gitignore(root):
    standard_path, standard_patterns = load_standard_patterns()
    repo_gitignore = root / ".gitignore"
    if not repo_gitignore.exists():
        return {"exists": False, "missing": standard_patterns,
                "standard_found": standard_path is not None}
    present = set()
    for line in repo_gitignore.read_text(encoding="utf-8").splitlines():
        s = line.strip()
        if s and not s.startswith("#"):
            present.add(s)
    missing = [p for p in standard_patterns if p not in present]
    return {"exists": True, "missing": missing,
            "standard_found": standard_path is not None}


def check_tracked_secrets(root):
    if not (root / ".git").exists():
        return {"is_git_repo": False, "tracked_secrets": []}
    try:
        out = subprocess.run(
            ["git", "-C", str(root), "ls-files"],
            capture_output=True, text=True, timeout=30,
        )
    except (OSError, subprocess.SubprocessError):
        return {"is_git_repo": True, "tracked_secrets": [], "error": "git ls-files failed"}
    if out.returncode != 0:
        return {"is_git_repo": True, "tracked_secrets": [], "error": out.stderr.strip()[:200]}

    secret_exts = (".pem", ".key", ".crt", ".p12", ".pfx")
    secret_names = {"secrets.json", "credentials.json", "service-account.json"}
    hits = []
    for line in out.stdout.splitlines():
        f = line.strip()
        if not f:
            continue
        base = os.path.basename(f).lower()
        is_secret = (
            base == ".env"
            or (base.startswith(".env.") and base != ".env.example")
            or base.endswith(secret_exts)
            or base in secret_names
        )
        if is_secret:
            hits.append(f)
    return {"is_git_repo": True, "tracked_secrets": hits}


def build_findings(scan, gi, secrets, root):
    findings = []
    privacy_info       = detect_privacy_page(root, scan["all_files"])
    terms_info         = detect_terms_page(root, scan["all_files"])
    caching_info       = detect_caching_config(root, scan["all_files"])
    form_validation    = detect_form_validation(root, scan["all_files"])
    cta_validation     = detect_cta_issues(root, scan["all_files"])

    def add(fid, category, criterion, status, severity, evidence, recommendation, info_required=""):
        findings.append({
            "id": fid, "category": category, "criterion": criterion,
            "status": status, "severity": severity, "evidence": evidence,
            "recommendation": recommendation, "info_required": info_required,
        })

    # Crawl and discovery.
    robots = find_root_file(root, ["robots.txt", "public/robots.txt", "static/robots.txt"])
    add("CRAWL-01", "Crawl and discovery", "robots.txt",
        "Pass" if robots else "Gap", "High",
        f"found at {robots}" if robots else "no robots.txt at root or in public/static",
        "Keep as is; confirm it references the sitemap." if robots else
        "Create robots.txt from assets/robots_txt_template.txt and add the sitemap URL.")

    sitemap = find_root_file(root, ["sitemap.xml", "sitemap_index.xml",
                                    "public/sitemap.xml", "static/sitemap.xml"])
    add("CRAWL-02", "Crawl and discovery", "sitemap.xml",
        "Pass" if sitemap else "Gap", "High",
        f"found at {sitemap}" if sitemap else "no sitemap found at root or in public/static",
        "Confirm it lists canonical URLs and is referenced in robots.txt." if sitemap else
        "Generate sitemap.xml of canonical URLs and reference it in robots.txt.")

    llms = find_root_file(root, ["llms.txt", "llms-full.txt", "llm.txt",
                                 "public/llms.txt", "static/llms.txt"])
    add("CRAWL-03", "Crawl and discovery", "llms.txt",
        "Pass" if llms else "Gap", "Medium",
        f"found at {llms}" if llms else "no llms.txt found",
        "Confirm it summarizes the site and links key pages." if llms else
        "Create llms.txt from assets/llms_txt_template.md.",
        "" if llms else "Site name, one line description, and the key pages to link.")

    # Resilience.
    p404 = detect_custom_404(root, scan["all_files"])
    add("RESIL-01", "Resilience", "Custom 404 page",
        "Pass" if p404 else "Needs review", "Medium",
        "found: " + ", ".join(p404) if p404 else "no file named 404 or not-found detected (a framework route may still exist)",
        "Confirm it is wired up and returns a 404 status." if p404 else
        "Add a custom 404 from assets/not_found_template.html and wire it to the framework's not found handling.")

    offline = detect_offline(root, scan["all_files"])
    sw = detect_service_worker(root, scan["all_files"])
    if offline or sw:
        ev = "; ".join(filter(None, [
            "offline page: " + ", ".join(offline) if offline else "",
            "service worker: " + ", ".join(sw) if sw else "",
        ]))
        add("RESIL-02", "Resilience", "Offline / no internet page",
            "Needs review", "Low", ev,
            "Confirm the service worker serves the offline page when the network is unavailable.")
    else:
        add("RESIL-02", "Resilience", "Offline / no internet page",
            "Gap", "Low", "no service worker or offline page detected",
            "Add a service worker with an offline fallback from assets/offline_page_template.html.")

    em = scan["external_media"]["shown"]
    if em:
        sample = "; ".join(f"{h['file']}:{h['line']} [{h.get('media_type','?')}] {h['url']}" for h in em[:5])
        suffix = " (more, see JSON)" if scan["external_media"]["truncated"] or len(em) > 5 else ""
        add("RESIL-03", "Resilience", "No external image/video/media links",
            "Gap", "High", f"{len(em)} external media reference(s); e.g. {sample}{suffix}",
            "Use scripts/download_media.py to self-host: images are converted to WebP, videos downloaded as-is, fonts downloaded and referenced locally.")
    else:
        add("RESIL-03", "Resilience", "No external image/video/media links",
            "Pass", "High", "no external media references detected in scanned files",
            "No action; keep media self hosted.")

    # Privacy page (RESIL-04).
    if privacy_info["pages"]:
        add("RESIL-04", "Resilience", "Privacy page",
            "Needs review", "Medium",
            "found: " + ", ".join(privacy_info["pages"]) +
            ("; footer link detected" if privacy_info["footer_link_found"] else "; no footer link detected"),
            "Confirm the page is linked from the footer and contains complete privacy information.")
    else:
        add("RESIL-04", "Resilience", "Privacy page",
            "Gap", "Medium", "no privacy page detected",
            "Create from assets/privacy_page_template.html; wire to routing; link from footer. Fill in real legal text supplied by the user.",
            "Data controller name, contact email, DPA details, cookie policy, and user rights information.")

    # Terms of Service page (RESIL-05).
    if terms_info["pages"]:
        add("RESIL-05", "Resilience", "Terms of Service page",
            "Needs review", "Medium",
            "found: " + ", ".join(terms_info["pages"]) +
            ("; footer link detected" if terms_info["footer_link_found"] else "; no footer link detected"),
            "Confirm the page is linked from the footer and contains complete terms including disclaimers and limitation of liability.")
    else:
        add("RESIL-05", "Resilience", "Terms of Service page",
            "Gap", "Medium", "no terms of service page detected",
            "Create from assets/terms_page_template.html; wire to routing; link from footer alongside the privacy page. Fill in real legal text supplied by the user.",
            "Legal entity name, governing jurisdiction, contact email, liability cap, and any service-specific terms.")

    # On page SEO via signals.
    sig = scan["signals"]

    def signal_finding(fid, name, key, severity, present_rec, missing_rec, info=""):
        s = sig.get(key, {"present": False, "files": []})
        if s["present"]:
            ev = "signal found in: " + ", ".join(s["files"][:5]) + (" ..." if len(s["files"]) > 5 else "")
            add(fid, "On page SEO", name, "Needs review", severity, ev, present_rec, info)
        else:
            add(fid, "On page SEO", name, "Needs review", severity,
                "no signal found in scanned source (a build step may inject this)",
                missing_rec, info)

    signal_finding("SEO-01", "Title tags", "title", "High",
                   "Confirm each page has a unique, well sized title.",
                   "Add unique titles per page (or confirm the framework sets them).")
    signal_finding("SEO-02", "Meta descriptions", "meta_description", "Medium",
                   "Confirm each description is unique and well sized.",
                   "Add unique meta descriptions per page.")
    # Essential meta combines viewport and charset.
    vp = sig["viewport"]["present"]
    cs = sig["charset"]["present"]
    if vp and cs:
        add("SEO-03", "On page SEO", "Essential meta tags (charset, viewport)",
            "Needs review", "High", "viewport and charset signals found",
            "Confirm both are on every page.")
    else:
        missing = ", ".join(filter(None, ["viewport" if not vp else "", "charset" if not cs else ""]))
        add("SEO-03", "On page SEO", "Essential meta tags (charset, viewport)",
            "Gap", "High", f"missing signal for: {missing}",
            "Add charset and viewport meta to every page.")
    signal_finding("SEO-04", "Canonical tags", "canonical", "High",
                   "Confirm self referencing canonicals using the canonical host.",
                   "Add self referencing canonical links.",
                   "The canonical domain.")
    if sig["hreflang"]["present"]:
        add("SEO-05", "On page SEO", "hreflang",
            "Needs review", "High", "hreflang signal found",
            "Confirm the set is reciprocal and includes x-default.")
    else:
        add("SEO-05", "On page SEO", "hreflang",
            "Needs review", "High", "no hreflang signal found",
            "If the site targets multiple locales, add a reciprocal hreflang set with x-default; otherwise mark Not applicable.",
            "Whether the site targets multiple languages or regions, and the locale list.")

    # Structured data.
    if sig["json_ld"]["present"]:
        types = [t for t, k in [("Organization", "schema_organization"),
                                ("WebSite", "schema_website"),
                                ("BreadcrumbList", "schema_breadcrumb"),
                                ("LocalBusiness", "schema_localbusiness")] if sig[k]["present"]]
        add("STRUCT-01", "Structured data", "Schema markup (JSON-LD)",
            "Needs review", "High",
            "JSON-LD found; types seen: " + (", ".join(types) if types else "none of the common types matched"),
            "Validate the JSON-LD and confirm it matches each page type.")
    else:
        add("STRUCT-01", "Structured data", "Schema markup (JSON-LD)",
            "Gap", "High", "no application/ld+json found in scanned source",
            "Add JSON-LD from assets/schema_templates.md (Organization and WebSite site wide, plus per page types).",
            "Organization name, URL, logo, and social profile URLs.")
    if sig["schema_faqpage"]["present"]:
        add("STRUCT-02", "Structured data", "FAQ schema",
            "Needs review", "Medium", "FAQPage signal found",
            "Confirm it mirrors visible FAQ content exactly.")
    else:
        add("STRUCT-02", "Structured data", "FAQ schema",
            "Needs review", "Medium", "no FAQPage signal found",
            "Add FAQPage markup on pages that have a real FAQ; otherwise Not applicable.")
    add("STRUCT-03", "Structured data", "Entity SEO (Organization, sameAs)",
        "Needs review", "Medium",
        "Organization signal found" if sig["schema_organization"]["present"] else "no Organization signal found",
        "Confirm a single canonical entity with sameAs and consistent naming and contact details.",
        "Official organization name and authoritative profile URLs.")

    # GEO/AEO.
    add("GEO-02", "GEO and AEO", "Answer ready, semantic content",
        "Needs review", "Medium", "requires content review",
        "Confirm key questions are answered concisely and facts are in text, with semantic HTML.")

    # LLMO, AISEO, and E-E-A-T.
    add("LLMO-01", "LLMO and AISEO", "LLM-optimized content structure",
        "Needs review", "Medium", "requires content review",
        "Confirm key pages open with a self-contained answer paragraph and use descriptive headings.")
    add("LLMO-02", "LLMO and AISEO", "AI-readable metadata and llms.txt completeness",
        "Needs review", "Medium", "requires llms.txt content review",
        "Confirm llms.txt has a name line, a one-line description, and curated links to key pages.")
    add("LLMO-03", "LLMO and AISEO", "Structured citations and sourcing",
        "Pass" if scan["signals"].get("cite_signal", {}).get("present") else "Needs review",
        "Low",
        "cite or blockquote cite signals found" if scan["signals"].get("cite_signal", {}).get("present") else "no cite/blockquote cite signals found",
        "Add <cite> or cite attributes to blockquotes on factual pages; add a references section where appropriate.")
    add("AISEO-01", "LLMO and AISEO", "Conversational keyword and intent coverage",
        "Needs review", "Medium", "requires content review",
        "Check that pages cover how-to, comparison, and why-type conversational queries for their topic.")
    add("AISEO-02", "LLMO and AISEO", "Passage-level relevance",
        "Needs review", "Medium", "requires content review",
        "Confirm each section is independently readable and citable without needing surrounding context.")

    # E-E-A-T.
    author_found = scan["signals"].get("author_signal", {}).get("present", False)
    date_found   = scan["signals"].get("date_signal",  {}).get("present", False)
    add("EEAT-01", "E-E-A-T", "Experience signals",
        "Needs review", "High", "requires content quality review",
        "Confirm content on experience-based pages includes specific details, original data, or first-person observations.")
    add("EEAT-02", "E-E-A-T", "Expertise signals (author bylines, Person schema)",
        "Needs review" if author_found else "Gap", "High",
        "author signal found in: " + ", ".join(scan["signals"]["author_signal"]["files"][:5]) if author_found else "no author/byline signal found",
        "Confirm each authored page has a visible byline and Person JSON-LD with sameAs." if author_found else
        "Add author bylines and Person JSON-LD to blog posts, articles, and guides.",
        "" if author_found else "Author name and professional profile URLs.")
    add("EEAT-03", "E-E-A-T", "Authoritativeness signals (sameAs, entity completeness)",
        "Needs review", "High",
        "Organization signal found" if scan["signals"].get("schema_organization", {}).get("present") else "no Organization signal found",
        "Complete the sameAs set on Organization; ensure organization name is consistent across all pages and schema.")
    mixed = scan["signals"].get("mixed_content", {}).get("present", False)
    https_base_issue = scan["signals"].get("https_base", {}).get("present", False)
    privacy_present = bool(privacy_info["pages"])
    trust_issues = []
    if mixed or https_base_issue:
        trust_issues.append("mixed content or http base href detected")
    if not privacy_present:
        trust_issues.append("no privacy page detected")
    add("EEAT-04", "E-E-A-T", "Trustworthiness signals",
        "Gap" if trust_issues else "Needs review", "High",
        "; ".join(trust_issues) if trust_issues else "no obvious trust issues detected by static scan",
        "Ensure HTTPS throughout, add a privacy page, and confirm contact and about pages exist.")

    # Performance / Lighthouse (cannot be measured statically).
    add("PERF-04", "Performance", "Lighthouse score optimization",
        "Needs review", "Medium", "not measured by static scan",
        "Run Lighthouse per references/website_criteria.md section 10; record scores and work the opportunities.")
    add("PERF-02", "Performance", "Page speed and asset optimization",
        "Needs review", "High", "requires asset and header review",
        "Review image formats (WebP), lazy loading, bundle splitting, compression, and cache headers.")
    add("PERF-03", "Performance", "Mobile optimization",
        "Needs review", "High",
        "viewport signal found" if sig["viewport"]["present"] else "no viewport signal found",
        "Confirm responsive layout, tap target sizing, and no overflow at narrow widths.")
    if caching_info["configs"]:
        add("PERF-05", "Performance", "Caching configuration",
            "Needs review", "High",
            "caching config found: " + ", ".join(caching_info["configs"][:5]),
            "Confirm Cache-Control headers are correct: immutable for versioned assets, no-cache for HTML, no-store for private API responses.")
    else:
        add("PERF-05", "Performance", "Caching configuration",
            "Gap", "High", "no caching config file found (_headers, vercel.json, netlify.toml, nginx conf, .htaccess)",
            "Add a caching config per references/website_criteria.md PERF-05 with immutable headers for versioned assets and no-cache for HTML.")

    # Form validation.
    fv = form_validation
    if fv["forms_found"] == 0:
        add("FORM-01", "Form validation", "Form fields present",
            "Not applicable", "Medium", "no <form> tags detected in scanned markup files",
            "No form fields to validate. If forms are added later, re-run the audit.")
    else:
        fv_issues = fv["issues"]
        by_type = {}
        for iss in fv_issues:
            by_type.setdefault(iss["field_type"], []).append(iss)

        def _form_add(fid, criterion, ftype, rec):
            hits = by_type.get(ftype, [])
            if hits:
                sample = "; ".join(f"{h['file']}:{h['line']} {h['issue']}" for h in hits[:3])
                suffix = f" (+{len(hits)-3} more)" if len(hits) > 3 else ""
                add(fid, "Form validation", criterion,
                    "Gap", "High", f"{len(hits)} issue(s): {sample}{suffix}", rec)
            else:
                add(fid, "Form validation", criterion,
                    "Pass", "High", "no issues detected by static scan", rec)

        _form_add("FORM-01", "Phone/mobile field validation",
                  "phone",
                  "Use type='tel', add pattern='[+]?[0-9]{7,15}' (or locale-specific), minlength=7, maxlength=15.")
        _form_add("FORM-02", "Email field type",
                  "email",
                  "Use type='email' and add autocomplete='email'.")
        _form_add("FORM-03", "Date/time field type",
                  "date",
                  "Use type='date', type='datetime-local', type='month', or type='week' instead of type='text'.")
        _form_add("FORM-04", "Number field bounds (min, max)",
                  "number",
                  "Add min (e.g. min='0' for weight/age/quantity to prevent negatives) and max. Use step for ranges.")
        _form_add("FORM-05", "Password field security",
                  "password",
                  "Use type='password', add minlength='8', and autocomplete='new-password' or 'current-password'.")
        _form_add("FORM-06", "URL field type",
                  "url",
                  "Use type='url' for website/link fields; the browser validates the URL format automatically.")
        _form_add("FORM-07", "File input accept attribute",
                  "file",
                  "Add accept='.pdf,.jpg,.png' (or appropriate MIME types) to restrict uploaded file types.")
        _form_add("FORM-08", "Text field maxlength",
                  "text",
                  "Add maxlength to name, address, city, and similar text fields to cap input length.")
        _form_add("FORM-09", "Textarea length limits",
                  "textarea",
                  "Add minlength and maxlength to textarea elements.")

        # Label association (unlabeled inputs).
        if fv["unlabeled_est"] > 0:
            add("FORM-10", "Form validation", "Form field label association",
                "Gap", "High",
                f"estimated {fv['unlabeled_est']} input(s) without an associated <label for=...> or aria-label "
                f"({fv['inputs_found']} inputs found, {fv['labels_found']} label[for] found)",
                "Every visible input must have a <label for='id'> or aria-label / aria-labelledby for accessibility.")
        else:
            add("FORM-10", "Form validation", "Form field label association",
                "Needs review", "High",
                f"{fv['inputs_found']} inputs found, {fv['labels_found']} label[for] found; static count may undercount JSX aria-label usage",
                "Confirm every input has a visible label or aria-label in the rendered DOM.")

        # Required field marking.
        req_hits = [i for i in fv_issues if "required" in i["issue"]]
        if req_hits:
            sample = "; ".join(f"{h['file']}:{h['line']}" for h in req_hits[:3])
            add("FORM-11", "Form validation", "Required field attributes",
                "Gap", "Medium",
                f"{len(req_hits)} field(s) appear mandatory by name but lack required or aria-required: {sample}",
                "Add required (or aria-required='true') to all mandatory fields so the browser enforces them.")
        else:
            add("FORM-11", "Form validation", "Required field attributes",
                "Pass", "Medium", "no missing required attributes detected by static scan",
                "Confirm all mandatory fields have required or aria-required in the rendered DOM.")

    # Interaction and CTA.
    cta = cta_validation
    cta_issues = cta["issues"]
    by_tag = {}
    for iss in cta_issues:
        by_tag.setdefault(iss["tag_type"], []).append(iss)
        
    def _cta_add(fid, criterion, ttype, rec):
        hits = by_tag.get(ttype, [])
        if hits:
            sample = "; ".join(f"{h['file']}:{h['line']} {h['issue']}" for h in hits[:3])
            suffix = f" (+{len(hits)-3} more)" if len(hits) > 3 else ""
            add(fid, "Interaction and CTA", criterion,
                "Gap", "High", f"{len(hits)} issue(s): {sample}{suffix}", rec)
        else:
            add(fid, "Interaction and CTA", criterion,
                "Pass", "High", f"no issues detected by static scan ({cta.get(ttype + '_count', 0)} tags found)", rec)

    _cta_add("CTA-01", "Working link destinations", "anchor",
             "Ensure all <a> or <Link> tags have a valid, non-placeholder href (remove '#' or 'javascript:' placeholders and wire to actual routes).")
    _cta_add("CTA-02", "Explicit button types", "button",
             "Add type='button' to all <button> tags that are not meant to submit a form, preventing accidental form submissions.")

    # Style rules.
    em_total = scan["em_dash"]["total"]
    if em_total:
        sample = "; ".join(f"{h['file']}:{h['line']}" for h in scan["em_dash"]["shown"][:5])
        add("STYLE-01", "Content and style", "No em dash",
            "Gap", "Medium",
            f"{em_total} em dash occurrence(s); e.g. {sample}" + (" (more, see JSON)" if scan["em_dash"]["truncated"] else ""),
            "Replace each em dash with a comma, colon, parentheses, or reworded text.")
    else:
        note = ""
        if scan["en_dash_count"]:
            note = f" Advisory: {scan['en_dash_count']} en dash occurrence(s) to review."
        add("STYLE-01", "Content and style", "No em dash",
            "Pass", "Medium", "no em dash found." + note, "No action.")

    emoji_total = scan["emoji"]["total"]
    if emoji_total:
        sample = "; ".join(f"{h['file']}:{h['line']} {h['codepoint']}" for h in scan["emoji"]["shown"][:5])
        add("STYLE-02", "Content and style", "No emojis (use icons)",
            "Gap", "Low",
            f"{emoji_total} emoji occurrence(s); e.g. {sample}" + (" (more, see JSON)" if scan["emoji"]["truncated"] else ""),
            "Replace each emoji with an equivalent icon from the project's icon system.")
    else:
        add("STYLE-02", "Content and style", "No emojis (use icons)",
            "Pass", "Low", "no emoji characters found", "No action.")

    # Git hygiene.
    if not gi["exists"]:
        add("GIT-01", "Git hygiene", ".gitignore conformance",
            "Gap", "High", "no .gitignore at repository root",
            "Create .gitignore from references/gitignore_standard.txt plus stack specific entries.")
    elif gi["missing"]:
        shown = ", ".join(gi["missing"][:12]) + (" ..." if len(gi["missing"]) > 12 else "")
        add("GIT-01", "Git hygiene", ".gitignore conformance",
            "Gap", "High", f"{len(gi['missing'])} required pattern(s) missing: {shown}",
            "Merge the missing standard patterns in; keep project additions; remove none of the required exclusions.")
    else:
        add("GIT-01", "Git hygiene", ".gitignore conformance",
            "Pass", "High", "all standard patterns present", "No action.")

    if secrets.get("is_git_repo"):
        if secrets["tracked_secrets"]:
            shown = ", ".join(secrets["tracked_secrets"][:10])
            add("GIT-02", "Git hygiene", "No tracked secrets",
                "Gap", "Blocking", f"tracked secret file(s): {shown}",
                "Stop tracking with git rm --cached, ensure the pattern is ignored, and rotate the exposed secret.")
        else:
            add("GIT-02", "Git hygiene", "No tracked secrets",
                "Pass", "Blocking", "no tracked secret files detected", "No action.")
    else:
        add("GIT-02", "Git hygiene", "No tracked secrets",
            "Needs review", "Blocking", "not a git repository (or git unavailable); could not check tracked files",
            "Re-check inside the git repository before relying on this result.")

    readme = find_root_file(root, ["README.md", "readme.md", "Readme.md", "README.MD"])
    add("GIT-03", "Git hygiene", "README up to date",
        "Needs review" if readme else "Gap", "Medium",
        f"found at {readme}" if readme else "no README.md at root",
        "Confirm it reflects the current project and newly added files." if readme else
        "Create README.md with name, description, setup, run and build steps, and env via .env.example.")

    # Optional.
    add("OPT-01", "Optional", "Open Graph",
        "Pass" if sig["open_graph"]["present"] else "Gap (optional)", "Low",
        "og: tags found" if sig["open_graph"]["present"] else "no og: tags found",
        "Optional: add per page Open Graph tags with a self hosted image.")
    add("OPT-02", "Optional", "Twitter cards",
        "Pass" if sig["twitter_cards"]["present"] else "Gap (optional)", "Low",
        "twitter: tags found" if sig["twitter_cards"]["present"] else "no twitter: tags found",
        "Optional: add summary_large_image card tags.")
    add("OPT-04", "Optional", "Google Search Console",
        "Pass" if sig["search_console"]["present"] else "Gap (optional)", "Low",
        "verification signal found" if sig["search_console"]["present"] else "no verification signal found",
        "Optional: add the verification token or DNS record the user provides.",
        "" if sig["search_console"]["present"] else "Verification token or DNS record (only if the user wants this).")
    add("OPT-05", "Optional", "Google Analytics",
        "Pass" if sig["analytics"]["present"] else "Gap (optional)", "Low",
        "analytics signal found" if sig["analytics"]["present"] else "no analytics signal found",
        "Optional: add the measurement ID the user provides, with consent handling.",
        "" if sig["analytics"]["present"] else "Measurement ID (only if the user wants this).")

    return findings


def summarize(findings):
    counts = {}
    by_category = {}
    for f in findings:
        status = f["status"].split(" ")[0]  # collapse "Gap (optional)" into "Gap"
        counts[status] = counts.get(status, 0) + 1
        cat = f["category"]
        by_category.setdefault(cat, {})
        by_category[cat][status] = by_category[cat].get(status, 0) + 1
    return {"by_status": counts, "by_category": by_category, "total": len(findings)}


def print_summary(report):
    print("Website standards scan")
    print("Path:", report["context"]["path"])
    print("Files scanned (text):", report["context"]["text_files_scanned"])
    print("Git repository:", report["context"]["is_git_repo"])
    print()
    print("Status counts:")
    for status, n in sorted(report["summary"]["by_status"].items()):
        print(f"  {status}: {n}")
    print()
    print("Findings needing attention (Gap or Blocking):")
    flagged = [f for f in report["findings"]
               if f["status"].startswith("Gap") or f["severity"] == "Blocking" and f["status"] != "Pass"]
    if not flagged:
        print("  none from the static scan; judgment checks still required.")
    for f in flagged:
        print(f"  [{f['severity']}] {f['id']} {f['criterion']}: {f['evidence']}")
    print()
    print("Note: Needs review items require human judgment and were not auto decided.")
    print("Findings JSON written to:", report["context"]["out"])


def main():
    ap = argparse.ArgumentParser(description="Static website standards scanner.")
    ap.add_argument("--path", default=".", help="Path to the repository or site source root.")
    ap.add_argument("--out", default="audit_findings.json", help="Where to write the findings JSON.")
    args = ap.parse_args()

    root = Path(args.path).resolve()
    if not root.exists():
        print(f"Error: path not found: {root}", file=sys.stderr)
        sys.exit(1)

    scan = scan_files(root)
    gi = check_gitignore(root)
    secrets = check_tracked_secrets(root)
    findings = build_findings(scan, gi, secrets, root)

    report = {
        "context": {
            "path": str(root),
            "text_files_scanned": scan["text_scanned"],
            "is_git_repo": secrets.get("is_git_repo", False),
            "gitignore_standard_found": gi.get("standard_found", False),
            "out": str(Path(args.out).resolve()),
        },
        "summary": summarize(findings),
        "findings": findings,
        "raw": {
            "signals": {k: v["present"] for k, v in scan["signals"].items()},
            "em_dash": scan["em_dash"],
            "en_dash_count": scan["en_dash_count"],
            "emoji": scan["emoji"],
            "external_media": scan["external_media"],
            "gitignore": gi,
            "tracked_secrets": secrets,
        },
    }

    Path(args.out).write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print_summary(report)


if __name__ == "__main__":
    main()
