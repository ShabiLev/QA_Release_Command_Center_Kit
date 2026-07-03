# Production Readiness Checklist

Use this checklist to confirm the release is operationally safe to deploy — beyond functional testing. This is typically owned jointly by QA/Release Management and DevOps/SRE.

## Production Checks

| ID | Title | Status | Owner | Evidence |
|---|---|---|---|---|
| PC-1 | *Rollback steps verified* | Ready | *DevOps* | *Confluence doc* |
| PC-2 | *Export encoding validated* | Ready | *QA* | *Excel sample* |
| PC-3 | *Monitoring dashboards updated* | In Progress | *DevOps* | |

**Status values:** Not Started / In Progress / Ready / Blocked

## 1. Rollback Plan

- [ ] Rollback procedure is documented step by step.
- [ ] Rollback has been tested in a non-production environment (not just theoretical).
- [ ] Rollback time estimate is known and acceptable (target: ______ minutes).
- [ ] Database/schema changes have a documented rollback or are backward-compatible (see `Data_SQL_Release_Template.md` if applicable).
- [ ] Clear rollback decision owner identified (who has authority to trigger it).

## 2. Monitoring & Alerting

- [ ] Dashboards updated to reflect new features/endpoints.
- [ ] Alerts configured for new error conditions or SLA thresholds.
- [ ] Baseline metrics captured before deployment (for comparison after).
- [ ] On-call rotation aware of the release window and known risk areas.
- [ ] Log levels appropriate for the first 24–48 hours post-release (temporarily increased if needed).

## 3. Feature Flags

- [ ] New functionality is behind a feature flag (if risk warrants it).
- [ ] Flag default state confirmed for the release (on/off).
- [ ] Rollout plan defined (e.g. internal → 5% → 25% → 100%).
- [ ] Flag owner identified and able to toggle it quickly if needed.
- [ ] Flag cleanup ticket created for after the flag is no longer needed.

## 4. Capacity & Performance

- [ ] Expected load/traffic for this release estimated.
- [ ] Load/performance testing done for new or changed high-traffic paths.
- [ ] Infrastructure scaled appropriately (or auto-scaling verified).
- [ ] Third-party/dependency rate limits reviewed if usage increases.

## 5. Communications Plan

- [ ] Release notes finalized and reviewed by Product.
- [ ] Support/CS briefed with known issues and talking points.
- [ ] Customer-facing communication drafted (if user-visible changes).
- [ ] Internal stakeholders notified of the deployment window.
- [ ] Escalation contacts published for the deployment window.

## Sign-Off

| Role | Name | Status | Date |
|---|---|---|---|
| DevOps / SRE | | Approved / Pending | |
| QA | | Approved / Pending | |
| Release Manager | | Approved / Pending | |

**This checklist should be marked fully "Ready" before the final Go decision is confirmed.**
