import { DOCUMENT, Injectable, LOCALE_ID, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly document = inject(DOCUMENT);
  readonly isKannada = inject(LOCALE_ID).toLowerCase().startsWith('kn');
  readonly targetLanguage = this.isKannada ? 'en' : 'kn';

  get switchUrl(): string {
    const base = new URL(this.document.baseURI);
    if (this.isKannada) base.pathname = base.pathname.replace(/kn\/$/, '');
    if (!this.isKannada) base.pathname += 'kn/';
    base.search = this.document.defaultView?.location.search ?? '';
    base.hash = this.document.defaultView?.location.hash ?? '';
    return base.href;
  }

  rememberChoice(): void {
    try {
      this.document.defaultView?.localStorage.setItem('namo-language', this.targetLanguage);
    } catch {
      // The locale URL still works when storage is unavailable.
    }
  }
}
