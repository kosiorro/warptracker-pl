// ===== Warptracker PL: karta postaci (papierowa lalka jak z gry) + sakwa =====
;(function () {
  const RAR = { common: '#d6d3d1', magic: '#60a5fa', rare: '#fde047', unique: '#c084fc' }
  const GEM = { common: '#8b8b8b', magic: '#60a5fa', rare: '#fbbf24', unique: '#c084fc' }
  const RAR_PL = { common: 'zwykły', magic: 'magiczny', rare: 'rzadki', unique: 'unikat' }
  const SLOT_PL = { weapon: 'Broń', armor: 'Zbroja', charm: 'Talizman' }
  const STAT_PL = { dmg: 'obrażeń', hp: 'życia', speed: 'szybk. ruchu', mana: 'many', regen: 'życia/s' }
  const MAX_INV = 20
  const KEY = 'wt.inv'

  // ---- ikony SVG (stal + czerwony płótno, jak na klasycznych kartach) ----
  const ICONS = {
    weapon: (v) => `<svg viewBox="0 0 48 48" class="wt-ico"><defs><linearGradient id="st${v.slice(1)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8e8ee"/><stop offset=".5" stop-color="#a9a9b6"/><stop offset="1" stop-color="#6e6e7c"/></linearGradient></defs>
<path d="M24 3 L27 7 L27 26 L24 30 L21 26 L21 7 Z" fill="url(#st${v.slice(1)})"/>
<path d="M24 3 L27 7 L27 26 L24 30 Z" fill="#00000022"/>
<rect x="11" y="27" width="26" height="4" rx="1.5" fill="#7a2c22"/>
<rect x="11" y="27" width="26" height="2" rx="1" fill="#a53f30"/>
<rect x="22" y="31" width="4" height="9" rx="1.6" fill="#5b3a24"/>
<rect x="20.4" y="39" width="7.2" height="5.2" rx="2" fill="#c9a24a"/>
<circle cx="24" cy="41.5" r="1.7" fill="${v}"/></svg>`,
    armor: (v) => `<svg viewBox="0 0 48 48" class="wt-ico"><defs><linearGradient id="ar${v.slice(1)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dcdce4"/><stop offset="1" stop-color="#75757f"/></linearGradient></defs>
<path d="M10 12 L17 8 L24 11 L31 8 L38 12 L38 22 C38 32 32 39 24 42 C16 39 10 32 10 22 Z" fill="url(#ar${v.slice(1)})"/>
<path d="M24 11 L24 42 C32 39 38 32 38 22 L38 12 L31 8 Z" fill="#00000026"/>
<path d="M14 14 L14 22 C14 29 17 34 21 37 L21 14 Z" fill="#ffffff2e"/>
<path d="M10 12 L17 8 L18.5 12.5 L12 17 L10 22 Z" fill="#7a2c22"/>
<path d="M38 12 L31 8 L29.5 12.5 L36 17 L38 22 Z" fill="#7a2c22"/>
<rect x="20" y="10" width="8" height="3" rx="1.4" fill="#c9a24a"/>
<circle cx="24" cy="24" r="3.2" fill="${v}"/><circle cx="24" cy="24" r="1.6" fill="#ffffffcc"/></svg>`,
    charm: (v) => `<svg viewBox="0 0 48 48" class="wt-ico">
<path d="M12 22 C12 12 18 7 24 7 C30 7 36 12 36 22" fill="none" stroke="#c9a24a" stroke-width="3"/>
<path d="M12 22 C12 12 18 7 24 7" fill="none" stroke="#e8d18a" stroke-width="1.4"/>
<path d="M24 36 L16 24 L24 19 L32 24 Z" fill="#8a8a94"/>
<path d="M24 36 L32 24 L24 19 Z" fill="#00000022"/>
<circle cx="24" cy="26" r="4.6" fill="${v}"/>
<circle cx="22.6" cy="24.6" r="1.5" fill="#ffffffb8"/></svg>`,
    helmet: (v) => `<svg viewBox="0 0 48 48" class="wt-ico"><defs><linearGradient id="he${v.slice(1)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e0e0e8"/><stop offset="1" stop-color="#70707c"/></linearGradient></defs>
<path d="M11 26 C11 14 16 8 24 8 C32 8 37 14 37 26 L37 34 L31 34 L31 26 L28 26 L28 34 L20 34 L20 26 L17 26 L17 34 L11 34 Z" fill="url(#he${v.slice(1)})"/>
<path d="M24 8 C32 8 37 14 37 26 L37 34 L31 34 L31 26 L28 34 L24 34 Z" fill="#00000026"/>
<path d="M11 34 L17 34 L17 30 L11 30 Z" fill="#7a2c22"/>
<path d="M37 34 L31 34 L31 30 L37 30 Z" fill="#7a2c22"/>
<rect x="22.5" y="12" width="3" height="6" rx="1.4" fill="${v}"/></svg>`,
    shield: (v) => `<svg viewBox="0 0 48 48" class="wt-ico"><defs><linearGradient id="sh${v.slice(1)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dcdce4"/><stop offset="1" stop-color="#75757f"/></linearGradient></defs>
<path d="M24 4 L40 8 L40 24 C40 34 33 41 24 44 C15 41 8 34 8 24 L8 8 Z" fill="url(#sh${v.slice(1)})"/>
<path d="M24 4 L40 8 L40 24 C40 34 33 41 24 44 Z" fill="#00000026"/>
<path d="M22 4 L26 4 L26 44 L22 44 Z" fill="#7a2c22" opacity=".85"/>
<circle cx="24" cy="22" r="5.4" fill="#c9a24a"/><circle cx="24" cy="22" r="3" fill="${v}"/></svg>`,
    ring: (v) => `<svg viewBox="0 0 48 48" class="wt-ico">
<circle cx="24" cy="29" r="12" fill="none" stroke="#c9a24a" stroke-width="4.5"/>
<circle cx="24" cy="29" r="12" fill="none" stroke="#e8d18a" stroke-width="1.4"/>
<path d="M24 4 L30 10 L27 16 L21 16 L18 10 Z" fill="#c9a24a"/>
<path d="M21 16 L27 16 L26.2 19.5 L21.8 19.5 Z" fill="#a8863a"/>
<circle cx="24" cy="13.5" r="3.4" fill="${v}"/>
<circle cx="22.9" cy="12.4" r="1.1" fill="#ffffffcc"/></svg>`,
    gloves: (v) => `<svg viewBox="0 0 48 48" class="wt-ico"><defs><linearGradient id="gl${v.slice(1)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a5a30"/><stop offset="1" stop-color="#5b3a24"/></linearGradient></defs>
<path d="M15 20 L15 10 C15 7 18 6 19 9 L19 16 L29 16 L29 9 C30 6 33 7 33 10 L33 20 C35 24 36 30 34 36 C32 41 16 41 14 36 C12 30 13 24 15 20 Z" fill="url(#gl${v.slice(1)})"/>
<path d="M29 16 L29 9 C30 6 33 7 33 10 L33 20 C35 24 36 30 34 36 C32 41 29 41 29 41 Z" fill="#00000026"/>
<rect x="14" y="30" width="20" height="5" rx="2" fill="#c9a24a"/>
<circle cx="24" cy="32.5" r="1.8" fill="${v}"/></svg>`,
    belt: (v) => `<svg viewBox="0 0 48 48" class="wt-ico">
<rect x="6" y="19" width="36" height="10" rx="2" fill="#5b3a24"/>
<rect x="6" y="19" width="36" height="4" rx="2" fill="#8a5a30"/>
<rect x="19" y="17" width="10" height="14" rx="2" fill="#c9a24a"/>
<rect x="19" y="17" width="10" height="14" rx="2" fill="none" stroke="#a8863a" stroke-width="1.2"/>
<circle cx="24" cy="24" r="2.6" fill="${v}"/></svg>`,
    boots: (v) => `<svg viewBox="0 0 48 48" class="wt-ico"><defs><linearGradient id="bo${v.slice(1)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6e4a2c"/><stop offset="1" stop-color="#3d2817"/></linearGradient></defs>
<path d="M16 6 L28 6 L28 26 C30 30 34 32 38 34 L38 40 L12 40 L12 32 C13 26 15 12 16 6 Z" fill="url(#bo${v.slice(1)})"/>
<path d="M28 6 L28 26 C30 30 34 32 38 34 L38 40 L28 40 Z" fill="#00000026"/>
<rect x="12" y="35" width="26" height="5" rx="1.5" fill="#1f1610"/>
<rect x="17" y="8" width="4" height="26" rx="1.5" fill="${v}" opacity=".9"/></svg>`,
  }

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
  function attrJSON(it) { return esc(JSON.stringify(it)) }

  window.__wtInvAdd = function (item) {
    if (!item) return false
    const inv = loadInv()
    if (inv.length >= MAX_INV) return false
    inv.push(item)
    saveInv(inv)
    refresh()
    return true
  }

  const style = document.createElement('style')
  style.textContent = `
#gear-panel{display:none!important}
#charsheet{position:fixed;inset:0;z-index:120;display:none;align-items:center;justify-content:center;background:rgba(6,3,10,.8);font-family:Georgia,'Times New Roman',serif}
#charsheet.show{display:flex}
.cs-box{display:flex;gap:30px;background:#0d0815;border:1px solid #6b21a8;border-radius:10px;padding:26px 32px;box-shadow:0 0 46px rgba(168,85,247,.28)}
.cs-col{display:flex;flex-direction:column;align-items:center}
.cs-title{color:#e9d5ff;letter-spacing:.26em;font-size:15px;margin-bottom:4px;text-align:center;text-shadow:0 0 12px rgba(168,85,247,.4)}
.cs-sub{color:#71717a;font-size:12px;margin-bottom:12px;text-align:center;letter-spacing:.1em}
.doll{position:relative;width:310px;height:400px;background:radial-gradient(ellipse at 50% 40%,rgba(168,85,247,.11),transparent 70%);border:1px solid #2a1b3d;border-radius:10px}
.doll svg.body{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);opacity:.55}
.cs-slot{position:absolute;width:64px;height:64px;border:1px solid #3f2a55;border-radius:8px;background:rgba(20,12,32,.85);cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;text-align:center;transition:border-color .15s, box-shadow .15s}
.cs-slot:hover{border-color:#a855f7;box-shadow:0 0 12px rgba(168,85,247,.3)}
.cs-slot .lbl{font-size:9px;letter-spacing:.08em;color:#71717a;text-transform:uppercase}
.cs-slot .nm{font-size:9.5px;line-height:1.15;padding:0 3px;max-height:22px;overflow:hidden}
.cs-slot.locked{cursor:default;opacity:.55}
.cs-slot.locked:hover{border-color:#3f2a55;box-shadow:none}
.cs-slot.locked .lock{font-size:11px;color:#52525b}
.wt-ico{width:30px;height:30px;display:block;filter:drop-shadow(0 2px 3px rgba(0,0,0,.5))}
.cs-slot .wt-ico,.inv-cell .wt-ico{width:28px;height:28px}
.cs-totals{margin-top:12px;width:310px;color:#c4b5fd;font-size:12px;line-height:1.7;border-top:1px solid #2a1b3d;padding-top:10px;text-align:center;min-height:20px}
.inv-grid{display:grid;grid-template-columns:repeat(5,58px);grid-auto-rows:58px;gap:6px}
.inv-cell{border:1px solid #3f2a55;border-radius:6px;background:rgba(20,12,32,.85);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:border-color .15s;position:relative}
.inv-cell:hover{border-color:#a855f7;box-shadow:0 0 10px rgba(168,85,247,.25)}
.inv-cell[data-rare="true"]{border-color:#a16207;box-shadow:inset 0 0 10px rgba(251,191,36,.12)}
.inv-cell[data-uniq="true"]{border-color:#7e22ce;box-shadow:inset 0 0 12px rgba(168,85,247,.22)}
.inv-cell.empty{cursor:default}
.inv-cell.empty:hover{border-color:#3f2a55}
.cs-count{color:#71717a;font-size:11px;margin-top:10px}
.cs-gold{color:#fbbf24;font-size:13px;margin-top:6px;letter-spacing:.06em}
.cs-hint{color:#71717a;font-size:11px;margin-top:12px;text-align:center;line-height:1.7}
`
  document.head.appendChild(style)

  const root = document.createElement('div')
  root.id = 'charsheet'
  document.body.appendChild(root)

  let open = false

  // sloty lalki: prawdziwe (weapon/armor/charm) + dekoracyjne jak na klasycznej karcie
  const REAL = { weapon: 'Broń', armor: 'Zbroja', charm: 'Talizman' }
  const DOLL = [
    { key: 'helmet', label: 'Hełm', pos: 'left:123px;top:2px', icon: 'helmet' },
    { key: 'charm', label: 'Talizman', pos: 'left:8px;top:10px', icon: 'charm' },
    { key: 'ringL', label: 'Pierścień', pos: 'right:8px;top:10px', icon: 'ring' },
    { key: 'shield', label: 'Tarcza', pos: 'left:8px;top:100px', icon: 'shield' },
    { key: 'weapon', label: 'Broń', pos: 'right:8px;top:100px', icon: 'weapon' },
    { key: 'gloves', label: 'Rękawice', pos: 'left:8px;top:190px', icon: 'gloves' },
    { key: 'belt', label: 'Pas', pos: 'right:8px;top:190px', icon: 'belt' },
    { key: 'armor', label: 'Zbroja', pos: 'left:123px;top:196px', icon: 'armor' },
    { key: 'ringP', label: 'Pierścień', pos: 'left:8px;bottom:8px', icon: 'ring' },
    { key: 'boots', label: 'Buty', pos: 'right:8px;bottom:8px', icon: 'boots' },
  ]

  function itemIcon(it) { return ICONS[it.slot] ? ICONS[it.slot](GEM[it.rarity]) : '' }
  function goldStr() { const g = parseInt(localStorage.getItem('wt.gold') || '50', 10); return isNaN(g) ? 50 : g }

  function totalsHtml(L) {
    const t = L.totals
    const parts = []
    if (t.dmg) parts.push('+' + t.dmg + ' obrażeń')
    if (t.hp) parts.push('+' + t.hp + ' życia')
    if (t.speed) parts.push('+' + t.speed + '% szybk. ruchu')
    if (t.mana) parts.push('+' + t.mana + ' many')
    if (t.regen) parts.push('+' + t.regen + ' życia/s')
    return parts.length ? 'Premie: ' + parts.join(' · ') : 'Brak premii z ekwipunku'
  }

  function render() {
    const L = loot()
    if (!L) return
    const hero = window.__WT.heroState || window.__WT.hero || {}
    const inv = loadInv()

    let doll = '<div class="doll">'
    doll += '<svg class="body" width="130" height="240" viewBox="0 0 120 220"><g fill="none" stroke="#a855f7" stroke-width="3" stroke-linecap="round"><circle cx="60" cy="34" r="20"/><path d="M60 54 L60 60 M40 66 Q60 52 80 66 L76 130 Q60 138 44 130 L40 66 M60 62 L34 118 M60 62 L86 118 M60 132 L48 200 M60 132 L72 200"/></g></svg>'
    for (const d of DOLL) {
      const real = !!REAL[d.key]
      const it = real ? L.equipped[d.key] : null
      if (it) {
        doll += '<div class="cs-slot" data-slot="' + d.key + '" style="' + d.pos + '" data-wtitem="' + attrJSON(it) + '" draggable="true">' +
          itemIcon(it) + '<span class="nm" style="color:' + RAR[it.rarity] + '">' + esc(it.name) + '</span></div>'
      } else if (real) {
        doll += '<div class="cs-slot" data-slot="' + d.key + '" style="' + d.pos + '" title="' + d.label + ' — pusto">' +
          ICONS[d.icon]('#8b8b8b') + '<span class="lbl">' + d.label + '</span></div>'
      } else {
        doll += '<div class="cs-slot locked" style="' + d.pos + '" title="' + d.label + ' — ten typ wyposażenia nie jest używany w Wyrworze">' +
          ICONS[d.icon]('#4a4453') + '<span class="lock">🔒 ' + d.label + '</span></div>'
      }
    }
    doll += '</div><div class="cs-totals">' + totalsHtml(L) + '</div>'

    let grid = ''
    for (let i = 0; i < MAX_INV; i++) {
      const it = inv[i]
      if (it) {
        grid += '<div class="inv-cell" data-idx="' + i + '" data-rare="' + (it.rarity === 'rare') + '" data-uniq="' + (it.rarity === 'unique') + '" data-wtitem="' + attrJSON(it) + '" draggable="true">' + itemIcon(it) + '</div>'
      } else {
        grid += '<div class="inv-cell empty"></div>'
      }
    }

    root.innerHTML =
      '<div class="cs-box">' +
      '<div class="cs-col"><div class="cs-title">KARTA POSTACI</div><div class="cs-sub">poziom ' + (hero ? (hero.level || '?') : '?') + '</div>' + doll + '</div>' +
      '<div class="cs-col"><div class="cs-title">SAKWA</div><div class="cs-sub">plecak tropiciela</div><div class="inv-grid">' + grid + '</div><div class="cs-count">' + inv.length + ' / ' + MAX_INV + '</div>' +
      '<div class="cs-gold">🪙 ' + goldStr() + '</div>' +
      '<div class="cs-hint">LPM lub przeciągnij — załóż / zdejmij &middot; PPM — wyrzuć<br/>C lub I — otwórz / zamknij &middot; ESC — zamknij</div></div>' +
      '</div>'
  }

  function refresh() { if (open) render() }

  function equip(i) {
    const L = loot(); if (!L) return
    const inv = loadInv()
    const it = inv[i]; if (!it) return
    const old = L.equipped[it.slot]
    L.equipped[it.slot] = it
    saveGear(L)
    inv.splice(i, 1)
    if (old) inv.push(old)
    saveInv(inv)
    L.onEquip(L.totals, it.name.toUpperCase() + ' — założone')
    render()
  }
  function unequip(slot) {
    const L = loot(); if (!L) return
    const it = L.equipped[slot]; if (!it) return
    const inv = loadInv()
    if (inv.length >= MAX_INV) { L.onEquip(L.totals, 'Sakwa pełna!'); return }
    inv.push(it)
    saveInv(inv)
    L.equipped[slot] = null
    saveGear(L)
    L.onEquip(L.totals, it.name.toUpperCase() + ' — zdjęte')
    render()
  }
  function discard(i) {
    const inv = loadInv()
    if (inv[i]) { inv.splice(i, 1); saveInv(inv); render() }
  }

  root.addEventListener('click', (e) => {
    const cell = e.target.closest('.inv-cell[data-idx]')
    if (cell) { equip(Number(cell.dataset.idx)); return }
    const slot = e.target.closest('.cs-slot[data-slot]')
    if (slot) unequip(slot.dataset.slot)
  })
  root.addEventListener('contextmenu', (e) => {
    const cell = e.target.closest('.inv-cell[data-idx]')
    if (cell) { e.preventDefault(); discard(Number(cell.dataset.idx)) }
  })

  // ---- DRAG & DROP: przeciągnij przedmiot między sakwą a slotami lalki ----
  root.addEventListener('dragstart', (e) => {
    const cell = e.target.closest('.inv-cell[data-idx]')
    if (cell) { e.dataTransfer.setData('text/plain', 'inv:' + cell.dataset.idx); e.dataTransfer.effectAllowed = 'move'; return }
    const slot = e.target.closest('.cs-slot[data-slot]')
    if (slot) { e.dataTransfer.setData('text/plain', 'slot:' + slot.dataset.slot); e.dataTransfer.effectAllowed = 'move' }
  })
  root.addEventListener('dragover', (e) => {
    const t = e.target.closest('.cs-slot[data-slot], .inv-grid')
    if (t && !t.classList.contains('locked')) e.preventDefault()
  })
  root.addEventListener('drop', (e) => {
    e.preventDefault()
    const data = e.dataTransfer.getData('text/plain') || ''
    const [kind, id] = data.split(':')
    const slotEl = e.target.closest('.cs-slot[data-slot]')
    const gridEl = e.target.closest('.inv-grid')
    if (kind === 'inv' && slotEl) {
      const inv = loadInv()
      const it = inv[Number(id)]
      if (it && it.slot === slotEl.dataset.slot) equip(Number(id))
      else if (it) alert('To nie pasuje do slotu „' + (SLOT_PL[it.slot] || it.slot) + '”. Ten przedmiot zakłada się w slocie: ' + (SLOT_PL[it.slot] || it.slot) + '.')
    } else if (kind === 'slot' && gridEl) {
      unequip(id)
    }
  })

  function toggle(force) {
    if (!loot()) return
    open = typeof force === 'boolean' ? force : !open
    root.classList.toggle('show', open)
    if (open) render()
  }
  window.__wtCS = { toggle: toggle, isOpen: () => open, refresh: refresh }

  // ---- starter gear: tropiciel nie idzie na wrzosowisko bezbronnny ----
  function grantStarters(L) {
    if (localStorage.getItem('wt.starter')) return
    if (L.equipped.weapon || L.equipped.armor || L.equipped.charm) {
      try { localStorage.setItem('wt.starter', '1') } catch {}
      return
    }
    L.equipped.weapon = { slot: 'weapon', rarity: 'common', name: 'Wysłużone Ostrze Tropicielela', affixes: [{ stat: 'dmg', value: 12 }] }
    L.equipped.armor = { slot: 'armor', rarity: 'common', name: 'Wgięty Kirys Żarowarty', affixes: [{ stat: 'hp', value: 15 }] }
    L.equipped.charm = { slot: 'charm', rarity: 'common', name: 'Zwykły Talizman Straży', affixes: [{ stat: 'mana', value: 8 }] }
    saveGear(L)
    try { localStorage.setItem('wt.starter', '1') } catch {}
    L.onEquip(L.totals, 'WYPOSAŻENIE STARTOWE — tak się zaczyna łowy')
    refresh()
  }
  let bootTries = 0
  const bootTimer = setInterval(() => {
    const L = loot()
    if (L) { clearInterval(bootTimer); grantStarters(L) }
    else if (++bootTries > 300) clearInterval(bootTimer)
  }, 100)

  window.addEventListener('keydown', (e) => {
    if (e.repeat) return
    if (window.__wtTitleActive && window.__wtTitleActive()) return
    if (e.code === 'KeyC' || e.code === 'KeyI') { if (loot()) { e.preventDefault(); toggle() } }
    else if (e.code === 'Escape' && open) toggle(false)
  })
})()
