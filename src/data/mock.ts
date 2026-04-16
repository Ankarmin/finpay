import type {
  Account,
  Transaction,
  PaymentRecipient,
  Service,
  Company,
  University,
  InternationalTransferCountry,
} from '@/types';

export const mockAccount: Account = {
  id: '1',
  balance: 15420.50,
  currency: 'PEN',
  accountNumber: '****7842',
  type: 'checking',
};

export const mockTransactions: Transaction[] = [
  {
    id: '1', type: 'send', category: 'phone', amount: 150.00, currency: 'PEN',
    description: 'Pago a María López', recipient: 'María López', status: 'completed',
    date: '2026-04-16', time: '14:32', transactionCode: 'TXN-2026041601', balanceAfter: 15270.50,
  },
  {
    id: '2', type: 'receive', category: 'phone', amount: 500.00, currency: 'PEN',
    description: 'Transferencia de Carlos Ruiz', recipient: 'Carlos Ruiz', status: 'completed',
    date: '2026-04-15', time: '10:15', transactionCode: 'TXN-2026041502', balanceAfter: 15420.50,
  },
  {
    id: '3', type: 'payment', category: 'service', amount: 89.90, currency: 'PEN',
    description: 'Pago de luz - Enel', recipient: 'Enel', status: 'completed',
    date: '2026-04-14', time: '09:00', transactionCode: 'TXN-2026041403', balanceAfter: 14920.50,
  },
  {
    id: '4', type: 'payment', category: 'university', amount: 2500.00, currency: 'PEN',
    description: 'Pensión - PUCP', recipient: 'PUCP', status: 'completed',
    date: '2026-04-12', time: '16:45', transactionCode: 'TXN-2026041204', balanceAfter: 15010.40,
  },
  {
    id: '5', type: 'send', category: 'bank_international', amount: 200.00, currency: 'USD',
    description: 'Transferencia internacional', recipient: 'John Smith', recipientBank: 'Chase Bank',
    status: 'pending', date: '2026-04-11', time: '11:30', transactionCode: 'TXN-2026041105',
    convertedAmount: 760.00, convertedCurrency: 'PEN', exchangeRate: 3.80, fee: 15.00,
  },
  {
    id: '6', type: 'payment', category: 'company', amount: 320.00, currency: 'PEN',
    description: 'Pago a Movistar', recipient: 'Movistar', status: 'completed',
    date: '2026-04-10', time: '08:20', transactionCode: 'TXN-2026041006', balanceAfter: 17510.40,
  },
];

export const mockRecipients: PaymentRecipient[] = [
  { id: '1', name: 'María López', phone: '987654321', isFavorite: true },
  { id: '2', name: 'Carlos Ruiz', phone: '912345678', isFavorite: true },
  { id: '3', name: 'Ana García', phone: '956789012', isFavorite: false },
  { id: '4', name: 'Pedro Sánchez', phone: '943210987', isFavorite: true },
];

export const mockServices: Service[] = [
  { id: 'power', name: 'Luz', category: 'Servicios básicos', icon: 'Zap' },
  { id: 'water', name: 'Agua', category: 'Servicios básicos', icon: 'Droplets' },
  { id: 'gas', name: 'Gas', category: 'Servicios básicos', icon: 'Flame' },
  { id: 'internet', name: 'Internet', category: 'Telecomunicaciones', icon: 'Wifi' },
  { id: 'mobile', name: 'Celular', category: 'Telecomunicaciones', icon: 'Smartphone' },
  { id: 'tv', name: 'Cable', category: 'Telecomunicaciones', icon: 'Tv' },
  { id: 'insurance', name: 'Seguros', category: 'Protección', icon: 'Shield' },
];

export const mockCompanies: Company[] = [
  { id: 'movistar', name: 'Movistar', category: 'Telecomunicaciones', serviceIds: ['internet', 'mobile', 'tv'] },
  { id: 'claro', name: 'Claro', category: 'Telecomunicaciones', serviceIds: ['internet', 'mobile', 'tv'] },
  { id: 'entel', name: 'Entel', category: 'Telecomunicaciones', serviceIds: ['internet', 'mobile'] },
  { id: 'directv', name: 'DirecTV', category: 'Televisión', serviceIds: ['tv'] },
  { id: 'enel', name: 'Enel', category: 'Energía', serviceIds: ['power'] },
  { id: 'luz-del-sur', name: 'Luz del Sur', category: 'Energía', serviceIds: ['power'] },
  { id: 'sedapal', name: 'Sedapal', category: 'Agua', serviceIds: ['water'] },
  { id: 'calidda', name: 'Cálidda', category: 'Gas', serviceIds: ['gas'] },
  { id: 'rimac', name: 'Rimac Seguros', category: 'Seguros', serviceIds: ['insurance'] },
  { id: 'positiva', name: 'La Positiva', category: 'Seguros', serviceIds: ['insurance'] },
];

export const mockUniversities: University[] = [
  { id: '1', name: 'PUCP', concepts: ['Pensión', 'Matrícula', 'Certificados', 'Constancias'] },
  { id: '2', name: 'Universidad de Lima', concepts: ['Pensión', 'Matrícula', 'Trámites'] },
  { id: '3', name: 'UPC', concepts: ['Pensión', 'Matrícula', 'Carnet', 'Otros'] },
  { id: '4', name: 'USIL', concepts: ['Pensión', 'Matrícula', 'Trámites administrativos'] },
  { id: '5', name: 'UNMSM', concepts: ['Matrícula', 'Pensión', 'Derechos académicos', 'Constancias'] },
];

export const mockBanks = [
  { id: '1', name: 'BCP', country: 'Perú', isInternational: false },
  { id: '2', name: 'Interbank', country: 'Perú', isInternational: false },
  { id: '3', name: 'BBVA', country: 'Perú', isInternational: false },
  { id: '4', name: 'Scotiabank', country: 'Perú', isInternational: false },
];

export const mockInternationalTransferCountries: InternationalTransferCountry[] = [
  {
    id: 'us',
    name: 'Estados Unidos',
    flag: '🇺🇸',
    currency: 'USD',
    banks: [
      {
        id: 'chase',
        name: 'Chase Bank',
        country: 'Estados Unidos',
        currency: 'USD',
        exchangeRate: 0.2665,
        commission: 4.5,
        swiftCode: 'CHASUS33',
        updatedAt: '2026-04-16T14:00:00Z',
      },
      {
        id: 'boa',
        name: 'Bank of America',
        country: 'Estados Unidos',
        currency: 'USD',
        exchangeRate: 0.2648,
        commission: 3.9,
        swiftCode: 'BOFAUS3N',
        updatedAt: '2026-04-16T14:00:00Z',
      },
    ],
  },
  {
    id: 'es',
    name: 'España',
    flag: '🇪🇸',
    currency: 'EUR',
    banks: [
      {
        id: 'santander',
        name: 'Santander',
        country: 'España',
        currency: 'EUR',
        exchangeRate: 0.2435,
        commission: 3.2,
        swiftCode: 'BSCHESMMXXX',
        updatedAt: '2026-04-16T14:00:00Z',
      },
      {
        id: 'bbva-es',
        name: 'BBVA España',
        country: 'España',
        currency: 'EUR',
        exchangeRate: 0.2421,
        commission: 2.8,
        swiftCode: 'BBVAESMMXXX',
        updatedAt: '2026-04-16T14:00:00Z',
      },
    ],
  },
  {
    id: 'mx',
    name: 'México',
    flag: '🇲🇽',
    currency: 'MXN',
    banks: [
      {
        id: 'bbva-mx',
        name: 'BBVA México',
        country: 'México',
        currency: 'MXN',
        exchangeRate: 5.18,
        commission: 44,
        swiftCode: 'BCMRMXMM',
        updatedAt: '2026-04-16T14:00:00Z',
      },
      {
        id: 'banorte',
        name: 'Banorte',
        country: 'México',
        currency: 'MXN',
        exchangeRate: 5.11,
        commission: 36,
        swiftCode: 'MENOMXMT',
        updatedAt: '2026-04-16T14:00:00Z',
      },
    ],
  },
  {
    id: 'uk',
    name: 'Reino Unido',
    flag: '🇬🇧',
    currency: 'GBP',
    banks: [
      {
        id: 'hsbc-uk',
        name: 'HSBC UK',
        country: 'Reino Unido',
        currency: 'GBP',
        exchangeRate: 0.2084,
        commission: 2.6,
        swiftCode: 'HBUKGB4B',
        updatedAt: '2026-04-16T14:00:00Z',
      },
      {
        id: 'barclays',
        name: 'Barclays',
        country: 'Reino Unido',
        currency: 'GBP',
        exchangeRate: 0.2068,
        commission: 0,
        swiftCode: 'BARCGB22',
        updatedAt: '2026-04-16T14:00:00Z',
      },
    ],
  },
];
