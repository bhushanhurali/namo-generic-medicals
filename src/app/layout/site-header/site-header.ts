import {
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { SITE_CONTENT } from '../../content/site-content';
import { ThemeService } from '../../core/services/theme.service';
import { LanguageService } from '../../core/services/language.service';

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
  protected readonly language = inject(LanguageService);
  protected readonly menuOpen = signal(false);

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const host = this.element.nativeElement;
      const updateHeight = () => {
        this.document.documentElement.style.setProperty(
          '--site-header-height',
          `${host.getBoundingClientRect().height}px`,
        );
      };
      updateHeight();
      this.destroyRef.onDestroy(() => {
        this.document.documentElement.style.removeProperty('--site-header-height');
      });
      // Non-browser renderers may not expose ResizeObserver.
      if (typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(updateHeight);
      observer.observe(host);
      this.destroyRef.onDestroy(() => {
        observer.disconnect();
      });
    });
  }
}
