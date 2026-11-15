#!/usr/bin/env python3
"""Spaja index.html, CSS i JS u jednu samostalnu datoteku (za slanje e-poštom ili pregled bez servera).
Upotreba: python3 tools/build_single.py [izlaz.html]"""
import pathlib, sys
r = pathlib.Path(__file__).resolve().parent.parent
t = lambda p: (r / p).read_text(encoding="utf-8")
h = t("index.html")
h = h.replace('<link rel="stylesheet" href="assets/css/style.css">', "<style>" + t("assets/css/style.css") + "</style>")
h = h.replace('<script src="assets/js/three.min.js" defer></script>', "<script>" + t("assets/js/three.min.js") + "</script>")
h = h.replace('<script src="assets/js/app.js" defer></script>', "<script>" + t("assets/js/app.js") + "</script>")
h = h.replace('<link rel="icon" type="image/svg+xml" href="assets/img/mark.svg">', "").replace('<meta property="og:image" content="assets/img/og.png">', "")
out = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else r / "ardor-namjestaj-single.html")
out.write_text(h, encoding="utf-8")
print(out, len(h))
