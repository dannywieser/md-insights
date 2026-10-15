# create

A lightweight, tracked way to design and build something in this repo by talking it through with Claude first. Each piece of work is a **session**: a folder in `create/` holding the conversation, the plan and a summary, so the reasoning behind the code is never lost.

Sessions are driven by three slash commands, defined in `.claude/skills/`:

| Command | Phase | Produces |
| --- | --- | --- |
| `/create <title>` | Discuss and clarify the intent: what, why, scope, constraints. No code yet. | `log.md`, index entry (`review`) |
| `/create-plan` | Write the plan, then choose how to implement it (everything, step by step, file by file). Implementation follows. | `plan.md`, status `planned` |
| `/create-complete` | Write the summary, fold lessons back into `CLAUDE.md` / `README.md`, close the session. | `summary.md`, status `complete` |

## Session folder

Each session lives in `create/YYYYMMDD-xx-<title>/` (`xx` is the day's sequence number):

- `log.md` - the full conversation and every decision, timestamped. Numbered questions keep their numbers so answers stay matched to them.
- `plan.md` - goal, scope, technologies, structure, files, ordered steps, open questions.
- `summary.md` - what was done, highlights, deviations from the plan, follow-ups and what the harvest changed in the docs.

`create/.current` (git-ignored) names the active session.

## Statuses

| Status | Meaning | Set by |
| --- | --- | --- |
| `review` | Intent is being discussed and clarified | `/create` |
| `planned` | `plan.md` written; implementation under way or ready | `/create-plan` |
| `complete` | Work done and `summary.md` written | `/create-complete` |

Status changes are made with `bash .claude/skills/create/scripts/set-status.sh <slug> <status>`; the index row is added by `new-session.sh`.

## Index

New sessions are appended to the bottom of this table.

| Session | Title | Status | Started |
| --- | --- | --- | --- |
| [20261015-01-repo-bootstrap](20261015-01-repo-bootstrap/) | repo bootstrap | complete | 2026-10-15 |
| [20261015-02-design-system-and-viewer-application](20261015-02-design-system-and-viewer-application/) | design system and viewer application | complete | 2026-10-15 |
