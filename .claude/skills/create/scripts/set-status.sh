#!/usr/bin/env bash
# Sets a session's status in the index table of create/README.md
# Usage: set-status.sh <slug> <review|planned|complete>
set -euo pipefail

slug="${1:-}"
status="${2:-}"
case "$status" in
  review | planned | complete) ;;
  *)
    echo "usage: set-status.sh <slug> <review|planned|complete>" >&2
    exit 1
    ;;
esac

readme="$(git rev-parse --show-toplevel)/create/README.md"
grep -qF "| [$slug](" "$readme" || {
  echo "no index row for $slug in $readme" >&2
  exit 1
}

# columns: session | title | status | started
awk -F' [|] ' -v OFS=' | ' -v key="| [$slug](" -v status="$status" '
  index($0, key) == 1 { $3 = status }
  { print }
' "$readme" > "$readme.tmp"
mv "$readme.tmp" "$readme"
