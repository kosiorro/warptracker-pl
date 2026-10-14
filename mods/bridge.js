// ===== Warptracker PL: mostek gry ↔ panel admina + PAUZA (ESC) =====
// Baza gry żyje w PLIKU game/data/gamedata.json (edytowany w panelu admina / admin.html).
// Tu ją ładujemy i podłączamy do gry: dialogi NPC + pula dropów.
;(function () {
  var GD = null // baza gry z pliku

  function readDialogs() {
    try {
      var d = JSON.parse(localStorage.getItem('wt.dialogs') || '{}')
      return d && typeof d === 'object' ? d : {}
    } catch (e) { return {} }
  }

  // hook getDialogue (spatchowany bundle): kolejność = localStorage (live) > baza z pliku
  window.__wtDlgOv = function (npcId) {
    var ov = readDialogs()[npcId]
    if (ov && ov.enabled && Array.isArray(ov.lines) && ov.lines.length) {
      return { name: ov.name || npcId, lines: ov.lines.filter(function (l) { return typeof l === 'string' && l.trim() }) }
    }
    if (GD && GD.npcs && GD.npcs[npcId]) {
      var n = GD.npcs[npcId]
      if (Array.isArray(n.lines) && n.lines.length) {
        return { name: n.name || npcId, lines: n.lines.filter(function (l) { return typeof l === 'string' && l.trim() }) }
      }
    }
    return null
  }

  // załaduj bazę gry z pliku
  fetch('data/gamedata.json')
    .then(function (r) { return r.ok ? r.json() : null })
    .then(function (d) { if (d && typeof d === 'object') GD = d })
    .catch(function () {})

  // przekaż bazę panelowi (admin.html działa w tej samej origin)
  window.__wtGameData = function () { return GD }

  // ---------- dropy z BAZY GRY (plik gamedata.json) ----------
  function validGameItem(it) {
    return it && typeof it === 'object' &&
      ['weapon', 'armor', 'charm'].indexOf(it.slot) >= 0 &&
      ['common', 'magic', 'rare', 'unique'].indexOf(it.rarity) >= 0 &&
      typeof it.name === 'string' && it.name &&
      Array.isArray(it.affixes) && it.affixes.length >= 1 && it.affixes.length <= 4 &&
      it.affixes.every(function (a) { return a && ['dmg', 'hp', 'speed', 'mana', 'regen'].indexOf(a.stat) >= 0 && typeof a.value === 'number' && a.value > 0 && a.value <= 999 })
  }
  function hookDrops() {
    var g = window.__WT
    if (!g || !g.loot || g.loot.__fileHooked) return false
    var L = g.loot
    var orig = L.maybeDrop.bind(L)
    L.maybeDrop = function (pos, lvl, kind) {
      orig(pos, lvl, kind)
      try {
        var chance = (GD && typeof GD.dropChance === 'number') ? GD.dropChance / 100 : 0
        var pool = (GD && Array.isArray(GD.items)) ? GD.items.filter(validGameItem) : []
        if (chance > 0 && pool.length && Math.random() < chance) {
          L.drop(pos, JSON.parse(JSON.stringify(pool[Math.floor(Math.random() * pool.length)])))
        }
      } catch (e) {}
    }
    L.__fileHooked = true
    return true
  }
  var tries = 0
  var t = setInterval(function () { if (hookDrops() || ++tries > 400) clearInterval(t) }, 500)

  // ---------- PAUZA pod ESC ----------
  var paused = false
  var queue = []
  var origRAF = window.requestAnimationFrame.bind(window)
  var overlay = null

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
    } else {
      ov.classList.remove('show')
      resumeQueue()
    }
  }

  window.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || e.repeat) return
    if (quickPanelOpen()) return
    e.preventDefault()
    togglePause()
  })

  // live-sync z panelem admina
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
