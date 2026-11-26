#!/usr/bin/env python3
"""
External media download and WebP conversion helper.

Downloads external images, videos, and fonts found in audit_findings.json,
self-hosts them, and writes a replacement map so the agent can update
all source references.

Usage:
    python3 scripts/download_media.py \\
        --findings <workdir>/audit_findings.json \\
        --root     <repo-root> \\
        --out-images public/media/images \\
        --out-videos public/media/videos \\
        --out-fonts  public/fonts \\
        [--dry-run]

Behavior:
- Images  : downloaded then converted to WebP (requires Pillow). Falls back
            to the original format with a warning if Pillow is unavailable.
- Videos  : downloaded as-is. No re-encoding. Add preload="metadata" and
            a poster attribute manually after downloading.
- Fonts   : downloaded as-is. Update @font-face src declarations manually.
- audio / other : downloaded as-is to out-images directory with a note.

Outputs:
- The downloaded files to the specified directories.
- <workdir>/media_replacements.json  mapping each original URL to its new
  local relative path (relative to the repo root).

Safe to re-run: never overwrites a file that already exists.
Use --dry-run to preview what would be downloaded without writing any files.
"""

import argparse
import json
import os
import re
import sys
import urllib.request
import urllib.error
from pathlib import Path
from urllib.parse import urlparse

try:
    from PIL import Image
    import io as _io
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

SAFE_NAME_RE = re.compile(r"[^A-Za-z0-9._-]")
MAX_FILENAME_LEN = 120


def safe_filename(url, suffix_override=None):
    """Derive a filesystem-safe filename from a URL."""
    parsed = urlparse(url)
    base = parsed.path.rstrip("/").rsplit("/", 1)[-1] or "file"
    base = SAFE_NAME_RE.sub("_", base)
    if len(base) > MAX_FILENAME_LEN:
        base = base[:MAX_FILENAME_LEN]
    if suffix_override and not base.endswith(suffix_override):
        stem = base.rsplit(".", 1)[0] if "." in base else base
        base = stem + suffix_override
    return base or "download"


def download_url(url, dest_path, dry_run=False):
    """
    Download url to dest_path. Returns (ok, message).
    Uses requests if available, falls back to urllib.
    """
    if dry_run:
        return True, f"[dry-run] would download to {dest_path}"
    dest_path = Path(dest_path)
    if dest_path.exists():
        return True, f"skipped (already exists): {dest_path}"
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    try:
        # Try requests first (better redirect handling and headers).
        try:
            import requests  # type: ignore
            headers = {"User-Agent": "website-standards-auditor/1.0 (self-hosting media)"}
            r = requests.get(url, headers=headers, timeout=30, stream=True)
            r.raise_for_status()
            with open(dest_path, "wb") as fh:
                for chunk in r.iter_content(chunk_size=65536):
                    fh.write(chunk)
        except ImportError:
            # Fall back to stdlib urllib.
            req = urllib.request.Request(
                url, headers={"User-Agent": "website-standards-auditor/1.0 (self-hosting media)"}
            )
            with urllib.request.urlopen(req, timeout=30) as resp:
                with open(dest_path, "wb") as fh:
                    while True:
                        chunk = resp.read(65536)
                        if not chunk:
                            break
                        fh.write(chunk)
        return True, f"downloaded: {dest_path}"
    except Exception as exc:
        return False, f"failed: {exc}"


def convert_to_webp(src_path, dry_run=False):
    """
    Convert src_path to a WebP file alongside it.
    Returns the WebP path on success, or None with a warning.
    """
    src_path = Path(src_path)
    if not PIL_AVAILABLE:
        return None, "Pillow not installed; keeping original format. Run: pip install Pillow"
    if dry_run:
        webp_path = src_path.with_suffix(".webp")
        return webp_path, f"[dry-run] would convert to {webp_path}"
    try:
        with Image.open(src_path) as img:
            webp_path = src_path.with_suffix(".webp")
            # Preserve transparency for formats that support it.
            if img.mode in ("RGBA", "LA", "PA"):
                img.save(webp_path, "WEBP", lossless=True, quality=90)
            else:
                img = img.convert("RGB")
                img.save(webp_path, "WEBP", quality=85, method=6)
        return webp_path, f"converted to WebP: {webp_path}"
    except Exception as exc:
        return None, f"WebP conversion failed ({exc}); keeping original"


# ---------------------------------------------------------------------------
# Main logic
# ---------------------------------------------------------------------------

def process_hits(hits, root, out_images, out_videos, out_fonts, dry_run):
    """
    Process a list of external media hits.
    Returns (replacements dict, results list).
    replacements maps original_url -> local_relative_path.
    """
    root = Path(root).resolve()
    out_images = root / out_images
    out_videos = root / out_videos
    out_fonts  = root / out_fonts
    replacements = {}
    results = []

    # Deduplicate by URL so each URL is downloaded only once.
    seen_urls = {}
    for hit in hits:
        url = hit.get("url", "").strip()
        if not url or url in seen_urls:
            continue
        seen_urls[url] = hit.get("media_type", "other")

    for url, media_type in seen_urls.items():
        if url in replacements:
            continue

        if media_type == "image":
            filename = safe_filename(url)
            dest = out_images / filename
            ok, msg = download_url(url, dest, dry_run=dry_run)
            results.append({"url": url, "type": media_type, "status": msg})
            if not ok:
                continue
            # Attempt WebP conversion.
            if not dry_run and dest.exists():
                webp_path, conv_msg = convert_to_webp(dest, dry_run=dry_run)
                results.append({"url": url, "type": "conversion", "status": conv_msg})
                final_path = webp_path if webp_path else dest
            elif dry_run:
                final_path = dest.with_suffix(".webp") if PIL_AVAILABLE else dest
                webp_path, conv_msg = convert_to_webp(dest, dry_run=True)
                results.append({"url": url, "type": "conversion", "status": conv_msg})
            else:
                final_path = dest
            if final_path:
                replacements[url] = "/" + str(final_path.relative_to(root)).replace("\\", "/")

        elif media_type == "video":
            filename = safe_filename(url)
            dest = out_videos / filename
            ok, msg = download_url(url, dest, dry_run=dry_run)
            results.append({"url": url, "type": media_type, "status": msg})
            if ok:
                final_path = dest if not dry_run else dest
                replacements[url] = "/" + str(final_path.relative_to(root)).replace("\\", "/")

        elif media_type == "font":
            filename = safe_filename(url)
            dest = out_fonts / filename
            ok, msg = download_url(url, dest, dry_run=dry_run)
            results.append({"url": url, "type": media_type, "status": msg})
            if ok:
                replacements[url] = "/" + str(dest.relative_to(root)).replace("\\", "/")

        else:
            # audio / other: download to images dir with a note.
            filename = safe_filename(url)
            dest = out_images / filename
            ok, msg = download_url(url, dest, dry_run=dry_run)
            results.append({"url": url, "type": media_type,
                             "status": msg + " (note: non-image/video/font asset; review manually)"})
            if ok:
                replacements[url] = "/" + str(dest.relative_to(root)).replace("\\", "/")

    return replacements, results


def main():
    ap = argparse.ArgumentParser(
        description="Download external media found by audit_site.py and convert images to WebP.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    ap.add_argument("--findings", required=True,
                    help="Path to audit_findings.json produced by audit_site.py.")
    ap.add_argument("--root", required=True,
                    help="Repository or site source root.")
    ap.add_argument("--out-images", default="public/media/images",
                    help="Directory for downloaded images (relative to --root). Default: public/media/images")
    ap.add_argument("--out-videos", default="public/media/videos",
                    help="Directory for downloaded videos (relative to --root). Default: public/media/videos")
    ap.add_argument("--out-fonts", default="public/fonts",
                    help="Directory for downloaded fonts (relative to --root). Default: public/fonts")
    ap.add_argument("--dry-run", action="store_true",
                    help="Print what would be downloaded without writing files.")
    ap.add_argument("--out-map", default=None,
                    help="Where to write media_replacements.json. Defaults to the same directory as --findings.")
    args = ap.parse_args()

    findings_path = Path(args.findings)
    if not findings_path.exists():
        print(f"Error: findings file not found: {findings_path}", file=sys.stderr)
        sys.exit(1)

    try:
        report = json.loads(findings_path.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"Error reading findings JSON: {exc}", file=sys.stderr)
        sys.exit(1)

    hits = report.get("raw", {}).get("external_media", {}).get("shown", [])
    if not hits:
        print("No external media hits found in findings JSON. Nothing to download.")
        sys.exit(0)

    if not PIL_AVAILABLE:
        print("Warning: Pillow is not installed. Images will be downloaded in their original format.")
        print("         Run: pip install Pillow   to enable WebP conversion.\n")

    print(f"{'[DRY RUN] ' if args.dry_run else ''}Processing {len(hits)} external media reference(s)...\n")

    replacements, results = process_hits(
        hits,
        root=args.root,
        out_images=args.out_images,
        out_videos=args.out_videos,
        out_fonts=args.out_fonts,
        dry_run=args.dry_run,
    )

    # Print results.
    ok_count = sum(1 for r in results if "failed" not in r["status"].lower())
    fail_count = len(results) - ok_count
    for r in results:
        icon = "x" if "failed" in r["status"].lower() else "+"
        print(f"  [{icon}] [{r['type']}] {r['status']}")

    print(f"\nSummary: {ok_count} OK, {fail_count} failed, {len(replacements)} replacement(s) mapped.")

    if not args.dry_run and replacements:
        map_path = Path(args.out_map) if args.out_map else findings_path.parent / "media_replacements.json"
        map_path.write_text(
            json.dumps(replacements, indent=2, ensure_ascii=False), encoding="utf-8"
        )
        print(f"\nReplacement map written to: {map_path}")
        print("\nNext steps:")
        print("  1. Search your source files for each original URL listed in media_replacements.json")
        print("     and replace it with the local path.")
        print("  2. For images: wrap in <picture> with a WebP <source> and an original-format <img> fallback.")
        print("  3. For videos: add preload=\"metadata\" and a poster attribute pointing to a self-hosted still.")
        print("  4. For fonts: update @font-face src; add font-display: swap.")
        print("  5. Re-run audit_site.py to confirm RESIL-03 is cleared.")
    elif args.dry_run:
        print("\n[dry-run] No files written. Re-run without --dry-run to download.")


if __name__ == "__main__":
    main()
