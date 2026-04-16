import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Moon, Bell, Globe, HelpCircle, Info, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const SettingsPage = () => {
  const navigate = useNavigate();

  const items = [
    { icon: Bell, label: 'Notificaciones', desc: 'Push, email, SMS', action: () => toast({ title: 'Notificaciones', description: 'La personalización detallada estará disponible pronto.' }) },
    { icon: Globe, label: 'Idioma', desc: 'Español', action: () => toast({ title: 'Idioma actual', description: 'Por ahora la app está disponible en español.' }) },
    { icon: Moon, label: 'Apariencia', desc: 'Modo claro', action: () => toast({ title: 'Apariencia', description: 'El selector de tema llegará en una próxima versión.' }) },
    { icon: HelpCircle, label: 'Centro de ayuda', desc: 'Preguntas frecuentes', action: () => navigate('/help') },
    { icon: Info, label: 'Acerca de FinPay', desc: 'Versión 1.0.0', action: () => toast({ title: 'FinPay', description: 'Tu billetera digital para pagos, transferencias y movimientos rápidos.' }) },
  ];

  return (
    <AppLayout>
      <PageHeader title="Configuración" backTo="/home" />
      <div className="mx-auto max-w-3xl px-4 py-4 animate-fade-in sm:px-6 lg:px-8">
        <div className="rounded-xl border border-border bg-card fintech-shadow">
          {items.map((item, i) => (
            <button key={i} onClick={item.action} className="flex w-full items-start gap-3 border-b border-border px-4 py-3.5 text-left transition-colors hover:bg-muted/50 active:bg-muted last:border-0 sm:items-center">
              <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground sm:mt-0" />
              <div className="min-w-0 flex-1">
                <p className="break-words text-sm font-medium text-foreground">{item.label}</p>
                <p className="break-words text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground sm:mt-0" />
            </button>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
