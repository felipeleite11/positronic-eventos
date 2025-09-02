import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";

import NavbarAuth from "@/components/NavbarAuth";
import MainMenu from "@/components/MainMenu";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Positronic Eventos",
  description: "Positronic Eventos"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
            <div className="grid grid-cols-[14rem_auto] grid-rows-[auto_1fr] min-h-screen">
              <NavbarAuth />

              <MainMenu />

              <main className="flex flex-col pl-10 pt-8 pr-8 pb-8">
                {children}
              </main>
            </div>
        </Providers>

        <Toaster />
      </body>
    </html>
  );
}
