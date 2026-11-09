import { DOCUMENT, LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  function service(locale: string, base: string) {
    TestBed.configureTestingModule({
      providers: [
        { provide: LOCALE_ID, useValue: locale },
        {
          provide: DOCUMENT,
          useValue: {
            baseURI: base,
            defaultView: { localStorage, location: { search: '?test=1', hash: '#about' } },
          },
        },
      ],
    });
    return TestBed.inject(LanguageService);
  }

  it('switches to Kannada under the same hosting base and remembers the choice', () => {
    const language = service('en-IN', 'https://example.com/pharmacy/');
    expect(language.switchUrl).toBe('https://example.com/pharmacy/kn/?test=1#about');
    language.rememberChoice();
    expect(localStorage.getItem('namo-language')).toBe('kn');
  });

  it('switches back to the English root without losing the section', () => {
    const language = service('kn', 'https://example.com/pharmacy/kn/');
    expect(language.isKannada).toBe(true);
    expect(language.switchUrl).toBe('https://example.com/pharmacy/?test=1#about');
    language.rememberChoice();
    expect(localStorage.getItem('namo-language')).toBe('en');
  });

  it('retains a usable URL when storage is blocked', () => {
    const language = service('en-IN', 'https://example.com/');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw Error('Blocked');
    });
    expect(() => language.rememberChoice()).not.toThrow();
    expect(language.switchUrl).toContain('/kn/');
  });
});
