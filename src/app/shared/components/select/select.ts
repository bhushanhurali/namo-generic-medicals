import {
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  value: string;
  label: string;
}
export interface SelectGroup {
  label: string;
  options: readonly SelectOption[];
}

@Component({
  selector: 'app-select',
  templateUrl: './select.html',
  styleUrl: './select.scss',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Select), multi: true }],
  host: { '(document:pointerdown)': 'outsidePointer($event)', '(focusout)': 'focusOut($event)' },
})
export class Select implements ControlValueAccessor {
  readonly inputId = input.required<string>();
  readonly labelledBy = input.required<string>();
  readonly describedBy = input<string>();
  readonly placeholder = input.required<string>();
  readonly groups = input.required<readonly SelectGroup[]>();
  readonly invalid = input(false);
  readonly required = input(false, { transform: booleanAttribute });
  protected readonly options = computed(() => this.groups().flatMap((group) => group.options));
  protected readonly value = signal('');
  protected readonly disabled = signal(false);
  protected readonly open = signal(false);
  protected readonly active = signal(0);
  protected readonly selected = computed(() =>
    this.options().find((option) => option.value === this.value()),
  );
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private search = '';
  private lastTyped = 0;

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }
  registerOnChange(callback: (value: string) => void): void {
    this.onChange = callback;
  }
  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }
  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
    if (disabled) this.open.set(false);
  }

  protected optionId(value: string): string {
    return `${this.inputId()}-option-${encodeURIComponent(value)}`;
  }
  protected activeId(): string | null {
    const option = this.options()[this.active()];
    return this.open() && option ? this.optionId(option.value) : null;
  }
  protected toggle(): void {
    if (this.disabled()) return;
    if (this.open()) this.open.set(false);
    else this.show();
  }
  private show(): void {
    this.search = '';
    const selectedIndex = this.options().findIndex((option) => option.value === this.value());
    this.active.set(Math.max(0, selectedIndex));
    this.open.set(true);
    this.revealActive();
  }
  protected choose(option: SelectOption): void {
    if (this.disabled()) return;
    this.value.set(option.value);
    this.onChange(option.value);
    this.onTouched();
    this.open.set(false);
    this.element.nativeElement.querySelector<HTMLButtonElement>('button')?.focus();
  }
  protected keydown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    const count = this.options().length;
    if (!count) return;
    if (event.key === 'Tab') {
      this.open.set(false);
      return;
    }
    if (event.key === 'Escape') {
      if (this.open()) {
        event.preventDefault();
        event.stopPropagation();
        this.open.set(false);
      }
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!this.open()) this.show();
      else this.choose(this.options()[this.active()]);
      return;
    }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const wasOpen = this.open();
      if (!wasOpen) this.show();
      if (event.key === 'Home') this.active.set(0);
      else if (event.key === 'End') this.active.set(count - 1);
      else if (wasOpen)
        this.active.update((index) =>
          Math.max(0, Math.min(count - 1, index + (event.key === 'ArrowDown' ? 1 : -1))),
        );
      else if (event.key === 'ArrowUp' && !this.value()) this.active.set(count - 1);
      this.revealActive();
      return;
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      if (!this.open()) this.show();
      const now = Date.now();
      this.search = now - this.lastTyped < 750 ? this.search + event.key : event.key;
      this.lastTyped = now;
      const index = this.options().findIndex((option) =>
        option.label.toLocaleLowerCase().startsWith(this.search.toLocaleLowerCase()),
      );
      if (index >= 0) {
        this.active.set(index);
        this.revealActive();
      }
    }
  }
  private revealActive(): void {
    afterNextRender(
      () => {
        const id = this.activeId();
        if (!id) return;
        this.element.nativeElement.ownerDocument
          .getElementById(id)
          ?.scrollIntoView?.({ block: 'nearest' });
      },
      { injector: this.injector },
    );
  }
  protected outsidePointer(event: PointerEvent): void {
    if (this.open() && !this.element.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
      this.onTouched();
    }
  }
  protected focusOut(event: FocusEvent): void {
    if (!this.element.nativeElement.contains(event.relatedTarget as Node | null)) {
      this.open.set(false);
      this.onTouched();
    }
  }
}
