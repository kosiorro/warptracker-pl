// Warptracker PL — loader: składa bundle gry z części (assets/parts/).
// Repozytorium trzyma kod w małych plikach; tu sklejamy je w jeden moduł.
(async function () {
  // --- fallback modeli 3D: gdy models/*.glb zwraca 404, sklejamy je z base64+gzip
  // zapisanych w repo (models/b64/*.NNN.b64). Dzięki temu gra działa od razu po git clone.
  var origFetch = window.fetch.bind(window);
  window.fetch = function (u, o) {
    var m = typeof u === 'string' ? u.match(/models\/([a-z]+)\.glb$/) : null;
    if (!m) return origFetch(u, o);
    return origFetch(u, o).then(function (res) {
      if (res.ok) return res;
      return (async function () {
        var chunks = [];
        for (var i = 1; ; i++) {
          var id = ('00' + i).slice(-3);
          var r = await origFetch('models/b64/' + m[1] + '.' + id + '.b64');
          if (!r.ok) break;
          chunks.push(await r.text());
        }
        if (!chunks.length) return res; // brak fallbacku — pokaż oryginalny 404
        var bin = atob(chunks.join(''));
        var bytes = new Uint8Array(bin.length);
        for (var j = 0; j < bin.length; j++) bytes[j] = bin.charCodeAt(j);
        var stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
        return new Response(stream, { headers: { 'Content-Type': 'application/octet-stream' } });
      })();
    });
  };

  var N = 12;
  var parts = [];
  for (var i = 1; i <= N; i++) {
    var id = (i < 10 ? '0' : '') + i;
    var res = await fetch('assets/parts/p' + id + '.js');
    if (!res.ok) throw new Error('brak części bundle: p' + id);
    parts.push(await res.text());
  }
  var blob = new Blob([parts.join('')], { type: 'text/javascript' });
  var url = URL.createObjectURL(blob);
  var m = await import(url);
  URL.revokeObjectURL(url);
  // odpowiednik modułu debug gry: THREE + instantiate + findBone
  window.__WTdebug = { THREE: m.r, instantiate: m.n, findBone: m.t };
  // panel admina (P): baza przedmiotów + podgląd 3D — osobny moduł
  var V = 'v13'; // wersja modułów PL — podbij po każdej zmianie, łamie cache przeglądarki
  await import(new URL('admin.js?' + V, import.meta.url).href);
  // mostek dla osobnej strony admina (admin.html): nadpisania dialogów + live-sync
  await import(new URL('bridge.js?' + V, import.meta.url).href);
  // karta postaci (papierowa lalka) + sakwa — C lub I
  await import(new URL('charsheet.js?' + V, import.meta.url).href);
})().catch(function (e) {
  console.error('wt-pl loader:', e);
  var st = document.getElementById('loading-status');
  if (st) st.textContent = 'błąd ładowania gry: ' + e.message;
});
