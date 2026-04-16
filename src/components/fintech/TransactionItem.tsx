import type { Transaction } from '@/types';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionItemProps {
  transaction: Transaction;
  onClick?: () => void;
}

const statusConfig = {
  completed: { icon: CheckCircle2, color: 'text-success', label: 'Completado' },
  pending: { icon: Clock, color: 'text-warning', label: 'Pendiente' },
  failed: { icon: XCircle, color: 'text-destructive', label: 'Fallido' },
  cancelled: { icon: AlertCircle, color: 'text-muted-foreground', label: 'Cancelado' },
};

export const TransactionItem = ({ transaction, onClick }: TransactionItemProps) => {
  const isIncome = transaction.type === 'receive';
  const status = statusConfig[transaction.status];

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted/50 active:bg-muted"
    >
      <div className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
        isIncome ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
      )}>
        {isIncome ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{transaction.description}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <status.icon className={cn("h-3 w-3", status.color)} />
          <span className={cn("text-xs", status.color)}>{status.label}</span>
          <span className="text-xs text-muted-foreground">· {transaction.time}</span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className={cn("text-sm font-semibold", isIncome ? "text-success" : "text-foreground")}>
          {isIncome ? '+' : '-'}{transaction.currencySymbol} {transaction.amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
        </p>
        {transaction.convertedAmount && (
          <p className="text-xs text-muted-foreground">
            ≈ S/ {transaction.convertedAmount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
          </p>
        )}
      </div>
    </button>
  );
};
