# Regression Scope Prompts

Prompts for turning a code diff or changelog into a defensible regression scope, and for generating detailed regression checklists for a specific feature area.

---

### 1. Regression Scope from a Changelog/Diff

**When to use this:** Right after code freeze, when you have a list of changes (tickets, commit messages, or a diff summary) and need to decide what to regression test.

**Prompt:**
```
You are helping a QA lead define regression scope for a release. Below is the changelog/diff summary for this release.

CHANGELOG / DIFF SUMMARY:
[PASTE CHANGELOG, COMMIT LIST, OR DIFF SUMMARY HERE]

PRODUCT AREAS (for reference):
[LIST THE MAIN FUNCTIONAL AREAS OF YOUR PRODUCT, e.g. Login, Payment, Search, Reporting]

Produce a regression scope table with columns: Area, Why it's affected (direct or indirect), Suggested Test Type (Smoke/Regression/Exploratory/Automated), and Required (Yes/No). Include areas that are indirectly affected through shared components, not just directly modified files.
```

**Expected output:** A regression scope table ready to paste into `Regression_Scope_Matrix.md`, including indirectly-affected areas you might have missed.

---

### 2. Feature-Area Regression Checklist

**When to use this:** When you need a detailed test checklist for one specific area, beyond just naming it in the scope matrix.

**Prompt:**
```
Generate a detailed regression test checklist for the following feature area.

FEATURE AREA:
[NAME THE AREA, e.g. "Login with Push Notification 2FA"]

FEATURE DESCRIPTION:
[DESCRIBE HOW IT WORKS, KEY USER FLOWS, AND ANY RECENT CHANGES]

Produce:
1. A checklist of test cases covering the happy path.
2. A checklist of edge cases (network loss, timeout, invalid input, concurrent sessions, permission denial, etc.).
3. Any cross-area interactions worth testing (e.g. this feature combined with another active feature).
Format as a Markdown checklist grouped by category.
```

**Expected output:** A ready-to-use Markdown checklist of happy-path, edge-case, and cross-area test cases for that feature.

---

### 3. Risk-Based Regression Prioritization

**When to use this:** When time is limited before the release date and you must decide what to test first.

**Prompt:**
```
Given limited regression testing time before release, help prioritize the following areas.

AREAS AND CONTEXT:
[PASTE LIST OF AREAS WITH BRIEF CONTEXT: HOW OFTEN THEY BREAK, HOW CUSTOMER-FACING/REVENUE-CRITICAL THEY ARE, AND WHAT CHANGED]

TIME AVAILABLE:
[STATE AVAILABLE TESTING TIME, e.g. "2 QA days"]

Rank the areas by priority for the available time, and explain the trade-off of skipping or reducing coverage on the lowest-ranked areas.
```

**Expected output:** A ranked list of areas with a clear rationale and an explicit statement of what risk is being accepted by deprioritizing lower-ranked areas.

---

### 4. Cross-Reference Scope Against Past Incidents

**When to use this:** When you want to make sure historically fragile areas aren't being skipped.

**Prompt:**
```
Below is the current release's regression scope, and a list of past production incidents/escaped defects.

CURRENT REGRESSION SCOPE:
[PASTE CURRENT SCOPE TABLE HERE]

PAST INCIDENTS / ESCAPED DEFECTS:
[PASTE LIST OF PAST INCIDENTS WITH AFFECTED AREA HERE]

Identify:
1. Any area with a history of incidents that is missing from, or under-scoped in, the current regression plan.
2. A suggested Test Type upgrade for any under-scoped historically fragile area (e.g. Smoke → full Regression).
```

**Expected output:** A gap list of historically fragile areas that need more regression coverage than currently planned.
