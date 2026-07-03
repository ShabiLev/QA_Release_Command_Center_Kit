# AI / Agent Release Readiness Template

Use this alongside `Release_Readiness_Checklist.md` for releases involving LLM-based features, agents, or prompt/model changes. AI releases carry risks that traditional test plans do not cover — non-determinism, drift, and safety failures chief among them.

## Release Information

| Field | Value |
|---|---|
| Model(s) Used | *e.g. provider + model name + version* |
| Prompt/Agent Version | *e.g. v4.2 of system prompt* |
| Change Type | Model upgrade / Prompt change / New tool/function / New agent behavior |
| QA Owner | |
| Model/Prompt Owner | |

## 1. Prompt / Model Version Pinning

- [ ] Exact model version/identifier is pinned (not "latest") for this release, or the auto-update policy is explicitly accepted as a risk.
- [ ] System prompt, few-shot examples, and tool definitions are version-controlled.
- [ ] A rollback prompt/model version is identified and ready to restore.
- [ ] Changelog of what changed in the prompt/model since the last release is documented.

## 2. Eval / Regression Suite

| Eval Set | Purpose | Pass Threshold | Result | Status |
|---|---|---|---|---|
| *Core task accuracy* | Baseline task success rate | ≥ ______% | | |
| *Known edge cases* | Previously identified failure modes | 100% resolved or accepted | | |
| *Adversarial/red-team set* | Attempted jailbreaks/misuse | 0 successful bypasses | | |
| *Regression set* | Prior release's passing cases still pass | ≥ ______% | | |

- [ ] Eval suite run against the exact model/prompt version being released, not an earlier one.
- [ ] Results compared against the previous release's baseline, not just an absolute threshold.
- [ ] Any regression in eval scores investigated and explained before sign-off.

## 3. Hallucination / Safety Spot-Checks

- [ ] Manual spot-check performed on a sample of real (or realistic) queries for factual accuracy.
- [ ] Known hallucination-prone scenarios re-tested (e.g. numeric claims, citations, dates, unavailable data).
- [ ] Safety/content policy checks performed (harmful content, PII leakage, disallowed advice).
- [ ] Behavior verified when the agent lacks sufficient information — does it say so, or fabricate an answer?
- [ ] Guardrail/refusal behavior tested for out-of-scope or malicious requests.

## 4. Cost / Latency Budget

| Metric | Previous Release | This Release | Budget | Status |
|---|---|---|---|---|
| Avg. tokens per request | | | | |
| Avg. cost per request | | | | |
| P50 latency | | | | |
| P95 latency | | | | |

- [ ] Cost per request/session estimated at expected volume and compared to budget.
- [ ] Latency tested under realistic concurrent load, not just single-request testing.
- [ ] Fallback behavior defined if the model/provider is slow, rate-limited, or unavailable.

## 5. Guardrail Checks

- [ ] Input validation/sanitization in place before content reaches the model.
- [ ] Output validation/filtering in place before content reaches the user or downstream system.
- [ ] Tool/function-calling permissions scoped to the minimum required (no unnecessary write/delete access).
- [ ] Human-in-the-loop or confirmation step required for high-impact agent actions (payments, deletions, external communications).
- [ ] Logging/monitoring captures enough context to audit and debug agent decisions after the fact.

## 6. Rollback / Kill Switch

- [ ] A kill switch exists to disable the AI feature or fall back to a non-AI path without a full deployment.
- [ ] Rollback to a previous prompt/model version tested and timed.
- [ ] Escalation path defined for reports of harmful, incorrect, or embarrassing agent output in production.
