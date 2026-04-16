import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { TransactionItem } from '@/components/fintech/TransactionItem';
import { mockTransactions } from '@/data/mock';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const typeFilters = [
  { key: 'all', label: 'Todos' },
  { key: 'send', label: 'Enviados' },
  { key: 'receive', label: 'Recibidos' },
  { key: 'payment', label: 'Pagos' },
];

const statusFilters = [
  { key: 'all', label: 'Todos' },
  { key: 'completed', label: 'Completados' },
  { key: 'pending', label: 'Pendientes' },
  { key: 'failed', label: 'Fallidos' },
];

const HistoryPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = mockTransactions.filter(tx => {
    if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
    if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
    if (search && !tx.description.toLowerCase().includes(search.toLowerCase()) && !tx.recipient?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const grouped = filtered.reduce((acc, tx) => {
    const date = tx.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(tx);
    return acc;
  }, {} as Record<string, typeof filtered>);

  return (
    <AppLayout>
      <PageHeader title="Historial" showBack={false} rightAction={
        <button onClick={() => setShowFilters(!showFilters)} className={cn("flex h-10 w-10 items-center justify-center rounded-xl transition-colors", showFilters ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted")}>
          <SlidersHorizontal className="h-5 w-5" />
        </button>
      } />

      <div className="mx-auto max-w-5xl space-y-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar transacción..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {showFilters && (
          <div className="space-y-3 animate-fade-in rounded-xl border border-border bg-card p-3 fintech-shadow">
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Tipo</p>
              <div className="flex flex-wrap gap-2">
                {typeFilters.map(f => (
                  <button key={f.key} onClick={() => setTypeFilter(f.key)} className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-colors", typeFilter === f.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Estado</p>
              <div className="flex flex-wrap gap-2">
                {statusFilters.map(f => (
                  <button key={f.key} onClick={() => setStatusFilter(f.key)} className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-colors", statusFilter === f.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {Object.entries(grouped).length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No se encontraron transacciones
          </div>
        ) : (
          Object.entries(grouped).map(([date, txs]) => (
            <div key={date}>
              <p className="mb-1 break-words text-xs font-medium capitalize text-muted-foreground">{new Date(date).toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              <div className="rounded-xl border border-border bg-card fintech-shadow">
                {txs.map(tx => (
                  <TransactionItem key={tx.id} transaction={tx} onClick={() => navigate(`/history/${tx.id}`)} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </AppLayout>
  );
};

export default HistoryPage;
