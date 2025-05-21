import ClientWrapper from "@/components/clientWrapper";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sistema de Gestión de Practicantes - DIDI",
  description:
    "Sistema de gestión de practicantes para la División de Investigación, Desarrollo e Innovación (DIDI). Herramienta integral para el seguimiento, control y evaluación de practicantes universitarios.",
  keywords: [
    "gestión",
    "practicantes",
    "sistema",
    "DIDI",
    "universidad",
    "seguimiento",
    "investigación",
    "innovación",
  ],
  authors: [{ name: "División de I+D+i (DIDI)" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-gray-50 text-gray-900">
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
