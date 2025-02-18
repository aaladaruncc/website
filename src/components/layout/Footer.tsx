'use client';
import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <div className="flex justify-center gap-6 py-8 border-t border-border mt-12">
      <a
        className="text-muted hover:text-foreground transition-colors"
        href="https://github.com/aaladaruncc"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Github className="h-5 w-5" />
      </a>
      <a
        className="text-muted hover:text-foreground transition-colors"
        href="https://linkedin.com/in/aladar"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Linkedin className="h-5 w-5" />
      </a>
      <a
        className="text-muted hover:text-foreground transition-colors"
        href="mailto:aryan.aladar@gmail.com"
      >
        <Mail className="h-5 w-5" />
      </a>
    </div>
  );
} 