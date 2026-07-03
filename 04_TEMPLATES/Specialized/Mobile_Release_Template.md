# Mobile Release Readiness Template

Use this alongside `Release_Readiness_Checklist.md` for releases shipped through app stores (iOS App Store, Google Play, or both). It adds the mobile-specific risks that generic web checklists miss.

## Release Information

| Field | Value |
|---|---|
| Version (marketing) | *e.g. 3.8.0* |
| Build Number | *e.g. 3800* |
| Platforms | iOS / Android / Both |
| Release Method | Standard rollout / Staged rollout / TestFlight / Internal track |
| QA Owner | |
| Store Submission Owner | |

## 1. App Store Review Risk

- [ ] Release notes comply with store guidelines (no banned claims, correct age rating).
- [ ] New permissions, in-app purchases, or third-party SDKs reviewed against current store policies.
- [ ] Screenshots/metadata updated if UI changed materially.
- [ ] Expected review turnaround time factored into the release date (iOS review time can vary).
- [ ] Rejection contingency plan in place (who resubmits, and how fast).

## 2. Device / OS Matrix

| Device Class | OS Version | Result | Owner | Evidence |
|---|---|---|---|---|
| *Low-end Android* | *Android 12* | Passed | *QA* | |
| *Flagship Android* | *Android 15* | Failed | *QA* | *see BUG-101* |
| *Older iPhone* | *iOS 16* | Passed | *QA* | |
| *Latest iPhone* | *iOS 18* | Passed | *QA* | |

- [ ] Matrix covers your top devices by real user share, not just the newest models.
- [ ] Tablet/foldable layouts checked if the app supports them.
- [ ] Minimum supported OS version explicitly tested.

## 3. Permissions

- [ ] All requested permissions (camera, location, notifications, Bluetooth, microphone, etc.) map to an actual feature in this release.
- [ ] Permission request flows tested for grant, deny, and "don't ask again" paths.
- [ ] Behavior verified when a previously-granted permission is revoked mid-session.
- [ ] Privacy manifest / data safety declarations updated to match actual data usage.

## 4. Crash-Free Rate

| Metric | Baseline (previous release) | Target this release |
|---|---|---|
| Crash-free users % | | ≥ ______% |
| Crash-free sessions % | | ≥ ______% |
| ANR rate (Android) | | ≤ ______% |

- [ ] Crash-free rate monitored for at least 24–48 hours in a beta/internal track before wide rollout.
- [ ] Top crash signatures from the previous release triaged and closed or explicitly accepted.

## 5. Staged Store Rollout

| Stage | % of Users | Go / Hold Criteria | Status |
|---|---|---|---|
| Internal | Team only | No new blocker crashes | |
| Staged 1 | 5–10% | Crash-free ≥ target, no new Critical bugs | |
| Staged 2 | 25–50% | Metrics stable vs. Staged 1 | |
| Full | 100% | Metrics stable, support ticket volume normal | |

- [ ] Rollout percentage and hold criteria agreed before submission.
- [ ] Kill-switch/rollback plan for a staged rollout (halt rollout, or force-update older versions if needed).
- [ ] Support briefed with expected rollout timeline for user-facing incident triage.
