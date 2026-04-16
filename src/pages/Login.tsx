import { useState } from 'react';
import { Fingerprint, KeyRound, Loader2, AlertTriangle } from 'lucide-react';
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm animate-fade-in">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg overflow-hidden">
            <img src="/favicon.png" alt="FinPay Logo" className="h-24 w-24 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">FinPay</h1>
          <p className="mt-1 text-sm text-muted-foreground">Pagos seguros y rápidos</p>
        </div>

        {isLocked && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/20 bg-red-50 p-3 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Cuenta bloqueada por seguridad. Intenta en {lockedMinutes} min.
          </div>
        )}

        {mode === 'biometric' ? (
          <div className="flex flex-col items-center text-center">
            <button
              onClick={handleBiometric}
              disabled={loading || isLocked}
              className="fintech-gradient mb-6 flex h-28 w-28 items-center justify-center rounded-full transition-transform active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-14 w-14 animate-spin text-primary-foreground" />
              ) : (
                <Fingerprint className="h-14 w-14 text-primary-foreground" />
              )}
            </button>
            <p className="text-sm text-muted-foreground">
              {loading ? 'Verificando identidad...' : 'Toca para acceder con huella'}
            </p>
            <Button variant="ghost" className="mt-6" onClick={() => setMode('pin')} disabled={loading}>
              <KeyRound className="mr-2 h-4 w-4" /> Usar clave secreta
            </Button>
          </div>
        ) : (
          <div>
            <p className="mb-4 text-center text-sm text-muted-foreground">Ingresa tu clave secreta de 6 dígitos</p>
            <div className="mb-4 flex justify-center gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-12 w-10 rounded-lg border-2 flex items-center justify-center text-xl font-bold transition-colors ${
                    i < pin.length ? 'border-primary bg-accent text-foreground' : 'border-border bg-card text-transparent'
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
                  className={`flex h-14 items-center justify-center rounded-xl text-lg font-semibold transition-colors active:bg-muted ${
                    key === null ? 'invisible' : 'bg-card hover:bg-muted text-foreground'
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
              <Button variant="ghost" size="sm" onClick={() => { setMode('biometric'); setError(''); setPin(''); }}>
                <Fingerprint className="mr-1 h-4 w-4" /> Usar huella
              </Button>
              <Button variant="link" size="sm" onClick={() => navigate('/recovery')}>
                ¿Olvidaste tu clave?
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
