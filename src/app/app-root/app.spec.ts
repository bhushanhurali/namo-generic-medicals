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

  it('renders heading-only sections for every navigation destination', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent?.trim()).toBe('Home');
    const links = [...compiled.querySelectorAll<HTMLAnchorElement>('nav a')];
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
      expect(section.children.length).toBe(1);
      const heading = section.querySelector('h1, h2')!;
      expect(section.getAttribute('aria-labelledby')).toBe(heading.id);
      expect(heading.textContent?.trim()).toBe(link.textContent?.trim());
    }
  });
});
