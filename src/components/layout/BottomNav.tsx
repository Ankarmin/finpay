import { Home, Clock, QrCode, User, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Inicio', path: '/home' },
  { icon: Clock, label: 'Historial', path: '/history' },
  { icon: QrCode, label: 'QR', path: '/pay/qr', isCenter: true },
  { icon: User, label: 'Perfil', path: '/profile' },
  { icon: Settings, label: 'Ajustes', path: '/settings' },
];

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fintech-shadow safe-bottom fixed bottom-0 left-1/2 z-50 w-full max-w-3xl -translate-x-1/2 border-t border-border bg-card/95 backdrop-blur-md md:bottom-4 md:rounded-2xl md:border">
      <div className="mx-auto flex min-h-[68px] w-full items-end justify-around gap-1 px-2 py-1 sm:px-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path === '/home' && location.pathname === '/home');
          
          if (item.isCenter) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="fintech-gradient -mt-5 flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-primary-foreground shadow-lg transition-transform active:scale-95 sm:h-16 sm:w-16"
              >
                <item.icon className="h-6 w-6" />
              </button>
            );
          }
          
          return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-center text-[11px] leading-tight transition-colors sm:px-3 sm:text-xs",
                  isActive ? "text-primary font-medium" : "text-muted-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
                <span className="text-balance">{item.label}</span>
              </button>
            );
        })}
      </div>
    </nav>
  );
};
