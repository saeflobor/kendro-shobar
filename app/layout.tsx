import React from "react";
import type { Metadata } from "next";
import localFont from "next/font/local"; // Import localFont
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

// Configure your custom font
const liAdorNoirrit = localFont({
  src: "./fonts/Li Ador Noirrit Regular.ttf", // Path to your font file
  variable: "--font-sans", // Matches the CSS variable used by Tailwind
  display: "swap",
});

export const metadata: Metadata = {
  title: "কেন্দ্রের প্রহরী",
  description: "আপনার উপস্থিতিই পারে সেই অধিকারের রক্ষাকবচ হয়ে যেকোনো অপশক্তি রুখে দাঁড়াতে, তাই আরো একবার নিজের শক্ত কাঁধে তুলে নিন আরো একটি গুরুদায়িত্ব- কেন্দ্র রক্ষা করতেই হবে!",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover' as const,
  interactiveWidget: 'resizes-content' as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Apply the custom font variable here
    <html lang="bn" className={`${liAdorNoirrit.variable}`}>
      <body className={`font-sans antialiased`}>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
