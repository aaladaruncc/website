'use client'
import { Header } from "./Header";
import { Footer } from "./Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 px-4 pb-8 sm:px-12">
        <main className="max-w-4xl mx-auto backdrop-blur-sm bg-background/80 rounded-2xl p-8">
          {children}
          <Footer />
        </main>
      </div>
    </>
  );
} 