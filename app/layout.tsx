import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Winga",
  description: "Tanzania's Services Guide",

  icons: {
    icon: "/logo/logo.png",
    shortcut: "/logo/logo.png",
    apple: "/logo/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}