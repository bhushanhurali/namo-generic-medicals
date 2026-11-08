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

Project configuration, a minimal starter shell, centralised light/dark theme styles, and English localisation foundations. No deployment is configured yet.

## Next stages

- Build shared layout and theme toggle, followed by individual page sections.
- Add branch contact actions and configure static hosting.

The application requires no backend. Business content and website sections will be added incrementally.

## Theme foundations

Edit `$primary` in `src/styles/_theme.scss` to change the brand colour in one place.
Components use semantic CSS variables for backgrounds, surfaces, text, borders, links,
and focus states. Brand tints and dark-theme links derive from the primary colour.
Check text contrast whenever changing the brand colour.

Light is the default. The dark palette is selected by `data-theme="dark"` on the
root `<html>` element. To preview it before the toggle is built, run this in the
browser developer console:

```js
document.documentElement.dataset.theme = 'dark';
```

Restore light with `document.documentElement.removeAttribute('data-theme')`.
The interactive toggle and saved preference will be added with the shared layout.

## Localisation

English (India), `en-IN`, is the source locale. Visitor-facing copy lives in
`src/app/content/site-content.ts`, using Angular `$localize` messages with stable
IDs and translator descriptions. Add new section copy there as the site grows.
Keep business data such as phone numbers and map URLs separate from translations.

Run `npm run i18n:extract` after changing copy. This updates
`src/locale/messages.en.xlf`, the XLIFF 2 source catalogue for translators.
Do not edit that generated file directly; edit the content file and extract again.

## Kannada test preview

The two current messages have Kannada translations in `src/locale/messages.kn.xlf`.
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
