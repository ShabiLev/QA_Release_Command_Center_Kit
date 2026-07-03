# Sign-Off Summary Prompts

Prompts for turning exported workspace data (JSON/CSV) into a clear, executive-ready Go/No-Go summary for a release meeting. Paste data exported via `Export JSON`, `Export Risks CSV`, or `Export Bugs CSV`.

---

### 1. Executive Go/No-Go Summary from Exported Data

**When to use this:** Right before the release meeting, to turn raw exported data into a one-page executive summary.

**Prompt:**
```
You are preparing a one-page executive summary for a Go/No-Go release meeting. Use only the data provided below — do not invent numbers.

WORKSPACE / RELEASE DATA (JSON or CSV export):
[PASTE workspace.json, risks.csv, AND/OR bugs.csv CONTENT HERE]

Produce a one-page summary with these sections:
1. Release Overview (version, title, target date, owners).
2. Health Snapshot (open risks by level, open bugs by severity, regression pass rate if available, sign-off status by role).
3. Top 3 Concerns (the specific risks/bugs most likely to affect the decision).
4. Suggested Decision (Go / Conditional Go / No-Go / Need More Data) with a one-paragraph rationale.

Write for an executive audience: concise, no jargon, no restating raw data tables.
```

**Expected output:** A one-page, plain-language executive summary suitable for pasting into a release meeting doc or email.

---

### 2. Sign-Off Status Roll-Up

**When to use this:** When sign-offs are scattered and you need a single clear view of who has approved and who hasn't.

**Prompt:**
```
Below is the sign-off data for this release, by role.

SIGN-OFF DATA:
[PASTE SIGN-OFF LIST HERE — role, owner, status, notes]

Produce:
1. A simple status table: Role, Owner, Status, Outstanding Action (if Pending/Rejected).
2. A one-line overall statement: "X of Y sign-offs approved."
3. Any Rejected sign-off called out with its stated reason, prominently.
```

**Expected output:** A compact sign-off status table plus a one-line rollup statement and any rejection called out clearly.

---

### 3. Multi-Project Portfolio Summary

**When to use this:** When you manage several projects/releases at once and need a portfolio-level status update for leadership.

**Prompt:**
```
Below is workspace data covering multiple projects and releases.

WORKSPACE DATA:
[PASTE FULL workspace.json HERE]

Produce a portfolio-level summary table with columns: Project, Release Version, Health, Decision, Open Blockers/Critical Risks, Target Date. Then add a short narrative paragraph highlighting which project needs the most leadership attention this week and why.
```

**Expected output:** A portfolio status table plus a short narrative flagging the highest-attention project.

---

### 4. CSV-to-Narrative Translation

**When to use this:** When you have raw CSV exports and need to explain them in plain language to a non-technical stakeholder (e.g. a customer-facing exec).

**Prompt:**
```
Translate the following raw CSV export into a short plain-language narrative for a non-technical stakeholder. Avoid QA jargon (no "P1," "blocker," "regression" without explanation).

CSV DATA:
[PASTE risks.csv OR bugs.csv CONTENT HERE]

Explain in 3–5 sentences: what is going on, what the biggest concern is in plain terms, and what needs to happen before this can go live.
```

**Expected output:** A short, jargon-free narrative explanation suitable for a non-QA audience (e.g. a customer success or executive stakeholder).

---

### 5. Meeting Agenda from Open Items

**When to use this:** To build the actual agenda for the Go/No-Go meeting so time is spent on what matters.

**Prompt:**
```
Using the release data below, build a time-boxed Go/No-Go meeting agenda (assume a 30-minute meeting).

RELEASE DATA:
[PASTE RISK LIST, BUG LIST, AND SIGN-OFF STATUS HERE]

Produce an agenda with time allocations that prioritizes discussion of open Critical/High risks and blocker bugs first, sign-off status second, and general Q&A last. Note any item that should be resolved asynchronously before the meeting instead of discussed live.
```

**Expected output:** A time-boxed meeting agenda ordered by decision impact, plus a short list of items better resolved before the meeting.
