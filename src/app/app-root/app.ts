import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SITE_CONTENT } from '../content/site-content';
import { SiteHeader } from '../layout/site-header/site-header';
import { SiteFooter } from '../layout/site-footer/site-footer';

import { HomeSection } from '../features/home/home-section';
import { AboutSection } from '../features/about/about-section';
import { ServicesSection } from '../features/services/services-section';
import { GallerySection } from '../features/gallery/gallery-section';
import { ContactSection } from '../features/contact/contact-section';

@Component({
  imports: [
    RouterOutlet,
    SiteHeader,
    SiteFooter,
    HomeSection,
    AboutSection,
    ServicesSection,
    GallerySection,
    ContactSection,
  ],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly content = SITE_CONTENT;
}
