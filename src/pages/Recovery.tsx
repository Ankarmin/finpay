import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Loader2, CheckCircle2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RecoveryPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValidEmail = /\S+@\S+\.\S+/.test(email);

  const handleSubmit = () => {
    if (!isValidEmail) {
      setError('Ingresa un correo válido para enviarte las instrucciones.');
      return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1500);
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col bg-background px-6 py-8 sm:px-8">
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => navigate('/')} className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <img src="/favicon.png" alt="FinPay" className="h-10 w-10" />
          <span className="text-lg font-bold text-foreground">FinPay</span>
        </div>
      </div>

      <div className="flex-1 animate-fade-in">
        {sent ? (
            <div className="flex flex-col items-center pt-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Correo enviado</h1>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">Revisa tu bandeja de entrada y sigue las instrucciones para recuperar tu acceso.</p>
              <Button size="xl" className="mt-8 w-full" onClick={() => navigate('/')}>Volver al inicio</Button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-foreground">Recuperar acceso</h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">Ingresa tu correo registrado y te enviaremos instrucciones para volver a entrar.</p>
            <div className="mt-6">
              <label className="mb-1 block text-sm font-medium text-foreground">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input type="email" placeholder="tu@email.com" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                {email && (
                  <button type="button" onClick={() => { setEmail(''); setError(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Te llegará un mensaje al correo registrado en tu billetera.</p>
              {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
            </div>
            <Button size="xl" className="mt-6 w-full" onClick={handleSubmit} disabled={!isValidEmail || loading}>
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Enviar instrucciones'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default RecoveryPage;
