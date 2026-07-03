# Beginner HOWTO — QA Release Command Center Kit v2.2 FULL

This guide is for someone with no prior experience selling a digital product, running a local Command Center, or opening a local HTML tool.

---

## 0. What's new in v2.2

- **Full edit and delete**: every Release, Risk, Bug, Sign-Off, Regression item, Production check, and Post-Release item now has Edit and Delete actions, not just Add. Status can be updated directly from a dropdown in each table row.
- **Three new modules**: Regression Center, Production Readiness Center, and Post-Release Review — each with its own add form and table.
- **Multiple workspaces**: create separate workspaces and switch between them from a dropdown in the sidebar without losing data.
- **Tooltips everywhere**: hover over any field, button, or column header to see what it is and how to use it.
- **English / Hebrew language toggle**: click the language button next to the app title to switch the whole UI between English and Hebrew. Hebrew mode switches the entire layout to right-to-left (sidebar, tables, and text all mirror accordingly); your own data (project names, notes, etc.) is never translated.
- **Sample data loads instantly**: no internet connection or file access needed — opening the file for the first time loads a sample workspace immediately.
- **Safer import**: importing a JSON file creates a new, separate workspace instead of overwriting the one you're working on.

---

## 1. What's in the package

The package has three main parts:

1. **Local Command Center system**
   - An HTML file that opens in your browser.
   - Manages projects, releases, risks, bugs, regression items, production readiness checks, post-release reviews, and sign-offs.
   - Saves data locally in the browser using IndexedDB.
   - Supports JSON export/import and CSV export.

2. **QA / Release template library** (`04_TEMPLATES/`)
   - Release Readiness Checklist
   - Go / No-Go Template
   - Risk Register Template
   - Bug Triage Matrix
   - Regression Scope Matrix
   - Production Readiness Checklist
   - Post-Release Retrospective
   - Specialized templates for Mobile, API/Backend, Data/SQL, and AI/Agent projects (`04_TEMPLATES/Specialized/`)

3. **Marketing folder** (`06_MARKETING/`)
   - Sales page copy, LinkedIn post, Hebrew marketing copy, marketing images, captions and CTAs.

---

## 2. Opening the project for the first time

After downloading the ZIP:

1. Right-click the file.
2. Choose **Extract All**.
3. Open the extracted folder.
4. Go into:

```text
02_COMMAND_CENTER/
```

5. Double-click:

```text
index.html
```

6. The file opens in your browser.

Chrome or Edge is recommended. A sample workspace loads automatically — you don't need to do anything else to start exploring.

---

## 3. Working with the Command Center

When the Command Center opens, you'll see:

- A workspace switcher and workspace name.
- A project list.
- A dashboard with widgets.
- Tables for Releases, Risks, Bugs, Sign-Offs, Regression, Production Readiness, and Post-Release.
- Save / Export / Import buttons.

### Step 1 — Set up your workspace

You can explore the sample workspace as-is, or start your own:

1. Click **New Workspace** in the sidebar, and give it a name, e.g. `Company QA Releases`. This creates a separate workspace — the sample data stays available from the workspace dropdown.
2. Click **Save Workspace** any time you rename it.

### Step 2 — Create a new project

1. On the left, under **Projects**, type a project name.
2. Choose a project type: Web, Mobile, API, Data/SQL, or AI/Agent.
3. Click **Add Project**.

Example:
```text
Project Name: Mobile App
Project Type: Mobile
```

Once created, use **Edit** on the project card to update its name, owner, or status, or **Delete** to remove it entirely (this also deletes everything inside it, so use it carefully).

### Step 3 — Add a release

1. Under **Releases**, choose a project.
2. Enter a version number, e.g. `3.8.0`.
3. Enter a release title, e.g. `Login and Payment Improvements`.
4. Choose a release type: Major / Minor / Patch / Hotfix / Emergency / Beta.
5. Choose a target date.
6. Click **Add Release**.
7. From the table, change **Health** (Green/Yellow/Red) and **Decision** (Go/Conditional Go/No Go/Need More Data) any time as the release progresses. Use **Edit** to update the version, title, or notes; **Delete** to remove it.

### Step 4 — Add a risk

1. Under **Add Risk**, choose a project.
2. Write a clear risk, e.g. `Payment confirmation may fail on retry`.
3. Choose Probability: Low / Medium / High.
4. Choose Impact: Low / Medium / High.
5. Write an Owner.
6. Click **Add Risk**.

The system computes a risk level automatically:
- High + High = Critical
- High + Medium or Medium + High = High
- Low + Low = Low
- Everything else = Medium

Update Probability, Impact, or Status directly from the table as the risk evolves — the Level recalculates automatically.

### Step 5 — Add a bug

1. Under **Add Bug**, choose a project.
2. Write a bug title.
3. Choose Severity: Low / Medium / High / Critical.
4. Choose Priority: P4 / P3 / P2 / P1 / P0.
5. Choose whether it's a Blocker: Yes / No.
6. Write an Owner.
7. Click **Add Bug**.
8. Update Status (Open / In Progress / Fixed / Verified / Closed / Won't Fix) directly from the table as it's worked on.

### Step 6 — Add a sign-off

1. Under **Sign-Offs**, choose a project.
2. Choose a Role: QA / Product / R&D / Support / DevOps.
3. Write an Owner.
4. Choose a Status: Pending / Approved / Rejected.
5. Click **Add Sign-Off**.

### Step 7 — Add a regression item (Regression Center)

1. Under **Regression Center**, choose a project.
2. Write the area being tested, e.g. `Login`.
3. Choose a Test Type: Smoke / Sanity / Full / Regression.
4. Choose whether it's Required: Yes / No.
5. Write an Owner and click **Add Regression Item**.
6. Update Status (Not Started / In Progress / Passed / Failed / Blocked) from the table as testing proceeds.

### Step 8 — Add a production readiness check

1. Under **Production Readiness Center**, choose a project.
2. Write what needs to be verified, e.g. `Rollback steps verified`.
3. Write an Owner and click **Add Production Check**.
4. Update Status (Not Ready / In Progress / Ready / Verified) from the table.

### Step 9 — Add a post-release review item

1. Under **Post-Release Review**, choose a project.
2. Choose a category: What Went Well / What Went Wrong / Action Item.
3. Write a title and Owner, then click **Add Post-Release Item**.
4. Mark Status as Done once it's actioned.

---

## 4. Saving your data

The system saves data locally in your browser.

**Regular save**: click **Save Workspace**.

**Full backup**: click **Export JSON**. This downloads a JSON file with all your data. Keep it somewhere safe, e.g. `Documents/QA Release Command Center Backups/`.

**Restoring from backup**: click **Import JSON** and choose a previously exported file. It loads as a new, separate workspace — your current workspace is not overwritten, so it's always safe to try.

---

## 5. Exporting data

CSV exports available from **Quick Actions**:

- `Export Risks CSV`
- `Export Bugs CSV`
- `Export Regression CSV`
- `Export Production CSV`
- `Export Post-Release CSV`

These files open in Excel or Google Sheets.

---

## 6. Using widgets

The dashboard is built from modular widgets. Each widget can show:

- Number of projects
- Number of releases
- Blocking bugs
- Critical risks
- Pending sign-offs
- Regression gaps (required tests not yet passed)
- Production checks not yet ready
- Open post-release action items
- Full portfolio status table across all projects

**Resize a widget**: use its Size dropdown (small / medium / large / full).

**Recolor a widget**: use its color picker.

**Hide a widget**: click **Hide** on it.

**Bring back all widgets**: click **Reset Widgets** in the sidebar.

---

## 7. Using the templates

Templates live under:

```text
04_TEMPLATES/
```

Recommended order (all files sit directly under `04_TEMPLATES/` — see `04_TEMPLATES/README.md` for the full index):

1. `Release_Readiness_Checklist.md`
2. `Risk_Register_Template.md`
3. `Bug_Triage_Matrix.md`
4. `Regression_Scope_Matrix.md`
5. `Go_No_Go_Template.md`
6. `Production_Readiness_Checklist.md`
7. `Post_Release_Retrospective.md`

For a specialized project type, use:

```text
04_TEMPLATES/Specialized/
```

which contains Mobile, API_Backend, Data_SQL, and AI_Agent templates.

---

## 8. Using the AI prompts

The folder is here:

```text
05_AI_PROMPTS/
```

Example usage:

1. Open a prompt file, e.g. `Release_Risk_Analysis_Prompts.md` (other files cover Bug Triage, Regression Scope, Sign-Off Summaries, and Post-Release Retros — see `05_AI_PROMPTS/README.md`).
2. Copy the prompt into Claude / ChatGPT / Gemini.
3. Paste your own release data underneath it (export it from the app first if needed).
4. Ask the AI to return an executive summary, blockers, critical risks, missing information, and a Go / Conditional Go / No-Go recommendation.

---

## 9. Recommended workflow for a QA Manager

**Before the sprint/release**: create the project, create the release, add scope, add initial risks, assign owners.

**During testing**: update bugs, update regression status, update risks, add evidence, check the dashboard daily.

**Before Go/No-Go**: export a JSON backup, export the Risks/Bugs/Regression/Production CSVs, use the Go/No-Go template, use an AI prompt to analyze the release, and make the call: Go / Conditional Go / No-Go / Need More Data.

**After release**: fill in the Post-Release Review (in-app or via the retrospective template), document escaped defects and lessons learned, create action items for the next release.

---

## 10. Marketing the product

The marketing folder is here:

```text
06_MARKETING/
```

**Copy** (`06_MARKETING/Copy/`): Product Description, Gumroad Product Page Copy, LinkedIn Launch Post, Hebrew Marketing Copy, Image Captions and CTA.

**Images** (`06_MARKETING/Images/`): `01_Hero_Square.png`, `02_Command_Center_Banner.png`, `03_Features_Square.png`, `04_Social_Poster.png`.

| Use | Recommended image |
|---|---|
| Sales page | 01_Hero_Square.png |
| Landing page banner | 02_Command_Center_Banner.png |
| LinkedIn post | 03_Features_Square.png |
| Vertical ad / story | 04_Social_Poster.png |

---

## 11. Important limitations of the current version

1. This is a local web app, not a SaaS product.
2. It is not connected to the cloud.
3. It does not connect automatically to Jira or any other tracker.
4. It does not write to your computer's folders except through an explicit export action.
5. The browser stores your data locally — clearing browser data can delete it. **Always export a JSON backup regularly, and after major work sessions.**

---

## 12. Self-check before delivering or selling

Before you sell or hand this off to a client:

1. Open `index.html`.
2. Create a new project.
3. Create a new release.
4. Add a risk, a bug, a regression item, a production check, and a post-release item.
5. Click Save Workspace.
6. Click Export JSON.
7. Close the browser.
8. Reopen `index.html`.
9. Confirm your data is still there.
10. Click Import JSON and confirm the restore works (it should load as a new workspace).
11. Open the Marketing folder and confirm the images open.
12. Open the Markdown templates and confirm none are missing.
13. Open `05_AI_PROMPTS/` and confirm the prompt files are present.

---

## 13. Especially important files

| File | Role |
|---|---|
| `00_START_HERE/README_FIRST.md` | Opening explanation |
| `00_START_HERE/HOWTO_BEGINNERS_STEP_BY_STEP_EN.md` | This guide |
| `01_PROJECT_DESCRIPTION/PROJECT_DESCRIPTION_DETAILED.md` | Full description for reconstructing the project |
| `02_COMMAND_CENTER/index.html` | The Command Center system |
| `02_COMMAND_CENTER/app.js` | System logic |
| `02_COMMAND_CENTER/styles.css` | System styling |
| `03_DATA/samples/sample_workspace.json` | Sample data |
| `04_TEMPLATES/` | All working templates |
| `05_AI_PROMPTS/` | Prompt library |
| `06_MARKETING/` | Marketing copy and images |
| `09_VERSIONING/VALIDATION_REPORT.md` | Validation report |
