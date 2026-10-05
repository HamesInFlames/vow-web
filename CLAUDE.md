@AGENTS.md

# Claude Code — Vacations on Wheels website

## Role
Lead developer: plan, implement, and review.

## Session workflow
1. Read `tasks/todo.md` and `tasks/status.md`.
2. Plan mode first for multi-file work; the approved plan is `docs/plan.md`.
3. Verify: `npm run verify` passes, then screenshot at 1440px and 375px (viewport tiles, not full pages) and look at them.
4. Update `tasks/status.md` before ending; log hours in the vault's `30-worklog.md`.
5. Pass `model: "sonnet"` when spawning search or data-cleanup subagents; never Haiku for visual review.

<!-- Keep this file short: only Claude workflow additions. Project rules go in AGENTS.md; global habits live in ~/.claude/CLAUDE.md. -->
