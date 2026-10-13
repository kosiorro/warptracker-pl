// Warptracker PL — loader: składa bundle gry z części (assets/parts/).
// Repozytorium trzyma kod w małych plikach; tu sklejamy je w jeden moduł.
(async function () {
  var N = 12;
  var parts = [];
  for (var i = 1; i <= N; i++) {
    var id = (i < 10 ? '0' : '') + i;
    var res = await fetch('assets/parts/p' + id + '.js');
    if (!res.ok) throw new Error('brak części bundle: p' + id);
    parts.push(await res.text());
  }
  var blob = new Blob([parts.join('\n')], { type: 'text/javascript' });
  var url = URL.createObjectURL(blob);
  var m = await import(url);
  URL.revokeObjectURL(url);
  // odpowiednik modułu debug gry: THREE + instantiate + findBone
  window.__WTdebug = { THREE: m.r, instantiate: m.n, findBone: m.t };
})().catch(function (e) {
  console.error('wt-pl loader:', e);
  var st = document.getElementById('loading-status');
  if (st) st.textContent = 'błąd ładowania gry: ' + e.message;
});
