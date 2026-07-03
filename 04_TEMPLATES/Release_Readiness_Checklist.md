# Release Readiness Checklist

Use this checklist as the single source of truth for whether a release is ready to move forward. Fill it in during the QA cycle and review it before the Go / No-Go meeting. It is designed to be copied once per release and stored alongside your release notes.

## Release Information

| Field | Value |
|---|---|
| Version | *e.g. 3.8.0* |
| Title | *e.g. Push & Login Improvements* |
| Release Type | Major / Minor / Patch / Hotfix / Emergency / Beta |
| Target Date | *YYYY-MM-DD* |
| Actual Date | *YYYY-MM-DD* |
| Environment | Dev / QA / Staging / Production |
| QA Owner | *name* |
| Product Owner | *name* |
| R&D Owner | *name* |
| Support Owner | *name* |
| Health | Green / Yellow / Red |

## 1. Scope & Requirements

- [ ] Release scope is documented and agreed by Product, R&D, and QA.
- [ ] All in-scope tickets/user stories are linked to this release.
- [ ] Out-of-scope items are explicitly listed and communicated.
- [ ] Acceptance criteria exist for every scoped item.
- [ ] No unreviewed last-minute scope additions.

## 2. Testing & Quality

- [ ] Test plan covers all scoped features.
- [ ] Functional testing complete for all in-scope items.
- [ ] Regression scope defined (see `Regression_Scope_Matrix.md`) and executed.
- [ ] Automated test suite passing on the target build.
- [ ] Exploratory / edge-case testing performed for high-risk areas.
- [ ] Performance/load testing done where applicable.
- [ ] Accessibility checks done where applicable.

## 3. Bugs & Defects

- [ ] Open bug list reviewed (see `Bug_Triage_Matrix.md`).
- [ ] No open blocker or Critical/P0 bugs without an accepted decision.
- [ ] All bugs marked "Fix before release" are verified fixed.
- [ ] Known issues list drafted for release notes / support.

## 4. Risk Management

- [ ] Risk register reviewed and current (see `Risk_Register_Template.md`).
- [ ] No open Critical risks without a mitigation or accepted decision.
- [ ] High risks have an owner and a monitoring plan.
- [ ] Evidence attached for mitigated/closed risks.

## 5. Sign-Offs

- [ ] QA sign-off obtained.
- [ ] Product sign-off obtained.
- [ ] R&D sign-off obtained.
- [ ] Support/CS sign-off obtained (if customer-facing).
- [ ] DevOps sign-off obtained (if infrastructure changes).

## 6. Deployment & Operational Readiness

- [ ] Deployment runbook reviewed (see `Production_Readiness_Checklist.md`).
- [ ] Rollback plan documented and tested.
- [ ] Monitoring/alerting configured for new functionality.
- [ ] Feature flags configured (if used) with a rollout plan.
- [ ] Support team briefed on changes and known issues.
- [ ] Release notes drafted and reviewed.

## 7. Final Decision Input

- [ ] Snapshot/backup of workspace data exported (JSON) before the meeting.
- [ ] Bug and risk CSV exports attached to the meeting invite.
- [ ] Decision recorded in `Go_No_Go_Template.md`: Go / Conditional Go / No-Go / Need More Data.

---
**Notes:**
*Free text field for anything not captured above — dependencies, external vendor status, legal/compliance items, etc.*
