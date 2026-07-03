# 04_TEMPLATES — Template Library Index

Practical, ready-to-fill Markdown templates for running a release from readiness through post-release review. Copy any file per release/project as needed; the field names align with the Command Center's data model so information can move between the app and these documents without translation.

## Core Templates

| File | Purpose |
|---|---|
| `Release_Readiness_Checklist.md` | Single-page checklist covering scope, testing, bugs, risk, sign-offs, and deployment readiness for a release. |
| `Go_No_Go_Template.md` | Structured Go / No-Go meeting template with a Go / Conditional Go / No-Go / Need More Data decision framework. |
| `Risk_Register_Template.md` | Tracks release risks with probability, impact, calculated level, owner, decision, status, and evidence. |
| `Bug_Triage_Matrix.md` | Triages the bug backlog by severity, priority, blocker status, owner, and status, with a triage decision guide. |
| `Regression_Scope_Matrix.md` | Defines and tracks required regression testing by area and test type, with owner, status, and evidence. |
| `Production_Readiness_Checklist.md` | Covers rollback plan, monitoring, feature flags, capacity, and communications before deployment. |
| `Post_Release_Retrospective.md` | Structured post-release retro: what went well, what went wrong, action items, escaped defects, and metrics recap. |

## Specialized Templates

Located in `Specialized/`, these extend the core Release Readiness Checklist with product-type-specific concerns.

| File | Purpose |
|---|---|
| `Specialized/Mobile_Release_Template.md` | App store review risk, device/OS matrix, permissions, crash-free rate, staged store rollout. |
| `Specialized/API_Backend_Release_Template.md` | Backward compatibility, contract/schema changes, rate limits, rollback, dependent services. |
| `Specialized/Data_SQL_Release_Template.md` | Data migration safety, backfill validation, collation/encoding, reconciliation queries, schema rollback. |
| `Specialized/AI_Agent_Release_Template.md` | Prompt/model version pinning, eval regression suite, hallucination/safety spot-checks, cost/latency budget, guardrails. |

## Recommended Order of Use

1. `Release_Readiness_Checklist.md`
2. `Risk_Register_Template.md`
3. `Bug_Triage_Matrix.md`
4. `Regression_Scope_Matrix.md`
5. Relevant file(s) in `Specialized/` (if the project type applies)
6. `Production_Readiness_Checklist.md`
7. `Go_No_Go_Template.md`
8. `Post_Release_Retrospective.md`

See `05_AI_PROMPTS/` for prompts that help you analyze the data you collect in these templates using an LLM.
