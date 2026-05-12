import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "AMITEC Fichajes — Control Horario",
  description: "Sistema moderno de control horario y fichajes para empresas",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AMITEC",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#070B14" },
    { media: "(prefers-color-scheme: light)", color: "#F0F4FF" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
