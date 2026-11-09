export interface Branch {
  id: 'navanagar' | 'srinagar' | 'saptapur' | 'gandhi-chowk' | 'siddeshwar-park';
  name: string;
  area: string;
  phone: string;
  whatsapp: string;
  mapsUrl: string;
  partner?: boolean;
}

// Canonical business details. Display names and areas are translated separately.
export const BRANCHES: readonly Branch[] = [
  {
    id: 'navanagar',
    name: 'Namo Generic Medicals',
    area: 'Navanagar, Hubli',
    phone: '919538352054',
    whatsapp: '919538352054',
    mapsUrl: 'https://maps.app.goo.gl/J5rwZ4FW3jhqnJ948',
  },
  {
    id: 'srinagar',
    name: 'Namo Generic Medicals',
    area: 'Srinagar, Dharwad',
    phone: '918892758915',
    whatsapp: '918892758915',
    mapsUrl: '',
  },
  {
    id: 'saptapur',
    name: 'Namo Generic Medicals',
    area: 'Saptapur, Dharwad',
    phone: '918892758915',
    whatsapp: '918892758915',
    mapsUrl: '',
  },
  {
    id: 'siddeshwar-park',
    partner: true,
    name: 'Cure Genericart Medicals',
    area: 'Siddeshwar Park, Hubli',
    phone: '916360104894',
    whatsapp: '916360104894',
    mapsUrl: 'https://maps.app.goo.gl/bEpSi4Yqhar4Emke8',
  },
  {
    id: 'gandhi-chowk',
    partner: true,
    name: 'Cure Generic Medicals',
    area: 'Gandhi Chowk, Dharwad',
    phone: '918892758875',
    whatsapp: '918892758875',
    mapsUrl: 'https://maps.app.goo.gl/fBEcme2aT4UX6sMc9',
  },
];
