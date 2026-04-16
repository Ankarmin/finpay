export const formatMoney = (value: number, currency = 'PEN') => (
  new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
);

export const getCurrencySymbol = (currency: string) => {
  if (currency === 'PEN') return 'S/';
  if (currency === 'USD') return '$';
  if (currency === 'EUR') return '€';
  if (currency === 'GBP') return '£';
  return currency;
};
