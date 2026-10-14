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
  var SNAP_KEYS = ['wt.save', 'wt.class', 'wt.gear', 'wt.inv', 'wt.stats', 'wt.starter', 'wt.gold', 'wt.db', 'wt.dialogs', 'wt.mute', 'wt.fog']
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
        if (loadSlot(Number(el.getAttribute('data-n')))) {
          try { sessionStorage.setItem('wt.skipTitle', '1') } catch (err) {}
          location.reload()
        }
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
    var base = { common: 20, magic: 60, rare: 140, unique: 320 }[it.rarity] || 20;
    var sum = 0;
    (it.affixes || []).forEach(function (a) { sum += a.value });
    return base + sum * 2;
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
      '.wt-shop-btn{display:block;margin:12px auto 0;padding:8px 22px;font-family:Georgia,serif;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#1c1408;background:linear-gradient(#e8d18a,#c9a24a);border:1px solid #a8863a;border-radius:6px;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.55),inset 0 1px 0 #ffffff66;transition:box-shadow .15s,transform .1s}' +
      '.wt-shop-btn:hover{background:linear-gradient(#e8d18a,#c9a24a);color:#1c1408;box-shadow:0 0 14px rgba(232,209,138,.45),inset 0 1px 0 #ffffff66;transform:translateY(-1px)}' +
      '.wt-shop-btn:active{transform:translateY(0)}'
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
      '#wt-map{position:fixed;inset:0;z-index:180;display:none;align-items:center;justify-content:center;background:rgba(5,3,2,.85);backdrop-filter:blur(2px);font-family:Georgia,serif}' +
      '#wt-map.show{display:flex}' +
      '#wt-map .mp-box{display:flex;flex-direction:column;align-items:center;gap:10px}' +
      '#wt-map .mp-title{color:#d6d0c4;letter-spacing:.34em;font-size:20px;text-shadow:0 2px 4px #000}' +
      '#wt-map canvas{background:#141110;border:1px solid #57534e;border-radius:10px;box-shadow:0 0 40px rgba(0,0,0,.6),inset 0 0 30px rgba(0,0,0,.5)}' +
      '#wt-map .mp-legend{color:#a8a29e;font-size:12px;letter-spacing:.08em;display:flex;gap:18px}' +
      '#wt-map .mp-legend b{font-weight:normal}' +
      '#wt-map .mp-hint{color:#78716c;font-size:11px;letter-spacing:.14em}'
    document.head.appendChild(st)
    mapEl = document.createElement('div')
    mapEl.id = 'wt-map'
    mapEl.innerHTML = '<div class="mp-box"><div class="mp-title">MAPA ŻAROWARTY</div><canvas width="560" height="560"></canvas>' +
      '<div class="mp-legend"><b style="color:#c084fc">◆ Ty</b><b style="color:#fbbf24">● NPC</b><b style="color:#ef4444">● wrogowie</b><b style="color:#d6d3d1">♦ łupy</b><b style="color:#a8845e">◯ osada</b></div>' +
      '<div class="mp-hint">ciemne płyty = nieodkryty teren &middot; TAB — zamknij mapę</div></div>'
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

  // ---- mgła wojny: teren odkrywa się stopniowo, w miarę chodzenia ----
  var FOG_KEY = 'wt.fog', FOG_STEP = 10, fogCells = null
  function loadFog() {
    if (fogCells) return fogCells
    try { fogCells = new Set(JSON.parse(localStorage.getItem(FOG_KEY) || '[]')) } catch (e) { fogCells = new Set() }
    return fogCells
  }
  function cellKey(ix, iz) { return ix + ',' + iz }
  function cellOf(x, z) { return cellKey(Math.round(x / FOG_STEP), Math.round(z / FOG_STEP)) }
  function visited(x, z) { return loadFog().has(cellOf(x, z)) }
  function markFog(x, z) {
    var f = loadFog()
    var ix = Math.round(x / FOG_STEP), iz = Math.round(z / FOG_STEP)
    var n = f.size
    for (var dx = -1; dx <= 1; dx++) for (var dz = -1; dz <= 1; dz++) f.add(cellKey(ix + dx, iz + dz))
    if (f.size !== n) lsSet(FOG_KEY, JSON.stringify(Array.from(f))) // zapisz tylko przy nowym terenie
  }

  function drawMap() {
    if (!mapCv) return
    var ctx = mapCv.getContext('2d')
    var W = mapCv.width, H = mapCv.height
    var E = mapEntities()
    var cx = E.me ? E.me.x : 0, cz = E.me ? E.me.z : 0
    if (E.me) markFog(cx, cz)
    var r = 70
    var sc = (Math.min(W, H) / 2 - 20) / r
    function px(x) { return W / 2 + (x - cx) * sc }
    function pz(z) { return H / 2 - (z - cz) * sc } // oś Z odwrócona: północ = -Z
    function clampPt(p) {
      var dx = (p.x - cx) * sc, dz = -(p.z - cz) * sc
      var d = Math.sqrt(dx * dx + dz * dz), lim = Math.min(W, H) / 2 - 14
      if (d <= lim) return { x: W / 2 + dx, y: H / 2 + dz, edge: false }
      var k = lim / d
      return { x: W / 2 + dx * k, y: H / 2 + dz * k, edge: true }
    }

    ctx.clearRect(0, 0, W, H)
    // kamieniste tło
    var grad = ctx.createRadialGradient(W / 2, H / 2, 20, W / 2, H / 2, W / 2)
    grad.addColorStop(0, '#221e1a')
    grad.addColorStop(1, '#12100d')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)
    ctx.save()
    ctx.beginPath(); ctx.arc(W / 2, H / 2, Math.min(W, H) / 2 - 12, 0, 7); ctx.clip()
    // odkryty teren: kamienna siatka
    ctx.strokeStyle = 'rgba(168,157,134,.16)'
    ctx.lineWidth = 1
    var cell = FOG_STEP * sc
    for (var g10 = -r; g10 <= r; g10 += FOG_STEP) {
      var lx = px(cx + g10), lz = pz(cz + g10)
      if (visited(cx + g10 + FOG_STEP / 2, cz + g10 + FOG_STEP / 2)) {
        ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, H); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(0, lz); ctx.lineTo(W, lz); ctx.stroke()
      }
    }
    // nieodkryty teren: ciemne kamieniste płyty
    var ix0 = Math.floor((cx - r) / FOG_STEP), ix1 = Math.ceil((cx + r) / FOG_STEP)
    var iz0 = Math.floor((cz - r) / FOG_STEP), iz1 = Math.ceil((cz + r) / FOG_STEP)
    for (var fx = ix0; fx <= ix1; fx++) for (var fz = iz0; fz <= iz1; fz++) {
      if (loadFog().has(cellKey(fx, fz))) continue
      var wx = px(fx * FOG_STEP), wz = pz(fz * FOG_STEP)
      // deterministyczny odcień — wygląda jak nierówny kamień
      var h = (fx * 73856093 ^ fz * 19349663) >>> 0
      var shade = 10 + (h % 7)
      ctx.fillStyle = 'rgb(' + shade + ',' + (shade - 2) + ',' + (shade - 4) + ')'
      ctx.fillRect(wx, wz, cell + 1, cell + 1)
      if (h % 3 === 0) { // rysa w skale
        ctx.strokeStyle = 'rgba(0,0,0,.4)'
        ctx.beginPath(); ctx.moveTo(wx + 2, wz + 3); ctx.lineTo(wx + cell - 2, wz + cell - 3); ctx.stroke()
      }
    }
    // osada — okrąg palisady + podpis
    var tdx = TOWN.x - cx, tdz = TOWN.z - cz
    if (Math.sqrt(tdx * tdx + tdz * tdz) < r + TOWN.r + 6) {
      var tcx = W / 2 + tdx * sc, tcz = H / 2 - tdz * sc
      ctx.strokeStyle = '#a8845e'
      ctx.lineWidth = 2.5
      ctx.beginPath(); ctx.arc(tcx, tcz, TOWN.r * sc, 0, 7); ctx.stroke()
      ctx.strokeStyle = 'rgba(168,132,94,.4)'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.arc(tcx, tcz, (TOWN.r - 1.2) * sc, 0, 7); ctx.stroke()
      // ognisko
      ctx.fillStyle = '#f97316'
      ctx.beginPath(); ctx.arc(tcx, tcz + 3 * sc, 2.2, 0, 7); ctx.fill()
      // brama (przerwa w okręgu) — kierunek (-1,-1)
      ctx.fillStyle = '#141110'
      ctx.beginPath()
      ctx.arc(tcx, tcz, TOWN.r * sc + 1.5, 0, 7)
      ctx.arc(tcx, tcz, (TOWN.r - 2.4) * sc, 0, 7, true)
      var gA = Math.atan2(1, 1) // brama w stronę (-x,-z) na mapie
      ctx.save(); ctx.translate(tcx, tcz); ctx.rotate(gA)
      ctx.fillStyle = '#0a0612'
      ctx.fillRect(-3.5, TOWN.r * sc - 2.5, 7, 5)
      ctx.restore()
      ctx.fillStyle = '#d6c9a8'
      ctx.font = 'bold 11px Georgia'
      ctx.textAlign = 'center'
      ctx.fillText('OSADA', tcx, tcz + TOWN.r * sc + 13)
    }
    // łupy — tylko na odkrytym terenie
    E.loot.forEach(function (l) {
      if (!visited(l.x, l.z)) return
      var pt = clampPt(l)
      ctx.globalAlpha = pt.edge ? .45 : 1
      ctx.fillStyle = RAR[l.rarity] || '#d6d3d1'
      ctx.beginPath()
      ctx.moveTo(pt.x, pt.y - 5); ctx.lineTo(pt.x + 5, pt.y); ctx.lineTo(pt.x, pt.y + 5); ctx.lineTo(pt.x - 5, pt.y)
      ctx.closePath(); ctx.fill()
    })
    // wrogowie
    E.foes.forEach(function (f) {
      if (!visited(f.x, f.z)) return
      var pt = clampPt(f)
      ctx.globalAlpha = pt.edge ? .45 : 1
      ctx.fillStyle = f.elite ? '#dc2626' : '#ef4444'
      ctx.beginPath(); ctx.arc(pt.x, pt.y, f.elite ? 4.5 : 3, 0, 7); ctx.fill()
    })
    // NPC
    E.npcs.forEach(function (n) {
      if (!visited(n.x, n.z)) return
      var pt = clampPt(n)
      ctx.globalAlpha = pt.edge ? .45 : 1
      ctx.fillStyle = '#fbbf24'
      ctx.beginPath(); ctx.arc(pt.x, pt.y, 4, 0, 7); ctx.fill()
      if (n.id && !pt.edge) {
        ctx.fillStyle = '#a16207'
        ctx.font = '10px Georgia'
        ctx.textAlign = 'center'
        ctx.fillText(n.id, pt.x, pt.y - 7)
      }
    })
    ctx.restore()
    ctx.globalAlpha = 1
    // gracz — strzałka zwrócona w kierunku patrzenia
    if (E.me) {
      var mx = px(E.me.x), mz = pz(E.me.z)
      ctx.save()
      ctx.translate(mx, mz)
      ctx.rotate(E.me.yaw || 0)
      ctx.fillStyle = '#c084fc'
      ctx.shadowColor = '#a855f7'; ctx.shadowBlur = 14
      ctx.beginPath()
      ctx.moveTo(0, -10); ctx.lineTo(7, 8); ctx.lineTo(0, 4); ctx.lineTo(-7, 8)
      ctx.closePath(); ctx.fill()
      ctx.restore()
    }
    // skala
    ctx.fillStyle = '#78716c'
    ctx.font = '10px Georgia'
    ctx.textAlign = 'left'
    ctx.fillRect(16, H - 22, 10 * sc, 3)
    ctx.fillText('10 kroków', 16, H - 27)
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
  // OSADA (jak obóz z Diablo 2) — palisada, ognisko, namioty, strefa bezpieczna
  // ============================================================
  var TOWN = { x: 40, z: 40, r: 14 } // środek obozu = punkt startowy bohatera
  var fireLight = null, fireFlames = [], townDone = false

  function townBuilt() { return townDone }

  function buildTown() {
    var dbg = window.__WTdebug
    var g = window.__WT
    if (!dbg || !g || !g.scene || townBuilt()) return false
    var THREE = dbg.THREE
    if (!THREE) { console.warn('[wt] osada: brak THREE w __WTdebug'); return false }
    try {
      return buildTownInner(THREE, g)
    } catch (e) {
      console.error('[wt] osada: błąd budowy:', e)
      return false
    }
  }

  function buildTownInner(THREE, g) {
    var scene = g.scene
    var root = new THREE.Group()
    root.name = 'wt-town'
    console.log('[wt] buduję Osadę Żarowarta (v7)…')

    var wood = new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 1 })
    var woodDark = new THREE.MeshStandardMaterial({ color: 0x4a3018, roughness: 1 })
    var daub = new THREE.MeshStandardMaterial({ color: 0x7d6b4f, roughness: 1 })
    var thatch = new THREE.MeshStandardMaterial({ color: 0x8a6d3b, roughness: 1 })
    var stoneM = new THREE.MeshStandardMaterial({ color: 0x635d55, roughness: 1 })
    var stoneDark = new THREE.MeshStandardMaterial({ color: 0x4e4a44, roughness: 1 })
    var windowM = new THREE.MeshBasicMaterial({ color: 0xffc15e })
    var doorM = new THREE.MeshStandardMaterial({ color: 0x3a2314, roughness: 1 })
    var hayM = new THREE.MeshStandardMaterial({ color: 0xb08d3f, roughness: 1 })
    var flameM = new THREE.MeshBasicMaterial({ color: 0xff9a3c, transparent: true, opacity: 0.95 })
    var bannerM = new THREE.MeshBasicMaterial({ color: 0x7c2d12, side: 2 })
    var fireLights = []

    // ---- plac: bruk wokół ogniska ----
    var plaza = new THREE.Mesh(new THREE.CircleGeometry(6.5, 24), stoneDark)
    plaza.rotation.x = -Math.PI / 2
    plaza.position.set(TOWN.x, 0.02, TOWN.z)
    root.add(plaza)
    var plaza2 = new THREE.Mesh(new THREE.CircleGeometry(5.6, 24), stoneM)
    plaza2.rotation.x = -Math.PI / 2
    plaza2.position.set(TOWN.x, 0.035, TOWN.z)
    root.add(plaza2)
    var rim = new THREE.Mesh(new THREE.RingGeometry(6.3, 6.7, 24), new THREE.MeshStandardMaterial({ color: 0x2e2a26, roughness: 1 }))
    rim.rotation.x = -Math.PI / 2
    rim.position.set(TOWN.x, 0.05, TOWN.z)
    root.add(rim)

    // ---- domy: ściany z ubitej gliny, słomiane dachy, świecące okna ----
    function buildHouse(dx, dz, rot) {
      var h = new THREE.Group()
      var wall = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.2, 4.6), daub)
      wall.position.y = 1.1
      h.add(wall)
      var plinth = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.35, 4.9), woodDark)
      plinth.position.y = 0.17
      h.add(plinth)
      var roof = new THREE.Mesh(new THREE.ConeGeometry(3.1, 1.7, 4), thatch)
      roof.position.y = 3.0
      roof.rotation.y = Math.PI / 4
      h.add(roof)
      var chim = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.5, 0.5), stoneM)
      chim.position.set(1.2, 2.7, -1.4)
      h.add(chim)
      var door = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.5), doorM)
      door.position.set(-0.6, 0.95, 2.32)
      h.add(door)
      var win1 = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.6), windowM)
      win1.position.set(0.9, 1.4, 2.32)
      h.add(win1)
      var win2 = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.6), windowM)
      win2.position.set(1.82, 1.4, -0.6)
      win2.rotation.y = Math.PI / 2
      h.add(win2)
      h.position.set(TOWN.x + dx, 0, TOWN.z + dz)
      h.rotation.y = rot
      root.add(h)
    }
    buildHouse(-9.5, -3, -0.4)
    buildHouse(9.5, -4, 0.5)
    buildHouse(-8.5, 6, 3.0)
    buildHouse(9.5, 6, -2.8)
    buildHouse(3.5, -10.5, 0.15)
    buildHouse(-4, -10.5, -0.2)

    // ---- pochodnie wokół placu (migoczące światła) ----
    function buildTorch(dx, dz, withLight) {
      var pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 2.2, 5), woodDark)
      pole.position.set(TOWN.x + dx, 1.1, TOWN.z + dz)
      root.add(pole)
      var bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.09, 0.18, 6), stoneM)
      bowl.position.set(TOWN.x + dx, 2.25, TOWN.z + dz)
      root.add(bowl)
      var fl = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.45, 6), flameM)
      fl.position.set(TOWN.x + dx, 2.55, TOWN.z + dz)
      root.add(fl)
      fireFlames.push(fl)
      if (withLight) {
        var li = new THREE.PointLight(0xff8a3c, 5, 9, 2)
        li.position.set(TOWN.x + dx, 2.7, TOWN.z + dz)
        root.add(li)
        fireLights.push({ light: li, base: 5 })
      }
    }
    for (var ti = 0; ti < 8; ti++) {
      var ta = ti * Math.PI / 4
      buildTorch(Math.cos(ta) * 7, Math.sin(ta) * 7, ti % 2 === 0)
    }

    // ---- wieża strażnicza przy bramie ----
    var tw = new THREE.Group()
    for (var lx = -1; lx <= 1; lx += 2) for (var lz = -1; lz <= 1; lz += 2) {
      var leg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 3.4, 5), woodDark)
      leg.position.set(lx * 0.8, 1.7, lz * 0.8)
      tw.add(leg)
    }
    var deck = new THREE.Mesh(new THREE.BoxGeometry(2, 0.16, 2), wood)
    deck.position.y = 3.4
    tw.add(deck)
    for (var rx = -1; rx <= 1; rx += 2) for (var rz = -1; rz <= 1; rz += 2) {
      var rail = new THREE.Mesh(new THREE.BoxGeometry(rx ? 0.08 : 2, 0.5, rz ? 0.08 : 2), woodDark)
      rail.position.set(rx * 0.96, 3.8, rz * 0.96)
      tw.add(rail)
    }
    var twRoof = new THREE.Mesh(new THREE.ConeGeometry(1.7, 0.9, 4), thatch)
    twRoof.position.y = 4.6
    twRoof.rotation.y = Math.PI / 4
    tw.add(twRoof)
    var twFl = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.55, 6), flameM)
    twFl.position.y = 3.9
    tw.add(twFl)
    fireFlames.push(twFl)
    var twLi = new THREE.PointLight(0xff8a3c, 6, 10, 2)
    twLi.position.y = 4.2
    tw.add(twLi)
    fireLights.push({ light: twLi, base: 6 })
    var gateA = Math.atan2(-1, -1)
    tw.position.set(TOWN.x + Math.cos(gateA) * 10.4, 0, TOWN.z + Math.sin(gateA) * 10.4)
    root.add(tw)

    // ---- wóz z sianem ----
    var cart = new THREE.Group()
    var bed = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.14, 2.2), wood)
    bed.position.y = 0.75
    cart.add(bed)
    for (var wcx = -1; wcx <= 1; wcx += 2) {
      var wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.12, 10), woodDark)
      wheel.rotation.z = Math.PI / 2
      wheel.position.set(wcx * 0.72, 0.55, 0)
      cart.add(wheel)
    }
    var shaft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.6), woodDark)
    shaft.position.set(0.3, 0.5, -1.8)
    cart.add(shaft)
    var shaft2 = shaft.clone()
    shaft2.position.x = -0.3
    cart.add(shaft2)
    var hay = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.5, 0.8), hayM)
    hay.position.set(0, 1.05, 0.5)
    cart.add(hay)
    cart.position.set(TOWN.x + 5.5, 0, TOWN.z + 6.5)
    cart.rotation.y = 0.7
    root.add(cart)

    // ---- snopki siana, skrzynie, sztandar ----
    var hays = [[-6.5, -2.5], [5, -9.5]]
    hays.forEach(function (hp) {
      var bale = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.8, 7), hayM)
      bale.rotation.z = Math.PI / 2
      bale.position.set(TOWN.x + hp[0], 0.45, TOWN.z + hp[1])
      root.add(bale)
    })
    var crates = [[3, 4.2, 0.7], [3.9, 4.9, 0.55], [-4.2, 4.6, 0.6]]
    crates.forEach(function (cp) {
      var c = new THREE.Mesh(new THREE.BoxGeometry(cp[2], cp[2], cp[2]), wood)
      c.position.set(TOWN.x + cp[0], cp[2] / 2, TOWN.z + cp[1])
      c.rotation.y = cp[0]
      root.add(c)
    })
    var bPole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 4.4, 5), woodDark)
    bPole.position.set(TOWN.x - 7.8, 2.2, TOWN.z - 11.6)
    root.add(bPole)
    var bFlag = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.7), bannerM)
    bFlag.position.set(TOWN.x - 7.2, 3.7, TOWN.z - 11.6)
    root.add(bFlag)

    scene.add(root)
    townDone = true
    console.log('[wt] Osada Żarowarta rozbudowana ✓ (plac, 6 domów, 8 pochodni, wieża, wóz)')

    // migotanie ognia i pochodni
    setInterval(function () {
      for (var i = 0; i < fireLights.length; i++) fireLights[i].light.intensity = fireLights[i].base * (0.85 + Math.random() * 0.3)
      for (var j = 0; j < fireFlames.length; j++) {
        fireFlames[j].scale.y = 0.85 + Math.random() * 0.3
        fireFlames[j].rotation.y += 0.2
      }
    }, 160)

    // strefa bezpieczna: wrogowie nie wchodzą do obozu — spawny odsuwane od palisady
    var origSpawn = g.spawnEnemy.bind(g)
    g.spawnEnemy = function (kind, pos, tier, opts) {
      var p = pos
      try {
        var dx = p.x - TOWN.x, dz = p.z - TOWN.z
        var d = Math.sqrt(dx * dx + dz * dz)
        if (d < TOWN.r + 12) {
          var k = (TOWN.r + 12) / (d || 0.001)
          p = new THREE.Vector3(TOWN.x + dx * k, 0, TOWN.z + dz * k)
        }
      } catch (e) {}
      return origSpawn(kind, p, tier, opts)
    }

    // nazwa strefy: jesteśmy w osadzie
    var zl = document.getElementById('zone-label')
    if (zl) zl.textContent = 'Osada Żarowarta'

    // osada odkryta na mapie od początku
    try {
      var f = loadFog()
      var ix = Math.round(TOWN.x / FOG_STEP), iz = Math.round(TOWN.z / FOG_STEP)
      for (var tx = -2; tx <= 2; tx++) for (var tz = -2; tz <= 2; tz++) f.add(cellKey(ix + tx, iz + tz))
      lsSet(FOG_KEY, JSON.stringify(Array.from(f)))
    } catch (e) {}

    return true
  }
  var townTries = 0
  var townTimer = setInterval(function () {
    if (buildTown() || ++townTries > 600) clearInterval(townTimer)
  }, 250)

  // ============================================================
  // EKRAN TYTUŁOWY (po załadowaniu gry): logo + menu jak z gry
  // ============================================================
  var titleEl = null, titleOn = false
  window.__wtTitleActive = function () { return titleOn }

  function titleCss() {
    var st = document.createElement('style')
    st.textContent =
      '#wt-title{position:fixed;inset:0;z-index:1000;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(ellipse 60% 46% at 50% 34%,rgba(124,58,237,.28),transparent 65%),radial-gradient(ellipse 90% 60% at 50% 120%,rgba(88,28,135,.4),transparent 70%),#050208f5);font-family:Georgia,serif;user-select:none}' +
      '#wt-title .t-logo{color:#e9d5ff;letter-spacing:.4em;font-size:clamp(42px,9vw,88px);font-weight:bold;text-shadow:0 0 18px #7c3aed,0 0 70px #6b21a8;animation:wt-tglow 2.6s ease-in-out infinite}' +
      '@keyframes wt-tglow{50%{text-shadow:0 0 26px #a855f7,0 0 100px #7c3aed}}' +
      '#wt-title .t-sub{color:#a1a1aa;font-size:14px;letter-spacing:.28em;text-transform:uppercase;margin-top:2px}' +
      '#wt-title .t-tag{color:#71717a;font-size:12px;margin-top:6px;text-align:center;line-height:1.6}' +
      '#wt-title .t-menu{display:flex;flex-direction:column;gap:10px;margin-top:30px;width:300px}' +
      '#wt-title .t-btn{width:100%;padding:11px 16px;font-family:Georgia,serif;font-size:14px;letter-spacing:.18em;text-transform:uppercase;color:#d6d3d1;background:rgba(20,12,32,.75);border:1px solid #3f2a55;border-radius:6px;cursor:pointer;transition:all .16s;text-align:center}' +
      '#wt-title .t-btn:hover{border-color:#a855f7;color:#f3e8ff;background:rgba(46,22,74,.85);box-shadow:0 0 18px rgba(168,85,247,.35);transform:translateY(-1px)}' +
      '#wt-title .t-btn.danger:hover{border-color:#b91c1c;box-shadow:0 0 18px rgba(185,28,28,.4)}' +
      '#wt-title .t-btn:disabled{opacity:.4;cursor:default}' +
      '#wt-title .t-btn:disabled:hover{border-color:#3f2a55;box-shadow:none;transform:none;color:#d6d3d1;background:rgba(20,12,32,.75)}' +
      '#wt-title .t-slot{padding:10px 14px;background:rgba(20,12,32,.75);border:1px solid #3f2a55;border-radius:6px;cursor:pointer;color:#d6d3d1;transition:all .16s}' +
      '#wt-title .t-slot:hover{border-color:#a855f7;box-shadow:0 0 14px rgba(168,85,247,.3)}' +
      '#wt-title .t-slot.empty{color:#52525b}' +
      '#wt-title .t-slot .s-t{font-size:13px;letter-spacing:.08em}' +
      '#wt-title .t-slot .s-m{font-size:11px;color:#71717a;margin-top:2px}' +
      '#wt-title .t-back{margin-top:14px;padding:8px;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#71717a;background:none;border:none;cursor:pointer;font-family:Georgia,serif}' +
      '#wt-title .t-back:hover{color:#e9d5ff}' +
      '#wt-title .t-hint{color:#52525b;font-size:11px;letter-spacing:.12em;margin-top:26px}'
    document.head.appendChild(st)
  }

  function buildTitleEl() {
    titleCss()
    titleEl = document.createElement('div')
    titleEl.id = 'wt-title'
    titleEl.innerHTML =
      '<div class="t-logo">WYRWOR</div>' +
      '<div class="t-sub">Strumienie zła rozdzierają świat</div>' +
      '<div class="t-tag">Jesteś Tropicielem. Poluj na wyrwy.<br/>Zapieczętuj je wszystkie.</div>' +
      '<div class="t-menu" id="wt-title-menu"></div>' +
      '<div class="t-hint">WASD — ruch · mysz — celowanie · LPM — atak · TAB — mapa · ESC — menu</div>'
    titleEl.addEventListener('click', onTitleClick)
    return titleEl
  }

  function renderTitle(view) {
    var menu = document.getElementById('wt-title-menu')
    if (!menu) return
    if (view === 'main') {
      var hasSave = !!localStorage.getItem('wt.save')
      menu.innerHTML =
        (hasSave ? '<button class="t-btn" data-act="kont">▶ Kontynuuj</button>' : '') +
        '<button class="t-btn" data-act="nowa">Nowa gra</button>' +
        '<button class="t-btn" data-act="wczytaj">Wczytaj grę</button>' +
        '<button class="t-btn" data-act="ustawienia">Ustawienia</button>'
    } else if (view === 'load') {
      var h = ''
      for (var n = 1; n <= 3; n++) {
        var m = slotMeta(n)
        if (m) {
          h += '<div class="t-slot" data-act="load" data-n="' + n + '"><div class="s-t">Zapis ' + n + ' — poz. ' + m.lvl + ', rozdz. ' + m.ch + '</div><div class="s-m">' + fmtDate(m.t) + '</div></div>'
        } else {
          h += '<div class="t-slot empty"><div class="s-t">Zapis ' + n + ' — pusty</div></div>'
        }
      }
      menu.innerHTML = h + '<button class="t-back" data-act="main">◂ powrót</button>'
    } else if (view === 'settings') {
      var mute = lsGet('wt.mute', '0') === '1'
      menu.innerHTML =
        '<button class="t-btn" data-act="mute">Dźwięk: ' + (mute ? 'wyłączony 🔇' : 'włączony 🔊') + '</button>' +
        '<button class="t-btn" data-act="reset">Usuń całą bazę zapisów</button>' +
        '<button class="t-back" data-act="main">◂ powrót</button>'
    }
  }

  function onTitleClick(e) {
    var el = e.target.closest ? e.target.closest('[data-act]') : null
    if (!el) return
    var act = el.getAttribute('data-act')
    if (act === 'kont') {
      hideTitle()
    } else if (act === 'nowa') {
      if (localStorage.getItem('wt.save') && !window.confirm('Na pewno nowa gra? Obecny postęp bohatera zostanie utracony (zapisy w slotach zostają).')) return
      var wipe = ['wt.save', 'wt.class', 'wt.gear', 'wt.inv', 'wt.stats', 'wt.starter', 'wt.gold', 'wt.fog'];
      for (var i = 0; i < wipe.length; i++) { try { localStorage.removeItem(wipe[i]) } catch (err) {} }
      try { sessionStorage.setItem('wt.skipTitle', '1') } catch (err) {}
      location.reload()
    } else if (act === 'wczytaj') {
      renderTitle('load')
    } else if (act === 'load') {
      var n = Number(el.getAttribute('data-n'))
      if (slotMeta(n) && loadSlot(n)) {
        try { sessionStorage.setItem('wt.skipTitle', '1') } catch (err) {}
        location.reload()
      }
    } else if (act === 'ustawienia') {
      renderTitle('settings')
    } else if (act === 'mute') {
      lsSet('wt.mute', lsGet('wt.mute', '0') === '1' ? '0' : '1')
      try { if (window.__WT && window.__WT.muted !== undefined) window.__WT.muted = lsGet('wt.mute') === '1' } catch (err) {}
      renderTitle('settings')
    } else if (act === 'reset') {
      if (!window.confirm('Usunąć WSZYSTKO? Postęp, zapisy w slotach i odkryta mapa przepadną na zawsze.')) return
      var kill = SNAP_KEYS.concat(['wt.slot1', 'wt.slot2', 'wt.slot3']);
      for (var k = 0; k < kill.length; k++) { try { localStorage.removeItem(kill[k]) } catch (err) {} }
      renderTitle('settings')
    } else if (act === 'main') {
      renderTitle('main')
    }
  }

  function showTitle() {
    if (titleOn) return
    buildTitleEl()
    document.body.appendChild(titleEl)
    titleOn = true
    setPaused(true) // świat czeka za menu
    renderTitle('main')
  }
  function hideTitle() {
    if (!titleOn) return
    titleOn = false
    if (titleEl) { titleEl.remove(); titleEl = null }
    setPaused(false)
  }

  // pokaż ekran tytułowy, gdy skończy się ładowanie (intro-overlay znika)
  var introEl = document.getElementById('intro-overlay')
  if (introEl) {
    new MutationObserver(function () {
      if (introEl.classList.contains('show') || titleOn) return
      var skip = false
      try {
        if (sessionStorage.getItem('wt.skipTitle')) { sessionStorage.removeItem('wt.skipTitle'); skip = true }
      } catch (err) {}
      if (!skip) showTitle()
    }).observe(introEl, { attributes: true, attributeFilter: ['class'] })
  }

  // ============================================================
  // KLAWISZE: ESC — menu, TAB — mapa
  // ============================================================
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
      e.preventDefault()
      if (titleOn || e.repeat) return
      toggleMap()
      return
    }
    if (e.key !== 'Escape' || e.repeat) return
    if (titleOn) { e.preventDefault(); return } // ekran tytułowy ma własne menu
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
