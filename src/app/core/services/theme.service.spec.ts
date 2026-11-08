import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('defaults to light and persists toggles in both directions', () => {
    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('light');
    expect(document.documentElement.dataset['theme']).toBe('light');
    service.toggle();
    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(localStorage.getItem('namo-theme')).toBe('dark');
    service.toggle();
    expect(document.documentElement.dataset['theme']).toBe('light');
    expect(localStorage.getItem('namo-theme')).toBe('light');
  });

  it('restores a saved dark preference', () => {
    localStorage.setItem('namo-theme', 'dark');
    expect(TestBed.inject(ThemeService).theme()).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });

  it('ignores invalid saved values', () => {
    localStorage.setItem('namo-theme', 'invalid');
    expect(TestBed.inject(ThemeService).theme()).toBe('light');
  });

  it('works when browser storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Blocked');
    });
    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('light');
    expect(() => service.toggle()).not.toThrow();
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });
});
