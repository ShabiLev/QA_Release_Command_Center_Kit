# Sample Jira CSV — How to Use It to Test the Jira Import Center

File: `sample_jira_fixversion_export.csv`

This is a realistic (fictional) Jira CSV export, formatted exactly like a real export from Jira's issue search screen. It exists so you can test the app's **Jira Import Center** immediately, without needing your own Jira account or a real project.

## What JQL would have produced this file

```
project = ABC AND fixVersion = "2.4.0" ORDER BY issuetype ASC, priority DESC, status ASC
```

In other words: every issue in fictional project `ABC` targeted at release `2.4.0`, exported from Jira's **Issues → Search** screen using **Export → Export CSV (all fields / current fields)**.

## What's inside the file

8 issues (`ABC-101` through `ABC-108`), all with `Fix Version/s = 2.4.0`, spread across the **Payments**, **Mobile**, and **Backend** components:

| Key | Type | Priority | Status Category | Notes |
|---|---|---|---|---|
| ABC-101 | Bug | Critical | In Progress | Open critical bug — should trigger an auto-suggested risk |
| ABC-102 | Bug | High | Done | Already resolved bug, multi-component field (tests CSV comma-quoting) |
| ABC-103 | Story | Medium | In Progress | Normal scope item |
| ABC-104 | Story | Medium | To Do | **Assignee is empty** — should trigger an auto-suggested "unassigned work" risk |
| ABC-105 | Task | Low | To Do | **Stale**: last updated in March while everything else is from May/June — should trigger an auto-suggested "stale item" risk |
| ABC-106 | Sub-task | Medium | In Progress | Filler item, Mobile component |
| ABC-107 | Sub-task | Low | Done | Filler item, already resolved |
| ABC-108 | Sub-task | Low | To Do | Filler item, Backend component |

The file also demonstrates correct CSV quoting: `ABC-102`'s Components field (`"Backend, Mobile"`) and `ABC-101`'s Labels field (`"billing,customer-reported"`) both contain an internal comma and are wrapped in quotes, so the file stays valid, parseable CSV.

## How to use it to test the Jira Import Center

1. Open the app (`02_COMMAND_CENTER/index.html`) and go to the **Jira Import Center** tab.
2. Select any existing project (or create a test project first), and any release — for example, create a release called `2.4.0` so the mapping feels realistic, though technically you can import against any release.
3. Upload `sample_jira_fixversion_export.csv`.
4. Review the auto-mapped **Field Mapping** table — it should map columns like `Issue key → jiraKey`, `Summary → summary`, `Fix Version/s → fixVersions`, etc. automatically (see the default mapping table in `01_PROJECT_DESCRIPTION/PROJECT_DESCRIPTION_DETAILED.md`).
5. Check the **Preview** — you should see all 8 rows parsed correctly, including the two rows with quoted comma fields.
6. Choose an **Import Mode**:
   - **"Import Bugs as Bugs + Stories/Tasks as Release Scope"** (recommended for this sample) → expect **2 Bugs created** (from `ABC-101`, `ABC-102`) and scope items created from the Stories/Task/Sub-tasks.
   - **"Import Bugs only"** → expect only the 2 Bugs imported.
   - **"Import Scope only"** → expect the 6 non-Bug rows imported as scope, no Bugs created.
   - **"Import all as Jira Issues"** → expect all 8 rows stored as raw Jira issues without generating Bugs or scope items.
7. Click **Import**.
8. Expect the app to auto-generate at least these suggested risks (tagged `source: "jira-auto-risk"`, with the relevant Jira key as evidence):
   - A risk about the **open Critical bug** `ABC-101`.
   - A risk about the **unassigned issue** `ABC-104`.
   - A risk about the **stale unresolved item** `ABC-105`.
9. Review the generated Bugs, scope items, and suggested Risks — they behave exactly like manually-entered data: you can edit, re-triage, or delete any of them.
10. Re-run the import with the same file to confirm duplicate `ABC-1xx` keys in the same release are **skipped by default** (this is configurable to update or import-as-duplicate instead).

## Notes

- This file is intentionally small (8 rows) so results are easy to eyeball and verify manually.
- Dates use a simple `YYYY-MM-DD` format for readability; real Jira exports often use a longer timestamp format (e.g. `03/Jul/26 10:32 AM`) — the importer is expected to handle both.
- No Jira account, login, or API token is needed anywhere in this workflow — this file was generated to *look like* a Jira export; the app never talks to Jira itself.
