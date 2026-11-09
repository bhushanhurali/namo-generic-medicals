import { Component } from '@angular/core';
import { SITE_CONTENT } from '../../content/site-content';

@Component({
  selector: 'app-home-section',
  templateUrl: './home-section.html',
  styleUrl: './home-section.scss',
})
export class HomeSection {
  protected readonly content = SITE_CONTENT;
}
