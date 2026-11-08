import { Component, inject, signal } from '@angular/core';
import { SITE_CONTENT } from '../../content/site-content';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
})
export class SiteHeader {
  protected readonly content = SITE_CONTENT;
  protected readonly theme = inject(ThemeService);
  protected readonly menuOpen = signal(false);
}
