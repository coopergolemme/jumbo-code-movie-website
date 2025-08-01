import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import ProvidersWrapper from "@/components/ProvidersWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JumboBoxd - Track Your Movies",
  description: "Discover, track, and rate your favorite movies",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-indigo-900">
          <ProvidersWrapper>{children}</ProvidersWrapper>
        </main>
      </body>
    </html>
  );
}
