/* QA Release Command Center — Jira Import Center.
   CSV-only. No network requests are ever made from this file, no Jira API token is ever
   read, stored, or transmitted. The JQL textarea is reference text for the user only — it
   is never executed by this app. */

/* ---------- CSV parsing (quoted fields, embedded commas/newlines, UTF-8 via FileReader) ---------- */

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  const normalized = String(text || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  for (let i = 0; i < normalized.length; i++) {
    const c = normalized[i];
    if (inQuotes) {
      if (c === '"') {
        if (normalized[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => !(r.length === 1 && r[0].trim() === ''));
}
function csvRowsToObjects(rows) {
  if (!rows.length) return { headers: [], objects: [] };
  const headers = rows[0].map(h => String(h || '').trim());
  const objects = rows.slice(1).map(r => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = r[i] !== undefined ? r[i] : ''; });
    return obj;
  });
  return { headers, objects };
}

/* ---------- default Jira CSV field mapping ---------- */

const JIRA_FIELD_ALIASES = {
  jiraKey: ['key', 'issue key'],
  summary: ['summary'],
  issueType: ['issue type', 'issue type1', 'type'],
  status: ['status'],
  statusCategory: ['status category'],
  priority: ['priority'],
  assignee: ['assignee'],
  reporter: ['reporter'],
  fixVersions: ['fix versions', 'fix version/s', 'fixversion', 'fix version'],
  components: ['components', 'component'],
  labels: ['labels', 'label'],
  created: ['created'],
  updated: ['updated'],
  resolved: ['resolved'],
  resolution: ['resolution'],
  parent: ['parent'],
  epicLink: ['epic link'],
  sprint: ['sprint']
};
const JIRA_TARGET_FIELDS = ['(ignore)', ...Object.keys(JIRA_FIELD_ALIASES)];
function autoMapJiraHeader(header) {
  const h = String(header || '').trim().toLowerCase();
  for (const target of Object.keys(JIRA_FIELD_ALIASES)) {
    if (JIRA_FIELD_ALIASES[target].includes(h)) return target;
  }
  return '(ignore)';
}

/* ---------- state ---------- */

let jiraParsed = { headers: [], objects: [] };
let jiraFieldMapping = {};
let jiraCsvWarnings = [];

/* ---------- UI wiring ---------- */

function initJiraImportUI() {
  const fileInput = document.getElementById('jiraCsvFile');
  if (fileInput) fileInput.addEventListener('change', e => { if (e.target.files[0]) handleJiraCsvFile(e.target.files[0]); });
}

function copyJqlExample(btn) {
  const text = btn.previousElementSibling.querySelector('code').textContent;
  const done = () => { const original = btn.textContent; btn.textContent = t('Copied!'); setTimeout(() => { btn.textContent = original; }, 1200); };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else fallbackCopy(text, done);
}
function fallbackCopy(text, done) {
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.focus(); ta.select();
  try { document.execCommand('copy'); } catch (e) {}
  document.body.removeChild(ta);
  done();
}

function handleJiraCsvFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const rows = parseCSV(reader.result);
    const { headers, objects } = csvRowsToObjects(rows);
    const check = validateCsvRows(objects);
    jiraParsed = { headers, objects: check.rows };
    jiraCsvWarnings = check.warnings;
    jiraFieldMapping = {};
    headers.forEach(h => { jiraFieldMapping[h] = autoMapJiraHeader(h); });
    renderJiraMappingTable();
    renderJiraPreviewTable();
  };
  reader.readAsText(file);
}

function renderJiraMappingTable() {
  const tbody = document.querySelector('#jiraMappingTable tbody');
  if (!tbody) return;
  tbody.innerHTML = jiraParsed.headers.map(h => `<tr><td>${esc(h)}</td><td>
    <select onchange="jiraFieldMapping['${esc(h).replace(/'/g, "\\'")}']=this.value; renderJiraPreviewTable();">
      ${JIRA_TARGET_FIELDS.map(f => `<option value="${esc(f)}" ${jiraFieldMapping[h] === f ? 'selected' : ''}>${esc(f)}</option>`).join('')}
    </select></td></tr>`).join('') || `<tr><td colspan="2" class="hint">${t('Upload a CSV file to see its columns here.')}</td></tr>`;
}

function mapJiraRow(rawRow) {
  const mapped = {};
  Object.keys(rawRow).forEach(h => {
    const target = jiraFieldMapping[h];
    if (target && target !== '(ignore)') mapped[target] = rawRow[h];
  });
  return mapped;
}

function renderJiraPreviewTable() {
  const table = document.getElementById('jiraPreviewTable');
  const summaryEl = document.getElementById('jiraPreviewSummary');
  if (!table) return;
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  const mappedFields = Object.values(jiraFieldMapping).filter(f => f !== '(ignore)');
  const previewRows = jiraParsed.objects.slice(0, 10).map(mapJiraRow);
  thead.innerHTML = `<tr>${mappedFields.map(f => `<th>${esc(f)}</th>`).join('')}</tr>`;
  tbody.innerHTML = previewRows.map(r => `<tr>${mappedFields.map(f => `<td>${esc(r[f] || '')}</td>`).join('')}</tr>`).join('') ||
    `<tr><td class="hint">${t('No rows to preview yet.')}</td></tr>`;
  if (summaryEl) {
    summaryEl.textContent = jiraParsed.objects.length
      ? tFmt('{n} row(s) parsed. Showing the first {shown}.', { n: jiraParsed.objects.length, shown: Math.min(10, jiraParsed.objects.length) })
      : '';
  }
}

/* ---------- Jira -> app enum mapping ---------- */

function jiraPriorityToSeverity(priority) {
  const p = String(priority || '').toLowerCase();
  if (p.includes('block') || p.includes('highest') || p.includes('critical')) return 'Critical';
  if (p.includes('high')) return 'High';
  if (p.includes('low')) return 'Low';
  return 'Medium';
}
function jiraPriorityToAppPriority(priority) {
  const p = String(priority || '').toLowerCase();
  if (p.includes('block') || p.includes('highest')) return 'P0';
  if (p.includes('high')) return 'P1';
  if (p.includes('low')) return 'P3';
  if (p.includes('lowest')) return 'P4';
  return 'P2';
}
function jiraToBugStatus(statusCategory, status) {
  const sc = String(statusCategory || '').toLowerCase();
  const s = String(status || '').toLowerCase();
  if (sc === 'done') return /won'?t|cannot|cancel/.test(s) ? "Won't Fix" : 'Closed';
  if (sc.includes('progress') || sc === 'indeterminate') return 'In Progress';
  return 'Open';
}
function isJiraBugType(issueType) { return /bug/i.test(String(issueType || '')); }
function isJiraScopeType(issueType) { return /story|task/i.test(String(issueType || '')); }
function daysSince(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return (Date.now() - d.getTime()) / 86400000;
}

/* ---------- import pipeline ---------- */

function runJiraImport() {
  const projectId = document.getElementById('jiraTargetProject').value;
  const releaseId = document.getElementById('jiraTargetRelease').value || UNASSIGNED_RELEASE;
  const mode = document.getElementById('jiraImportMode').value;
  const duplicateMode = document.getElementById('jiraDuplicateMode').value;
  const generateRisks = document.getElementById('jiraGenerateRisks').checked;
  const jql = document.getElementById('jiraJqlUsed').value.trim();
  const project = findProject(projectId);
  const warningsEl = document.getElementById('jiraImportWarnings');
  const summaryEl = document.getElementById('jiraImportSummary');

  if (!project) { alert(t('Select a target project first.')); return; }
  if (!jiraParsed.objects.length) { alert(t('Upload and preview a Jira CSV file first.')); return; }

  const now = nowISO();
  let issuesImported = 0, bugsCreated = 0, scopeCreated = 0, skippedDuplicates = 0;
  const warnings = jiraCsvWarnings.slice();
  const importedIssues = [];

  jiraParsed.objects.forEach((rawRow, idx) => {
    const mapped = mapJiraRow(rawRow);
    const jiraKey = safeId(mapped.jiraKey || `ROW-${idx + 1}`);
    if (!mapped.jiraKey) warnings.push(tFmt('Row {n} has no Jira key/Issue key column mapped; used a generated placeholder.', { n: idx + 1 }));

    const existing = project.jiraIssues.find(i => i.jiraKey === jiraKey && i.releaseId === releaseId);
    let targetIssue;
    if (existing) {
      if (duplicateMode === 'skip') { skippedDuplicates++; importedIssues.push(existing); return; }
      if (duplicateMode === 'update') { targetIssue = existing; }
      // 'duplicate' falls through to create a new entry with a suffixed key below
    }
    const finalKey = (existing && duplicateMode === 'duplicate')
      ? `${jiraKey}-dup${project.jiraIssues.filter(i => i.jiraKey.startsWith(jiraKey)).length + 1}`
      : jiraKey;

    const issue = targetIssue || {
      id: uid('JIRA'), createdAt: now
    };
    Object.assign(issue, {
      projectId, releaseId, jiraKey: finalKey,
      summary: mapped.summary || '', issueType: mapped.issueType || '', status: mapped.status || '',
      statusCategory: mapped.statusCategory || '', priority: mapped.priority || '', assignee: mapped.assignee || '',
      reporter: mapped.reporter || '', fixVersions: mapped.fixVersions || '', components: mapped.components || '',
      labels: mapped.labels || '', created: mapped.created || '', updated: mapped.updated || '',
      resolved: mapped.resolved || '', resolution: mapped.resolution || '', parent: mapped.parent || '',
      epicLink: mapped.epicLink || '', sprint: mapped.sprint || '', source: 'jira-import', raw: rawRow,
      updatedAt: now
    });
    if (!targetIssue) project.jiraIssues.push(issue);
    issuesImported++;
    importedIssues.push(issue);

    const wantsBugs = mode === 'bugs-and-scope' || mode === 'bugs-only';
    const wantsScope = mode === 'bugs-and-scope' || mode === 'scope-only';

    if (wantsBugs && isJiraBugType(issue.issueType)) {
      const existingBug = project.bugs.find(b => b.jiraKey === issue.jiraKey && b.releaseId === releaseId);
      if (!existingBug) {
        project.bugs.push({
          id: uid('BUG'), projectId, releaseId, jiraKey: issue.jiraKey,
          title: issue.summary || issue.jiraKey, severity: jiraPriorityToSeverity(issue.priority),
          priority: jiraPriorityToAppPriority(issue.priority),
          blocker: /block/i.test(issue.priority || '') ? 'Yes' : 'No',
          owner: issue.assignee || '', status: jiraToBugStatus(issue.statusCategory, issue.status),
          source: 'jira-import', createdAt: now, updatedAt: now
        });
        bugsCreated++;
      }
    }
    if (wantsScope && isJiraScopeType(issue.issueType)) { issue.isScope = true; scopeCreated++; }
  });

  let risksGenerated = 0;
  if (generateRisks) risksGenerated = generateRisksFromJiraIssues(projectId, releaseId, importedIssues, jql);

  saveWorkspace();
  renderJiraMappingTable();

  if (summaryEl) {
    summaryEl.innerHTML = `<div class="import-summary-box">
      <b>${esc(t('Import complete — the dashboard, decision engine, and all tables have already been updated.'))}</b>
      <div class="hint" style="margin-top:8px">
        ${tFmt('Total rows read: {n}', { n: jiraParsed.objects.length })}<br/>
        ${tFmt('Jira issues imported: {n}', { n: issuesImported })}<br/>
        ${tFmt('Bugs created: {n}', { n: bugsCreated })}<br/>
        ${tFmt('Release scope items created: {n}', { n: scopeCreated })}<br/>
        ${tFmt('Suggested risks generated: {n}', { n: risksGenerated })}<br/>
        ${tFmt('Skipped duplicates: {n}', { n: skippedDuplicates })}
      </div>
      <button class="btn-sm tip" style="margin-top:10px" data-tip="Jump to the Dashboard tab to see the updated widgets and Go/No-Go decision." onclick="switchTab('dashboard')">${esc(t('View Updated Dashboard'))}</button>
    </div>`;
  }
  if (warningsEl) {
    warningsEl.innerHTML = warnings.length
      ? `<div class="hint" style="color:var(--warn);margin-top:6px">${warnings.map(w => esc(w)).join('<br/>')}</div>` : '';
  }
}

/* ---------- risk generation from Jira import (Phase 6) ---------- */

function upsertAutoRisk(project, releaseId, ruleKey, riskDef, now) {
  let risk = project.risks.find(r => r.source === 'jira-auto-risk' && r.ruleKey === ruleKey && r.releaseId === releaseId);
  if (risk) {
    Object.assign(risk, riskDef, { updatedAt: now });
  } else {
    project.risks.push(Object.assign({
      id: uid('R'), projectId: project.id, releaseId, owner: '', status: 'Open', decision: 'Monitor',
      source: 'jira-auto-risk', ruleKey, createdAt: now, updatedAt: now
    }, riskDef));
  }
}

function generateRisksFromJiraIssues(projectId, releaseId, importedIssues, jql) {
  const project = findProject(projectId);
  if (!project || !importedIssues.length) return 0;
  const now = nowISO();
  const evidenceFooter = (keys) => `Jira keys: ${keys.join(', ')}. Imported ${now.slice(0, 10)}.` + (jql ? ` JQL: ${jql}` : '');
  let count = 0;

  const criticalBugs = importedIssues.filter(i => isJiraBugType(i.issueType) && jiraPriorityToSeverity(i.priority) === 'Critical' && (i.statusCategory || '').toLowerCase() !== 'done');
  if (criticalBugs.length) {
    upsertAutoRisk(project, releaseId, 'critical-bug', {
      title: 'Critical open bug may block release', level: 'Critical', probability: 'High', impact: 'High',
      decision: 'Fix Before Release', evidence: evidenceFooter(criticalBugs.map(i => i.jiraKey))
    }, now);
    count++;
  }

  const highBugs = importedIssues.filter(i => isJiraBugType(i.issueType) && jiraPriorityToSeverity(i.priority) === 'High' && (i.statusCategory || '').toLowerCase() !== 'done');
  if (highBugs.length) {
    upsertAutoRisk(project, releaseId, 'high-bug', {
      title: 'High priority bugs remain open before release', level: 'High', probability: 'Medium', impact: 'High',
      decision: 'Review Before Go / No-Go', evidence: evidenceFooter(highBugs.map(i => i.jiraKey))
    }, now);
    count++;
  }

  const unassigned = importedIssues.filter(i => !i.assignee || !i.assignee.trim());
  if (unassigned.length) {
    upsertAutoRisk(project, releaseId, 'unassigned', {
      title: 'Unassigned Jira items may delay release ownership', level: 'Medium', probability: 'Medium', impact: 'Medium',
      decision: 'Monitor', evidence: evidenceFooter(unassigned.map(i => i.jiraKey))
    }, now);
    count++;
  }

  const byComponent = {};
  importedIssues.forEach(i => {
    String(i.components || '').split(',').map(c => c.trim()).filter(Boolean).forEach(c => {
      (byComponent[c] = byComponent[c] || []).push(i);
    });
  });
  Object.entries(byComponent).forEach(([component, issues]) => {
    if (issues.length >= 2) {
      upsertAutoRisk(project, releaseId, `component:${component}`, {
        title: `Component stability risk: ${component}`, level: issues.length >= 3 ? 'High' : 'Medium',
        probability: issues.length >= 3 ? 'High' : 'Medium', impact: 'Medium', decision: 'Monitor',
        evidence: evidenceFooter(issues.map(i => i.jiraKey))
      }, now);
      count++;
    }
  });

  const stale = importedIssues.filter(i => {
    if ((i.statusCategory || '').toLowerCase() === 'done') return false;
    const d = daysSince(i.updated || i.created);
    return d !== null && d > 7;
  });
  if (stale.length) {
    upsertAutoRisk(project, releaseId, 'stale', {
      title: 'Stale unresolved Jira item may hide delivery risk', level: 'Medium', probability: 'Medium', impact: 'Medium',
      decision: 'Monitor', evidence: evidenceFooter(stale.map(i => i.jiraKey))
    }, now);
    count++;
  }

  const unresolvedInFixVersion = importedIssues.filter(i => (i.statusCategory || '').toLowerCase() !== 'done');
  if (unresolvedInFixVersion.length >= 5) {
    upsertAutoRisk(project, releaseId, 'fixversion-scope', {
      title: 'FixVersion contains unresolved scope before release', level: 'High', probability: 'High', impact: 'High',
      decision: 'Review Before Go / No-Go', evidence: evidenceFooter(unresolvedInFixVersion.map(i => i.jiraKey))
    }, now);
    count++;
  }

  return count;
}

/* ---------- rendering imported issues + CSV export ---------- */

function renderJiraIssuesTable() {
  const tbody = document.querySelector('#jiraIssuesTable tbody');
  if (!tbody) return;
  let rows = '';
  applyFilters(workspace.projects).forEach(p => filterItems(p, p.jiraIssues).forEach(i => {
    rows += `<tr><td>${esc(i.jiraKey)}</td><td>${esc(p.name)}</td><td>${esc(releaseLabel(p, i.releaseId))}</td>
      <td>${esc(i.summary)}</td><td>${esc(i.issueType)}${i.isScope ? ' (scope)' : ''}</td><td>${esc(i.status)}</td>
      <td>${esc(i.priority)}</td><td>${esc(i.assignee)}</td><td>${esc(i.fixVersions)}</td></tr>`;
  }));
  tbody.innerHTML = rows || `<tr><td colspan="9" class="hint">${t('No Jira issues imported yet.')}</td></tr>`;
}

function exportJiraIssuesCSV() {
  let rows = [['Project', 'Release', 'Jira Key', 'Summary', 'Issue Type', 'Status', 'Status Category', 'Priority', 'Assignee', 'Fix Versions', 'Components']];
  applyFilters(workspace.projects).forEach(p => filterItems(p, p.jiraIssues).forEach(i => rows.push([
    p.name, releaseLabel(p, i.releaseId), i.jiraKey, i.summary, i.issueType, i.status, i.statusCategory, i.priority, i.assignee, i.fixVersions, i.components
  ])));
  exportCSV(rows, 'jira_issues.csv');
}
