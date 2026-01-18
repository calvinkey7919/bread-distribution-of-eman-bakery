import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eman Bakery - Distribution Management System",
  description: "Complete bread distribution management for Eman Bakery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
