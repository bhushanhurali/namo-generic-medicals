import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SITE_CONTENT } from '../content/site-content';
import { SiteHeader } from '../layout/site-header/site-header';
import { SiteFooter } from '../layout/site-footer/site-footer';

@Component({
  imports: [RouterOutlet, SiteHeader, SiteFooter],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly content = SITE_CONTENT;
}
