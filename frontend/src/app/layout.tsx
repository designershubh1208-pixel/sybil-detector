import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Beacon | Wallet Trust Intelligence",
  description: "Beacon: The Palantir of Web3 Wallet Trust. Detect Sybil Wallets Before They Drain Your Rewards.",
  openGraph: {
    title: "Beacon | Wallet Trust Intelligence",
    description: "Beacon: The Palantir of Web3 Wallet Trust. Analyze blockchain behavior to uncover hidden Sybil networks.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent)] selection:text-white min-h-screen flex flex-col")}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
