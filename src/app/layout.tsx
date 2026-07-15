import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bitrixa - Innovación Científica al Servicio de tu Proyecto",
  description: "Combinamos tecnología de punta con conocimiento científico riguroso para ofrecer servicios profesionales, técnicos y científicos.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Obtener locale de la cookie o usar default
  const messages = await getMessages();

  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-100`}>
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#111827',
                  color: '#fff',
                  border: '1px solid #f97316',
                },
                success: {
                  iconTheme: {
                    primary: '#f97316',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}