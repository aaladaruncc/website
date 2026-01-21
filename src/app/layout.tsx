import type { Metadata } from "next";
import { Bricolage_Grotesque, Cabin } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
});

const cabin = Cabin({
  subsets: ["latin"],
  variable: "--font-cabin",
});
export const metadata: Metadata = {
  title: "Aryan Aladar",
  description: "Student, Founder & Researcher at UNC Chapel Hill. Passionate about technology, AI/ML, and community impact.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${bricolageGrotesque.variable} ${cabin.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
