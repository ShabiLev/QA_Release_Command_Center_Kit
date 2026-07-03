# Bug Triage Matrix

Use this matrix to triage the open bug backlog for a release and to keep a clear, shared view of what blocks the release versus what can ship with a known issue.

## Matrix

| ID | Title | Severity | Priority | Blocker | Owner | Status |
|---|---|---|---|---|---|---|
| BUG-101 | *Payment confirmation missing on retry* | Critical | P1 | Yes | *Backend* | Open |
| BUG-102 | *Minor label truncation on tablet* | Low | P4 | No | *Frontend* | Open |

### Optional extended columns

Add these when you need deeper context for stakeholders or exports:

| ID | Customer Impact | Decision | Evidence |
|---|---|---|---|
| BUG-101 | High | Fix before release | *Jira BUG-101* |

## Field Definitions

- **Severity**: Low / Medium / High / Critical — technical/functional severity of the defect.
- **Priority**: P4 / P3 / P2 / P1 / P0 — urgency of fixing, independent of severity (a low-severity bug can still be P1 if it affects a VIP customer).
- **Blocker**: Yes / No — whether this bug alone prevents the release from going out.
- **Owner**: The engineer or team responsible for fixing (or formally deferring) the bug.
- **Status**: Open / In Progress / Fixed / Verified / Closed / Deferred.
- **Customer Impact** *(optional)*: Low / Medium / High — business-facing effect, useful for support and comms planning.
- **Decision** *(optional)*: Fix before release / Fix in fast-follow / Defer / Won't fix.

## Triage Guide

| Severity | Blocker = Yes | Blocker = No |
|---|---|---|
| Critical | P0/P1 — release cannot ship until resolved or explicitly accepted with a Conditional Go. | Rare — confirm severity/blocker classification is correct. |
| High | P1/P2 — fix before release unless a clear workaround exists. | P2/P3 — candidate for fast-follow. |
| Medium | P2/P3 — evaluate case by case. | P3/P4 — safe to defer with documented known issue. |
| Low | Should not be marked as Blocker. | P4 — backlog. |

## Triage Meeting Checklist

- [ ] Every bug has a Severity and Priority assigned (no blanks).
- [ ] Every bug marked Blocker = Yes has an Owner and an ETA.
- [ ] No duplicate bugs — check titles/areas before adding new entries.
- [ ] Bugs deferred out of this release are logged with a "Decision" and moved to the backlog.
- [ ] Final blocker count is reported into the Go / No-Go meeting.
