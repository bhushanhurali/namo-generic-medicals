import { DOCUMENT, Injectable, inject, signal } from '@angular/core';

type Theme = 'light' | 'dark';
const STORAGE_KEY = 'namo-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly current = signal<Theme>('light');
  readonly theme = this.current.asReadonly();

  constructor() {
    let initial: Theme = 'light';
    try {
      if (this.document.defaultView?.localStorage.getItem(STORAGE_KEY) === 'dark') {
        initial = 'dark';
      }
    } catch {
      // Browsers may disable storage; the toggle still works for this visit.
    }
    this.apply(initial);
  }

  toggle(): void {
    const next = this.current() === 'light' ? 'dark' : 'light';
    this.apply(next);
    try {
      this.document.defaultView?.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Saving a preference is optional.
    }
  }

  private apply(theme: Theme): void {
    this.current.set(theme);
    this.document.documentElement.dataset['theme'] = theme;
  }
}
