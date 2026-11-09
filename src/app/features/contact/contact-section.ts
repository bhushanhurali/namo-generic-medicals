import { Component, DOCUMENT, ElementRef, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { BRANCH_LABELS, CONTACT_CONTENT } from '../../content/contact-content';
import { BRANCHES } from '../../data/branches';
import { Icon } from '../../shared/components/icon/icon';
import { ButtonDirective } from '../../shared/directives/button/button.directive';
import { whatsappUrl } from '../../shared/utils/contact-links';
import { Select, SelectGroup } from '../../shared/components/select/select';
import { BranchCard } from './branch-card/branch-card';

const requiredText: ValidatorFn = (control) => (control.value?.trim() ? null : { required: true });
const phoneNumber: ValidatorFn = (control) => {
  const value: string = control.value ?? '';
  const digits = value.replace(/\D/g, '');
  return /^\+?[\d ()-]{7,20}$/.test(value) && digits.length >= 7 && digits.length <= 15
    ? null
    : { phone: true };
};
const knownBranch: ValidatorFn = (control) =>
  BRANCHES.some((branch) => branch.id === control.value) ? null : { branch: true };

@Component({
  imports: [ReactiveFormsModule, BranchCard, Icon, ButtonDirective, Select],
  selector: 'app-contact-section',
  templateUrl: './contact-section.html',
  styleUrl: './contact-section.scss',
})
export class ContactSection {
  protected readonly content = CONTACT_CONTENT;
  protected readonly labels = BRANCH_LABELS;
  protected readonly namoBranches = BRANCHES.filter((branch) => !branch.partner);
  protected readonly partnerBranches = BRANCHES.filter((branch) => branch.partner);
  protected readonly branchGroups: readonly SelectGroup[] = [
    {
      label: this.content.branchesTitle,
      options: this.namoBranches.map((branch) => ({
        value: branch.id,
        label: this.labels[branch.id].area,
      })),
    },
    {
      label: this.content.partnersTitle,
      options: this.partnerBranches.map((branch) => ({
        value: branch.id,
        label: this.labels[branch.id].area,
      })),
    },
  ];
  private readonly builder = inject(FormBuilder).nonNullable;
  private readonly document = inject(DOCUMENT);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly form = this.builder.group({
    name: ['', [requiredText, Validators.maxLength(100)]],
    phone: ['', [phoneNumber]],
    branch: ['', [knownBranch]],
    message: ['', [requiredText, Validators.maxLength(1000)]],
  });

  protected invalid(field: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[field];
    return control.invalid && control.touched;
  }

  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      const field = (Object.keys(this.form.controls) as (keyof typeof this.form.controls)[]).find(
        (key) => this.form.controls[key].invalid,
      );
      this.element.nativeElement.querySelector<HTMLElement>(`#enquiry-${field}`)?.focus();
      return;
    }
    const value = this.form.getRawValue();
    const branch = BRANCHES.find((item) => item.id === value.branch);
    if (!branch) return;
    const label = this.labels[branch.id];
    const message = [
      this.content.greeting,
      `${this.content.branchMessageLabel}: ${label.name} — ${label.area}`,
      `${this.content.nameLabel}: ${value.name.trim()}`,
      `${this.content.phoneLabel}: ${value.phone.trim()}`,
      `${this.content.enquiryMessageLabel}: ${value.message.trim()}`,
    ].join('\n');
    // Opens a draft only. The visitor reviews and sends it in WhatsApp.
    this.document.defaultView?.open(whatsappUrl(branch, message), '_blank', 'noopener,noreferrer');
  }
}
