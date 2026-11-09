import { GALLERY_CONTENT as text } from '../content/gallery-content';

export interface GalleryPhoto {
  id: string;
  src: string;
  caption: string;
  alt: string;
  sample?: boolean;
}

// Add a file and an entry here. Keep IDs unique and asset paths relative for locales/hosting.
// Add translated captions/alt text to gallery-content.ts before using them here.
export const GALLERY_PHOTOS: readonly GalleryPhoto[] = [
  {
    id: 'packaged-medicines',
    src: 'assets/images/01_packaged_medicine.avif',
    caption: text.packagedCaption,
    alt: text.packagedAlt,
    sample: true,
  },
  {
    id: 'everyday-medicines',
    src: 'assets/images/02_everyday_medicine.avif',
    caption: text.everydayCaption,
    alt: text.everydayAlt,
    sample: true,
  },
  {
    id: 'healthcare-essentials',
    src: 'assets/images/03_healthcare_essentials.avif',
    caption: text.essentialsCaption,
    alt: text.essentialsAlt,
    sample: true,
  },
  {
    id: 'medicine-products',
    src: 'assets/images/04_medicine_products.avif',
    caption: text.productsCaption,
    alt: text.productsAlt,
    sample: true,
  },
  {
    id: 'pharmacy-care',
    src: 'assets/images/05_pharmacy_care.avif',
    caption: text.careCaption,
    alt: text.careAlt,
    sample: true,
  },
  {
    id: 'healthcare-service',
    src: 'assets/images/06_healthcare_service.avif',
    caption: text.serviceCaption,
    alt: text.serviceAlt,
    sample: true,
  },
];
