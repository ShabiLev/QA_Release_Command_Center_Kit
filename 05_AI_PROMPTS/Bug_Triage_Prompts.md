# Bug Triage Prompts

Prompts for speeding up bug backlog triage: prioritization, duplicate detection, and turning vague bug reports into something testable.

---

### 1. Backlog Prioritization Pass

**When to use this:** When you have a large open bug list and need a fast, defensible first-pass priority order before the triage meeting.

**Prompt:**
```
You are assisting a QA lead with bug triage. Below is a list of open bugs with title, severity, and any available context.

BUG LIST:
[PASTE BUG LIST HERE]

For each bug, suggest:
1. A priority (P0–P4) based on severity, likely user impact, and whether it blocks core flows.
2. Whether it should be marked as a release Blocker (Yes/No) and why.
3. Group the bugs into "Fix before release," "Fast-follow," and "Backlog" buckets.

Do not just repeat the input severity as the priority — reason about actual impact.
```

**Expected output:** A prioritized bug list with suggested priority, blocker flag, and bucket, plus a one-line justification per bug.

---

### 2. Duplicate & Related Bug Detection

**When to use this:** When the backlog has grown large across multiple reporters/sprints and duplicates are likely.

**Prompt:**
```
Review this list of bug titles and short descriptions. Identify likely duplicates and related bugs (same root cause, different symptom).

BUG LIST:
[PASTE BUG LIST WITH ID, TITLE, DESCRIPTION HERE]

For each group you find:
1. List the bug IDs that appear related or duplicate.
2. State your confidence (High/Medium/Low) that they share a root cause.
3. Suggest which one should be the "primary" bug and which should be linked/closed as duplicates.
```

**Expected output:** Clusters of related/duplicate bug IDs with confidence level and a suggested primary bug per cluster.

---

### 3. Reproduction Steps from a Vague Report

**When to use this:** When a bug report from support, a customer, or a stakeholder lacks clear steps to reproduce.

**Prompt:**
```
Below is a vague bug report. Turn it into a structured, testable bug report.

RAW REPORT:
[PASTE VAGUE BUG DESCRIPTION HERE]

PRODUCT CONTEXT:
[DESCRIBE THE RELEVANT FEATURE/FLOW BRIEFLY]

Produce:
1. A clear, specific bug title.
2. Numbered steps to reproduce, inferring reasonable defaults where the report is ambiguous (mark these as assumptions).
3. Expected result vs. actual result.
4. A list of clarifying questions to ask the reporter if key information is still missing.
```

**Expected output:** A structured bug report draft with clearly labeled assumptions and a short list of follow-up questions.

---

### 4. Severity vs. Priority Sanity Check

**When to use this:** When you suspect severity and priority have been assigned inconsistently across the backlog.

**Prompt:**
```
Review this bug list for inconsistent severity/priority assignment.

BUG LIST:
[PASTE BUG LIST WITH SEVERITY AND PRIORITY HERE]

Flag any bug where:
1. Severity is Critical/High but Priority is P3/P4 (or vice versa) without an obvious reason.
2. Blocker = Yes but severity is Low/Medium.
3. Two bugs describe similar impact but have very different severity/priority.

For each flagged bug, suggest a corrected value and explain why.
```

**Expected output:** A short list of flagged inconsistencies with a suggested correction and rationale for each.

---

### 5. Release Blocker Shortlist

**When to use this:** Right before the Go / No-Go meeting, to get a clean, minimal list of what is actually blocking.

**Prompt:**
```
From this full bug list, extract only the bugs that should realistically block this release, and explain why each one qualifies.

BUG LIST:
[PASTE FULL BUG LIST HERE]

RELEASE CONTEXT:
[DESCRIBE RELEASE TYPE, e.g. Hotfix / Major, AND ANY BUSINESS CONTEXT]

For each blocker, state:
1. Why it should block (customer impact, data integrity, no workaround, etc.).
2. Whether a workaround or feature-flag mitigation exists that would downgrade it from a hard blocker to a Conditional Go item.
```

**Expected output:** A short, defensible blocker shortlist with clear reasoning, ready to paste into the Go/No-Go template.
