import { useState } from 'react';
import { Fingerprint, KeyRound, Loader2, AlertTriangle, HelpCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const [mode, setMode] = useState<'biometric' | 'pin'>('biometric');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, verifyBiometric, failedAttempts, isLocked, lockUntil } = useAuthStore();
  const navigate = useNavigate();

  const handleBiometric = () => {
    setLoading(true);
    setTimeout(() => {
      verifyBiometric();
      navigate('/home');
    }, 1200);
  };

  const handlePinSubmit = () => {
    if (pin.length !== 6) {
      setError('Ingresa tu clave de 6 dígitos');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const success = login(pin);
      setLoading(false);
      if (success) {
        navigate('/home');
      } else {
        setError(isLocked ? 'Cuenta bloqueada. Intenta en 5 minutos.' : `Clave incorrecta. ${5 - failedAttempts} intentos restantes.`);
        setPin('');
      }
    }, 800);
  };

  const lockedMinutes = lockUntil ? Math.ceil((lockUntil - Date.now()) / 60000) : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero gradient header */}
      <div className="relative flex flex-col items-center overflow-hidden">
        {/* Background with gradient and decorative elements */}
        <div className="absolute inset-0 fintech-gradient" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/20" />
          <div className="absolute -right-10 top-10 h-40 w-40 rounded-full bg-white/15" />
          <div className="absolute left-1/4 top-1/2 h-32 w-32 rounded-full bg-white/10" />
          <div className="absolute right-1/4 -bottom-10 h-48 w-48 rounded-full bg-white/10" />
        </div>

        {/* Top bar */}
        <div className="relative z-10 flex w-full max-w-lg items-center justify-between px-5 pt-12 pb-2">
          <div className="flex items-center gap-1">
            <HelpCircle className="h-5 w-5 text-primary-foreground/70" />
          </div>
          <div className="flex items-center gap-1">
            <Phone className="h-5 w-5 text-primary-foreground/70" />
          </div>
        </div>

        {/* Logo */}
        <div className="relative z-10 flex flex-col items-center pb-10 pt-6">
          <img
            src="/favicon.png"
            alt="FinPay"
            className="mb-3 h-20 w-20 drop-shadow-lg"
          />
          <span className="text-2xl font-bold tracking-tight text-primary-foreground">
            FinPay
          </span>
        </div>
      </div>

      {/* Login card */}
      <div className="relative z-10 -mt-5 flex flex-1 flex-col rounded-t-3xl bg-card shadow-2xl">
        <div className="mx-auto w-full max-w-sm px-6 pt-8 pb-6 animate-fade-in">
          {/* Greeting */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-foreground">{getGreeting()}</h1>
            <p className="mt-1 text-sm text-muted-foreground">¡Qué bueno tenerte por aquí!</p>
          </div>

          {isLocked && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              Cuenta bloqueada por seguridad. Intenta en {lockedMinutes} min.
            </div>
          )}

          {mode === 'biometric' ? (
            <div className="flex flex-col items-center text-center">
              <button
                onClick={handleBiometric}
                disabled={loading || isLocked}
                className="group relative mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-primary/10 transition-all active:scale-95 disabled:opacity-50"
              >
                <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse" />
                <div className="relative fintech-gradient flex h-20 w-20 items-center justify-center rounded-full shadow-lg transition-transform group-hover:scale-105">
                  {loading ? (
                    <Loader2 className="h-10 w-10 animate-spin text-primary-foreground" />
                  ) : (
                    <Fingerprint className="h-10 w-10 text-primary-foreground" />
                  )}
                </div>
              </button>
              <p className="text-sm text-muted-foreground">
                {loading ? 'Verificando identidad...' : 'Toca para acceder con huella'}
              </p>
              <Button variant="ghost" className="mt-6 gap-2 text-primary" onClick={() => setMode('pin')} disabled={loading}>
                <KeyRound className="h-4 w-4" /> Usar clave secreta
              </Button>
            </div>
          ) : (
            <div>
              <p className="mb-4 text-center text-sm text-muted-foreground">Ingresa tu clave secreta de 6 dígitos</p>
              <div className="mb-4 flex justify-center gap-2.5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-12 w-10 rounded-lg border-2 flex items-center justify-center text-xl font-bold transition-all ${
                      i < pin.length ? 'border-primary bg-primary/10 text-foreground scale-105' : 'border-border bg-muted/30 text-transparent'
                    }`}
                  >
                    {pin[i] ? '•' : ''}
                  </div>
                ))}
              </div>

              {error && <p className="mb-3 text-center text-sm text-destructive">{error}</p>}

              {/* Numeric keypad */}
              <div className="grid grid-cols-3 gap-2">
                {[1,2,3,4,5,6,7,8,9,null,0,'del'].map((key, i) => (
                  <button
                    key={i}
                    disabled={loading || isLocked || key === null}
                    onClick={() => {
                      if (key === 'del') setPin(p => p.slice(0, -1));
                      else if (typeof key === 'number' && pin.length < 6) setPin(p => p + key);
                      setError('');
                    }}
                    className={`flex h-14 items-center justify-center rounded-xl text-lg font-semibold transition-colors active:bg-primary/10 ${
                      key === null ? 'invisible' : 'bg-muted/30 hover:bg-muted text-foreground'
                    }`}
                  >
                    {key === 'del' ? '⌫' : key}
                  </button>
                ))}
              </div>

              <Button size="xl" className="mt-4 w-full" onClick={handlePinSubmit} disabled={pin.length !== 6 || loading || isLocked}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Ingresar'}
              </Button>

              <div className="mt-4 flex justify-between text-sm">
                <Button variant="ghost" size="sm" className="gap-1 text-primary" onClick={() => { setMode('biometric'); setError(''); setPin(''); }}>
                  <Fingerprint className="h-4 w-4" /> Usar huella
                </Button>
                <Button variant="link" size="sm" className="text-primary" onClick={() => navigate('/recovery')}>
                  ¿Olvidaste tu clave?
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Version */}
        <div className="mt-auto pb-6 text-center">
          <p className="text-xs text-muted-foreground/50">V.1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
