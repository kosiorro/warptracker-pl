#!/usr/bin/env python3
# Wyrwor PL — generator dźwięków UI + ambientu.
# Produkuje game/assets/sfx.js (base64 WAV-y, ładowane przez bridge.js → Howler).
# Uruchomienie: python3 game/tools/gen-sfx.py
import wave, struct, math, os, random, base64, io

random.seed(20261014)
SR = 22050

def render(samples, sr=SR):
    peak = max(abs(s) for s in samples) or 1.0
    buf = io.BytesIO()
    with wave.open(buf, 'w') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes(b''.join(struct.pack('<h', int(max(-1, min(1, s/peak*0.85))*32767)) for s in samples))
    return base64.b64encode(buf.getvalue()).decode()

def tone(freq, dur, amp=1.0, decay=6.0):
    n = int(dur*SR)
    return [amp*math.sin(2*math.pi*freq*(i/SR))*math.exp(-decay*(i/SR)) for i in range(n)]

def mix(*parts):
    n = max(len(p) for p in parts)
    return [sum(p[i] if i < len(p) else 0 for p in parts) for i in range(n)]

def delayed(part, sec):
    return [0.0]*int(sec*SR) + list(part)

def ambient():
    D, ASR = 12.0, 16000
    n = int(D*ASR); out = []; lp = 0.0
    phases = {8: 0.0, 9: 1.3, 16: 2.1, 25: 0.7, 51: 4.0}
    for i in range(n):
        t = i/ASR
        v = 0.0
        for k, amp in [(8,.5),(9,.35),(16,.22),(25,.10),(51,.05)]:
            v += amp*math.sin(2*math.pi*(k/D)*t + phases[k])
        env = (0.5 - 0.5*math.cos(2*math.pi*t/D))**1.5
        lp += 0.02*(random.uniform(-1, 1) - lp)
        out.append(v*0.16 + lp*0.8*env)
    return out, ASR

SFX = {}
amb, asr = ambient()
SFX['ambient'] = render(amb, asr)
SFX['buy']  = render(mix(tone(880,.35,.5), tone(1318,.4,.4), delayed(tone(1318,.35,.45),.09)))
SFX['sell'] = render(mix(tone(660,.25,.5), tone(880,.3,.45)))
SFX['save'] = render(mix(tone(523,.4,.5), delayed(tone(784,.55,.5),.16)))
SFX['load'] = render(mix(tone(784,.4,.5), delayed(tone(523,.55,.5),.16)))

out = "// Wyrwor PL — dźwięki UI + ambient (base64 WAV). Wygenerowane przez tools/gen-sfx.py — nie edytuj ręcznie.\n"
out += "window.__wtSfxB64 = {\n"
for k, v in SFX.items():
    out += "  %s: '%s',\n" % (k, v)
out += "}\n"
path = os.path.join(os.path.dirname(__file__), '..', 'assets', 'sfx.js')
with open(path, 'w') as f:
    f.write(out)
print('sfx.js:', {k: len(v)//1024 for k, v in SFX.items()}, 'KB (b64)')
