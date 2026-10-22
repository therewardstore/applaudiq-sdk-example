# Docs

<!-- friday:agents:start -->
## Agent workflow

| When you are about to… | Read |
|---|---|
| Land in this repo, or start a session (`/scan`) | [`scan` skill](../.claude/skills/scan/SKILL.md) |
| Start any feature, fix or refactor (`/task`) | [`task` skill](../.claude/skills/task/SKILL.md) |
| Check the house rules and what enforces each one | [CLAUDE.md](../CLAUDE.md) |
| Understand the git hooks, the gates and CI | [GATES.md](GATES.md) |
| Check a finished change before pushing (`/finalize`) | [`finalize` skill](../.claude/skills/finalize/SKILL.md) |
| Hand a finished change to QA (`/handoff`) | [`handoff` skill](../.claude/skills/handoff/SKILL.md) — one test plan per change, in a tester's words, into the tracked change record |
| Run a request end to end, or review a range (`/flow`, `/review`) | [`flow` skill](../.claude/skills/flow/SKILL.md) · [`review` skill](../.claude/skills/review/SKILL.md) |
| See what changed on day one of friday 0.7 | [MIGRATION-0.7.md](MIGRATION-0.7.md) — the new defaults, the commit question, the links every tool reads, and the rollback |
| Check which AI tool is wired to the skills and the guard | [TOOLS.md](TOOLS.md) — the support matrix; `trs-app agents doctor` is the live check |

The canonical copy of each skill is `.claude/skills/<name>/SKILL.md`. Cursor reads the same
files through `.cursor/skills/`; Codex and Antigravity through shims under `.agents/`.
<!-- friday:agents:end -->

## Public site pages

What VitePress publishes from this folder. friday's developer docs above are kept off the site by
`srcExclude` in `docs/.vitepress/config.ts`.

- [index.md](index.md)
- [get-keys.md](get-keys.md)
- [security.md](security.md)
- [MINTING.md](MINTING.md)
- [guides/auto-login.md](guides/auto-login.md)
- [guides/login-modes.md](guides/login-modes.md)
- [guides/manual-login.md](guides/manual-login.md)
- [web/angular.md](web/angular.md)
- [web/html.md](web/html.md)
- [web/nextjs.md](web/nextjs.md)
- [web/react.md](web/react.md)
- [web/svelte.md](web/svelte.md)
- [web/vanilla.md](web/vanilla.md)
- [web/vue.md](web/vue.md)
