// Keep visitor-facing copy here as sections are added. Stable IDs connect each
// message to its translation even when the English wording changes.
export const SITE_CONTENT = {
  name: $localize`:Pharmacy name|Public business name@@site.name:Namo Generic Medicals`,
  comingSoon: $localize`:Starter message|Placeholder while the site is built@@site.comingSoon:Our website is taking shape.`,
} as const;
