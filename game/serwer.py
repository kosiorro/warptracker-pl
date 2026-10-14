#!/usr/bin/env python3
# Warptracker PL — serwer deweloperski z API zapisu dla panelu admina.
# Zamiast: python3 -m http.server 8080  →  python3 serwer.py
# Serwuje grę ORAZ pozwala panelowi admina (admin.html) zapisywać pliki gry:
# bazę (data/gamedata.json) i kod (assets/*.js, *.html).
import json, os, re, sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080

# dozwolone miejsca zapisu (względem game/): baza, kod, style, html
ALLOW = re.compile(r'^(data|assets|mods)/[A-Za-z0-9_\-./]+\.(json|js|html|css|txt)$|^[A-Za-z0-9_\-]+\.(html|txt|json|js|css|sh|bat|md)$')

class DevHandler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def log_message(self, fmt, *args):
        sys.stderr.write("[wt] %s\n" % (fmt % args))

    # --- API ---
    def _json(self, code, obj):
        body = json.dumps(obj).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path.split('?')[0] == '/api/ping':
            return self._json(200, { 'ok': True, 'server': 'wt-dev' })
        return super().do_GET()

    def do_POST(self):
        if self.path.split('?')[0] != '/api/save':
            return self._json(404, { 'ok': False, 'error': 'nieznany endpoint' })
        try:
            n = int(self.headers.get('Content-Length', 0))
            req = json.loads(self.rfile.read(n).decode('utf-8'))
            path = req.get('path', '')
            content = req.get('content', '')
            if not isinstance(path, str) or not isinstance(content, str):
                raise ValueError('złe typy pól')
            if '..' in path or path.startswith('/'):
                raise ValueError('ścieżka poza game/')
            if not ALLOW.match(path):
                raise ValueError('ten plik nie podlega edycji z panelu: ' + path)
            full = os.path.join(ROOT, path)
            os.makedirs(os.path.dirname(full), exist_ok=True)
            with open(full, 'w', encoding='utf-8', newline='') as f:
                f.write(content)
            return self._json(200, { 'ok': True, 'saved': path, 'bytes': len(content) })
        except Exception as e:
            return self._json(400, { 'ok': False, 'error': str(e) })

if __name__ == '__main__':
    print(f"[wt] serwer gry + API admina: http://localhost:{PORT}  (panel: /admin.html)")
    ThreadingHTTPServer(('', PORT), DevHandler).serve_forever()
