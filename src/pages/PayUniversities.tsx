import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { PaymentSummary } from '@/components/fintech/PaymentSummary';
import { BiometricVerify } from '@/components/fintech/BiometricVerify';
import { ReceiptScreen } from '@/components/fintech/ReceiptScreen';
import { Button } from '@/components/ui/button';
import { mockUniversities, mockAccount } from '@/data/mock';
import type { PaymentStep, PaymentData } from '@/types';
import { Loader2, Search, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

const PayUniversitiesPage = () => {
  const [step, setStep] = useState<PaymentStep>('form');
  const [selectedUni, setSelectedUni] = useState<string | null>(null);
  const [selectedConcept, setSelectedConcept] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [amount, setAmount] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const uni = mockUniversities.find(u => u.id === selectedUni);
  const filtered = mockUniversities.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));
  const amountValue = parseFloat(amount) || 0;

  const paymentData: PaymentData = {
    recipient: uni?.name || '',
    recipientDetail: studentCode,
    amount: amountValue,
    currency: 'PEN',
    fee: 0,
    total: amountValue,
    method: 'Pago a universidad',
    university: uni?.name,
    concept: selectedConcept,
  };
  const canContinue = !!selectedUni && !!selectedConcept && !!studentCode && amountValue > 0 && amountValue <= mockAccount.balance && amountValue <= 5000;

  const handleNext = () => {
    if (!selectedUni) { setError('Selecciona una universidad'); return; }
    if (!selectedConcept) { setError('Selecciona un concepto'); return; }
    if (!studentCode) { setError('Ingresa el código de alumno'); return; }
    if (!amount || parseFloat(amount) <= 0) { setError('Ingresa un monto válido'); return; }
    if (parseFloat(amount) > mockAccount.balance) { setError('Saldo insuficiente'); return; }
    if (amountValue > 5000) { setError('El máximo diario por ahora es S/ 5,000.00'); return; }
    setStep('summary');
  };

  const handleConfirm = () => { setStep('processing'); setTimeout(() => setStep('receipt'), 1500); };

  if (step === 'biometric') return <AppLayout showNav={false}><PageHeader title="Verificación" /><BiometricVerify onVerified={() => { setStep('processing'); setTimeout(() => setStep('receipt'), 1500); }} onCancel={() => setStep('summary')} /></AppLayout>;
  if (step === 'processing') return <AppLayout showNav={false}><div className="flex min-h-[60vh] flex-col items-center justify-center animate-fade-in"><Loader2 className="h-12 w-12 animate-spin text-primary mb-4" /><p className="text-foreground font-semibold">Procesando pago...</p></div></AppLayout>;
  if (step === 'receipt') return <AppLayout showNav={false}><PageHeader title="Comprobante" showBack={false} /><ReceiptScreen data={paymentData} transactionCode={`TXN-${Date.now()}`} balanceAfter={mockAccount.balance - paymentData.total} /></AppLayout>;
  if (step === 'summary') return (
    <AppLayout showNav={false}>
      <PageHeader title="Confirmar pago" onBack={() => setStep('form')} />
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-4 animate-fade-in sm:px-6 lg:px-8">
        <PaymentSummary data={paymentData} />
        <div className="flex items-center justify-between rounded-lg bg-accent p-3 text-sm"><span className="text-muted-foreground">Saldo disponible</span><span className="font-semibold text-foreground">S/ {mockAccount.balance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span></div>
        <Button size="xl" className="w-full" onClick={handleConfirm}>Confirmar pago</Button>
        <Button variant="ghost" className="w-full" onClick={() => setStep('form')}>Editar</Button>
      </div>
    </AppLayout>
  );

  return (
    <AppLayout showNav={false}>
      <PageHeader title="Pago a universidades" />
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-4 animate-fade-in sm:px-6 lg:px-8">
        {!selectedUni ? (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="Buscar universidad..." value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="space-y-2">
              {filtered.map(u => (
                <button key={u.id} onClick={() => setSelectedUni(u.id)} className="flex w-full min-w-0 items-start gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/30 active:scale-95 fintech-shadow sm:items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><GraduationCap className="h-5 w-5" /></div>
                  <div className="min-w-0"><p className="break-words text-sm font-medium text-foreground">{u.name}</p><p className="break-words text-xs text-muted-foreground">{u.concepts.join(' · ')}</p></div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-3 rounded-xl bg-accent p-3 fintech-shadow">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><GraduationCap className="h-5 w-5" /></div>
              <div className="min-w-0 flex-1"><p className="break-words text-sm font-medium text-foreground">{uni?.name}</p></div>
              <button onClick={() => { setSelectedUni(null); setSelectedConcept(''); }} className="shrink-0 text-xs font-medium text-primary">Cambiar</button>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Concepto de pago</label>
              <div className="flex flex-wrap gap-2">
                {uni?.concepts.map(c => (
                  <button key={c} onClick={() => setSelectedConcept(c)} className={cn("rounded-lg px-4 py-2.5 text-left text-sm font-medium whitespace-normal transition-colors", selectedConcept === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Código de alumno</label>
              <input type="text" value={studentCode} onChange={e => { setStudentCode(e.target.value); setError(''); }} className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Monto (S/)</label>
              <input type="number" placeholder="0.00" value={amount} onChange={e => { setAmount(e.target.value); setError(''); }} className="w-full rounded-xl border border-border bg-card px-4 py-3 text-2xl font-bold focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              <p className="mt-1 text-xs text-muted-foreground">Saldo: S/ {mockAccount.balance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
              <p className="mt-1 text-xs text-muted-foreground">Máximo diario: S/ 5,000.00</p>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {(studentCode || amount || selectedConcept) && <PaymentSummary data={paymentData} compact />}
            <Button size="xl" className="w-full" onClick={handleNext} disabled={!canContinue}>Continuar</Button>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default PayUniversitiesPage;
