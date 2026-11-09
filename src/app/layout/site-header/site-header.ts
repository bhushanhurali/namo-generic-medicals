import { Component, inject, signal } from '@angular/core';
import { SITE_CONTENT } from '../../content/site-content';
import { ThemeService } from '../../core/services/theme.service';

import { ButtonDirective } from '../../shared/directives/button/button.directive';
import { Icon } from '../../shared/components/icon/icon';

@Component({
  imports: [ButtonDirective, Icon],
  selector: 'app-site-header',
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
})
export class SiteHeader {
  protected readonly content = SITE_CONTENT;
  protected readonly theme = inject(ThemeService);
  protected readonly menuOpen = signal(false);
}
