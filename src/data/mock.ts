import type { Account, Transaction, PaymentRecipient, Service, Company, University, Bank, ExchangeRate } from '@/types';

export const mockAccount: Account = {
  id: '1',
  balance: 15420.50,
  currency: 'PEN',
  currencySymbol: 'S/',
  accountNumber: '****7842',
  type: 'checking',
};

export const mockTransactions: Transaction[] = [
  {
    id: '1', type: 'send', category: 'phone', amount: 150.00, currency: 'PEN', currencySymbol: 'S/',
    description: 'Pago a María López', recipient: 'María López', status: 'completed',
    date: '2026-04-16', time: '14:32', transactionCode: 'TXN-2026041601', balanceAfter: 15270.50,
  },
  {
    id: '2', type: 'receive', category: 'phone', amount: 500.00, currency: 'PEN', currencySymbol: 'S/',
    description: 'Transferencia de Carlos Ruiz', recipient: 'Carlos Ruiz', status: 'completed',
    date: '2026-04-15', time: '10:15', transactionCode: 'TXN-2026041502', balanceAfter: 15420.50,
  },
  {
    id: '3', type: 'payment', category: 'service', amount: 89.90, currency: 'PEN', currencySymbol: 'S/',
    description: 'Pago de luz - Enel', recipient: 'Enel', status: 'completed',
    date: '2026-04-14', time: '09:00', transactionCode: 'TXN-2026041403', balanceAfter: 14920.50,
  },
  {
    id: '4', type: 'payment', category: 'university', amount: 2500.00, currency: 'PEN', currencySymbol: 'S/',
    description: 'Pensión - PUCP', recipient: 'PUCP', status: 'completed',
    date: '2026-04-12', time: '16:45', transactionCode: 'TXN-2026041204', balanceAfter: 15010.40,
  },
  {
    id: '5', type: 'send', category: 'bank_international', amount: 200.00, currency: 'USD', currencySymbol: '$',
    description: 'Transferencia internacional', recipient: 'John Smith', recipientBank: 'Chase Bank',
    status: 'pending', date: '2026-04-11', time: '11:30', transactionCode: 'TXN-2026041105',
    convertedAmount: 760.00, convertedCurrency: 'PEN', exchangeRate: 3.80, fee: 15.00,
  },
  {
    id: '6', type: 'payment', category: 'company', amount: 320.00, currency: 'PEN', currencySymbol: 'S/',
    description: 'Pago a Movistar', recipient: 'Movistar', status: 'completed',
    date: '2026-04-10', time: '08:20', transactionCode: 'TXN-2026041006', balanceAfter: 17510.40,
  },
];

export const mockRecipients: PaymentRecipient[] = [
  { id: '1', name: 'María López', phone: '987654321', isFavorite: true },
  { id: '2', name: 'Carlos Ruiz', phone: '912345678', isFavorite: true },
  { id: '3', name: 'Ana García', phone: '956789012', isFavorite: false },
  { id: '4', name: 'Pedro Sánchez', phone: '943210987', bank: 'BCP', accountNumber: '****4521', isFavorite: true },
];

export const mockServices: Service[] = [
  { id: '1', name: 'Luz', category: 'Servicios básicos', icon: 'Zap' },
  { id: '2', name: 'Agua', category: 'Servicios básicos', icon: 'Droplets' },
  { id: '3', name: 'Gas', category: 'Servicios básicos', icon: 'Flame' },
  { id: '4', name: 'Internet', category: 'Telecomunicaciones', icon: 'Wifi' },
  { id: '5', name: 'Celular', category: 'Telecomunicaciones', icon: 'Smartphone' },
  { id: '6', name: 'Cable', category: 'Telecomunicaciones', icon: 'Tv' },
];

export const mockCompanies: Company[] = [
  { id: '1', name: 'Movistar', category: 'Telecomunicaciones' },
  { id: '2', name: 'Claro', category: 'Telecomunicaciones' },
  { id: '3', name: 'Entel', category: 'Telecomunicaciones' },
  { id: '4', name: 'Rimac Seguros', category: 'Seguros' },
  { id: '5', name: 'La Positiva', category: 'Seguros' },
  { id: '6', name: 'Enel', category: 'Energía' },
];

export const mockUniversities: University[] = [
  { id: '1', name: 'PUCP', concepts: ['Pensión', 'Matrícula', 'Certificados', 'Constancias'] },
  { id: '2', name: 'Universidad de Lima', concepts: ['Pensión', 'Matrícula', 'Trámites'] },
  { id: '3', name: 'UPC', concepts: ['Pensión', 'Matrícula', 'Carnet', 'Otros'] },
  { id: '4', name: 'USIL', concepts: ['Pensión', 'Matrícula', 'Trámites administrativos'] },
];

export const mockBanks: Bank[] = [
  { id: '1', name: 'BCP', country: 'Perú', isInternational: false },
  { id: '2', name: 'Interbank', country: 'Perú', isInternational: false },
  { id: '3', name: 'BBVA', country: 'Perú', isInternational: false },
  { id: '4', name: 'Scotiabank', country: 'Perú', isInternational: false },
  { id: '5', name: 'Chase Bank', country: 'Estados Unidos', swiftCode: 'CHASUS33', isInternational: true },
  { id: '6', name: 'Bank of America', country: 'Estados Unidos', swiftCode: 'BOFAUS3N', isInternational: true },
  { id: '7', name: 'Santander', country: 'España', swiftCode: 'BSCHESMMXXX', isInternational: true },
  { id: '8', name: 'HSBC', country: 'Reino Unido', swiftCode: 'HSBCGB2L', isInternational: true },
];

export const mockExchangeRates: ExchangeRate[] = [
  { from: 'PEN', to: 'USD', rate: 0.2632, updatedAt: '2026-04-16T14:00:00Z' },
  { from: 'PEN', to: 'EUR', rate: 0.2410, updatedAt: '2026-04-16T14:00:00Z' },
  { from: 'USD', to: 'PEN', rate: 3.80, updatedAt: '2026-04-16T14:00:00Z' },
  { from: 'EUR', to: 'PEN', rate: 4.15, updatedAt: '2026-04-16T14:00:00Z' },
];

export const currencies = [
  { code: 'PEN', symbol: 'S/', name: 'Sol peruano' },
  { code: 'USD', symbol: '$', name: 'Dólar americano' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
];
