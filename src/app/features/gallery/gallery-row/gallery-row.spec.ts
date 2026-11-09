import { TestBed } from '@angular/core/testing';
import { GalleryRow } from './gallery-row';
import { GalleryPhoto } from '../../../data/gallery-photos';

const photos = (count: number): GalleryPhoto[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `photo-${index}`,
    src: `assets/images/${index}.avif`,
    caption: `Photo ${index}`,
    alt: `Description ${index}`,
  }));

describe('Gallery rows', () => {
  it('keeps loop duplicates out of keyboard navigation and emits the original trigger', async () => {
    const fixture = TestBed.createComponent(GalleryRow);
    fixture.componentRef.setInput('photos', photos(3));
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelectorAll('button[tabindex="0"]').length).toBe(3);
    expect(root.querySelectorAll('button[aria-hidden="true"]').length).toBeGreaterThan(0);
    const selected = vi.fn();
    fixture.componentInstance.photoSelected.subscribe(selected);
    const duplicate = root.querySelector('.loop-copy button') as HTMLButtonElement;
    duplicate.click();
    expect(selected).toHaveBeenCalledWith({
      id: 'photo-0',
      trigger: root.querySelector('button[data-original="photo-0"]'),
    });
  });

  it('does not drop photos when more than six are configured in one row', async () => {
    const fixture = TestBed.createComponent(GalleryRow);
    fixture.componentRef.setInput('photos', photos(10));
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('button[tabindex="0"]').length).toBe(10);
  });
});
