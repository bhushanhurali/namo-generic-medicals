import { Branch } from '../../data/branches';

export function whatsappUrl(branch: Branch, message: string): string {
  return `https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function phoneUrl(branch: Branch): string {
  return `tel:+${branch.phone}`;
}

export function displayPhone(branch: Branch): string {
  return `+${branch.phone.slice(0, 2)} ${branch.phone.slice(2)}`;
}
