import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals-gametime-unified.css";
import "./force-colors.css";
import "./button-fix.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ClientOptimizations } from "@/components/ClientOptimizations";
import { AntiFlashOverlay } from "@/components/AntiFlashOverlay";
import { LogoutStabilizer } from "@/components/LogoutStabilizer";
import PerformanceMonitor from "@/components/dev/PerformanceMonitor";
import HydrationMonitor from "@/components/dev/HydrationMonitor";
import HydrationFix, { ThemeHydrationFix, HydrationErrorBoundary } from "@/components/HydrationFix";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Optimización crítica para fonts
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono", 
  subsets: ["latin"],
  display: 'swap', // Optimización crítica para fonts
});

export const metadata: Metadata = {
  title: "Boletería - Entradas y Transportes en Perú",
  description: "La plataforma líder en venta de entradas para eventos y reserva de transportes en Perú. Encuentra conciertos, obras de teatro, deportes y más.",
  keywords: "entradas, eventos, transportes, conciertos, teatro, deportes, Perú, Lima, Cusco",
  authors: [{ name: "Boletería Team" }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        {/* Preload critical CSS */}
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/* Prevenir flash blanco inmediatamente */}
        <style dangerouslySetInnerHTML={{__html: `
          * { 
            box-sizing: border-box; 
          }
          html { 
            background: #0E0E0F !important;
            margin: 0; 
            padding: 0;
            min-height: 100vh;
            color: #FFFFFF !important;
          }
          body { 
            background: #0E0E0F !important;
            margin: 0; 
            padding: 0;
            min-height: 100vh;
            color: #FFFFFF !important;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
          }
          #__next {
            background: #0E0E0F !important;
            min-height: 100vh;
          }
          nav, header, [role="banner"] { 
            background: #000000 !important; 
          }
          footer, [role="contentinfo"] { 
            background: #000000 !important; 
          }
          main, [role="main"] {
            background: #0E0E0F !important;
          }
          .bg-gradient-dark, .bg-body-bg, .bg-body-bg, .bg-body-bg {
            background: #0E0E0F !important;
          }
          .bg-header-bg {
            background: #000000 !important;
          }
          .bg-footer-bg {
            background: #000000 !important;
          }
          [class*="bg-gradient"] {
            background: #0E0E0F !important;
            background-image: none !important;
          }
        `}} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen text-white flex flex-col bg-body-bg`}
        style={{ backgroundColor: '#0E0E0F', transition: 'none' }}
      >
        <ClientOptimizations>
          <HydrationErrorBoundary>
            <HydrationFix />
            <ThemeHydrationFix />
            <AntiFlashOverlay />
            <LogoutStabilizer />
            <Navigation />
            <main className="pt-12 sm:pt-14 md:pt-16 lg:pt-18 bg-transparent flex-1">
              {children}
            </main>
            <Footer />
            <PerformanceMonitor />
            <HydrationMonitor />
          </HydrationErrorBoundary>
        </ClientOptimizations>
      </body>
    </html>
  );
}
