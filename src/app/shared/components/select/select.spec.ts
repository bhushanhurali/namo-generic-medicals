import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Select } from './select';

@Component({
  imports: [Select, ReactiveFormsModule],
  template: `
    <label id="picker-label" for="picker">Pharmacy</label>
    <app-select
      inputId="picker"
      labelledBy="picker-label"
      placeholder="Choose a pharmacy"
      [groups]="groups"
      [formControl]="control"
      required
    />
  `,
})
class TestHost {
  readonly control = new FormControl('', { nonNullable: true, validators: Validators.required });
  readonly groups = [
    {
      label: 'Namo branches',
      options: [
        { value: 'navanagar', label: 'Navanagar, Hubli' },
        { value: 'srinagar', label: 'Srinagar, Dharwad' },
      ],
    },
    { label: 'Partners', options: [{ value: 'gandhi-chowk', label: 'Gandhi Chowk, Dharwad' }] },
  ];
}

describe('Select', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestHost] });
  });
  async function setup() {
    const fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const trigger = root.querySelector('button')!;
    const key = async (value: string) => {
      trigger.dispatchEvent(
        new KeyboardEvent('keydown', { key: value, bubbles: true, cancelable: true }),
      );
      await fixture.whenStable();
    };
    return { fixture, root, trigger, key };
  }

  it('selects a grouped option by click and updates the reactive form', async () => {
    const { fixture, root, trigger } = await setup();
    trigger.click();
    await fixture.whenStable();
    expect(root.querySelectorAll('[role="group"]').length).toBe(2);
    (root.querySelector('#picker-option-gandhi-chowk') as HTMLElement).click();
    await fixture.whenStable();
    expect(fixture.componentInstance.control.value).toBe('gandhi-chowk');
    expect(fixture.componentInstance.control.touched).toBe(true);
    expect(trigger.textContent).toContain('Gandhi Chowk, Dharwad');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    trigger.click();
    await fixture.whenStable();
    expect(root.querySelector('#picker-option-gandhi-chowk')?.getAttribute('aria-selected')).toBe(
      'true',
    );
  });

  it('supports arrows, Home/End, Enter, and Escape without changing a cancelled selection', async () => {
    const { fixture, trigger, key } = await setup();
    await key('ArrowDown');
    expect(trigger.getAttribute('aria-activedescendant')).toBe('picker-option-navanagar');
    await key('ArrowDown');
    await key('Enter');
    expect(fixture.componentInstance.control.value).toBe('srinagar');
    await key('Enter');
    await key('End');
    expect(trigger.getAttribute('aria-activedescendant')).toBe('picker-option-gandhi-chowk');
    await key('Home');
    expect(trigger.getAttribute('aria-activedescendant')).toBe('picker-option-navanagar');
    await key('Escape');
    expect(fixture.componentInstance.control.value).toBe('srinagar');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('supports typing to find an option and Space to select it', async () => {
    const { fixture, key } = await setup();
    await key('g');
    await key('a');
    await key(' ');
    expect(fixture.componentInstance.control.value).toBe('gandhi-chowk');
  });

  it('closes on Tab and outside pointer input', async () => {
    const { fixture, trigger, key } = await setup();
    await key('Enter');
    await key('Tab');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    trigger.click();
    await fixture.whenStable();
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    await fixture.whenStable();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('reflects programmatic values, resets, and disabled state', async () => {
    const { fixture, trigger } = await setup();
    fixture.componentInstance.control.setValue('srinagar');
    await fixture.whenStable();
    expect(trigger.textContent).toContain('Srinagar, Dharwad');
    fixture.componentInstance.control.reset();
    await fixture.whenStable();
    expect(trigger.textContent).toContain('Choose a pharmacy');
    fixture.componentInstance.control.disable();
    await fixture.whenStable();
    expect(trigger.disabled).toBe(true);
    trigger.click();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });
});
