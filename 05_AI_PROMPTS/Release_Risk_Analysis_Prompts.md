# Release Risk Analysis Prompts

Prompts for analyzing bug and risk data to understand blast radius, hidden patterns, and readiness for a release decision. Paste data exported from the Command Center (JSON/CSV) or copied from your `Risk_Register_Template.md` / `Bug_Triage_Matrix.md`.

---

### 1. Full Risk & Bug Summary

**When to use this:** At the start of release readiness review, to get a fast, structured overview before you dig into details manually.

**Prompt:**
```
You are helping a QA Manager review release readiness. Below is the risk register and bug list for an upcoming release.

RISK REGISTER:
[PASTE RISK LIST HERE — include title, probability, impact, level, owner, status]

BUG LIST:
[PASTE BUG LIST HERE — include title, severity, priority, blocker, owner, status]

Summarize:
1. Total counts by risk level and bug severity.
2. Any open Critical risk or blocker/Critical bug.
3. Areas of the product with the most concentrated risk (group by theme, not just list items).
4. Anything that looks incomplete or inconsistent in the data (missing owner, missing evidence, contradictory status).
```

**Expected output:** A short structured summary with counts, flagged blockers, thematic risk clusters, and a data-quality callout list.

---

### 2. Blast Radius Assessment

**When to use this:** When you need to understand how far a specific risk or bug could spread if it materializes in production.

**Prompt:**
```
Given this risk/bug description and the following context about the system, estimate the blast radius if this issue occurs in production.

ISSUE:
[PASTE RISK OR BUG DESCRIPTION HERE]

SYSTEM CONTEXT:
[DESCRIBE AFFECTED COMPONENT, USER SEGMENT, AND ANY KNOWN DEPENDENCIES]

Answer:
1. Which user segments or downstream systems could be affected, directly and indirectly?
2. Best-case, likely-case, and worst-case scenarios if this occurs.
3. Whether this is contained to one area or could cascade (e.g. via shared services, shared data, or shared infrastructure).
4. What early warning signs (metrics/logs) would indicate this is happening in production.
```

**Expected output:** A scenario-based impact analysis with contained-vs-cascading assessment and suggested monitoring signals.

---

### 3. Hidden Pattern Detection

**When to use this:** When you have a long list of risks/bugs and suspect there's a recurring root cause you haven't named yet.

**Prompt:**
```
Review this list of bugs and risks from the current release cycle and look for recurring patterns, not just individual items.

DATA:
[PASTE BUG AND RISK LIST HERE]

Identify:
1. Any recurring root cause across multiple items (e.g. a shared component, a specific integration, a specific OS/browser/device).
2. Any theme suggesting a process gap (e.g. multiple issues from the same untested area).
3. Which 1–3 patterns, if fixed at the root, would eliminate the most individual issues.
```

**Expected output:** A short list of root-cause clusters with the specific item IDs/titles that belong to each cluster.

---

### 4. Go / No-Go Recommendation Draft

**When to use this:** Right before the Go / No-Go meeting, to get a neutral first draft of a recommendation to react to (not to accept blindly).

**Prompt:**
```
Based on the following release data, draft a Go / No-Go recommendation using exactly one of these four outcomes: Go, Conditional Go, No-Go, Need More Data.

RELEASE INFO:
[PASTE VERSION, TARGET DATE, RELEASE TYPE]

OPEN RISKS:
[PASTE RISK LIST HERE]

OPEN BUGS:
[PASTE BUG LIST HERE]

REGRESSION STATUS:
[PASTE REGRESSION SUMMARY / PASS RATE HERE]

SIGN-OFF STATUS:
[PASTE SIGN-OFF STATUS BY ROLE HERE]

Provide:
1. Your recommended decision and a one-paragraph rationale.
2. The top 3 factors that most influenced the recommendation.
3. If "Conditional Go," the exact conditions that must be met.
4. If "Need More Data," exactly what data is missing.
```

**Expected output:** A one-page draft recommendation with rationale, ready to challenge and refine with the human decision-making team — not a final answer.

---

### 5. Risk Register Quality Check

**When to use this:** Before a release meeting, to catch weak or unusable risk entries.

**Prompt:**
```
Review this risk register for quality issues, not content correctness.

RISK REGISTER:
[PASTE RISK LIST HERE]

Flag any entry that:
1. Has no owner or a vague owner (e.g. "team" instead of a name).
2. Has no evidence for a "Mitigated" or "Closed" status.
3. Has a probability/impact combination that doesn't match its stated level (High+High should be Critical, etc.).
4. Is too vague to act on (state why).
```

**Expected output:** A list of specific entries with the quality issue named, so they can be corrected before the meeting.
