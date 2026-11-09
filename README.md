# Namo Generic Medicals

Static pharmacy website built with Angular 22, standalone components, TypeScript strict mode, and SCSS.

## Local development

Use Node.js 22.22.3 (see `.nvmrc`) and npm 10.

```sh
npm ci
npm start
```

Open http://localhost:4200. The development server reloads when files change.

## Checks

```sh
npm run format:check
npm test -- --watch=false
npm run build
```

Run `npm run format` to format files. Production output is generated under `dist/`.
GitHub Actions runs formatting, unit tests, and the production build for pushes to main and pull requests.

## Current stage

Shared responsive layout, light/dark theme switching, and English/Kannada localisation foundations. No deployment is configured yet.

## Next stages

- Build individual page sections.
- Add branch contact actions and configure static hosting.

The application requires no backend. Business content and website sections will be added incrementally.

## Theme foundations

Edit `$primary` in `src/styles/_theme.scss` to change the brand colour in one place.
Components use semantic CSS variables for backgrounds, surfaces, text, borders, links,
and focus states. Brand tints and dark-theme links derive from the primary colour.
Check text contrast whenever changing the brand colour.

Light is the default on a first visit. The header moon/sun button switches themes
and saves the choice under `namo-theme` in browser local storage. A saved preference
is restored when the application starts. If storage is blocked, switching still works
for the current visit. OS dark-mode preference does not override the default.

The mobile navigation opens with the menu button and closes on Escape or a link
selection. Navigation links to Home, About, Services, Gallery, and Contact. Each section currently contains its heading only.
The layout includes a keyboard skip link and a shared footer.

## Localisation

English (India), `en-IN`, is the source locale. Visitor-facing copy lives in
`src/app/content/site-content.ts`, using Angular `$localize` messages with stable
IDs and translator descriptions. Add new section copy there as the site grows.
Keep business data such as phone numbers and map URLs separate from translations.

Run `npm run i18n:extract` after changing copy. This updates
`src/locale/messages.en.xlf`, the XLIFF 2 source catalogue for translators.
Do not edit that generated file directly; edit the content file and extract again.

## Kannada test preview

The current content and shared-layout labels have Kannada translations in `src/locale/messages.kn.xlf`.
The pharmacy name is transliterated as ನಮೋ ಜೆನೆರಿಕ್ ಮೆಡಿಕಲ್ಸ್.

```sh
npm run start:kn
```

Open http://localhost:4200/kn/ to preview Kannada. Stop any existing English
development server first, or pass `-- --port 4201` to use another port.

`npm run build:kn` produces the Kannada production build under
`dist/namo-generic-medicals/browser/kn/` and fails on missing translations.
The generated HTML declares `lang="kn"`.

`npm start` and `npm run build` remain English only. There is no language selector
or Kannada deployment in this version. Future language links can navigate between
static locale versions; Angular localisation loads a new page when switching.

As English copy grows, run `npm run i18n:extract` and update the Kannada catalogue
with matching IDs, English sources, and Kannada targets. Future accessible labels
and page titles should also use localised messages. Allow text to wrap and use
fonts that support Kannada.

## Code structure

```text
src/app/
  app-root/              Root component, template, styles, and tests
  layout/
    site-header/         Header component, template, styles, and tests
    site-footer/         Footer component, template, and styles
  core/
    services/            Application-wide services and their tests
  content/               Translatable visitor-facing messages
  app.config.ts          Application providers
  app.routes.ts          Route definitions
```

Keep each component in its own named folder with separate `.ts`, `.html`, and
`.scss` files; colocate its `.spec.ts` file when tests are needed. Keep shared
services under `core/services`. Add dedicated `core/guards` and `shared/directives`
folders when those types are introduced, rather than mixing them with components.
Future page components belong in their respective feature folders.

## Section layout

Each page section has its own component folder under `src/app/features/`.
Only headings are present at this stage; section content will be added individually.
Shared section spacing is defined by `.page-section` in `src/styles.scss`.

Navigation uses native fragment links (`#home`, `#about`, `#services`, `#gallery`,
`#contact`). On desktop the header stays visible and anchor scrolling leaves room
above section headings. At widths up to 64rem the header scrolls with the page,
so the expanded mobile menu cannot cover a destination after navigation.
Smooth scrolling is disabled when the visitor prefers reduced motion.
