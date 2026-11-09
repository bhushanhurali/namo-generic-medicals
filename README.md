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

All page sections, themes, and English/Kannada versions are implemented. A manual GitHub Pages release workflow is prepared; the first deployment is pending.

## Next stages

- Configure GitHub Pages and publish the first tagged release.
- Replace illustrative images as actual store photographs become available.

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
selection. Navigation links to Home, About, Services, Gallery, and Contact. Home, About, Services, and Contact are implemented. Gallery includes the six local sample images and supports adding actual store photos.
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
Home, About, Services, and Contact are implemented; Gallery currently displays the supplied illustrative sample images.
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
The illustrative image uses the original Unsplash URL. Gallery currently displays the supplied illustrative sample images.

## Header and anchor spacing

The tagline is a separate SiteTopline component in normal page flow, so it scrolls away and returns when scrolling to the top. The navigation header stays sticky on mobile and desktop. Its measured height excludes the tagline. `ResizeObserver` updates
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

The WhatsApp action navigates to Contact, where visitors can choose a branch and prepare an enquiry. Gallery supports an expandable list of local images.
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
pharmacy from the cards or enquiry form. Gallery currently uses the supplied illustrative sample images.

## Custom form picker

`shared/components/select/` provides a grouped, select-only combobox integrated with
Angular reactive forms through `ControlValueAccessor`. It keeps the pharmacy list
location-only, styles selected items with the primary colour, and uses rounded,
scrollable menus in both themes. It supports keyboard navigation, type-ahead,
Escape/Tab dismissal, outside-click dismissal, disabled controls, and form resets.
Its visible label and validation descriptions are supplied by the consuming form.

## Gallery photos

Gallery metadata lives in `src/app/data/gallery-photos.ts`. To add or replace photos:

1. Put the file in `src/assets/images/`. Angular copies assets into both locale builds.
2. Add caption and alt-text messages in `src/app/content/gallery-content.ts`.
3. Add a `GALLERY_PHOTOS` entry using a unique `id`, relative `src`, translated
   `caption`, and translated `alt`. Example:

```ts
{
  id: 'navanagar-front',
  src: 'assets/images/navanagar-front.avif',
  caption: text.navanagarFrontCaption,
  alt: text.navanagarFrontAlt,
  sample: false,
}
```

4. Run `npm run i18n:extract`, add the corresponding Kannada translations, and build.

Replacing a file at the same path needs no metadata change unless its description
changes. The current six entries are illustrative images from the original website,
so they have `sample: true`. Set `sample: false` (or omit it) for actual pharmacy
photographs. The introduction changes automatically when actual photos are included;
only sample images display the illustrative-image notice in the viewer.

All photos appear in one continuous row, whether there are 6, 10, or more.
The row loops seamlessly; loop copies are excluded
from keyboard and screen-reader navigation. Hover pauses a row, keyboard focus
provides a stable manual row, and the icon-only Pause/Play control stops or resumes the row. Reduced-motion users
get manually scrollable rows without automatic movement. The native modal viewer
supports previous/next wrapping, arrow keys, Escape, backdrop closing, captions,
and returning focus to the original photo. Page scrolling is locked only while open.

## Footer

The footer follows the original pharmacy site's brand, Explore and Let's connect
columns, medicine notice, copyright, and service-area layout. Footer copy lives in
`src/app/content/footer-content.ts` with Kannada translations. The map and WhatsApp
links lead to Contact so visitors can choose the appropriate pharmacy. Shared icons
and theme variables keep it consistent with the other sections.

## Licence

The original application code and technical documentation are available under the
[MIT licence](LICENSE), copyright © 2026 Bhushan Hurali. You may reuse, modify, and
redistribute the software, including commercially, while retaining the licence's
copyright and permission notice.

Business branding, business-specific marketing copy, and photographs are outside
this MIT grant. Third-party material retains its own terms. See
[branding and image rights](ASSET_NOTICE.md) for sample image sources and guidance
for adding actual store photographs. Reusing the code does not grant permission
to represent Namo Generic Medicals or its partner pharmacies.

## Manual GitHub Pages releases

CI continues to run on pushes to `main` and on pull requests. Deployment is separate:
`.github/workflows/deploy-pages.yml` has **only** a manual `workflow_dispatch` trigger.
Pushing code, pushing a tag, or creating a GitHub Release does not publish the site.

### One-time setup

1. Commit and push the deployment workflow and its build-check script to `main`.
2. Open the repository's **Settings → Pages**. Under **Build and deployment**, choose
   **GitHub Actions** as the source.
3. If the `github-pages` environment has deployment branch restrictions, allow
   `main`. Run the workflow from `main`; the version input selects the release tag.
   Optional environment reviewers can add an approval before deployment.

The workflow uses GitHub's built-in token; no personal access token is required.

### Publish a version

After finishing and pushing your intended changes to `main`, create and push an
annotated tag on that commit. The first tag must include the deployment tooling:

```sh
git switch main
git pull --ff-only
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

Then open **Actions → Deploy to GitHub Pages → Run workflow**:

- Leave **Use workflow from** set to `main`.
- Enter `v1.0.0` in **version**, then run the workflow.

Only existing stable tags in the form `vMAJOR.MINOR.PATCH` are accepted. The tagged
commit must be in `main`'s history. The workflow resolves the tag to its exact commit,
checks it out, installs locked dependencies, reruns formatting/component/language
checks, and builds both locales. It then verifies the output before uploading and
deploying it. The run summary records the version and commit.

The publishing job depends on the successful build job. A failed check or build
leaves the current site unchanged. Concurrent release workflows do not cancel a
release that is already running.

Use a new tag such as `v1.0.1` or `v1.1.0` for later releases; do not move published
tags. To roll back, manually run the workflow again with an earlier release tag that
includes this deployment tooling. A separate GitHub Release/changelog is optional.

### Site paths and custom domains

The workflow reads the hosting base path from `actions/configure-pages` instead of
hardcoding it in Angular configuration. For this repository, expected paths are:

- English: https://bhushanhurali.github.io/namo-generic-medicals/
- Kannada: https://bhushanhurali.github.io/namo-generic-medicals/kn/

It uploads the entire `dist/namo-generic-medicals/browser/` directory. Relative
images and the language switch work beneath the repository path. If a custom domain
is configured in GitHub Pages later, the next manual release will use its base path.
Domain/DNS configuration itself is separate from this workflow.

To validate the repository-path build locally:

```sh
npm run build -- --base-href /namo-generic-medicals/
node scripts/check-pages-build.mjs /namo-generic-medicals/
```

`npm run build` without extra arguments still builds for `/`, as used by the local
preview. See [GitHub's custom workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
for Pages configuration and permissions.
