import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { PaymentSummary } from '@/components/fintech/PaymentSummary';
import { BiometricVerify } from '@/components/fintech/BiometricVerify';
import { ReceiptScreen } from '@/components/fintech/ReceiptScreen';
import { Button } from '@/components/ui/button';
import { mockBanks, mockAccount, mockExchangeRates, currencies } from '@/data/mock';
import type { PaymentStep, PaymentData } from '@/types';
import { Loader2, Search, ArrowLeftRight, ArrowRightLeft, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const PayInterbankPage = () => {
  const [step, setStep] = useState<PaymentStep>('form');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [recipientName, setRecipientName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const intlBanks = mockBanks.filter(b => b.isInternational);
  const bank = intlBanks.find(b => b.id === selectedBank);
  const filtered = intlBanks.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  const reverseRate = mockExchangeRates.find(r => r.from === currency && r.to === 'PEN');
  const amountNum = parseFloat(amount) || 0;
  const convertedAmount = reverseRate ? amountNum * reverseRate.rate : amountNum;
  const fee = 25;

  const paymentData: PaymentData = {
    recipient: recipientName,
    recipientDetail: accountNumber,
    amount: amountNum,
    currency,
    convertedAmount,
    convertedCurrency: 'PEN',
    exchangeRate: reverseRate?.rate,
    fee,
    total: convertedAmount + fee,
    method: 'Pago interbancario al extranjero',
    bank: bank?.name,
  };

  const handleNext = () => {
    if (!selectedBank) { setError('Selecciona un banco'); return; }
    if (!recipientName) { setError('Ingresa el nombre del destinatario'); return; }
    if (!accountNumber) { setError('Ingresa el número de cuenta'); return; }
    if (!amount || amountNum <= 0) { setError('Ingresa un monto válido'); return; }
    if (paymentData.total > mockAccount.balance) { setError('Saldo insuficiente'); return; }
    setStep('summary');
  };

  const handleConfirm = () => setStep('biometric');

  if (step === 'biometric') return <AppLayout showNav={false}><PageHeader title="Verificación" /><BiometricVerify onVerified={() => { setStep('processing'); setTimeout(() => setStep('receipt'), 2000); }} onCancel={() => setStep('summary')} /></AppLayout>;
  if (step === 'processing') return <AppLayout showNav={false}><div className="flex min-h-[60vh] flex-col items-center justify-center animate-fade-in"><Loader2 className="h-12 w-12 animate-spin text-primary mb-4" /><p className="text-foreground font-semibold">Procesando pago interbancario...</p></div></AppLayout>;
  if (step === 'receipt') return <AppLayout showNav={false}><PageHeader title="Comprobante" showBack={false} /><ReceiptScreen data={paymentData} transactionCode={`TXN-IB-${Date.now()}`} balanceAfter={mockAccount.balance - paymentData.total} status="pending" /></AppLayout>;
  if (step === 'summary') return (
    <AppLayout showNav={false}>
      <PageHeader title="Confirmar pago" onBack={() => setStep('form')} />
      <div className="px-4 py-4 mx-auto max-w-lg space-y-4 animate-fade-in">
        <div className="flex items-center gap-2 rounded-lg border border-warning/30 bg-amber-50 p-3 text-xs text-warning">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Operación interbancaria al extranjero. Requiere verificación biométrica.
        </div>
        <PaymentSummary data={paymentData} showBiometric />
        <div className="flex items-center justify-between rounded-lg bg-accent p-3 text-sm"><span className="text-muted-foreground">Saldo disponible (PEN)</span><span className="font-semibold text-foreground">S/ {mockAccount.balance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span></div>
        <Button size="xl" className="w-full" onClick={handleConfirm}>Confirmar</Button>
        <Button variant="ghost" className="w-full" onClick={() => setStep('form')}>Editar</Button>
      </div>
    </AppLayout>
  );

  return (
    <AppLayout showNav={false}>
      <PageHeader title="Interbancario al extranjero" />
      <div className="px-4 py-4 mx-auto max-w-lg space-y-4 animate-fade-in">
        {!selectedBank ? (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="Buscar banco..." value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="space-y-2">
              {filtered.map(b => (
                <button key={b.id} onClick={() => setSelectedBank(b.id)} className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/30 active:scale-95">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600"><ArrowLeftRight className="h-5 w-5" /></div>
                  <div><p className="text-sm font-medium text-foreground">{b.name}</p><p className="text-xs text-muted-foreground">{b.country}</p></div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 rounded-xl bg-accent p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600"><ArrowLeftRight className="h-5 w-5" /></div>
              <div className="flex-1"><p className="text-sm font-medium text-foreground">{bank?.name}</p><p className="text-xs text-muted-foreground">{bank?.country}</p></div>
              <button onClick={() => setSelectedBank(null)} className="text-xs text-primary font-medium">Cambiar</button>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Nombre del destinatario</label>
              <input type="text" value={recipientName} onChange={e => { setRecipientName(e.target.value); setError(''); }} className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Número de cuenta</label>
              <input type="text" value={accountNumber} onChange={e => { setAccountNumber(e.target.value); setError(''); }} className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Moneda</label>
              <div className="flex gap-2">
                {currencies.filter(c => c.code !== 'PEN').map(c => (
                  <button key={c.code} onClick={() => setCurrency(c.code)} className={cn("flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-colors", currency === c.code ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>{c.symbol} {c.code}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Monto ({currency})</label>
              <input type="number" placeholder="0.00" value={amount} onChange={e => { setAmount(e.target.value); setError(''); }} className="w-full rounded-xl border border-border bg-card px-4 py-3 text-2xl font-bold focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            {amountNum > 0 && reverseRate && (
              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><ArrowRightLeft className="h-4 w-4 text-primary" /> Conversión</div>
                <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Tipo de cambio</span><span className="font-medium text-foreground">1 {currency} = S/ {reverseRate.rate.toFixed(2)}</span></div>
                <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Equivalente PEN</span><span className="font-bold text-foreground">S/ {convertedAmount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span></div>
                <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Comisión</span><span className="font-medium text-foreground">S/ {fee.toFixed(2)}</span></div>
                <div className="border-t border-border pt-2 flex items-center justify-between text-sm"><span className="font-semibold">Total a debitar</span><span className="font-bold text-primary">S/ {(convertedAmount + fee).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span></div>
              </div>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button size="xl" className="w-full" onClick={handleNext}>Continuar</Button>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default PayInterbankPage;
