# Risk Register Template

Use this register to track every identified release risk from discovery to closure. Keep it updated throughout the QA cycle, not just before the Go / No-Go meeting.

## Risk Level Calculation

Risk Level is derived from Probability and Impact using this rule set (keep it consistent across projects):

| Probability | Impact | Level |
|---|---|---|
| High | High | **Critical** |
| High | Medium | **High** |
| Medium | High | **High** |
| Low | Low | **Low** |
| *any other combination* | | **Medium** |

## Register

| ID | Title | Probability | Impact | Level | Owner | Decision | Status | Evidence |
|---|---|---|---|---|---|---|---|---|
| R-1 | *Push notifications delayed on Android 15* | Medium | High | High | *Mobile Dev* | Monitor | Open | *Test results 2026-07-01* |
| R-2 | *Potential duplicate joins in monthly report* | Low | High | Medium | *QA* | Monitor | Mitigated | *Reconciliation file* |

## Field Definitions

- **Probability**: Low / Medium / High — likelihood the risk materializes before or shortly after release.
- **Impact**: Low / Medium / High — severity of consequence if it does materialize.
- **Level**: Low / Medium / High / Critical — calculated from Probability × Impact (see table above).
- **Owner**: The single person accountable for monitoring or mitigating this risk.
- **Decision**: Accept / Mitigate / Monitor / Escalate — the team's chosen response to the risk.
- **Status**: Open / Mitigated / Closed / Accepted.
- **Evidence**: Link or reference to test results, reconciliation files, monitoring dashboards, or other proof supporting the current status.

## Review Cadence

- [ ] Review the register at every daily QA standup during the release cycle.
- [ ] Escalate any new Critical or High risk to the Release Manager within 24 hours.
- [ ] No risk should remain "Open" with no Owner or no Evidence at the Go / No-Go meeting.
- [ ] Archive the final register with the release snapshot for audit purposes.

## Escalation Guide

- **Critical, Open, no mitigation** → automatic candidate for No-Go or Conditional Go with a hard condition.
- **High, Open, owner assigned, mitigation in progress** → acceptable for Conditional Go if the mitigation deadline is before or shortly after release.
- **Medium/Low** → track and monitor; does not typically block a release decision on its own.
