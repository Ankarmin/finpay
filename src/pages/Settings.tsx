import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Moon, Bell, Globe, HelpCircle, Info, ChevronRight } from 'lucide-react';

const SettingsPage = () => {
  const items = [
    { icon: Bell, label: 'Notificaciones', desc: 'Push, email, SMS' },
    { icon: Globe, label: 'Idioma', desc: 'Español' },
    { icon: Moon, label: 'Apariencia', desc: 'Modo claro' },
    { icon: HelpCircle, label: 'Centro de ayuda', desc: 'Preguntas frecuentes' },
    { icon: Info, label: 'Acerca de FinPay', desc: 'Versión 1.0.0' },
  ];

  return (
    <AppLayout>
      <PageHeader title="Configuración" showBack={false} />
      <div className="px-4 py-4 mx-auto max-w-lg animate-fade-in">
        <div className="rounded-xl border border-border bg-card">
          {items.map((item, i) => (
            <button key={i} className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/50 active:bg-muted border-b border-border last:border-0">
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
