// ===== Warptracker PL: Panel Admina — osobna aplikacja (admin.html) =====
// Zarządza WSZYSTKIM: przedmiotami, modelami 3D, dialogami NPC, postacią, kopią zapasową.
// Dane żyją w localStorage (wspólne z grą na tym samym serwerze) — gra widzi zmiany
// (dialogi/dropy na żywo, postać po F5).
// three.js z CDN (tylko do podglądu 3D). Brak sieci = podgląd wyłączony, reszta panelu działa.
let THREE = null, GLTFLoader = null
try {
  THREE = await import('three')
  ;({ GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js'))
} catch (e) { console.warn('WT admin: brak CDN three.js — podgląd 3D wyłączony', e) }

// ---------- helpers ----------
const $ = (s, r = document) => r.querySelector(s)
const $$ = (s, r = document) => [...r.querySelectorAll(s)]
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const clone = (o) => JSON.parse(JSON.stringify(o))
const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v) } catch { return d } }
const lsSet = (k, v) => localStorage.setItem(k, JSON.stringify(v))

const RAR = { common: '#d6d3d1', magic: '#60a5fa', rare: '#fde047', unique: '#c084fc' }
const RAR_PL = { common: 'zwykły', magic: 'magiczny', rare: 'rzadki', unique: 'unikat' }
const SLOT_PL = { weapon: 'Broń', armor: 'Zbroja', charm: 'Talizman' }
const STAT_PL = { dmg: 'obrażeń', hp: 'życia', speed: '% szybk. ruchu', mana: 'many', regen: 'życia/s' }
const STATS = ['dmg', 'hp', 'speed', 'mana', 'regen']
const BASE_MODELS = ['hero', 'knight', 'sword', 'helmet', 'skeleton', 'bat', 'ghost', 'demon']
const CLASSES = [
  { id: 'sentinel', name: 'Strażnik' },
  { id: 'stormcaller', name: 'Zaklinacz Burz' },
  { id: 'shade', name: 'Cień' }
]
const NPCS = [
  { id: 'serra', name: 'Strażniczka Serra' },
  { id: 'marek', name: 'Stary Marek, Kronikarz' },
  { id: 'vess', name: 'Vess, Szyjąca' },
  { id: 'brann', name: 'Brann Węgloręki' }
]
// domyślne kwestie wyciągnięte z gry (wszystkie warianty fabularne, deduplikowane)
const DEFAULT_DIALOGS = {
  serra: [
    'Osiem. Policz je, albo bagna policzą ciebie.',
    'Kolejny Tropicielu. Dobrze. Poprzedni wrócił w kawałkach.',
    'Bagna roi się od pomiotów wyrwy. Przerzedź ich szeregi — osiem łbów — a uwierzę, że twój miecz to coś więcej niż gładź.',
    'Umiesz więc ugryźć. Pomioty wylewają się z iglic — czarnych gwoździ, które wyrwa wbija w ziemię.',
    'Trzy górują nad bagnami. Ich wardy pękają, gdy zginą ich strażnicy. Rozbij wszystkie trzy.',
    'Bagna są ciche. Ale ziemia wciąż dudni, Tropicielu. Porozmawiaj z Markiem — on też to poczuł.',
    'Warda iglicy ginie razem ze strażnikami. Zabij watahę, a potem rozbij kamień.',
    'Bagna nigdy nie zostają czyste. Zawsze są nowe łowy.',
    'Cztery pieczęcie, czysto. Bagna znów się wypełnią — zawsze tak bywa.'
  ],
  marek: [
    'Usiądź na chwilę przy ogniu, Tropicielu. Posłuchaj.',
    'Wyrwy to nie rany. Rany się zamykają. To drzwi — a drzwi ktoś trzyma otwarte.',
    'Pod kurhanem coś zakotwicza je wszystkie. Serce nurtu. Rozbij je, a bagna znów zaczną oddychać.',
    'Czujesz, że umarło? To był jeden węzeł na jednej nitce. Nurt płynie skądś, gdzie jest o wiele ciemniej. Odpocznij. Potem pójdziemy za nim.',
    'Kurhan leży na dalekim skraju bagien, za szubienicznym drzewem. Zejdź starą drogą.'
  ],
  vess: [
    'Krwawisz? Siadaj. Mam nitkę i ogień, a żadne z nich nie obchodzi, ile wrzeszczysz.',
    'Wyrwa zostawia ślady pod skórą. Twoje są… płytkie. Tak to zostaw.',
    'Wróciłeś w jednym kawałku. To tu nowość.'
  ],
  brann: [
    'Nie dotykaj kuźni. Nie dotykaj ostrzy. Gadaj, jeśli musisz.',
    'Przynieś mi kiedyś żelazo wyrwy z głębokiego kurhanu. Wykuję ci coś, co śpiewa.'
  ]
}

// ---------- baza gry w PLIKU (game/data/gamedata.json) + API serwera ----------
let GD = null // baza gry z pliku
let apiOK = false // czy działa serwer.py z API zapisu
async function loadGD() {
  try {
    const r = await fetch('data/gamedata.json', { cache: 'no-store' })
    if (r.ok) GD = await r.json()
  } catch {}
  try {
    const p = await fetch('api/ping', { cache: 'no-store' })
    apiOK = p.ok
  } catch { apiOK = false }
}
async function saveFile(path, content) {
  const r = await fetch('api/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, content })
  })
  const d = await r.json().catch(() => ({}))
  if (!r.ok || !d.ok) throw new Error(d.error || 'HTTP ' + r.status)
  return d
}

// stan (sesja: sakwa/quick-db)
let db = lsGet('wt.db', null) || { items: [], dropChance: 10 }
if (!Array.isArray(db.items)) db.items = []
if (typeof db.dropChance !== 'number') db.dropChance = 10 // 0–100 (%)
let selItem = -1

const getModels = () => lsGet('wt.models', []).filter((m) => typeof m === 'string' && m)
const allModels = () => BASE_MODELS.concat(getModels())

function msg(text, err = false) {
  const el = $('#app-msg')
  if (!el) return
  el.textContent = text
  el.className = 'msg' + (err ? ' err' : '')
  clearTimeout(msg._t)
  msg._t = setTimeout(() => { el.textContent = '' }, 4000)
}

// ---------- status gry (BroadcastChannel) ----------
let pausedByGame = false
let ch = null
try {
  ch = new BroadcastChannel('wt-admin')
  ch.onmessage = (ev) => {
    if (ev.data && (ev.data.type === 'pause' || ev.data.type === 'unpause')) {
      pausedByGame = ev.data.type === 'pause'
      const pb = $('#pause-btn')
      if (pb) { pb.textContent = pausedByGame ? '▶ Wznów grę' : '⏸ Pauza (ESC)'; pb.dataset.on = pausedByGame ? '1' : '' }
    }
    if (ev.data && ev.data.type === 'pong') {
      const s = $('#game-status')
      const pb = $('#pause-btn')
      if (pb) { pb.textContent = (pausedByGame ? '▶ Wznów grę' : '⏸ Pauza (ESC)'); pb.dataset.on = pausedByGame ? '1' : '' }
      s.textContent = '● gra wykryta — zmiany widać na żywo'
      s.className = 'status on'
      clearTimeout(ch._t)
      ch._t = setTimeout(() => {
        s.textContent = '○ brak odpowiedzi gry (odpal grę w drugiej karcie)'
        s.className = 'status'
      }, 4500)
    }
  }
  setInterval(() => ch.postMessage({ type: 'ping' }), 2000)
} catch {}
document.addEventListener('DOMContentLoaded', () => {})
const _pb = () => document.getElementById('pause-btn')
if (_pb()) _pb().addEventListener('click', () => {
  const on = _pb().dataset.on === '1'
  _pb().dataset.on = on ? '' : '1'
  _pb().textContent = on ? '⏸ Pauza (ESC)' : '▶ Wznów grę'
  try { ch && ch.postMessage({ type: on ? 'unpause' : 'pause' }) } catch {}
})

// ---------- podgląd 3D ----------
const pv = { renderer: null, scene: null, camera: null, root: null, drag: null, loader: GLTFLoader ? new GLTFLoader() : null }
function initPreview(host) {
  if (!THREE) { const l = $('#preview3d .pl'); if (l) l.textContent = 'podgląd 3D wymaga internetu (CDN three.js)'; return false }
  if (pv.renderer) return true
  try { pv.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }) } catch { return false }
  pv.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1))
  pv.renderer.setSize(250, 250)
  host.insertBefore(pv.renderer.domElement, host.firstChild)
  pv.scene = new THREE.Scene()
  pv.camera = new THREE.PerspectiveCamera(34, 1, 0.01, 60)
  pv.camera.position.set(0, 0.85, 3.3)
  pv.camera.lookAt(0, 0.45, 0)
  pv.scene.add(new THREE.AmbientLight(0xffffff, 0.7))
  const key = new THREE.DirectionalLight(0xfff2d8, 2.2); key.position.set(2.5, 3, 2.5); pv.scene.add(key)
  const rim = new THREE.DirectionalLight(0xa855f7, 1.3); rim.position.set(-2.5, 1.2, -2.5); pv.scene.add(rim)
  pv.drag = { rx: 0.5, ry: 0.7, vy: 0.006, down: false, lx: 0, ly: 0 }
  host.addEventListener('pointerdown', (e) => { pv.drag.down = true; pv.drag.lx = e.clientX; pv.drag.ly = e.clientY })
  window.addEventListener('pointerup', () => { pv.drag.down = false })
  host.addEventListener('pointermove', (e) => {
    if (!pv.drag.down) return
    pv.drag.ry += (e.clientX - pv.drag.lx) * 0.008
    pv.drag.rx = Math.max(-1.2, Math.min(1.6, pv.drag.rx + (e.clientY - pv.drag.ly) * 0.006))
    pv.drag.lx = e.clientX; pv.drag.ly = e.clientY
  })
  ;(function loop() {
    requestAnimationFrame(loop)
    if (!pv.renderer) return
    if (pv.root && !pv.drag.down) pv.drag.ry += pv.drag.vy
    if (pv.root) { pv.root.rotation.y = pv.drag.ry; pv.root.rotation.x = pv.drag.rx }
    pv.renderer.render(pv.scene, pv.camera)
  })()
  return true
}

function showPreview(item) {
  const host = $('#preview3d')
  if (!host) return
  if (!initPreview(host)) return
  const label = $('#preview3d .pl')
  if (pv.root) { pv.scene.remove(pv.root); pv.root = null }
  if (!item) { label.textContent = '—'; return }
  const rar = RAR[item.rarity] || '#d6d3d1'
  const root = new THREE.Group()
  const name = item.model || (item.slot === 'weapon' ? 'sword' : item.slot === 'armor' ? 'helmet' : null)
  const done = (obj) => {
    obj.traverse((o) => { if (o.isMesh && o.material) { o.material = o.material.clone(); if (o.material.emissive) { o.material.emissive = new THREE.Color(rar); o.material.emissiveIntensity = 0.22 } } })
    const box = new THREE.Box3().setFromObject(obj)
    const c = box.getCenter(new THREE.Vector3())
    obj.position.sub(c)
    root.add(obj)
    pv.scene.add(root)
    pv.root = root
    label.textContent = (item.model || '(auto)') + ' · ' + RAR_PL[item.rarity]
  }
  const fallback = () => {
    const g = new THREE.Group()
    const gem = new THREE.Mesh(new THREE.IcosahedronGeometry(0.62, 0),
      new THREE.MeshStandardMaterial({ color: rar, emissive: rar, emissiveIntensity: 0.5, roughness: 0.15, metalness: 0.4 }))
    gem.position.y = 0.75
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.05, 12, 48),
      new THREE.MeshStandardMaterial({ color: 0xc9a24a, emissive: 0xc9a24a, emissiveIntensity: 0.25, roughness: 0.3, metalness: 0.9 }))
    ring.position.y = 0.75; ring.rotation.x = 1.2
    const light = new THREE.PointLight(rar, 6, 4); light.position.y = 1.6
    g.add(gem, ring, light)
    done(g)
  }
  if (name) {
    pv.loader.load('models/' + name + '.glb',
      (g) => done(g.scene),
      undefined,
      () => { label.textContent = 'brak models/' + name + '.glb'; fallback() })
  } else fallback()
}

// ---------- walidacja przedmiotu (zgodna z grą) ----------
function validItem(it) {
  if (!it || typeof it !== 'object') return false
  if (!['weapon', 'armor', 'charm'].includes(it.slot)) return false
  if (!['common', 'magic', 'rare', 'unique'].includes(it.rarity)) return false
  if (typeof it.name !== 'string' || !it.name.trim() || it.name.length > 80) return false
  if (!Array.isArray(it.affixes) || it.affixes.length < 1 || it.affixes.length > 4) return false
  for (const a of it.affixes) {
    if (!a || !STATS.includes(a.stat)) return false
    if (typeof a.value !== 'number' || !isFinite(a.value) || a.value <= 0 || a.value > 999) return false
  }
  return true
}

// ==================== ZAKŁADKA: PRZEDMIOTY ====================
function renderItems() {
  const gear = lsGet('wt.gear', {})
  const inv = lsGet('wt.inv', [])
  $('#tab-items').innerHTML = `
  <div class="row-flex">
    <div style="min-width:280px;max-width:340px;flex:1">
      <div class="card"><h3>Noszone (wt.gear)</h3><div class="list" id="gear-list"></div></div>
      <div class="card"><h3>Sakwa (${inv.length}/20)</h3><div class="list" id="inv-list"></div></div>
      <div class="card"><h3>Baza przedmiotów (${db.items.length})</h3><div class="list" id="db-list"></div>
        <div class="row-flex" style="margin-top:10px">
          <button class="btn" id="it-new">+ Nowy</button>
          <button class="btn gold" id="it-import">Import</button>
          <button class="btn gold" id="it-export">Eksport</button>
        </div>
        <div class="hint">Bazę dzieli gra i panel — dropy z bazy działają na żywo (przy zabójstwach).</div>
      </div>
    </div>
    <div style="flex:1;min-width:300px">
      <div class="card"><h3>Edytor</h3>
        <div class="row-flex">
          <div style="flex:1;min-width:260px">
            <label>nazwa</label><input type="text" id="f-name" maxlength="80">
            <div class="grid2" style="margin-top:8px">
              <div><label>slot</label><select id="f-slot"><option value="weapon">Broń</option><option value="armor">Zbroja</option><option value="charm">Talizman</option></select></div>
              <div><label>rzadkość</label><select id="f-rar"><option value="common">zwykły</option><option value="magic">magiczny</option><option value="rare">rzadki</option><option value="unique">unikat</option></select></div>
            </div>
            <label style="margin-top:8px">model 3D (podgląd)</label><select id="f-model"></select>
            <label style="margin-top:8px">afiksy (1–4)</label><div class="grid2" id="f-affs"></div>
            <div class="row-flex" style="margin-top:12px">
              <button class="btn green" id="it-save">Zapisz</button>
              <button class="btn gold" id="it-equip">Załóż</button>
              <button class="btn" id="it-inv">Do sakwy</button>
              <button class="btn red" id="it-del">Usuń</button>
            </div>
            <label style="margin-top:10px">dropy z bazy przy zabójstwach: <span id="dc-l"></span></label>
            <input type="range" id="f-dc" min="0" max="100" step="5" style="width:100%;accent-color:#a855f7">
          </div>
          <div id="preview3d"><div class="pl">—</div></div>
        </div>
      </div>
    </div>
  </div>
  <div id="app-msg" class="msg"></div>
  <div class="hint"><b>Załóż</b> zapisuje do wt.gear — odśwież grę (F5), żeby zobaczyć na postaci. Dialogi i dropy nie wymagają F5.</div>`

  // listy
  const gl = $('#gear-list'); gl.innerHTML = ''
  for (const s of ['weapon', 'armor', 'charm']) {
    const it = gear[s]
    gl.insertAdjacentHTML('beforeend', `<div class="li" data-gear="${s}"><span class="dot" style="background:${it ? RAR[it.rarity] : '#27272a'}"></span>
      <span>${it ? esc(it.name) : '<i style="color:#52525b">— pusto —</i>'}</span><span style="margin-left:auto;color:#71717a;font-size:9px">${SLOT_PL[s]}</span></div>`)
  }
  const il = $('#inv-list'); il.innerHTML = inv.length ? '' : '<div class="li" style="color:#52525b">pusto</div>'
  inv.forEach((it, i) => il.insertAdjacentHTML('beforeend',
    `<div class="li"><span class="dot" style="background:${RAR[it.rarity] || '#999'}"></span><span>${esc(it.name)}</span><span class="x" data-invdel="${i}">✕</span></div>`))
  const dl = $('#db-list'); dl.innerHTML = db.items.length ? '' : '<div class="li" style="color:#52525b">(pusto — kliknij + Nowy)</div>'
  db.items.forEach((it, i) => dl.insertAdjacentHTML('beforeend',
    `<div class="li ${i === selItem ? 'sel' : ''}" data-item="${i}"><span class="dot" style="background:${RAR[it.rarity]}"></span><span>${esc(it.name)}</span><span style="margin-left:auto;color:#71717a;font-size:9px">${SLOT_PL[it.slot]}</span></div>`))

  // model select
  const fm = $('#f-model')
  fm.innerHTML = '<option value="">(auto wg slotu)</option>' +
    allModels().map((m) => `<option value="${m}">${m}${BASE_MODELS.includes(m) ? ' (wbudowany)' : ''}</option>`).join('')

  // afiksy
  const fa = $('#f-affs'); fa.innerHTML = ''
  for (const s of STATS) {
    fa.insertAdjacentHTML('beforeend', `<div class="li" style="cursor:default">
      <input type="checkbox" data-a="${s}" style="accent-color:#a855f7" checked="${false}">
      <span style="flex:1">${STAT_PL[s]}</span>
      <input type="number" step="any" min="0.1" max="999" data-av="${s}" style="width:74px;padding:4px 6px;font-size:12px" disabled></div>`)
  }
  fa.addEventListener('change', (e) => {
    const s = e.target.dataset.a || e.target.dataset.av
    if (!s) return
    const cb = $(`[data-a="${s}"]`, fa), num = $(`[data-av="${s}"]`, fa)
    num.disabled = !cb.checked
    if (cb.checked && !num.value) num.value = (s === 'regen' ? 1 : (s === 'hp' || s === 'mana' ? 10 : 5))
  })

  const readForm = () => {
    const it = { name: $('#f-name').value.trim().slice(0, 80), slot: $('#f-slot').value, rarity: $('#f-rar').value, affixes: [] }
    const m = $('#f-model').value; if (m) it.model = m
    for (const s of STATS) {
      const cb = $(`[data-a="${s}"]`, fa)
      if (cb.checked) {
        const v = parseFloat($(`[data-av="${s}"]`, fa).value)
        if (!isNaN(v)) it.affixes.push({ stat: s, value: v })
      }
    }
    if (it.affixes.length > 4) it.affixes = it.affixes.slice(0, 4)
    return it
  }
  const fillForm = (it) => {
    $('#f-name').value = it.name || ''
    $('#f-slot').value = it.slot || 'weapon'
    $('#f-rar').value = it.rarity || 'magic'
    fm.value = it.model || ''
    for (const s of STATS) {
      const a = (it.affixes || []).find((x) => x.stat === s)
      const cb = $(`[data-a="${s}"]`, fa), num = $(`[data-av="${s}"]`, fa)
      cb.checked = !!a; num.disabled = !a; num.value = a ? a.value : ''
    }
    showPreview(readForm())
  }
  const refreshLists = () => { db = lsGet('wt.db', db); renderItems() }

  $('#f-dc').value = db.dropChance
  $('#dc-l').textContent = db.dropChance + '%'
  $('#f-dc').addEventListener('input', (e) => {
    db.dropChance = +e.target.value
    lsSet('wt.db', db)
    $('#dc-l').textContent = db.dropChance + '%'
  })

  dl.addEventListener('click', (e) => {
    const row = e.target.closest('[data-item]')
    if (!row) return
    selItem = +row.dataset.item
    fillForm(db.items[selItem])
    $$('[data-item]', dl).forEach((r) => r.classList.remove('sel'))
    row.classList.add('sel')
  })
  il.addEventListener('click', (e) => {
    const d = e.target.closest('[data-invdel]')
    if (!d) return
    const inv2 = lsGet('wt.inv', [])
    inv2.splice(+d.dataset.invdel, 1)
    lsSet('wt.inv', inv2)
    msg('Usunięto z sakwy.')
    renderItems()
  })
  gl.addEventListener('click', (e) => {
    const row = e.target.closest('[data-gear]')
    if (!row) return
    const g = lsGet('wt.gear', {})
    if (!g[row.dataset.gear]) return
    const it = clone(g[row.dataset.gear])
    g[row.dataset.gear] = null
    lsSet('wt.gear', g)
    const inv2 = lsGet('wt.inv', [])
    if (inv2.length < 20) { inv2.push(it); lsSet('wt.inv', inv2); msg('Zdjęto: ' + it.name + ' → sakwa (F5 w grze)') }
    else msg('Sakwa pełna — item utracony!', true)
    renderItems()
  })

  $('#it-new').addEventListener('click', () => { selItem = -1; fillForm({ name: '', slot: 'weapon', rarity: 'magic', affixes: [{ stat: 'dmg', value: 5 }] }) })
  $('#it-save').addEventListener('click', () => {
    const it = readForm()
    if (!validItem(it)) return msg('Niepoprawny przedmiot: nazwa 1–80 znaków, 1–4 afiksy, wartości > 0.', true)
    if (selItem >= 0) db.items[selItem] = it
    else { db.items.push(it); selItem = db.items.length - 1 }
    lsSet('wt.db', db)
    msg('Zapisano: ' + it.name)
    refreshLists()
  })
  $('#it-equip').addEventListener('click', () => {
    const it = readForm()
    if (!validItem(it)) return msg('Niepoprawny przedmiot.', true)
    const g = lsGet('wt.gear', {})
    if (g[it.slot]) {
      const inv2 = lsGet('wt.inv', [])
      if (inv2.length < 20) inv2.push(g[it.slot])
      lsSet('wt.inv', inv2)
    }
    g[it.slot] = it
    lsSet('wt.gear', g)
    msg('Założono: ' + it.name + ' — odśwież grę (F5)')
    refreshLists()
  })
  $('#it-inv').addEventListener('click', () => {
    const it = readForm()
    if (!validItem(it)) return msg('Niepoprawny przedmiot.', true)
    const inv2 = lsGet('wt.inv', [])
    if (inv2.length >= 20) return msg('Sakwa pełna!', true)
    inv2.push(it)
    lsSet('wt.inv', inv2)
    msg('Dodano do sakwy: ' + it.name + ' (F5 w grze)')
    refreshLists()
  })
  $('#it-del').addEventListener('click', () => {
    if (selItem < 0) return msg('Zaznacz przedmiot z bazy.', true)
    msg('Usunięto z bazy: ' + db.items[selItem].name)
    db.items.splice(selItem, 1); selItem = -1
    lsSet('wt.db', db)
    refreshLists()
  })
  $('#it-export').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob); a.download = 'warptracker-baza-przedmiotow.json'; a.click()
    URL.revokeObjectURL(a.href)
    msg('Wyeksportowano ' + db.items.length + ' przedmiotów.')
  })
  $('#it-import').addEventListener('click', () => {
    const inp = document.createElement('input')
    inp.type = 'file'; inp.accept = '.json,application/json'
    inp.onchange = () => {
      const f = inp.files[0]; if (!f) return
      const r = new FileReader()
      r.onload = () => {
        try {
          const d = JSON.parse(r.result)
          const items = (d.items || (Array.isArray(d) ? d : [])).filter(validItem)
          let n = 0
          for (const it of items) { db.items.push(it); n++ }
          if (typeof d.dropChance === 'number') db.dropChance = d.dropChance
          lsSet('wt.db', db)
          msg('Zaimportowano ' + n + ' przedmiotów.')
          renderItems()
        } catch (e) { msg('Błąd importu: ' + e.message, true) }
      }
      r.readAsText(f)
    }
    inp.click()
  })
  ;['f-slot', 'f-rar', 'f-model', 'f-name'].forEach((id) =>
    $('#' + id).addEventListener('change', () => showPreview(readForm())))

  if (selItem >= 0 && db.items[selItem]) fillForm(db.items[selItem])
  else if (db.items.length) { selItem = 0; fillForm(db.items[0]); const _r0 = $('[data-item="0"]'); if (_r0) _r0.classList.add('sel') }
  else fillForm({ name: '', slot: 'weapon', rarity: 'magic', affixes: [{ stat: 'dmg', value: 5 }] })
}

// ==================== ZAKŁADKA: MODELE ====================
function renderModels() {
  const own = getModels()
  $('#tab-models').innerHTML = `
  <div class="row-flex">
    <div class="card" style="min-width:300px;flex:1"><h3>Wbudowane</h3><div class="list">
      ${BASE_MODELS.map((m) => `<div class="li" style="cursor:default"><span class="dot" style="background:#71717a"></span>${m}.glb</div>`).join('')}
    </div></div>
    <div class="card" style="min-width:300px;flex:1"><h3>Własne (${own.length})</h3>
      <div class="list" id="own-list">${own.length ? '' : '<div class="li" style="color:#52525b;cursor:default">(brak — dodaj poniżej)</div>'}</div>
      <div class="row-flex" style="margin-top:10px">
        <input type="text" id="m-name" placeholder="nazwa bez .glb, np. moja-bron" style="flex:1">
        <button class="btn" id="m-add">Dodaj</button>
      </div>
    </div>
  </div>
  <div id="app-msg" class="msg"></div>
  <div class="hint">1) Wrzuć plik <b>NAZWA.glb</b> do katalogu <b>game/models/</b> &nbsp; 2) dodaj „NAZWA” tutaj &nbsp; 3) odśwież grę (F5) — model pojawi się też w podglądzie przedmiotów. Brakujący plik jest pomijany (gra nie crashuje).</div>`
  const ol = $('#own-list')
  own.forEach((m) => ol.insertAdjacentHTML('beforeend',
    `<div class="li" style="cursor:default"><span class="dot" style="background:#4ade80"></span>${esc(m)}.glb<span class="x" data-modeldel="${esc(m)}">✕</span></div>`))
  $('#own-list').addEventListener('click', (e) => {
    const d = e.target.closest('[data-modeldel]')
    if (!d) return
    const list = getModels().filter((m) => m !== d.dataset.modeldel)
    lsSet('wt.models', list)
    msg('Usunięto model „' + d.dataset.modeldel + '” — po F5 gra go nie załaduje.')
    renderModels()
  })
  $('#m-add').addEventListener('click', () => {
    const name = $('#m-name').value.trim().replace(/\.glb$/i, '').replace(/[^a-zA-Z0-9_-]/g, '')
    if (!name) return msg('Podaj nazwę (bez .glb).', true)
    if (BASE_MODELS.includes(name)) return msg('To model wbudowany.', true)
    const list = getModels()
    if (list.includes(name)) return msg('Już jest na liście.', true)
    list.push(name)
    lsSet('wt.models', list)
    $('#m-name').value = ''
    msg('Dodano „' + name + '”. Wrzuć ' + name + '.glb do game/models/ i daj F5 w grze.')
    renderModels()
  })
}

// ==================== ZAKŁADKA: DIALOGI (baza gry = plik) ====================
function gdNpc(id) {
  if (GD && GD.npcs && GD.npcs[id]) return GD.npcs[id]
  return { name: (NPCS.find((n) => n.id === id) || {}).name, lines: DEFAULT_DIALOGS[id] }
}
function renderDialogs() {
  if (!GD) {
    $('#tab-dialogs').innerHTML = '<div class="card"><h3>Dialogi / NPC</h3><div class="hint">Brak pliku <b>data/gamedata.json</b> — daj F5.</div></div>'
    return
  }
  $('#tab-dialogs').innerHTML = `
  <div class="hint" style="margin:0 0 14px">Edytujesz <b>bazę gry</b> (plik <b>game/data/gamedata.json</b> — trwale, wchodzi do repo). Zmiany widzi gra po <b>F5</b>${apiOK ? '' : ' — ale <b>brak serwera z API</b>: odpal <b>python3 serwer.py</b> zamiast http.server, żeby móc zapisywać pliki'}. Jedna linia = jedna kwestia.</div>
  ${NPCS.map((n) => {
    const cur = gdNpc(n.id)
    const lines = (cur.lines || []).join('\n')
    return `<div class="card npc-card" data-npc="${n.id}">
      <div class="head"><b>${esc(n.name)}</b><span class="id">id: ${n.id}</span>
        <button class="btn" data-npccopy="${n.id}" style="margin-left:auto;padding:4px 10px;font-size:9px">✎ domyślne z gry</button></div>
      <label>nazwa wyświetlana</label>
      <input type="text" data-npcname="${n.id}" value="${esc(cur.name || n.name)}" maxlength="40">
      <label style="margin-top:8px">kwestie (jedna linia = jedna kwestia)</label>
      <textarea data-npclines="${n.id}" rows="5">${esc(lines)}</textarea>
    </div>`
  }).join('')}
  <div class="row-flex">
    <button class="btn green" id="dlg-save" ${apiOK ? '' : 'disabled'}>💾 Zapisz do pliku gamedata.json</button>
    <button class="btn gold" id="dlg-download">⬇ Pobierz gamedata.json</button>
  </div>
  <div id="app-msg" class="msg"></div>`

  const collect = (id) => {
    const card = $(`[data-npc="${id}"]`)
    return {
      name: $(`[data-npcname="${id}"]`, card).value.trim() || NPCS.find((n) => n.id === id).name,
      lines: $(`[data-npclines="${id}"]`, card).value.split('\n').map((l) => l.trim()).filter(Boolean)
    }
  }
  $('#dlg-save').addEventListener('click', async () => {
    try {
      for (const n of NPCS) GD.npcs[n.id] = collect(n.id)
      await saveFile('data/gamedata.json', JSON.stringify(GD, null, 2))
      msg('Zapisano do game/data/gamedata.json — daj F5 w grze.')
    } catch (e) { msg('Nie udało się zapisać: ' + e.message, true) }
  })
  $('#dlg-download').addEventListener('click', () => {
    const g = clone(GD)
    for (const n of NPCS) g.npcs[n.id] = collect(n.id)
    const blob = new Blob([JSON.stringify(g, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob); a.download = 'gamedata.json'; a.click(); URL.revokeObjectURL(a.href)
    msg('Pobrano — nadpisz game/data/gamedata.json.')
  })
  for (const n of NPCS) {
    const card = $(`[data-npc="${n.id}"]`)
    const cp = $(`[data-npccopy="${n.id}"]`, card)
    if (cp) cp.addEventListener('click', () => {
      $(`[data-npclines="${n.id}"]`, card).value = DEFAULT_DIALOGS[n.id].join('\n')
      $(`[data-npcname="${n.id}"]`, card).value = n.name
    })
  }
}

// ==================== ZAKŁADKA: POSTAĆ ====================
function renderChar() {
  const save = lsGet('wt.save', null)
  const cls = localStorage.getItem('wt.class')
  const chapters = ['0 — Świeży początek', '1 — Pierwsza Krew oddana', '2 — Złamać Iglice (akt)', '3 — Kurhan/Serce', '4 — Długie Łowy']
  $('#tab-char').innerHTML = `
  <div class="row-flex">
    <div class="card" style="min-width:300px;flex:1"><h3>Postać (wt.save)</h3>
      ${save ? `
      <label>klasa</label>
      <select id="c-class">${CLASSES.map((c) => `<option value="${c.id}" ${save.class === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}</select>
      <label style="margin-top:8px">poziom (1–60)</label>
      <input type="number" id="c-level" min="1" max="60" value="${save.level}">
      <label style="margin-top:8px">XP (0–10 000 000)</label>
      <input type="number" id="c-xp" min="0" max="10000000" value="${save.xp}">
      <label style="margin-top:8px">rozdział fabuły</label>
      <select id="c-chapter">${chapters.map((c, i) => `<option value="${i}" ${save.chapter === i ? 'selected' : ''}>${c}</option>`).join('')}</select>
      <label style="margin-top:8px">ukończone łowy</label>
      <input type="number" id="c-hunts" min="0" value="${save.huntsCompleted}">
      <div class="row-flex" style="margin-top:12px">
        <button class="btn green" id="c-save">Zapisz (potem F5 w grze)</button>
        <button class="btn red" id="c-reset">Z resetuj postać</button>
      </div>` : '<div class="hint" style="margin:0">(brak zapisu — zacznij grę i wybierz klasę)</div>'}
      ${cls ? `<div class="hint">Klasa startowa (wt.class): <b>${esc(cls.replace(/"/g, ''))}</b></div>` : ''}
    </div>
    <div class="card" style="min-width:300px;flex:1"><h3>Ekwipunek</h3><div id="char-gear"></div>
      <div class="hint">Zakładanie/zdejmowanie — w zakładce Przedmioty (klik item z „Noszone” lub „Załóż”). Zmiany widoczne po F5.</div>
    </div>
  </div>
  <div id="app-msg" class="msg"></div>`

  if (save) {
    $('#c-save').addEventListener('click', () => {
      const s = clone(save)
      s.class = $('#c-class').value
      s.level = Math.max(1, Math.min(60, Math.floor(+$('#c-level').value || 1)))
      s.xp = Math.max(0, Math.min(10000000, Math.floor(+$('#c-xp').value || 0)))
      s.chapter = Math.max(0, Math.min(3, Math.floor(+$('#c-chapter').value || 0)))
      s.huntsCompleted = Math.max(0, Math.floor(+$('#c-hunts').value || 0))
      lsSet('wt.save', s)
      msg('Zapisano — daj F5 w grze.')
      renderChar()
    })
    $('#c-reset').addEventListener('click', () => {
      localStorage.removeItem('wt.save')
      localStorage.removeItem('wt.gear')
      localStorage.removeItem('wt.inv')
      localStorage.removeItem('wt.stats')
      localStorage.removeItem('wt.starter')
      msg('Postać zresetowana — F5 w grze zacznie od nowa.')
      renderChar()
    })
  }
  const gear = lsGet('wt.gear', {})
  $('#char-gear').innerHTML = ['weapon', 'armor', 'charm'].map((s) => {
    const it = gear[s]
    return `<div class="li" style="cursor:default"><span class="dot" style="background:${it ? RAR[it.rarity] : '#27272a'}"></span>
      <span>${it ? esc(it.name) : '<i style="color:#52525b">— pusto —</i>'}</span>
      <span style="margin-left:auto;color:#71717a;font-size:9px">${SLOT_PL[s]}</span></div>`
  }).join('') || '<div class="hint">(brak)</div>'
}

// ==================== ZAKŁADKA: BAZA GRY (plik) ====================
const EDITABLE_FILES = [
  'data/gamedata.json',
  'assets/admin.js', 'assets/admin-app.js', 'assets/bridge.js', 'assets/charsheet.js',
  'assets/index-FsptR_Zn.js', 'assets/index-BEkZlT_U.css',
  'index.html', 'admin.html', 'serwer.py',
  'assets/parts/p01.js', 'assets/parts/p02.js', 'assets/parts/p03.js', 'assets/parts/p04.js',
  'assets/parts/p05.js', 'assets/parts/p06.js', 'assets/parts/p07.js', 'assets/parts/p08.js',
  'assets/parts/p09.js', 'assets/parts/p10.js', 'assets/parts/p11.js', 'assets/parts/p12.js'
]
function renderGameDB() {
  const apiNote = apiOK
    ? '<span class="badge" style="background:rgba(74,222,128,.12);border-color:#3f6212;color:#86efac">serwer z API działa — zapisy idą do plików</span>'
    : '<span class="badge" style="background:rgba(248,113,113,.1);border-color:#7f1d1d;color:#fca5a5">brak API — odpal: python3 serwer.py</span>'
  $('#tab-gamedb').innerHTML = `
  <div class="hint" style="margin:0 0 12px">Tu zmieniasz <b>samą grę</b>, nie stan partii: pliki na dysku (i potem git commit). ${apiNote}</div>
  <div class="row-flex">
    <div class="card" style="flex:1;min-width:300px"><h3>🗄 data/gamedata.json — baza gry</h3>
      <textarea id="gdb-json" rows="18" spellcheck="false"></textarea>
      <div class="row-flex" style="margin-top:10px">
        <button class="btn green" id="gdb-save" ${apiOK ? '' : 'disabled'}>💾 Zapisz plik</button>
        <button class="btn gold" id="gdb-dl">⬇ Pobierz</button>
        <button class="btn" id="gdb-reload">↻ Przeładuj z dysku</button>
      </div>
      <div class="hint">NPC (dialogi), pula przedmiotów bazowych (items) i dropChance (% szansy przy zabójstwie).</div>
    </div>
    <div class="card" style="flex:1;min-width:300px"><h3>💻 Kod gry — edytor plików</h3>
      <label>plik</label>
      <select id="code-file">${EDITABLE_FILES.map((f) => `<option value="${f}">${f}</option>`).join('')}</select>
      <textarea id="code-src" rows="14" spellcheck="false" style="margin-top:8px;font-family:monospace;font-size:11px"></textarea>
      <div class="row-flex" style="margin-top:10px">
        <button class="btn green" id="code-save" ${apiOK ? '' : 'disabled'}>💾 Zapisz plik</button>
        <button class="btn" id="code-reload">↻ Przeładuj z dysku</button>
      </div>
      <div class="hint">Edytuj mody (admin/bridge), loader, HTML i części bundla. Po zapisie daj F5 w grze. Ostrożnie z parts/ — to zminifikowany kod gry.</div>
    </div>
  </div>
  <div id="app-msg" class="msg"></div>`
  const ta = $('#gdb-json')
  ta.value = JSON.stringify(GD, null, 2)
  $('#gdb-save').addEventListener('click', async () => {
    try {
      const parsed = JSON.parse(ta.value)
      await saveFile('data/gamedata.json', JSON.stringify(parsed, null, 2))
      GD = parsed
      msg('Zapisano data/gamedata.json — F5 w grze.')
    } catch (e) { msg('Błąd: ' + e.message, true) }
  })
  $('#gdb-dl').addEventListener('click', () => {
    const blob = new Blob([ta.value], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob); a.download = 'gamedata.json'; a.click(); URL.revokeObjectURL(a.href)
  })
  $('#gdb-reload').addEventListener('click', async () => {
    await loadGD()
    ta.value = JSON.stringify(GD, null, 2)
    msg('Przeładowano z dysku.')
  })
  const cs = $('#code-src')
  const loadFile = async () => {
    try {
      const r = await fetch($('#code-file').value, { cache: 'no-store' })
      cs.value = r.ok ? await r.text() : 'nie udało się wczytać pliku'
    } catch (e) { cs.value = 'błąd: ' + e.message }
  }
  $('#code-file').addEventListener('change', loadFile)
  $('#code-reload').addEventListener('click', loadFile)
  $('#code-save').addEventListener('click', async () => {
    try {
      await saveFile($('#code-file').value, cs.value)
      msg('Zapisano ' + $('#code-file').value + ' — F5 w grze.')
    } catch (e) { msg('Nie udało się zapisać: ' + e.message, true) }
  })
  loadFile()
}

// ==================== ZAKŁADKA: KOPIA ====================
const BACKUP_KEYS = ['wt.save', 'wt.class', 'wt.gear', 'wt.inv', 'wt.db', 'wt.models', 'wt.dialogs', 'wt.stats', 'wt.mute', 'wt.starter']
function renderBackup() {
  $('#tab-backup').innerHTML = `
  <div class="card"><h3>Kopia zapasowa (cały stan)</h3>
    <div class="hint" style="margin:0 0 12px">Pakuje wszystko: postać, ekwipunek, sakwę, bazę przedmiotów, modele, dialogi, statystyki.</div>
    <div class="row-flex">
      <button class="btn green" id="bk-export">⬇ Pobierz kopię (JSON)</button>
      <button class="btn gold" id="bk-import">⬆ Wczytaj kopię</button>
      <button class="btn red" id="bk-wipe">🗑 Wyczyść wszystko</button>
    </div>
    <div class="row-flex" style="margin-top:14px" id="bk-keys"></div>
    <div id="app-msg" class="msg"></div>
  </div>`
  const keysEl = $('#bk-keys')
  keysEl.innerHTML = BACKUP_KEYS.map((k) => {
    const has = localStorage.getItem(k) != null
    const size = has ? localStorage.getItem(k).length : 0
    return `<span class="badge" style="${has ? '' : 'opacity:.35'}">${k} · ${has ? (size > 1024 ? Math.round(size / 1024) + ' KB' : size + ' B') : 'brak'}</span>`
  }).join('')
  $('#bk-export').addEventListener('click', () => {
    const data = { _app: 'warptracker-pl-backup', _date: new Date().toISOString() }
    for (const k of BACKUP_KEYS) { const v = localStorage.getItem(k); if (v != null) data[k] = v }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'warptracker-kopia-' + new Date().toISOString().slice(0, 10) + '.json'
    a.click(); URL.revokeObjectURL(a.href)
    msg('Kopia pobrana.')
  })
  $('#bk-import').addEventListener('click', () => {
    const inp = document.createElement('input')
    inp.type = 'file'; inp.accept = '.json,application/json'
    inp.onchange = () => {
      const f = inp.files[0]; if (!f) return
      const r = new FileReader()
      r.onload = () => {
        try {
          const d = JSON.parse(r.result)
          let n = 0
          for (const k of BACKUP_KEYS) if (typeof d[k] === 'string') { localStorage.setItem(k, d[k]); n++ }
          db = lsGet('wt.db', db)
          msg('Wczytano ' + n + ' kluczy — daj F5 w grze.')
          renderBackup()
        } catch (e) { msg('Błąd: ' + e.message, true) }
      }
      r.readAsText(f)
    }
    inp.click()
  })
  $('#bk-wipe').addEventListener('click', () => {
    if (!confirm('Na pewno? Postać, baza przedmiotów i dialogi zostaną usunięte.')) return
    for (const k of BACKUP_KEYS) localStorage.removeItem(k)
    db = { items: [], dropChance: 10 }
    msg('Wyczyszczono.')
    renderBackup()
  })
}

// ---------- zakładki ----------
const TABS = [
  { id: 'items', name: '🗡 Przedmioty', render: renderItems },
  { id: 'models', name: '🗿 Modele 3D', render: renderModels },
  { id: 'gamedb', name: '🗄 Baza gry / Kod', render: renderGameDB },
  { id: 'dialogs', name: '💬 Dialogi / NPC', render: renderDialogs },
  { id: 'char', name: '🧍 Postać', render: renderChar },
  { id: 'backup', name: '💾 Kopia / Reset', render: renderBackup }
]
const nav = $('#nav')
for (const t of TABS) {
  const b = document.createElement('button')
  b.textContent = t.name
  b.addEventListener('click', () => {
    $$('nav button').forEach((x) => x.classList.remove('act'))
    b.classList.add('act')
    $$('.tab').forEach((x) => x.classList.remove('act'))
    $('#tab-' + t.id).classList.add('act')
    t.render()
  })
  nav.appendChild(b)
}
const main = $('#main')
for (const t of TABS) {
  const d = document.createElement('div')
  d.className = 'tab'; d.id = 'tab-' + t.id
  main.appendChild(d)
}
nav.firstChild.classList.add('act')
$('#tab-items').classList.add('act')
renderItems()
loadGD().then(() => {})
