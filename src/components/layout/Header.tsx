'use client'
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  external?: boolean;
}

const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/resume", label: "Resume", },
  // { href: "/contact", label: "Contact" }
];

export function Header() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-blur bg-background/70 border-b border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-12 h-16 flex items-center">
        {navItems.map((item) => (
          <a
            key={item.label}
            className={`relative px-4 py-2 text-sm transition-colors ${
              pathname === item.href
                ? "text-foreground"
                : "text-muted hover:text-foreground"
            }`}
            href={item.href}
            {...(item.external && {
              target: "_blank",
              rel: "noopener noreferrer"
            })}
          >
            {item.label}
            {pathname === item.href && (
              <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-foreground rounded-full" />
            )}
          </a>
        ))}
      </div>
    </nav>
  );
}
