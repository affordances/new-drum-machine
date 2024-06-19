import type { Metadata } from "next";
import { Reddit_Mono } from "next/font/google";

import "./globals.css";

export const metadata: Metadata = {
  title: "reDrummer",
  description: "a polyrhythmic drum machine",
};

const font = Reddit_Mono({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/icon.ico" sizes="any" />
      </head>
      <body className={font.className}>{children}</body>
    </html>
  );
}
