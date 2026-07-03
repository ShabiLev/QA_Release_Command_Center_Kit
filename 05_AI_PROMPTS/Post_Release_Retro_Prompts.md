# Post-Release Retro Prompts

Prompts for synthesizing a structured retrospective from raw incident notes, bug lists, and team feedback after a release has shipped.

---

### 1. Retrospective Draft from Raw Notes

**When to use this:** After collecting rough notes from the team (Slack threads, standup notes, incident channel), before the retro meeting.

**Prompt:**
```
You are helping a QA Manager prepare a post-release retrospective. Below are raw, unstructured notes collected from the team about this release.

RAW NOTES:
[PASTE SLACK THREADS, STANDUP NOTES, OR INCIDENT NOTES HERE]

Organize this into:
1. What Went Well (specific, not generic).
2. What Went Wrong (specific, with likely root cause if inferable).
3. Suggested Action Items (each phrased as a concrete, assignable task, not a vague intention).

Do not soften or omit negative findings — the goal is an honest retrospective, not a summary that avoids blame-free discomfort.
```

**Expected output:** A structured draft retro (went well / went wrong / action items) ready to review and refine live in the retro meeting.

---

### 2. Incident Timeline Reconstruction

**When to use this:** When a production incident happened during or after the release and you need a clear timeline for the retro.

**Prompt:**
```
Reconstruct a clear timeline of the following incident from these raw, possibly out-of-order notes/logs.

RAW INCIDENT DATA:
[PASTE TIMESTAMPED LOGS, ALERTS, OR CHAT MESSAGES HERE]

Produce:
1. A chronological timeline (detection, diagnosis, mitigation, resolution) with timestamps.
2. Time-to-detect and time-to-resolve, calculated from the timeline.
3. The earliest point at which the issue could plausibly have been caught (e.g. in testing, in a canary stage, from a specific metric).
```

**Expected output:** A clean chronological incident timeline with calculated detection/resolution times and an earliest-catch-point analysis.

---

### 3. Escaped Defect Root Cause Analysis

**When to use this:** When a bug reached production despite QA, and you need to understand why the process missed it.

**Prompt:**
```
Below is a description of a bug that escaped to production.

ESCAPED BUG:
[PASTE BUG DESCRIPTION, HOW IT WAS FOUND, AND WHAT TESTING WAS DONE BEFORE RELEASE]

Analyze:
1. Why this likely wasn't caught (missing test coverage, wrong environment, insufficient data variety, time pressure, unclear ownership, etc.) — be specific, not generic.
2. Whether this reveals a one-off gap or a systemic testing gap.
3. A concrete process or test-plan change that would catch this class of bug in the future.
```

**Expected output:** A specific root-cause explanation for the escape, plus one concrete, testable process improvement.

---

### 4. Action Item Quality Check

**When to use this:** Before closing the retro meeting, to make sure action items will actually get done.

**Prompt:**
```
Review this list of proposed retro action items for quality.

ACTION ITEMS:
[PASTE DRAFT ACTION ITEMS HERE]

For each item, flag if it:
1. Lacks a specific, single owner.
2. Lacks a measurable definition of "done."
3. Is too vague to act on (e.g. "improve communication" instead of a concrete change).

Rewrite each flagged item into a specific, assignable, measurable action.
```

**Expected output:** A corrected action item list where every item has a clear owner, a measurable outcome, and concrete wording.

---

### 5. Trend Analysis Across Multiple Retrospectives

**When to use this:** Periodically (e.g. quarterly), to spot recurring issues across several past releases rather than treating each retro in isolation.

**Prompt:**
```
Below are summaries from the last several post-release retrospectives.

RETRO SUMMARIES:
[PASTE MULTIPLE RETRO SUMMARIES / ACTION ITEM LISTS HERE]

Identify:
1. Any issue or root cause that has appeared in more than one retrospective (a repeating pattern, not a one-off).
2. Any action item that was proposed before but doesn't appear to have been implemented (based on it recurring).
3. A short set of systemic, higher-leverage recommendations that would address multiple recurring issues at once.
```

**Expected output:** A trend report highlighting repeat issues, likely unimplemented past action items, and higher-leverage systemic recommendations.
