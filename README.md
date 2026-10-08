# eventur

Statisk site for **eventur** – udflugt, eventyr, sammenhold, læring og fællesskab i
naturen. Vi sover i telthængekøjer, løber natteløb, skyder med luftgevær og spiller
bow combat. eventur er arvtageren efter foreningen Foretagsomheden og Skarresø
Festival – Danmarks Byggefestival.

Sitet er bygget med [Vite](https://vite.dev) og hostes som rene filer. Der er ingen
skabelon, ingen jQuery og ingen ikonfonte – alt design og al JavaScript er skrevet
til projektet.

## Kom i gang

```bash
npm install
npm run dev      # udviklingsserver på http://localhost:3000
npm run build    # produktionsbuild til dist/
npm run preview  # serverer det byggede site
```

Kræver Node 18+ (testet med Node 24).

## Sådan er det bygget

```
index.html, ture.html, galleri.html, …   Sider (indgange for Vite)
blog/                                    Blogoversigt + artikler
src/partials/                            Delte HTML-fragmenter (head, header, footer, cta, …)
public/assets/css/site.css               Hele designsystemet
public/assets/js/main.js                 Menu, lysboks, galleri-filtre, formularer, afsløring
public/assets/img/arkiv/                 Billeder fra Foretagsomhedens arkiv
public/assets/img/folk/                  Portrætter af værter og gæster
public/assets/video/                     Video til Historien-siden
tools/vite-plugin-html-includes.js       Lille plugin, der samler partials
vite.config.js                           Flersidet (MPA) opsætning
```

### Partials

Siderne gentager ikke header, footer eller sektioner. I stedet inkluderes
fragmenter med en kommentar, og Vite udskifter dem ved build og i dev-serveren:

```html
<!-- @include "src/partials/head.html" { "title": "Galleri", "description": "…", "section": "galleri" } -->
<!-- @include "src/partials/header.html" -->
<!-- @include "src/partials/page-hero.html" { "title": "…", "crumb": "…", "lead": "…", "image": "/assets/img/arkiv/…" } -->
```

Variabler indsættes med `{{navn}}`, og inkluderinger kan nestes.

### Design

Udtrykket er en ekspeditionsjournal: skovgrøn, bålglød og pergament, polaroids med
håndskrevne noter – i samme ånd som de håndmalede skilte fra Skarresø. Farver,
skrifter og afstande er tokens øverst i `site.css`. Skrifterne er Fraunces
(overskrifter), Instrument Sans (brødtekst) og Caveat (håndskrift) fra Google Fonts.

- Elementer med klassen `afsloer` glider ind, når de kommer i viewport
  (`--forsink` styrer forsinkelsen). Uden JavaScript eller med reduceret
  bevægelse vises alt med det samme.
- Links med `data-lysboks="gruppe"` åbner i lysboksen; `data-note` bliver billedtekst.
  `data-video="/sti.mp4"` åbner en video.
- Formularer med `data-mailto-form="adresse"` validerer og åbner brugerens mailklient.

### Billeder

Billederne stammer fra Foretagsomhedens Facebook-arkiv (Skarresø Festival) og er
skaleret til maks. 1600 px. Bow combat har endnu ingen billeder – kortet bruger en
illustration (`src/partials/bow-illu.html`), indtil de første kampe er fotograferet.

## Indhold

Teksterne er skrevet på dansk og bygger på Foretagsomhedens historie og eventurs
fire aktiviteter. Priser og værter er overført fra den tidligere side.

Kontaktoplysninger (adresse, telefon, e-mail) og links til sociale medier er
**pladsholdere** og skal erstattes med de rigtige inden en rigtig udgivelse.

## Udgivelse

`npm run build` lægger et komplet statisk site i `dist/`. Det kan lægges på enhver
statisk host, CDN eller Cloudflare Workers/Pages – der er ingen serverkode, men
formularerne åbner brugerens e-mailklient, da der ikke er et backend.

### Automatisk udgivelse til www.foretagsomheden.dk

Hvert push til `main` bygger sitet og uploader `dist/` til webhotellet hos
Simply.com via FTPS (`.github/workflows/deploy.yml`). Workflowet kan også startes
manuelt under **Actions → Udgiv til foretagsomheden.dk → Run workflow**.

Det kræver tre repository secrets (Settings → Secrets and variables → Actions):

| Secret         | Værdi                                              |
| -------------- | -------------------------------------------------- |
| `FTP_SERVER`   | FTP-serveren fra Simply.com-kontrolpanelet         |
| `FTP_USERNAME` | FTP-brugernavn                                     |
| `FTP_PASSWORD` | FTP-adgangskode                                    |

Filerne lægges i mappen `foretagsomheden/` i roden af FTP-kontoen (webroden for
foretagsomheden.dk). Bemærk: `public_html/` er webroden for villadsclaes.dk. Mappen
kan ændres med repository-variablen `FTP_SERVER_DIR` (med afsluttende `/`).

`public/web.config` sætter IIS op med `index.html` som startside og `404.html`
som fejlside.
