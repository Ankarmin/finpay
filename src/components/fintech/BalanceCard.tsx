import { Eye, EyeOff } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
  currency: string;
  currencySymbol: string;
  accountNumber: string;
  showBalance: boolean;
  onToggleVisibility: () => void;
}

export const BalanceCard = ({ balance, currency, currencySymbol, accountNumber, showBalance, onToggleVisibility }: BalanceCardProps) => {
  return (
    <div className="fintech-gradient rounded-2xl p-5 text-primary-foreground fintech-shadow-lg">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium opacity-90">Saldo disponible</p>
        <button onClick={onToggleVisibility} className="rounded-lg p-1.5 transition-colors hover:bg-white/10 active:scale-95" aria-label={showBalance ? 'Ocultar saldo' : 'Mostrar saldo'}>
          {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </button>
      </div>
      <p className="mt-1 text-3xl font-bold tracking-tight">
        {showBalance ? `${currencySymbol} ${balance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` : '••••••'}
      </p>
      <div className="mt-3 flex items-center justify-between text-sm opacity-80">
        <span>Cuenta {accountNumber}</span>
        <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium">{currency}</span>
      </div>
    </div>
  );
};
