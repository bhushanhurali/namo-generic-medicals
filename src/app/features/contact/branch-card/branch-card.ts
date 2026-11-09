import { Component, computed, input } from '@angular/core';
import { BRANCH_LABELS, CONTACT_CONTENT } from '../../../content/contact-content';
import { Branch } from '../../../data/branches';
import { Icon } from '../../../shared/components/icon/icon';
import { ButtonDirective } from '../../../shared/directives/button/button.directive';
import { displayPhone, phoneUrl, whatsappUrl } from '../../../shared/utils/contact-links';

@Component({
  imports: [Icon, ButtonDirective],
  selector: 'app-branch-card',
  templateUrl: './branch-card.html',
  styleUrl: './branch-card.scss',
})
export class BranchCard {
  readonly branch = input.required<Branch>();
  protected readonly content = CONTACT_CONTENT;
  protected readonly label = computed(() => BRANCH_LABELS[this.branch().id]);
  protected readonly whatsapp = computed(() => whatsappUrl(this.branch(), this.content.greeting));
  protected readonly phone = computed(() => phoneUrl(this.branch()));
  protected readonly phoneLabel = computed(() => displayPhone(this.branch()));
}
