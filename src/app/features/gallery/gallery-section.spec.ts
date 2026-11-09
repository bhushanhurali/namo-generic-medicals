import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Icon } from '../../shared/components/icon/icon';
import { GallerySection } from './gallery-section';
import { GALLERY_PHOTOS } from '../../data/gallery-photos';

describe('GallerySection', () => {
  it('shows all photos in one row and switches the icon, label, and paused state', async () => {
    const fixture = TestBed.createComponent(GallerySection);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelectorAll('app-gallery-row').length).toBe(1);
    expect(root.querySelectorAll('button[data-original]').length).toBe(GALLERY_PHOTOS.length);
    const button = root.querySelector<HTMLButtonElement>('.gallery-controls button')!;
    expect(button.getAttribute('aria-label')).toBe('Pause scrolling');
    const icon = fixture.debugElement.query(By.css('.gallery-controls app-icon'))
      .componentInstance as Icon;
    expect(icon.name()).toBe('pause');
    button.click();
    await fixture.whenStable();
    expect(button.getAttribute('aria-label')).toBe('Resume scrolling');
    expect(button.getAttribute('title')).toBe('Resume scrolling');
    expect(icon.name()).toBe('play');
    expect(root.querySelector('.row')?.classList.contains('paused')).toBe(true);
    button.click();
    await fixture.whenStable();
    expect(root.querySelector('.row')?.classList.contains('paused')).toBe(false);
  });
});
