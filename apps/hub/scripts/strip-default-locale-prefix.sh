#!/bin/bash
# Strip default locale prefix (/en) from static export.
#
# Why: next-intl requires explicit locale prefixes for static exports (output: 'export').
# The `localePrefix: 'as-needed'` option is not supported without middleware.
# See: https://next-intl.dev/docs/routing/middleware#usage-without-proxy--middleware-static-export
#
# This script allows the default locale (English) to be served at root (/)
# while other locales like /ko remain prefixed, by:
#   1. Copying files from /en to root
#   2. Rewriting href="/en/..." to href="/..." in all files
#   3. Fixing sitemap URLs
#   4. Removing the /en directory
#
# Usage: ./scripts/strip-default-locale-prefix.sh [out-dir] [locale]

set -e

OUT_DIR="${1:-out}"
LOCALE="${2:-en}"

echo "🌐 Strip /${LOCALE}/ prefix from ${OUT_DIR}/"

# Check directories exist
if [[ ! -d "$OUT_DIR" ]]; then
  echo "❌ ${OUT_DIR}/ not found"
  echo "   Ensure 'output: \"export\"' is enabled in next.config.mjs"
  exit 1
fi

if [[ ! -d "$OUT_DIR/$LOCALE" ]]; then
  echo "⚠️  ${OUT_DIR}/${LOCALE}/ not found - skipping locale prefix stripping"
  echo "   (This is fine if the app doesn't use locale-prefixed routes yet)"
  exit 0
fi

# 1. Copy /en/* to root
echo "📦 Copying /${LOCALE}/ to root..."
cp -r "$OUT_DIR/$LOCALE"/* "$OUT_DIR/"

# 2. Rewrite links in HTML/JS/JSON (using perl for cross-platform compatibility)
echo "🔧 Rewriting links..."

# Process all files at root and in _next (skip other locale dirs like /ko)
find "$OUT_DIR" -type f \( -name "*.html" -o -name "*.js" -o -name "*.json" \) \
  ! -path "$OUT_DIR/??/*" \
  -exec perl -pi -e "
    # HTML href attributes
    s|href=\"/${LOCALE}/|href=\"/|g;
    s|href=\"/${LOCALE}\"|href=\"/\"|g;
    s|href='/${LOCALE}/|href='/|g;
    s|href='/${LOCALE}'|href='/'|g;
    # Double-quoted strings (JS/JSON)
    s|\"/${LOCALE}/|\"/|g;
    s|\"/${LOCALE}\"|\"\/\"|g;
    # Single-quoted strings (JS)
    s|'/${LOCALE}/|'/|g;
    s|'/${LOCALE}'|'/'|g;
    # Escaped quotes in JSON (e.g., \"/en/\")
    s|\\\\\"/${LOCALE}/|\\\\\"/|g;
  " {} +

# 3. Fix sitemap URLs
if [[ -f "$OUT_DIR/sitemap.xml" ]]; then
  echo "🗺️  Fixing sitemap URLs..."
  perl -pi -e "
    # Remove /en prefix from URLs: /en/page -> /page
    s|/${LOCALE}/|/|g;
    # Handle /en at end of URL (homepage): /en</loc> -> /</loc>
    s|/${LOCALE}</loc>|/</loc>|g;
  " "$OUT_DIR/sitemap.xml"
fi

# Also fix sitemap index if it exists
if [[ -f "$OUT_DIR/sitemap-0.xml" ]]; then
  echo "🗺️  Fixing sitemap-0.xml URLs..."
  perl -pi -e "s|/${LOCALE}/|/|g; s|/${LOCALE}</loc>|/</loc>|g" "$OUT_DIR/sitemap-0.xml"
fi

# 4. Rename en.html to index.html (so / serves English homepage)
if [[ -f "$OUT_DIR/${LOCALE}.html" ]]; then
  echo "📄 Renaming ${LOCALE}.html to index.html..."
  mv "$OUT_DIR/${LOCALE}.html" "$OUT_DIR/index.html"
fi

# Also handle .txt file if it exists (RSC payload)
if [[ -f "$OUT_DIR/${LOCALE}.txt" ]]; then
  echo "📄 Renaming ${LOCALE}.txt to index.txt..."
  mv "$OUT_DIR/${LOCALE}.txt" "$OUT_DIR/index.txt"
fi

# 5. Remove the /en directory
echo "🗑️  Removing /${LOCALE}/..."
rm -rf "${OUT_DIR:?}/$LOCALE"

echo "✅ Done!"
