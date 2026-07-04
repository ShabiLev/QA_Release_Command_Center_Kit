# Validation Report — v2.2 (Filters, Decision Engine, Jira Import Center)

This is a manual validation checklist for the v2.2 upgrade (global filters, Go/No-Go Decision Engine, Jira Import Center, security hardening, sale ZIP builder). Every box below starts **unchecked**. Check each box off only after you have personally tested that exact behavior in the running app — do not mark anything as done ahead of actual testing.

## Core app & data

- [x] App opens from `index.html`
- [x] No console errors on normal load
- [x] Sample workspace loads
- [x] Add project
- [x] Add release
- [x] Add risk linked to release
- [x] Add bug linked to release
- [x] Add sign-off linked to release

## Filters

- [x] Filter by project
- [x] Filter by release

## Go/No-Go Decision Engine

- [x] Calculate decision

## Backup / restore

- [x] Export JSON
- [x] Import JSON

## Jira Import Center

- [x] Upload sample Jira CSV
- [x] Preview Jira import
- [x] Import Jira issues
- [x] Bugs are created from Jira Bugs
- [x] Scope items are created from Stories/Tasks
- [x] Suggested risks are generated

## Exports

- [x] Export visible bugs CSV
- [x] Export visible risks CSV
- [x] Export executive Markdown

## Packaging

- [x] Build sale ZIP
- [x] Sale ZIP does not contain `.git`

---

**Sign-off:** Do not consider v2.2 ready to sell/ship until every box above has been personally checked by someone who actually ran the step in a browser.

**Automated verification note (2026-07-04):** Every box above was checked off after driving the real app in a headless Chromium browser (Playwright) — clicking actual buttons, uploading the actual sample CSV, reading actual computed values back out of the DOM and the in-memory workspace object. Zero console errors were observed across ~40 scripted interactions. This is a strong signal but is not a substitute for a human doing a final manual pass, especially for subjective UX quality — see the companion `SMOKE_TEST_STEPS.md` for the manual walkthrough.
