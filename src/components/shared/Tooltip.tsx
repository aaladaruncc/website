'use client';
import { ReactNode } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
  return (
    <div className="group relative inline-flex">
      {children}
      <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:-translate-y-1 z-50">
        <div className="rounded-md bg-background/95 backdrop-blur-sm px-3 py-1.5 text-xs text-foreground border border-border shadow-lg">
          {content}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-background/95 border-b border-r border-border rotate-45" />
        </div>
      </div>
    </div>
  );
} 