# Privacy & Data Storage — QA Release Command Center Kit (v2.2)

This document explains, in plain language, where your data lives, who can see it, and what you need to do to keep it safe. It applies to the local web app in `02_COMMAND_CENTER/`.

---

## 1. Where your data is stored

- All workspace data (projects, releases, risks, bugs, regression items, sign-offs, production checks, post-release items, Jira issues, decision snapshots) is stored **locally in your browser**, using **IndexedDB**.
- A small amount of lightweight preference data (e.g. last selected language, last selected theme) may use **localStorage** as a fallback.
- There is **no server, no cloud database, and no backend** of any kind. The app is a static HTML/CSS/JS page that runs entirely inside your browser tab.

## 2. What leaves your computer

**Nothing, unless you explicitly export it.**

- The app makes no network calls to any external server. It does not "phone home."
- There is no analytics, no telemetry, no crash reporting, and no usage tracking of any kind.
- Opening `index.html` does not require, and does not use, an internet connection.

The only way data leaves your machine is when **you** click an export action (Export JSON, Export CSV, Export Markdown) and choose where to save the resulting file, or when you manually copy/paste content elsewhere.

## 3. Jira CSV data

- Jira Import Center only reads a **CSV file you choose from your own computer**. The app never connects to Jira, never calls any Jira API, and never collects, stores, or transmits a Jira username, password, or API token — because this version has no such connection at all.
- Once a Jira CSV is imported, the resulting Jira issues, generated bugs/scope items, and auto-suggested risks are stored in the same local IndexedDB workspace as everything else. They are treated like any other workspace data: local-only, exportable, and deletable.
- The original CSV file itself is not retained by the app after import — only the parsed data you chose to import is saved into the workspace.

## 4. Backups are your responsibility

Because everything lives in the browser:

- **Clearing your browser's site data/cache**, resetting the browser profile, uninstalling the browser, or wiping the computer **can permanently delete your workspace**.
- The kit does not sync across devices or browsers. A workspace created in Chrome will not automatically appear in Edge or on another computer.
- **Recommended practice**: click **Export JSON** regularly (e.g. after every significant work session, and always before a Go/No-Go meeting) and store the file somewhere durable — a shared drive, cloud storage folder, or backup system your organization already uses.
- **Import JSON** loads a backup as a new, separate workspace, so restoring a backup never overwrites or risks your current data.

## 5. Multi-user / team use

- This is a **single-browser, single-machine tool** — there is no built-in multi-user sync or shared server state.
- If a team wants to share one workspace, the practical approach is: one owner maintains the live workspace, exports JSON regularly, and shares that JSON file (or the exported CSV/Markdown reports) with the rest of the team through whatever channel your organization already uses (email, shared drive, chat tool).
- There is no built-in access control, since there is no account system and no server. Anyone with access to the browser profile, or to an exported file, can see the data inside it.

## 6. Data validation and safety (technical summary)

- JSON files loaded via **Import JSON** are validated before being applied: malformed files are rejected with a friendly error message, unexpected/dangerous keys are stripped, and the workspace is automatically upgraded to the current data structure (see `migrateWorkspaceIfNeeded()` — no manual steps needed on your part).
- CSV files loaded via **Jira Import Center** are validated row by row; problem rows produce warnings shown in the UI rather than crashing the import.
- All text you type in, and all text imported from CSV, is HTML-escaped before being displayed in the app, to prevent it from being rendered as active HTML/script content.

## 7. Summary

| Question | Answer |
|---|---|
| Is my data sent to a cloud server? | No |
| Is there tracking or analytics? | No |
| Does Jira import need an account or API token? | No — CSV export/import only |
| Can I lose my data? | Yes, if browser data is cleared without a JSON backup |
| Who can see my exported files? | Anyone you choose to share them with — you control this entirely |
