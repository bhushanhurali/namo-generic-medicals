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

Project configuration, a minimal starter shell, and centralised light/dark theme styles. No deployment is configured yet.

## Next stages

- Prepare English content and localisation for future Kannada support.
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
