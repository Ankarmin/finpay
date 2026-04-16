export interface Account {
  id: string;
  balance: number;
  currency: string;
  currencySymbol: string;
  accountNumber: string;
  type: 'checking' | 'savings';
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'payment' | 'transfer';
  category: 'phone' | 'qr' | 'service' | 'company' | 'university' | 'bank_national' | 'bank_international' | 'interbank_foreign';
  amount: number;
  currency: string;
  currencySymbol: string;
  convertedAmount?: number;
  convertedCurrency?: string;
  exchangeRate?: number;
  description: string;
  recipient?: string;
  recipientBank?: string;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  date: string;
  time: string;
  transactionCode: string;
  fee?: number;
  balanceAfter?: number;
}

export interface PaymentRecipient {
  id: string;
  name: string;
  phone?: string;
  bank?: string;
  accountNumber?: string;
  avatar?: string;
  isFavorite?: boolean;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  icon: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  category: string;
   serviceIds: string[];
}

export interface University {
  id: string;
  name: string;
  logo?: string;
  concepts: string[];
}

export interface InternationalTransferBank {
  id: string;
  name: string;
  country: string;
  currency: string;
  exchangeRate: number;
  commission?: number;
  swiftCode?: string;
  updatedAt: string;
}

export interface InternationalTransferCountry {
  id: string;
  name: string;
  flag: string;
  currency: string;
  banks: InternationalTransferBank[];
}

export type PaymentStep = 'form' | 'summary' | 'biometric' | 'processing' | 'receipt';

export interface PaymentData {
  recipient: string;
  recipientDetail?: string;
  amount: number;
  currency: string;
  convertedAmount?: number;
  convertedCurrency?: string;
  exchangeRate?: number;
  fee: number;
  total: number;
  method: string;
  bank?: string;
  company?: string;
  university?: string;
  concept?: string;
  description?: string;
}
