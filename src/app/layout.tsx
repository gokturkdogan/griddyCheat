import type { Metadata, Viewport } from "next";
import { MobileBottomBar } from "@/components/MobileBottomBar";
import { Navbar } from "@/components/Navbar";
import { PwaProvider } from "@/components/PwaProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Griddy Games Cheats",
  description: "Griddy Cheat Engine — futbol temalı cheat kütüphanesi",
  applicationName: "Griddy Games",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Griddy Games",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [{ url: "/pwa/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/pwa/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#1a4d2e",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="flex min-h-dvh flex-col antialiased">
        <Navbar />
        <main
          className="flex-1 pb-[calc(5.75rem+env(safe-area-inset-bottom,0px))] lg:pb-0"
        >
          {children}
        </main>
        <MobileBottomBar />
        <PwaProvider />
      </body>
    </html>
  );
}
