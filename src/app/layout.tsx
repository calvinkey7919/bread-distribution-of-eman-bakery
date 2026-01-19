import type { Metadata } from "next";
import { SessionProvider } from "@/providers/SessionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bread Distribution System - Eman Bakery",
  description: "Production-ready distribution logistics platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
