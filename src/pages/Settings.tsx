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
      <div className="mx-auto max-w-3xl px-4 py-4 animate-fade-in sm:px-6 lg:px-8">
        <div className="rounded-xl border border-border bg-card fintech-shadow">
          {items.map((item, i) => (
            <button key={i} className="flex w-full items-start gap-3 border-b border-border px-4 py-3.5 text-left transition-colors hover:bg-muted/50 active:bg-muted last:border-0 sm:items-center">
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
