import { BottomNav } from './BottomNav';

interface AppLayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export const AppLayout = ({ children, showNav = true }: AppLayoutProps) => {
  return (
    <div className="mx-auto min-h-screen max-w-lg bg-background">
      <main className={showNav ? "pb-20" : ""}>
        {children}
      </main>
      {showNav && <BottomNav />}
    </div>
  );
};
