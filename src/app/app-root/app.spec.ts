import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('renders an accessible section for every navigation destination', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const topline = compiled.querySelector('app-site-topline')!;
    const header = compiled.querySelector('app-site-header')!;
    expect(topline.parentElement).toBe(header.parentElement);
    expect(topline.nextElementSibling).toBe(header);
    expect(header.querySelector('.topline')).toBeNull();
    expect(compiled.querySelectorAll('h1').length).toBe(1);
    expect(compiled.querySelector('h1')?.textContent).toContain('Quality Medicines.');
    expect(compiled.querySelector('#about h2')?.textContent).toContain('Your health matters.');
    expect(compiled.querySelector('#services h2')?.textContent).toContain('Everyday essentials.');
    const links = [...compiled.querySelectorAll<HTMLAnchorElement>('app-site-header nav > a')];
    expect(links.map((link) => link.hash)).toEqual([
      '#home',
      '#about',
      '#services',
      '#gallery',
      '#contact',
    ]);
    for (const link of links) {
      const sections = compiled.querySelectorAll(link.hash);
      expect(sections.length).toBe(1);
      const section = sections[0];
      expect(section.tagName).toBe('SECTION');
      const heading = section.querySelector('h1, h2')!;
      expect(section.getAttribute('aria-labelledby')).toBe(heading.id);
    }
    for (const link of compiled.querySelectorAll<HTMLAnchorElement>('footer a')) {
      expect(compiled.querySelector(link.hash)).not.toBeNull();
    }
  });
});
