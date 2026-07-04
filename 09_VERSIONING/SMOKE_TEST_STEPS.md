# Smoke Test Steps — QA Release Command Center Kit v2.2

A quick, plain-language walkthrough anyone can follow — **no technical background needed**. Its purpose is to confirm the tool actually works on your computer before you rely on it for a real release, or before you hand it off to a buyer/client. This is a companion to `VALIDATION_REPORT_V2_2.md`, which is a more detailed checklist for a tester; this document is the "just try it yourself" version.

Grab a coffee, set aside about 15 minutes, and go through this once from top to bottom.

---

## 1. Open the app

1. Find the folder you extracted from the ZIP.
2. Open the `02_COMMAND_CENTER` folder.
3. Double-click `index.html`.
4. It should open in your web browser (Chrome or Edge work best).

**What you're checking:** the page opens and shows a dashboard with some sample data already in it — you should not see a blank white page or an error message.

## 2. Confirm the dashboard loads

1. Look at the top of the page — you should see a title, and a bar with **Project** and **Release** dropdowns near the top (the filter bar).
2. Look below it — you should see widgets/cards showing numbers (e.g. number of projects, open bugs, critical risks).
3. Look further down — you should see tables (Releases, Risks, Bugs, Sign-Offs, and so on) already filled with sample rows.

**What you're checking:** the page is not empty, nothing looks broken or overlapping, and numbers/tables are visibly populated.

## 3. Add a project and a release

1. Find the **Add Project** area (usually on the left side).
2. Type a project name, e.g. `Smoke Test Project`.
3. Choose any project type from the dropdown.
4. Click **Add Project**. Confirm it now appears in the project list.
5. Find the **Add Release** area, choose your new project, type a version like `1.0.0` and a title like `First Release`, pick a release type, pick a date, and click **Add Release**.
6. Confirm the release now appears in the Releases table.

## 4. Add a risk, a bug, and a sign-off

1. In **Add Risk**, choose your project and (if asked) your release, write any risk text, pick Probability and Impact, write an owner, and click **Add Risk**. Confirm it appears in the Risks table with a calculated Level.
2. In **Add Bug**, choose your project/release, write a bug title, pick Severity and Priority, mark Blocker as needed, write an owner, and click **Add Bug**. Confirm it appears in the Bugs table.
3. In **Add Sign-Off**, choose your project/release, pick a Role, write an owner, pick a status, and click **Add Sign-Off**. Confirm it appears in the Sign-Offs table.

## 5. Try the filters

1. At the top filter bar, open the **Project** dropdown and pick your `Smoke Test Project`.
2. Confirm the dashboard and tables now only show data for that project (the sample project's data should disappear from view, not be deleted).
3. Open the **Release** dropdown and pick your `1.0.0` release. Confirm the view narrows further to just that release.
4. Click **Reset Filters**. Confirm everything comes back (this is "All Projects / All Releases" — the portfolio-wide view).

## 6. Generate a Go/No-Go decision

1. With your `1.0.0` release selected in the filter bar, find the **Go/No-Go Decision** area.
2. Click whatever button calculates/refreshes the decision.
3. Confirm you see a recommendation (Go, Conditional Go, No-Go, or Need More Data), a score, and a short list of reasons.
4. If there's a **Generate Decision Snapshot** button, click it once and confirm it saves without an error (this freezes today's decision for later reference).

## 7. Export and re-import JSON

1. Click **Export JSON**. Confirm a file downloads (check your Downloads folder).
2. Click **Import JSON** and select the file you just downloaded.
3. Confirm it loads as a workspace and you don't get an error message.

## 8. Import the sample Jira CSV

1. Go to the **Jira Import Center** tab.
2. Choose your `Smoke Test Project` as the target project and `1.0.0` as the target release.
3. Upload the file `03_DATA/samples/sample_jira_fixversion_export.csv`.
4. Confirm you see a field-mapping table and a preview of 8 rows.
5. Pick the import mode **"Import Bugs as Bugs + Stories/Tasks as Release Scope"** and click **Import**.
6. Confirm you see a success message, and that new Bugs and scope items now appear in the relevant tables.
7. Check the Risks table — confirm a few new risks were auto-suggested (they should mention Jira issue keys like `ABC-101`).

## 9. Final check — no visible errors anywhere

1. Scroll through the whole page one more time. Nothing should look cut off, overlapping, or show the text "undefined," "NaN," or "[object Object]."
2. If your browser lets you easily check (optional, not required for non-technical users): open Developer Tools (F12) → Console tab, and confirm there are no red error messages.
3. Close the browser tab and reopen `index.html` again. Confirm your `Smoke Test Project`, its release, and the imported Jira data are all still there.

---

If you completed all 9 sections without anything crashing, freezing, or disappearing unexpectedly, the tool has passed its smoke test. For a more rigorous, item-by-item sign-off (useful before a real sale or client handoff), use `09_VERSIONING/VALIDATION_REPORT_V2_2.md`.
