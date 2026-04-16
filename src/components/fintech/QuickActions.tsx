import { useNavigate } from 'react-router-dom';
import { Smartphone, QrCode, Zap, GraduationCap, Landmark, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const actions = [
  { icon: Smartphone, label: 'Celular', path: '/pay/phone', color: 'bg-blue-50 text-blue-600' },
  { icon: QrCode, label: 'QR', path: '/pay/qr', color: 'bg-violet-50 text-violet-600' },
  { icon: Zap, label: 'Servicio', path: '/pay/services', color: 'bg-amber-50 text-amber-600' },
  { icon: GraduationCap, label: 'Universidades', path: '/pay/universities', color: 'bg-rose-50 text-rose-600' },
  { icon: Landmark, label: 'Bancos', path: '/pay/banks', color: 'bg-cyan-50 text-cyan-600' },
  { icon: Globe, label: 'Internacional', path: '/pay/international', color: 'bg-indigo-50 text-indigo-600' },
];

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-3 gap-3">
      {actions.map((action) => (
        <button
          key={action.path}
          onClick={() => navigate(action.path)}
          className="flex flex-col items-center gap-1.5 rounded-xl p-3 transition-all hover:bg-muted active:scale-95"
        >
          <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", action.color)}>
            <action.icon className="h-5 w-5" />
          </div>
          <span className="text-[11px] font-medium text-foreground">{action.label}</span>
        </button>
      ))}
    </div>
  );
};
