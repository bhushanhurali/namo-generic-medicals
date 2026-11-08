// Keep visitor-facing copy here as sections are added. Stable IDs connect each
// message to its translation even when the English wording changes.
export const SITE_CONTENT = {
  name: $localize`:Pharmacy name|Public business name@@site.name:Namo Generic Medicals`,
  comingSoon: $localize`:Starter message|Placeholder while the site is built@@site.comingSoon:Our website is taking shape.`,
  neighbourhood: $localize`:Header tagline@@layout.neighbourhood:Your neighbourhood pharmacy.`,
  location: $localize`:Service area@@layout.location:Hubli–Dharwad`,
  home: $localize`:Navigation link@@nav.home:Home`,
  mainNavigation: $localize`:Accessible navigation label@@nav.main:Main navigation`,
  openMenu: $localize`:Menu button label@@nav.open:Open navigation`,
  closeMenu: $localize`:Menu button label@@nav.close:Close navigation`,
  darkTheme: $localize`:Theme button action@@theme.dark:Switch to dark theme`,
  lightTheme: $localize`:Theme button action@@theme.light:Switch to light theme`,
  skipToContent: $localize`:Keyboard navigation link@@nav.skip:Skip to content`,
  backToTop: $localize`:Footer navigation link@@nav.top:Back to top`,
  rights: $localize`:Copyright notice@@footer.rights:All rights reserved.`,
} as const;
