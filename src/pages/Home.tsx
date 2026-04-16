import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { BalanceCard } from '@/components/fintech/BalanceCard';
import { QuickActions } from '@/components/fintech/QuickActions';
import { TransactionItem } from '@/components/fintech/TransactionItem';
import { mockAccount, mockTransactions, mockRecipients } from '@/data/mock';
import { Bell, ChevronRight, CircleHelp, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatMoney } from '@/lib/format';

const HomePage = () => {
  const [showBalance, setShowBalance] = useState(true);
  const navigate = useNavigate();
  const recentTransactions = mockTransactions.slice(0, 4);
  const frequentContacts = mockRecipients.filter(r => r.isFavorite);
  const latestSend = mockTransactions.find((tx) => tx.type === 'send' || tx.type === 'payment');

  const getRepeatRoute = () => {
    if (!latestSend) return '/history';
    if (latestSend.category === 'phone') return '/pay/phone';
    if (latestSend.category === 'service' || latestSend.category === 'company') return '/pay/services';
    if (latestSend.category === 'university') return '/pay/universities';
    if (latestSend.category === 'bank_international' || latestSend.category === 'interbank_foreign') return '/pay/international';
    return '/pay/banks';
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="fintech-gradient min-h-[236px] px-4 pb-6 pt-4 safe-top sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-primary-foreground/80">Hola,</p>
                <h1 className="text-lg font-bold text-primary-foreground">Juan Pérez</h1>
              </div>
              <button onClick={() => navigate('/settings')} className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-primary-foreground transition-colors hover:bg-white/20 active:scale-95">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-400 ring-2 ring-primary" />
              </button>
            </div>
            <BalanceCard
              balance={mockAccount.balance}
              currency={mockAccount.currency}
              accountNumber={mockAccount.accountNumber}
              showBalance={showBalance}
              onToggleVisibility={() => setShowBalance(!showBalance)}
            />
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-4 sm:px-6 lg:px-8 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.92fr)] xl:items-start">
          <div className="space-y-6">
            <section>
              <h2 className="mb-3 text-sm font-semibold text-foreground">Acciones rápidas</h2>
              <QuickActions />
            </section>

            {latestSend && (
              <section className="rounded-xl border border-border bg-card p-4 fintech-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">Repetir última operación</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Vuelve a hacer una acción reciente sin empezar desde cero.</p>
                  </div>
                  <RotateCcw className="h-4 w-4 shrink-0 text-primary" />
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-accent p-3">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-medium text-foreground">{latestSend.description}</p>
                    <p className="text-xs text-muted-foreground">{formatMoney(latestSend.amount, latestSend.currency)}</p>
                  </div>
                  <button onClick={() => navigate(getRepeatRoute())} className="shrink-0 text-sm font-medium text-primary">
                    Repetir
                  </button>
                </div>
              </section>
            )}

            <section className="rounded-xl border border-border bg-card p-4 fintech-shadow">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">¿Necesitas ayuda?</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Encuentra respuestas rápidas, estados de operación y contacto con soporte.</p>
                </div>
                <CircleHelp className="h-4 w-4 shrink-0 text-primary" />
              </div>
              <button onClick={() => navigate('/help')} className="mt-3 text-sm font-medium text-primary">
                Abrir ayuda
              </button>
            </section>

            {frequentContacts.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-semibold text-foreground">Contactos frecuentes</h2>
                <div className="flex gap-4 overflow-x-auto pb-1">
                  {frequentContacts.map(c => (
                    <button
                      key={c.id}
                      onClick={() => navigate('/pay/phone')}
                      className="flex shrink-0 flex-col items-center gap-1.5 active:scale-95 transition-transform"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                        {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="w-16 truncate text-center text-xs text-muted-foreground">{c.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>

          <section>
            <div className="mb-2 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-foreground">Movimientos recientes</h2>
              <button onClick={() => navigate('/history')} className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary">
                Ver todo <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="rounded-xl border border-border bg-card fintech-shadow">
              {recentTransactions.map(tx => (
                <TransactionItem key={tx.id} transaction={tx} onClick={() => navigate(`/history/${tx.id}`)} />
              ))}
              {recentTransactions.length === 0 && (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No hay movimientos recientes
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
};

export default HomePage;
