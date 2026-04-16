import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const PageHeader = ({ title, subtitle, showBack = true, onBack, rightAction }: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 px-4 py-3 backdrop-blur-md safe-top">
      <div className="mx-auto flex max-w-lg items-center gap-3">
        {showBack && (
          <button
            onClick={onBack || (() => navigate(-1))}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-muted active:scale-95"
            aria-label="Volver"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {rightAction}
      </div>
    </header>
  );
};
