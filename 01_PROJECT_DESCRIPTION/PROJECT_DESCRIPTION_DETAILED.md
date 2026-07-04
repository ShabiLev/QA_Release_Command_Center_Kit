# PROJECT DESCRIPTION DETAILED

## Project identity
- Project Name: QA Release Command Center Kit
- Version: 2.2
- Positioning: **Offline QA Release Readiness Command Center with Jira CSV Import**
- Owner Persona: QA Manager / QA Lead / Release Manager / Product Manager
- Product Type: Digital product bundle + local command center web application
- Main Goal: Help software teams manage release readiness in a structured, auditable, modular, multi-project way — including turning existing Jira export data into structured release-readiness signal, without any live Jira connection.

This version should always be described as **"Offline QA Release Readiness Command Center with Jira CSV Import."** It must never be described as real-time Jira sync, a Jira API integration, an Atlassian Marketplace app, or an enterprise Jira connector — none of that exists in this version.

## Why this project exists
The market has many static release templates and many heavy test management tools, but very few practical products in the middle. This project fills that gap by giving teams an immediately usable release operating system without requiring a complex enterprise implementation.

## Core problem statements
1. Release decisions are often based on scattered updates and verbal status.
2. Bugs, risks, regression progress, deployment readiness, and sign-offs are not aggregated in one place.
3. Teams need a lightweight but serious command center that works across multiple projects and multiple releases per project, with the ability to instantly narrow the view to "just this release."
4. Teams already track a lot of this information in Jira, but exporting it once (CSV) and folding it into a structured readiness view is far more practical for most teams than standing up a full enterprise integration.
5. Go/No-Go calls are too often a gut-feel conversation instead of a consistent, explainable, auditable calculation.
6. Buyers need a digital product that is simple enough to adopt but rich enough to feel premium.

## Target users
- QA Managers
- QA Team Leads
- Release Managers
- Product Managers
- Startup CTOs and founders
- QA Consultants
- Teams running web, mobile, API, data/reporting, or AI-based products
- Teams already using Jira who want a lightweight, local readiness layer on top of their existing export capability, without adopting a heavier enterprise tool

## Full folder structure
```
00_START_HERE/
    README_FIRST.md
    HOWTO_BEGINNERS_STEP_BY_STEP_EN.md
    HOWTO_BEGINNERS_STEP_BY_STEP_HE.md
01_PROJECT_DESCRIPTION/
    PROJECT_DESCRIPTION_DETAILED.md   (this file)
02_COMMAND_CENTER/
    index.html
    app.js
    decision-engine.js
    jira-import.js
    styles.css
03_DATA/
    samples/
        sample_workspace.json
        sample_jira_fixversion_export.csv
        README_JIRA_SAMPLE_IMPORT.md
        QA_Release_Command_Center_Tracker_v2.xlsx
04_TEMPLATES/
    README.md
    Release_Readiness_Checklist.md
    Go_No_Go_Template.md
    Risk_Register_Template.md
    Bug_Triage_Matrix.md
    Regression_Scope_Matrix.md
    Production_Readiness_Checklist.md
    Post_Release_Retrospective.md
    Specialized/
        Mobile_Release_Template.md
        API_Backend_Release_Template.md
        Data_SQL_Release_Template.md
        AI_Agent_Release_Template.md
05_AI_PROMPTS/
    README.md
    Release_Risk_Analysis_Prompts.md
    Bug_Triage_Prompts.md
    Regression_Scope_Prompts.md
    SignOff_Summary_Prompts.md
    Post_Release_Retro_Prompts.md
06_MARKETING/
    README_MARKETING_HE.md
    Copy/
        Product_Description.md
        Gumroad_Product_Page_Copy.md
        LinkedIn_Launch_Post.md
        Hebrew_Marketing_Copy.md
        Image_Captions_and_CTA.md
    Images/
        01_Hero_Square.png
        02_Command_Center_Banner.png
        03_Features_Square.png
        04_Social_Poster.png
07_EXPORT_EXAMPLES/
    (sample CSV / Markdown exports produced by the app — executive summary, risk/bug CSVs — included so a buyer can preview real output format before entering their own data)
08_DOCS/
    Privacy_And_Data_Storage.md
    License_And_Usage_Terms.md
09_VERSIONING/
    VALIDATION_REPORT.md
    VALIDATION_REPORT_V2_1_FULL.md
    VALIDATION_REPORT_V2_2_FULL.md
    VALIDATION_REPORT_V2_2.md
    SMOKE_TEST_STEPS.md
10_GUIDES_AND_EXPORTS/
    QA_Release_Readiness_Kit_Master_Guide.pdf / .docx
    Hebrew_QA_Release_Readiness_Kit_User_Guide.pdf / .docx
    QA_Release_Command_Center_Tracker_v1.xlsx
scripts/
    build_sale_zip.py
```

`07_EXPORT_EXAMPLES/` and `08_DOCS/` are new in v2.2. `07_EXPORT_EXAMPLES/` exists purely so a prospective buyer (or a new team member) can see what the app's CSV/Markdown exports actually look like before they've entered any real data. `08_DOCS/` centralizes the two policy documents (privacy/data storage, license/usage terms) that used to be implied informally across the README and HOWTO files.

## Technical architecture
### Front-end
- HTML, CSS, JavaScript — **zero build step**, no bundler, no package manager, no framework dependency.
- Local single-page application in `02_COMMAND_CENTER/index.html`.
- Logic is split across three script files, loaded directly by `index.html`:
  - `app.js` — core app: workspace/project/release CRUD, widgets, tables, CSV/Markdown export, the global filter bar, and the `migrateWorkspaceIfNeeded()` schema migration.
  - `decision-engine.js` — the Go/No-Go Decision Engine: computes recommendation/score/reasons/required actions for a selected release, and generates decision snapshots.
  - `jira-import.js` — the Jira Import Center: CSV parsing, field-mapping, preview, import modes, duplicate handling, and Jira-pattern-based auto-risk suggestions.
- Modular widgets using configurable layout cards, unchanged in spirit from v2.1/v2.2 FULL (edit/delete everywhere, tooltips, resizable/colorable widgets, language toggle).

### Data layer
- IndexedDB for primary local persistence.
- Fallback localStorage for lightweight preferences (theme, language).
- JSON import/export for backup and portability, now with pre-load validation (see "Security Decisions" below).
- CSV export for selected tables, and CSV import for Jira data (see "Jira Import Center" below).
- Markdown export for an executive summary, suitable for pasting into a release readiness doc or email.

### Product content layer
- Markdown templates grouped by operational domain.
- Example workspace, example Jira CSV export, and example generated exports.
- Implementation and product strategy documentation.

## Data model summary

### Workspace
- `name`
- `createdAt`
- `updatedAt`
- `settings`
- `schemaVersion` — currently `"2.2"`; used by `migrateWorkspaceIfNeeded()` to detect and upgrade older workspace files automatically on load.
- `projects[]`
- `decisionSnapshots[]` — **new in v2.2**. A flat array of frozen Go/No-Go decisions, not nested under a project or release, so the full audit history can be listed/filtered across the whole workspace.

### Project
- `id`
- `name`
- `type`
- `owner`
- `status`
- `releases[]`
- `risks[]`
- `bugs[]`
- `regressionItems[]`
- `signOffs[]`
- `productionChecks[]`
- `postReleaseItems[]`
- `jiraIssues[]` — **new in v2.2**. Raw imported Jira rows scoped to this project (see Jira Import Center below).

### Release
- `id`
- `version`
- `title`
- `releaseType`
- `targetDate`
- `actualDate`
- `qaOwner`
- `productOwner`
- `rdOwner`
- `supportOwner`
- `environment`
- `health`
- `decision`
- `notes`

### Common fields added in v2.2 to every item type
Every item in `risks[]`, `bugs[]`, `regressionItems[]`, `signOffs[]`, `productionChecks[]`, `postReleaseItems[]`, and `jiraIssues[]` now carries, in addition to its existing type-specific fields:
- `projectId`
- `releaseId` — items without a release are displayed with the label **"Unassigned Release"** rather than being hidden or erroring; this is a deliberate design choice so older data (created before releases existed, or intentionally cross-release items like a portfolio-level risk) is never lost or invisible.
- `createdAt`
- `updatedAt`

### JiraIssue (new entity, v2.2)
- `id`
- `jiraKey` (e.g. `ABC-101`)
- `projectId`
- `releaseId`
- `summary`
- `issueType`
- `status`
- `statusCategory`
- `priority`
- `assignee`
- `reporter`
- `fixVersions`
- `components`
- `labels`
- `created`
- `updated`
- `resolved`
- `resolution`
- `parent`
- `epicLink`
- `sprint`
- `source` — e.g. `"jira-csv-import"`
- `createdAt`
- `updatedAt`

### DecisionSnapshot (new entity, v2.2)
- `id`
- `projectId`
- `releaseId`
- `createdAt`
- `recommendation` — `Go` / `Conditional Go` / `No-Go` / `Need More Data`
- `score` — 0-100
- `reasons[]`
- `requiredActions[]`
- `metrics` — the underlying counts used to compute the recommendation (open blockers, critical bugs, critical risks, regression pass rate, sign-off status, production readiness status), frozen at the moment the snapshot was generated

### Auto-generated Risk (v2.2 addition to the existing Risk shape)
Risks generated automatically by the Jira Import Center carry two extra descriptive fields on top of the normal Risk shape (`title`, `probability`, `impact`, `level`, `owner`, `decision`, `status`, `evidence`, plus the common `projectId`/`releaseId`/`createdAt`/`updatedAt` fields above):
- `source: "jira-auto-risk"`
- `evidence` populated with the relevant Jira key(s) (e.g. `"ABC-101"`), so the origin of the suggestion is always traceable.
They are otherwise completely normal risks — reviewable, editable, and deletable exactly like a manually-entered risk.

## Product modules
1. Command Center Dashboard
2. Portfolio View
3. Project View
4. Release View
5. Risk Center
6. Bug Center
7. Regression Center
8. Sign-Off Center
9. Production Readiness Center
10. Post-Release Review
11. **Global Filter Bar** (new in v2.2)
12. **Go/No-Go Decision Engine** (new in v2.2)
13. **Jira Import Center** (new in v2.2)
14. Settings & Widget Customization

## Global Filters (new in v2.2)
A filter bar sits at the top of the dashboard, above the widgets, with:
- A **Project** dropdown (default: "All Projects").
- A **Release** dropdown, scoped to the selected project once one is chosen (default: "All Releases").
- A **Reset Filters** button that returns both to "All."

Behavior:
- Selecting "All Projects" / "All Releases" shows portfolio-wide data — this is the default state on load.
- Every widget, every table (Risks, Bugs, Regression, Sign-Offs, Production, Post-Release, Jira Issues), and every CSV/Markdown export respects the current filter selection. If you filter to a specific release and click "Export Bugs CSV," you get only that release's bugs.
- Filters are **session-only** (see "Known limitations" below) — they reset to "All" on page reload; they are a viewing convenience, not a saved workspace setting.

## Go/No-Go Decision Engine (new in v2.2)
For a specific selected release, the engine calculates:
- A **recommendation**: `Go`, `Conditional Go`, `No-Go`, or `Need More Data`.
- A **score** from 0-100.
- A list of **reasons** explaining the recommendation.
- A list of **required actions** needed to improve the recommendation.

Rules (paraphrased; see `02_COMMAND_CENTER/decision-engine.js` for the exact implementation):
- **No-Go** if any of: an open blocker or Critical-severity bug exists; an open Critical-level risk exists; a required regression item failed; a required production check failed; a sign-off was rejected; rollback readiness failed.
- **Conditional Go** if none of the No-Go conditions apply, but any of: open High-level risks exist; High-severity bugs exist; required sign-offs are still pending; required production checks are incomplete (not failed, just not done); evidence is missing on important checks.
- **Need More Data** if no release is selected, or there is no regression, sign-off, or production-readiness data at all to judge from.
- **Go** only if: no open blocker/critical bugs, no open critical risks, required regression has passed, required production checks are ready, and required sign-offs are approved.

**Generate Decision Snapshot**: a button that freezes the current decision — recommendation, score, reasons, required actions, and the metrics behind them — into `workspace.decisionSnapshots[]`. This is designed to be used right before a release meeting, so there's a permanent, timestamped, auditable record of "what did the tool say, and why, at that moment" — independent of what the live data looks like later.

## Jira Import Center (new in v2.2)

### Positioning
CSV-only import. **There is no Jira API connection in this version, and no API token, username, or password is ever collected, requested, or stored.** The workflow is entirely: export from Jira → upload the file → review → import.

### Workflow
1. User runs a JQL search inside Jira (e.g. `project = ABC AND fixVersion = "2.4.0"`).
2. User exports the search results to CSV from Jira's own export feature.
3. In the app, the user opens the **Jira Import Center** tab.
4. Selects the target **Project**.
5. Selects the target **Release**.
6. Uploads the CSV file.
7. Reviews an auto-mapped **Field Mapping** table (editable — the user can remap any column if their Jira export uses custom field names).
8. Reviews a **Preview** of the parsed rows before committing to anything.
9. Chooses an **Import Mode**.
10. Clicks **Import**.

### Import Modes
- **Import all as Jira Issues** — every row becomes a `JiraIssue` record; no Bugs or scope items are generated.
- **Import Bugs as Bugs + Stories/Tasks as Release Scope** — rows with Issue Type = Bug become Bug records; Stories/Tasks (and similar non-bug types) become release scope/regression-relevant items.
- **Import Bugs only** — only Bug-type rows are imported.
- **Import Scope only** — only non-Bug rows are imported, as scope items.

### Duplicate handling
Duplicate Jira keys within the same release are **skipped by default**. This is configurable per import to instead: skip, update the existing record, or import as a duplicate (a separate record).

### Default CSV column mapping
| Jira CSV column | Internal field |
|---|---|
| Key / Issue key | `jiraKey` |
| Summary | `summary` |
| Issue Type | `issueType` |
| Status | `status` |
| Status Category | `statusCategory` |
| Priority | `priority` |
| Assignee | `assignee` |
| Reporter | `reporter` |
| Fix Version/s | `fixVersions` |
| Components | `components` |
| Labels | `labels` |
| Created | `created` |
| Updated | `updated` |
| Resolved | `resolved` |
| Resolution | `resolution` |
| Parent | `parent` |
| Epic Link | `epicLink` |
| Sprint | `sprint` |

### Auto-generated risks
After import, the app can auto-generate suggested Risks by scanning patterns in the imported issues, such as:
- An open Critical-priority bug.
- Many unassigned issues.
- Stale unresolved issues (long time since last update, still not Done).
- Component concentration (an unusually large share of open issues in one component).
- A large unresolved FixVersion scope relative to time remaining.

These risks are tagged `source: "jira-auto-risk"`, carry the relevant Jira key(s) as `evidence`, and are safe to review, edit, or delete exactly like any manually-entered risk — they are suggestions, not authoritative conclusions.

## Widget model
Widgets are configuration-driven cards. Each widget supports:
- Visibility toggle
- Size: small / medium / large / full
- Color theme
- Order / arrangement
- Scoped data source (workspace, project, release) — and now also respects the active global filter selection

## Key product differentiators
- Lightweight compared to enterprise tools.
- More decision-oriented than static templates — it produces an actual Go/No-Go recommendation with reasons, not just a checklist.
- Strong QA Manager focus.
- Supports web, mobile, API, data/SQL, and AI/agent release use cases.
- Includes detailed prompts and specialized readiness checklists.
- Designed for local ownership and privacy, not cloud lock-in.
- Bridges the gap between "we track everything in Jira" and "we need a readiness view" without requiring an enterprise Jira integration — a single CSV export does the job.

## Security Decisions (v2.2)
- **CSV-only Jira import.** No Jira API connection exists in this version. No API token, username, or password is ever requested, collected, transmitted, or stored.
- **JSON import validation.** Files loaded via Import JSON are validated before being applied: malformed/corrupt files are rejected with a friendly error instead of crashing the app; unexpected or dangerous keys are stripped from the parsed object before it's merged into a workspace; `migrateWorkspaceIfNeeded()` runs automatically to bring older schema versions up to `2.2` without any manual user action.
- **CSV import validation.** Rows that fail to parse or are missing required columns produce visible warnings in the UI rather than crashing the import; valid rows still import.
- **Output escaping.** All user-entered text and all CSV-imported text is HTML-escaped before being rendered in the DOM, to prevent it from being interpreted as active markup.
- **No secrets anywhere.** No API keys, tokens, passwords, or credentials of any kind are stored in this version — there is nothing to authenticate against, since Jira interaction is limited to reading a file the user already has on disk.

## Functional requirements
### Mandatory
- Create, edit, and delete projects.
- Create, edit, and delete releases per project.
- Track risks, bugs, regression items, sign-offs, and deployment checks, each with project/release association and timestamps.
- Persist data locally.
- Export workspace as JSON; import workspace from JSON with validation.
- Export key tables as CSV, respecting active filters.
- Export an executive Markdown summary, respecting active filters.
- Customize dashboard widgets.
- Support more than one project in one workspace, and more than one release per project.
- Filter the entire dashboard by Project and/or Release.
- Calculate a Go/No-Go recommendation for a selected release.
- Import Jira CSV exports, map fields, preview, and commit an import under a chosen Import Mode.

### High-value requirements
- Auto-compute release health indicators.
- Generate a decision summary with reasons and required actions.
- Save decision snapshots before Go/No-Go meetings, building an audit trail over time.
- Support a sample dataset for demo use, including a sample Jira CSV export.
- Auto-suggest risks from Jira import patterns.

## Non-functional requirements
- Simple enough for first-time buyers.
- Professional visual design.
- Offline-friendly; zero external network calls.
- No backend dependency; no build step.
- Readable documentation, in English and Hebrew where applicable.
- Clear file structure.
- Defensive against malformed JSON/CSV input.

## Known limitations
1. **No real-time Jira sync.** Jira data is only as current as the last CSV export a user manually imports. There is no polling, webhook, or live connection.
2. **Single-CSV-at-a-time import.** The Jira Import Center processes one uploaded CSV file per import action; there is no batch/multi-file upload in this version.
3. **Session-only filters.** The Project/Release filter selection is not persisted across page reloads; it always resets to "All Projects / All Releases" on load.
4. **Single-browser, single-machine storage.** No cross-device sync; see `08_DOCS/Privacy_And_Data_Storage.md`.
5. **No multi-user concurrency.** There is no locking or merge logic if two people edit the same exported JSON independently; the last import wins.
6. **Decision Engine is advisory.** It reflects the data entered into the workspace; it cannot detect risks or issues that were never logged.

## Roadmap
- Attachments/evidence file storage.
- TestRail / Xray import wizard (in the same spirit as the Jira CSV importer).
- PDF report generator.
- Confluence export.
- Role-based views.
- Persisted (not session-only) filter preferences.
- **Distant-future "Pro" idea only — not part of this version, not committed, purely roadmap speculation:** a Tauri + SQLite desktop build with a real Jira API sync (live, authenticated, token-based connection instead of manual CSV export/import). This would be a materially different product tier and is not implied or promised by anything in this v2.2 release.

## How to restore/run the project
1. Extract the ZIP anywhere on disk.
2. Open `02_COMMAND_CENTER/index.html` directly in Chrome or Edge — no server, no build step, no installation required.
3. The app loads a sample workspace automatically on first run.
4. To reconstruct the project from source control or a backup: ensure the folder structure above is intact, especially `02_COMMAND_CENTER/index.html` + `app.js` + `decision-engine.js` + `jira-import.js` + `styles.css` together (all four script/style files must sit alongside `index.html`, since it loads them via relative `<script>`/`<link>` tags).
5. Sample data lives in `03_DATA/samples/` — `sample_workspace.json` for a full workspace, `sample_jira_fixversion_export.csv` for testing the Jira Import Center (see `03_DATA/samples/README_JIRA_SAMPLE_IMPORT.md`).

## How to build the sale ZIP
Run, from the project root:
```
python scripts/build_sale_zip.py
```
This script produces a clean distributable ZIP that:
- Excludes `.git` and any version-control metadata.
- Excludes IDE folders (e.g. `.idea/`, `.vscode/`).
- Excludes log files and any local build artifacts.
- Excludes any credentials or `.env`-style files, should any exist locally during development.
- Writes a build report summarizing what was included/excluded and the resulting ZIP's contents, so you can visually confirm nothing unwanted was packaged before uploading it to a storefront.

## What changed in v2.2 — summary
- **Data model**: `risks`, `bugs`, `regressionItems`, `signOffs`, `productionChecks`, `postReleaseItems`, and the new `jiraIssues` all gained `projectId`, `releaseId`, `createdAt`, `updatedAt`. Items without a release show as "Unassigned Release" instead of disappearing. `workspace.decisionSnapshots[]` was added. `migrateWorkspaceIfNeeded()` upgrades old workspace files automatically and losslessly on load.
- **Global filters**: a new Project/Release filter bar controls every widget, table, and export across the whole dashboard.
- **Go/No-Go Decision Engine**: a new rules-based calculator producing a recommendation, score, reasons, and required actions for a selected release, with a snapshot/audit-history feature.
- **Jira Import Center**: a brand-new tab for CSV-only Jira import — field mapping, preview, four import modes, duplicate handling, and auto-suggested risks from Jira data patterns.
- **Security hardening**: JSON import validation and key-stripping, CSV import validation with warnings, HTML-escaping of all displayed user/CSV text, and a documented no-secrets-stored posture.
- **Sale packaging**: a new `scripts/build_sale_zip.py` for producing a clean, credential-free distributable ZIP with a build report.
- **New documentation**: `08_DOCS/Privacy_And_Data_Storage.md`, `08_DOCS/License_And_Usage_Terms.md`, `09_VERSIONING/VALIDATION_REPORT_V2_2.md`, `09_VERSIONING/SMOKE_TEST_STEPS.md`, and the Jira sample CSV + its README under `03_DATA/samples/`.
- The app's front-end logic split from a single `app.js` into `app.js` + `decision-engine.js` + `jira-import.js`, still with zero build step.

## Packaging requirements
- ZIP distributable, built via `python scripts/build_sale_zip.py`.
- Must include a detailed project description file (this file).
- Must include start guide.
- Must include marketing assets.
- Must include templates and command center.
- Must include the new `07_EXPORT_EXAMPLES/` and `08_DOCS/` folders.
- Must exclude `.git`, IDE folders, logs, and credentials.

## Validation checklist for this project itself
- Folder structure complete, including `07_EXPORT_EXAMPLES/` and `08_DOCS/`.
- Main HTML command center present, with all three script files (`app.js`, `decision-engine.js`, `jira-import.js`).
- Sample workspace present.
- Sample Jira CSV export present, with its own README.
- Template library present.
- Prompt library present.
- Marketing copy present.
- Versioning files present, including `VALIDATION_REPORT_V2_2.md` and `SMOKE_TEST_STEPS.md`.
- ZIP package generated via `scripts/build_sale_zip.py`, confirmed free of `.git` and credentials.
