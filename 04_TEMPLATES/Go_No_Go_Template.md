# Go / No-Go Decision Template

Use this template to run a structured Go / No-Go meeting and to record the final release decision in an auditable way. It is designed to be filled out live during the meeting and archived afterward.

## Release Under Review

| Field | Value |
|---|---|
| Version | *e.g. 3.8.0* |
| Title | *e.g. Push & Login Improvements* |
| Target Date | *YYYY-MM-DD* |
| Environment | *e.g. Staging → Production* |
| QA Owner | *name* |
| Product Owner | *name* |
| R&D Owner | *name* |
| Support Owner | *name* |
| Meeting Date | *YYYY-MM-DD* |
| Attendees | *names/roles* |

## Decision Framework

Use exactly one of the following four outcomes. Do not invent custom statuses — this keeps decisions comparable across releases.

| Decision | Meaning | When to use it |
|---|---|---|
| **Go** | Release proceeds as planned, on schedule. | All blockers resolved, all sign-offs approved, no open Critical risks. |
| **Conditional Go** | Release proceeds, but only if specific conditions are met before or shortly after deployment. | Minor open items exist with agreed mitigations, owners, and deadlines (e.g. monitor a known risk in production, ship a fast-follow fix). |
| **No-Go** | Release does not proceed on the planned date. | Open blocker bugs, unmitigated Critical risks, missing sign-offs, or failed regression. |
| **Need More Data** | The team cannot make a responsible decision yet. | Missing test results, incomplete sign-offs, or unclear risk/impact — schedule a follow-up review with a fixed deadline. |

## Inputs Reviewed

- [ ] Release Readiness Checklist (`Release_Readiness_Checklist.md`)
- [ ] Risk Register — open Critical/High risks: ______
- [ ] Bug Triage Matrix — open blocker/Critical bugs: ______
- [ ] Regression Scope Matrix — pass rate: ______%
- [ ] Sign-Off status by role (QA / Product / R&D / Support / DevOps)
- [ ] Production Readiness Checklist status
- [ ] Exported JSON/CSV snapshot attached: Yes / No

## Summary of Open Items

| ID | Type (Risk/Bug) | Title | Severity/Level | Owner | Status |
|---|---|---|---|---|---|
| *R-1* | *Risk* | *Push notifications delayed on Android 15* | *High* | *Mobile Dev* | *Open* |
| *BUG-101* | *Bug* | *Payment confirmation missing on retry* | *Critical* | *Backend* | *Open* |

## Decision

| Field | Value |
|---|---|
| **Final Decision** | Go / Conditional Go / No-Go / Need More Data |
| Conditions (if Conditional Go) | *e.g. Ship with feature flag off for Android 15; enable after fix verified* |
| Follow-up date (if Need More Data) | *YYYY-MM-DD* |
| Decision Owner | *name, usually Release Manager or QA Manager* |

## Sign-Offs at Meeting

| Role | Name | Vote/Position | Notes |
|---|---|---|---|
| QA | | | |
| Product | | | |
| R&D | | | |
| Support | | | |
| DevOps | | | |

## Rationale

*Write 3–5 sentences explaining why this decision was made, referencing the specific risks/bugs that drove it. This is the paragraph you will reuse in release communications and in the post-release retrospective.*
