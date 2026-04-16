import { BottomNav } from './BottomNav';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export const AppLayout = ({ children, showNav = true }: AppLayoutProps) => {
  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl bg-background md:px-4 md:py-4 lg:px-6">
      <div className="fintech-canvas min-h-screen w-full overflow-x-clip md:rounded-[2rem]">
        <main className={cn('min-w-0', showNav && 'pb-24')}>
          {children}
        </main>
        {showNav && <BottomNav />}
      </div>
    </div>
  );
};
