import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Bell, HelpCircle, FileText, ChevronRight, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const items = [
    { icon: User, label: 'Datos personales', path: '/profile' },
    { icon: Shield, label: 'Seguridad', path: '/security' },
    { icon: Bell, label: 'Notificaciones', path: '/settings' },
    { icon: FileText, label: 'Documentos', path: '/profile' },
    { icon: HelpCircle, label: 'Ayuda y soporte', path: '/profile' },
  ];

  return (
    <AppLayout>
      <PageHeader title="Perfil" showBack={false} />
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-4 animate-fade-in sm:px-6 lg:px-8">
        <div className="flex flex-col items-center py-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">JP</div>
          <h2 className="mt-3 text-lg font-bold text-foreground">Juan Pérez</h2>
          <p className="text-sm text-muted-foreground">juan.perez@email.com</p>
          <p className="text-xs text-muted-foreground">+51 987 654 321</p>
        </div>

        <div className="rounded-xl border border-border bg-card fintech-shadow">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.path)}
              className="flex w-full items-start gap-3 border-b border-border px-4 py-3.5 text-left transition-colors hover:bg-muted/50 active:bg-muted last:border-0 sm:items-center"
            >
              <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground sm:mt-0" />
              <span className="min-w-0 flex-1 break-words text-sm font-medium text-foreground">{item.label}</span>
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground sm:mt-0" />
            </button>
          ))}
        </div>

        <Button variant="outline" size="lg" className="w-full gap-2 text-destructive border-destructive/20 hover:bg-destructive/5" onClick={() => { logout(); navigate('/'); }}>
          <LogOut className="h-4 w-4" /> Cerrar sesión
        </Button>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
