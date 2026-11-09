import { Component } from '@angular/core';
import { SERVICES_CONTENT } from '../../content/services-content';
import { Icon, IconName } from '../../shared/components/icon/icon';
import { ButtonDirective } from '../../shared/directives/button/button.directive';

@Component({
  imports: [Icon, ButtonDirective],
  selector: 'app-services-section',
  templateUrl: './services-section.html',
  styleUrl: './services-section.scss',
})
export class ServicesSection {
  protected readonly content = SERVICES_CONTENT;
  protected readonly services = [
    {
      icon: 'medical-cross',
      title: this.content.genericTitle,
      description: this.content.genericDescription,
    },
    {
      icon: 'prescription',
      title: this.content.prescriptionTitle,
      description: this.content.prescriptionDescription,
    },
    {
      icon: 'delivery',
      title: this.content.deliveryTitle,
      description: this.content.deliveryDescription,
    },
    {
      icon: 'search',
      title: this.content.availabilityTitle,
      description: this.content.availabilityDescription,
    },
    {
      icon: 'whatsapp',
      title: this.content.whatsappTitle,
      description: this.content.whatsappDescription,
    },
    {
      icon: 'heart',
      title: this.content.healthcareTitle,
      description: this.content.healthcareDescription,
    },
  ] satisfies { icon: IconName; title: string; description: string }[];
  protected readonly steps = [
    {
      number: '01',
      title: this.content.contactTitle,
      description: this.content.contactDescription,
    },
    {
      number: '02',
      title: this.content.confirmTitle,
      description: this.content.confirmDescription,
    },
    { number: '03', title: this.content.pickupTitle, description: this.content.pickupDescription },
  ];
}
