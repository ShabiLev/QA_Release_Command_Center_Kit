/* QA Release Command Center — app logic
   Storage: IndexedDB holds all workspace data. localStorage holds one lightweight
   preference (which workspace was last open) so the app reopens where you left off. */

const DB_NAME = 'qa_release_cc_db';
const STORE = 'workspace';
const INDEX_KEY = '__workspace_index__';
const LEGACY_KEY = 'main';
const LAST_WORKSPACE_PREF = 'qa_cc_last_workspace_id';

let workspace = null;
let db;

/* ---------- sample data (inlined so it works from file:// with no fetch) ---------- */

function sampleWorkspaceData() {
  return {
    name: 'Sample QA Workspace',
    settings: { theme: 'dark', language: 'en', defaultView: 'portfolio' },
    projects: [
      {
        id: 'p1', name: 'Parking Mobile App', type: 'Mobile', owner: 'QA Lead', status: 'At Risk',
        releases: [{
          id: 'r1', version: '3.8.0', title: 'Push & Login Improvements', releaseType: 'Minor',
          targetDate: '2026-07-15', actualDate: '', qaOwner: 'Shabi', productOwner: 'PM', rdOwner: 'R&D Lead',
          supportOwner: 'CS Lead', environment: 'Staging', health: 'Yellow', decision: 'Conditional Go',
          notes: 'Payment regression and push delay risk remain open.'
        }],
        risks: [{
          id: 'R-1', releaseId: 'r1', title: 'Push notifications delayed on Android 15', probability: 'Medium',
          impact: 'High', level: 'High', owner: 'Mobile Dev', decision: 'Monitor', status: 'Open',
          evidence: 'Test results 2026-07-01'
        }],
        bugs: [{
          id: 'BUG-101', releaseId: 'r1', title: 'Payment confirmation missing on retry', severity: 'Critical',
          priority: 'P1', blocker: 'Yes', owner: 'Backend', status: 'Open', customerImpact: 'High',
          decision: 'Fix before release', evidence: 'Jira BUG-101'
        }],
        regressionItems: [{
          id: 'REG-1', releaseId: 'r1', area: 'Login', testType: 'Smoke', required: 'Yes', owner: 'QA',
          status: 'Passed', evidence: 'Smoke run #45', notes: ''
        }],
        signOffs: [{ id: 'S-1', releaseId: 'r1', role: 'QA', owner: 'Shabi', status: 'Pending', notes: 'Pending payment retest' }],
        productionChecks: [{ id: 'PC-1', releaseId: 'r1', title: 'Rollback steps verified', status: 'Ready', owner: 'DevOps', evidence: 'Confluence doc' }],
        postReleaseItems: [{ id: 'PR-1', releaseId: 'r1', category: 'Action Item', title: 'Add automated payment-retry regression test', owner: 'QA', status: 'Open', notes: '' }]
      },
      {
        id: 'p2', name: 'Daily KPI Reporting', type: 'Data/SQL', owner: 'BI QA', status: 'Healthy',
        releases: [{
          id: 'r2', version: '1.4.2', title: 'Aggregation corrections', releaseType: 'Patch',
          targetDate: '2026-07-10', actualDate: '', qaOwner: 'Shabi', productOwner: 'Data PM', rdOwner: 'DBA',
          supportOwner: 'Ops', environment: 'QA', health: 'Green', decision: 'Go',
          notes: 'Validation passed against control queries.'
        }],
        risks: [{
          id: 'R-2', releaseId: 'r2', title: 'Potential duplicate joins in monthly report', probability: 'Low',
          impact: 'High', level: 'Medium', owner: 'QA', decision: 'Monitor', status: 'Mitigated',
          evidence: 'Reconciliation file'
        }],
        bugs: [],
        regressionItems: [{
          id: 'REG-2', releaseId: 'r2', area: 'Monthly KPI', testType: 'Regression', required: 'Yes', owner: 'QA',
          status: 'Passed', evidence: 'SQL validation sheet', notes: ''
        }],
        signOffs: [{ id: 'S-2', releaseId: 'r2', role: 'QA', owner: 'Shabi', status: 'Approved', notes: '' }],
        productionChecks: [{ id: 'PC-2', releaseId: 'r2', title: 'Export encoding validated', status: 'Ready', owner: 'QA', evidence: 'Excel sample' }],
        postReleaseItems: [{ id: 'PR-2', releaseId: 'r2', category: 'What Went Well', title: 'Reconciliation caught the join issue before release', owner: 'QA', status: 'Done', notes: '' }]
      }
    ]
  };
}

/* ---------- generic helpers ---------- */

function uid(prefix) { return prefix + '-' + Math.random().toString(36).slice(2, 8); }
function nowISO() { return new Date().toISOString(); }
function esc(v) {
  return String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function csvEscape(v) { return '"' + String(v ?? '').replace(/"/g, '""') + '"'; }
function riskLevel(prob, impact) {
  if (prob === 'High' && impact === 'High') return 'Critical';
  if ((prob === 'High' && impact === 'Medium') || (prob === 'Medium' && impact === 'High')) return 'High';
  if (prob === 'Low' && impact === 'Low') return 'Low';
  return 'Medium';
}
function statusClass(dec) {
  const t = (dec || '').toLowerCase();
  if (['go', 'green', 'approved', 'ready', 'healthy', 'passed', 'verified', 'done'].some(k => t.includes(k))) return 'status-green';
  if (['conditional', 'yellow', 'pending', 'at risk', 'in progress', 'not started', 'monitor'].some(k => t.includes(k))) return 'status-yellow';
  return 'status-red';
}
function findProject(pid) { return workspace.projects.find(p => p.id === pid); }
function findInArray(arr, id) { return arr.find(x => x.id === id); }
function removeFromArray(arr, id) { const i = arr.findIndex(x => x.id === id); if (i > -1) arr.splice(i, 1); }
function downloadBlob(blob, name) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); URL.revokeObjectURL(a.href); }
function exportCSV(rows, name) { const csv = rows.map(r => r.map(csvEscape).join(',')).join('\n'); exportBlobCSV(csv, name); }
function exportBlobCSV(csv, name) { downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), name); }

/* ---------- storage layer ---------- */

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = e => {
      const d = e.target.result;
      if (!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE);
    };
    req.onsuccess = e => { db = e.target.result; resolve(); };
    req.onerror = e => reject(e);
  });
}
function dbGet(key) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = e => reject(e);
  });
}
function dbSet(key, val) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const req = tx.objectStore(STORE).put(val, key);
    req.onsuccess = () => resolve();
    req.onerror = e => reject(e);
  });
}
function getLastWorkspaceId() { try { return localStorage.getItem(LAST_WORKSPACE_PREF); } catch (e) { return null; } }
function setLastWorkspaceId(id) { try { localStorage.setItem(LAST_WORKSPACE_PREF, id); } catch (e) {} }

/* ---------- workspace factories ---------- */

function defaultWidgets() {
  return [
    { id: 'w1', title: 'Projects', type: 'projects', size: 'small', color: '#63b3ff', visible: true },
    { id: 'w2', title: 'Releases', type: 'releases', size: 'small', color: '#2ecc71', visible: true },
    { id: 'w3', title: 'Blocking Bugs', type: 'blockers', size: 'small', color: '#ff6b6b', visible: true },
    { id: 'w4', title: 'Critical Risks', type: 'risks', size: 'small', color: '#f1c40f', visible: true },
    { id: 'w5', title: 'Pending Sign-Offs', type: 'signoffs', size: 'small', color: '#9b59b6', visible: true },
    { id: 'w6', title: 'Regression Gaps', type: 'regression', size: 'small', color: '#e67e22', visible: true },
    { id: 'w7', title: 'Production Not Ready', type: 'production', size: 'small', color: '#1abc9c', visible: true },
    { id: 'w8', title: 'Open Post-Release Actions', type: 'postrelease', size: 'small', color: '#e84393', visible: true },
    { id: 'w9', title: 'Portfolio Status', type: 'portfolio', size: 'full', color: '#56ccf2', visible: true }
  ];
}
function newWorkspace(name) {
  return {
    id: uid('ws'), name: name || 'QA Workspace', createdAt: nowISO(), updatedAt: nowISO(),
    settings: { theme: 'dark' }, projects: [], snapshots: [], widgets: defaultWidgets()
  };
}
function newProject(name, type, owner) {
  return {
    id: uid('p'), name, type, owner: owner || '', status: 'Healthy',
    releases: [], risks: [], bugs: [], regressionItems: [], signOffs: [], productionChecks: [], postReleaseItems: []
  };
}
function normalizeIncomingWorkspace(data, fallbackName) {
  return {
    id: uid('ws'),
    name: data.name || fallbackName || 'Imported Workspace',
    createdAt: data.createdAt || nowISO(),
    updatedAt: nowISO(),
    settings: data.settings || { theme: 'dark' },
    projects: (data.projects || []).map(p => ({
      id: p.id || uid('p'), name: p.name || 'Untitled Project', type: p.type || 'Web', owner: p.owner || '',
      status: p.status || 'Healthy',
      releases: p.releases || [], risks: p.risks || [], bugs: p.bugs || [],
      regressionItems: p.regressionItems || [], signOffs: p.signOffs || [],
      productionChecks: p.productionChecks || [], postReleaseItems: p.postReleaseItems || []
    })),
    snapshots: data.snapshots || [],
    widgets: (data.widgets && data.widgets.length) ? data.widgets : defaultWidgets()
  };
}

/* ---------- multi-workspace index ---------- */

async function loadIndex() { return (await dbGet(INDEX_KEY)) || []; }
async function saveIndex(idx) { await dbSet(INDEX_KEY, idx); }
async function upsertIndexEntry(ws) {
  const idx = await loadIndex();
  const existing = idx.find(e => e.id === ws.id);
  if (existing) { existing.name = ws.name; existing.updatedAt = ws.updatedAt; }
  else idx.push({ id: ws.id, name: ws.name, updatedAt: ws.updatedAt });
  await saveIndex(idx);
}
async function persistWorkspace() {
  workspace.updatedAt = nowISO();
  await dbSet(workspace.id, workspace);
  await upsertIndexEntry(workspace);
  setLastWorkspaceId(workspace.id);
}
async function switchWorkspace(id) {
  const data = await dbGet(id);
  if (!data) return;
  workspace = data;
  setLastWorkspaceId(id);
  renderAll();
}
async function createNewWorkspacePrompt() {
  const name = prompt('New workspace name:', 'New QA Workspace');
  if (name === null || !name.trim()) return;
  workspace = newWorkspace(name.trim());
  await persistWorkspace();
  renderAll();
}
async function deleteCurrentWorkspace() {
  const idx = await loadIndex();
  if (idx.length <= 1) { alert('You need at least one workspace. Create another before deleting this one.'); return; }
  if (!confirm(`Delete workspace "${workspace.name}"? This cannot be undone.`)) return;
  const remaining = idx.filter(e => e.id !== workspace.id);
  await saveIndex(remaining);
  await switchWorkspace(remaining[0].id);
}

async function saveWorkspace() {
  const nameInput = document.getElementById('workspaceName');
  if (nameInput) workspace.name = nameInput.value || workspace.name;
  await persistWorkspace();
  renderAll();
}

/* ---------- app bootstrap ---------- */

async function bootstrapWorkspace() {
  let idx = await loadIndex();

  if (idx.length === 0) {
    // migrate a pre-multi-workspace install if one exists
    const legacy = await dbGet(LEGACY_KEY);
    if (legacy) {
      workspace = normalizeIncomingWorkspace(legacy, legacy.name);
      await persistWorkspace();
      idx = await loadIndex();
    } else {
      workspace = normalizeIncomingWorkspace(sampleWorkspaceData(), 'Sample QA Workspace');
      await persistWorkspace();
      idx = await loadIndex();
    }
  } else {
    const lastId = getLastWorkspaceId();
    const target = idx.find(e => e.id === lastId) || idx[0];
    workspace = await dbGet(target.id);
    if (!workspace) { workspace = normalizeIncomingWorkspace(sampleWorkspaceData(), 'Sample QA Workspace'); await persistWorkspace(); }
  }
}

/* ---------- project CRUD ---------- */

function addProject() {
  const name = document.getElementById('newProjectName').value.trim();
  const type = document.getElementById('newProjectType').value;
  if (!name) { alert('Enter a project name first.'); return; }
  workspace.projects.push(newProject(name, type));
  document.getElementById('newProjectName').value = '';
  saveWorkspace();
}
function editProject(id) {
  const p = findProject(id); if (!p) return;
  const name = prompt('Project name:', p.name); if (name === null) return;
  const owner = prompt('Owner:', p.owner); if (owner === null) return;
  const status = prompt('Status (Healthy / At Risk / Blocked / On Hold):', p.status); if (status === null) return;
  p.name = name || p.name; p.owner = owner; p.status = status || p.status;
  saveWorkspace();
}
function removeProject(id) {
  if (!confirm('Delete this project and everything in it (releases, risks, bugs, etc.)? This cannot be undone.')) return;
  workspace.projects = workspace.projects.filter(p => p.id !== id);
  saveWorkspace();
}

/* ---------- release CRUD ---------- */

function addRelease() {
  const pid = document.getElementById('releaseProjectSelect').value;
  const p = findProject(pid); if (!p) { alert('Add a project first.'); return; }
  p.releases.push({
    id: uid('r'), version: document.getElementById('releaseVersion').value || 'New',
    title: document.getElementById('releaseTitle').value || '', releaseType: document.getElementById('releaseType').value,
    targetDate: document.getElementById('releaseDate').value, actualDate: '', qaOwner: '', productOwner: '',
    rdOwner: '', supportOwner: '', environment: 'QA', health: 'Yellow', decision: 'Need More Data', notes: ''
  });
  document.getElementById('releaseVersion').value = ''; document.getElementById('releaseTitle').value = '';
  saveWorkspace();
}
function updateRelease(pid, rid, field, value) {
  const p = findProject(pid); const r = p && findInArray(p.releases, rid); if (!r) return;
  r[field] = value; saveWorkspace();
}
function editRelease(pid, rid) {
  const p = findProject(pid); const r = p && findInArray(p.releases, rid); if (!r) return;
  const version = prompt('Version:', r.version); if (version === null) return;
  const title = prompt('Title:', r.title); if (title === null) return;
  const notes = prompt('Notes:', r.notes); if (notes === null) return;
  r.version = version; r.title = title; r.notes = notes; saveWorkspace();
}
function deleteRelease(pid, rid) {
  const p = findProject(pid); if (!p) return;
  if (!confirm('Delete this release?')) return;
  removeFromArray(p.releases, rid); saveWorkspace();
}
function addSampleRelease() {
  if (!workspace.projects.length) { alert('Add a project first'); return; }
  const p = workspace.projects[0];
  p.releases.push({
    id: uid('r'), version: '1.0.0', title: 'Sample release', releaseType: 'Minor',
    targetDate: new Date().toISOString().slice(0, 10), actualDate: '', qaOwner: 'QA', productOwner: 'PM',
    rdOwner: 'R&D', supportOwner: 'Support', environment: 'Staging', health: 'Yellow',
    decision: 'Conditional Go', notes: 'Generated sample'
  });
  saveWorkspace();
}

/* ---------- risk CRUD ---------- */

function addRisk() {
  const pid = document.getElementById('riskProject').value;
  const p = findProject(pid); if (!p) { alert('Add a project first.'); return; }
  const prob = document.getElementById('riskProbability').value, imp = document.getElementById('riskImpact').value;
  p.risks.push({
    id: uid('R'), title: document.getElementById('riskTitle').value || 'New risk', probability: prob, impact: imp,
    level: riskLevel(prob, imp), owner: document.getElementById('riskOwner').value || '', decision: 'Monitor',
    status: 'Open', evidence: ''
  });
  document.getElementById('riskTitle').value = ''; document.getElementById('riskOwner').value = '';
  saveWorkspace();
}
function updateRiskField(pid, rid, field, value) {
  const p = findProject(pid); const r = p && findInArray(p.risks, rid); if (!r) return;
  r[field] = value;
  if (field === 'probability' || field === 'impact') r.level = riskLevel(r.probability, r.impact);
  saveWorkspace();
}
function editRisk(pid, rid) {
  const p = findProject(pid); const r = p && findInArray(p.risks, rid); if (!r) return;
  const title = prompt('Risk title:', r.title); if (title === null) return;
  const owner = prompt('Owner:', r.owner); if (owner === null) return;
  const evidence = prompt('Evidence / link:', r.evidence); if (evidence === null) return;
  r.title = title; r.owner = owner; r.evidence = evidence; saveWorkspace();
}
function deleteRisk(pid, rid) {
  const p = findProject(pid); if (!p) return;
  if (!confirm('Delete this risk?')) return;
  removeFromArray(p.risks, rid); saveWorkspace();
}

/* ---------- bug CRUD ---------- */

function addBug() {
  const pid = document.getElementById('bugProject').value;
  const p = findProject(pid); if (!p) { alert('Add a project first.'); return; }
  p.bugs.push({
    id: uid('BUG'), title: document.getElementById('bugTitle').value || 'New bug',
    severity: document.getElementById('bugSeverity').value, priority: document.getElementById('bugPriority').value,
    blocker: document.getElementById('bugBlocker').value, owner: document.getElementById('bugOwner').value || '',
    status: 'Open'
  });
  document.getElementById('bugTitle').value = ''; document.getElementById('bugOwner').value = '';
  saveWorkspace();
}
function updateBugField(pid, bid, field, value) {
  const p = findProject(pid); const b = p && findInArray(p.bugs, bid); if (!b) return;
  b[field] = value; saveWorkspace();
}
function editBug(pid, bid) {
  const p = findProject(pid); const b = p && findInArray(p.bugs, bid); if (!b) return;
  const title = prompt('Bug title:', b.title); if (title === null) return;
  const owner = prompt('Owner:', b.owner); if (owner === null) return;
  b.title = title; b.owner = owner; saveWorkspace();
}
function deleteBug(pid, bid) {
  const p = findProject(pid); if (!p) return;
  if (!confirm('Delete this bug?')) return;
  removeFromArray(p.bugs, bid); saveWorkspace();
}

/* ---------- sign-off CRUD ---------- */

function addSignoff() {
  const pid = document.getElementById('signoffProject').value;
  const p = findProject(pid); if (!p) { alert('Add a project first.'); return; }
  p.signOffs.push({
    id: uid('SO'), role: document.getElementById('signoffRole').value,
    owner: document.getElementById('signoffOwner').value || '', status: document.getElementById('signoffStatus').value, notes: ''
  });
  document.getElementById('signoffOwner').value = '';
  saveWorkspace();
}
function updateSignoffField(pid, sid, field, value) {
  const p = findProject(pid); const s = p && findInArray(p.signOffs, sid); if (!s) return;
  s[field] = value; saveWorkspace();
}
function editSignoff(pid, sid) {
  const p = findProject(pid); const s = p && findInArray(p.signOffs, sid); if (!s) return;
  const owner = prompt('Owner:', s.owner); if (owner === null) return;
  const notes = prompt('Notes:', s.notes); if (notes === null) return;
  s.owner = owner; s.notes = notes; saveWorkspace();
}
function deleteSignoff(pid, sid) {
  const p = findProject(pid); if (!p) return;
  if (!confirm('Delete this sign-off?')) return;
  removeFromArray(p.signOffs, sid); saveWorkspace();
}

/* ---------- regression CRUD ---------- */

function addRegressionItem() {
  const pid = document.getElementById('regressionProject').value;
  const p = findProject(pid); if (!p) { alert('Add a project first.'); return; }
  p.regressionItems.push({
    id: uid('REG'), area: document.getElementById('regressionArea').value || 'New area',
    testType: document.getElementById('regressionTestType').value, required: document.getElementById('regressionRequired').value,
    owner: document.getElementById('regressionOwner').value || '', status: 'Not Started', evidence: '', notes: ''
  });
  document.getElementById('regressionArea').value = ''; document.getElementById('regressionOwner').value = '';
  saveWorkspace();
}
function updateRegressionField(pid, id, field, value) {
  const p = findProject(pid); const r = p && findInArray(p.regressionItems, id); if (!r) return;
  r[field] = value; saveWorkspace();
}
function editRegressionItem(pid, id) {
  const p = findProject(pid); const r = p && findInArray(p.regressionItems, id); if (!r) return;
  const area = prompt('Area:', r.area); if (area === null) return;
  const owner = prompt('Owner:', r.owner); if (owner === null) return;
  const evidence = prompt('Evidence (test run link, report, etc.):', r.evidence); if (evidence === null) return;
  r.area = area; r.owner = owner; r.evidence = evidence; saveWorkspace();
}
function deleteRegressionItem(pid, id) {
  const p = findProject(pid); if (!p) return;
  if (!confirm('Delete this regression item?')) return;
  removeFromArray(p.regressionItems, id); saveWorkspace();
}

/* ---------- production readiness CRUD ---------- */

function addProductionCheck() {
  const pid = document.getElementById('productionProject').value;
  const p = findProject(pid); if (!p) { alert('Add a project first.'); return; }
  p.productionChecks.push({
    id: uid('PC'), title: document.getElementById('productionTitle').value || 'New check',
    status: 'Not Ready', owner: document.getElementById('productionOwner').value || '', evidence: ''
  });
  document.getElementById('productionTitle').value = ''; document.getElementById('productionOwner').value = '';
  saveWorkspace();
}
function updateProductionField(pid, id, field, value) {
  const p = findProject(pid); const c = p && findInArray(p.productionChecks, id); if (!c) return;
  c[field] = value; saveWorkspace();
}
function editProductionCheck(pid, id) {
  const p = findProject(pid); const c = p && findInArray(p.productionChecks, id); if (!c) return;
  const title = prompt('Check title:', c.title); if (title === null) return;
  const owner = prompt('Owner:', c.owner); if (owner === null) return;
  const evidence = prompt('Evidence (runbook link, doc, etc.):', c.evidence); if (evidence === null) return;
  c.title = title; c.owner = owner; c.evidence = evidence; saveWorkspace();
}
function deleteProductionCheck(pid, id) {
  const p = findProject(pid); if (!p) return;
  if (!confirm('Delete this production readiness check?')) return;
  removeFromArray(p.productionChecks, id); saveWorkspace();
}

/* ---------- post-release CRUD ---------- */

function addPostReleaseItem() {
  const pid = document.getElementById('postReleaseProject').value;
  const p = findProject(pid); if (!p) { alert('Add a project first.'); return; }
  p.postReleaseItems.push({
    id: uid('PR'), category: document.getElementById('postReleaseCategory').value,
    title: document.getElementById('postReleaseTitle').value || 'New item',
    owner: document.getElementById('postReleaseOwner').value || '', status: 'Open', notes: ''
  });
  document.getElementById('postReleaseTitle').value = ''; document.getElementById('postReleaseOwner').value = '';
  saveWorkspace();
}
function updatePostReleaseField(pid, id, field, value) {
  const p = findProject(pid); const item = p && findInArray(p.postReleaseItems, id); if (!item) return;
  item[field] = value; saveWorkspace();
}
function editPostReleaseItem(pid, id) {
  const p = findProject(pid); const item = p && findInArray(p.postReleaseItems, id); if (!item) return;
  const title = prompt('Title:', item.title); if (title === null) return;
  const owner = prompt('Owner:', item.owner); if (owner === null) return;
  const notes = prompt('Notes:', item.notes); if (notes === null) return;
  item.title = title; item.owner = owner; item.notes = notes; saveWorkspace();
}
function deletePostReleaseItem(pid, id) {
  const p = findProject(pid); if (!p) return;
  if (!confirm('Delete this post-release item?')) return;
  removeFromArray(p.postReleaseItems, id); saveWorkspace();
}

/* ---------- widgets ---------- */

function widgetMetric() {
  const totalProjects = workspace.projects.length;
  const totalReleases = workspace.projects.reduce((a, p) => a + p.releases.length, 0);
  const blockers = workspace.projects.reduce((a, p) => a + p.bugs.filter(b => b.status !== 'Closed' && b.status !== "Won't Fix" && (b.blocker === 'Yes' || b.severity === 'Critical')).length, 0);
  const risks = workspace.projects.reduce((a, p) => a + p.risks.filter(r => ['High', 'Critical'].includes(r.level) && !['Mitigated', 'Closed', 'Accepted'].includes(r.status)).length, 0);
  const signoffs = workspace.projects.reduce((a, p) => a + p.signOffs.filter(s => s.status !== 'Approved').length, 0);
  const regression = workspace.projects.reduce((a, p) => a + p.regressionItems.filter(r => r.required === 'Yes' && r.status !== 'Passed').length, 0);
  const production = workspace.projects.reduce((a, p) => a + p.productionChecks.filter(c => c.status !== 'Ready' && c.status !== 'Verified').length, 0);
  const postrelease = workspace.projects.reduce((a, p) => a + p.postReleaseItems.filter(i => i.status === 'Open').length, 0);
  return { projects: totalProjects, releases: totalReleases, blockers, risks, signoffs, regression, production, postrelease };
}
function renderWidgets() {
  const area = document.getElementById('widgetArea'); area.innerHTML = '';
  const m = widgetMetric();
  workspace.widgets.filter(w => w.visible !== false).forEach(w => {
    const div = document.createElement('div');
    div.className = 'widget ' + (w.size || 'small');
    div.innerHTML = `<div class="widget-header"><div><h3>${esc(w.title)}</h3><div class="sub">${esc(w.type)}</div></div>
      <div class="controls">
        <select class="tip" data-tip="Change how much space this widget takes on the dashboard grid." onchange="changeWidgetSize('${w.id}',this.value)">
          <option ${w.size === 'small' ? 'selected' : ''}>small</option><option ${w.size === 'medium' ? 'selected' : ''}>medium</option>
          <option ${w.size === 'large' ? 'selected' : ''}>large</option><option ${w.size === 'full' ? 'selected' : ''}>full</option>
        </select>
        <input class="tip" data-tip="Change this widget's accent color." type="color" value="${w.color || '#63b3ff'}" onchange="changeWidgetColor('${w.id}',this.value)"/>
        <button class="btn-sm tip" data-tip="Hide this widget from the dashboard. Use 'Reset Widgets' in the sidebar to bring it back." onclick="toggleWidget('${w.id}')">Hide</button>
      </div></div>`;
    let body = '';
    if (w.type === 'projects') body = `<div class="metric">${m.projects}</div><div class="sub">Active projects in workspace</div>`;
    else if (w.type === 'releases') body = `<div class="metric">${m.releases}</div><div class="sub">Tracked releases</div>`;
    else if (w.type === 'blockers') body = `<div class="metric">${m.blockers}</div><div class="sub">Open critical or blocking bugs</div>`;
    else if (w.type === 'risks') body = `<div class="metric">${m.risks}</div><div class="sub">Open high/critical risks</div>`;
    else if (w.type === 'signoffs') body = `<div class="metric">${m.signoffs}</div><div class="sub">Pending sign-offs</div>`;
    else if (w.type === 'regression') body = `<div class="metric">${m.regression}</div><div class="sub">Required regression items not yet passed</div>`;
    else if (w.type === 'production') body = `<div class="metric">${m.production}</div><div class="sub">Production checks not yet ready</div>`;
    else if (w.type === 'postrelease') body = `<div class="metric">${m.postrelease}</div><div class="sub">Open post-release action items</div>`;
    else if (w.type === 'portfolio') body = `<table><thead><tr>
        <th class="tip" data-tip="Project name.">Project</th>
        <th class="tip" data-tip="Overall project health you set via Edit on the project list.">Status</th>
        <th class="tip" data-tip="Total releases tracked for this project.">Releases</th>
        <th class="tip" data-tip="Risks not yet mitigated, accepted, or closed.">Open Risks</th>
        <th class="tip" data-tip="Bugs not yet closed or won't-fix.">Open Bugs</th>
        <th class="tip" data-tip="Required regression items that have not passed yet.">Regression Gaps</th>
        <th class="tip" data-tip="Production readiness checks not yet Ready or Verified.">Prod Not Ready</th>
        <th class="tip" data-tip="Post-release action items still open.">Post-Release Open</th>
      </tr></thead><tbody>${workspace.projects.map(p => `<tr>
        <td>${esc(p.name)}</td><td class="${statusClass(p.status)}">${esc(p.status)}</td><td>${p.releases.length}</td>
        <td>${p.risks.filter(r => !['Mitigated', 'Closed', 'Accepted'].includes(r.status)).length}</td>
        <td>${p.bugs.filter(b => !['Closed', "Won't Fix"].includes(b.status)).length}</td>
        <td>${p.regressionItems.filter(r => r.required === 'Yes' && r.status !== 'Passed').length}</td>
        <td>${p.productionChecks.filter(c => !['Ready', 'Verified'].includes(c.status)).length}</td>
        <td>${p.postReleaseItems.filter(i => i.status === 'Open').length}</td>
      </tr>`).join('')}</tbody></table>`;
    div.innerHTML += `<div style="border-top:3px solid ${w.color || '#63b3ff'};padding-top:10px">${body}</div>`;
    area.appendChild(div);
  });
}
function changeWidgetSize(id, size) { const w = workspace.widgets.find(x => x.id === id); if (w) { w.size = size; saveWorkspace(); } }
function changeWidgetColor(id, color) { const w = workspace.widgets.find(x => x.id === id); if (w) { w.color = color; saveWorkspace(); } }
function toggleWidget(id) { const w = workspace.widgets.find(x => x.id === id); if (w) { w.visible = false; saveWorkspace(); } }
function resetWidgets() {
  if (workspace.widgets.length < defaultWidgets().length) workspace.widgets = defaultWidgets();
  else workspace.widgets.forEach(w => w.visible = true);
  saveWorkspace();
}

/* ---------- export / import ---------- */

function exportJSON() {
  const blob = new Blob([JSON.stringify(workspace, null, 2)], { type: 'application/json' });
  downloadBlob(blob, (workspace.name || 'workspace').replace(/\s+/g, '_') + '.json');
}
function snapshotWorkspace() {
  workspace.snapshots.push({ at: nowISO(), data: JSON.parse(JSON.stringify(workspace)) });
  saveWorkspace();
  alert('Snapshot saved inside this workspace (see exported JSON > snapshots[]).');
}
function importJSONFile(file) {
  const reader = new FileReader();
  reader.onload = async () => {
    let incoming;
    try { incoming = JSON.parse(reader.result); }
    catch (e) { alert('That file is not valid JSON. Import cancelled — your current workspace is unchanged.'); return; }
    workspace = normalizeIncomingWorkspace(incoming, file.name.replace(/\.json$/i, ''));
    await persistWorkspace();
    renderAll();
    alert(`Imported as a new workspace: "${workspace.name}". Your previous workspace is still available from the workspace selector.`);
  };
  reader.readAsText(file);
}
function exportRisksCSV() {
  let rows = [['Project', 'ID', 'Risk', 'Probability', 'Impact', 'Level', 'Owner', 'Decision', 'Status']];
  workspace.projects.forEach(p => p.risks.forEach(r => rows.push([p.name, r.id, r.title, r.probability, r.impact, r.level, r.owner, r.decision, r.status])));
  exportCSV(rows, 'risks.csv');
}
function exportBugsCSV() {
  let rows = [['Project', 'ID', 'Title', 'Severity', 'Priority', 'Blocker', 'Owner', 'Status']];
  workspace.projects.forEach(p => p.bugs.forEach(b => rows.push([p.name, b.id, b.title, b.severity, b.priority, b.blocker, b.owner, b.status])));
  exportCSV(rows, 'bugs.csv');
}
function exportRegressionCSV() {
  let rows = [['Project', 'ID', 'Area', 'Test Type', 'Required', 'Owner', 'Status', 'Evidence']];
  workspace.projects.forEach(p => p.regressionItems.forEach(r => rows.push([p.name, r.id, r.area, r.testType, r.required, r.owner, r.status, r.evidence])));
  exportCSV(rows, 'regression.csv');
}
function exportProductionCSV() {
  let rows = [['Project', 'ID', 'Check', 'Status', 'Owner', 'Evidence']];
  workspace.projects.forEach(p => p.productionChecks.forEach(c => rows.push([p.name, c.id, c.title, c.status, c.owner, c.evidence])));
  exportCSV(rows, 'production_readiness.csv');
}
function exportPostReleaseCSV() {
  let rows = [['Project', 'ID', 'Category', 'Title', 'Owner', 'Status', 'Notes']];
  workspace.projects.forEach(p => p.postReleaseItems.forEach(i => rows.push([p.name, i.id, i.category, i.title, i.owner, i.status, i.notes])));
  exportCSV(rows, 'post_release.csv');
}

/* ---------- render ---------- */

function renderWorkspaceSwitcher(idx) {
  const sel = document.getElementById('workspaceSwitcher'); if (!sel) return;
  sel.innerHTML = idx.map(e => `<option value="${esc(e.id)}" ${e.id === workspace.id ? 'selected' : ''}>${esc(e.name)}</option>`).join('');
}
function renderProjectSelectors() {
  const opts = workspace.projects.map(p => `<option value="${esc(p.id)}">${esc(p.name)}</option>`).join('');
  ['releaseProjectSelect', 'riskProject', 'bugProject', 'signoffProject', 'regressionProject', 'productionProject', 'postReleaseProject']
    .forEach(id => { const el = document.getElementById(id); if (el) el.innerHTML = opts; });
  document.getElementById('projectList').innerHTML = workspace.projects.map(p => `<div class="project-item">
      <span>${esc(p.name)} <span class="hint">(${esc(p.type)} · ${esc(p.status)})</span></span>
      <span class="row-actions">
        <button class="btn-sm tip" data-tip="Edit this project's name, owner, or status." onclick="editProject('${p.id}')">Edit</button>
        <button class="btn-sm danger tip" data-tip="Permanently delete this project and all its releases, risks, bugs, etc." onclick="removeProject('${p.id}')">Delete</button>
      </span></div>`).join('') || '<div class="hint">No projects yet — add one above.</div>';
}
function renderReleases() {
  const tbody = document.querySelector('#releasesTable tbody'); let rows = '';
  workspace.projects.forEach(p => p.releases.forEach(r => {
    rows += `<tr><td>${esc(p.name)}</td><td>${esc(r.version)}</td><td>${esc(r.title)}</td><td>${esc(r.releaseType)}</td><td>${esc(r.targetDate)}</td>
      <td><select class="tip" data-tip="Overall QA confidence for this release." onchange="updateRelease('${p.id}','${r.id}','health',this.value)">
        ${['Green', 'Yellow', 'Red'].map(v => `<option ${r.health === v ? 'selected' : ''}>${v}</option>`).join('')}</select></td>
      <td><select class="tip" data-tip="Go/No-Go call for this release." onchange="updateRelease('${p.id}','${r.id}','decision',this.value)">
        ${['Go', 'Conditional Go', 'No Go', 'Need More Data'].map(v => `<option ${r.decision === v ? 'selected' : ''}>${v}</option>`).join('')}</select></td>
      <td class="row-actions"><button class="btn-sm tip" data-tip="Edit version, title, and notes." onclick="editRelease('${p.id}','${r.id}')">Edit</button>
        <button class="btn-sm danger tip" data-tip="Delete this release." onclick="deleteRelease('${p.id}','${r.id}')">Delete</button></td></tr>`;
  }));
  tbody.innerHTML = rows || `<tr><td colspan="8" class="hint">No releases yet.</td></tr>`;
}
function renderRisks() {
  const tbody = document.querySelector('#risksTable tbody'); let rows = '';
  workspace.projects.forEach(p => p.risks.forEach(r => {
    rows += `<tr><td>${esc(r.id)}</td><td>${esc(p.name)}</td><td>${esc(r.title)}</td>
      <td><select class="tip" data-tip="How likely is this risk to happen?" onchange="updateRiskField('${p.id}','${r.id}','probability',this.value)">
        ${['Low', 'Medium', 'High'].map(v => `<option ${r.probability === v ? 'selected' : ''}>${v}</option>`).join('')}</select></td>
      <td><select class="tip" data-tip="How bad would it be if this risk happens?" onchange="updateRiskField('${p.id}','${r.id}','impact',this.value)">
        ${['Low', 'Medium', 'High'].map(v => `<option ${r.impact === v ? 'selected' : ''}>${v}</option>`).join('')}</select></td>
      <td class="${statusClass(r.level)} tip" data-tip="Computed automatically from Probability x Impact.">${esc(r.level)}</td>
      <td><select class="tip" data-tip="Current handling status of this risk." onchange="updateRiskField('${p.id}','${r.id}','status',this.value)">
        ${['Open', 'Monitoring', 'Mitigated', 'Accepted', 'Closed'].map(v => `<option ${r.status === v ? 'selected' : ''}>${v}</option>`).join('')}</select></td>
      <td class="row-actions"><button class="btn-sm tip" data-tip="Edit title, owner, and evidence." onclick="editRisk('${p.id}','${r.id}')">Edit</button>
        <button class="btn-sm danger tip" data-tip="Delete this risk." onclick="deleteRisk('${p.id}','${r.id}')">Delete</button></td></tr>`;
  }));
  tbody.innerHTML = rows || `<tr><td colspan="8" class="hint">No risks logged yet.</td></tr>`;
}
function renderBugs() {
  const tbody = document.querySelector('#bugsTable tbody'); let rows = '';
  workspace.projects.forEach(p => p.bugs.forEach(b => {
    rows += `<tr><td>${esc(b.id)}</td><td>${esc(p.name)}</td><td>${esc(b.title)}</td>
      <td><select class="tip" data-tip="How severe is this bug's impact?" onchange="updateBugField('${p.id}','${b.id}','severity',this.value)">
        ${['Low', 'Medium', 'High', 'Critical'].map(v => `<option ${b.severity === v ? 'selected' : ''}>${v}</option>`).join('')}</select></td>
      <td><select class="tip" data-tip="How urgently should this be fixed?" onchange="updateBugField('${p.id}','${b.id}','priority',this.value)">
        ${['P4', 'P3', 'P2', 'P1', 'P0'].map(v => `<option ${b.priority === v ? 'selected' : ''}>${v}</option>`).join('')}</select></td>
      <td><select class="tip" data-tip="Does this bug block the release?" onchange="updateBugField('${p.id}','${b.id}','blocker',this.value)">
        ${['No', 'Yes'].map(v => `<option ${b.blocker === v ? 'selected' : ''}>${v}</option>`).join('')}</select></td>
      <td><select class="tip" data-tip="Current fix status." onchange="updateBugField('${p.id}','${b.id}','status',this.value)">
        ${['Open', 'In Progress', 'Fixed', 'Verified', 'Closed', "Won't Fix"].map(v => `<option ${b.status === v ? 'selected' : ''}>${v}</option>`).join('')}</select></td>
      <td class="row-actions"><button class="btn-sm tip" data-tip="Edit title and owner." onclick="editBug('${p.id}','${b.id}')">Edit</button>
        <button class="btn-sm danger tip" data-tip="Delete this bug." onclick="deleteBug('${p.id}','${b.id}')">Delete</button></td></tr>`;
  }));
  tbody.innerHTML = rows || `<tr><td colspan="8" class="hint">No bugs logged yet.</td></tr>`;
}
function renderSignoffs() {
  const tbody = document.querySelector('#signoffsTable tbody'); let rows = '';
  workspace.projects.forEach(p => p.signOffs.forEach(s => {
    rows += `<tr><td>${esc(s.id)}</td><td>${esc(p.name)}</td><td>${esc(s.role)}</td><td>${esc(s.owner)}</td>
      <td><select class="tip" data-tip="Has this stakeholder signed off on the release?" onchange="updateSignoffField('${p.id}','${s.id}','status',this.value)">
        ${['Pending', 'Approved', 'Rejected'].map(v => `<option ${s.status === v ? 'selected' : ''}>${v}</option>`).join('')}</select></td>
      <td class="row-actions"><button class="btn-sm tip" data-tip="Edit owner and notes." onclick="editSignoff('${p.id}','${s.id}')">Edit</button>
        <button class="btn-sm danger tip" data-tip="Delete this sign-off." onclick="deleteSignoff('${p.id}','${s.id}')">Delete</button></td></tr>`;
  }));
  tbody.innerHTML = rows || `<tr><td colspan="6" class="hint">No sign-offs logged yet.</td></tr>`;
}
function renderRegression() {
  const tbody = document.querySelector('#regressionTable tbody'); if (!tbody) return; let rows = '';
  workspace.projects.forEach(p => p.regressionItems.forEach(r => {
    rows += `<tr><td>${esc(r.id)}</td><td>${esc(p.name)}</td><td>${esc(r.area)}</td><td>${esc(r.testType)}</td>
      <td><select class="tip" data-tip="Is this test required before release?" onchange="updateRegressionField('${p.id}','${r.id}','required',this.value)">
        ${['Yes', 'No'].map(v => `<option ${r.required === v ? 'selected' : ''}>${v}</option>`).join('')}</select></td>
      <td><select class="tip" data-tip="Current test run status." onchange="updateRegressionField('${p.id}','${r.id}','status',this.value)">
        ${['Not Started', 'In Progress', 'Passed', 'Failed', 'Blocked'].map(v => `<option ${r.status === v ? 'selected' : ''}>${v}</option>`).join('')}</select></td>
      <td>${esc(r.owner)}</td>
      <td class="row-actions"><button class="btn-sm tip" data-tip="Edit area, owner, and evidence." onclick="editRegressionItem('${p.id}','${r.id}')">Edit</button>
        <button class="btn-sm danger tip" data-tip="Delete this regression item." onclick="deleteRegressionItem('${p.id}','${r.id}')">Delete</button></td></tr>`;
  }));
  tbody.innerHTML = rows || `<tr><td colspan="8" class="hint">No regression items logged yet.</td></tr>`;
}
function renderProduction() {
  const tbody = document.querySelector('#productionTable tbody'); if (!tbody) return; let rows = '';
  workspace.projects.forEach(p => p.productionChecks.forEach(c => {
    rows += `<tr><td>${esc(c.id)}</td><td>${esc(p.name)}</td><td>${esc(c.title)}</td>
      <td><select class="tip" data-tip="Is this deployment prerequisite ready?" onchange="updateProductionField('${p.id}','${c.id}','status',this.value)">
        ${['Not Ready', 'In Progress', 'Ready', 'Verified'].map(v => `<option ${c.status === v ? 'selected' : ''}>${v}</option>`).join('')}</select></td>
      <td>${esc(c.owner)}</td>
      <td class="row-actions"><button class="btn-sm tip" data-tip="Edit title, owner, and evidence." onclick="editProductionCheck('${p.id}','${c.id}')">Edit</button>
        <button class="btn-sm danger tip" data-tip="Delete this check." onclick="deleteProductionCheck('${p.id}','${c.id}')">Delete</button></td></tr>`;
  }));
  tbody.innerHTML = rows || `<tr><td colspan="6" class="hint">No production readiness checks logged yet.</td></tr>`;
}
function renderPostRelease() {
  const tbody = document.querySelector('#postReleaseTable tbody'); if (!tbody) return; let rows = '';
  workspace.projects.forEach(p => p.postReleaseItems.forEach(i => {
    rows += `<tr><td>${esc(i.id)}</td><td>${esc(p.name)}</td>
      <td><select class="tip" data-tip="What kind of retrospective note is this?" onchange="updatePostReleaseField('${p.id}','${i.id}','category',this.value)">
        ${['What Went Well', 'What Went Wrong', 'Action Item'].map(v => `<option ${i.category === v ? 'selected' : ''}>${v}</option>`).join('')}</select></td>
      <td>${esc(i.title)}</td><td>${esc(i.owner)}</td>
      <td><select class="tip" data-tip="Has this retrospective item been actioned?" onchange="updatePostReleaseField('${p.id}','${i.id}','status',this.value)">
        ${['Open', 'Done'].map(v => `<option ${i.status === v ? 'selected' : ''}>${v}</option>`).join('')}</select></td>
      <td class="row-actions"><button class="btn-sm tip" data-tip="Edit title, owner, and notes." onclick="editPostReleaseItem('${p.id}','${i.id}')">Edit</button>
        <button class="btn-sm danger tip" data-tip="Delete this item." onclick="deletePostReleaseItem('${p.id}','${i.id}')">Delete</button></td></tr>`;
  }));
  tbody.innerHTML = rows || `<tr><td colspan="7" class="hint">No post-release items logged yet.</td></tr>`;
}

async function renderAll() {
  document.getElementById('workspaceName').value = workspace.name || '';
  const idx = await loadIndex();
  renderWorkspaceSwitcher(idx);
  renderProjectSelectors();
  renderWidgets();
  renderReleases();
  renderRisks();
  renderBugs();
  renderSignoffs();
  renderRegression();
  renderProduction();
  renderPostRelease();
}

/* ---------- init ---------- */

window.addEventListener('DOMContentLoaded', async () => {
  await openDB();
  await bootstrapWorkspace();
  await renderAll();
  document.getElementById('importFile').addEventListener('change', e => { if (e.target.files[0]) importJSONFile(e.target.files[0]); });
  document.getElementById('workspaceSwitcher').addEventListener('change', e => switchWorkspace(e.target.value));
  document.getElementById('newWorkspaceBtn').addEventListener('click', createNewWorkspacePrompt);
  document.getElementById('deleteWorkspaceBtn').addEventListener('click', deleteCurrentWorkspace);
});
