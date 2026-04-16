import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { PaymentSummary } from '@/components/fintech/PaymentSummary';
import { BiometricVerify } from '@/components/fintech/BiometricVerify';
import { ReceiptScreen } from '@/components/fintech/ReceiptScreen';
import { Button } from '@/components/ui/button';
import { mockServices, mockAccount } from '@/data/mock';
import type { PaymentStep, PaymentData } from '@/types';
import { Loader2, Zap, Droplets, Flame, Wifi, Smartphone, Tv, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = { Zap, Droplets, Flame, Wifi, Smartphone, Tv };

const PayServicesPage = () => {
  const [step, setStep] = useState<PaymentStep>('form');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [serviceCode, setServiceCode] = useState('');
  const [amount, setAmount] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const service = mockServices.find(s => s.id === selectedService);
  const filtered = mockServices.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  const paymentData: PaymentData = {
    recipient: service?.name || '',
    recipientDetail: serviceCode,
    amount: parseFloat(amount) || 0,
    currency: 'PEN',
    fee: 0,
    total: parseFloat(amount) || 0,
    method: 'Pago de servicio',
    concept: service?.category,
  };

  const handleNext = () => {
    if (!selectedService) { setError('Selecciona un servicio'); return; }
    if (!serviceCode) { setError('Ingresa el código de suministro'); return; }
    if (!amount || parseFloat(amount) <= 0) { setError('Ingresa un monto válido'); return; }
    if (parseFloat(amount) > mockAccount.balance) { setError('Saldo insuficiente'); return; }
    setStep('summary');
  };

  const handleConfirm = () => {
    setStep('processing');
    setTimeout(() => setStep('receipt'), 1500);
  };

  if (step === 'biometric') {
    return <AppLayout showNav={false}><PageHeader title="Verificación" /><BiometricVerify onVerified={() => { setStep('processing'); setTimeout(() => setStep('receipt'), 1500); }} onCancel={() => setStep('summary')} /></AppLayout>;
  }
  if (step === 'processing') {
    return <AppLayout showNav={false}><div className="flex min-h-[60vh] flex-col items-center justify-center animate-fade-in"><Loader2 className="h-12 w-12 animate-spin text-primary mb-4" /><p className="text-foreground font-semibold">Procesando pago...</p></div></AppLayout>;
  }
  if (step === 'receipt') {
    return <AppLayout showNav={false}><PageHeader title="Comprobante" showBack={false} /><ReceiptScreen data={paymentData} transactionCode={`TXN-${Date.now()}`} balanceAfter={mockAccount.balance - paymentData.total} /></AppLayout>;
  }
  if (step === 'summary') {
    return (
      <AppLayout showNav={false}>
        <PageHeader title="Confirmar pago" onBack={() => setStep('form')} />
        <div className="px-4 py-4 mx-auto max-w-lg space-y-4 animate-fade-in">
          <PaymentSummary data={paymentData} />
          <div className="flex items-center justify-between rounded-lg bg-accent p-3 text-sm">
            <span className="text-muted-foreground">Saldo disponible</span>
            <span className="font-semibold text-foreground">S/ {mockAccount.balance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
          </div>
          <Button size="xl" className="w-full" onClick={handleConfirm}>Confirmar pago</Button>
          <Button variant="ghost" className="w-full" onClick={() => setStep('form')}>Editar</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showNav={false}>
      <PageHeader title="Pago de servicios" />
      <div className="px-4 py-4 mx-auto max-w-lg space-y-4 animate-fade-in">
        {!selectedService ? (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="Buscar servicio..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {filtered.map(s => {
                const Icon = iconMap[s.icon] || Zap;
                return (
                  <button key={s.id} onClick={() => setSelectedService(s.id)}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/30 active:scale-95">
                    <Icon className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.category}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 rounded-xl bg-accent p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {(() => { const Icon = iconMap[service?.icon || 'Zap'] || Zap; return <Icon className="h-5 w-5" />; })()}
              </div>
              <div className="flex-1"><p className="text-sm font-medium text-foreground">{service?.name}</p></div>
              <button onClick={() => setSelectedService(null)} className="text-xs text-primary font-medium">Cambiar</button>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Código de suministro</label>
              <input type="text" placeholder="Ingresa el código" value={serviceCode} onChange={e => { setServiceCode(e.target.value); setError(''); }}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Monto (S/)</label>
              <input type="number" placeholder="0.00" value={amount} onChange={e => { setAmount(e.target.value); setError(''); }}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-2xl font-bold focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              <p className="mt-1 text-xs text-muted-foreground">Saldo: S/ {mockAccount.balance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {(serviceCode || amount) && <PaymentSummary data={paymentData} compact />}
            <Button size="xl" className="w-full" onClick={handleNext}>Continuar</Button>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default PayServicesPage;
