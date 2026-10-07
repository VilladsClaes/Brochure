# Eventur

Statisk brochureside for **Eventur – event og ture i naturen**.

Siden var oprindeligt et ASP.NET MVC 5-projekt (.NET Framework 4.8), der var
halvt konverteret fra et Colorlib-skabelon. Det er nu genskrevet som et moderne,
statisk site uden server-afhængigheder: al indhold ligger i HTML, bygget med
[Vite](https://vite.dev) og hostes som rene filer.

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
index.html, om.html, ture.html, …   Sider (indgange for Vite)
blog/                               Blogoversigt + artikler
src/
  partials/                         Delte HTML-fragmenter (head, nav, footer, sektioner)
public/
  assets/                           Temaets CSS, JS, skrifter og billeder
  favicon.ico
tools/vite-plugin-html-includes.js  Lille plugin, der samler partials
vite.config.js                      Flersidet (MPA) opsætning
theme/                              Skabelonens oprindelige SCSS/Bootstrap-kilder (bruges ikke i build)
```

### Partials

Siderne gentager ikke header, footer eller sektioner. I stedet inkluderes
fragmenter med en kommentar, og Vite udskifter dem ved build og i dev-serveren:

```html
<!-- @include "src/partials/head.html" { "title": "Ture", "description": "…", "section": "ture" } -->
<!-- @include "src/partials/nav.html" -->
```

Variabler indsættes med `{{navn}}`, og inkluderinger kan nestes. Pluginnet ligger i
`tools/vite-plugin-html-includes.js`.

### JavaScript og CSS

Klientscripts og -styles ligger under `public/assets` og indlæses uændret.

- `public/assets/js/main.js` håndterer menu, slider, popups, formularer og
  indholdsafsløring (`IntersectionObserver`). Skrevet fra bunden.
- `public/assets/css/site.css` er projektets egne tilføjelser oven på temaets
  `style.css`.
- Temaets ældre JavaScript (jQuery, Owl Carousel, Magnific Popup) er bevidst
  beholdt for at bevare det visuelle udtryk. Det kan med fordel erstattes af
  vanilla JS på et senere tidspunkt.

`main.js` afhænger kun af jQuery + de to plugins; det afslører indhold via
`IntersectionObserver` med `no-js`-fallback, så siden også virker uden JavaScript.

## Indhold

Teksterne er skrevet på dansk og bygger på det oprindelige koncept (arbejdsfitness,
shelterture, bål og mjød, de tre værter og prisniveauerne fra forsiden).

Kontaktoplysninger (adresse, telefon, e-mail) er **pladsholdere** og skal erstattes
med de rigtige inden en rigtig udgivelse.

## Udgivelse

`npm run build` lægger et komplet statisk site i `dist/`. Det kan lægges på enhver
statisk host, CDN eller Cloudflare Workers/Pages – der er ingen serverkode, men
formularerne åbner brugerens e-mailklient, da der ikke er et backend.
