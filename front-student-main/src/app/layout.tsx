import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Student Helpdesk • Agent 65 | Unified University Command Center",
  description:
    "Single point of access for authenticated students to personal institutional records, attendance telemetry, examinations, fees, curriculum, and student services.",
};

import { StudentProvider } from "@/context/StudentContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full ${jakarta.variable} ${geistMono.variable}`}>
      <body className="min-h-full flex flex-col antialiased bg-[#f8fafc] text-slate-800 selection:bg-blue-100 selection:text-blue-900">
        <StudentProvider>
          {children}
        </StudentProvider>
      </body>
    </html>
  );
}
