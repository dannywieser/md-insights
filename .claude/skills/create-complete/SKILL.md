---
name: create-complete
description: Close the current /create session by writing a concise summary.md of the work done and session highlights.
disable-model-invocation: true
---

# /create-complete

Finishes the active create session.

## Steps

1. Read `create/.current` to get the slug. If it is missing or the folder doesn't exist, tell the user there is no active create session and stop.
2. Read `create/<slug>/log.md` and `create/<slug>/plan.md` (if present). Check the repo (`git status`, `git diff --stat`) to confirm what actually changed rather than trusting the plan alone.
3. Append this `/create-complete` invocation to `log.md` (format in the `create` skill).
4. Write `create/<slug>/summary.md`, clear and concise, with:
   - **Title and slug**, start and completion dates
   - **Overview** - what was created and why, in a short paragraph
   - **What was done** - files and structures created or changed (grouped, not exhaustive prose)
   - **Highlights** - key decisions, trade-offs, notable discussion points from the session
   - **Deviations from the plan** - if any
   - **Not done / follow-ups** - anything left open
5. Append a final `### [timestamp] Decision` entry to `log.md`: "Session complete", then add a `- **Completed:** <timestamp>` line to the log header.
6. Delete `create/.current` so no session is active.
7. Tell the user the session is complete and link `summary.md`. Do not commit unless asked.
