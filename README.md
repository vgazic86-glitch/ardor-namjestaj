# Ardor namještaj — web stranica

Nova stranica salona namještaja **Ardor** (Banja Luka): 3D pregled proizvoda, konfigurator po mjeri, planer sobe, vizualizator na fotografiji, stilski kviz i virtuelni obilazak salona.

Stranica je statična (HTML + CSS + JavaScript), bez koraka izgradnje i bez servera, pa se može objaviti direktno na GitHub Pages.

## Objava na GitHub Pages

1. Na GitHubu napravite novi prazan repozitorij (npr. `ardor-namjestaj`).
2. Učitajte sadržaj ove mape u granu `main`:
   ```bash
   git remote add origin https://github.com/KORISNIK/ardor-namjestaj.git
   git push -u origin main
   ```
   Bez gita: na stranici repozitorija odaberite **Add file → Upload files** i prevucite sve datoteke i mape (uključujući skrivenu mapu `.github`).
3. U repozitoriju otvorite **Settings → Pages** i pod **Source** odaberite **GitHub Actions**.
4. Nakon sljedećeg `push`-a (ili ručno: **Actions → Objava na GitHub Pages → Run workflow**) stranica je dostupna na `https://KORISNIK.github.io/ardor-namjestaj/`.

Vlastita domena (npr. `ardornamjestaj.com`): u **Settings → Pages → Custom domain** upišite domenu i kod registrara postavite DNS zapise prema GitHubovim uputama. Dok se to ne uradi, postojeća stranica na domeni ostaje netaknuta.

## Pokretanje na računaru

```bash
python3 -m http.server 8000
# zatim otvorite http://localhost:8000
```

Jedna samostalna datoteka (za slanje e-poštom ili pregled bez servera):

```bash
python3 tools/build_single.py
```

## Struktura

| Putanja | Sadržaj |
| --- | --- |
| `index.html` | Sav sadržaj i struktura stranice |
| `assets/css/style.css` | Izgled, svijetli i tamni način, responzivnost |
| `assets/js/app.js` | 3D scene, konfigurator, planer, vizualizator, kviz, asistent |
| `assets/js/three.min.js` | Three.js r160 (MIT licenca, vidi `three.LICENSE.txt`) |
| `assets/img/` | Logotip, znak (favicon) i slika za dijeljenje na mrežama |
| `tools/build_single.py` | Spajanje u jednu HTML datoteku |
| `.github/workflows/pages.yml` | Automatska objava na GitHub Pages |

## Vizuelni identitet

Dizajn prati Knjigu grafičkih standarda (ARDOR_KGS, 2019):

| Element | Vrijednost |
| --- | --- |
| Ardor narandžasta | `#f15a29` (R241 G90 B42) |
| Ardor žuta | `#f79328` (R247 G147 B40) |
| Ardor siva | `#58595b` (R88 G89 B91) |
| Tipografija | Ubuntu (Light, Regular, Medium, Bold), bez kurziva |
| Logotip | Originalni vektor iz knjige standarda; u tamnom načinu negativ (bijeli) |
| Oblici | Kvadrat s dvije zaobljene i dvije oštre ivice, preuzet iz znaka |
| Slogan | „Namještaj za svačiji džep” |

Boje su definisane kao CSS varijable na vrhu `style.css`.

## Prije javne objave — obavezno zamijeniti

Sljedeće je ilustrativno i služi samo za prikaz funkcionalnosti:

- **Nazivi modela, cijene, formule za okvirnu cijenu i dostupnost** (`const P` i `cfPrice` u `app.js`).
- **3D modeli** su pojednostavljeni i nacrtani kodom; nisu stvarni proizvodi.
- **Recenzije** su prazni predlošci označeni kao „Primjer prikaza” — unijeti stvarne recenzije kupaca.
- **Blog kartice** nemaju članke iza sebe.

Stvarni podaci preuzeti s postojeće stranice: adresa, telefoni, e-pošta, radno vrijeme, uslovi Addiko Partner kredita i društvene mreže.

## Šta još nije spojeno

- **Asistent** odgovara po ključnim riječima; nije spojen na AI model.
- **Vizualizator sobe** analizira boje fotografije u pregledniku i postavlja 3D prikaz preko slike; ne generiše fotorealističnu sliku. Fotografija ne napušta uređaj korisnika.
- **WebAR** traži GLB/USDZ modele stvarnih proizvoda; dugme za sada otvara objašnjenje.
- **Kontakt obrazac** otvara program za e-poštu (`mailto:`); nema server koji prima upite.

## Prava

Logotip i vizuelni identitet vlasništvo su ARDOR NAMJEŠTAJ D.O.O. Repozitorij nema otvorenu licencu: kod stranice nije namijenjen daljoj upotrebi bez dozvole vlasnika.
