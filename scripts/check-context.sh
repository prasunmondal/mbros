#!/usr/bin/env bash
# Flags stale knowledge files in .claude/context/:
#   MISSING  - a path listed in `sources:` no longer exists
#   CHANGED  - a source file has commits after the file's `last_verified` date
#   STATUS   - file is not marked VERIFIED
# Usage: bash scripts/check-context.sh   (exit 1 if anything is flagged)

cd "$(git rev-parse --show-toplevel)" || exit 2
flagged=0

for f in $(find .claude/context -name '*.md' -not -path '*/decisions/*'); do
    status=$(sed -n 's/^status: *//p' "$f" | head -1)
    verified=$(sed -n 's/^last_verified: *//p' "$f" | head -1)
    sources=$(sed -n 's/^sources: *\[\(.*\)\]/\1/p' "$f" | head -1 | tr ',' ' ')

    [ "$status" != "VERIFIED" ] && { echo "STATUS   $f: $status"; flagged=1; }

    for s in $sources; do
        if [ ! -e "$s" ]; then
            echo "MISSING  $f -> $s"; flagged=1
        elif [ -n "$verified" ] && [ -n "$(git log --since="$verified 23:59:59" --format=%h -- "$s")" ]; then
            echo "CHANGED  $f -> $s (since $verified)"; flagged=1
        fi
    done
done

[ $flagged -eq 0 ] && echo "All context files verified and current."
exit $flagged
