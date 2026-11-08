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

Project configuration and a minimal starter shell only. No deployment is configured yet.

## Next stages

- Centralise the primary green (#087F5B) and add light/dark theme tokens.
- Prepare English content and localisation for future Kannada support.
- Build shared layout and theme toggle, followed by individual page sections.
- Add branch contact actions and configure static hosting.

The application requires no backend. Business content and website sections will be added incrementally.
