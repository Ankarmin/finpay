import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Shield, Fingerprint, KeyRound, Smartphone, Eye, ChevronRight, ToggleRight } from 'lucide-react';

const SecurityPage = () => {
  const items = [
    { icon: KeyRound, label: 'Cambiar clave secreta', desc: 'Actualiza tu PIN de 6 dígitos' },
    { icon: Fingerprint, label: 'Huella dactilar', desc: 'Activada para login y pagos' },
    { icon: Smartphone, label: 'Dispositivos autorizados', desc: '1 dispositivo activo' },
    { icon: Eye, label: 'Privacidad', desc: 'Ocultar saldo automáticamente' },
    { icon: ToggleRight, label: 'Verificación en dos pasos', desc: 'Activa para pagos sensibles' },
  ];

  return (
    <AppLayout>
      <PageHeader title="Seguridad" />
      <div className="px-4 py-4 mx-auto max-w-lg space-y-4 animate-fade-in">
        <div className="flex items-center gap-3 rounded-xl bg-accent p-4 fintech-shadow">
          <Shield className="h-6 w-6 text-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground">Tu cuenta está protegida</p>
            <p className="text-xs text-muted-foreground">Todas las verificaciones de seguridad están activas</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card fintech-shadow">
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

export default SecurityPage;
