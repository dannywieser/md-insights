#!/usr/bin/env bash
# Creates a new /create session folder: create/YYYYMMDD-xx-<title>/
# Usage: new-session.sh <title words...>
# Prints the slug on stdout. Records it as the active session in create/.current
set -euo pipefail

title="$*"
if [ -z "${title// /}" ]; then
  echo "usage: new-session.sh <title>" >&2
  exit 1
fi

root="$(git rev-parse --show-toplevel)"
base="$root/create"
mkdir -p "$base"

title_slug="$(printf '%s' "$title" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g')"
day="$(date +%Y%m%d)"

# xx = next two-digit sequence number for today
n="$(find "$base" -mindepth 1 -maxdepth 1 -type d -name "$day-*" | wc -l | tr -d ' ')"
while :; do
  n=$((n + 1))
  slug="$day-$(printf '%02d' "$n")-$title_slug"
  [ -e "$base/$slug" ] || break
done

mkdir -p "$base/$slug"
printf '%s\n' "$slug" > "$base/.current"
# .current is local state about which session is active
[ -f "$base/.gitignore" ] || printf '.current\n' > "$base/.gitignore"

cat > "$base/$slug/log.md" <<EOF
# Create session: $title

- **Slug:** $slug
- **Started:** $(date '+%Y-%m-%d %H:%M:%S %Z')

---
EOF

printf '%s\n' "$slug"
