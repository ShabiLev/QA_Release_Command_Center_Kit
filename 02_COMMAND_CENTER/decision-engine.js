/* QA Release Command Center — Go/No-Go decision engine.
   Pure rules-based scoring over a single project+release's linked risks/bugs/regression/
   sign-offs/production-checks. No network calls, no external data — everything comes from
   the workspace object already loaded by app.js. */

function getReleaseLinkedItems(project, releaseId) {
  const match = arr => (arr || []).filter(i => i.releaseId === releaseId);
  return {
    risks: match(project.risks),
    bugs: match(project.bugs),
    regressionItems: match(project.regressionItems),
    signOffs: match(project.signOffs),
    productionChecks: match(project.productionChecks)
  };
}

function calculateReleaseDecision(projectId, releaseId) {
  const project = findProject(projectId);
  if (!project || !releaseId) {
    return {
      decision: 'Need More Data', score: 0,
      reasons: ['No project and release are selected.'],
      requiredActions: ['Select a specific project and release in the filter bar.']
    };
  }
  const release = (project.releases || []).find(r => r.id === releaseId);
  if (!release) {
    return {
      decision: 'Need More Data', score: 0,
      reasons: ['The selected release could not be found.'],
      requiredActions: ['Select a valid release in the filter bar.']
    };
  }

  const items = getReleaseLinkedItems(project, releaseId);
  const requiredActions = [];
  let score = 100;

  const openBlockerOrCriticalBugs = items.bugs.filter(b => !['Closed', "Won't Fix"].includes(b.status) && (b.blocker === 'Yes' || b.severity === 'Critical'));
  const openCriticalRisks = items.risks.filter(r => r.level === 'Critical' && !['Mitigated', 'Closed', 'Accepted'].includes(r.status));
  const failedRequiredRegression = items.regressionItems.filter(r => r.required === 'Yes' && r.status === 'Failed');
  const failedRollbackCheck = items.productionChecks.filter(c => c.status === 'Not Ready' && /rollback/i.test(c.title || ''));
  const rejectedSignOffs = items.signOffs.filter(s => s.status === 'Rejected');

  // ---- No-Go: hard blockers ----
  const noGoReasons = [];
  if (openBlockerOrCriticalBugs.length) {
    noGoReasons.push(`${openBlockerOrCriticalBugs.length} open blocker/Critical bug(s): ${openBlockerOrCriticalBugs.map(b => b.id).join(', ')}`);
    requiredActions.push('Fix, downgrade, or defer every open blocker/Critical bug.');
    score -= 40;
  }
  if (openCriticalRisks.length) {
    noGoReasons.push(`${openCriticalRisks.length} open Critical risk(s): ${openCriticalRisks.map(r => r.id).join(', ')}`);
    requiredActions.push('Mitigate or formally accept every open Critical risk.');
    score -= 30;
  }
  if (failedRequiredRegression.length) {
    noGoReasons.push(`${failedRequiredRegression.length} failed required regression item(s): ${failedRequiredRegression.map(r => r.id).join(', ')}`);
    requiredActions.push('Re-run and pass all required regression tests.');
    score -= 25;
  }
  if (failedRollbackCheck.length) {
    noGoReasons.push(`Rollback readiness not ready: ${failedRollbackCheck.map(c => c.id).join(', ')}`);
    requiredActions.push('Verify and confirm rollback readiness before shipping.');
    score -= 25;
  }
  if (rejectedSignOffs.length) {
    noGoReasons.push(`${rejectedSignOffs.length} rejected sign-off(s): ${rejectedSignOffs.map(s => s.role).join(', ')}`);
    requiredActions.push('Resolve every rejected sign-off with the relevant stakeholder.');
    score -= 20;
  }
  if (noGoReasons.length) {
    return { decision: 'No-Go', score: Math.max(0, score), reasons: noGoReasons, requiredActions };
  }

  // ---- Need More Data: nothing to judge from at all ----
  const hasAnyTrackingData = items.regressionItems.length || items.signOffs.length || items.productionChecks.length;
  if (!hasAnyTrackingData) {
    return {
      decision: 'Need More Data', score: 50,
      reasons: ['No regression, sign-off, or production readiness data exists yet for this release.'],
      requiredActions: ['Add regression items, sign-offs, and production readiness checks before a decision can be calculated confidently.']
    };
  }

  // ---- Conditional Go ----
  const openHighRisks = items.risks.filter(r => r.level === 'High' && !['Mitigated', 'Closed', 'Accepted'].includes(r.status));
  const openHighBugs = items.bugs.filter(b => !['Closed', "Won't Fix"].includes(b.status) && b.severity === 'High');
  const pendingSignOffs = items.signOffs.filter(s => s.status === 'Pending');
  const incompleteProduction = items.productionChecks.filter(c => !['Ready', 'Verified'].includes(c.status));
  const missingEvidence = items.productionChecks.filter(c => !c.evidence)
    .concat(items.regressionItems.filter(r => r.required === 'Yes' && r.status === 'Passed' && !r.evidence));

  const conditionalReasons = [];
  if (openHighRisks.length) { conditionalReasons.push(`${openHighRisks.length} open High risk(s).`); requiredActions.push('Review open High risks before shipping.'); score -= 10; }
  if (openHighBugs.length) { conditionalReasons.push(`${openHighBugs.length} open High-severity bug(s).`); requiredActions.push('Review open High-severity bugs before shipping.'); score -= 10; }
  if (pendingSignOffs.length) { conditionalReasons.push(`${pendingSignOffs.length} sign-off(s) still pending: ${pendingSignOffs.map(s => s.role).join(', ')}`); requiredActions.push('Collect all pending sign-offs.'); score -= 10; }
  if (incompleteProduction.length) { conditionalReasons.push(`${incompleteProduction.length} production readiness check(s) incomplete.`); requiredActions.push('Complete remaining production readiness checks.'); score -= 10; }
  if (missingEvidence.length) { conditionalReasons.push('Evidence is missing on one or more important checks.'); requiredActions.push('Attach evidence (links, reports) to passed checks.'); score -= 5; }

  if (conditionalReasons.length) {
    return { decision: 'Conditional Go', score: Math.max(0, Math.min(90, score)), reasons: conditionalReasons, requiredActions };
  }

  // ---- Go ----
  const requiredRegressionAllPassed = items.regressionItems.filter(r => r.required === 'Yes').every(r => r.status === 'Passed');
  const productionAllReady = items.productionChecks.every(c => ['Ready', 'Verified'].includes(c.status));
  const signOffsAllApproved = items.signOffs.every(s => s.status === 'Approved');
  if (requiredRegressionAllPassed && productionAllReady && signOffsAllApproved) {
    return {
      decision: 'Go', score: 100,
      reasons: ['No open blocker/Critical bugs.', 'No open Critical risks.', 'Required regression passed.', 'Production checks ready.', 'Required sign-offs approved.'],
      requiredActions: []
    };
  }

  return {
    decision: 'Need More Data', score: 50,
    reasons: ['Not enough data to calculate a confident decision.'],
    requiredActions: ['Add more risk, bug, regression, sign-off, or production readiness data.']
  };
}

function decisionBadgeClass(decision) {
  if (decision === 'Go') return 'decision-go';
  if (decision === 'Conditional Go') return 'decision-conditional';
  if (decision === 'No-Go') return 'decision-nogo';
  return 'decision-needdata';
}
function decisionStatusClass(decision) {
  if (decision === 'Go') return 'status-green';
  if (decision === 'No-Go') return 'status-red';
  return 'status-yellow';
}

function renderDecisionWidget() {
  const area = document.getElementById('decisionWidgetArea');
  if (!area) return;
  if (activeProjectFilter === 'all' || activeReleaseFilter === 'all') {
    area.innerHTML = `<div class="decision-widget"><h3>${t('Recommended Go / No-Go Decision')}</h3>
      <p class="hint">${t('Select a specific project and release in the filter bar above to calculate a Go/No-Go recommendation.')}</p></div>`;
    return;
  }
  const result = calculateReleaseDecision(activeProjectFilter, activeReleaseFilter);
  area.innerHTML = `<div class="decision-widget">
    <h3>${t('Recommended Go / No-Go Decision')}</h3>
    <div style="margin:12px 0;display:flex;align-items:center;flex-wrap:wrap;gap:12px">
      <span class="decision-badge ${decisionBadgeClass(result.decision)}">${esc(t(result.decision))}</span>
      <span class="decision-score">${result.score}/100</span>
    </div>
    <div class="decision-columns">
      <div><h4>${t('Top reasons')}</h4><ul>${result.reasons.map(r => `<li>${esc(r)}</li>`).join('') || `<li>${esc(t('None'))}</li>`}</ul></div>
      <div><h4>${t('Required actions')}</h4><ul>${result.requiredActions.map(r => `<li>${esc(r)}</li>`).join('') || `<li>${esc(t('None'))}</li>`}</ul></div>
    </div>
  </div>`;
}

function generateDecisionSnapshot() {
  if (activeProjectFilter === 'all' || activeReleaseFilter === 'all') {
    alert(t('Select a specific project and release in the filter bar before generating a decision snapshot.'));
    return;
  }
  const result = calculateReleaseDecision(activeProjectFilter, activeReleaseFilter);
  const project = findProject(activeProjectFilter);
  const release = project && project.releases.find(r => r.id === activeReleaseFilter);
  workspace.decisionSnapshots.push({
    id: uid('DS'), createdAt: nowISO(), projectId: activeProjectFilter, releaseId: activeReleaseFilter,
    decision: result.decision, score: result.score, reasons: result.reasons, requiredActions: result.requiredActions,
    metrics: { projectName: project ? project.name : '', releaseVersion: release ? release.version : '' }
  });
  saveWorkspace();
  alert(t('Decision snapshot saved. See it in Reports > Decision snapshot history.'));
}

function renderDecisionSnapshotsTable() {
  const tbody = document.querySelector('#decisionSnapshotsTable tbody');
  if (!tbody) return;
  const snapshots = (workspace.decisionSnapshots || []).slice().reverse();
  const rows = snapshots.map(s => {
    const p = findProject(s.projectId);
    const r = p && (p.releases || []).find(x => x.id === s.releaseId);
    return `<tr><td>${esc(new Date(s.createdAt).toLocaleString())}</td><td>${esc(p ? p.name : s.projectId)}</td>
      <td>${esc(r ? r.version : s.releaseId)}</td><td class="${decisionStatusClass(s.decision)}">${esc(t(s.decision))}</td>
      <td>${s.score}</td><td>${esc((s.reasons && s.reasons[0]) || '')}</td></tr>`;
  }).join('');
  tbody.innerHTML = rows || `<tr><td colspan="6" class="hint">${t('No decision snapshots yet.')}</td></tr>`;
}

function decisionSummaryMarkdown(projectId, releaseId) {
  const project = findProject(projectId);
  const release = project && project.releases.find(r => r.id === releaseId);
  const result = calculateReleaseDecision(projectId, releaseId);
  const lines = [];
  lines.push(`# Go / No-Go Decision Summary`);
  lines.push('');
  lines.push(`**Project:** ${project ? project.name : projectId}`);
  lines.push(`**Release:** ${release ? `${release.version} — ${release.title || ''}` : 'Unassigned Release'}`);
  lines.push(`**Generated:** ${nowISO()}`);
  lines.push('');
  lines.push(`## Decision: ${result.decision} (score: ${result.score}/100)`);
  lines.push('');
  lines.push('### Reasons');
  lines.push(...(result.reasons.length ? result.reasons.map(r => `- ${r}`) : ['- None']));
  lines.push('');
  lines.push('### Required Actions');
  lines.push(...(result.requiredActions.length ? result.requiredActions.map(r => `- ${r}`) : ['- None']));
  return lines.join('\n');
}
function exportDecisionSummaryMarkdown() {
  if (activeProjectFilter === 'all' || activeReleaseFilter === 'all') {
    alert(t('Select a specific project and release in the filter bar before exporting a decision summary.'));
    return;
  }
  const md = decisionSummaryMarkdown(activeProjectFilter, activeReleaseFilter);
  downloadBlob(new Blob([md], { type: 'text/markdown;charset=utf-8;' }), 'decision_summary.md');
}

function executiveSummaryMarkdown() {
  const projects = applyFilters(workspace.projects);
  const lines = [];
  lines.push('# Executive Release Readiness Summary');
  lines.push('');
  lines.push(`**Generated:** ${nowISO()}`);
  lines.push(`**Scope:** ${activeProjectFilter === 'all' ? 'All Projects' : (findProject(activeProjectFilter) || {}).name}` +
    (activeReleaseFilter !== 'all' ? ` / ${releaseLabel(findProject(activeProjectFilter), activeReleaseFilter)}` : ' / All Releases'));
  lines.push('');
  projects.forEach(p => {
    lines.push(`## ${p.name} (${p.type}) — ${p.status}`);
    const releases = p.releases.filter(r => activeReleaseFilter === 'all' || r.id === activeReleaseFilter);
    if (!releases.length) { lines.push('_No releases in scope._'); lines.push(''); return; }
    releases.forEach(r => {
      const result = calculateReleaseDecision(p.id, r.id);
      lines.push(`### Release ${r.version} — ${r.title || ''}`);
      lines.push(`- Health: ${r.health} | Manual decision: ${r.decision} | **Recommended: ${result.decision} (${result.score}/100)**`);
      const openBugs = filterItemsForRelease(p.bugs, r.id).filter(b => !['Closed', "Won't Fix"].includes(b.status));
      const openRisks = filterItemsForRelease(p.risks, r.id).filter(x => !['Mitigated', 'Closed', 'Accepted'].includes(x.status));
      lines.push(`- Open bugs: ${openBugs.length} | Open risks: ${openRisks.length}`);
      if (result.reasons.length) lines.push(`- Top reason: ${result.reasons[0]}`);
      lines.push('');
    });
  });
  return lines.join('\n');
}
function filterItemsForRelease(arr, releaseId) { return (arr || []).filter(i => i.releaseId === releaseId); }
function exportExecutiveSummaryMarkdown() {
  const md = executiveSummaryMarkdown();
  downloadBlob(new Blob([md], { type: 'text/markdown;charset=utf-8;' }), 'executive_summary.md');
}
