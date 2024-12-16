import { Navbar } from "@/components/Navbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        {children}
      </main>
    </div>
  );
};