# Dependency audit exceptions

`bash scripts/agent/audit-check.sh` (pre-push, `/finalize`, CI and the weekly Dependency audit) allows an
advisory only when its GHSA id is in `pnpm.auditConfig.ignoreGhsas` **and** has a row here: no release fixes
it yet, the reason says why it cannot reach users, and the end date is at most
90 days away (`AUDIT_EXCEPTION_MAX_DAYS`). A fix shipping, the date passing or
the package leaving the tree fails the gate. The goal is an empty table.

| Advisory | Package | Until | Why it is safe until then |
|---|---|---|---|

## Overrides

A `pnpm.overrides` entry scoped to the vulnerable versions of one line (`pkg@>=1.2.0 <1.2.5`: `^1.2.5`) needs
no row. One that crosses a breaking line (a major, or a 0.x minor), names no vulnerable range, or targets a
`parent>child` chain is a reviewed decision: a row here, with a review date at most
90 days away and why the parent still works. The weekly Dependency audit also
re-resolves the tree without each override and reports the ones nothing needs any more.

| Override | Review by | Why it is needed and safe |
|---|---|---|
| `vite` | 2027-01-21 | vitepress 1.6 (this docs site) asks for vite 5, which has GHSA-4w7w-66w2-5vf9 and others fixed only in 6.4.x; the override lifts it to ^6.4.4 and the docs build on it. Drop it when vitepress 2 (vite 6+) is stable. |
