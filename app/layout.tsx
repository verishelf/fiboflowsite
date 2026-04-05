import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { ClientProviders } from "@/components/providers/ClientProviders";
import { FiboflowSync } from "@/components/providers/FiboflowSync";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FiboFlow — Trade US equities with clarity",
  description:
    "Professional web terminal for Alpaca: charts, orders, portfolio, and optional Fiboflow automation—built like a modern exchange.",
  icons: {
    icon: "/fiboflow-logo.png",
    apple: "/fiboflow-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col bg-black text-zinc-100">
        <div
          className="noise-overlay pointer-events-none fixed inset-0 z-0 opacity-90"
          aria-hidden
        />
        <div className="relative z-[1] flex min-h-full flex-1 flex-col">
          <ClientProviders>
            <FiboflowSync />
            {children}
          </ClientProviders>
        </div>
      </body>
    </html>
  );
}
