import { Component } from '@angular/core';
import { ABOUT_CONTENT } from '../../content/about-content';

@Component({
  selector: 'app-about-section',
  templateUrl: './about-section.html',
  styleUrl: './about-section.scss',
})
export class AboutSection {
  protected readonly content = ABOUT_CONTENT;
}
