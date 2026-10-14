// ===== Warptracker PL: mostek gry ↔ panel admina + MENU GRY (ESC) + SKLEP NPC + ZAPIS/WCZYTANIE =====
// Baza gry żyje w PLIKU game/data/gamedata.json (edytowany w panelu admina / admin.html).
// Tu ją ładujemy i podłączamy do gry: dialogi NPC + pula dropów + sklep.
;(function () {
  var GD = null // baza gry z pliku

  // ---------- pomocnicze ----------
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v } catch (e) { return d } }
  function lsSet(k, v) { try { localStorage.setItem(k, v) } catch (e) {} }
  function lsJSON(k, d) { try { var v = JSON.parse(localStorage.getItem(k) || 'null'); return v === null ? d : v } catch (e) { return d } }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') }

  var RAR = { common: '#d6d3d1', magic: '#60a5fa', rare: '#fde047', unique: '#c084fc' }
  var RAR_PL = { common: 'zwykły', magic: 'magiczny', rare: 'rzadki', unique: 'unikat' }
  var SLOT_PL = { weapon: 'Broń', armor: 'Zbroja', charm: 'Talizman' }
  var STAT_PL = { dmg: 'obrażeń', hp: 'życia', speed: '% szybk. ruchu', mana: 'many', regen: 'życia/s' }

  function readDialogs() {
    var d = lsJSON('wt.dialogs', {})
    return d && typeof d === 'object' ? d : {}
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

  // ============================================================
  // TOOLTIP: najedź na przedmiot → nazwa + statystyki
  // (działa dla każdego elementu z atrybutem data-wtitem="JSON")
  // ============================================================
  var tip = null
  function ensureTip() {
    if (tip) return tip
    var st = document.createElement('style')
    st.textContent = '#wt-tip{position:fixed;z-index:400;display:none;max-width:280px;background:rgba(10,7,16,.96);border:1px solid #6b21a8;border-radius:8px;padding:10px 12px;font-family:Georgia,serif;color:#d6d3d1;box-shadow:0 6px 28px rgba(0,0,0,.8),0 0 14px rgba(168,85,247,.25);pointer-events:none}' +
      '#wt-tip .tt-name{font-size:13px;letter-spacing:.06em;margin-bottom:2px}' +
      '#wt-tip .tt-kind{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#71717a;margin-bottom:6px}' +
      '#wt-tip .tt-affix{font-size:12px;color:#c4b5fd;line-height:1.55}'
    document.head.appendChild(st)
    tip = document.createElement('div')
    tip.id = 'wt-tip'
    document.body.appendChild(tip)
    return tip
  }
  function affixLine(a) {
    return '+' + a.value + (a.stat === 'speed' ? '%' : '') + ' ' + STAT_PL[a.stat]
  }
  function tipHtml(it) {
    var aff = (it.affixes || []).map(function (a) { return '<div class="tt-affix">' + affixLine(a) + '</div>' }).join('')
    var kind = (SLOT_PL[it.slot] || it.slot) + ' · ' + (RAR_PL[it.rarity] || it.rarity)
    return '<div class="tt-name" style="color:' + (RAR[it.rarity] || '#d6d3d1') + '">' + esc(it.name) + '</div>' +
      '<div class="tt-kind">' + esc(kind) + '</div>' + aff
  }
  function moveTip(e) {
    if (!tip || tip.style.display === 'none') return
    var x = e.clientX + 14, y = e.clientY + 14
    var r = tip.getBoundingClientRect()
    if (x + r.width > window.innerWidth - 8) x = e.clientX - r.width - 14
    if (y + r.height > window.innerHeight - 8) y = e.clientY - r.height - 14
    tip.style.left = Math.max(4, x) + 'px'
    tip.style.top = Math.max(4, y) + 'px'
  }
  document.addEventListener('mouseover', function (e) {
    var el = e.target.closest ? e.target.closest('[data-wtitem]') : null
    if (!el) return
    var it = null
    try { it = JSON.parse(el.getAttribute('data-wtitem')) } catch (err) {}
    if (!it || !it.name) return
    ensureTip()
    tip.innerHTML = tipHtml(it)
    tip.style.display = 'block'
    moveTip(e)
  })
  document.addEventListener('mouseout', function (e) {
    var el = e.target.closest ? e.target.closest('[data-wtitem]') : null
    if (el && tip) tip.style.display = 'none'
  })
  document.addEventListener('mousemove', moveTip)

  // ============================================================
  // PAUZA (rAF gate) pod spodem menu
  // ============================================================
  var paused = false
  var queue = []
  var origRAF = window.requestAnimationFrame.bind(window)

  window.requestAnimationFrame = function (cb) {
    if (paused) { queue.push(cb); return 0 }
    return origRAF(cb)
  }
  function resumeQueue() {
    var q = queue; queue = []
    var now = (window.performance && performance.now) ? performance.now() : Date.now()
    for (var i = 0; i < q.length; i++) { try { q[i](now) } catch (e) {} }
  }

  function setPaused(v) {
    paused = v
    if (!paused) resumeQueue()
  }

  function quickPanelOpen() {
    var p = document.getElementById('wt-adm')
    return !!(p && p.classList && p.classList.contains('show'))
  }

  // ============================================================
  // MENU GRY (ESC) — z prawdziwego zdarzenia
  // ============================================================
  var menu = null
  var menuView = 'main'

  function menuCss() {
    var st = document.createElement('style')
    st.textContent =
      '#wt-menu{position:fixed;inset:0;z-index:210;display:none;align-items:center;justify-content:center;background:radial-gradient(ellipse at 50% 38%,rgba(59,7,100,.5),rgba(5,2,8,.88) 70%);backdrop-filter:blur(3px);font-family:Georgia,serif}' +
      '#wt-menu.show{display:flex}' +
      '#wt-menu .m-box{display:flex;flex-direction:column;align-items:center;gap:6px;min-width:340px}' +
      '#wt-menu .m-logo{color:#e9d5ff;letter-spacing:.42em;font-size:clamp(30px,6vw,52px);font-weight:bold;text-shadow:0 0 34px #7e22ce,0 0 80px #4c1d95;margin-bottom:2px}' +
      '#wt-menu .m-sub{color:#71717a;font-size:12px;letter-spacing:.3em;text-transform:uppercase;margin-bottom:22px}' +
      '#wt-menu .m-btn{width:300px;padding:11px 16px;font-family:Georgia,serif;font-size:15px;letter-spacing:.14em;text-transform:uppercase;color:#d6d3d1;background:rgba(20,12,32,.75);border:1px solid #3f2a55;border-radius:6px;cursor:pointer;transition:all .16s;text-align:center}' +
      '#wt-menu .m-btn:hover{border-color:#a855f7;color:#f3e8ff;background:rgba(46,22,74,.85);box-shadow:0 0 18px rgba(168,85,247,.35);transform:translateY(-1px)}' +
      '#wt-menu .m-btn.danger:hover{border-color:#b91c1c;box-shadow:0 0 18px rgba(185,28,28,.4)}' +
      '#wt-menu .m-hint{color:#52525b;font-size:11px;letter-spacing:.12em;margin-top:18px}' +
      '#wt-menu .m-slots{display:flex;flex-direction:column;gap:8px;width:300px}' +
      '#wt-menu .m-slot{padding:10px 14px;background:rgba(20,12,32,.75);border:1px solid #3f2a55;border-radius:6px;cursor:pointer;color:#d6d3d1;transition:all .16s}' +
      '#wt-menu .m-slot:hover{border-color:#a855f7;box-shadow:0 0 14px rgba(168,85,247,.3)}' +
      '#wt-menu .m-slot.empty{color:#52525b;cursor:pointer}' +
      '#wt-menu .m-slot .s-t{font-size:13px;letter-spacing:.08em}' +
      '#wt-menu .m-slot .s-m{font-size:11px;color:#71717a;margin-top:2px}' +
      '#wt-menu .m-back{margin-top:14px;width:300px;padding:8px;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#71717a;background:none;border:none;cursor:pointer}' +
      '#wt-menu .m-back:hover{color:#e9d5ff}'
    document.head.appendChild(st)
  }

  function heroInfo() {
    var g = window.__WT
    var lvl = 1, ch = '?'
    try { if (g && g.heroState) { lvl = g.heroState.level || 1 } } catch (e) {}
    try { if (g && g.questLog && typeof g.questLog.chapter === 'number') ch = g.questLog.chapter + 1 } catch (e) {}
    return { lvl: lvl, ch: ch }
  }

  // --- zapis / wczytanie: migawka stanu gry w localStorage ---
  var SNAP_KEYS = ['wt.save', 'wt.class', 'wt.gear', 'wt.inv', 'wt.stats', 'wt.starter', 'wt.gold', 'wt.db', 'wt.dialogs', 'wt.mute']
  function slotKey(n) { return 'wt.slot' + n }
  function saveSlot(n) {
    var data = {}
    for (var i = 0; i < SNAP_KEYS.length; i++) {
      var v = localStorage.getItem(SNAP_KEYS[i])
      if (v !== null) data[SNAP_KEYS[i]] = v
    }
    var inf = heroInfo()
    lsSet(slotKey(n), JSON.stringify({ t: Date.now(), lvl: inf.lvl, ch: inf.ch, data: data }))
  }
  function loadSlot(n) {
    var s = lsJSON(slotKey(n), null)
    if (!s || !s.data) return false
    for (var k in s.data) lsSet(k, s.data[k])
    return true
  }
  function slotMeta(n) { return lsJSON(slotKey(n), null) }

  function fmtDate(ts) {
    var d = new Date(ts)
    function p(x) { return (x < 10 ? '0' : '') + x }
    return p(d.getDate()) + '.' + p(d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + p(d.getHours()) + ':' + p(d.getMinutes())
  }

  function renderMenu() {
    var inf = heroInfo()
    var h = '<div class="m-box">'
    if (menuView === 'main') {
      var mute = lsGet('wt.mute', '0') === '1'
      h += '<div class="m-logo">WYRWOR</div>' +
        '<div class="m-sub">poziom ' + inf.lvl + ' · rozdział ' + inf.ch + '</div>' +
        '<button class="m-btn" data-act="resume">▶ Wróć do gry</button>' +
        '<button class="m-btn" data-act="charsheet">Karta postaci</button>' +
        '<button class="m-btn" data-act="saveview">💾 Zapisz grę</button>' +
        '<button class="m-btn" data-act="loadview">📖 Wczytaj grę</button>' +
        '<button class="m-btn" data-act="mute">' + (mute ? '🔇 Dźwięk: wyłączony' : '🔊 Dźwięk: włączony') + '</button>' +
        '<button class="m-btn danger" data-act="newgame">Nowa gra</button>' +
        '<div class="m-hint">ESC — wróć do łowów · I — karta postaci</div>'
    } else {
      var isSave = menuView === 'save'
      h += '<div class="m-logo" style="font-size:clamp(22px,4vw,34px)">' + (isSave ? 'ZAPIS GRY' : 'WCZYTAJ GRĘ') + '</div><div style="height:14px"></div><div class="m-slots">'
      for (var n = 1; n <= 3; n++) {
        var m = slotMeta(n)
        if (m) {
          h += '<div class="m-slot" data-act="' + (isSave ? 'save' : 'load') + '" data-n="' + n + '">' +
            '<div class="s-t">Zapis ' + n + ' — poz. ' + m.lvl + ', rozdz. ' + m.ch + '</div>' +
            '<div class="s-m">' + fmtDate(m.t) + '</div></div>'
        } else {
          h += '<div class="m-slot empty" ' + (isSave ? 'data-act="save" data-n="' + n + '"' : '') + '><div class="s-t">Zapis ' + n + ' — pusty</div>' +
            (isSave ? '<div class="s-m">kliknij, aby zapisać</div>' : '') + '</div>'
        }
      }
      h += '</div><button class="m-back" data-act="tomain">◂ powrót do menu</button>'
    }
    h += '</div>'
    menu.innerHTML = h
  }

  function ensureMenu() {
    if (menu) return menu
    menuCss()
    menu = document.createElement('div')
    menu.id = 'wt-menu'
    document.body.appendChild(menu)
    menu.addEventListener('click', function (e) {
      var el = e.target.closest ? e.target.closest('[data-act]') : null
      if (!el) return
      var act = el.getAttribute('data-act')
      if (act === 'resume' || act === 'tomain') {
        if (act === 'tomain') { menuView = 'main'; renderMenu(); return }
        closeMenu()
      } else if (act === 'charsheet') {
        closeMenu()
        if (window.__wtCS) window.__wtCS.toggle(true)
      } else if (act === 'saveview') { menuView = 'save'; renderMenu() }
      else if (act === 'loadview') { menuView = 'load'; renderMenu() }
      else if (act === 'save') {
        saveSlot(Number(el.getAttribute('data-n')))
        menuView = 'main'; renderMenu()
      } else if (act === 'load') {
        if (loadSlot(Number(el.getAttribute('data-n')))) location.reload()
      } else if (act === 'mute') {
        lsSet('wt.mute', lsGet('wt.mute', '0') === '1' ? '0' : '1')
        try { if (window.__WT && window.__WT.muted !== undefined) window.__WT.muted = lsGet('wt.mute') === '1' } catch (err) {}
        renderMenu()
      } else if (act === 'newgame') {
        if (!window.confirm('Na pewno? Cały postęp bohatera, sakwa i ekwipunek zostaną utracone.')) return
        var kill = SNAP_KEYS.concat(['wt.slot1', 'wt.slot2', 'wt.slot3'])
        for (var i = 0; i < kill.length; i++) { try { localStorage.removeItem(kill[i]) } catch (err) {} }
        location.reload()
      }
    })
    return menu
  }

  function openMenu() {
    menuView = 'main'
    ensureMenu(); renderMenu()
    menu.classList.add('show')
    setPaused(true)
  }
  function closeMenu() {
    if (menu) menu.classList.remove('show')
    setPaused(false)
  }
  function menuOpen() { return !!(menu && menu.classList.contains('show')) }

  // ============================================================
  // SKLEP — NPC w mieście handlują (przycisk w oknie dialogu)
  // ============================================================
  var shop = null, shopTab = 'buy'

  function gold() { var g = parseInt(lsGet('wt.gold', ''), 10); return isNaN(g) ? 50 : g }
  function setGold(v) { lsSet('wt.gold', String(v)) }
  function priceOf(it) {
    var base = { common: 20, magic: 60, rare: 140, unique: 320 }[it.rarity] || 20
    var sum = 0
    (it.affixes || []).forEach(function (a) { sum += a.value })
    return base + sum * 2
  }

  function shopItems() {
    var pool = (GD && Array.isArray(GD.items)) ? GD.items.filter(validGameItem) : []
    return pool.map(function (it) { return JSON.parse(JSON.stringify(it)) })
  }

  function shopCss() {
    var st = document.createElement('style')
    st.textContent =
      '#wt-shop{position:fixed;inset:0;z-index:150;display:none;align-items:center;justify-content:center;background:rgba(6,3,10,.8);font-family:Georgia,serif}' +
      '#wt-shop.show{display:flex}' +
      '#wt-shop .sh-box{width:min(760px,94vw);max-height:88vh;overflow:auto;background:#0d0815;border:1px solid #6b21a8;border-radius:10px;padding:22px 26px;box-shadow:0 0 46px rgba(168,85,247,.3)}' +
      '#wt-shop .sh-head{display:flex;align-items:baseline;gap:14px;border-bottom:1px solid #3f2a55;padding-bottom:10px;margin-bottom:12px}' +
      '#wt-shop .sh-title{color:#e9d5ff;letter-spacing:.26em;font-size:18px}' +
      '#wt-shop .sh-gold{margin-left:auto;color:#fbbf24;font-size:15px;letter-spacing:.06em}' +
      '#wt-shop .sh-x{color:#71717a;font-size:20px;cursor:pointer;padding:0 6px}' +
      '#wt-shop .sh-x:hover{color:#f3e8ff}' +
      '#wt-shop .sh-tabs{display:flex;gap:8px;margin-bottom:12px}' +
      '#wt-shop .sh-tab{padding:7px 18px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#a1a1aa;background:rgba(20,12,32,.6);border:1px solid #3f2a55;border-radius:5px;cursor:pointer}' +
      '#wt-shop .sh-tab.on{color:#e9d5ff;border-color:#a855f7}' +
      '#wt-shop .sh-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px}' +
      '#wt-shop .sh-it{display:flex;align-items:center;gap:10px;padding:10px 12px;background:rgba(20,12,32,.8);border:1px solid #3f2a55;border-radius:7px;cursor:pointer;transition:all .15s}' +
      '#wt-shop .sh-it:hover{border-color:#a855f7;box-shadow:0 0 14px rgba(168,85,247,.3)}' +
      '#wt-shop .sh-it .i-nm{font-size:12.5px;line-height:1.25}' +
      '#wt-shop .sh-it .i-pr{margin-left:auto;color:#fbbf24;font-size:13px;white-space:nowrap}' +
      '#wt-shop .sh-empty{color:#71717a;font-size:13px;padding:22px;text-align:center;grid-column:1/-1}' +
      '#wt-shop .sh-hint{color:#52525b;font-size:11px;margin-top:12px;text-align:center;letter-spacing:.1em}' +
      '.wt-shop-btn{display:inline-block;margin-top:10px;padding:7px 16px;font-family:Georgia,serif;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#fbbf24;background:rgba(46,22,74,.7);border:1px solid #92400e;border-radius:6px;cursor:pointer;transition:all .15s}' +
      '.wt-shop-btn:hover{border-color:#fbbf24;box-shadow:0 0 14px rgba(251,191,36,.4);color:#fde68a}'
    document.head.appendChild(st)
  }

  function renderShop() {
    if (!shop) return
    var g = gold()
    var inv = lsJSON('wt.inv', [])
    if (!Array.isArray(inv)) inv = []
    var h = '<div class="sh-box">' +
      '<div class="sh-head"><div class="sh-title">SKLEP</div><div class="sh-gold">🪙 ' + g + '</div><div class="sh-x" data-act="close">✕</div></div>' +
      '<div class="sh-tabs"><div class="sh-tab ' + (shopTab === 'buy' ? 'on' : '') + '" data-act="tab-buy">Kupno</div><div class="sh-tab ' + (shopTab === 'sell' ? 'on' : '') + '" data-act="tab-sell">Sprzedaż · sakwa (' + inv.length + ')</div></div>' +
      '<div class="sh-grid">'
    if (shopTab === 'buy') {
      var items = shopItems()
      if (!items.length) h += '<div class="sh-empty">Sklep pusty — dodaj przedmioty w panelu admina (Baza gry → gamedata.json)</div>'
      items.forEach(function (it, i) {
        var p = priceOf(it)
        h += '<div class="sh-it" data-act="buy" data-i="' + i + '" data-wtitem="' + esc(JSON.stringify(it)) + '">' +
          '<div class="i-nm" style="color:' + (RAR[it.rarity] || '#d6d3d1') + '">' + esc(it.name) + '<br><span style="color:#71717a;font-size:10.5px">' + (SLOT_PL[it.slot] || it.slot) + ' · ' + (RAR_PL[it.rarity] || it.rarity) + '</span></div>' +
          '<div class="i-pr">🪙 ' + p + '</div></div>'
      })
    } else {
      if (!inv.length) h += '<div class="sh-empty">Sakwa pusta — nic do sprzedania</div>'
      inv.forEach(function (it, i) {
        var p = Math.max(5, Math.floor(priceOf(it) / 4))
        h += '<div class="sh-it" data-act="sell" data-i="' + i + '" data-wtitem="' + esc(JSON.stringify(it)) + '">' +
          '<div class="i-nm" style="color:' + (RAR[it.rarity] || '#d6d3d1') + '">' + esc(it.name) + '<br><span style="color:#71717a;font-size:10.5px">' + (SLOT_PL[it.slot] || it.slot) + ' · ' + (RAR_PL[it.rarity] || it.rarity) + '</span></div>' +
          '<div class="i-pr">🪙 ' + p + '</div></div>'
      })
    }
    h += '</div><div class="sh-hint">kliknij przedmiot, aby ' + (shopTab === 'buy' ? 'kupić' : 'sprzedać') + ' · podgląd statystyk po najechaniu</div></div>'
    shop.innerHTML = h
  }

  function ensureShop() {
    if (shop) return shop
    shopCss()
    shop = document.createElement('div')
    shop.id = 'wt-shop'
    document.body.appendChild(shop)
    shop.addEventListener('click', function (e) {
      var el = e.target.closest ? e.target.closest('[data-act]') : null
      if (!el) return
      var act = el.getAttribute('data-act')
      if (act === 'close') { shop.classList.remove('show') }
      else if (act === 'tab-buy') { shopTab = 'buy'; renderShop() }
      else if (act === 'tab-sell') { shopTab = 'sell'; renderShop() }
      else if (act === 'buy') {
        var items = shopItems()
        var it = items[Number(el.getAttribute('data-i'))]
        if (!it) return
        var p = priceOf(it)
        if (gold() < p) { alert('Za mało złota! Potrzebujesz 🪙 ' + p) ; return }
        if (window.__wtInvAdd && window.__wtInvAdd(JSON.parse(JSON.stringify(it)))) {
          setGold(gold() - p)
          renderShop()
        } else alert('Sakwa pełna!')
      } else if (act === 'sell') {
        var inv = lsJSON('wt.inv', [])
        if (!Array.isArray(inv)) inv = []
        var i = Number(el.getAttribute('data-i'))
        var it2 = inv[i]
        if (!it2) return
        var p2 = Math.max(5, Math.floor(priceOf(it2) / 4))
        inv.splice(i, 1)
        lsSet('wt.inv', JSON.stringify(inv))
        setGold(gold() + p2)
        renderShop()
      }
    })
    return shop
  }

  function openShop() { ensureShop(); shopTab = 'buy'; renderShop(); shop.classList.add('show') }

  // przycisk „Handel" w oknie dialogu NPC (NPC w mieście = sklep)
  setInterval(function () {
    var d = document.getElementById('npc-dialogue')
    if (!d) return
    var btn = d.querySelector('.wt-shop-btn')
    if (!btn && d.classList.contains('show')) {
      btn = document.createElement('button')
      btn.className = 'wt-shop-btn'
      btn.textContent = '🛒 Handel'
      btn.addEventListener('click', function (e) { e.stopPropagation(); openShop() })
      d.appendChild(btn)
    }
  }, 700)

  // ============================================================
  // MAPA (TAB) — schematyczna mapa terenu: Ty, NPC, wrogowie, łupy
  // ============================================================
  var mapEl = null, mapCv = null, mapTimer = null

  function ensureMap() {
    if (mapEl) return mapEl
    var st = document.createElement('style')
    st.textContent =
      '#wt-map{position:fixed;inset:0;z-index:180;display:none;align-items:center;justify-content:center;background:rgba(5,2,8,.82);backdrop-filter:blur(2px);font-family:Georgia,serif}' +
      '#wt-map.show{display:flex}' +
      '#wt-map .mp-box{display:flex;flex-direction:column;align-items:center;gap:10px}' +
      '#wt-map .mp-title{color:#e9d5ff;letter-spacing:.34em;font-size:20px;text-shadow:0 0 18px #6b21a8}' +
      '#wt-map canvas{background:#0d0815;border:1px solid #6b21a8;border-radius:10px;box-shadow:0 0 40px rgba(168,85,247,.3)}' +
      '#wt-map .mp-legend{color:#a1a1aa;font-size:12px;letter-spacing:.08em;display:flex;gap:18px}' +
      '#wt-map .mp-legend b{font-weight:normal}' +
      '#wt-map .mp-hint{color:#52525b;font-size:11px;letter-spacing:.14em}'
    document.head.appendChild(st)
    mapEl = document.createElement('div')
    mapEl.id = 'wt-map'
    mapEl.innerHTML = '<div class="mp-box"><div class="mp-title">MAPA ŻAROWARTY</div><canvas width="560" height="560"></canvas>' +
      '<div class="mp-legend"><b style="color:#c084fc">◆ Ty</b><b style="color:#fbbf24">● NPC</b><b style="color:#ef4444">● wrogowie</b><b style="color:#d6d3d1">♦ łupy</b></div>' +
      '<div class="mp-hint">TAB — zamknij mapę</div></div>'
    document.body.appendChild(mapEl)
    mapCv = mapEl.querySelector('canvas')
    return mapEl
  }

  function mapEntities() {
    var g = window.__WT
    var out = { me: null, npcs: [], foes: [], loot: [] }
    if (!g) return out
    try { if (g.hero && g.hero.position) out.me = { x: g.hero.position.x, z: g.hero.position.z, yaw: (g.hero.rotation ? g.hero.rotation.y : null) } } catch (e) {}
    try {
      var ns = g.npcs && g.npcs.npcs
      if (Array.isArray(ns)) ns.forEach(function (n) {
        if (n && n.group && n.group.position) out.npcs.push({ x: n.group.position.x, z: n.group.position.z, id: n.def && n.def.id })
      })
    } catch (e) {}
    try {
      if (Array.isArray(g.enemies)) g.enemies.forEach(function (en) {
        if (en && !en.removed && en.group && en.group.position) out.foes.push({ x: en.group.position.x, z: en.group.position.z, elite: !!(en.kind && en.kind.elite) })
      })
    } catch (e) {}
    try {
      var L = g.loot
      if (L && Array.isArray(L.drops)) L.drops.forEach(function (dr) {
        if (dr && dr.group && dr.group.position && dr.item) out.loot.push({ x: dr.group.position.x, z: dr.group.position.z, rarity: dr.item.rarity })
      })
    } catch (e) {}
    return out
  }

  function drawMap() {
    if (!mapCv) return
    var ctx = mapCv.getContext('2d')
    var W = mapCv.width, H = mapCv.height
    var E = mapEntities()
    // zakres: dopasuj do istot, min. promień 35 wokół gracza
    var cx = E.me ? E.me.x : 0, cz = E.me ? E.me.z : 0
    var r = 35
    var all = [{ x: cx, z: cz }].concat(E.npcs, E.foes, E.loot)
    all.forEach(function (p) {
      r = Math.max(r, Math.abs(p.x - cx), Math.abs(p.z - cz))
    })
    r = Math.min(r + 8, 400)
    var sc = (Math.min(W, H) / 2 - 24) / r
    function px(x) { return W / 2 + (x - cx) * sc }
    function pz(z) { return H / 2 - (z - cz) * sc } // oś Z odwrócona: północ = -Z

    ctx.clearRect(0, 0, W, H)
    // tło: mgła + siatka
    var grad = ctx.createRadialGradient(W / 2, H / 2, 20, W / 2, H / 2, W / 2)
    grad.addColorStop(0, '#171029')
    grad.addColorStop(1, '#0a0612')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)
    ctx.strokeStyle = 'rgba(168,85,247,.12)'
    ctx.lineWidth = 1
    for (var gx = -r; gx <= r; gx += 20) {
      ctx.beginPath(); ctx.moveTo(px(cx + gx), 0); ctx.lineTo(px(cx + gx), H); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, pz(cz + gx)); ctx.lineTo(W, pz(cz + gx)); ctx.stroke()
    }
    // łupy
    E.loot.forEach(function (l) {
      ctx.fillStyle = RAR[l.rarity] || '#d6d3d1'
      ctx.beginPath()
      ctx.moveTo(px(l.x), pz(l.z) - 5); ctx.lineTo(px(l.x) + 5, pz(l.z)); ctx.lineTo(px(l.x), pz(l.z) + 5); ctx.lineTo(px(l.x) - 5, pz(l.z))
      ctx.closePath(); ctx.fill()
    })
    // wrogowie
    E.foes.forEach(function (f) {
      ctx.fillStyle = f.elite ? '#dc2626' : '#ef4444'
      ctx.beginPath(); ctx.arc(px(f.x), pz(f.z), f.elite ? 4.5 : 3, 0, 7); ctx.fill()
    })
    // NPC
    ctx.fillStyle = '#fbbf24'
    E.npcs.forEach(function (n) {
      ctx.beginPath(); ctx.arc(px(n.x), pz(n.z), 4, 0, 7); ctx.fill()
      if (n.id) {
        ctx.fillStyle = '#a16207'
        ctx.font = '10px Georgia'
        ctx.textAlign = 'center'
        ctx.fillText(n.id, px(n.x), pz(n.z) - 7)
      }
    })
    // gracz
    if (E.me) {
      var mx = px(E.me.x), mz = pz(E.me.z)
      ctx.save()
      ctx.translate(mx, mz)
      if (E.me.yaw !== null && !isNaN(E.me.yaw)) ctx.rotate(-E.me.yaw)
      ctx.fillStyle = '#c084fc'
      ctx.shadowColor = '#a855f7'; ctx.shadowBlur = 14
      ctx.beginPath()
      ctx.moveTo(0, -10); ctx.lineTo(7, 8); ctx.lineTo(0, 4); ctx.lineTo(-7, 8)
      ctx.closePath(); ctx.fill()
      ctx.restore()
    }
    // skala
    ctx.fillStyle = '#52525b'
    ctx.font = '10px Georgia'
    ctx.textAlign = 'left'
    var bar = 20 * sc
    ctx.fillRect(16, H - 22, bar, 3)
    ctx.fillText('20 kroków', 16, H - 27)
  }

  function mapOpen() { return !!(mapEl && mapEl.classList.contains('show')) }
  function toggleMap(force) {
    ensureMap()
    var v = typeof force === 'boolean' ? force : !mapOpen()
    mapEl.classList.toggle('show', v)
    if (v) {
      drawMap()
      mapTimer = setInterval(drawMap, 150)
    } else if (mapTimer) { clearInterval(mapTimer); mapTimer = null }
  }

  // ============================================================
  // KLAWISZE: ESC — menu, TAB — mapa
  // ============================================================
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
      e.preventDefault()
      if (!e.repeat) toggleMap()
      return
    }
    if (e.key !== 'Escape' || e.repeat) return
    if (quickPanelOpen()) return
    if (window.__wtCS && window.__wtCS.isOpen && window.__wtCS.isOpen()) return // karta postaci sama się zamknie
    if (shop && shop.classList.contains('show')) { e.preventDefault(); shop.classList.remove('show'); return }
    if (window.__wtShopBlocked) return
    if (mapOpen()) { e.preventDefault(); toggleMap(false); return }
    e.preventDefault()
    if (menuOpen()) closeMenu()
    else openMenu()
  })

  // live-sync z panelem admina
  try {
    var ch = new BroadcastChannel('wt-admin')
    ch.onmessage = function (ev) {
      var d = ev.data || {}
      if (d.type === 'ping') ch.postMessage({ type: 'pong', game: true })
      if (d.type === 'pause' && !menuOpen()) openMenu()
      if (d.type === 'unpause' && menuOpen()) closeMenu()
    }
  } catch (e) {}

  // wystartuj z domyślnym złotem
  if (localStorage.getItem('wt.gold') === null) lsSet('wt.gold', '50')
})()
