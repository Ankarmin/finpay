import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { PaymentSummary } from '@/components/fintech/PaymentSummary';
import { BiometricVerify } from '@/components/fintech/BiometricVerify';
import { ReceiptScreen } from '@/components/fintech/ReceiptScreen';
import { Button } from '@/components/ui/button';
import { mockBanks, mockAccount } from '@/data/mock';
import type { PaymentStep, PaymentData } from '@/types';
import { Loader2, Search, Landmark } from 'lucide-react';

const PayBanksPage = () => {
  const [step, setStep] = useState<PaymentStep>('form');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const nationalBanks = mockBanks.filter(b => !b.isInternational);
  const bank = nationalBanks.find(b => b.id === selectedBank);
  const filtered = nationalBanks.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  const paymentData: PaymentData = {
    recipient: recipientName,
    recipientDetail: accountNumber,
    amount: parseFloat(amount) || 0,
    currency: 'PEN',
    fee: parseFloat(amount) >= 1000 ? 3.50 : 0,
    total: (parseFloat(amount) || 0) + (parseFloat(amount) >= 1000 ? 3.50 : 0),
    method: 'Transferencia bancaria nacional',
    bank: bank?.name,
  };

  const handleNext = () => {
    if (!selectedBank) { setError('Selecciona un banco'); return; }
    if (!accountNumber) { setError('Ingresa el número de cuenta'); return; }
    if (!recipientName) { setError('Ingresa el nombre del destinatario'); return; }
    if (!amount || parseFloat(amount) <= 0) { setError('Ingresa un monto válido'); return; }
    if (paymentData.total > mockAccount.balance) { setError('Saldo insuficiente'); return; }
    setStep('summary');
  };

  const handleConfirm = () => {
    if (parseFloat(amount) >= 1000) {
      setStep('biometric');
    } else {
      setStep('processing');
      setTimeout(() => setStep('receipt'), 1500);
    }
  };

  if (step === 'biometric') return <AppLayout showNav={false}><PageHeader title="Verificación" /><BiometricVerify onVerified={() => { setStep('processing'); setTimeout(() => setStep('receipt'), 1500); }} onCancel={() => setStep('summary')} /></AppLayout>;
  if (step === 'processing') return <AppLayout showNav={false}><div className="flex min-h-[60vh] flex-col items-center justify-center animate-fade-in"><Loader2 className="h-12 w-12 animate-spin text-primary mb-4" /><p className="text-foreground font-semibold">Procesando transferencia...</p></div></AppLayout>;
  if (step === 'receipt') return <AppLayout showNav={false}><PageHeader title="Comprobante" showBack={false} /><ReceiptScreen data={paymentData} transactionCode={`TXN-${Date.now()}`} balanceAfter={mockAccount.balance - paymentData.total} /></AppLayout>;
  if (step === 'summary') return (
    <AppLayout showNav={false}>
      <PageHeader title="Confirmar transferencia" onBack={() => setStep('form')} />
      <div className="px-4 py-4 mx-auto max-w-lg space-y-4 animate-fade-in">
        <PaymentSummary data={paymentData} showBiometric={parseFloat(amount) >= 1000} />
        <div className="flex items-center justify-between rounded-lg bg-accent p-3 text-sm"><span className="text-muted-foreground">Saldo disponible</span><span className="font-semibold text-foreground">S/ {mockAccount.balance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span></div>
        <Button size="xl" className="w-full" onClick={handleConfirm}>Confirmar</Button>
        <Button variant="ghost" className="w-full" onClick={() => setStep('form')}>Editar</Button>
      </div>
    </AppLayout>
  );

  return (
    <AppLayout showNav={false}>
      <PageHeader title="Pago a bancos nacionales" />
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Landmark className="h-5 w-5" /></div>
                  <div><p className="text-sm font-medium text-foreground">{b.name}</p><p className="text-xs text-muted-foreground">{b.country}</p></div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 rounded-xl bg-accent p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Landmark className="h-5 w-5" /></div>
              <div className="flex-1"><p className="text-sm font-medium text-foreground">{bank?.name}</p></div>
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
              <label className="mb-1 block text-sm font-medium text-foreground">Monto (S/)</label>
              <input type="number" placeholder="0.00" value={amount} onChange={e => { setAmount(e.target.value); setError(''); }} className="w-full rounded-xl border border-border bg-card px-4 py-3 text-2xl font-bold focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              <p className="mt-1 text-xs text-muted-foreground">Saldo: S/ {mockAccount.balance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
              {parseFloat(amount) >= 1000 && <p className="mt-1 text-xs text-warning">Comisión: S/ 3.50</p>}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {(recipientName || accountNumber || amount) && <PaymentSummary data={paymentData} compact />}
            <Button size="xl" className="w-full" onClick={handleNext}>Continuar</Button>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default PayBanksPage;
