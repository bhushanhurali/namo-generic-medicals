import { TestBed } from '@angular/core/testing';
import { ContactSection } from './contact-section';
import { BRANCHES } from '../../data/branches';

describe('ContactSection', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ContactSection] });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  async function setup() {
    const fixture = TestBed.createComponent(ContactSection);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const form = root.querySelector('form')!;
    const fill = (id: string, value: string) => {
      if (id === 'branch') {
        (root.querySelector('#enquiry-branch') as HTMLButtonElement).click();
        fixture.detectChanges();
        (root.querySelector(`#enquiry-branch-option-${value}`) as HTMLElement).click();
        return;
      }
      const field = root.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        `#enquiry-${id}`,
      )!;
      field.value = value;
      field.dispatchEvent(
        new Event(field.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }),
      );
    };
    const submit = () =>
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    return { fixture, root, fill, submit };
  }

  it('uses the exact phone, WhatsApp, and available map links for all five pharmacies', async () => {
    const { root } = await setup();
    expect(root.querySelectorAll('app-branch-card').length).toBe(5);
    for (const branch of BRANCHES) {
      const card = root.querySelector(`#branch-${branch.id}`)!;
      expect(card.querySelector<HTMLAnchorElement>('a.phone')?.getAttribute('href')).toBe(
        `tel:+${branch.phone}`,
      );
      const whatsapp = card.querySelector<HTMLAnchorElement>('a[appButton]')!;
      expect(new URL(whatsapp.href).pathname).toBe(`/${branch.whatsapp}`);
      const map = card.querySelector<HTMLAnchorElement>('a.map');
      if (branch.mapsUrl) expect(map?.getAttribute('href')).toBe(branch.mapsUrl);
      else {
        expect(map).toBeNull();
        expect(card.textContent).toContain('Map pin coming soon');
      }
    }
  });

  it('shows validation and never opens WhatsApp for an empty form', async () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    const { fixture, root, submit } = await setup();
    submit();
    await fixture.whenStable();
    expect(open).not.toHaveBeenCalled();
    expect(root.querySelector('#enquiry-name')?.getAttribute('aria-invalid')).toBe('true');
    expect(root.querySelector('#branch-error')?.textContent).toContain('Choose a pharmacy');
  });

  it('rejects whitespace-only enquiries and phone numbers without digits', async () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    const { fixture, fill, submit } = await setup();
    fill('name', '   ');
    fill('phone', '-------');
    fill('branch', 'srinagar');
    fill('message', '   ');
    submit();
    await fixture.whenStable();
    expect(open).not.toHaveBeenCalled();
  });

  it('prepares an encoded draft addressed to the selected partner pharmacy', async () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    const { fixture, fill, submit } = await setup();
    fill('name', ' Test User ');
    fill('phone', '+91 9876543210');
    fill('branch', 'gandhi-chowk');
    fill('message', ' Price & availability?\nPickup tomorrow. ');
    submit();
    await fixture.whenStable();
    expect(open).toHaveBeenCalledOnce();
    const [address, target, features] = open.mock.calls[0];
    const url = new URL(String(address));
    expect(url.origin).toBe('https://wa.me');
    expect(url.pathname).toBe('/918892758875');
    const message = url.searchParams.get('text')!;
    expect(message).toContain('Cure Generic Medicals — Gandhi Chowk, Dharwad');
    expect(message).toContain('Patient / full name: Test User');
    expect(message).toContain('Price & availability?\nPickup tomorrow.');
    expect(target).toBe('_blank');
    expect(features).toBe('noopener,noreferrer');
  });
});
