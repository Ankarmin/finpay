import type { PaymentData } from '@/types';
import { CheckCircle2, Share2, Download, Copy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { formatMoney } from '@/lib/format';

interface ReceiptScreenProps {
  data: PaymentData;
  transactionCode: string;
  balanceAfter: number;
  status?: 'completed' | 'pending' | 'failed';
}

export const ReceiptScreen = ({ data, transactionCode, balanceAfter, status = 'completed' }: ReceiptScreenProps) => {
  const navigate = useNavigate();
  const now = new Date();

  const statusConfig = {
    completed: { icon: CheckCircle2, label: 'Enviado', color: 'text-success', bg: 'bg-emerald-50' },
    pending: { icon: CheckCircle2, label: 'Pendiente', color: 'text-warning', bg: 'bg-amber-50' },
    failed: { icon: CheckCircle2, label: 'Fallido', color: 'text-destructive', bg: 'bg-red-50' },
  };

  const s = statusConfig[status];

  const handleCopy = () => {
    navigator.clipboard.writeText(transactionCode);
    toast({ title: 'Código copiado', description: transactionCode });
  };

  const handleShare = async () => {
    const shareText = `${s.label}: ${formatMoney(data.amount, data.currency)} para ${data.recipient}. Código ${transactionCode}.`;

    if (navigator.share) {
      await navigator.share({
        title: 'Comprobante FinPay',
        text: shareText,
      });
      return;
    }

    await navigator.clipboard.writeText(shareText);
    toast({ title: 'Resumen copiado', description: 'Ya puedes pegarlo donde quieras compartirlo.' });
  };

  const handleDownload = () => {
    const content = [
      'FinPay',
      `Estado: ${s.label}`,
      `Monto: ${formatMoney(data.amount, data.currency)}`,
      `Destinatario: ${data.recipient}`,
      `Código: ${transactionCode}`,
      `Fecha: ${now.toLocaleDateString('es-PE')}`,
      `Hora: ${now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finpay-${transactionCode}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Comprobante descargado', description: 'Guardamos una copia simple en texto.' });
  };

  const rows = [
    { label: 'Código de transacción', value: transactionCode, copyable: true },
    { label: 'Monto', value: formatMoney(data.amount, data.currency) },
    { label: 'Moneda', value: data.currency },
    ...(data.exchangeRate ? [{ label: 'Tipo de cambio', value: `1 ${data.convertedCurrency} = ${data.exchangeRate} PEN` }] : []),
    ...(data.convertedAmount ? [{ label: 'Recibe aprox.', value: formatMoney(data.convertedAmount, data.convertedCurrency || 'PEN') }] : []),
    { label: 'Destinatario', value: data.recipient },
    ...(data.bank ? [{ label: 'Banco destino', value: data.bank }] : []),
    ...(data.company ? [{ label: 'Empresa', value: data.company }] : []),
    ...(data.university ? [{ label: 'Universidad', value: data.university }] : []),
    { label: 'Cómo lo enviaste', value: data.method },
    { label: 'Comisión', value: data.fee === 0 ? 'Gratis' : formatMoney(data.fee, data.currency) },
    { label: 'Fecha', value: now.toLocaleDateString('es-PE') },
    { label: 'Hora', value: now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) },
    { label: 'Saldo restante', value: formatMoney(balanceAfter, 'PEN') },
  ];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-6 animate-fade-in sm:px-6">
      <div className="mb-4 flex items-center gap-2">
        <img src="/favicon.png" alt="FinPay" className="h-10 w-10" />
        <span className="text-lg font-bold text-foreground">FinPay</span>
      </div>

      <div className={`${s.bg} mb-4 flex h-20 w-20 items-center justify-center rounded-full`}>
        <s.icon className={`h-10 w-10 ${s.color}`} />
      </div>
      <h2 className={`text-xl font-bold ${s.color}`}>{s.label}</h2>
      <p className="mt-1 text-3xl font-bold text-foreground">
        {formatMoney(data.amount, data.currency)}
      </p>

      <div className="mt-6 w-full rounded-xl border border-border bg-card p-4 fintech-shadow sm:p-5">
        <div className="space-y-3">
          {rows.map((row, i) => (
            <div key={i} className="flex flex-col gap-1.5 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-3">
              <span className="shrink-0 text-muted-foreground">{row.label}</span>
              <div className="flex min-w-0 items-start gap-1 self-start sm:max-w-[62%] sm:self-auto">
                <span className="min-w-0 break-words text-left font-medium text-foreground sm:text-right">{row.value}</span>
                {'copyable' in row && row.copyable && (
                  <button onClick={handleCopy} className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary">
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid w-full gap-3 sm:grid-cols-2">
        <Button variant="outline" size="lg" className="flex-1 gap-2" onClick={() => void handleShare()}>
          <Share2 className="h-4 w-4" /> Compartir
        </Button>
        <Button variant="outline" size="lg" className="flex-1 gap-2" onClick={handleDownload}>
          <Download className="h-4 w-4" /> Descargar
        </Button>
      </div>

      <Button size="xl" className="mt-4 w-full gap-2" onClick={() => navigate('/home')}>
        Volver al inicio <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
