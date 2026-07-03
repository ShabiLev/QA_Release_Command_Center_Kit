# Data / SQL Release Readiness Template

Use this alongside `Release_Readiness_Checklist.md` for releases that change database schemas, ETL pipelines, reports, or reference data. Data releases are higher-risk than code-only releases because mistakes can silently corrupt historical data.

## Release Information

| Field | Value |
|---|---|
| Database(s) / Pipeline(s) | *e.g. reporting-dwh* |
| Change Type | Schema change / Data migration / Backfill / Report logic change |
| QA Owner | |
| DBA Owner | |

## 1. Data Migration Safety

- [ ] Migration script is idempotent (safe to run more than once without duplicating/corrupting data).
- [ ] Migration tested against a production-like data volume, not just a small sample.
- [ ] Migration run time estimated and fits within the maintenance/deployment window.
- [ ] Migration wrapped in a transaction where possible, with a clear failure/partial-run behavior.
- [ ] Read/write locking impact assessed for tables under active use during migration.

## 2. Backfill Validation

- [ ] Backfill scope defined (date range, tenant/customer scope, record count expected).
- [ ] Row counts before and after backfill reconciled and documented.
- [ ] Spot-checked sample records verified manually against source-of-truth.
- [ ] Backfill is re-runnable/resumable if interrupted.
- [ ] Backfill does not overwrite manually corrected or already-validated data.

## 3. Collation / Encoding

- [ ] Character encoding (e.g. UTF-8) verified consistent across source, pipeline, and destination.
- [ ] Collation settings verified for any new columns, tables, or cross-database joins (especially relevant for Hebrew/RTL or mixed-language text).
- [ ] Sorting and comparison behavior tested with real multilingual sample data.
- [ ] Export files (CSV/Excel) open correctly in Excel/Google Sheets without garbled characters.

## 4. Reconciliation Queries

| Check | Query/Method | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| *Row count match, source vs. target* | | | | |
| *Sum of amounts matches control total* | | | | |
| *No duplicate keys introduced* | | | | |
| *No NULLs in required fields post-migration* | | | | |

- [ ] Reconciliation queries run against both old and new logic in parallel where feasible.
- [ ] Discrepancies investigated and explained (not just noted) before sign-off.
- [ ] Reconciliation results attached as evidence in the Risk Register / Regression Scope Matrix.

## 5. Rollback of Schema Changes

- [ ] Rollback script written and tested for every schema change (add/drop column, index, constraint).
- [ ] Rollback does not cause data loss for records created after the schema change.
- [ ] Application code compatible with both pre- and post-migration schema during the rollout window (expand/contract pattern).
- [ ] Rollback time estimated and acceptable within the incident response window.

## 6. Downstream Impact

- [ ] Reports, dashboards, and exports consuming this data reviewed for breaking changes.
- [ ] Stakeholders who rely on affected reports notified in advance.
- [ ] Historical data comparability preserved or a clear "definition change" note published.
