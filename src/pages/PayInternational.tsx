import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { BiometricVerify } from '@/components/fintech/BiometricVerify';
import { Button } from '@/components/ui/button';
import { mockAccount, mockInternationalTransferCountries } from '@/data/mock';
import { AlertCircle, ArrowRight, ArrowRightLeft, Building2, CheckCircle2, ChevronRight, Clock, Copy, Globe, Landmark, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatMoney as formatCurrency } from '@/lib/format';
import { toast } from '@/hooks/use-toast';

type TransferStage = 'entry' | 'countries' | 'banks' | 'details' | 'summary' | 'biometric' | 'processing' | 'receipt';
type AmountField = 'send' | 'receive';

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

const sanitizeAmountInput = (value: string) => {
  const normalized = value.replace(/,/g, '.').replace(/[^\d.]/g, '');
  const firstDotIndex = normalized.indexOf('.');

  if (firstDotIndex === -1) {
    return normalized.replace(/^0+(?=\d)/, '');
  }

  const integerPart = normalized.slice(0, firstDotIndex).replace(/^0+(?=\d)/, '');
  const decimalPart = normalized.slice(firstDotIndex + 1).replace(/\./g, '').slice(0, 2);

  return `${integerPart || '0'}.${decimalPart}`;
};

const parseAmountInput = (value: string) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatAmountInput = (value: number) => value.toFixed(2);

const PayInternationalPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<TransferStage>('entry');
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [recipientName, setRecipientName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amountSentInput, setAmountSentInput] = useState('');
  const [amountReceivedInput, setAmountReceivedInput] = useState('');
  const [activeAmountField, setActiveAmountField] = useState<AmountField>('send');
  const [showValidation, setShowValidation] = useState(false);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [quoteUpdatedAt, setQuoteUpdatedAt] = useState<string | null>(null);
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

  const amountSent = parseAmountInput(amountSentInput);
  const amountReceived = parseAmountInput(amountReceivedInput);
  const commission = selectedBank?.commission ?? 0;
  const balanceAfter = mockAccount.balance - amountSent;
  const isReceiveAmountValid = amountSent === 0 || amountReceived > 0;
  const exceedsBalance = amountSent > mockAccount.balance;
  const hasAmountValue = amountSentInput !== '' || amountReceivedInput !== '';

  const transitionClass = direction === 'forward'
    ? 'animate-in fade-in-0 slide-in-from-right-4 duration-300'
    : 'animate-in fade-in-0 slide-in-from-left-4 duration-300';

  useEffect(() => {
    if (step !== 'details' || !selectedBank) {
      return;
    }

    setIsQuoteLoading(true);

    const timeoutId = window.setTimeout(() => {
      setIsQuoteLoading(false);
      setQuoteUpdatedAt(new Date().toISOString());
    }, 650);

    return () => window.clearTimeout(timeoutId);
  }, [step, selectedBank]);

  const clearAmounts = () => {
    setAmountSentInput('');
    setAmountReceivedInput('');
    setActiveAmountField('send');
    setShowValidation(false);
  };

  const resetTransferForm = () => {
    setRecipientName('');
    setAccountNumber('');
    clearAmounts();
  };

  const syncAmounts = (field: AmountField, rawValue: string) => {
    if (!selectedBank) {
      return;
    }

    const sanitizedValue = sanitizeAmountInput(rawValue);
    const exchangeRate = selectedBank.exchangeRate;

    setActiveAmountField(field);

    if (field === 'send') {
      setAmountSentInput(sanitizedValue);

      if (!sanitizedValue) {
        setAmountReceivedInput('');
        return;
      }

      const nextAmountSent = parseAmountInput(sanitizedValue);
      const nextAmountReceived = Math.max((nextAmountSent * exchangeRate) - commission, 0);
      setAmountReceivedInput(formatAmountInput(nextAmountReceived));
      return;
    }

    setAmountReceivedInput(sanitizedValue);

    if (!sanitizedValue) {
      setAmountSentInput('');
      return;
    }

    const nextAmountReceived = parseAmountInput(sanitizedValue);
    const nextAmountSent = nextAmountReceived === 0 ? 0 : (nextAmountReceived + commission) / exchangeRate;
    setAmountSentInput(formatAmountInput(nextAmountSent));
  };

  const formatFieldOnBlur = (field: AmountField) => {
    if (field === 'send') {
      setAmountSentInput((currentValue) => currentValue ? formatAmountInput(parseAmountInput(currentValue)) : '');
      return;
    }

    setAmountReceivedInput((currentValue) => currentValue ? formatAmountInput(parseAmountInput(currentValue)) : '');
  };

  const handleRefreshQuote = () => {
    if (!selectedBank || isQuoteLoading) {
      return;
    }

    setIsQuoteLoading(true);

    window.setTimeout(() => {
      setIsQuoteLoading(false);
      setQuoteUpdatedAt(new Date().toISOString());
    }, 650);
  };

  const goToCountries = () => {
    setDirection('forward');
    setStep('countries');
  };

  const handleCountrySelect = (countryId: string) => {
    setDirection('forward');
    setSelectedCountryId(countryId);
    setSelectedBankId(null);
    resetTransferForm();
    setStep('banks');
  };

  const handleBankSelect = (bankId: string) => {
    setDirection('forward');
    setSelectedBankId(bankId);
    resetTransferForm();
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
    setShowValidation(true);

    if (!selectedCountry || !selectedBank) {
      return;
    }

    if (!recipientName.trim() || !accountNumber.trim()) {
      return;
    }

    if (!hasAmountValue || amountSent <= 0 || exceedsBalance || !isReceiveAmountValid || isQuoteLoading) {
      return;
    }

    setStep('summary');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(transactionCode);
    toast({ title: 'Código copiado', description: transactionCode });
  };

  const recipientNameError = showValidation && !recipientName.trim()
    ? 'Ingresa el nombre completo del destinatario.'
    : '';

  const accountNumberError = showValidation && !accountNumber.trim()
    ? 'Ingresa la cuenta o IBAN para continuar.'
    : '';

  const sendAmountError = (() => {
    if (!selectedBank) {
      return '';
    }

    if (showValidation && !hasAmountValue && activeAmountField === 'send') {
      return 'Ingresa cuánto quieres enviar o cuánto quieres que reciba.';
    }

    if (!amountSentInput) {
      return '';
    }

    if (amountSent <= 0) {
      return 'Ingresa un monto mayor a 0.00.';
    }

    if (exceedsBalance) {
      return `Supera tu saldo disponible de ${formatCurrency(mockAccount.balance, mockAccount.currency)}.`;
    }

    if (!isReceiveAmountValid) {
      return `Aumenta el envío para cubrir la comisión de ${formatCurrency(commission, selectedBank.currency)}.`;
    }

    return '';
  })();

  const receiveAmountError = (() => {
    if (!selectedBank) {
      return '';
    }

    if (showValidation && !hasAmountValue && activeAmountField === 'receive') {
      return 'Ingresa cuánto quieres que reciba el destinatario o cuánto enviarás.';
    }

    if (!amountReceivedInput) {
      return '';
    }

    if (amountReceived <= 0) {
      return 'Ingresa un monto mayor a 0.00.';
    }

    if (exceedsBalance) {
      return `Para que reciba ${formatCurrency(amountReceived, selectedBank.currency)} necesitas ${formatCurrency(amountSent, mockAccount.currency)}.`;
    }

    return '';
  })();

  const currentDetailError = sendAmountError || receiveAmountError || recipientNameError || accountNumberError;

  const detailStatus = (() => {
    if (isQuoteLoading) {
      return {
        label: 'Cargando',
        title: 'Actualizando el tipo de cambio',
        description: 'Traemos el valor actual para que el cálculo sea preciso antes de continuar.',
        icon: Loader2,
        className: 'border-warning/30 bg-amber-50 text-warning',
      };
    }

    if (currentDetailError) {
      return {
        label: 'Error',
        title: 'Revisa los datos para continuar',
        description: currentDetailError,
        icon: AlertCircle,
        className: 'border-destructive/20 bg-destructive/5 text-destructive',
      };
    }

    if (!hasAmountValue) {
      return {
        label: 'Pendiente',
        title: 'Ingresa cualquiera de los dos montos',
        description: 'Puedes escribir en PEN o en la moneda destino. El otro campo se actualiza solo.',
        icon: Clock,
        className: 'border-warning/30 bg-amber-50 text-warning',
      };
    }

    return {
      label: 'Éxito',
      title: 'Resumen actualizado en tiempo real',
      description: 'El total a debitar y lo que recibe el destinatario ya están calculados con este tipo de cambio.',
      icon: CheckCircle2,
      className: 'border-success/20 bg-emerald-50 text-success',
    };
  })();

  const DetailStatusIcon = detailStatus.icon;

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
          <p className="font-semibold text-foreground">Estamos enviando tu transferencia...</p>
          <p className="mt-1 text-sm text-muted-foreground">Validamos el envío con el banco destino antes de generar el comprobante.</p>
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
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-success">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Envío registrado</p>
              <h2 className="mt-2 text-2xl font-bold text-foreground">{formatCurrency(amountSent, mockAccount.currency)}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Tu transferencia fue enviada. El abono al banco destino sigue en proceso por validación externa.
              </p>
            </div>

            <div className="mt-6 flex items-start gap-2 rounded-2xl border border-warning/30 bg-amber-50 p-4 text-sm text-warning">
              <Clock className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Pendiente de confirmación en {selectedBank.name}. El destinatario recibirá {formatCurrency(amountReceived, selectedBank.currency)} cuando el banco termine la validación.</span>
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
                <span className="text-muted-foreground">Tú envías</span>
                <span className="break-words text-left font-medium text-foreground sm:max-w-[62%] sm:text-right">{formatCurrency(amountSent, mockAccount.currency)}</span>
              </div>
              <div className="flex flex-col gap-1.5 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <span className="text-muted-foreground">Destinatario recibe</span>
                <span className="break-words text-left font-medium text-foreground sm:max-w-[62%] sm:text-right">{formatCurrency(amountReceived, selectedBank.currency)}</span>
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
                Resumen final del envío
              </div>
              <p className="mt-2 text-xl font-bold text-foreground">Total debitado: {formatCurrency(amountSent, mockAccount.currency)}</p>
              <p className="mt-1 text-muted-foreground">El destinatario recibirá {formatCurrency(amountReceived, selectedBank.currency)} después de la comisión del banco destino.</p>
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
              Resumen de envío
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
                <span className="text-muted-foreground">Tú envías</span>
                <span className="break-words text-left font-medium text-foreground sm:max-w-[62%] sm:text-right">{formatCurrency(amountSent, mockAccount.currency)}</span>
              </div>
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <span className="text-muted-foreground">Destinatario recibe</span>
                <span className="break-words text-left font-medium text-foreground sm:max-w-[62%] sm:text-right">{formatCurrency(amountReceived, selectedBank.currency)}</span>
              </div>
              <div className="flex flex-col gap-1.5 border-t border-border pt-3 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <span className="font-semibold text-foreground">Total a debitar</span>
                <span className="break-words text-left font-bold text-primary sm:max-w-[62%] sm:text-right">{formatCurrency(amountSent, mockAccount.currency)}</span>
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
        title={step === 'details' && selectedCountry ? '¿Cuánto quieres enviar?' : 'Transferencia internacional'}
        subtitle={step === 'details' && selectedCountry ? `Hacia ${selectedCountry.name}` : 'Envía dinero al extranjero desde un solo flujo'}
        onBack={step === 'entry' ? undefined : handleBack}
        rightAction={step === 'details' ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="min-h-9 px-2"
            onClick={() => {
              setDirection('back');
              setSelectedCountryId(null);
              setSelectedBankId(null);
              resetTransferForm();
              setStep('entry');
            }}
          >
            Cancelar
          </Button>
        ) : undefined}
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
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,360px)] lg:items-start">
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-4 fintech-shadow">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
                      <span aria-hidden="true">{selectedCountry.flag}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{selectedCountry.name}</p>
                      <p className="break-words text-xs text-muted-foreground">{selectedBank.name} · {selectedBank.currency}</p>
                      {selectedBank.swiftCode && (
                        <p className="mt-1 break-words text-xs text-muted-foreground">SWIFT: {selectedBank.swiftCode}</p>
                      )}
                    </div>
                  </div>
                  <div className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-foreground">
                    Saldo disponible: {formatCurrency(mockAccount.balance, mockAccount.currency)}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 fintech-shadow">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <ArrowRightLeft className="h-4 w-4 text-primary" />
                      Tipo de cambio actual
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      1 PEN = {formatCurrency(selectedBank.exchangeRate, selectedBank.currency)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Comisión del banco destino: {formatCurrency(commission, selectedBank.currency)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Actualizado {formatRateTimestamp(quoteUpdatedAt ?? selectedBank.updatedAt)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRefreshQuote}
                    disabled={isQuoteLoading}
                  >
                    <RefreshCw className={cn('h-4 w-4', isQuoteLoading && 'animate-spin')} />
                    Actualizar
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 fintech-shadow">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Montos</p>
                    <p className="text-sm text-muted-foreground">Escribe en cualquiera de las dos monedas y actualizamos la otra al instante.</p>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={clearAmounts}>
                    Limpiar
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className={cn(
                    'rounded-2xl border bg-background p-4 transition-all',
                    activeAmountField === 'send' ? 'border-primary ring-2 ring-primary/10' : 'border-border',
                    sendAmountError && 'border-destructive/40 ring-2 ring-destructive/10',
                  )}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Tú envías</p>
                        <p className="text-xs text-muted-foreground">Se debita de tu saldo en soles.</p>
                      </div>
                      <div className="rounded-full bg-accent px-3 py-1 text-sm font-semibold text-foreground">🇵🇪 PEN</div>
                    </div>
                    <input
                      id="international-send-amount"
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={amountSentInput}
                      onFocus={() => setActiveAmountField('send')}
                      onBlur={() => formatFieldOnBlur('send')}
                      onChange={(event) => syncAmounts('send', event.target.value)}
                      className="mt-4 w-full bg-transparent text-3xl font-bold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/60 sm:text-4xl"
                    />
                    <p className="mt-2 text-xs text-muted-foreground">Puedes editar este monto o escribir directamente abajo lo que quieres que reciba.</p>
                    {sendAmountError && <p className="mt-2 text-sm text-destructive">{sendAmountError}</p>}
                  </div>

                  <div className={cn(
                    'rounded-2xl border bg-background p-4 transition-all',
                    activeAmountField === 'receive' ? 'border-primary ring-2 ring-primary/10' : 'border-border',
                    receiveAmountError && 'border-destructive/40 ring-2 ring-destructive/10',
                  )}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Destinatario recibe</p>
                        <p className="text-xs text-muted-foreground">Ya considera la comisión del banco destino.</p>
                      </div>
                      <div className="rounded-full bg-accent px-3 py-1 text-sm font-semibold text-foreground">{selectedCountry.flag} {selectedBank.currency}</div>
                    </div>
                    <input
                      id="international-receive-amount"
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={amountReceivedInput}
                      onFocus={() => setActiveAmountField('receive')}
                      onBlur={() => formatFieldOnBlur('receive')}
                      onChange={(event) => syncAmounts('receive', event.target.value)}
                      className="mt-4 w-full bg-transparent text-3xl font-bold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/60 sm:text-4xl"
                    />
                    <p className="mt-2 text-xs text-muted-foreground">Si prefieres, define aquí el monto exacto que quieres que reciba.</p>
                    {receiveAmountError && <p className="mt-2 text-sm text-destructive">{receiveAmountError}</p>}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 fintech-shadow">
                <div className="mb-4">
                  <p className="text-sm font-semibold text-foreground">Datos del destinatario</p>
                  <p className="text-sm text-muted-foreground">Solo te pedimos lo necesario para completar este envío.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="international-recipient-name" className="mb-1 block text-sm font-medium text-foreground">Nombre del destinatario</label>
                    <input
                      id="international-recipient-name"
                      type="text"
                      value={recipientName}
                      onChange={(event) => setRecipientName(event.target.value)}
                      className={cn(
                        'w-full rounded-xl border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
                        recipientNameError ? 'border-destructive/40' : 'border-border',
                      )}
                    />
                    {recipientNameError && <p className="mt-2 text-sm text-destructive">{recipientNameError}</p>}
                  </div>

                  <div>
                    <label htmlFor="international-account-number" className="mb-1 block text-sm font-medium text-foreground">Cuenta o IBAN</label>
                    <input
                      id="international-account-number"
                      type="text"
                      value={accountNumber}
                      onChange={(event) => setAccountNumber(event.target.value)}
                      className={cn(
                        'w-full rounded-xl border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
                        accountNumberError ? 'border-destructive/40' : 'border-border',
                      )}
                    />
                    <p className="mt-2 text-xs text-muted-foreground">Usa el número completo para evitar rechazos del banco destino.</p>
                    {accountNumberError && <p className="mt-2 text-sm text-destructive">{accountNumberError}</p>}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="ghost" size="lg" onClick={handleBack}>
                  Volver
                </Button>
                <Button size="xl" className="w-full sm:w-auto sm:min-w-[220px]" onClick={handleContinue} disabled={isQuoteLoading}>
                  Continuar
                </Button>
              </div>
            </div>

            <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <div className={cn('rounded-2xl border p-4 fintech-shadow', detailStatus.className)}>
                <div className="flex items-start gap-3">
                  <DetailStatusIcon className={cn('mt-0.5 h-5 w-5 shrink-0', detailStatus.label === 'Cargando' && 'animate-spin')} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em]">{detailStatus.label}</p>
                    <p className="mt-1 text-sm font-semibold">{detailStatus.title}</p>
                    <p className="mt-1 text-sm opacity-90">{detailStatus.description}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 fintech-shadow">
                <p className="text-sm font-semibold text-foreground">Resumen del débito</p>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-muted-foreground">País destino</span>
                    <span className="text-right font-medium text-foreground">{selectedCountry.flag} {selectedCountry.name}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-muted-foreground">Moneda destino</span>
                    <span className="text-right font-medium text-foreground">{selectedBank.currency}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-muted-foreground">Tipo de cambio</span>
                    <span className="text-right font-medium text-foreground">1 PEN = {formatCurrency(selectedBank.exchangeRate, selectedBank.currency)}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-muted-foreground">Tú envías</span>
                    <span className="text-right font-medium text-foreground">{amountSentInput ? formatCurrency(amountSent, mockAccount.currency) : formatCurrency(0, mockAccount.currency)}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-muted-foreground">Destinatario recibe</span>
                    <span className="text-right font-medium text-foreground">{amountReceivedInput ? formatCurrency(amountReceived, selectedBank.currency) : formatCurrency(0, selectedBank.currency)}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-muted-foreground">Comisión</span>
                    <span className="text-right font-medium text-foreground">{formatCurrency(commission, selectedBank.currency)}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3 border-t border-border pt-3">
                    <span className="font-semibold text-foreground">Total a debitar</span>
                    <span className="text-right text-base font-bold text-primary">{amountSentInput ? formatCurrency(amountSent, mockAccount.currency) : formatCurrency(0, mockAccount.currency)}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-muted-foreground">Saldo luego del envío</span>
                    <span className={cn('text-right font-medium', balanceAfter < 0 ? 'text-destructive' : 'text-foreground')}>
                      {formatCurrency(Math.max(balanceAfter, 0), mockAccount.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default PayInternationalPage;
