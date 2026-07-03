# API / Backend Release Readiness Template

Use this alongside `Release_Readiness_Checklist.md` for API and backend service releases. It focuses on the risks that come from breaking contracts with clients you may not fully control.

## Release Information

| Field | Value |
|---|---|
| Service(s) | *e.g. payments-api* |
| API Version | *e.g. v2.3* |
| Deployment Strategy | Rolling / Blue-Green / Canary |
| QA Owner | |
| On-Call Owner | |

## 1. Backward Compatibility

- [ ] No breaking changes to existing request/response contracts, OR breaking changes are versioned (new endpoint/version).
- [ ] Deprecated fields/endpoints still function during the deprecation window.
- [ ] Deprecation timeline communicated to all known consumers.
- [ ] Default values for new optional fields do not change existing behavior.

## 2. Contract / Schema Changes

| Change | Endpoint/Message | Breaking? | Consumer(s) Notified | Owner |
|---|---|---|---|---|
| *Added optional field `retryToken`* | *POST /payments/confirm* | No | N/A | |
| *Changed error code for timeout* | *POST /payments/confirm* | Yes | *Mobile team, Partner X* | |

- [ ] Contract/schema diff reviewed line by line (OpenAPI/Proto/GraphQL schema diff attached).
- [ ] Consumer-driven contract tests passing (if used).
- [ ] API documentation updated to match the shipped contract.

## 3. Rate Limits & Quotas

- [ ] Expected request volume for this release estimated against current rate limits.
- [ ] New endpoints have rate limits defined (not left unbounded).
- [ ] Downstream dependencies' rate limits reviewed if this release increases call volume to them.
- [ ] Retry/backoff behavior tested under throttling.

## 4. Rollback

- [ ] Previous service version can be redeployed within the target rollback time.
- [ ] Database/schema changes are backward-compatible with the previous code version (expand/contract pattern used for breaking schema changes).
- [ ] Feature flags used to decouple deployment from release where risk is high.
- [ ] Rollback tested in staging, not just documented.

## 5. Dependent Services

| Dependent Service | Impact of This Release | Owner Notified | Status |
|---|---|---|---|
| | | | |

- [ ] All known downstream/upstream dependencies identified.
- [ ] Dependent teams notified of the release window and any contract changes.
- [ ] Integration/smoke tests run against a staging environment that includes dependent services.
- [ ] Monitoring in place to detect elevated error rates in dependent services after deployment.

## 6. Observability

- [ ] Structured logging in place for new endpoints/error paths.
- [ ] Dashboards updated for new metrics (latency, error rate, throughput).
- [ ] Alert thresholds reviewed for the new/changed behavior.
- [ ] Distributed tracing verified across the changed call path (if applicable).
