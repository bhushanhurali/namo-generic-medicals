import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SITE_CONTENT } from './content/site-content';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly content = SITE_CONTENT;
}
