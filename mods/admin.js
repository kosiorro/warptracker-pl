// ===== Warptracker PL: PANEL ADMINA przedmiotów (klawisz P) =====
;(function () {
  const RAR = { common: '#d6d3d1', magic: '#60a5fa', rare: '#fde047', unique: '#c084fc' }
  const RAR_PL = { common: 'zwykły', magic: 'magiczny', rare: 'rzadki', unique: 'unikat' }
  const SLOT_PL = { weapon: 'Broń', armor: 'Zbroja', charm: 'Talizman' }
  const STATS = ['dmg', 'hp', 'speed', 'mana', 'regen']
  const STAT_PL = { dmg: 'obrażeń', hp: 'życia', speed: '% szybk. ruchu', mana: 'many', regen: 'życia/s' }
  const KEY = 'wt.inv'
  const MAX_INV = 20

  function loadInv() {
    try {
      const a = JSON.parse(localStorage.getItem(KEY) || '[]')
      return Array.isArray(a) ? a.slice(0, MAX_INV) : []
    } catch { return [] }
  }
  function saveInv(a) { try { localStorage.setItem(KEY, JSON.stringify(a)) } catch {} }
  function saveGear(L) { try { localStorage.setItem('wt.gear', JSON.stringify(L.equipped)) } catch {} }
  function loot() { return window.__WT && window.__WT.loot }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') }

  const style = document.createElement('style')
  style.textContent = `
#admin-panel{position:fixed;inset:0;z-index:130;display:none;align-items:center;justify-content:center;background:rgba(6,3,10,.82);font-family:Georgia,'Times New Roman',serif}
#admin-panel.show{display:flex}
.adm-box{width:880px;max-height:92vh;overflow:auto;background:#0d0815;border:1px solid #6b21a8;border-radius:10px;padding:22px 26px;box-shadow:0 0 46px rgba(168,85,247,.28)}
.adm-title{color:#e9d5ff;letter-spacing:.24em;font-size:15px;text-align:center;margin-bottom:2px}
.adm-sub{color:#71717a;font-size:11px;text-align:center;margin-bottom:16px}
.adm-cols{display:flex;gap:22px}
.adm-list{width:330px;max-height:56vh;overflow:auto;border:1px solid #2a1b3d;border-radius:8px;background:rgba(16,10,26,.6)}
.adm-item{padding:7px 10px;border-bottom:1px solid #221536;cursor:pointer;display:flex;align-items:center;gap:8px}
.adm-item:hover{background:rgba(168,85,247,.08)}
.adm-item.sel{background:rgba(168,85,247,.16);border-left:3px solid #a855f7}
.adm-item .dot{width:9px;height:9px;border-radius:50%;flex:none}
.adm-item .nm{font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}
.adm-item .tag{font-size:9px;color:#71717a;letter-spacing:.08em}
.adm-form{flex:1;display:flex;flex-direction:column;gap:10px}
.adm-form label{color:#a1a1aa;font-size:10px;letter-spacing:.14em;text-transform:uppercase}
.adm-form input[type=text],.adm-form select{background:rgba(20,12,32,.9);border:1px solid #3f2a55;color:#e9d5ff;border-radius:6px;padding:7px 10px;font-size:13px;width:100%;box-sizing:border-box;font-family:inherit}
.adm-form input:focus,.adm-form select:focus{outline:none;border-color:#a855f7}
.adm-aff{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
.adm-aff .aff{border:1px solid #2a1b3d;border-radius:8px;padding:8px;display:flex;flex-direction:column;gap:5px;background:rgba(20,12,32,.7)}
.adm-aff .aff.on{border-color:#7e22ce}
.adm-aff .aff label{display:flex;align-items:center;gap:5px;color:#c4b5fd;font-size:10px;text-transform:none;letter-spacing:0}
.adm-aff input[type=number]{width:100%;background:rgba(10,6,18,.9);border:1px solid #3f2a55;color:#fde047;border-radius:5px;padding:4px 6px;font-size:12px;box-sizing:border-box}
.adm-btns{display:flex;gap:10px;flex-wrap:wrap;margin-top:6px}
.adm-btn{flex:1;min-width:120px;padding:9px 12px;border-radius:7px;border:1px solid #6b21a8;background:rgba(107,33,168,.25);color:#e9d5ff;font-family:inherit;font-size:12px;letter-spacing:.1em;cursor:pointer;text-transform:uppercase}
.adm-btn:hover{background:rgba(168,85,247,.35)}
.adm-btn.green{border-color:#3f6212;background:rgba(63,98,18,.3)}
.adm-btn.red{border-color:#7f1d1d;background:rgba(127,29,29,.3)}
.adm-btn.gold{border-color:#a16207;background:rgba(161,98,7,.25)}
.adm-hint{color:#71717a;font-size:10.5px;text-align:center;margin-top:12px;line-height:1.6}
.adm-empty{color:#52525b;font-size:12px;text-align:center;padding:26px 8px}
`
  document.head.appendChild(style)

  const root = document.createElement('div')
  root.id = 'admin-panel'
  document.body.appendChild(root)
  let open = false
  let sel = null

  function current() {
    const L = loot(); if (!L) return null
    if (!sel) return null
    if (sel.kind === 'inv') return loadInv()[sel.i] || null
    return L.equipped[sel.slot] || null
  }
  function applyStats(L, msg) {
    saveGear(L)
    L.onEquip(L.totals, msg)
  }

  function renderList() {
    const L = loot(); if (!L) return ''
    let h = ''
    for (const s of ['weapon', 'armor', 'charm']) {
      const it = L.equipped[s]
      h += '<div class="adm-item' + (sel && sel.kind === 'eq' && sel.slot === s ? ' sel' : '') + '" data-kind="eq" data-slot="' + s + '">'
      h += '<span class="dot" style="background:' + (it ? RAR[it.rarity] : '#3f2a55') + '"></span>'
      h += '<span class="nm" style="color:' + (it ? RAR[it.rarity] : '#52525b') + '">' + (it ? esc(it.name) : '— ' + SLOT_PL[s] + ' pusta —') + '</span>'
      h += '<span class="tag">ZAŁOŻONE</span></div>'
    }
    const inv = loadInv()
    inv.forEach((it, i) => {
      h += '<div class="adm-item' + (sel && sel.kind === 'inv' && sel.i === i ? ' sel' : '') + '" data-kind="inv" data-idx="' + i + '">'
      h += '<span class="dot" style="background:' + RAR[it.rarity] + '"></span>'
      h += '<span class="nm" style="color:' + RAR[it.rarity] + '">' + esc(it.name) + '</span>'
      h += '<span class="tag">SAKWA</span></div>'
    })
    if (!inv.length && !L.equipped.weapon && !L.equipped.armor && !L.equipped.charm) {
      h += '<div class="adm-empty">brak przedmiotów</div>'
    }
    return h
  }

  function renderForm() {
    const it = current()
    const mk = (a) => (it ? it.affixes.some((x) => x.stat === a) : false)
    const val = (a) => {
      if (!it) return ''
      const x = it.affixes.find((y) => y.stat === a)
      return x ? x.value : ''
    }
    let aff = '<div class="adm-aff">'
    for (const s of STATS) {
      aff += '<div class="aff' + (mk(s) ? ' on' : '') + '" id="aff-' + s + '">'
      aff += '<label><input type="checkbox" id="chk-' + s + '"' + (mk(s) ? ' checked' : '') + '>' + STAT_PL[s].replace('życia/s', 'regen') + '</label>'
      aff += '<input type="number" step="any" id="val-' + s + '" placeholder="0" value="' + val(s) + '"></div>'
    }
    aff += '</div>'

    const opts = (v) => ['common', 'magic', 'rare', 'unique'].map((r) => '<option value="' + r + '"' + (v === r ? ' selected' : '') + '>' + RAR_PL[r] + '</option>').join('')
    const slotOpts = (v) => ['weapon', 'armor', 'charm'].map((s) => '<option value="' + s + '"' + (v === s ? ' selected' : '') + '>' + SLOT_PL[s] + '</option>').join('')

    return (
      '<div class="adm-form">' +
      '<div><label>Nazwa</label><input type="text" id="adm-name" maxlength="60" value="' + (it ? esc(it.name) : 'Nowy przedmiot') + '"></div>' +
      '<div style="display:flex;gap:10px"><div style="flex:1"><label>Slot</label><select id="adm-slot">' + slotOpts(it ? it.slot : 'weapon') + '</select></div>' +
      '<div style="flex:1"><label>Rzadkość</label><select id="adm-rarity">' + opts(it ? it.rarity : 'magic') + '</select></div></div>' +
      '<div><label>Afiksy (zaznacz i ustaw wartość)</label>' + aff + '</div>' +
      '<div class="adm-btns">' +
      '<button class="adm-btn gold" id="adm-save">' + (it ? 'ZAPISZ ZMIANY' : 'UTWÓRZ') + '</button>' +
      '<button class="adm-btn green" id="adm-new">NOWY</button>' +
      (it ? '<button class="adm-btn green" id="adm-equip">ZAŁÓŻ</button><button class="adm-btn red" id="adm-del">USUŃ</button>' : '') +
      '</div></div>'
    )
  }

  function render() {
    if (!loot()) return
    root.innerHTML =
      '<div class="adm-box"><div class="adm-title">PANEL ADMINA — PRZEDMIOTY</div>' +
      '<div class="adm-sub">wybierz przedmiot z listy lub stwórz nowy &middot; zmiany działają natychmiast</div>' +
      '<div class="adm-cols"><div class="adm-list" id="adm-list">' + renderList() + '</div>' + renderForm() + '</div>' +
      '<div class="adm-hint">P — otwórz / zamknij &middot; klik na przedmiot — edycja &middot; NOWY — świeży przedmiot do sakwy<br/>ZAŁÓŻ przenosi przedmiot ze sakwy na slot (stary wraca do sakwy) &middot; USUŃ kasuje przedmiot</div></div>'
    bindForm()
  }

  function readForm() {
    const name = document.getElementById('adm-name').value.trim() || 'Bez nazwy'
    const slot = document.getElementById('adm-slot').value
    const rarity = document.getElementById('adm-rarity').value
    const affixes = []
    for (const s of STATS) {
      if (document.getElementById('chk-' + s).checked) {
        const v = parseFloat(document.getElementById('val-' + s).value)
        if (!isNaN(v) && v !== 0) affixes.push({ stat: s, value: v })
      }
    }
    if (!affixes.length) affixes.push({ stat: 'dmg', value: 1 })
    return { slot, rarity, name, affixes }
  }

  function bindForm() {
    for (const s of STATS) {
      document.getElementById('chk-' + s).addEventListener('change', (e) => {
        document.getElementById('aff-' + s).classList.toggle('on', e.target.checked)
      })
    }
    document.getElementById('adm-save').onclick = () => {
      const L = loot(); if (!L) return
      const data = readForm()
      if (sel && sel.kind === 'eq') {
        const old = L.equipped[sel.slot]
        if (old) { old.name = data.name; old.slot = data.slot; old.rarity = data.rarity; old.affixes = data.affixes }
        applyStats(L, data.name.toUpperCase() + ' — zmienione (admin)')
        if (old && data.slot !== sel.slot) {
          const inv = loadInv(); inv.push(old); saveInv(inv)
          L.equipped[sel.slot] = null
          applyStats(L, data.name.toUpperCase() + ' — przeniesione do sakwy (admin)')
        }
      } else if (sel && sel.kind === 'inv') {
        const inv = loadInv()
        const it = inv[sel.i]
        if (it) { it.name = data.name; it.slot = data.slot; it.rarity = data.rarity; it.affixes = data.affixes; saveInv(inv) }
      } else {
        const inv = loadInv()
        if (inv.length >= MAX_INV) { L.onEquip(L.totals, 'Sakwa pełna!'); return }
        inv.push(data); saveInv(inv)
        sel = { kind: 'inv', i: inv.length - 1 }
      }
      render()
    }
    document.getElementById('adm-new').onclick = () => { sel = null; render() }
    const eq = document.getElementById('adm-equip')
    if (eq) eq.onclick = () => {
      const L = loot(); if (!L || !sel || sel.kind !== 'inv') return
      const inv = loadInv()
      const it = inv[sel.i]; if (!it) return
      const target = L.equipped[it.slot]
      L.equipped[it.slot] = it
      inv.splice(sel.i, 1)
      if (target) inv.push(target)
      saveInv(inv)
      applyStats(L, it.name.toUpperCase() + ' — założone (admin)')
      sel = { kind: 'eq', slot: it.slot }
      render()
    }
    const del = document.getElementById('adm-del')
    if (del) del.onclick = () => {
      const L = loot(); if (!L || !sel) return
      if (sel.kind === 'inv') {
        const inv = loadInv(); inv.splice(sel.i, 1); saveInv(inv)
      } else {
        L.equipped[sel.slot] = null
        applyStats(L, 'przedmiot usunięty (admin)')
      }
      sel = null
      render()
    }
  }

  root.addEventListener('click', (e) => {
    const el = e.target.closest('.adm-item')
    if (!el) return
    if (el.dataset.kind === 'eq') sel = { kind: 'eq', slot: el.dataset.slot }
    else sel = { kind: 'inv', i: Number(el.dataset.idx) }
    render()
  })

  function toggle() {
    if (!loot()) return
    open = !open
    root.classList.toggle('show', open)
    if (open) { sel = null; render() }
  }
  window.addEventListener('keydown', (e) => {
    if (e.repeat) return
    if (e.code === 'KeyP') { if (loot()) { e.preventDefault(); toggle() } }
    else if (e.code === 'Escape' && open) toggle()
  })
})()

// ===== Warptracker PL: trawiaste podłoże (proceduralna tekstura) =====
;(function () {
  function grassify() {
    const g = window.__WT
    const THREE = window.__WTdebug && window.__WTdebug.THREE
    if (!g || !g.scene || !THREE) return false
    let found = false
    g.scene.traverse((o) => {
      if (o.name === 'ground' && o.material && o.isMesh) {
        found = true
        const S = 256
        const cv = document.createElement('canvas')
        cv.width = S; cv.height = S
        const cx = cv.getContext('2d')
        const img = cx.createImageData(S, S)
        const d = img.data
        const rnd = (n) => {
          const s = Math.sin(n * 127.1 + 311.7) * 43758.5453
          return s - Math.floor(s)
        }
        const G = 8, G2 = 32
        const cell = (x, y, n) => rnd((Math.floor(x) % n) + (Math.floor(y) % n) * n + n * 7.13)
        const smooth = (t) => t * t * (3 - 2 * t)
        const noise = (x, y, n) => {
          const xi = Math.floor(x), yi = Math.floor(y)
          const xf = smooth(x - xi), yf = smooth(y - yi)
          const a = cell(xi, yi, n), b = cell(xi + 1, yi, n), c = cell(xi, yi + 1, n), dd = cell(xi + 1, yi + 1, n)
          return a + (b - a) * xf + (c - a) * yf + (a - b - c + dd) * xf * yf
        }
        for (let y = 0; y < S; y++) {
          for (let x = 0; x < S; x++) {
            const u = x / S, v = y / S
            const n1 = noise(u * G, v * G, G)
            const n2 = noise(u * G2, v * G2, G2)
            const n3 = rnd(x * 7.7 + y * 13.3)
            const h = n1 * 0.55 + n2 * 0.3 + n3 * 0.15
            const i = (y * S + x) * 4
            const dry = Math.pow(h, 2.4)
            d[i] = Math.round(30 + h * 34 + dry * 30)
            d[i + 1] = Math.round(46 + h * 52 + dry * 22)
            d[i + 2] = Math.round(18 + h * 26 + dry * 8)
            d[i + 3] = 255
          }
        }
        cx.putImageData(img, 0, 0)
        const tex = new THREE.CanvasTexture(cv)
        tex.wrapS = THREE.RepeatWrapping
        tex.wrapT = THREE.RepeatWrapping
        tex.repeat.set(60, 60)
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 4
        o.material.map = tex
        o.material.color.set(0x9aa06a)
        o.material.roughness = 1
        o.material.needsUpdate = true
      }
    })
    return found
  }
  let tries = 0
  const t = setInterval(() => {
    if (grassify() || ++tries > 200) clearInterval(t)
  }, 150)
})()
