import type { PaymentData } from '@/types';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentSummaryProps {
  data: Partial<PaymentData>;
  showBiometric?: boolean;
  compact?: boolean;
}

export const PaymentSummary = ({ data, showBiometric, compact }: PaymentSummaryProps) => {
  const now = new Date();

  const rows = [
    { label: 'Destinatario', value: data.recipient },
    { label: 'Detalle', value: data.recipientDetail },
    { label: 'Método', value: data.method },
    { label: 'Banco destino', value: data.bank },
    { label: 'Empresa', value: data.company },
    { label: 'Universidad', value: data.university },
    { label: 'Concepto', value: data.concept },
    { label: 'Monto', value: data.amount ? `${data.currency === 'PEN' ? 'S/' : data.currency === 'USD' ? '$' : '€'} ${data.amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` : undefined },
    { label: 'Moneda origen', value: data.currency },
    { label: 'Moneda destino', value: data.convertedCurrency },
    { label: 'Tipo de cambio', value: data.exchangeRate ? `1 ${data.convertedCurrency} = ${data.exchangeRate} ${data.currency}` : undefined },
    { label: 'Monto convertido', value: data.convertedAmount ? `S/ ${data.convertedAmount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` : undefined },
    { label: 'Comisión', value: data.fee !== undefined ? (data.fee === 0 ? 'Gratis' : `S/ ${data.fee.toFixed(2)}`) : undefined },
    { label: 'Total a debitar', value: data.total ? `S/ ${data.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` : undefined },
    { label: 'Fecha', value: now.toLocaleDateString('es-PE') },
    { label: 'Hora', value: now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) },
    { label: 'Descripción', value: data.description },
  ].filter(r => r.value);

  return (
    <div className={cn("rounded-xl border border-border bg-card fintech-shadow", compact ? "p-3" : "p-4")}>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
        <Shield className="h-4 w-4 text-primary" />
        Resumen de operación
      </div>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex flex-col gap-1.5 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <span className="shrink-0 text-muted-foreground">{row.label}</span>
            <span className="min-w-0 break-words text-left font-medium text-foreground sm:max-w-[62%] sm:text-right">{row.value}</span>
          </div>
        ))}
      </div>
      {showBiometric && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-accent p-3 text-xs text-accent-foreground">
          <Shield className="mt-0.5 h-4 w-4 shrink-0" />
          Se requerirá verificación biométrica para confirmar
        </div>
      )}
    </div>
  );
};
