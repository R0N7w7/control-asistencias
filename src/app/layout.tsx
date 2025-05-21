"use client";

import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Sistema de gestión de practicantes para la División de Investigación, Desarrollo e Innovación (DIDI). Herramienta integral para el seguimiento, control y evaluación de practicantes universitarios."
        />
        <meta name="author" content="DIDI" />
        <meta name="keywords" content="gestión, practicantes, sistema, DIDI, universidad, seguimiento, investigación, innovación" />
        <meta name="theme-color" content="#1e40af" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="icon" href="/favicon.ico" />
        <title>Sistema de Gestión de Practicantes - DIDI</title>
      </head>
      <body className="antialiased bg-gray-50 text-gray-900">
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
