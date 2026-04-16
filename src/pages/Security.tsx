import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Shield, Fingerprint, KeyRound, Smartphone, Eye, ChevronRight, ToggleRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SecurityPage = () => {
  const items = [
    { icon: KeyRound, label: 'Cambiar clave secreta', desc: 'Actualiza tu PIN de 6 dígitos', action: () => toast({ title: 'Cambio de clave', description: 'Por ahora puedes recuperar tu acceso desde la pantalla de inicio.' }) },
    { icon: Fingerprint, label: 'Huella dactilar', desc: 'Activada para login y pagos', action: () => toast({ title: 'Huella activa', description: 'Tu huella seguirá siendo obligatoria en pagos sensibles.' }) },
    { icon: Smartphone, label: 'Dispositivos autorizados', desc: '1 dispositivo activo', action: () => toast({ title: 'Dispositivo actual', description: 'Pronto podrás gestionar otros equipos desde aquí.' }) },
    { icon: Eye, label: 'Privacidad', desc: 'Ocultar saldo automáticamente', action: () => toast({ title: 'Privacidad', description: 'Ya puedes ocultar tu saldo desde la tarjeta principal en inicio.' }) },
    { icon: ToggleRight, label: 'Verificación en dos pasos', desc: 'Activa para pagos sensibles', action: () => toast({ title: 'Dos pasos', description: 'Seguimos usando huella y verificaciones adicionales en montos sensibles.' }) },
  ];

  return (
    <AppLayout>
      <PageHeader title="Seguridad" backTo="/profile" />
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-4 animate-fade-in sm:px-6 lg:px-8">
        <div className="flex items-start gap-3 rounded-xl bg-accent p-4 fintech-shadow sm:items-center">
          <Shield className="mt-0.5 h-6 w-6 shrink-0 text-primary sm:mt-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">Tu cuenta está protegida</p>
            <p className="break-words text-xs text-muted-foreground">Todas las verificaciones de seguridad están activas</p>
          </div>
        </div>

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

export default SecurityPage;
