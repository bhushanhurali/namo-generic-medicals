import { Component, ElementRef, computed, inject, input, output } from '@angular/core';
import { GalleryPhoto } from '../../../data/gallery-photos';
import { GALLERY_CONTENT } from '../../../content/gallery-content';

export interface PhotoSelection {
  id: string;
  trigger: HTMLButtonElement;
}

@Component({
  selector: 'app-gallery-row',
  templateUrl: './gallery-row.html',
  styleUrl: './gallery-row.scss',
})
export class GalleryRow {
  readonly photos = input.required<readonly GalleryPhoto[]>();
  readonly paused = input(false);
  readonly photoSelected = output<PhotoSelection>();
  protected readonly content = GALLERY_CONTENT;
  protected readonly copies = [0, 1];
  protected readonly tiles = computed(() => {
    const photos = this.photos();
    if (!photos.length) return [];
    // Fill a full desktop row even with only one or two source images.
    return Array.from({ length: Math.ceil(6 / photos.length) }, () => photos)
      .flat()
      .map((photo, index) => ({ photo, duplicate: index >= photos.length }));
  });
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  protected select(photo: GalleryPhoto): void {
    const original = [
      ...this.element.nativeElement.querySelectorAll<HTMLButtonElement>('button[data-original]'),
    ].find((button) => button.dataset['original'] === photo.id);
    if (original) this.photoSelected.emit({ id: photo.id, trigger: original });
  }
}
