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
  openGraph: {
    title: "Student Helpdesk • Agent 65",
    description: "Unified University Command Center for institutional records and services.",
    url: "https://helpdesk.university.edu",
    siteName: "Student Helpdesk",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Helpdesk • Agent 65",
    description: "Unified University Command Center for institutional records and services.",
  },
};

export const viewport = {
  themeColor: "#ffffff",
};

import { StudentProvider } from "@/context/StudentContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`h-full ${jakarta.variable} ${geistMono.variable}`}>
      <body className="min-h-full flex flex-col antialiased bg-background text-foreground selection:bg-blue-100 selection:text-blue-900">
        <StudentProvider>
          {children}
        </StudentProvider>
      </body>
    </html>
  );
}
