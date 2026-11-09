import { Component } from '@angular/core';
import { FOOTER_CONTENT } from '../../content/footer-content';
import { Icon } from '../../shared/components/icon/icon';
import { SITE_CONTENT } from '../../content/site-content';

@Component({
  imports: [Icon],
  selector: 'app-site-footer',
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss',
})
export class SiteFooter {
  protected readonly content = SITE_CONTENT;
  protected readonly footer = FOOTER_CONTENT;
  protected readonly year = new Date().getFullYear();
}
