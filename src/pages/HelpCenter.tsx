import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { CircleHelp, Headphones, Mail, MessageCircle, Phone } from 'lucide-react';

const faqs = [
  {
    question: '¿Por qué a veces te pedimos huella o verificación?',
    answer: 'La usamos en pagos sensibles para confirmar que la operación la estás haciendo tú.',
  },
  {
    question: '¿Qué significa un envío pendiente?',
    answer: 'Tu operación ya salió de FinPay, pero el banco o comercio todavía la está confirmando.',
  },
  {
    question: '¿Qué hago si no me alcanza el saldo?',
    answer: 'Puedes revisar tu historial, intentar con un monto menor o recargar tu billetera antes de volver a enviar.',
  },
  {
    question: '¿Cómo recupero mi acceso?',
    answer: 'Desde inicio de sesión toca "¿Olvidaste tu clave?" y te enviaremos instrucciones al correo registrado.',
  },
];

const HelpCenterPage = () => {
  const navigate = useNavigate();

  const handleOpenChat = () => {
    toast({
      title: 'Soporte listo para ayudarte',
      description: 'Escríbenos a ayuda@finpay.app y te responderemos lo antes posible.',
    });
  };

  const handleCall = () => {
    window.location.href = 'tel:+51800000000';
  };

  const handleEmail = () => {
    window.location.href = 'mailto:ayuda@finpay.app?subject=Ayuda%20FinPay';
  };

  return (
    <AppLayout>
      <PageHeader title="Ayuda" subtitle="Resuelve dudas rápidas o habla con soporte" backTo="/home" />
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-4 animate-fade-in sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-4 fintech-shadow">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Headphones className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">Ayuda contextual</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Si ves un error o no sabes qué significa un estado, entra aquí desde el icono `?` del encabezado.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Button type="button" variant="outline" size="lg" className="justify-start gap-2" onClick={handleOpenChat}>
            <MessageCircle className="h-4 w-4" />
            Abrir chat
          </Button>
          <Button type="button" variant="outline" size="lg" className="justify-start gap-2" onClick={handleEmail}>
            <Mail className="h-4 w-4" />
            Enviar correo
          </Button>
          <Button type="button" variant="outline" size="lg" className="justify-start gap-2" onClick={handleCall}>
            <Phone className="h-4 w-4" />
            Llamar soporte
          </Button>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 fintech-shadow">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <CircleHelp className="h-4 w-4 text-primary" />
            Preguntas frecuentes
          </div>
          <div className="space-y-3">
            {faqs.map((item) => (
              <div key={item.question} className="rounded-xl bg-accent p-3">
                <p className="text-sm font-medium text-foreground">{item.question}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 fintech-shadow">
          <p className="text-sm font-semibold text-foreground">Atajos útiles</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Button type="button" variant="ghost" className="justify-start" onClick={() => navigate('/history')}>
              Ver mis movimientos
            </Button>
            <Button type="button" variant="ghost" className="justify-start" onClick={() => navigate('/recovery')}>
              Recuperar acceso
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default HelpCenterPage;
