import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";
import { Providers } from "./provider";
import { defaultMetadata } from "./seo-config";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-black-100 transition-colors duration-300`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


