import type { PaymentData } from '@/types';
import { CheckCircle2, Share2, Download, Copy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

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
    completed: { icon: CheckCircle2, label: 'Operación exitosa', color: 'text-success', bg: 'bg-emerald-50' },
    pending: { icon: CheckCircle2, label: 'Operación en proceso', color: 'text-warning', bg: 'bg-amber-50' },
    failed: { icon: CheckCircle2, label: 'Operación fallida', color: 'text-destructive', bg: 'bg-red-50' },
  };

  const s = statusConfig[status];
  const currencySymbol = data.currency === 'PEN' ? 'S/' : data.currency === 'USD' ? '$' : '€';

  const handleCopy = () => {
    navigator.clipboard.writeText(transactionCode);
    toast({ title: 'Código copiado', description: transactionCode });
  };

  const rows = [
    { label: 'Código de transacción', value: transactionCode, copyable: true },
    { label: 'Monto', value: `${currencySymbol} ${data.amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
    { label: 'Moneda', value: data.currency },
    ...(data.exchangeRate ? [{ label: 'Tipo de cambio', value: `1 ${data.convertedCurrency} = ${data.exchangeRate} PEN` }] : []),
    ...(data.convertedAmount ? [{ label: 'Equivalente en PEN', value: `S/ ${data.convertedAmount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` }] : []),
    { label: 'Destinatario', value: data.recipient },
    ...(data.bank ? [{ label: 'Banco destino', value: data.bank }] : []),
    ...(data.company ? [{ label: 'Empresa', value: data.company }] : []),
    ...(data.university ? [{ label: 'Universidad', value: data.university }] : []),
    { label: 'Método', value: data.method },
    { label: 'Comisión', value: data.fee === 0 ? 'Gratis' : `S/ ${data.fee.toFixed(2)}` },
    { label: 'Fecha', value: now.toLocaleDateString('es-PE') },
    { label: 'Hora', value: now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) },
    { label: 'Saldo restante', value: `S/ ${balanceAfter.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
  ];

  return (
    <div className="flex flex-col items-center px-4 py-6 animate-fade-in">
      <div className="mb-4 flex items-center gap-2">
        <img src="/favicon.png" alt="FinPay" className="h-10 w-10" />
        <span className="text-lg font-bold text-foreground">FinPay</span>
      </div>

      <div className={`${s.bg} mb-4 flex h-20 w-20 items-center justify-center rounded-full`}>
        <s.icon className={`h-10 w-10 ${s.color}`} />
      </div>
      <h2 className={`text-xl font-bold ${s.color}`}>{s.label}</h2>
      <p className="mt-1 text-3xl font-bold text-foreground">
        {currencySymbol} {data.amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
      </p>

      <div className="mt-6 w-full rounded-xl border border-border bg-card p-4 fintech-shadow">
        <div className="space-y-3">
          {rows.map((row, i) => (
            <div key={i} className="flex items-start justify-between gap-3 text-sm">
              <span className="text-muted-foreground shrink-0">{row.label}</span>
              <div className="flex items-center gap-1">
                <span className="text-right font-medium text-foreground">{row.value}</span>
                {'copyable' in row && row.copyable && (
                  <button onClick={handleCopy} className="text-muted-foreground hover:text-primary">
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex w-full gap-3">
        <Button variant="outline" size="lg" className="flex-1 gap-2">
          <Share2 className="h-4 w-4" /> Compartir
        </Button>
        <Button variant="outline" size="lg" className="flex-1 gap-2">
          <Download className="h-4 w-4" /> Descargar
        </Button>
      </div>

      <Button size="xl" className="mt-4 w-full gap-2" onClick={() => navigate('/home')}>
        Volver al inicio <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
