# Export Examples

This folder shows what the Command Center's export buttons actually produce, using the
bundled sample workspace (`03_DATA/samples/sample_workspace.json`) as the source data. Open
any file here to see the exact format before you generate your own.

| File | Produced by |
|---|---|
| `risks_example.csv` | Sidebar → Quick Actions → Risks CSV |
| `bugs_example.csv` | Sidebar → Quick Actions → Bugs CSV |
| `jira_issues_example.csv` | Reports tab → Export Jira Issues CSV (after a Jira CSV import) |
| `decision_summary_example.md` | Reports tab → Export Decision Summary (Markdown), with a specific project + release selected in the filter bar |
| `executive_summary_example.md` | Reports tab → Export Executive Summary (Markdown) |

All CSV exports respect whatever Project/Release filter is active when you click the button —
if "All Projects" / "All Releases" is selected, you get the full portfolio; narrow the filter
first to export just one project or release.
