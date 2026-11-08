import { Component } from '@angular/core';
import { SITE_CONTENT } from '../../content/site-content';

@Component({
  selector: 'app-site-footer',
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss',
})
export class SiteFooter {
  protected readonly content = SITE_CONTENT;
  protected readonly year = new Date().getFullYear();
}
