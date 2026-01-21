'use client'
import { Footer } from "./Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-[-10%] h-72 w-72 rounded-full bg-accent/20 blur-[120px]" />
        <div className="absolute top-1/3 left-[-15%] h-80 w-80 rounded-full bg-accent-2/15 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-1/4 h-96 w-96 rounded-full bg-white/5 blur-[160px]" />
      </div>
      <div className="relative z-10 px-6 sm:px-10 lg:px-14 py-16">
        <main className="max-w-5xl mx-auto space-y-16">
          {children}
          <Footer />
        </main>
      </div>
    </div>
  );
} 
