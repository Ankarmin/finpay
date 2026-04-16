import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { PaymentSummary } from '@/components/fintech/PaymentSummary';
import { BiometricVerify } from '@/components/fintech/BiometricVerify';
import { ReceiptScreen } from '@/components/fintech/ReceiptScreen';
import { Button } from '@/components/ui/button';
import { mockAccount } from '@/data/mock';
import type { PaymentStep, PaymentData } from '@/types';
import { QrCode, Camera, Loader2 } from 'lucide-react';

const PayQRPage = () => {
  const [step, setStep] = useState<PaymentStep>('form');
  const [scanned, setScanned] = useState(false);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const paymentData: PaymentData = {
    recipient: 'Tienda ABC',
    recipientDetail: 'QR-TIENDA-ABC-001',
    amount: parseFloat(amount) || 0,
    currency: 'PEN',
    fee: 0,
    total: parseFloat(amount) || 0,
    method: 'Pago por QR',
  };

  const handleScan = () => {
    setTimeout(() => setScanned(true), 1000);
  };

  const handleNext = () => {
    if (!amount || parseFloat(amount) <= 0) { setError('Ingresa un monto válido'); return; }
    if (parseFloat(amount) > mockAccount.balance) { setError('Saldo insuficiente'); return; }
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
          <Button size="xl" className="w-full" onClick={handleConfirm}>Confirmar pago</Button>
          <Button variant="ghost" className="w-full" onClick={() => setStep('form')}>Editar</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showNav={false}>
      <PageHeader title="Pago por QR" subtitle="Escanea un código QR para pagar" />
      <div className="px-4 py-4 mx-auto max-w-lg space-y-4 animate-fade-in">
        {!scanned ? (
          <div className="flex flex-col items-center">
            <div className="relative flex h-64 w-64 items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-accent">
              <QrCode className="h-16 w-16 text-primary/40" />
              <div className="absolute inset-4 rounded-xl border-2 border-primary/20" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground text-center">Apunta la cámara al código QR del comercio</p>
            <Button size="lg" className="mt-4 gap-2" onClick={handleScan}>
              <Camera className="h-5 w-5" /> Simular escaneo
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-accent p-3 fintech-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <QrCode className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Tienda ABC</p>
                <p className="text-xs text-muted-foreground">Código verificado</p>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Monto (S/)</label>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={e => { setAmount(e.target.value); setError(''); }}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-2xl font-bold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <p className="mt-1 text-xs text-muted-foreground">Saldo: S/ {mockAccount.balance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            {amount && <PaymentSummary data={paymentData} compact />}

            <Button size="xl" className="w-full" onClick={handleNext}>Continuar</Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default PayQRPage;
