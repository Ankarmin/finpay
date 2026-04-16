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
    <nav className="fintech-shadow fixed bottom-0 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 border-t border-border bg-card/95 backdrop-blur-md safe-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path === '/home' && location.pathname === '/home');
          
          if (item.isCenter) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="fintech-gradient -mt-5 flex h-14 w-14 items-center justify-center rounded-full text-primary-foreground shadow-lg transition-transform active:scale-95"
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
                "flex flex-col items-center gap-0.5 px-3 py-2 text-xs transition-colors",
                isActive ? "text-primary font-medium" : "text-muted-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
