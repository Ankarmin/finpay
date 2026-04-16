import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { BiometricVerify } from '@/components/fintech/BiometricVerify';
import { Button } from '@/components/ui/button';
import { mockAccount, mockInternationalTransferCountries } from '@/data/mock';
import { ArrowRight, ArrowRightLeft, Building2, CheckCircle2, ChevronRight, Clock, Copy, Globe, Landmark, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

type TransferStage = 'entry' | 'countries' | 'banks' | 'details' | 'summary' | 'biometric' | 'processing' | 'receipt';

const formatCurrency = (value: number, currency: string) => (
  new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
);

const formatRateTimestamp = (value: string) => (
  new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
);

const getBankBadge = (name: string) => (
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
);

const PayInternationalPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<TransferStage>('entry');
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [recipientName, setRecipientName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [transactionCode] = useState(() => `TXN-INT-${Date.now()}`);
  const [receiptDate] = useState(() => new Date());

  const selectedCountry = useMemo(
    () => mockInternationalTransferCountries.find((country) => country.id === selectedCountryId) ?? null,
    [selectedCountryId],
  );
  const selectedBank = useMemo(
    () => selectedCountry?.banks.find((bank) => bank.id === selectedBankId) ?? null,
    [selectedCountry, selectedBankId],
  );

  const amountSent = Number.parseFloat(amount) || 0;
  const commission = selectedBank?.commission ?? 0;
  const amountReceived = selectedBank ? (amountSent * selectedBank.exchangeRate) - commission : 0;
  const balanceAfter = mockAccount.balance - amountSent;
  const isReceiveAmountValid = amountSent === 0 || amountReceived > 0;

  const transitionClass = direction === 'forward'
    ? 'animate-in fade-in-0 slide-in-from-right-4 duration-300'
    : 'animate-in fade-in-0 slide-in-from-left-4 duration-300';

  const goToCountries = () => {
    setDirection('forward');
    setStep('countries');
  };

  const handleCountrySelect = (countryId: string) => {
    setDirection('forward');
    setSelectedCountryId(countryId);
    setSelectedBankId(null);
    setRecipientName('');
    setAccountNumber('');
    setAmount('');
    setError('');
    setStep('banks');
  };

  const handleBankSelect = (bankId: string) => {
    setDirection('forward');
    setSelectedBankId(bankId);
    setRecipientName('');
    setAccountNumber('');
    setAmount('');
    setError('');
    setStep('details');
  };

  const handleBack = () => {
    setDirection('back');

    if (step === 'summary') {
      setStep('details');
      return;
    }

    if (step === 'details') {
      setStep('banks');
      return;
    }

    if (step === 'banks') {
      setSelectedBankId(null);
      setStep('countries');
      return;
    }

    if (step === 'countries') {
      setSelectedCountryId(null);
      setSelectedBankId(null);
      setStep('entry');
    }
  };

  const handleContinue = () => {
    if (!selectedCountry || !selectedBank) {
      setError('Selecciona un país y un banco');
      return;
    }

    if (!recipientName) {
      setError('Ingresa el nombre del destinatario');
      return;
    }

    if (!accountNumber) {
      setError('Ingresa el número de cuenta o IBAN');
      return;
    }

    if (!amount || amountSent <= 0) {
      setError('Ingresa un monto válido');
      return;
    }

    if (amountSent > mockAccount.balance) {
      setError('Saldo insuficiente');
      return;
    }

    if (!isReceiveAmountValid) {
      setError('El monto debe cubrir la comisión del banco de destino');
      return;
    }

    setError('');
    setStep('summary');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(transactionCode);
    toast({ title: 'Código copiado', description: transactionCode });
  };

  if (step === 'biometric') {
    return (
      <AppLayout showNav={false}>
        <PageHeader title="Verificación" />
        <BiometricVerify
          onVerified={() => {
            setStep('processing');
            setTimeout(() => setStep('receipt'), 1800);
          }}
          onCancel={() => setStep('summary')}
        />
      </AppLayout>
    );
  }

  if (step === 'processing') {
    return (
      <AppLayout showNav={false}>
        <div className="flex min-h-[60vh] flex-col items-center justify-center animate-fade-in">
          <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
          <p className="font-semibold text-foreground">Enviando transferencia internacional...</p>
          <p className="mt-1 text-sm text-muted-foreground">Estamos validando la operación con el banco destino.</p>
        </div>
      </AppLayout>
    );
  }

  if (step === 'receipt' && selectedCountry && selectedBank) {
    return (
      <AppLayout showNav={false}>
        <PageHeader title="Comprobante" showBack={false} />
        <div className="animate-fade-in px-4 py-6">
          <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-5 fintech-shadow-lg sm:p-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-warning">
                <Clock className="h-9 w-9" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Transferencia creada</p>
              <h2 className="mt-2 text-2xl font-bold text-foreground">{formatCurrency(amountSent, mockAccount.currency)}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                El banco destino recibirá aproximadamente {formatCurrency(amountReceived, selectedBank.currency)}.
              </p>
            </div>

            <div className="mt-6 space-y-3 rounded-2xl border border-border bg-background p-4">
              <div className="flex flex-col gap-1.5 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <span className="text-muted-foreground">Código</span>
                <button type="button" onClick={handleCopyCode} className="flex min-w-0 items-center gap-1 font-medium text-primary sm:max-w-[62%] sm:self-start">
                  <span className="min-w-0 break-words text-left sm:text-right">{transactionCode}</span>
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex flex-col gap-1.5 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <span className="text-muted-foreground">Destinatario</span>
                <span className="break-words text-left font-medium text-foreground sm:max-w-[62%] sm:text-right">{recipientName}</span>
              </div>
              <div className="flex flex-col gap-1.5 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <span className="text-muted-foreground">Cuenta</span>
                <span className="break-words text-left font-medium text-foreground sm:max-w-[62%] sm:text-right">{accountNumber}</span>
              </div>
              <div className="flex flex-col gap-1.5 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <span className="text-muted-foreground">Banco destino</span>
                <span className="break-words text-left font-medium text-foreground sm:max-w-[62%] sm:text-right">{selectedBank.name}</span>
              </div>
              <div className="flex flex-col gap-1.5 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <span className="text-muted-foreground">País</span>
                <span className="break-words text-left font-medium text-foreground sm:max-w-[62%] sm:text-right">{selectedCountry.name}</span>
              </div>
              <div className="flex flex-col gap-1.5 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <span className="text-muted-foreground">Tipo de cambio</span>
                <span className="break-words text-left font-medium text-foreground sm:max-w-[62%] sm:text-right">1 PEN = {formatCurrency(selectedBank.exchangeRate, selectedBank.currency)}</span>
              </div>
              <div className="flex flex-col gap-1.5 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <span className="text-muted-foreground">Comisión del banco</span>
                <span className="break-words text-left font-medium text-foreground sm:max-w-[62%] sm:text-right">{formatCurrency(commission, selectedBank.currency)}</span>
              </div>
              <div className="flex flex-col gap-1.5 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <span className="text-muted-foreground">Fecha</span>
                <span className="break-words text-left font-medium text-foreground sm:max-w-[62%] sm:text-right">{receiptDate.toLocaleDateString('es-PE')}</span>
              </div>
              <div className="flex flex-col gap-1.5 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <span className="text-muted-foreground">Hora</span>
                <span className="break-words text-left font-medium text-foreground sm:max-w-[62%] sm:text-right">{receiptDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex flex-col gap-1.5 border-t border-border pt-3 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <span className="font-semibold text-foreground">Saldo restante</span>
                <span className="break-words text-left font-bold text-primary sm:max-w-[62%] sm:text-right">{formatCurrency(balanceAfter, mockAccount.currency)}</span>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-accent p-4 text-sm">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Abono estimado al destinatario
              </div>
              <p className="mt-2 text-xl font-bold text-foreground">{formatCurrency(amountReceived, selectedBank.currency)}</p>
              <p className="mt-1 text-muted-foreground">El banco destino puede confirmar esta operación en unos minutos.</p>
            </div>

            <Button size="xl" className="mt-6 w-full" onClick={() => navigate('/home')}>
              Volver al inicio
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (step === 'summary' && selectedCountry && selectedBank) {
    return (
      <AppLayout showNav={false}>
        <PageHeader title="Confirmar transferencia" onBack={handleBack} />
        <div className="mx-auto max-w-3xl space-y-4 px-4 py-4 animate-fade-in sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 rounded-lg border border-warning/30 bg-amber-50 p-3 text-xs text-warning fintech-shadow">
            <Clock className="h-4 w-4 shrink-0" />
            Transferencia internacional sujeta a validación del banco destino. Se requerirá verificación biométrica.
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 fintech-shadow">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Building2 className="h-4 w-4 text-primary" />
              Resumen de transferencia
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <span className="text-muted-foreground">Destinatario</span>
                <span className="break-words text-left font-medium text-foreground sm:max-w-[62%] sm:text-right">{recipientName}</span>
              </div>
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <span className="text-muted-foreground">Cuenta o IBAN</span>
                <span className="break-words text-left font-medium text-foreground sm:max-w-[62%] sm:text-right">{accountNumber}</span>
              </div>
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <span className="text-muted-foreground">Banco</span>
                <span className="break-words text-left font-medium text-foreground sm:max-w-[62%] sm:text-right">{selectedBank.name}</span>
              </div>
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <span className="text-muted-foreground">País destino</span>
                <span className="break-words text-left font-medium text-foreground sm:max-w-[62%] sm:text-right">{selectedCountry.name}</span>
              </div>
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <span className="text-muted-foreground">Tipo de cambio</span>
                <span className="break-words text-left font-medium text-foreground sm:max-w-[62%] sm:text-right">1 PEN = {formatCurrency(selectedBank.exchangeRate, selectedBank.currency)}</span>
              </div>
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <span className="text-muted-foreground">Comisión del banco</span>
                <span className="break-words text-left font-medium text-foreground sm:max-w-[62%] sm:text-right">{formatCurrency(commission, selectedBank.currency)}</span>
              </div>
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <span className="text-muted-foreground">Monto a debitar</span>
                <span className="break-words text-left font-medium text-foreground sm:max-w-[62%] sm:text-right">{formatCurrency(amountSent, mockAccount.currency)}</span>
              </div>
              <div className="flex flex-col gap-1.5 border-t border-border pt-3 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <span className="font-semibold text-foreground">Monto estimado a recibir</span>
                <span className="break-words text-left font-bold text-primary sm:max-w-[62%] sm:text-right">{formatCurrency(amountReceived, selectedBank.currency)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-accent p-3 text-sm fintech-shadow">
            <span className="text-muted-foreground">Saldo disponible</span>
            <span className="font-semibold text-foreground">{formatCurrency(mockAccount.balance, mockAccount.currency)}</span>
          </div>

          <Button size="xl" className="w-full" onClick={() => setStep('biometric')}>
            Confirmar transferencia
          </Button>
          <Button variant="ghost" className="w-full" onClick={handleBack}>
            Editar
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showNav={false}>
      <PageHeader
        title="Transferencia internacional"
        subtitle="Envía dinero al extranjero desde un solo flujo"
        onBack={step === 'entry' ? undefined : handleBack}
      />
      <div key={step} className={cn('mx-auto max-w-5xl space-y-4 px-4 py-4 sm:px-6 lg:px-8', transitionClass)}>
        {step === 'entry' && (
          <>
             <div className="fintech-gradient rounded-3xl p-5 text-primary-foreground fintech-shadow-lg sm:p-6">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                <Globe className="h-7 w-7" />
              </div>
              <h2 className="text-xl font-bold">Envía dinero al extranjero</h2>
              <p className="mt-2 text-sm text-primary-foreground/80">
                Selecciona país, banco y destinatario para completar una sola transferencia internacional.
              </p>
               <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-primary-foreground/80 sm:grid-cols-3">
                <div className="flex min-h-[68px] items-center justify-center rounded-2xl bg-white/10 px-3 py-2 text-center leading-tight">4 países</div>
                <div className="flex min-h-[68px] items-center justify-center rounded-2xl bg-white/10 px-3 py-2 text-center leading-tight">8 bancos</div>
                <div className="flex min-h-[68px] items-center justify-center rounded-2xl bg-white/10 px-3 py-2 text-center leading-tight">Cambio en vivo</div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 fintech-shadow">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Moneda de origen</span>
                <span className="font-semibold text-foreground">{mockAccount.currency}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Saldo disponible</span>
                <span className="font-semibold text-foreground">{formatCurrency(mockAccount.balance, mockAccount.currency)}</span>
              </div>
            </div>

            <Button size="xl" className="w-full" onClick={goToCountries}>
              <Globe className="h-5 w-5" />
              Empezar transferencia
            </Button>
          </>
        )}

        {step === 'countries' && (
          <>
            <div className="rounded-2xl border border-border bg-card p-4 fintech-shadow">
              <p className="text-sm font-semibold text-foreground">Países disponibles</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Elige el destino para ver los bancos con los que puedes enviar dinero hoy.
              </p>
            </div>

            <div className="space-y-3">
              {mockInternationalTransferCountries.map((country) => (
                <button
                  key={country.id}
                  type="button"
                  onClick={() => handleCountrySelect(country.id)}
                  className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:border-primary/30 hover:bg-accent/40 active:scale-[0.98] fintech-shadow"
                >
               <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
                 <span aria-hidden="true">{country.flag}</span>
               </div>
               <div className="min-w-0 flex-1">
                 <p className="text-sm font-semibold text-foreground">{country.name}</p>
                 <p className="break-words text-xs text-muted-foreground">
                   {country.banks.length} bancos disponibles · {country.currency}
                 </p>
               </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'banks' && selectedCountry && (
          <>
             <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 fintech-shadow">
               <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
                 <span aria-hidden="true">{selectedCountry.flag}</span>
               </div>
               <div className="min-w-0">
                 <p className="text-sm font-semibold text-foreground">{selectedCountry.name}</p>
                 <p className="break-words text-xs text-muted-foreground">Moneda destino: {selectedCountry.currency}</p>
               </div>
             </div>

            <div className="space-y-3">
              {selectedCountry.banks.map((bank) => (
                <button
                  key={bank.id}
                  type="button"
                  onClick={() => handleBankSelect(bank.id)}
                 className="flex w-full min-w-0 items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:border-primary/30 hover:bg-accent/40 active:scale-[0.98] fintech-shadow"
               >
                 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-sm font-bold text-indigo-600">
                   {getBankBadge(bank.name)}
                 </div>
                 <div className="min-w-0 flex-1">
                   <p className="break-words text-sm font-semibold text-foreground">{bank.name}</p>
                   <p className="break-words text-xs text-muted-foreground">
                     1 PEN <ArrowRight className="mx-1 inline h-3.5 w-3.5" /> {formatCurrency(bank.exchangeRate, bank.currency)}
                   </p>
                 </div>
                  <Landmark className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'details' && selectedCountry && selectedBank && (
          <>
            <div className="rounded-2xl border border-border bg-card p-4 fintech-shadow">
               <div className="flex items-start gap-4">
                 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-sm font-bold text-indigo-600">
                   {getBankBadge(selectedBank.name)}
                 </div>
                 <div className="min-w-0 flex-1">
                   <p className="break-words text-base font-semibold text-foreground">{selectedBank.name}</p>
                   <p className="text-sm text-muted-foreground">{selectedCountry.name}</p>
                   {selectedBank.swiftCode && (
                     <p className="mt-1 break-words text-xs text-muted-foreground">SWIFT: {selectedBank.swiftCode}</p>
                   )}
                 </div>
               </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 fintech-shadow">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <ArrowRightLeft className="h-4 w-4 text-primary" />
                Detalle de cambio
              </div>
              <div className="space-y-3 text-sm">
                 <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                   <span className="text-muted-foreground">Tipo de cambio</span>
                   <span className="break-words text-left font-medium text-foreground sm:max-w-[62%] sm:text-right">1 PEN = {formatCurrency(selectedBank.exchangeRate, selectedBank.currency)}</span>
                 </div>
                 <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                   <span className="text-muted-foreground">Comisión del banco</span>
                   <span className="break-words text-left font-medium text-foreground sm:max-w-[62%] sm:text-right">{formatCurrency(commission, selectedBank.currency)}</span>
                 </div>
                 <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                   <span className="text-muted-foreground">Actualizado</span>
                   <span className="break-words text-left font-medium text-foreground sm:max-w-[62%] sm:text-right">{formatRateTimestamp(selectedBank.updatedAt)}</span>
                 </div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-border bg-card p-4 fintech-shadow">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Nombre del destinatario</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(event) => {
                    setRecipientName(event.target.value);
                    setError('');
                  }}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Número de cuenta o IBAN</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(event) => {
                    setAccountNumber(event.target.value);
                    setError('');
                  }}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="international-amount" className="mb-1 block text-sm font-medium text-foreground">
                  Monto a debitar ({mockAccount.currency})
                </label>
                <input
                  id="international-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(event) => {
                    setAmount(event.target.value);
                    setError('');
                  }}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-2xl font-bold focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <p className="mt-1 text-xs text-muted-foreground">Saldo disponible: {formatCurrency(mockAccount.balance, mockAccount.currency)}</p>
              </div>
            </div>

            {amountSent > 0 && (
              <div className="fintech-gradient-light rounded-2xl border border-border p-4 fintech-shadow">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Monto estimado a recibir</p>
                 <p className={cn('mt-2 break-words text-3xl font-bold', isReceiveAmountValid ? 'text-foreground' : 'text-destructive')}>
                   {formatCurrency(Math.max(amountReceived, 0), selectedBank.currency)}
                 </p>
                 <div className="mt-4 space-y-2 text-sm">
                   <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                     <span className="text-muted-foreground">Monto enviado</span>
                     <span className="break-words text-left font-medium text-foreground sm:max-w-[62%] sm:text-right">{formatCurrency(amountSent, mockAccount.currency)}</span>
                   </div>
                   <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                     <span className="text-muted-foreground">Conversión bruta</span>
                     <span className="break-words text-left font-medium text-foreground sm:max-w-[62%] sm:text-right">{formatCurrency(amountSent * selectedBank.exchangeRate, selectedBank.currency)}</span>
                   </div>
                   <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                     <span className="text-muted-foreground">Comisión aplicada</span>
                     <span className="break-words text-left font-medium text-foreground sm:max-w-[62%] sm:text-right">{formatCurrency(commission, selectedBank.currency)}</span>
                   </div>
                 </div>
                {!isReceiveAmountValid && (
                  <p className="mt-3 text-xs text-destructive">
                    El monto enviado debe ser mayor para cubrir la comisión del banco destino.
                  </p>
                )}
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button size="xl" className="w-full" onClick={handleContinue}>
              Continuar
            </Button>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default PayInternationalPage;
