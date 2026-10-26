import type { Metadata } from "next";
import { MobileBottomBar } from "@/components/MobileBottomBar";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Griddy Games Cheats",
  description: "Griddy Cheat Engine — futbol temalı cheat kütüphanesi",
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
      </body>
    </html>
  );
}
