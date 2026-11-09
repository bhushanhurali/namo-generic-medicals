import { Component, signal, viewChild } from '@angular/core';
import { GALLERY_CONTENT } from '../../content/gallery-content';
import { GALLERY_PHOTOS } from '../../data/gallery-photos';
import { Icon } from '../../shared/components/icon/icon';
import { ButtonDirective } from '../../shared/directives/button/button.directive';
import { GalleryRow, PhotoSelection } from './gallery-row/gallery-row';
import { PhotoViewer } from './photo-viewer/photo-viewer';

@Component({
  imports: [GalleryRow, PhotoViewer, ButtonDirective, Icon],
  selector: 'app-gallery-section',
  templateUrl: './gallery-section.html',
  styleUrl: './gallery-section.scss',
})
export class GallerySection {
  protected readonly content = GALLERY_CONTENT;
  protected readonly photos = GALLERY_PHOTOS;
  protected readonly allSamples =
    this.photos.length > 0 && this.photos.every((photo) => photo.sample);
  protected readonly paused = signal(false);
  protected readonly viewerOpen = signal(false);
  private readonly viewer = viewChild.required(PhotoViewer);

  protected openPhoto(selection: PhotoSelection): void {
    this.viewer().open(selection.id, selection.trigger);
  }
}
