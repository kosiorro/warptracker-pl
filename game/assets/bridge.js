// ===== Warptracker PL: mostek panelu admina (admin.html) =====
// Czyta nadpisania z localStorage (wspólne z osobną stroną admina)
// i nasłuchuje kanału BroadcastChannel, żeby zmiany wchodziły bez odświeżania gry.
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

  // hook używany przez spatchowany bundle (getDialogue)
  window.__wtDlgOv = function (npcId) {
    var ov = readDialogs()[npcId]
    if (!ov || !ov.enabled || !Array.isArray(ov.lines) || !ov.lines.length) return null
    return {
      name: ov.name || DEFAULT_NAMES[npcId] || npcId,
      lines: ov.lines.filter(function (l) { return typeof l === 'string' && l.trim() })
    }
  }

  // live-sync z osobną stroną admina
  try {
    var ch = new BroadcastChannel('wt-admin')
    ch.onmessage = function (ev) {
      var d = ev.data || {}
      if (d.type === 'ping') {
        ch.postMessage({ type: 'pong', game: true })
      }
      // reszta (dialogi) czytana jest na żywo z localStorage — nic więcej nie trzeba
    }
  } catch (e) {}
})()
