// ===== Warptracker PL: PANEL ADMINA v2 — baza przedmiotów + podgląd 3D (klawisz P) =====
// Osobny moduł ładowany przez loader (game/assets/admin.js). Źródło czytelne w mods/admin.js.
;(function () {
  var RAR = { common: '#d6d3d1', magic: '#60a5fa', rare: '#fde047', unique: '#c084fc' }
  var RAR_PL = { common: 'zwykły', magic: 'magiczny', rare: 'rzadki', unique: 'unikat' }
  var SLOT_PL = { weapon: 'Broń', armor: 'Zbroja', charm: 'Talizman' }
  var STATS = ['dmg', 'hp', 'speed', 'mana', 'regen']
  var STAT_PL = { dmg: 'obrażeń', hp: 'życia', speed: '% szybk. ruchu', mana: 'many', regen: 'życia/s' }
  var DB_KEY = 'wt.db'
  var MODELS_KEY = 'wt.models'
  var BASE_MODELS = ['hero', 'knight', 'sword', 'helmet', 'skeleton', 'bat', 'ghost', 'demon']
  function loadModels() {
    try {
      var a = JSON.parse(localStorage.getItem(MODELS_KEY) || '[]')
      return Array.isArray(a) ? a.filter(function (x) { return typeof x === 'string' && x }) : []
    } catch (e) { return [] }
  }
  function saveModels(a) { try { localStorage.setItem(MODELS_KEY, JSON.stringify(a)) } catch (e) {} }
  function allModels() { return BASE_MODELS.concat(loadModels()) }
  var PRESETS = [
    { name: 'Ostrze Wyrwy', slot: 'weapon', rarity: 'unique', affixes: [{ stat: 'dmg', value: 18 }, { stat: 'speed', value: 8 }] },
    { name: 'Kirys z Pustego Kurhanu', slot: 'armor', rarity: 'rare', affixes: [{ stat: 'hp', value: 40 }, { stat: 'regen', value: 1.5 }] },
    { name: 'Talizman Żarowarty', slot: 'charm', rarity: 'magic', affixes: [{ stat: 'mana', value: 14 }, { stat: 'regen', value: 0.8 }] }
  ]

  function loadDB() {
    try {
      var d = JSON.parse(localStorage.getItem(DB_KEY) || 'null')
      if (d && typeof d === 'object' && Array.isArray(d.items)) {
        d.items = d.items.filter(valid)
        if (typeof d.dropChance !== 'number') d.dropChance = 0.1
        return d
      }
    } catch (e) {}
    return { items: PRESETS.slice(), dropChance: 0.1 }
  }
  function saveDB(d) { try { localStorage.setItem(DB_KEY, JSON.stringify(d)) } catch (e) {} }
  function valid(it) {
    if (!it || typeof it !== 'object') return false
    if (!['weapon', 'armor', 'charm'].includes(it.slot)) return false
    if (!['common', 'magic', 'rare', 'unique'].includes(it.rarity)) return false
    if (typeof it.name !== 'string' || !it.name || it.name.length > 80) return false
    if (!Array.isArray(it.affixes) || it.affixes.length < 1 || it.affixes.length > 4) return false
    for (var i = 0; i < it.affixes.length; i++) {
      var a = it.affixes[i]
      if (!a || !STATS.includes(a.stat)) return false
      if (typeof a.value !== 'number' || !isFinite(a.value) || a.value <= 0 || a.value > 999) return false
    }
    return true
  }
  function wt() { return window.__WT }
  function loot() { return wt() && wt().loot }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)) }

  // ---------- styl ----------
  if (!document.getElementById('wt-adm-style')) {
    var st = document.createElement('style')
    st.id = 'wt-adm-style'
    st.textContent = [
      '#wt-adm{position:fixed;inset:0;z-index:140;display:none;align-items:center;justify-content:center;background:rgba(6,3,10,.86);font-family:Georgia,serif}',
      '#wt-adm.show{display:flex}',
      '#wt-adm .box{width:960px;max-width:96vw;max-height:94vh;overflow:auto;background:#0d0815;border:1px solid #6b21a8;border-radius:12px;padding:20px 24px;box-shadow:0 0 50px rgba(168,85,247,.3)}',
      '#wt-adm h2{color:#e9d5ff;letter-spacing:.22em;font-size:15px;text-align:center;margin:0 0 3px;text-transform:uppercase}',
      '#wt-adm .sub{color:#71717a;font-size:10.5px;text-align:center;margin-bottom:14px}',
      '#wt-adm .cols{display:flex;gap:20px}',
      '#wt-adm .left{width:300px;flex:none;display:flex;flex-direction:column;gap:10px}',
      '#wt-adm .list{border:1px solid #2a1b3d;border-radius:8px;background:rgba(16,10,26,.6);overflow:auto;max-height:52vh}',
      '#wt-adm .sec{color:#71717a;font-size:9.5px;letter-spacing:.18em;text-transform:uppercase;padding:7px 10px 3px}',
      '#wt-adm .row{padding:7px 10px;border-bottom:1px solid #221536;cursor:pointer;display:flex;align-items:center;gap:8px}',
      '#wt-adm .row:hover{background:rgba(168,85,247,.08)}',
      '#wt-adm .row.sel{background:rgba(168,85,247,.18);border-left:3px solid #a855f7}',
      '#wt-adm .dot{width:9px;height:9px;border-radius:50%;flex:none}',
      '#wt-adm .nm{font-size:12px;color:#e9d5ff;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '#wt-adm .tag{font-size:9px;color:#71717a;letter-spacing:.06em}',
      '#wt-adm .right{flex:1;display:flex;flex-direction:column;gap:10px;min-width:0}',
      '#wt-adm .edit{display:flex;gap:16px}',
      '#wt-adm .form{flex:1;display:flex;flex-direction:column;gap:9px;min-width:0}',
      '#wt-adm label{color:#a1a1aa;font-size:9.5px;letter-spacing:.14em;text-transform:uppercase}',
      '#wt-adm input[type=text],#wt-adm select{background:rgba(20,12,32,.9);border:1px solid #3f2a55;color:#e9d5ff;border-radius:6px;padding:7px 10px;font-size:13px;width:100%;box-sizing:border-box;font-family:inherit}',
      '#wt-adm input:focus,#wt-adm select:focus{outline:none;border-color:#a855f7}',
      '#wt-adm .affs{display:grid;grid-template-columns:1fr 1fr;gap:7px}',
      '#wt-adm .aff{border:1px solid #2a1b3d;border-radius:8px;padding:7px;display:flex;gap:7px;align-items:center;background:rgba(20,12,32,.6)}',
      '#wt-adm .aff.on{border-color:#7e22ce;background:rgba(126,34,206,.12)}',
      '#wt-adm .aff .an{flex:1;color:#c4b5fd;font-size:11px}',
      '#wt-adm .aff input[type=checkbox]{accent-color:#a855f7}',
      '#wt-adm .aff input[type=number]{width:74px;background:rgba(10,6,18,.9);border:1px solid #3f2a55;color:#fde047;border-radius:5px;padding:4px 6px;font-size:12px;box-sizing:border-box;font-family:inherit}',
      '#wt-adm .prev{width:232px;flex:none;height:232px;border:1px solid #2a1b3d;border-radius:10px;background:radial-gradient(circle at 50% 30%,#191024,#0a0710 75%);position:relative;overflow:hidden;cursor:grab}',
      '#wt-adm .prev canvas{display:block}',
      '#wt-adm .prev .pl{position:absolute;bottom:6px;left:0;right:0;text-align:center;color:#71717a;font-size:9.5px;letter-spacing:.1em;pointer-events:none}',
      '#wt-adm .btns{display:flex;gap:8px;flex-wrap:wrap}',
      '#wt-adm button{flex:1;min-width:104px;padding:8px 10px;border-radius:7px;border:1px solid #6b21a8;background:rgba(107,33,168,.25);color:#e9d5ff;font-family:inherit;font-size:11px;letter-spacing:.09em;cursor:pointer;text-transform:uppercase}',
      '#wt-adm button:hover{background:rgba(168,85,247,.35)}',
      '#wt-adm button.green{border-color:#3f6212;background:rgba(63,98,18,.3)}',
      '#wt-adm button.red{border-color:#7f1d1d;background:rgba(127,29,29,.3)}',
      '#wt-adm button.gold{border-color:#a16207;background:rgba(161,98,7,.25)}',
      '#wt-adm button:disabled{opacity:.35;cursor:not-allowed}',
      '#wt-adm .foot{display:flex;align-items:center;gap:12px;color:#a1a1aa;font-size:11px;margin-top:4px}',
      '#wt-adm input[type=range]{flex:1;accent-color:#a855f7}',
      '#wt-adm .msg{color:#fbbf24;font-size:11px;text-align:center;min-height:14px}',
      '#wt-adm .hint{color:#71717a;font-size:10px;text-align:center;margin-top:10px;line-height:1.5}'
    ].join('')
    document.head.appendChild(st)
  }

  // ---------- DOM ----------
  var panel = document.createElement('div')
  panel.id = 'wt-adm'
  panel.innerHTML =
    '<div class="box">' +
    '<h2>Panel Admina — Baza Przedmiotów</h2>' +
    '<div class="sub">twórz, edytuj i zakładaj przedmioty · upuszczaj je w świecie · wpuszczaj do puli dropów</div>' +
    '<div class="cols">' +
    '<div class="left">' +
    '<div class="list" id="wt-adm-list"></div>' +
    '<div class="btns"><button id="wt-adm-new">Nowy</button></div>' +
    '<div class="btns"><button id="wt-adm-import" class="gold">Import JSON</button><button id="wt-adm-export" class="gold">Eksport JSON</button></div>' +
    '<div class="sec" style="padding-left:0">Modele 3D (własne)</div>' +
    '<div class="list" id="wt-adm-models" style="max-height:16vh"></div>' +
    '<div style="display:flex;gap:6px"><input type="text" id="wt-adm-model-name" placeholder="nazwa pliku bez .glb" style="flex:1;background:rgba(20,12,32,.9);border:1px solid #3f2a55;color:#e9d5ff;border-radius:6px;padding:6px 8px;font-size:12px;font-family:inherit"><button id="wt-adm-model-add" style="min-width:0;padding:6px 10px">+</button></div>' +
    '</div>' +
    '<div class="right">' +
    '<div class="edit">' +
    '<div class="form">' +
    '<label>nazwa</label><input type="text" id="wt-adm-name" maxlength="80">' +
    '<div style="display:flex;gap:8px"><div style="flex:1"><label>slot</label><select id="wt-adm-slot"><option value="weapon">Broń</option><option value="armor">Zbroja</option><option value="charm">Talizman</option></select></div>' +
    '<div style="flex:1"><label>rzadkość</label><select id="wt-adm-rar"><option value="common">zwykły</option><option value="magic">magiczny</option><option value="rare">rzadki</option><option value="unique">unikat</option></select></div></div>' +
    '<label>model 3D (podgląd)</label><select id="wt-adm-model"></select>' +
    '<label>afiksy (1–4, zaznacz i ustaw wartość)</label><div class="affs" id="wt-adm-affs"></div>' +
    '</div>' +
    '<div class="prev" id="wt-adm-prev"><div class="pl" id="wt-adm-pl">—</div></div>' +
    '</div>' +
    '<div class="btns">' +
    '<button id="wt-adm-save" class="green">Zapisz do bazy</button>' +
    '<button id="wt-adm-equip" class="gold">Załóż</button>' +
    '<button id="wt-adm-inv">Do sakwy</button>' +
    '<button id="wt-adm-drop">Upuść na ziemię</button>' +
    '<button id="wt-adm-del" class="red">Usuń z bazy</button>' +
    '</div>' +
    '<div class="msg" id="wt-adm-msg"></div>' +
    '<div class="foot"><span>dropy z bazy przy zabójstwach:</span><input type="range" id="wt-adm-chance" min="0" max="100" step="5"><span id="wt-adm-chance-l"></span></div>' +
    '</div></div>' +
    '<div class="hint">P / ESC — zamknij · obracaj podgląd myszą · własne modele: wrzuć plik <b>NAZWA.glb</b> do <b>game/models/</b>, dodaj „NAZWA” w sekcji Modele 3D i odśwież grę (F5)</div>' +
    '</div>'
  document.body.appendChild(panel)

  var $ = function (id) { return panel.querySelector('#' + id) }
  var listEl = $('wt-adm-list')

  // ---------- podgląd 3D ----------
  var prev = $('wt-adm-prev')
  var THREE = null, renderer = null, scene = null, camera = null, spin = null

  function initPreview() {
    if (renderer) return true
    THREE = window.__WTdebug && window.__WTdebug.THREE
    if (!THREE) return false
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch (e) { return false }
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1))
    renderer.setSize(232, 232)
    prev.insertBefore(renderer.domElement, prev.firstChild)
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(34, 1, 0.01, 60)
    camera.position.set(0, 0.85, 3.3)
    camera.lookAt(0, 0.45, 0)
    scene.add(new THREE.AmbientLight(0xffffff, 0.65))
    var key = new THREE.DirectionalLight(0xfff2d8, 2.4); key.position.set(2.5, 3, 2.5); scene.add(key)
    var rim = new THREE.DirectionalLight(0xa855f7, 1.4); rim.position.set(-2.5, 1.2, -2.5); scene.add(rim)
    spin = { root: null, x: 0.5, y: 0.7, vx: 0, vy: 0.006, down: false, lx: 0, ly: 0 }
    prev.addEventListener('pointerdown', function (e) { spin.down = true; spin.lx = e.clientX; spin.ly = e.clientY; prev.style.cursor = 'grabbing' })
    window.addEventListener('pointerup', function () { spin.down = false; prev.style.cursor = 'grab' })
    prev.addEventListener('pointermove', function (e) {
      if (!spin.down) return
      spin.vy = (e.clientX - spin.lx) * 0.004
      spin.vx = Math.max(-1.2, Math.min(1.2, spin.vx + (e.clientY - spin.ly) * 0.004))
      spin.lx = e.clientX; spin.ly = e.clientY
    })
    return true
  }

  function showPreview(item) {
    if (!initPreview()) { $('wt-adm-pl').textContent = 'podgląd 3D dostępny po starcie gry'; return }
    var pl = $('wt-adm-pl')
    if (spin.root) { scene.remove(spin.root); spin.root = null }
    if (!item) { pl.textContent = '—'; return }
    var rar = RAR[item.rarity] || '#d6d3d1'
    var root = new THREE.Group()
    var db = window.__WTdebug
    var modelName = item.model || (item.slot === 'weapon' ? 'sword' : item.slot === 'armor' ? 'helmet' : null)
    var obj = null
    if (modelName) {
      try { obj = db.instantiate(modelName, 1.5).root } catch (e) { obj = null; $('wt-adm-pl').textContent = 'model „' + modelName + '” niezaładowany — sprawdź plik models/' + modelName + '.glb' }
    }
    if (!obj) {
      // talizman (albo fallback): obracający się klejnot
      obj = new THREE.Group()
      var gem = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.62, 0),
        new THREE.MeshStandardMaterial({ color: rar, emissive: rar, emissiveIntensity: 0.5, roughness: 0.15, metalness: 0.4 })
      )
      gem.position.y = 0.75
      var ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.55, 0.05, 12, 48),
        new THREE.MeshStandardMaterial({ color: 0xc9a24a, emissive: 0xc9a24a, emissiveIntensity: 0.25, roughness: 0.3, metalness: 0.9 })
      )
      ring.position.y = 0.75; ring.rotation.x = 1.2
      var light = new THREE.PointLight(rar, 6, 4); light.position.y = 1.6
      obj.add(gem, ring, light)
    } else {
      obj.traverse(function (o) {
        if (o.isMesh) {
          o.material = o.material.clone()
          if (o.material.emissive) { o.material.emissive = new THREE.Color(rar); o.material.emissiveIntensity = 0.22 }
        }
      })
      if (item.slot === 'weapon') obj.rotation.z = 0.5
    }
    // wycentruj w ramce
    var box = new THREE.Box3().setFromObject(obj)
    var c = box.getCenter(new THREE.Vector3())
    obj.position.sub(c)
    var wrap = new THREE.Group(); wrap.add(obj)
    root.add(wrap)
    scene.add(root)
    spin.root = root
    pl.textContent = SLOT_PL[item.slot] + ' · ' + RAR_PL[item.rarity]
  }

  function loop() {
    requestAnimationFrame(loop)
    if (!renderer || !panel.classList.contains('show')) return
    if (spin.root && !spin.down) spin.y += spin.vy
    if (spin.root) { spin.root.rotation.y = spin.y; spin.root.rotation.x = spin.x }
    renderer.render(scene, camera)
  }
  loop()

  // ---------- edycja ----------
  var current = null   // {src:'db'|'eq', key, item}

  function buildAffixGrid() {
    var g = $('wt-adm-affs')
    g.innerHTML = ''
    STATS.forEach(function (s) {
      var d = document.createElement('div')
      d.className = 'aff'
      d.innerHTML = '<input type="checkbox" data-s="' + s + '"><span class="an">' + esc(STAT_PL[s]) + '</span><input type="number" step="any" min="0.1" max="999" data-v="' + s + '" disabled>'
      g.appendChild(d)
    })
    g.addEventListener('change', function (e) {
      var s = e.target.getAttribute('data-s') || e.target.getAttribute('data-v')
      if (!s) return
      var cb = g.querySelector('[data-s="' + s + '"]')
      var num = g.querySelector('[data-v="' + s + '"]')
      num.disabled = !cb.checked
      if (cb.checked && !num.value) num.value = (s === 'regen' ? 1 : (s === 'hp' || s === 'mana' ? 10 : 5))
    })
  }
  buildAffixGrid()

  function fillModelSelect(sel) {
    var cur = sel || ''
    var g = $('wt-adm-model')
    var html = '<option value="">(auto wg slotu)</option>'
    allModels().forEach(function (m) {
      html += '<option value="' + m + '"' + (m === cur ? ' selected' : '') + '>' + m + (BASE_MODELS.indexOf(m) >= 0 ? ' (wbudowany)' : '') + '</option>'
    })
    g.innerHTML = html
  }
  function fillForm(item) {
    fillModelSelect(item.model || '')
    $('wt-adm-name').value = item.name
    $('wt-adm-slot').value = item.slot
    $('wt-adm-rar').value = item.rarity
    STATS.forEach(function (s) {
      var on = item.affixes.some(function (a) { return a.stat === s })
      var v = item.affixes.find(function (a) { return a.stat === s })
      var cb = panel.querySelector('[data-s="' + s + '"]')
      var num = panel.querySelector('[data-v="' + s + '"]')
      cb.checked = on
      num.disabled = !on
      num.value = on ? v.value : ''
    })
  }

  function readForm() {
    var it = { name: $('wt-adm-name').value.trim(), slot: $('wt-adm-slot').value, rarity: $('wt-adm-rar').value, affixes: [] }
    var mdl = $('wt-adm-model').value
    if (mdl) it.model = mdl
    STATS.forEach(function (s) {
      if (panel.querySelector('[data-s="' + s + '"]').checked) {
        var v = parseFloat(panel.querySelector('[data-v="' + s + '"]').value)
        if (!isNaN(v)) it.affixes.push({ stat: s, value: v })
      }
    })
    if (it.affixes.length > 4) it.affixes = it.affixes.slice(0, 4)
    if (it.name) it.name = it.name.slice(0, 80)
    return it
  }

  function msg(t, bad) {
    var m = $('wt-adm-msg')
    m.textContent = t
    m.style.color = bad ? '#f87171' : '#fbbf24'
    setTimeout(function () { if (m.textContent === t) m.textContent = '' }, 3200)
  }

  function renderList() {
    var db = loadDB()
    var L = loot()
    var html = ''
    if (L) {
      html += '<div class="sec">Noszone</div>'
      ;['weapon', 'armor', 'charm'].forEach(function (s) {
        var it = L.equipped[s]
        html += '<div class="row" data-src="eq" data-key="' + s + '">' +
          '<span class="dot" style="background:' + (it ? RAR[it.rarity] : '#27272a') + '"></span>' +
          '<span class="nm">' + (it ? esc(it.name) : '<i style="color:#52525b">— pusto —</i>') + '</span>' +
          '<span class="tag">' + SLOT_PL[s] + '</span></div>'
      })
    }
    html += '<div class="sec">Baza (' + db.items.length + ')</div>'
    db.items.forEach(function (it, i) {
      html += '<div class="row" data-src="db" data-key="' + i + '">' +
        '<span class="dot" style="background:' + RAR[it.rarity] + '"></span>' +
        '<span class="nm">' + esc(it.name) + '</span>' +
        '<span class="tag">' + SLOT_PL[it.slot].slice(0, 4) + '.</span></div>'
    })
    listEl.innerHTML = html
    $('wt-adm-chance').value = Math.round(db.dropChance * 100)
    $('wt-adm-chance-l').textContent = Math.round(db.dropChance * 100) + '%'
  }

  listEl.addEventListener('click', function (e) {
    var row = e.target.closest('.row')
    if (!row) return
    var src = row.getAttribute('data-src')
    var key = row.getAttribute('data-key')
    listEl.querySelectorAll('.row').forEach(function (r) { r.classList.remove('sel') })
    row.classList.add('sel')
    var it
    if (src === 'eq') {
      it = loot() && loot().equipped[key]
      current = it ? { src: 'eq', key: key, item: it } : null
    } else {
      it = loadDB().items[+key]
      current = it ? { src: 'db', key: +key, item: it } : null
    }
    if (it) { fillForm(it); showPreview(it) }
    else showPreview(null)
    updateButtons()
  })

  function updateButtons() {
    $('wt-adm-del').disabled = !(current && current.src === 'db')
    $('wt-adm-equip').disabled = !loot()
    $('wt-adm-inv').disabled = !loot()
    $('wt-adm-drop').disabled = !loot()
  }

  // ---------- akcje ----------
  $('wt-adm-new').addEventListener('click', function () {
    current = null
    fillForm({ name: '', slot: 'weapon', rarity: 'magic', affixes: [{ stat: 'dmg', value: 5 }] })
    listEl.querySelectorAll('.row').forEach(function (r) { r.classList.remove('sel') })
    showPreview(readForm())
    $('wt-adm-name').focus()
  })

  $('wt-adm-save').addEventListener('click', function () {
    var it = readForm()
    if (!valid(it)) return msg('Niepoprawny przedmiot: nazwa 1–80 znaków, 1–4 afiksy, wartości > 0.', true)
    var db = loadDB()
    if (current && current.src === 'db') db.items[current.key] = it
    else {
      db.items.push(it)
      current = { src: 'db', key: db.items.length - 1, item: it }
    }
    saveDB(db)
    renderList()
    var rows = listEl.querySelectorAll('[data-src="db"]')
    if (rows[current.key]) rows[current.key].classList.add('sel')
    showPreview(it)
    msg('Zapisano do bazy: ' + it.name)
  })

  $('wt-adm-equip').addEventListener('click', function () {
    var L = loot(); if (!L) return msg('Gra jeszcze się ładuje…', true)
    var it = readForm()
    if (!valid(it)) return msg('Niepoprawny przedmiot.', true)
    L.equipped[it.slot] = it
    L.saveGear()
    var aff = it.affixes.map(function (a) { return '+' + a.value + ' ' + STAT_PL[a.stat] }).join(', ')
    L.onEquip(L.totals, it.name.toUpperCase() + ' — ' + aff)
    renderList(); showPreview(it)
    msg('Założono: ' + it.name)
  })

  $('wt-adm-inv').addEventListener('click', function () {
    var it = readForm()
    if (!valid(it)) return msg('Niepoprawny przedmiot.', true)
    if (typeof window.__wtInvAdd !== 'function') return msg('Brak sakwy.', true)
    if (window.__wtInvAdd(it)) msg('Dodano do sakwy: ' + it.name)
    else msg('Sakwa pełna!', true)
  })

  $('wt-adm-drop').addEventListener('click', function () {
    var g = wt(); if (!g || !g.hero) return msg('Brak bohatera.', true)
    var it = readForm()
    if (!valid(it)) return msg('Niepoprawny przedmiot.', true)
    g.loot.drop(g.hero.position.clone(), it)
    msg('Upuszczono obok bohatera: ' + it.name)
  })

  $('wt-adm-del').addEventListener('click', function () {
    if (!current || current.src !== 'db') return
    var db = loadDB()
    db.items.splice(current.key, 1)
    saveDB(db)
    current = null
    renderList(); showPreview(null)
    msg('Usunięto z bazy.')
  })

  $('wt-adm-export').addEventListener('click', function () {
    var db = loadDB()
    var blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' })
    var a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'warptracker-baza-przedmiotow.json'
    a.click()
    setTimeout(function () { URL.revokeObjectURL(a.href) }, 4000)
    msg('Wyeksportowano ' + db.items.length + ' przedmiotów.')
  })

  $('wt-adm-import').addEventListener('click', function () {
    var inp = document.createElement('input')
    inp.type = 'file'; inp.accept = '.json,application/json'
    inp.onchange = function () {
      var f = inp.files[0]; if (!f) return
      var r = new FileReader()
      r.onload = function () {
        try {
          var d = JSON.parse(r.result)
          var db = loadDB()
          var items = (d.items || (Array.isArray(d) ? d : [])).filter(valid)
          var added = 0
          items.forEach(function (it) { db.items.push(it); added++ })
          saveDB(db); renderList()
          msg('Zaimportowano ' + added + ' przedmiotów.')
        } catch (e) { msg('Błąd importu: ' + e.message, true) }
      }
      r.readAsText(f)
    }
    inp.click()
  })

  $('wt-adm-chance').addEventListener('input', function () {
    var v = +this.value
    $('wt-adm-chance-l').textContent = v + '%'
    var db = loadDB()
    db.dropChance = v / 100
    saveDB(db)
  })

  // formularz → odśwież podgląd na żywo
  ;['wt-adm-slot', 'wt-adm-rar', 'wt-adm-name', 'wt-adm-model'].forEach(function (id) {
    $(id).addEventListener('change', function () {
      showPreview(readForm())
    })
  })

  // ---------- menedżer modeli 3D ----------
  function renderModels() {
    var g = $('wt-adm-models')
    var list = loadModels()
    var html = ''
    if (!list.length) html = '<div class="sec" style="letter-spacing:0;text-transform:none;padding:8px 10px">(brak własnych modeli)</div>'
    list.forEach(function (m) {
      html += '<div class="row" data-m="' + esc(m) + '"><span class="dot" style="background:#4ade80"></span>' +
        '<span class="nm">' + esc(m) + '.glb</span><span class="tag" data-mdel="' + esc(m) + '" style="cursor:pointer;color:#f87171">✕</span></div>'
    })
    g.innerHTML = html
    fillModelSelect($('wt-adm-model').value)
  }
  $('wt-adm-models').addEventListener('click', function (e) {
    var del = e.target.getAttribute && e.target.getAttribute('data-mdel')
    if (!del) return
    var list = loadModels().filter(function (m) { return m !== del })
    saveModels(list)
    renderModels()
    msg('Usunięto model „' + del + '” — po odświeżeniu (F5) gra przestanie go ładować.')
  })
  $('wt-adm-model-add').addEventListener('click', function () {
    var inp = $('wt-adm-model-name')
    var name = inp.value.trim().replace(/\.glb$/i, '').replace(/[^a-zA-Z0-9_-]/g, '')
    if (!name) return msg('Podaj nazwę pliku (bez .glb), np. moja-broń', true)
    if (BASE_MODELS.indexOf(name) >= 0) return msg('„' + name + '” to model wbudowany.', true)
    var list = loadModels()
    if (list.indexOf(name) >= 0) return msg('Model już jest na liście.', true)
    list.push(name)
    saveModels(list)
    inp.value = ''
    renderModels()
    msg('Dodano „' + name + '”. Wrzuć plik ' + name + '.glb do game/models/ i odśwież grę (F5).')
  })
  $('wt-adm-model-name').addEventListener('keydown', function (e) { if (e.key === 'Enter') $('wt-adm-model-add').click() })

  // ---------- dropy z bazy w grze ----------
  function hookDrops() {
    var g = wt()
    if (!g || !g.loot || g.loot.__dbHooked) return false
    var L = g.loot
    var orig = L.maybeDrop.bind(L)
    L.maybeDrop = function (pos, lvl, kind) {
      orig(pos, lvl, kind)
      var db = loadDB()
      if (db.dropChance > 0 && db.items.length && Math.random() < db.dropChance) {
        var it = clone(db.items[Math.floor(Math.random() * db.items.length)])
        try { L.drop(pos, it) } catch (e) {}
      }
    }
    L.__dbHooked = true
    return true
  }
  var tries = 0
  var t = setInterval(function () { if (hookDrops() || ++tries > 400) clearInterval(t) }, 500)

  // ---------- otwieranie / zamykanie ----------
  function open() {
    if (!loot()) return
    panel.classList.add('show')
    renderList()
    renderModels()
    updateButtons()
    if (!current) {
      var db = loadDB()
      if (db.items.length) fillForm(db.items[0])
      else fillForm({ name: '', slot: 'weapon', rarity: 'magic', affixes: [{ stat: 'dmg', value: 5 }] })
      showPreview(readForm())
    } else showPreview(current.item)
  }
  function close() { panel.classList.remove('show') }
  function toggle() { panel.classList.contains('show') ? close() : open() }

  window.addEventListener('keydown', function (e) {
    if (e.repeat) return
    var tag = (e.target && e.target.tagName) || ''
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') {
      if (e.key === 'Escape') { e.target.blur(); close() }
      return
    }
    if (e.key === 'p' || e.key === 'P') { e.preventDefault(); toggle() }
    else if (e.key === 'Escape') close()
  })
})()
