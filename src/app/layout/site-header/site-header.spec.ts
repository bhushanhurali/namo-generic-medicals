import { TestBed } from '@angular/core/testing';
import { SiteHeader } from './site-header';

describe('SiteHeader', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ imports: [SiteHeader] });
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('updates the theme and accessible action label', async () => {
    const fixture = TestBed.createComponent(SiteHeader);
    await fixture.whenStable();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.getAttribute('aria-label')).toBe('Switch to dark theme');
    button.click();
    await fixture.whenStable();
    expect(button.getAttribute('aria-label')).toBe('Switch to light theme');
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });

  it('opens navigation, closes on Escape, and closes after choosing a link', async () => {
    const fixture = TestBed.createComponent(SiteHeader);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const button = root.querySelector('.menu-toggle') as HTMLButtonElement;
    const nav = root.querySelector('nav')!;
    button.click();
    await fixture.whenStable();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(nav.classList.contains('is-open')).toBe(true);
    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await fixture.whenStable();
    expect(button.getAttribute('aria-expanded')).toBe('false');
    button.click();
    await fixture.whenStable();
    (nav.querySelector('a') as HTMLAnchorElement).click();
    await fixture.whenStable();
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });
});
