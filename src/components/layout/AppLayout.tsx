import { BottomNav } from './BottomNav';

interface AppLayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export const AppLayout = ({ children, showNav = true }: AppLayoutProps) => {
  return (
    <div className="fintech-canvas mx-auto min-h-screen w-full max-w-lg">
      <main className={showNav ? "pb-20" : ""}>
        {children}
      </main>
      {showNav && <BottomNav />}
    </div>
  );
};
