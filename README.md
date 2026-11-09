# Namo Generic Medicals

Static pharmacy website built with Angular 22, standalone components, TypeScript strict mode, and SCSS.

## Local development

Use Node.js 22.22.3 (see `.nvmrc`) and npm 10.

```sh
npm ci
npm start
```

Open http://localhost:4200. Both language versions rebuild when files change; refresh the browser after a rebuild. Set the PORT environment variable to use a different port.

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
selection. Navigation links to Home, About, Services, Gallery, and Contact. Home, About, Services, and Contact are implemented. Gallery remains a heading-only placeholder until actual store photos are available.
The layout includes a keyboard skip link and a shared footer.

## Localisation

English (India), `en-IN`, is the source locale. Visitor-facing copy lives in
`src/app/content/site-content.ts`, using Angular `$localize` messages with stable
IDs and translator descriptions. Add new section copy there as the site grows.
Keep business data such as phone numbers and map URLs separate from translations.

Run `npm run i18n:extract` after changing copy. This updates
`src/locale/messages.en.xlf`, the XLIFF 2 source catalogue for translators.
Do not edit that generated file directly; edit the content file and extract again.

## Languages and preview

`npm start` watches and rebuilds both English and Kannada, serving them at `/` and
`/kn/` on http://localhost:4200. Refresh after rebuilds. For a production preview,
use `npm run preview`. Both commands support the `PORT` environment variable.

`npm run build` now emits both languages under `dist/namo-generic-medicals/browser/`.
Upload that entire directory when configuring hosting. The English page is at its
root, with Kannada under `kn/`. `npm run build:kn` remains a Kannada-only build.

The desktop language control appears next to the theme button. On mobile both
controls are inside the menu. `ಕ` opens Kannada; `EN` opens English. Switching
loads the corresponding static page and preserves query parameters and section
fragments. The app restores the section after Angular renders it.

On an initial English-root visit, `public/language-init.js` checks the device's
primary browser language before Angular loads. Kannada (`kn` or `kn-IN`) selects
Kannada; every other language defaults to English. An explicit Kannada URL stays
Kannada. A manual choice is stored as `namo-language` and overrides device detection.
Clear that local-storage key to test first-visit detection again. Storage being
blocked does not prevent URL-based switching or device detection.

Angular's native live server supports one locale at a time. Use `npm run start:en`
or `npm run start:kn` for single-language editing with live reload. For actual
language-switch testing, use the bilingual `npm start` or `npm run preview` commands.

As English copy grows, run `npm run i18n:extract` and update the Kannada catalogue
with matching IDs, English sources, and Kannada targets. Localised builds fail on
missing translations. Run `npm run test:language` for startup-detection checks.

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
Home, About, Services, and Contact are implemented; Gallery awaits actual store photographs.
Shared section spacing is defined by `.page-section` in `src/styles.scss`.

Navigation uses native fragment links (`#home`, `#about`, `#services`, `#gallery`,
`#contact`). The header stays visible at all screen sizes. Anchor scrolling uses its measured height, and the mobile menu overlays the page without changing the scroll offset.
Smooth scrolling is disabled when the visitor prefers reduced motion.

## Home section

Home recreates the original pharmacy website's hero, medicine image, benefits strip,
and four care cards. All Home messages, including the image description, are in
`src/app/content/home-content.ts`, with Kannada translations in the locale catalogue.
It uses the shared theme colours and adapts to narrow screens and Kannada text.
The illustrative pharmacy image is hosted by Unsplash, as on the original website.

Both hero actions currently navigate to Contact, matching the original site's
branch-selection flow. Contact now provides branch links and a WhatsApp enquiry form. No messages are sent automatically.

## Shared buttons and icons

Import `ButtonDirective` in components that render action links or buttons:

```html
<a appButton href="#contact">Order via WhatsApp <app-icon name="whatsapp" /></a>
<a appButton="outline" href="#contact">Get Directions <app-icon name="map-pin" /></a>
<button appButton="icon" type="button" aria-label="Open navigation">
  <app-icon name="menu" />
</button>
```

Use `buttonSize="compact"` for smaller text actions. Keep layout-specific widths
and spacing in the consuming component. Shared styling is loaded once from
`shared/directives/button/_button.scss` through the global stylesheet.
Use native `disabled` on buttons and specify their `type`. Links retain native
navigation semantics; do not use a link for an action that needs disabling.

Import `Icon` from `shared/components/icon/icon`. Supported names are `whatsapp`,
`map-pin`, `moon`, `sun`, `menu`, `close`, and `delivery`. Icons inherit text colour;
set `--icon-size` in the consuming stylesheet to change their size. They are always
decorative: provide visible text or a translated accessible label on the parent.
No icon library or external SVG requests are required.

## About section

About recreates the original image-and-text layout, community caption, Genericart
partner information, and generic-medicine note. Copy and image descriptions live in
`src/app/content/about-content.ts` with matching Kannada translations. Official
Genericart links open in a separate tab; the local pharmacy link goes to Contact.
The illustrative image uses the original Unsplash URL. Gallery awaits actual store photographs.

## Header and anchor spacing

The header is sticky on mobile and desktop. `ResizeObserver` updates
`--site-header-height` when text wrapping, viewport width, or locale changes its
height. The global scroll padding uses that measurement plus a small gap; section
padding is kept separate so offsets are not counted twice. The mobile navigation
opens below the header with its own scroll area and closes after link selection.

## Services section

Services recreates the six service entries and three-step enquiry panel from the
original website. Copy lives in `src/app/content/services-content.ts` with matching
Kannada translations. The layout adapts from three columns to one on smaller
screens and uses shared icons and button styling. Panel colours are centralised in
`src/styles/_theme.scss` and derive from the primary colour.

The WhatsApp action navigates to Contact, where visitors can choose a branch and prepare an enquiry. Gallery remains a heading-only placeholder.
Additional shared icons: `medical-cross`, `prescription`, `search`, and `heart`.

## Contact and branch details

Edit `src/app/data/branches.ts` for the five pharmacies' canonical details. Translated
names, areas, form labels, and enquiry text live in `src/app/content/contact-content.ts`.
Reusable branch cards live in the Contact feature's `branch-card/` folder. Call links
use the branch's phone number; WhatsApp links use its WhatsApp number. Google Maps
links are shown only when supplied; no map is guessed for missing pins.

The reactive enquiry form requires a selected pharmacy, a nonblank name (up to 100
characters), a phone number with 7–15 digits, and a nonblank message (up to 1000
characters). It opens an encoded WhatsApp draft for that pharmacy. The visitor still
reviews and sends it in WhatsApp. No backend, website storage, or automatic sending
is used. Validation messages and drafts follow the selected language.

Home and Services actions already link to Contact, where visitors can now choose a
pharmacy from the cards or enquiry form. Gallery remains unchanged pending photos.

## Custom form picker

`shared/components/select/` provides a grouped, select-only combobox integrated with
Angular reactive forms through `ControlValueAccessor`. It keeps the pharmacy list
location-only, styles selected items with the primary colour, and uses rounded,
scrollable menus in both themes. It supports keyboard navigation, type-ahead,
Escape/Tab dismissal, outside-click dismissal, disabled controls, and form resets.
Its visible label and validation descriptions are supplied by the consuming form.
