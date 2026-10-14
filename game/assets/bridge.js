// ===== Warptracker PL: mostek panelu admina (admin.html) + PAUZA (ESC) =====
;(function () {
  var DEFAULT_NAMES = {
    serra: 'Strażniczka Serra',
    marek: 'Stary Marek, Kronikarz',
    vess: 'Vess, Szyjąca',
    brann: 'Brann Węgloręki'
  }

  function readDialogs() {
    try {
      var d = JSON.parse(localStorage.getItem('wt.dialogs') || '{}')
      return d && typeof d === 'object' ? d : {}
    } catch (e) { return {} }
  }

  // hook używany przez spatchowany bundle (getDialogue) — czytany przy KAŻDEJ rozmowie
  window.__wtDlgOv = function (npcId) {
    var ov = readDialogs()[npcId]
    if (!ov || !ov.enabled || !Array.isArray(ov.lines) || !ov.lines.length) return null
    return {
      name: ov.name || DEFAULT_NAMES[npcId] || npcId,
      lines: ov.lines.filter(function (l) { return typeof l === 'string' && l.trim() })
    }
  }

  // ---------- PAUZA pod ESC ----------
  var paused = false
  var queue = []
  var origRAF = window.requestAnimationFrame.bind(window)
  var overlay = null

  // brama na requestAnimationFrame: wstrzymane klatki trafiają do kolejki
  window.requestAnimationFrame = function (cb) {
    if (paused) { queue.push(cb); return 0 }
    return origRAF(cb)
  }
  function resumeQueue() {
    var q = queue; queue = []
    var now = (window.performance && performance.now) ? performance.now() : Date.now()
    for (var i = 0; i < q.length; i++) { try { q[i](now) } catch (e) {} }
  }

  function ensureOverlay() {
    if (overlay) return overlay
    var st = document.createElement('style')
    st.textContent = '#wt-pause{position:fixed;inset:0;z-index:200;display:none;align-items:center;justify-content:center;flex-direction:column;gap:10px;background:rgba(5,2,8,.66);backdrop-filter:blur(2px);pointer-events:none}' +
      '#wt-pause.show{display:flex}' +
      '#wt-pause h1{color:#e9d5ff;letter-spacing:.3em;font-size:clamp(26px,5vw,46px);text-shadow:0 0 30px #6b21a8;font-family:Georgia,serif}' +
      '#wt-pause p{color:#a1a1aa;font-size:13px;letter-spacing:.12em}'
    document.head.appendChild(st)
    overlay = document.createElement('div')
    overlay.id = 'wt-pause'
    overlay.innerHTML = '<h1>PAUZA</h1><p>ESC — wróć do łowów</p>'
    document.body.appendChild(overlay)
    return overlay
  }

  function quickPanelOpen() {
    var p = document.getElementById('wt-adm')
    return !!(p && p.classList && p.classList.contains('show'))
  }

  function togglePause() {
    paused = !paused
    var ov = ensureOverlay()
    if (paused) {
      ov.classList.add('show')
      // wycisz dźwięki gry na czas pauzy
      try { if (window.__WT && window.__WT.mute) window.__WT.mute(true) } catch (e) {}
    } else {
      ov.classList.remove('show')
      try { if (window.__WT && window.__WT.mute) window.__WT.mute(false) } catch (e) {}
      resumeQueue()
    }
  }

  window.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || e.repeat) return
    if (quickPanelOpen()) return           // niech panel zamknie się normalnie
    e.preventDefault()
    togglePause()
  })

  // live-sync z osobną stroną admina
  try {
    var ch = new BroadcastChannel('wt-admin')
    ch.onmessage = function (ev) {
      var d = ev.data || {}
      if (d.type === 'ping') ch.postMessage({ type: 'pong', game: true })
      if (d.type === 'pause' && !paused) togglePause()
      if (d.type === 'unpause' && paused) togglePause()
    }
  } catch (e) {}
})()
