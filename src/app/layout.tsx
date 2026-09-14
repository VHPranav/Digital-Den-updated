import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Syne, Space_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransitionProvider from "@/components/PageTransitionProvider";
import FluidCursorRipple from "@/components/FluidCursorRipple";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "Digital Den",
  description: "Digital Den",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.className} ${plusJakarta.variable} ${syne.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="preload"
          href="/models/emblem-opt.glb"
          as="fetch"
          crossOrigin="anonymous"
        />
        {/* Prefetch (not preload) — this model is only needed once the user scrolls
            deep into the spine carousel section, so it shouldn't compete with the
            emblem GLB and initial JS for bandwidth on first paint. */}
        <link
          rel="prefetch"
          href="/models/spinenw-opt.glb"
          as="fetch"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col bg-black text-white selection:bg-teal-500 selection:text-white">
        <PageTransitionProvider />
        <FluidCursorRipple />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
