import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { mockTransactions } from '@/data/mock';
import { useParams } from 'react-router-dom';
import { CheckCircle2, Clock, XCircle, Copy, Share2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const statusConfig = {
  completed: { icon: CheckCircle2, label: 'Completado', color: 'text-success', bg: 'bg-emerald-50' },
  pending: { icon: Clock, label: 'Pendiente', color: 'text-warning', bg: 'bg-amber-50' },
  failed: { icon: XCircle, label: 'Fallido', color: 'text-destructive', bg: 'bg-red-50' },
  cancelled: { icon: XCircle, label: 'Cancelado', color: 'text-muted-foreground', bg: 'bg-muted' },
};

const TransactionDetailPage = () => {
  const { id } = useParams();
  const tx = mockTransactions.find(t => t.id === id);

  if (!tx) {
    return (
      <AppLayout>
        <PageHeader title="Detalle" />
        <div className="px-4 py-16 text-center text-muted-foreground">Transacción no encontrada</div>
      </AppLayout>
    );
  }

  const s = statusConfig[tx.status];
  const isIncome = tx.type === 'receive';

  const rows = [
    { label: 'Código', value: tx.transactionCode, copyable: true },
    { label: 'Estado', value: s.label },
    { label: 'Tipo', value: tx.type === 'send' ? 'Envío' : tx.type === 'receive' ? 'Recepción' : 'Pago' },
    { label: 'Categoría', value: tx.category.replace('_', ' ') },
    { label: 'Monto', value: `${tx.currencySymbol} ${tx.amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
    { label: 'Moneda', value: tx.currency },
    ...(tx.exchangeRate ? [{ label: 'Tipo de cambio', value: `${tx.exchangeRate}` }] : []),
    ...(tx.convertedAmount ? [{ label: 'Equivalente PEN', value: `S/ ${tx.convertedAmount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` }] : []),
    ...(tx.recipient ? [{ label: 'Destinatario', value: tx.recipient }] : []),
    ...(tx.recipientBank ? [{ label: 'Banco destino', value: tx.recipientBank }] : []),
    ...(tx.fee ? [{ label: 'Comisión', value: `S/ ${tx.fee.toFixed(2)}` }] : []),
    { label: 'Fecha', value: new Date(tx.date).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' }) },
    { label: 'Hora', value: tx.time },
    ...(tx.balanceAfter ? [{ label: 'Saldo posterior', value: `S/ ${tx.balanceAfter.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` }] : []),
  ];

  return (
    <AppLayout>
      <PageHeader title="Detalle de movimiento" />
      <div className="px-4 py-4 mx-auto max-w-lg animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <div className={cn("mb-3 flex h-16 w-16 items-center justify-center rounded-full", s.bg)}>
            <s.icon className={cn("h-8 w-8", s.color)} />
          </div>
          <p className={cn("text-2xl font-bold", isIncome ? "text-success" : "text-foreground")}>
            {isIncome ? '+' : '-'}{tx.currencySymbol} {tx.amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-muted-foreground mt-1">{tx.description}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 space-y-3 fintech-shadow">
          {rows.map((row, i) => (
            <div key={i} className="flex items-start justify-between gap-3 text-sm">
              <span className="text-muted-foreground">{row.label}</span>
              <div className="flex items-center gap-1">
                <span className="text-right font-medium text-foreground">{row.value}</span>
                {'copyable' in row && (
                  <button onClick={() => { navigator.clipboard.writeText(String(row.value)); toast({ title: 'Copiado' }); }} className="text-muted-foreground hover:text-primary">
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-3">
          <Button variant="outline" size="lg" className="flex-1 gap-2"><Share2 className="h-4 w-4" /> Compartir</Button>
          <Button variant="outline" size="lg" className="flex-1 gap-2"><Download className="h-4 w-4" /> Descargar</Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default TransactionDetailPage;
