(() => {
  'use strict';
  if (window.top !== window || document.getElementById('nmda-mail-dock-host')) return;

  const host = document.createElement('div');
  host.id = 'nmda-mail-dock-host';
  host.dataset.open = 'false';
  host.dataset.execution = 'idle';
  host.dataset.phase = 'idle';
  host.innerHTML = `
    <section id="nmda-mail-dock-panel" class="nmda-dock-panel" aria-label="SmartMail Execution Details" aria-hidden="true">
      <header class="nmda-dock-panel-head">
        <div class="nmda-dock-panel-title">
          <span class="nmda-dock-panel-kicker">LIVE EXECUTION</span>
          <strong id="nmda-dock-exec-label">Execution Status</strong>
        </div>
        <div class="nmda-dock-panel-meta">
          <span class="nmda-dock-account"><i id="nmda-dock-connection-dot"></i><span id="nmda-dock-account">Checking connection…</span></span>
          <span class="nmda-dock-exec-state" id="nmda-dock-exec-state">Running</span>
        </div>
      </header>

      <section id="nmda-dock-execution" class="nmda-dock-execution" hidden aria-label="Execution Status">
        <div class="nmda-dock-exec-overview">
          <strong id="nmda-dock-exec-count">0 / 0</strong>
          <span id="nmda-dock-exec-summary">Preparing</span>
        </div>

        <div class="nmda-dock-phase-track" id="nmda-dock-phase-track" aria-label="Execution Steps">
          <span data-stage="open" title="Open Compose"><i></i></span>
          <span data-stage="content" title="Write Content"><i></i></span>
          <span data-stage="attachments" title="Process Attachments"><i></i></span>
          <span data-stage="schedule" title="Set Schedule"><i></i></span>
          <span data-stage="save" title="Save & Finish"><i></i></span>
        </div>

        <div class="nmda-dock-attachment-motion" id="nmda-dock-attachment-motion" hidden aria-hidden="true">
          <span class="is-old"><i></i><small>OLD DRAFT</small></span>
          <b class="nmda-dock-attachment-route"><em>↗</em></b>
          <span class="is-new"><i></i><small>NEW DRAFT</small></span>
          <strong class="nmda-dock-attachment-verify">✓</strong>
        </div>

        <div class="nmda-dock-exec-current">
          <div class="nmda-dock-current-line">
            <span class="nmda-dock-current-pulse" aria-hidden="true"></span>
            <strong id="nmda-dock-exec-recipient">Preparing…</strong>
          </div>
          <small id="nmda-dock-exec-subject"></small>
          <p id="nmda-dock-exec-message">Preparing the execution queue.</p>
        </div>

        <div class="nmda-dock-exec-actions">
          <button id="nmda-dock-resume" class="is-primary" type="button" hidden>Resume Save</button>
          <button id="nmda-dock-stop" class="is-danger-quiet" type="button">Stop After Current</button>
          <button id="nmda-dock-open-dispatch" type="button">View Schedule</button>
        </div>
      </section>
    </section>

    <div class="nmda-dock-rail" id="nmda-dock-rail">
      <button id="nmda-dock-launcher" class="nmda-dock-launcher" type="button" aria-label="Open SmartMail" title="Open SmartMail · Alt+M">
        <span class="nmda-dock-glyph" aria-hidden="true">
          <svg viewBox="0 0 28 28" focusable="false">
            <path class="nmda-glyph-route" d="M7 8.25h7.15c2.9 0 5.25 2.35 5.25 5.25s-2.35 5.25-5.25 5.25H9.9"/>
            <circle class="nmda-glyph-node nmda-glyph-node-a" cx="7" cy="8.25" r="2"/>
            <circle class="nmda-glyph-node nmda-glyph-node-b" cx="20.25" cy="13.5" r="2"/>
            <circle class="nmda-glyph-node nmda-glyph-node-c" cx="9.75" cy="18.75" r="2"/>
          </svg>
          <i class="nmda-dock-glyph-runner"></i>
        </span>
        <span class="nmda-dock-live-copy" aria-hidden="true">
          <strong id="nmda-dock-live-count">0 / 0</strong>
          <small id="nmda-dock-live-state">Running</small>
        </span>
        <span class="nmda-dock-launcher-dot" id="nmda-dock-launcher-dot"></span>
      </button>

      <button id="nmda-dock-detail-toggle" class="nmda-dock-detail-toggle" type="button" aria-label="View Execution Details" aria-expanded="false" hidden>
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5.75 7.75 10 12l4.25-4.25"/></svg>
      </button>

      <div class="nmda-dock-live-progress" aria-hidden="true">
        <i id="nmda-dock-live-progress-bar"></i><b id="nmda-dock-live-progress-head"></b>
      </div>
    </div>`;

  document.documentElement.appendChild(host);

  const panel = host.querySelector('#nmda-mail-dock-panel');
  const launcher = host.querySelector('#nmda-dock-launcher');
  const detailToggle = host.querySelector('#nmda-dock-detail-toggle');
  const launcherDot = host.querySelector('#nmda-dock-launcher-dot');
  const liveCount = host.querySelector('#nmda-dock-live-count');
  const liveState = host.querySelector('#nmda-dock-live-state');
  const liveProgressBar = host.querySelector('#nmda-dock-live-progress-bar');
  const liveProgressHead = host.querySelector('#nmda-dock-live-progress-head');
  const accountEl = host.querySelector('#nmda-dock-account');
  const connectionDot = host.querySelector('#nmda-dock-connection-dot');
  const executionEl = host.querySelector('#nmda-dock-execution');
  const execLabel = host.querySelector('#nmda-dock-exec-label');
  const execCount = host.querySelector('#nmda-dock-exec-count');
  const execSummary = host.querySelector('#nmda-dock-exec-summary');
  const execState = host.querySelector('#nmda-dock-exec-state');
  const execRecipient = host.querySelector('#nmda-dock-exec-recipient');
  const execSubject = host.querySelector('#nmda-dock-exec-subject');
  const execMessage = host.querySelector('#nmda-dock-exec-message');
  const phaseTrack = host.querySelector('#nmda-dock-phase-track');
  const attachmentMotion = host.querySelector('#nmda-dock-attachment-motion');
  const stopButton = host.querySelector('#nmda-dock-stop');
  const resumeButton = host.querySelector('#nmda-dock-resume');

  const PHASE_ORDER = ['open', 'content', 'attachments', 'schedule', 'save'];
  const DRAFT_ATTACHMENT_PHASE_ORDER = ['read','clone','attachments','verify','swap'];
  const DRAFT_ATTACHMENT_STAGE_LABELS = ['Read Original','Create New Draft','Update Attachment','Verify Content','Complete Replacement'];
  const PHASE_LABELS = {
    open: 'Open Compose',
    content: 'Write Mail Content',
    attachments: 'Process Attachments',
    schedule: 'Set Schedule',
    paused: 'Waiting for Manual Review',
    'identity-required': 'Waiting for Sender Name',
    resume: 'Resume',
    save: 'Save Draft',
    cleanup: 'Verify & Finish',
    'cleanup-error': 'Cleanup Error',
    done: 'Message Complete',
    read:'Read Original Draft',clone:'Create New Draft',verify:'Verify Mail Content',swap:'Complete Replacement',
    seed:'Prepare New Attachment Source',stopped:'Stopped'
  };

  let lastStatus = { connected: false, account: '' };
  let executionResetTimer = null;
  let motionTimer = null;
  const execution = {
    total: 0,
    current: 0,
    succeeded: 0,
    failed: 0,
    remaining: 0,
    status: 'idle',
    kind: 'mail',
    executionId: '',
    phase: 'idle',
    task: null,
    message: ''
  };

  function setOpen(open) {
    const next = !!open && execution.status !== 'idle';
    host.dataset.open = next ? 'true' : 'false';
    panel.setAttribute('aria-hidden', next ? 'false' : 'true');
    detailToggle?.setAttribute('aria-expanded', next ? 'true' : 'false');
  }

  async function openWorkspace(target = 'batch') {
    try {
      await chrome.runtime.sendMessage({ type: 'NMDA_OPEN_APP', target: String(target || 'batch') });
      setOpen(false);
    } catch (error) {
      console.warn('[SmartMail Ops] open workspace failed', error);
    }
  }

  function executionPct() {
    if (!execution.total) return 0;
    if (execution.status === 'done') return 100;
    if(execution.kind==='draft-attachment'){
      const stage=Math.max(0,effectiveStageIndex());
      const current=Math.max(1,Number(execution.current||1));
      const fraction=Math.min(1,Math.max(0,(stage+1)/DRAFT_ATTACHMENT_PHASE_ORDER.length));
      return Math.min(99,Math.max(0,(((current-1)+fraction)/Number(execution.total))*100));
    }
    const done = Math.max(0, Number(execution.succeeded || 0) + Number(execution.failed || 0));
    return Math.min(100, Math.max(0, (done / Number(execution.total)) * 100));
  }

  function hasExecutionContext() {
    return execution.status !== 'idle';
  }

  function effectiveStageIndex() {
    const phase = String(execution.phase || '');
    if(execution.kind==='draft-attachment'){
      if(phase==='seed')return 0;
      if(phase==='done')return 4;
      const index=DRAFT_ATTACHMENT_PHASE_ORDER.indexOf(phase);
      return index>=0?index:-1;
    }
    if (phase === 'cleanup' || phase === 'cleanup-error' || phase === 'done' || phase === 'resume' || phase === 'identity-required') return 4;
    const index = PHASE_ORDER.indexOf(phase);
    return index >= 0 ? index : -1;
  }

  function triggerMotion(kind) {
    const className = kind === 'commit' ? 'is-commit' : 'is-step';
    host.classList.remove(className);
    void host.offsetWidth;
    host.classList.add(className);
    if (motionTimer) clearTimeout(motionTimer);
    motionTimer = setTimeout(() => host.classList.remove(className), kind === 'commit' ? 700 : 460);
  }

  function renderPhaseTrack() {
    const activeIndex = effectiveStageIndex();
    const taskFinished = execution.phase === 'done';
    phaseTrack?.querySelectorAll('span').forEach((node, index) => {
      if(execution.kind==='draft-attachment')node.title=DRAFT_ATTACHMENT_STAGE_LABELS[index]||'';
      node.classList.toggle('is-active', !taskFinished && index === activeIndex);
      node.classList.toggle('is-complete', taskFinished || index < activeIndex);
    });
  }

  function renderExecution() {
    const visible = hasExecutionContext();
    executionEl.hidden = !visible;
    host.dataset.execution = execution.status || 'idle';
    host.dataset.phase = execution.phase || 'idle';
    host.dataset.kind = execution.kind || 'mail';
    detailToggle.hidden = !visible;
    if (!visible) {
      setOpen(false);
      return;
    }

    const done = Math.max(0, Number(execution.succeeded || 0) + Number(execution.failed || 0));
    const current = Math.min(Math.max(Number(execution.current || done || 0), 0), Math.max(Number(execution.total || 0), 0));
    const finished = ['done', 'error', 'stopped'].includes(execution.status);
    const paused = execution.status === 'paused';
    const waitingUser = execution.status === 'waiting-user';
    const stateLabel = execution.status === 'done' ? 'Complete' : execution.status === 'error' ? 'Error' : execution.status === 'stopped' ? 'Stopped' : paused ? 'Needs Review' : waitingUser ? 'Needs Input' : 'Running';
    const phaseLabel = PHASE_LABELS[execution.phase] || (finished ? 'Execution finished' : 'Processing');
    const displayCount = finished ? done : current;

    const attachmentRun=execution.kind==='draft-attachment';
    execLabel.textContent = attachmentRun ? 'Safe Draft Attachment Replacement' : (paused ? 'Waiting for Manual Review' : waitingUser ? 'Waiting for NetEase' : execution.status === 'running' ? 'Execution Queue' : 'Execution Result');
    execCount.textContent = `${displayCount} / ${Number(execution.total || 0)}`;
    execSummary.textContent = phaseLabel;
    execState.textContent = stateLabel;
    execState.dataset.state = execution.status;
    execRecipient.textContent = attachmentRun ? (execution.task?.subject || (finished?'Attachment update finished':'Preparing draft attachment update…')) : (execution.task?.recipient || (finished ? 'This execution is finished' : 'Preparing next message…'));
    execSubject.textContent = attachmentRun ? `${execution.task?.oldName||'Old attachment'}  →  ${execution.task?.newName||'New attachment'}` : (execution.task?.subject || '');
    execMessage.textContent = execution.message || (finished ? `Succeeded ${Number(execution.succeeded || 0)} · Failed ${Number(execution.failed || 0)}` : 'Processing…');
    attachmentMotion.hidden=!attachmentRun;
    resumeButton.hidden = attachmentRun || !paused;
    resumeButton.disabled = false;
    resumeButton.textContent = 'Resume Save';
    stopButton.hidden = finished;
    stopButton.disabled = false;
    stopButton.textContent = attachmentRun ? 'Stop This Update' : 'Stop After Current';
    const openButton=host.querySelector('#nmda-dock-open-dispatch');if(openButton)openButton.textContent=attachmentRun?'Back to Quick Attachments':'View Schedule';
    renderPhaseTrack();
  }

  function syncExecutionChrome() {
    renderExecution();
    const active = hasExecutionContext();
    const done = Math.max(0, Number(execution.succeeded || 0) + Number(execution.failed || 0));
    const current = Math.min(Number(execution.current || done || 0), Number(execution.total || 0));
    const pct = executionPct();

    liveCount.textContent = execution.status === 'done' ? `${Number(execution.total || done)} / ${Number(execution.total || done)}` : `${current} / ${Number(execution.total || 0)}`;
    liveState.textContent = execution.status === 'paused' ? 'Waiting for Review' : execution.status === 'waiting-user' ? 'Waiting for Name' : execution.status === 'done' ? 'Execution Complete' : execution.status === 'error' ? 'Execution Error' : execution.status === 'stopped' ? 'Stopped' : (PHASE_LABELS[execution.phase] || 'Running');
    liveProgressBar.style.width = `${pct}%`;
    liveProgressHead.style.left = `${pct}%`;
    launcher.title = execution.status === 'paused' ? 'SmartMail is waiting for manual review · click to open' : execution.status === 'waiting-user' ? 'SmartMail is waiting for the NetEase sender name · execution resumes automatically after completion' : execution.status === 'running'
      ? `SmartMail is running · ${current}/${Number(execution.total || 0)} · click to open`
      : 'Open SmartMail · Alt+M';

    if (!active) {
      liveProgressBar.style.width = '0%';
      liveProgressHead.style.left = '0%';
    }
  }

  function updateExecution(payload = {}) {
    const action = String(payload.action || '');
    if (action === 'start') {
      if (executionResetTimer) { clearTimeout(executionResetTimer); executionResetTimer = null; }
      Object.assign(execution, {
        total: Number(payload.total || 0), current: 0, succeeded: 0, failed: 0,
        remaining: Number(payload.remaining ?? payload.total ?? 0), status: 'running', kind:'mail', executionId: '', phase: 'open',
        task: null, message: 'Preparing the first message.'
      });
      setOpen(false);
      triggerMotion('step');
    } else if (action === 'task-start') {
      Object.assign(execution, {
        current: Number(payload.current || 0), total: Number(payload.total || execution.total),
        succeeded: Number(payload.succeeded || 0), failed: Number(payload.failed || 0),
        remaining: Number(payload.remaining ?? execution.remaining), status: 'running', executionId: '', phase: 'open',
        task: payload.task || null, message: 'Opening compose…'
      });
      triggerMotion('step');
    } else if (action === 'task-progress') {
      const phase = String(payload.phase || '');
      const previousPhase = execution.phase;
      Object.assign(execution, {
        current: Number(payload.current || execution.current), total: Number(payload.total || execution.total),
        succeeded: Number(payload.succeeded ?? execution.succeeded), failed: Number(payload.failed ?? execution.failed),
        remaining: Number(payload.remaining ?? execution.remaining), task: payload.task || execution.task,
        executionId: String(payload.executionId || execution.executionId || ''),
        status: phase === 'paused' ? 'paused' : phase === 'identity-required' ? 'waiting-user' : 'running', phase: phase || execution.phase,
        message: String(payload.message || 'Processing…')
      });
      if (phase && phase !== previousPhase && phase !== 'done') triggerMotion('step');
      if (phase === 'paused' || phase === 'identity-required') setOpen(true);
    } else if (action === 'task-done') {
      Object.assign(execution, {
        current: Number(payload.current || execution.current), succeeded: Number(payload.succeeded || execution.succeeded),
        failed: Number(payload.failed || execution.failed), remaining: Number(payload.remaining ?? execution.remaining),
        task: payload.task || execution.task, executionId: '', phase: 'done', message: String(payload.message || 'Draft saved'), status: 'running'
      });
      triggerMotion('commit');
    } else if (action === 'task-error') {
      Object.assign(execution, {
        current: Number(payload.current || execution.current), succeeded: Number(payload.succeeded || execution.succeeded),
        failed: Number(payload.failed || execution.failed), remaining: Number(payload.remaining ?? execution.remaining),
        task: payload.task || execution.task, executionId: '', phase: 'cleanup-error', message: String(payload.message || 'Execution failed'), status: 'error'
      });
      setOpen(true);
      triggerMotion('commit');
    } else if (action === 'finish') {
      Object.assign(execution, {
        total: Number(payload.total || execution.total), succeeded: Number(payload.succeeded || 0),
        failed: Number(payload.failed || 0), remaining: Number(payload.remaining || 0),
        status: String(payload.status || 'done'), executionId: '', phase: String(payload.status || 'done') === 'done' ? 'done' : execution.phase,
        message: String(payload.message || 'Execution finished')
      });
      if (execution.status === 'error' || execution.status === 'stopped') setOpen(true);
      else setOpen(false);
      triggerMotion('commit');
      if (executionResetTimer) clearTimeout(executionResetTimer);
      executionResetTimer = setTimeout(() => {
        execution.status = 'idle';
        execution.phase = 'idle';
        execution.task = null;
        execution.message = '';
        executionResetTimer = null;
        syncExecutionChrome();
      }, 6000);
    }
    syncExecutionChrome();
    return { ok: true };
  }

  function updateDraftAttachmentExecution(payload={}) {
    const action=String(payload.action||'progress');
    if(executionResetTimer){clearTimeout(executionResetTimer);executionResetTimer=null;}
    if(action==='start'){
      Object.assign(execution,{kind:'draft-attachment',total:Number(payload.total||0),current:0,succeeded:0,failed:0,remaining:Number(payload.total||0),status:'running',executionId:String(payload.executionId||''),phase:'seed',task:{subject:'Preparing attachment update',oldName:String(payload.oldName||'Old attachment'),newName:String(payload.newName||'New attachment')},message:String(payload.message||'Preparing the new attachment source…')});
      setOpen(true);triggerMotion('step');
    }else if(action==='finish'){
      const finishStatus=String(payload.status||'done');
      Object.assign(execution,{kind:'draft-attachment',total:Number(payload.total||execution.total),current:Number(payload.current||execution.current),succeeded:Number(payload.succeeded||0),failed:Number(payload.failed||0),remaining:0,status:finishStatus,phase:finishStatus==='done'?'done':finishStatus==='stopped'?'stopped':'error',message:String(payload.message||'Attachment update finished')});
      setOpen(execution.status!=='done');triggerMotion('commit');
      executionResetTimer=setTimeout(()=>{execution.status='idle';execution.phase='idle';execution.kind='mail';execution.task=null;execution.message='';executionResetTimer=null;syncExecutionChrome();},7000);
    }else{
      const phase=String(payload.phase||execution.phase||'read');
      const previous=execution.phase;
      Object.assign(execution,{kind:'draft-attachment',executionId:String(payload.executionId||execution.executionId||''),total:Number(payload.total||execution.total),current:Number(payload.current||execution.current),status:phase==='error'?'error':'running',phase,message:String(payload.message||'Processing…'),task:{...(execution.task||{}),subject:String(payload.subject||execution.task?.subject||'Current draft'),oldName:String(payload.oldName||execution.task?.oldName||'Old attachment'),newName:String(payload.newName||execution.task?.newName||'New attachment')}});
      if(phase!==previous)triggerMotion(phase==='done'?'commit':'step');
      if(phase==='error')setOpen(true);
    }
    syncExecutionChrome();
    return {ok:true};
  }

  async function refreshStatus() {
    try {
      const status = await chrome.runtime.sendMessage({ type: 'NMDA_CONNECTION_STATUS' });
      lastStatus = { connected: !!status?.connected, account: status?.account ? String(status.account) : '' };
    } catch (_) {
      lastStatus = { connected: false, account: '' };
    }
    const online = !!lastStatus.connected;
    launcherDot.dataset.state = online ? 'online' : 'offline';
    connectionDot.dataset.state = online ? 'online' : 'offline';
    accountEl.textContent = lastStatus.account || (online ? 'NetEase Mail connected' : 'NetEase Mail disconnected');
  }

  // Primary interaction: one click on the Dock always opens SmartMail's main workspace.
  launcher.addEventListener('click', event => {
    event.stopPropagation();
    openWorkspace(execution.kind==='draft-attachment'?'utilities/draft-attachments':'batch');
  });

  detailToggle?.addEventListener('click', event => {
    event.stopPropagation();
    if (!hasExecutionContext()) return;
    setOpen(host.dataset.open !== 'true');
    if (host.dataset.open === 'true') {
      refreshStatus();
      renderExecution();
    }
  });

  host.querySelector('#nmda-dock-open-dispatch')?.addEventListener('click', () => openWorkspace(execution.kind==='draft-attachment'?'utilities/draft-attachments':'dispatch'));

  resumeButton?.addEventListener('click', async event => {
    const executionId = String(execution.executionId || '');
    if (!executionId) return;
    event.currentTarget.disabled = true;
    event.currentTarget.textContent = 'Resuming…';
    const result = await chrome.runtime.sendMessage({ type:'NMDA_EXECUTION_RESUME_REQUEST', executionId }).catch(error => ({ok:false,reason:error?.message||String(error)}));
    if (!result?.ok) {
      event.currentTarget.disabled = false;
      event.currentTarget.textContent = 'Resume Save';
      execMessage.textContent = `Cannot resume: ${result?.reason || 'execution state has changed'}`;
    }
  });

  stopButton?.addEventListener('click', async event => {
    event.currentTarget.disabled = true;
    event.currentTarget.textContent = 'Stopping…';
    if (execution.kind === 'draft-attachment') {
      const executionId=String(execution.executionId||'');
      if(executionId)await chrome.runtime.sendMessage({type:'NMDA_DRAFT_ATTACHMENT_CANCEL',executionId}).catch(()=>{});
      execution.message='Stop requested: no new draft will start after the current safe step finishes.';
      syncExecutionChrome();
      return;
    }
    await chrome.runtime.sendMessage({ type: 'NMDA_BATCH_STOP_REQUEST' }).catch(() => {});
    if (execution.status === 'paused' && execution.executionId) {
      await chrome.runtime.sendMessage({ type:'NMDA_EXECUTION_RESUME_REQUEST', executionId:String(execution.executionId) }).catch(() => {});
    }
  });

  document.addEventListener('pointerdown', event => {
    if (host.dataset.open !== 'true') return;
    if (!host.contains(event.target)) setOpen(false);
  }, true);

  document.addEventListener('keydown', event => {
    if (event.altKey && !event.ctrlKey && !event.metaKey && String(event.key).toLowerCase() === 'm') {
      event.preventDefault();
      openWorkspace('batch');
    }
    if (event.key === 'Escape' && host.dataset.open === 'true') setOpen(false);
  }, true);

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type === 'NMDA_CONNECTION_CHANGED') {
      refreshStatus();
      return;
    }
    if (message?.type === 'NMDA_BATCH_MONITOR') {
      try { sendResponse(updateExecution(message.payload || {})); }
      catch (error) { sendResponse({ ok: false, reason: error?.message || String(error) }); }
      return;
    }
    if (message?.type === 'NMDA_DRAFT_ATTACHMENT_MONITOR') {
      try { sendResponse(updateDraftAttachmentExecution(message.payload || {})); }
      catch (error) { sendResponse({ ok:false, reason:error?.message||String(error) }); }
    }
  });

  syncExecutionChrome();
  refreshStatus();
  setInterval(refreshStatus, 15000);
})();
