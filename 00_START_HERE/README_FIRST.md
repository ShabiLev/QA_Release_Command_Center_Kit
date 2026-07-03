# Start Here — QA Release Command Center Kit

Welcome. This kit gives you a working local app plus a full library of templates, AI prompts, and marketing assets for running structured release readiness reviews.

## 1. Open the app
1. Extract the ZIP anywhere on your computer.
2. Open `02_COMMAND_CENTER/index.html` in Chrome or Edge (double-click it).
3. The app opens with a **Sample QA Workspace** already loaded so you can explore it immediately — no setup, no account, no internet connection required.
4. Everything you do is saved automatically in your browser (IndexedDB). Nothing is sent anywhere.

## 2. What's in the box
| Folder | What it's for |
|---|---|
| `00_START_HERE/` | This guide and the step-by-step beginner walkthroughs (English + Hebrew). |
| `01_PROJECT_DESCRIPTION/` | Full description of the product, its data model, and its scope. |
| `02_COMMAND_CENTER/` | The app itself — `index.html`, `app.js`, `styles.css`. Open `index.html` to run it. |
| `03_DATA/samples/` | The sample workspace and a sample tracker spreadsheet, matching the app's data model. |
| `04_TEMPLATES/` | Editable Markdown templates: release readiness, Go/No-Go, risk register, bug triage, regression scope, production readiness, post-release retro, plus specialized templates for Mobile, API/Backend, Data/SQL, and AI/Agent releases. |
| `05_AI_PROMPTS/` | Ready-to-paste AI prompts for risk analysis, bug triage, regression scoping, sign-off summaries, and retrospectives. Works with Claude or any capable LLM. |
| `06_MARKETING/` | Sales page copy, LinkedIn post, Hebrew marketing copy, and marketing images — for anyone reselling or repackaging this kit. |
| `09_VERSIONING/` | Validation reports confirming the package is complete. |
| `10_GUIDES_AND_EXPORTS/` | The full Word/PDF user guide, and two versions of the Excel tracker: `v1` is a standalone 8-sheet Excel tracker (Lists, Dashboard, Release Readiness, Risk Register, Bug Triage, Regression Scope, Deployment, Post-Release) for teams who prefer Excel over the web app; `v2` (in `03_DATA/samples/`) is a lighter export shaped to match the web app's data model (Projects, Risks, Bugs, Releases). |

## 3. Recommended first steps
1. In the app, click **New Workspace** to create your own workspace (the sample data stays untouched and selectable from the workspace dropdown).
2. Add your first project, then add a release.
3. Log any known risks, bugs, regression items, production readiness checks, and required sign-offs.
4. Hover over any field, button, or column header in the app — a tooltip explains what it is and how to use it.
   Click the language button next to the app title (top-left) to switch the whole interface between English and Hebrew. The layout stays left-to-right in both languages — only the text changes. Data you've already entered (project names, notes) is never translated or altered; only interface labels and dropdown option text change, and dropdown values are stored the same way regardless of the display language.
5. Before a Go/No-Go meeting, click **Save Snapshot**, and export the risks/bugs/regression/production CSVs to share with stakeholders.
6. Export JSON regularly as a backup — browser storage can be cleared by the user or the OS.

## 4. Using the templates and prompts
- Open any file in `04_TEMPLATES/` in your editor of choice (Word, Notion, Obsidian, or a plain text editor) and fill it in per release.
- Open any file in `05_AI_PROMPTS/` and copy a prompt into Claude (or another LLM), pasting your own bug/risk/release data where indicated, to get a first-draft analysis or summary.

## 5. Support
This is a self-contained, offline-first digital product. There is no backend and no telemetry — your data never leaves your browser unless you explicitly export it.
