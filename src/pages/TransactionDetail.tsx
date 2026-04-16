import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { mockTransactions } from '@/data/mock';
import { useParams } from 'react-router-dom';
import { CheckCircle2, Clock, XCircle, Copy, Share2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { formatMoney } from '@/lib/format';

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
        <div className="px-4 py-16 text-center text-muted-foreground sm:px-6">Transacción no encontrada</div>
      </AppLayout>
    );
  }

  const s = statusConfig[tx.status];
  const isIncome = tx.type === 'receive';

  const handleShare = async () => {
    const shareText = `${tx.description} · ${formatMoney(tx.amount, tx.currency)} · ${tx.transactionCode}`;

    if (navigator.share) {
      await navigator.share({ title: 'Movimiento FinPay', text: shareText });
      return;
    }

    await navigator.clipboard.writeText(shareText);
    toast({ title: 'Resumen copiado', description: 'Ya puedes compartirlo donde quieras.' });
  };

  const handleDownload = () => {
    const content = [
      'Movimiento FinPay',
      `Descripción: ${tx.description}`,
      `Monto: ${formatMoney(tx.amount, tx.currency)}`,
      `Estado: ${s.label}`,
      `Código: ${tx.transactionCode}`,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `movimiento-${tx.transactionCode}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Movimiento descargado', description: 'Guardamos una copia simple en texto.' });
  };

  const rows = [
    { label: 'Código', value: tx.transactionCode, copyable: true },
    { label: 'Estado', value: s.label },
    { label: 'Tipo', value: tx.type === 'send' ? 'Envío' : tx.type === 'receive' ? 'Recepción' : 'Pago' },
    { label: 'Categoría', value: tx.category.replace('_', ' ') },
    { label: 'Monto', value: formatMoney(tx.amount, tx.currency) },
    { label: 'Moneda', value: tx.currency },
    ...(tx.exchangeRate ? [{ label: 'Tipo de cambio', value: `${tx.exchangeRate}` }] : []),
    ...(tx.convertedAmount ? [{ label: 'Equivalente en soles', value: formatMoney(tx.convertedAmount, 'PEN') }] : []),
    ...(tx.recipient ? [{ label: 'Destinatario', value: tx.recipient }] : []),
    ...(tx.recipientBank ? [{ label: 'Banco destino', value: tx.recipientBank }] : []),
    ...(tx.fee ? [{ label: 'Comisión', value: formatMoney(tx.fee, 'PEN') }] : []),
    { label: 'Fecha', value: new Date(tx.date).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' }) },
    { label: 'Hora', value: tx.time },
    ...(tx.balanceAfter ? [{ label: 'Saldo después del movimiento', value: formatMoney(tx.balanceAfter, 'PEN') }] : []),
  ];

  return (
    <AppLayout>
      <PageHeader title="Detalle de movimiento" backTo="/history" />
      <div className="mx-auto max-w-3xl px-4 py-4 animate-fade-in sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-6">
          <div className={cn("mb-3 flex h-16 w-16 items-center justify-center rounded-full", s.bg)}>
            <s.icon className={cn("h-8 w-8", s.color)} />
          </div>
          <p className={cn("text-2xl font-bold", isIncome ? "text-success" : "text-foreground")}>
            {isIncome ? '+' : '-'}{formatMoney(tx.amount, tx.currency)}
          </p>
          <p className="mt-1 break-words text-center text-sm text-muted-foreground">{tx.description}</p>
        </div>

        <div className="space-y-3 rounded-xl border border-border bg-card p-4 fintech-shadow sm:p-5">
          {rows.map((row, i) => (
            <div key={i} className="flex flex-col gap-1.5 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-3">
              <span className="shrink-0 text-muted-foreground">{row.label}</span>
              <div className="flex min-w-0 items-start gap-1 sm:max-w-[62%]">
                <span className="min-w-0 break-words text-left font-medium text-foreground sm:text-right">{row.value}</span>
                {'copyable' in row && (
                  <button onClick={() => { navigator.clipboard.writeText(String(row.value)); toast({ title: 'Copiado' }); }} className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary">
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Button variant="outline" size="lg" className="flex-1 gap-2" onClick={() => void handleShare()}><Share2 className="h-4 w-4" /> Compartir</Button>
          <Button variant="outline" size="lg" className="flex-1 gap-2" onClick={handleDownload}><Download className="h-4 w-4" /> Descargar</Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default TransactionDetailPage;
