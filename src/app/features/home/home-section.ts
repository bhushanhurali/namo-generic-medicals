import { Component } from '@angular/core';
import { HOME_CONTENT } from '../../content/home-content';

import { ButtonDirective } from '../../shared/directives/button/button.directive';
import { Icon } from '../../shared/components/icon/icon';

@Component({
  imports: [ButtonDirective, Icon],
  selector: 'app-home-section',
  templateUrl: './home-section.html',
  styleUrl: './home-section.scss',
})
export class HomeSection {
  protected readonly content = HOME_CONTENT;
}
