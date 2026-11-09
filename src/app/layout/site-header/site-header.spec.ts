import { TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';
import { SiteHeader } from './site-header';

describe('SiteHeader', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ imports: [SiteHeader] });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('keeps the anchor offset in sync with the measured header and cleans up', async () => {
    let height = 120;
    let resize: () => void = () => {};
    const disconnect = vi.fn();
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      () => ({ height }) as DOMRect,
    );
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          resize = callback;
        }
        observe() {}
        disconnect = disconnect;
      },
    );
    const fixture = TestBed.createComponent(SiteHeader);
    await fixture.whenStable();
    const style = document.documentElement.style;
    expect(style.getPropertyValue('--site-header-height')).toBe('120px');
    height = 156;
    resize();
    expect(style.getPropertyValue('--site-header-height')).toBe('156px');
    fixture.destroy();
    expect(disconnect).toHaveBeenCalledOnce();
    expect(style.getPropertyValue('--site-header-height')).toBe('');
  });

  it('updates the theme and accessible action label', async () => {
    const fixture = TestBed.createComponent(SiteHeader);
    await fixture.whenStable();
    const button = fixture.nativeElement.querySelector('.preferences button') as HTMLButtonElement;
    expect(button.getAttribute('aria-label')).toBe('Switch to dark theme');
    button.click();
    await fixture.whenStable();
    expect(button.getAttribute('aria-label')).toBe('Switch to light theme');
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });

  it('offers Kannada from English and records a manual selection', async () => {
    const fixture = TestBed.createComponent(SiteHeader);
    await fixture.whenStable();
    const link = fixture.nativeElement.querySelector('.preferences a') as HTMLAnchorElement;
    expect(link.textContent?.trim()).toBe('ಕ');
    expect(link.getAttribute('aria-label')).toBe('Switch to Kannada');
    expect(link.getAttribute('hreflang')).toBe('kn');
    link.addEventListener('click', (event) => event.preventDefault());
    link.click();
    expect(localStorage.getItem('namo-language')).toBe('kn');
  });

  it('offers English from the Kannada build', async () => {
    TestBed.overrideProvider(LOCALE_ID, { useValue: 'kn' });
    const fixture = TestBed.createComponent(SiteHeader);
    await fixture.whenStable();
    const link = fixture.nativeElement.querySelector('.preferences a') as HTMLAnchorElement;
    expect(link.textContent?.trim()).toBe('EN');
    expect(link.getAttribute('aria-label')).toBe('Switch to English');
    expect(link.getAttribute('hreflang')).toBe('en');
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
    (nav.querySelector('a[href="#home"]') as HTMLAnchorElement).click();
    await fixture.whenStable();
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });
});
