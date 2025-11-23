import type { Metadata } from "next";
import { Cinzel, MedievalSharp, Cinzel_Decorative } from "next/font/google";
// @ts-ignore
import "./globals.css";
import ClerkProvider from "@/providers/ClerkProvider";
import ReactQueryProvider from "@/providers/QueryProvider";
import { Navigation } from "@/components/Navigation";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const medievalSharp = MedievalSharp({
  variable: "--font-medieval",
  subsets: ["latin"],
  weight: ["400"],
});

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel-decorative",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Hylandia - A Minigames Server for Hytale",
  description:
    "A progressive minigames server where your progress actually means something. Launching shortly after Hytale.",
  icons: {
    icon: "/media/icon.png",
    shortcut: "/media/icon.png",
    apple: "/media/icon.png",
  },
  openGraph: {
    type: "website",
    url: "https://hylandia.net",
    title: "Hylandia - A Minigames Server for Hytale",
    description:
      "A progressive minigames server where your progress actually means something. Launching shortly after Hytale.",
    siteName: "Hylandia",
    images: [
      {
        url: "/media/banner.png",
        width: 1200,
        height: 630,
        alt: "Hylandia - A Minigames Server for Hytale",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hylandia - A Minigames Server for Hytale",
    description:
      "A progressive minigames server where your progress actually means something. Launching shortly after Hytale.",
    images: ["/media/banner.png"],
  },
  metadataBase: new URL("https://hylandia.net"),
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
            className={`${cinzel.variable} ${medievalSharp.variable} ${cinzelDecorative.variable} overflow-x-hidden antialiased bg-neutral`}
          >
            <Navigation />
            <main className="min-h-screen">{children}</main>
          </body>
        </html>
      </ReactQueryProvider>
    </ClerkProvider>
  );
}
