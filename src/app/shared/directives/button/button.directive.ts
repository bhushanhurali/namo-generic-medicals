import { Directive, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'outline' | 'icon';
export type ButtonSize = 'standard' | 'compact';

// Styles native links and buttons without changing their navigation or behaviour.
@Directive({
  selector: 'a[appButton], button[appButton]',
  host: {
    class: 'app-button',
    '[class.app-button--outline]': 'appButton() === "outline"',
    '[class.app-button--icon]': 'appButton() === "icon"',
    '[class.app-button--compact]': 'buttonSize() === "compact"',
  },
})
export class ButtonDirective {
  readonly appButton = input<ButtonVariant, ButtonVariant | ''>('primary', {
    transform: (value) => value || 'primary',
  });
  readonly buttonSize = input<ButtonSize>('standard');
}
