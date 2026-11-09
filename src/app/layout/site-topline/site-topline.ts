import { Component } from '@angular/core';
import { SITE_CONTENT } from '../../content/site-content';

@Component({
  selector: 'app-site-topline',
  templateUrl: './site-topline.html',
  styleUrl: './site-topline.scss',
})
export class SiteTopline {
  protected readonly content = SITE_CONTENT;
}
