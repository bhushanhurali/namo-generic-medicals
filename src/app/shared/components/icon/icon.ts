import { Component, input } from '@angular/core';

export type IconName =
  | 'whatsapp'
  | 'map-pin'
  | 'moon'
  | 'sun'
  | 'menu'
  | 'close'
  | 'delivery'
  | 'medical-cross'
  | 'prescription'
  | 'search'
  | 'heart';

// Decorative icons inherit colour and size. Put accessible labels on the parent control.
@Component({
  selector: 'app-icon',
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
  host: { 'aria-hidden': 'true' },
})
export class Icon {
  readonly name = input.required<IconName>();
}
