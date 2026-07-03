# 05_AI_PROMPTS — AI Prompt Library

Ready-to-use prompts for QA Managers, QA Leads, Release Managers, and Product Managers who want to use an LLM (Claude, ChatGPT, Gemini, or any capable model) to speed up release analysis. Every prompt is model-agnostic: copy the template, replace the bracketed placeholders with real data exported from your workspace (JSON/CSV) or pasted directly, and run it.

## Files

| File | Purpose |
|---|---|
| `Release_Risk_Analysis_Prompts.md` | Analyze pasted bug/risk lists for blast radius, hidden risk patterns, and a Go/No-Go recommendation. |
| `Bug_Triage_Prompts.md` | Prioritize a bug backlog, detect duplicate/related bugs, and draft reproduction steps from vague reports. |
| `Regression_Scope_Prompts.md` | Suggest regression scope from a diff/changelog and generate a regression test checklist for a feature area. |
| `SignOff_Summary_Prompts.md` | Turn exported CSV/JSON data (risks, bugs, workspace) into an executive Go/No-Go summary for a release meeting. |
| `Post_Release_Retro_Prompts.md` | Synthesize a retrospective from a list of incidents, bugs, and notes. |

## How to Use These Prompts

1. Export what you need from the Command Center (`Export JSON`, `Export Risks CSV`, `Export Bugs CSV`) or copy directly from your `04_TEMPLATES/` documents.
2. Open the relevant prompt file below and copy the prompt template that matches your task.
3. Paste your data into the marked placeholder (e.g. `[PASTE BUG LIST HERE]`).
4. Run it in your preferred LLM.
5. Review the output critically — these prompts accelerate analysis, they do not replace human judgment on a release decision.

## Ground Rules

- Never paste secrets, credentials, customer PII, or confidential contract terms into a third-party LLM unless your organization's data policy explicitly allows it.
- Treat AI output as a draft: verify facts, especially bug counts, severities, and any recommendation to ship.
- Keep the final Go / No-Go decision with a named human decision owner, as defined in `04_TEMPLATES/Go_No_Go_Template.md`.
