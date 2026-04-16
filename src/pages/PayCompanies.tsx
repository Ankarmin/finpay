import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { PaymentSummary } from '@/components/fintech/PaymentSummary';
import { BiometricVerify } from '@/components/fintech/BiometricVerify';
import { ReceiptScreen } from '@/components/fintech/ReceiptScreen';
import { Button } from '@/components/ui/button';
import { mockCompanies, mockAccount } from '@/data/mock';
import type { PaymentStep, PaymentData } from '@/types';
import { Loader2, Search, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const PayCompaniesPage = () => {
  const [step, setStep] = useState<PaymentStep>('form');
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [amount, setAmount] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const company = mockCompanies.find(c => c.id === selectedCompany);
  const filtered = mockCompanies.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const paymentData: PaymentData = {
    recipient: company?.name || '',
    amount: parseFloat(amount) || 0,
    currency: 'PEN',
    fee: 0,
    total: parseFloat(amount) || 0,
    method: 'Pago a empresa',
    company: company?.name,
    concept: code,
  };

  const handleNext = () => {
    if (!selectedCompany) { setError('Selecciona una empresa'); return; }
    if (!code) { setError('Ingresa el código o referencia'); return; }
    if (!amount || parseFloat(amount) <= 0) { setError('Ingresa un monto válido'); return; }
    if (parseFloat(amount) > mockAccount.balance) { setError('Saldo insuficiente'); return; }
    setStep('summary');
  };

  const handleConfirm = () => { setStep('processing'); setTimeout(() => setStep('receipt'), 1500); };

  if (step === 'biometric') return <AppLayout showNav={false}><PageHeader title="Verificación" /><BiometricVerify onVerified={() => { setStep('processing'); setTimeout(() => setStep('receipt'), 1500); }} onCancel={() => setStep('summary')} /></AppLayout>;
  if (step === 'processing') return <AppLayout showNav={false}><div className="flex min-h-[60vh] flex-col items-center justify-center animate-fade-in"><Loader2 className="h-12 w-12 animate-spin text-primary mb-4" /><p className="text-foreground font-semibold">Procesando pago...</p></div></AppLayout>;
  if (step === 'receipt') return <AppLayout showNav={false}><PageHeader title="Comprobante" showBack={false} /><ReceiptScreen data={paymentData} transactionCode={`TXN-${Date.now()}`} balanceAfter={mockAccount.balance - paymentData.total} /></AppLayout>;
  if (step === 'summary') return (
    <AppLayout showNav={false}>
      <PageHeader title="Confirmar pago" onBack={() => setStep('form')} />
      <div className="px-4 py-4 mx-auto max-w-lg space-y-4 animate-fade-in">
        <PaymentSummary data={paymentData} />
        <div className="flex items-center justify-between rounded-lg bg-accent p-3 text-sm"><span className="text-muted-foreground">Saldo disponible</span><span className="font-semibold text-foreground">S/ {mockAccount.balance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span></div>
        <Button size="xl" className="w-full" onClick={handleConfirm}>Confirmar pago</Button>
        <Button variant="ghost" className="w-full" onClick={() => setStep('form')}>Editar</Button>
      </div>
    </AppLayout>
  );

  return (
    <AppLayout showNav={false}>
      <PageHeader title="Pago a empresas" />
      <div className="px-4 py-4 mx-auto max-w-lg space-y-4 animate-fade-in">
        {!selectedCompany ? (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="Buscar empresa..." value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="space-y-2">
              {filtered.map(c => (
                <button key={c.id} onClick={() => setSelectedCompany(c.id)} className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/30 active:scale-95">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Building2 className="h-5 w-5" /></div>
                  <div><p className="text-sm font-medium text-foreground">{c.name}</p><p className="text-xs text-muted-foreground">{c.category}</p></div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 rounded-xl bg-accent p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Building2 className="h-5 w-5" /></div>
              <div className="flex-1"><p className="text-sm font-medium text-foreground">{company?.name}</p><p className="text-xs text-muted-foreground">{company?.category}</p></div>
              <button onClick={() => setSelectedCompany(null)} className="text-xs text-primary font-medium">Cambiar</button>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Código o referencia</label>
              <input type="text" value={code} onChange={e => { setCode(e.target.value); setError(''); }} className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Monto (S/)</label>
              <input type="number" placeholder="0.00" value={amount} onChange={e => { setAmount(e.target.value); setError(''); }} className="w-full rounded-xl border border-border bg-card px-4 py-3 text-2xl font-bold focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              <p className="mt-1 text-xs text-muted-foreground">Saldo: S/ {mockAccount.balance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {(code || amount) && <PaymentSummary data={paymentData} compact />}
            <Button size="xl" className="w-full" onClick={handleNext}>Continuar</Button>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default PayCompaniesPage;
