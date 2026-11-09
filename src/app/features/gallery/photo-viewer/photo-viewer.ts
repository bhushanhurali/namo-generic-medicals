import {
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  Injector,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
  afterNextRender,
} from '@angular/core';
import { GalleryPhoto } from '../../../data/gallery-photos';
import { GALLERY_CONTENT } from '../../../content/gallery-content';
import { Icon } from '../../../shared/components/icon/icon';
import { ButtonDirective } from '../../../shared/directives/button/button.directive';

@Component({
  imports: [Icon, ButtonDirective],
  selector: 'app-photo-viewer',
  templateUrl: './photo-viewer.html',
  styleUrl: './photo-viewer.scss',
})
export class PhotoViewer {
  readonly photos = input.required<readonly GalleryPhoto[]>();
  readonly opened = output<boolean>();
  protected readonly content = GALLERY_CONTENT;
  protected readonly index = signal<number | null>(null);
  protected readonly photo = computed(() => this.photos()[this.index() ?? -1]);
  protected readonly imageError = signal(false);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('viewer');
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private trigger?: HTMLButtonElement;
  private previousOverflow = '';
  private active = false;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      if (this.active) this.document.body.style.overflow = this.previousOverflow;
    });
  }

  open(id: string, trigger: HTMLButtonElement): void {
    const index = this.photos().findIndex((photo) => photo.id === id);
    if (index < 0) return;
    this.trigger = trigger;
    this.index.set(index);
    this.imageError.set(false);
    if (!this.active) {
      this.previousOverflow = this.document.body.style.overflow;
      this.document.body.style.overflow = 'hidden';
      this.active = true;
      this.opened.emit(true);
    }
    afterNextRender(
      () => {
        if (!this.active) return;
        const dialog = this.dialog().nativeElement;
        if (!dialog.open) dialog.showModal();
        dialog.querySelector<HTMLButtonElement>('.close')?.focus();
      },
      { injector: this.injector },
    );
  }

  protected navigate(delta: number): void {
    const length = this.photos().length;
    if (!length || this.index() === null) return;
    this.index.update((index) => ((index ?? 0) + delta + length) % length);
    this.imageError.set(false);
  }
  protected keydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      this.navigate(event.key === 'ArrowRight' ? 1 : -1);
    }
  }
  protected backdrop(event: MouseEvent): void {
    const dialog = this.dialog().nativeElement;
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      this.close();
  }
  protected close(): void {
    const dialog = this.dialog().nativeElement;
    if (dialog.open) dialog.close();
    this.closed();
  }
  protected closed(): void {
    if (!this.active) return;
    this.active = false;
    this.index.set(null);
    this.document.body.style.overflow = this.previousOverflow;
    this.opened.emit(false);
    if (this.trigger?.isConnected) this.trigger.focus();
  }
}
