import { useMemo, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { PaymentSummary } from '@/components/fintech/PaymentSummary';
import { BiometricVerify } from '@/components/fintech/BiometricVerify';
import { ReceiptScreen } from '@/components/fintech/ReceiptScreen';
import { Button } from '@/components/ui/button';
import { mockAccount, mockCompanies, mockServices } from '@/data/mock';
import type { Company, PaymentData, PaymentStep, Service } from '@/types';
import { Building2, Droplets, Flame, Loader2, Search, Shield, Smartphone, Tv, Wifi, Zap } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Zap,
  Droplets,
  Flame,
  Wifi,
  Smartphone,
  Tv,
  Shield,
};

const matchesSearch = (value: string, query: string) => value.toLowerCase().includes(query.toLowerCase());
const getCompactCategoryLabel = (value: string) => value === 'Telecomunicaciones' ? 'Telecom' : value;

const PayServicesPage = () => {
  const [step, setStep] = useState<PaymentStep>('form');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [referenceCode, setReferenceCode] = useState('');
  const [amount, setAmount] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [transactionCode] = useState(() => `TXN-SVC-${Date.now()}`);

  const service = useMemo(
    () => mockServices.find((item) => item.id === selectedServiceId) ?? null,
    [selectedServiceId],
  );
  const company = useMemo(
    () => mockCompanies.find((item) => item.id === selectedCompanyId) ?? null,
    [selectedCompanyId],
  );

  const filteredServices = useMemo(
    () => mockServices.filter((item) => matchesSearch(`${item.name} ${item.category}`, search)),
    [search],
  );
  const serviceCompanies = useMemo(
    () => selectedServiceId ? mockCompanies.filter((item) => item.serviceIds.includes(selectedServiceId)) : [],
    [selectedServiceId],
  );
  const filteredCompanies = useMemo(
    () => serviceCompanies.filter((item) => matchesSearch(`${item.name} ${item.category}`, search)),
    [search, serviceCompanies],
  );

  const amountValue = Number.parseFloat(amount) || 0;

  const paymentData: PaymentData = {
    recipient: company?.name || '',
    recipientDetail: referenceCode,
    amount: amountValue,
    currency: 'PEN',
    fee: 0,
    total: amountValue,
    method: 'Pago de servicio',
    company: company?.name,
    concept: service?.name,
    description: service && company ? `${service.name} - ${company.name}` : undefined,
  };

  const selectService = (serviceItem: Service) => {
    setSelectedServiceId(serviceItem.id);
    setSelectedCompanyId(null);
    setReferenceCode('');
    setAmount('');
    setSearch('');
    setError('');
  };

  const selectCompany = (companyItem: Company) => {
    setSelectedCompanyId(companyItem.id);
    setSearch('');
    setError('');
  };

  const handleBack = () => {
    if (step !== 'form') {
      setStep('form');
      return;
    }

    if (selectedCompanyId) {
      setSelectedCompanyId(null);
      setReferenceCode('');
      setAmount('');
      setError('');
      return;
    }

    if (selectedServiceId) {
      setSelectedServiceId(null);
      setSearch('');
      setError('');
    }
  };

  const handleNext = () => {
    if (!selectedServiceId) {
      setError('Selecciona un tipo de servicio');
      return;
    }

    if (!selectedCompanyId) {
      setError('Selecciona una empresa');
      return;
    }

    if (!referenceCode) {
      setError('Ingresa el código de cliente o referencia');
      return;
    }

    if (!amount || amountValue <= 0) {
      setError('Ingresa un monto válido');
      return;
    }

    if (amountValue > mockAccount.balance) {
      setError('Saldo insuficiente');
      return;
    }

    setError('');
    setStep('summary');
  };

  if (step === 'biometric') {
    return (
      <AppLayout showNav={false}>
        <PageHeader title="Verificación" />
        <BiometricVerify
          onVerified={() => {
            setStep('processing');
            setTimeout(() => setStep('receipt'), 1500);
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
          <p className="font-semibold text-foreground">Procesando pago...</p>
        </div>
      </AppLayout>
    );
  }

  if (step === 'receipt') {
    return (
      <AppLayout showNav={false}>
        <PageHeader title="Comprobante" showBack={false} />
        <ReceiptScreen
          data={paymentData}
          transactionCode={transactionCode}
          balanceAfter={mockAccount.balance - paymentData.total}
        />
      </AppLayout>
    );
  }

  if (step === 'summary') {
    return (
      <AppLayout showNav={false}>
        <PageHeader title="Confirmar pago" onBack={() => setStep('form')} />
        <div className="mx-auto max-w-3xl space-y-4 px-4 py-4 animate-fade-in sm:px-6 lg:px-8">
          <PaymentSummary data={paymentData} />
          {amountValue >= 500 && (
            <div className="rounded-lg border border-warning/30 bg-amber-50 p-3 text-xs text-warning fintech-shadow">
              Este pago requerirá verificación biométrica por el monto ingresado.
            </div>
          )}
          <div className="flex items-center justify-between rounded-lg bg-accent p-3 text-sm fintech-shadow">
            <span className="text-muted-foreground">Saldo disponible</span>
            <span className="font-semibold text-foreground">S/ {mockAccount.balance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
          </div>
          <Button size="xl" className="w-full" onClick={() => {
            if (amountValue >= 500) {
              setStep('biometric');
              return;
            }

            setStep('processing');
            setTimeout(() => setStep('receipt'), 1500);
          }}>
            Confirmar pago
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => setStep('form')}>
            Editar
          </Button>
        </div>
      </AppLayout>
    );
  }

  const ServiceIcon = service ? iconMap[service.icon] || Zap : Zap;

  return (
    <AppLayout showNav={false}>
      <PageHeader
        title="Pago de servicio"
        subtitle="Elige el servicio y luego la empresa que lo atiende"
        onBack={selectedServiceId || selectedCompanyId ? handleBack : undefined}
      />
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-4 animate-fade-in sm:px-6 lg:px-8">
        {!selectedServiceId && (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar servicio..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {filteredServices.map((item) => {
                const Icon = iconMap[item.icon] || Zap;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectService(item)}
                    className="flex min-h-[142px] min-w-0 flex-col items-start gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/30 active:scale-95 fintech-shadow"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <p className="break-words text-sm font-medium leading-snug text-foreground">{item.name}</p>
                      <p className="text-balance text-xs leading-snug text-muted-foreground">{getCompactCategoryLabel(item.category)}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {filteredServices.length === 0 && (
              <div className="rounded-xl border border-dashed border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
                No encontramos servicios con ese criterio.
              </div>
            )}
          </>
        )}

        {selectedServiceId && !selectedCompanyId && service && (
          <>
            <div className="flex flex-wrap items-center gap-3 rounded-xl bg-accent p-3 fintech-shadow">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ServiceIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{service.name}</p>
                <p className="break-words text-xs text-muted-foreground">{service.category}</p>
              </div>
              <button type="button" onClick={() => handleBack()} className="shrink-0 text-xs font-medium text-primary">
                Cambiar
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar empresa..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              {filteredCompanies.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectCompany(item)}
                  className="flex w-full min-w-0 items-start gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/30 active:scale-95 fintech-shadow sm:items-center"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="break-words text-sm font-medium text-foreground">{item.name}</p>
                    <p className="break-words text-xs text-muted-foreground">{item.category}</p>
                  </div>
                </button>
              ))}
            </div>

            {filteredCompanies.length === 0 && (
              <div className="rounded-xl border border-dashed border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
                No encontramos empresas para este servicio.
              </div>
            )}
          </>
        )}

        {selectedServiceId && selectedCompanyId && service && company && (
          <>
            <div className="flex flex-wrap items-center gap-3 rounded-xl bg-accent p-3 fintech-shadow">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ServiceIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="break-words text-sm font-medium text-foreground">{service.name}</p>
                <p className="break-words text-xs text-muted-foreground">{company.name}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCompanyId(null);
                  setSearch('');
                  setError('');
                }}
                className="shrink-0 text-xs font-medium text-primary"
              >
                Cambiar
              </button>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Código de cliente o referencia</label>
              <input
                type="text"
                value={referenceCode}
                onChange={(event) => {
                  setReferenceCode(event.target.value);
                  setError('');
                }}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Monto (S/)</label>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(event) => {
                  setAmount(event.target.value);
                  setError('');
                }}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-2xl font-bold focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <p className="mt-1 text-xs text-muted-foreground">Saldo: S/ {mockAccount.balance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            {(referenceCode || amount) && <PaymentSummary data={paymentData} compact />}

            <Button size="xl" className="w-full" onClick={handleNext}>
              Continuar
            </Button>
          </>
        )}

        {error && !selectedCompanyId && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </AppLayout>
  );
};

export default PayServicesPage;
