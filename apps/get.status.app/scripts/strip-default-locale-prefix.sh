#!/bin/bash
# Strip default locale prefix (/en) from static export.
# See status.network/scripts/strip-default-locale-prefix.sh

set -e

OUT_DIR="${1:-out}"
LOCALE="${2:-en}"

echo "🌐 Strip /${LOCALE}/ prefix from ${OUT_DIR}/"

if [[ ! -d "$OUT_DIR" ]]; then
  echo "❌ ${OUT_DIR}/ not found"
  exit 1
fi

if [[ ! -d "$OUT_DIR/$LOCALE" ]]; then
  echo "⚠️  ${OUT_DIR}/${LOCALE}/ not found - skipping locale prefix stripping"
  exit 0
fi

echo "📦 Copying /${LOCALE}/ to root..."
cp -r "$OUT_DIR/$LOCALE"/* "$OUT_DIR/"

echo "🔧 Rewriting links..."
find "$OUT_DIR" -type f \( -name "*.html" -o -name "*.js" -o -name "*.json" -o -name "*.txt" \) \
  ! -path "$OUT_DIR/??/*" \
  -exec perl -pi -e "
    s|https://get\.status\.app/${LOCALE}/|https://get.status.app/|g;
    s|https://get\.status\.app/${LOCALE}\"|https://get.status.app/\"|g;
    s|https://get\.status\.app/${LOCALE}'|https://get.status.app/'|g;
    s|https://get\.status\.app/${LOCALE}<|https://get.status.app/<|g;
    s|get\.status\.app/${LOCALE}/|get.status.app/|g;
    s|get\.status\.app/${LOCALE}\"|get.status.app/\"|g;
    s|href=\"/${LOCALE}/|href=\"/|g;
    s|href=\"/${LOCALE}\"|href=\"/\"|g;
    s|href='/${LOCALE}/|href='/|g;
    s|href='/${LOCALE}'|href='/'|g;
    s|([\s,:=\(])\"${LOCALE}/|\1\"/|g;
    s|([\s,\(])\"${LOCALE}\"/|\1\"/|g;
    s|([\s,\(])\"${LOCALE}\"([\"'\s,;\)\]\}])|\1\"/\"\2|g;
    s|([\s,\(])\"${LOCALE}\"</|\1\"/\"</|g;
    s|^\"${LOCALE}/|\"/|g;
    s|^\"${LOCALE}\"/|\"/|g;
    s|^\"${LOCALE}\"([\"'\s,;\)\]\}])|\"/\"\1|g;
    s|^\"${LOCALE}\"</|\"/\"</|g;
    s|([\s,:=\(])'${LOCALE}/|\1'/|g;
    s|([\s,:=\(])'${LOCALE}'|\1'/'|g;
    s|^'${LOCALE}/|'/|g;
    s|^'${LOCALE}'|'/'|g;
    s|\\\\\"${LOCALE}/|\\\\\"/|g;
  " {} +

if [[ -f "$OUT_DIR/sitemap.xml" ]]; then
  echo "🗺️  Fixing sitemap URLs..."
  perl -pi -e "s|/${LOCALE}/|/|g; s|/${LOCALE}</loc>|/</loc>|g" "$OUT_DIR/sitemap.xml"
fi

if [[ -f "$OUT_DIR/${LOCALE}.html" ]]; then
  echo "📄 Renaming ${LOCALE}.html to index.html..."
  mv "$OUT_DIR/${LOCALE}.html" "$OUT_DIR/index.html"
fi

if [[ -f "$OUT_DIR/${LOCALE}.txt" ]]; then
  mv "$OUT_DIR/${LOCALE}.txt" "$OUT_DIR/index.txt"
fi

echo "🔗 Creating clean URL aliases..."
find "$OUT_DIR" -type f -name "*.html" \
  ! -name "index.html" \
  ! -name "404.html" \
  ! -path "$OUT_DIR/_next/*" \
  ! -path "$OUT_DIR/??/*" \
  -print0 | while IFS= read -r -d '' html_file; do
    rel_path="${html_file#$OUT_DIR/}"
    page_name="${rel_path%.html}"
    page_dir="$OUT_DIR/$page_name"

    if [[ -f "$page_dir/index.html" ]]; then
      continue
    fi

    mkdir -p "$page_dir"
    cp "$html_file" "$page_dir/index.html"

    txt_file="${html_file%.html}.txt"
    if [[ -f "$txt_file" ]]; then
      cp "$txt_file" "$page_dir/index.txt"
    fi
  done

# Create clean URL aliases for non-default locale trees (e.g. /ko/legal/...).
echo "🔗 Creating locale-prefixed URL aliases..."
for locale_dir in "$OUT_DIR"/??; do
  [[ -d "$locale_dir" ]] || continue
  locale_name="$(basename "$locale_dir")"
  [[ "$locale_name" == "$LOCALE" ]] && continue

  find "$locale_dir" -type f -name "*.html" \
    ! -name "index.html" \
    ! -name "404.html" \
    -print0 | while IFS= read -r -d '' html_file; do
      rel_path="${html_file#$OUT_DIR/}"
      page_name="${rel_path%.html}"
      page_dir="$OUT_DIR/$page_name"

      if [[ -f "$page_dir/index.html" ]]; then
        continue
      fi

      mkdir -p "$page_dir"
      cp "$html_file" "$page_dir/index.html"

      txt_file="${html_file%.html}.txt"
      if [[ -f "$txt_file" ]]; then
        cp "$txt_file" "$page_dir/index.txt"
      fi
    done
done

if [[ -z "${OUT_DIR//[[:space:]]/}" ]]; then
  echo "❌ OUT_DIR is empty; refusing to remove locale directory"
  exit 1
fi
rm -rf "${OUT_DIR:?}/$LOCALE"

echo "✅ Done!"
