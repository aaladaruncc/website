import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { AnalyticsGate } from "./analytics-gate";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aryan Aladar",
  description: "Student, Founder & Researcher at UNC Chapel Hill.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={sourceSans.className}>
        {children}
        <AnalyticsGate />
      </body>
    </html>
  );
}
