import { TestBed } from '@angular/core/testing';
import { PhotoViewer } from './photo-viewer';
import { GalleryPhoto } from '../../../data/gallery-photos';

const photos: GalleryPhoto[] = [
  {
    id: 'one',
    src: 'assets/images/one.avif',
    caption: 'First photo',
    alt: 'First image',
    sample: true,
  },
  { id: 'two', src: 'assets/images/two.avif', caption: 'Second photo', alt: 'Second image' },
];

describe('PhotoViewer', () => {
  async function setup() {
    const fixture = TestBed.createComponent(PhotoViewer);
    fixture.componentRef.setInput('photos', photos);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const dialog = root.querySelector('dialog')!;
    // jsdom does not implement native modal behaviour; browsers provide the focus trap.
    dialog.showModal = vi.fn(() => {
      dialog.setAttribute('open', '');
    });
    dialog.close = vi.fn(() => {
      dialog.removeAttribute('open');
      dialog.dispatchEvent(new Event('close'));
    });
    const trigger = document.createElement('button');
    document.body.append(trigger);
    return { fixture, root, dialog, trigger };
  }
  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('opens, wraps next/previous with arrow keys, and displays each caption', async () => {
    const { fixture, root, dialog, trigger } = await setup();
    fixture.componentInstance.open('one', trigger);
    await fixture.whenStable();
    expect(dialog.open).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');
    expect(root.querySelector('figcaption')?.textContent).toContain('First photo');
    const previous = root.querySelector<HTMLButtonElement>('.previous')!;
    const next = root.querySelector<HTMLButtonElement>('.next')!;
    expect(previous.getAttribute('aria-label')).toBe('Previous photo');
    expect(next.getAttribute('aria-label')).toBe('Next photo');
    expect(previous.textContent?.trim()).toBe('');
    expect(next.textContent?.trim()).toBe('');
    next.click();
    await fixture.whenStable();
    expect(root.querySelector('figcaption')?.textContent).toContain('Second photo');
    previous.click();
    await fixture.whenStable();
    expect(root.querySelector('figcaption')?.textContent).toContain('Illustrative image');
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await fixture.whenStable();
    expect(root.querySelector('img')?.getAttribute('alt')).toBe('Second image');
    expect(root.querySelector('figcaption')?.textContent).not.toContain('Illustrative image');
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await fixture.whenStable();
    expect(root.querySelector('figcaption')?.textContent).toContain('First photo');
    fixture.destroy();
    trigger.remove();
  });

  it('handles Escape cancellation, restores scrolling and returns focus', async () => {
    const { fixture, dialog, trigger } = await setup();
    document.body.style.overflow = 'auto';
    fixture.componentInstance.open('two', trigger);
    await fixture.whenStable();
    const cancel = new Event('cancel', { cancelable: true });
    dialog.dispatchEvent(cancel);
    await fixture.whenStable();
    expect(cancel.defaultPrevented).toBe(true);
    expect(dialog.open).toBe(false);
    expect(document.body.style.overflow).toBe('auto');
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });

  it('restores body scrolling if destroyed while open', async () => {
    const { fixture, trigger } = await setup();
    document.body.style.overflow = 'auto';
    fixture.componentInstance.open('one', trigger);
    await fixture.whenStable();
    fixture.destroy();
    expect(document.body.style.overflow).toBe('auto');
    trigger.remove();
  });
});
