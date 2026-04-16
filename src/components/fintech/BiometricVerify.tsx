import { Fingerprint, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface BiometricVerifyProps {
  onVerified: () => void;
  onCancel: () => void;
}

export const BiometricVerify = ({ onVerified, onCancel }: BiometricVerifyProps) => {
  const [verifying, setVerifying] = useState(false);

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      onVerified();
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center animate-fade-in">
      <div className="fintech-gradient mb-6 flex h-24 w-24 items-center justify-center rounded-full">
        {verifying ? (
          <Loader2 className="h-12 w-12 animate-spin text-primary-foreground" />
        ) : (
          <Fingerprint className="h-12 w-12 text-primary-foreground" />
        )}
      </div>
      <h2 className="text-xl font-bold text-foreground">Verificación biométrica</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {verifying ? 'Verificando tu identidad...' : 'Toca el sensor de huella para confirmar la operación'}
      </p>
      <div className="mt-8 flex w-full flex-col gap-3">
        <Button size="xl" onClick={handleVerify} disabled={verifying} className="w-full">
          {verifying ? 'Verificando...' : 'Verificar con huella'}
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={verifying}>
          Cancelar
        </Button>
      </div>
    </div>
  );
};
