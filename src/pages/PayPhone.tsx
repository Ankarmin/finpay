import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { PaymentSummary } from '@/components/fintech/PaymentSummary';
import { BiometricVerify } from '@/components/fintech/BiometricVerify';
import { ReceiptScreen } from '@/components/fintech/ReceiptScreen';
import { Button } from '@/components/ui/button';
import { mockRecipients, mockAccount } from '@/data/mock';
import type { PaymentStep, PaymentData } from '@/types';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const PayPhonePage = () => {
  const [step, setStep] = useState<PaymentStep>('form');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [error, setError] = useState('');
  const favorites = mockRecipients.filter(r => r.isFavorite);

  const paymentData: PaymentData = {
    recipient: selectedContact ? mockRecipients.find(r => r.id === selectedContact)?.name || phone : phone,
    recipientDetail: phone,
    amount: parseFloat(amount) || 0,
    currency: 'PEN',
    fee: 0,
    total: parseFloat(amount) || 0,
    method: 'Pago por celular',
  };

  const handleNext = () => {
    if (!phone || phone.length < 9) { setError('Ingresa un número válido de 9 dígitos'); return; }
    if (!amount || parseFloat(amount) <= 0) { setError('Ingresa un monto válido'); return; }
    if (parseFloat(amount) > mockAccount.balance) { setError('Saldo insuficiente'); return; }
    setError('');
    setStep('summary');
  };

  const handleConfirm = () => {
    if (parseFloat(amount) >= 500) {
      setStep('biometric');
    } else {
      setStep('processing');
      setTimeout(() => setStep('receipt'), 1500);
    }
  };

  if (step === 'biometric') {
    return (
      <AppLayout showNav={false}>
        <PageHeader title="Verificación" />
        <BiometricVerify onVerified={() => { setStep('processing'); setTimeout(() => setStep('receipt'), 1500); }} onCancel={() => setStep('summary')} />
      </AppLayout>
    );
  }

  if (step === 'processing') {
    return (
      <AppLayout showNav={false}>
        <div className="flex min-h-[60vh] flex-col items-center justify-center animate-fade-in">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-foreground font-semibold">Procesando pago...</p>
          <p className="text-sm text-muted-foreground mt-1">No cierres la aplicación</p>
        </div>
      </AppLayout>
    );
  }

  if (step === 'receipt') {
    return (
      <AppLayout showNav={false}>
        <PageHeader title="Comprobante" showBack={false} />
        <ReceiptScreen data={paymentData} transactionCode={`TXN-${Date.now()}`} balanceAfter={mockAccount.balance - paymentData.total} />
      </AppLayout>
    );
  }

  if (step === 'summary') {
    return (
      <AppLayout showNav={false}>
        <PageHeader title="Confirmar pago" onBack={() => setStep('form')} />
        <div className="px-4 py-4 mx-auto max-w-lg space-y-4 animate-fade-in">
          <PaymentSummary data={paymentData} showBiometric={parseFloat(amount) >= 500} />
          <div className="flex items-center justify-between rounded-lg bg-accent p-3 text-sm">
            <span className="text-muted-foreground">Saldo disponible</span>
            <span className="font-semibold text-foreground">S/ {mockAccount.balance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
          </div>
          <Button size="xl" className="w-full" onClick={handleConfirm}>
            Confirmar pago
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => setStep('form')}>Editar</Button>
        </div>
      </AppLayout>
    );
  }

  return (
      <AppLayout showNav={false}>
        <PageHeader title="Pago por celular" subtitle="Envía dinero a un contacto" />
        <div className="px-4 py-4 mx-auto max-w-lg space-y-4 animate-fade-in">
          {favorites.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Contactos frecuentes</p>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {favorites.map(c => (
                <button
                  key={c.id}
                  onClick={() => { setSelectedContact(c.id); setPhone(c.phone || ''); }}
                  className={cn("flex flex-col items-center gap-1 shrink-0 rounded-xl px-3 py-2 transition-all active:scale-95", selectedContact === c.id ? "bg-accent ring-2 ring-primary" : "hover:bg-muted")}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <span className="text-xs text-foreground">{c.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Número de celular</label>
          <input
            type="tel"
            placeholder="987 654 321"
            value={phone}
            onChange={e => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 9)); setError(''); setSelectedContact(null); }}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            maxLength={9}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Monto (S/)</label>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={e => { setAmount(e.target.value); setError(''); }}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-2xl font-bold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            min="0"
            step="0.01"
          />
          <p className="mt-1 text-xs text-muted-foreground">Saldo disponible: S/ {mockAccount.balance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Descripción (opcional)</label>
          <input
            type="text"
            placeholder="Ej: Almuerzo compartido"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {(phone || amount) && (
          <PaymentSummary data={{ ...paymentData, description: description || undefined }} compact />
        )}

        <Button size="xl" className="w-full" onClick={handleNext}>
          Continuar
        </Button>
      </div>
    </AppLayout>
  );
};

export default PayPhonePage;
