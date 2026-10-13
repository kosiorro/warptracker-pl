// ===== Warptracker PL: karta postaci + sakwa — wersja z ikonami SVG =====
;(function () {
  const RAR = { common: '#d6d3d1', magic: '#60a5fa', rare: '#fde047', unique: '#c084fc' }
  const GEM = { common: '#8b8b8b', magic: '#60a5fa', rare: '#fbbf24', unique: '#c084fc' }
  const RAR_PL = { common: 'zwykły', magic: 'magiczny', rare: 'rzadki', unique: 'unikat' }
  const SLOT_PL = { weapon: 'Broń', armor: 'Zbroja', charm: 'Talizman' }
  const STAT_PL = { dmg: 'obrażeń', hp: 'życia', speed: 'szybk. ruchu', mana: 'many', regen: 'życia/s' }
  const MAX_INV = 20
  const KEY = 'wt.inv'

  // ---- hand-drawn SVG icons (steel + red cloth, after the uploaded sheets) ----
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
    potion: (v) => `<svg viewBox="0 0 48 48" class="wt-ico">
<rect x="19" y="4" width="10" height="6" rx="2" fill="#8a5a30"/>
<rect x="18" y="9" width="12" height="3" rx="1.4" fill="#9aa0aa"/>
<path d="M20 11 L20 17 C14 21 12 27 12 32 C12 40 17 44 24 44 C31 44 36 40 36 32 C36 27 34 21 28 17 L28 11 Z" fill="#cfe2ee" opacity=".45"/>
<path d="M14.5 30 C14 36 18 41 24 41 C30 41 34 36 33.5 30 C30 32 26 29 24 26 C21 30 17 31.5 14.5 30 Z" fill="${v}"/>
<path d="M20 11 L20 17 C14 21 12 27 12 32" fill="none" stroke="#ffffff70" stroke-width="1.6"/></svg>`,
    ring: (v) => `<svg viewBox="0 0 48 48" class="wt-ico">
<circle cx="24" cy="29" r="12" fill="none" stroke="#c9a24a" stroke-width="4.5"/>
<circle cx="24" cy="29" r="12" fill="none" stroke="#e8d18a" stroke-width="1.4"/>
<path d="M24 4 L30 10 L27 16 L21 16 L18 10 Z" fill="#c9a24a"/>
<path d="M21 16 L27 16 L26.2 19.5 L21.8 19.5 Z" fill="#a8863a"/>
<circle cx="24" cy="13.5" r="3.4" fill="${v}"/>
<circle cx="22.9" cy="12.4" r="1.1" fill="#ffffffcc"/></svg>`,
    helmet: (v) => `<svg viewBox="0 0 48 48" class="wt-ico"><defs><linearGradient id="he${v.slice(1)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e0e0e8"/><stop offset="1" stop-color="#70707c"/></linearGradient></defs>
<path d="M11 26 C11 14 16 8 24 8 C32 8 37 14 37 26 L37 34 L31 34 L31 26 L28 26 L28 34 L20 34 L20 26 L17 26 L17 34 L11 34 Z" fill="url(#he${v.slice(1)})"/>
<path d="M24 8 C32 8 37 14 37 26 L37 34 L31 34 L31 26 L28 26 L28 34 L24 34 Z" fill="#00000026"/>
<path d="M11 34 L17 34 L17 30 L11 30 Z" fill="#7a2c22"/>
<path d="M37 34 L31 34 L31 30 L37 30 Z" fill="#7a2c22"/>
<rect x="22.5" y="12" width="3" height="6" rx="1.4" fill="${v}"/></svg>`,
    shield: (v) => `<svg viewBox="0 0 48 48" class="wt-ico"><defs><linearGradient id="sh${v.slice(1)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dcdce4"/><stop offset="1" stop-color="#75757f"/></linearGradient></defs>
<path d="M24 4 L40 8 L40 24 C40 34 33 41 24 44 C15 41 8 34 8 24 L8 8 Z" fill="url(#sh${v.slice(1)})"/>
<path d="M24 4 L40 8 L40 24 C40 34 33 41 24 44 Z" fill="#00000026"/>
<path d="M22 4 L26 4 L26 44 L22 44 Z" fill="#7a2c22" opacity=".85"/>
<circle cx="24" cy="22" r="5.4" fill="#c9a24a"/><circle cx="24" cy="22" r="3" fill="${v}"/></svg>`,
  }

  function loadInv() {
    try {
      const a = JSON.parse(localStorage.getItem(KEY) || '[]')
      return Array.isArray(a) ? a.slice(0, MAX_INV) : []
    } catch {
      return []
    }
  }
  function saveInv(a) {
    try { localStorage.setItem(KEY, JSON.stringify(a)) } catch {}
  }
  function saveGear(L) {
    try { localStorage.setItem('wt.gear', JSON.stringify(L.equipped)) } catch {}
  }
  function loot() { return window.__WT && window.__WT.loot }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') }

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
#charsheet{position:fixed;inset:0;z-index:120;display:none;align-items:center;justify-content:center;background:rgba(6,3,10,.78);font-family:Georgia,'Times New Roman',serif}
#charsheet.show{display:flex}
.cs-box{display:flex;gap:28px;background:#0d0815;border:1px solid #6b21a8;border-radius:10px;padding:26px 30px;box-shadow:0 0 46px rgba(168,85,247,.28)}
.cs-col{display:flex;flex-direction:column;align-items:center}
.cs-title{color:#e9d5ff;letter-spacing:.24em;font-size:15px;margin-bottom:4px;text-align:center}
.cs-sub{color:#71717a;font-size:12px;margin-bottom:14px;text-align:center}
.doll{position:relative;width:250px;height:320px;background:radial-gradient(ellipse at 50% 42%,rgba(168,85,247,.09),transparent 68%);border:1px solid #2a1b3d;border-radius:10px}
.doll svg.body{position:absolute;left:50%;top:50%;transform:translate(-50%,-52%);opacity:.5}
.cs-slot{position:absolute;width:64px;height:64px;border:1px solid #3f2a55;border-radius:8px;background:rgba(20,12,32,.85);cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;text-align:center;transition:border-color .15s}
.cs-slot:hover{border-color:#a855f7}
.cs-slot .lbl{font-size:9.5px;letter-spacing:.1em;color:#71717a;text-transform:uppercase}
.cs-slot .nm{font-size:10px;line-height:1.15;padding:0 4px;max-height:22px;overflow:hidden}
.wt-ico{width:30px;height:30px;display:block;filter:drop-shadow(0 2px 3px rgba(0,0,0,.5))}
.inv-cell .wt-ico{width:26px;height:26px}
.cs-totals{margin-top:14px;width:250px;color:#c4b5fd;font-size:12px;line-height:1.7;border-top:1px solid #2a1b3d;padding-top:10px;text-align:center;min-height:20px}
.inv-grid{display:grid;grid-template-columns:repeat(5,58px);grid-auto-rows:58px;gap:6px}
.inv-cell{border:1px solid #3f2a55;border-radius:6px;background:rgba(20,12,32,.85);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:20px;transition:border-color .15s;position:relative}
.inv-cell:hover{border-color:#a855f7}
.inv-cell[data-rare="true"]{border-color:#a16207;box-shadow:inset 0 0 10px rgba(251,191,36,.12)}
.inv-cell[data-uniq="true"]{border-color:#7e22ce;box-shadow:inset 0 0 12px rgba(168,85,247,.22)}
.inv-cell.empty{cursor:default}
.inv-cell.empty:hover{border-color:#3f2a55}
.cs-count{color:#71717a;font-size:11px;margin-top:10px}
.cs-hint{color:#71717a;font-size:11px;margin-top:14px;text-align:center;line-height:1.7}
`
  document.head.appendChild(style)

  const root = document.createElement('div')
  root.id = 'charsheet'
  document.body.appendChild(root)

  let open = false

  function affixLine(a) {
    if (a.stat === 'speed') return '+' + a.value + '% ' + STAT_PL.speed
    return '+' + a.value + ' ' + STAT_PL[a.stat]
  }
  function itemTitle(it) {
    return (it.name + ' [' + RAR_PL[it.rarity] + ']\n' + it.affixes.map(affixLine).join('\n'))
  }
  function itemIcon(it) { return ICONS[it.slot] ? ICONS[it.slot](GEM[it.rarity]) : '' }
  function slotIcon(s) { return ICONS[s]('#8b8b8b') }

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
    const hero = window.__WT.hero
    const inv = loadInv()
    const slots = ['charm', 'armor', 'weapon']
    const pos = { charm: 'left:93px;top:8px', armor: 'left:16px;top:190px', weapon: 'right:16px;top:190px' }

    let doll = '<div class="doll">'
    doll += '<svg class="body" width="120" height="220" viewBox="0 0 120 220"><g fill="none" stroke="#a855f7" stroke-width="3" stroke-linecap="round"><circle cx="60" cy="34" r="20"/><path d="M60 54 L60 60 M40 66 Q60 52 80 66 L76 130 Q60 138 44 130 L40 66 M60 62 L34 118 M60 62 L86 118 M60 132 L48 200 M60 132 L72 200"/></g></svg>'
    for (const s of slots) {
      const it = L.equipped[s]
      const tip = it ? esc(itemTitle(it)).replace(/\n/g, '&#10;') : SLOT_PL[s] + ' — pusto'
      doll += '<div class="cs-slot" data-slot="' + s + '" style="' + pos[s] + '" title="' + tip + '">'
      if (it) {
        doll += itemIcon(it) + '<span class="nm" style="color:' + RAR[it.rarity] + '">' + esc(it.name) + '</span>'
      } else {
        doll += slotIcon(s) + '<span class="lbl">' + SLOT_PL[s] + '</span>'
      }
      doll += '</div>'
    }
    doll += '</div><div class="cs-totals">' + totalsHtml(L) + '</div>'

    let grid = ''
    for (let i = 0; i < MAX_INV; i++) {
      const it = inv[i]
      if (it) {
        const tip = esc(itemTitle(it)).replace(/\n/g, '&#10;')
        grid += '<div class="inv-cell" data-idx="' + i + '" data-rare="' + (it.rarity === 'rare') + '" data-uniq="' + (it.rarity === 'unique') + '" title="' + tip + '">' + itemIcon(it) + '</div>'
      } else {
        grid += '<div class="inv-cell empty"></div>'
      }
    }

    root.innerHTML =
      '<div class="cs-box">' +
      '<div class="cs-col"><div class="cs-title">KARTA POSTACI</div><div class="cs-sub">poziom ' + (hero ? hero.level : '?') + '</div>' + doll + '</div>' +
      '<div class="cs-col"><div class="cs-title">SAKWA</div><div class="cs-sub">plecak tropiciela</div><div class="inv-grid">' + grid + '</div><div class="cs-count">' + inv.length + ' / ' + MAX_INV + '</div>' +
      '<div class="cs-hint">LPM — załóż / zdejmij &middot; PPM — wyrzuć<br/>C lub I — otwórz / zamknij &middot; ESC — zamknij</div></div>' +
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
    const slot = e.target.closest('.cs-slot')
    if (slot) unequip(slot.dataset.slot)
  })
  root.addEventListener('contextmenu', (e) => {
    const cell = e.target.closest('.inv-cell[data-idx]')
    if (cell) { e.preventDefault(); discard(Number(cell.dataset.idx)) }
  })

  function toggle(force) {
    if (!loot()) return
    open = typeof force === 'boolean' ? force : !open
    root.classList.toggle('show', open)
    if (open) render()
  }

  // ---- starter gear: a Tracker never walks into the moor unarmed ----
  function grantStarters(L) {
    if (localStorage.getItem('wt.starter')) return
    if (L.equipped.weapon || L.equipped.armor || L.equipped.charm) {
      try { localStorage.setItem('wt.starter', '1') } catch {}
      return
    }
    L.equipped.weapon = { slot: 'weapon', rarity: 'common', name: 'Wysłużony Ostrze Tropicielela', affixes: [{ stat: 'dmg', value: 12 }] }
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
    if (e.code === 'KeyC' || e.code === 'KeyI') { if (loot()) { e.preventDefault(); toggle() } }
    else if (e.code === 'Escape' && open) toggle(false)
  })
})()