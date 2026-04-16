import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { BalanceCard } from '@/components/fintech/BalanceCard';
import { QuickActions } from '@/components/fintech/QuickActions';
import { TransactionItem } from '@/components/fintech/TransactionItem';
import { mockAccount, mockTransactions, mockRecipients } from '@/data/mock';
import { Bell, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [showBalance, setShowBalance] = useState(true);
  const navigate = useNavigate();
  const recentTransactions = mockTransactions.slice(0, 4);
  const frequentContacts = mockRecipients.filter(r => r.isFavorite);

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="fintech-gradient min-h-[236px] px-4 pb-6 pt-4 safe-top">
          <div className="mx-auto max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-primary-foreground/80">Hola,</p>
                <h1 className="text-lg font-bold text-primary-foreground">Juan Pérez</h1>
              </div>
              <button className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-primary-foreground transition-colors hover:bg-white/20 active:scale-95">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-400 ring-2 ring-primary" />
              </button>
            </div>
            <BalanceCard
              balance={mockAccount.balance}
              currency={mockAccount.currency}
              currencySymbol={mockAccount.currencySymbol}
              accountNumber={mockAccount.accountNumber}
              showBalance={showBalance}
              onToggleVisibility={() => setShowBalance(!showBalance)}
            />
          </div>
        </div>

        <div className="px-4 py-4 space-y-6 mx-auto max-w-lg">
          <section>
            <h2 className="mb-3 text-sm font-semibold text-foreground">Acciones rápidas</h2>
            <QuickActions />
          </section>

          {frequentContacts.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold text-foreground">Contactos frecuentes</h2>
              <div className="flex gap-4 overflow-x-auto pb-1">
                {frequentContacts.map(c => (
                  <button
                    key={c.id}
                    onClick={() => navigate('/pay/phone')}
                    className="flex flex-col items-center gap-1.5 shrink-0 active:scale-95 transition-transform"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                      {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <span className="text-xs text-muted-foreground w-16 text-center truncate">{c.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Movimientos recientes</h2>
              <button onClick={() => navigate('/history')} className="flex items-center gap-1 text-xs font-medium text-primary">
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
