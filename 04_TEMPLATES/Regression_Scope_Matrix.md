# Regression Scope Matrix

Use this matrix to define and track what must be regression tested for a release, based on the areas of the product touched by the change set. This is the working document QA uses between code freeze and the Go / No-Go meeting.

## Matrix

| ID | Area | Test Type | Required | Owner | Status | Evidence | Notes |
|---|---|---|---|---|---|---|---|
| REG-1 | *Login* | Smoke | Yes | *QA* | Passed | *Smoke run #45* | |
| REG-2 | *Monthly KPI* | Regression | Yes | *QA* | Passed | *SQL validation sheet* | |
| REG-3 | *Payment* | Regression | Yes | *QA* | Blocked | | *Waiting on BUG-101 fix* |

## Field Definitions

- **Area**: The functional or technical area affected (e.g. Login, Payment, Push Notifications, Reporting).
- **Test Type**: Smoke / Regression / Exploratory / Automated / Manual / Integration.
- **Required**: Yes / No — whether this test is mandatory before the release can be considered ready.
- **Owner**: The person executing or responsible for this test.
- **Status**: Not Started / In Progress / Passed / Failed / Blocked / Skipped.
- **Evidence**: Link to the test run, log, screenshot, or report proving the result.
- **Notes**: Anything blocking execution, partial coverage caveats, or follow-up actions.

## How to Scope Regression

1. Pull the change list (tickets, commits, or diff) for the release.
2. For each changed component, list the Area(s) it touches or could indirectly affect.
3. For each Area, decide the minimum Test Type required based on risk (a payment change always warrants full Regression, not just Smoke).
4. Mark Required = Yes for anything customer-facing, revenue-related, or previously fragile (check past incidents).
5. Assign an Owner and a target completion date before code freeze + N days.
6. Track Status daily; escalate any "Blocked" or "Failed" row to the Risk Register if it threatens the release date.

## Completion Checklist

- [ ] Every changed area has at least one corresponding row.
- [ ] All rows marked Required = Yes have Owner and Evidence before Go / No-Go.
- [ ] No row remains "In Progress" without an ETA.
- [ ] Failed/Blocked rows are cross-referenced in the Risk Register or Bug Triage Matrix.
- [ ] Overall pass rate calculated and reported: ______%
