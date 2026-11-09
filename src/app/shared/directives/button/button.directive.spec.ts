import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ButtonDirective } from './button.directive';
import { Icon } from '../../components/icon/icon';

@Component({
  imports: [ButtonDirective, Icon],
  template: `
    <a appButton="outline" href="#contact">Directions <app-icon name="map-pin" /></a>
    <button appButton type="button" [disabled]="disabled()" (click)="clicks = clicks + 1">
      Enquire <app-icon name="whatsapp" />
    </button>
  `,
})
class ButtonTestHost {
  disabled = signal(true);
  clicks = 0;
}

describe('Shared action controls', () => {
  it('keeps link destinations and decorative icons separate from the accessible label', async () => {
    const fixture = TestBed.createComponent(ButtonTestHost);
    await fixture.whenStable();
    const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(anchor.hash).toBe('#contact');
    expect(anchor.textContent?.trim()).toBe('Directions');
    expect(anchor.querySelector('app-icon')?.getAttribute('aria-hidden')).toBe('true');
    expect(anchor.querySelector('svg')?.getAttribute('focusable')).toBe('false');
  });

  it('preserves native disabled button behaviour', async () => {
    const fixture = TestBed.createComponent(ButtonTestHost);
    await fixture.whenStable();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();
    expect(fixture.componentInstance.clicks).toBe(0);
    fixture.componentInstance.disabled.set(false);
    await fixture.whenStable();
    button.click();
    expect(fixture.componentInstance.clicks).toBe(1);
    expect(button.type).toBe('button');
  });
});
