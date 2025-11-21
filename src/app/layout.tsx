import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// @ts-ignore
import "./globals.css";
import ClerkProvider from "@/providers/ClerkProvider";
import ReactQueryProvider from "@/providers/QueryProvider";
import { Navigation } from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hylandia - A Minigames Server for Hytale",
  description:
    "A progressive minigames server where your progress actually means something. Launching shortly after Hytale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ReactQueryProvider>
        <html lang="en" className="dark">
          <body
            className={`${geistSans.variable} overflow-x-hidden ${geistMono.variable} antialiased`}
          >
            <Navigation />
            <main className="min-h-screen">{children}</main>
          </body>
        </html>
      </ReactQueryProvider>
    </ClerkProvider>
  );
}
