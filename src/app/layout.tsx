import type { Metadata } from "next";
import localFont from "next/font/local";
import SmoothScroll from "@/components/SmoothScroll";
import SiteLoader from "@/components/site/SiteLoader";
import ImageReveal from "@/components/site/ImageReveal";
import "./globals.css";

// Self-hosted (variable, weights 200–800, latin) so the build never depends on fetching Google Fonts.
const plusJakarta = localFont({
  src: [
    { path: "./fonts/PlusJakartaSans.woff2", weight: "200 800", style: "normal" },
    { path: "./fonts/PlusJakartaSans-Italic.woff2", weight: "200 800", style: "italic" },
  ],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Digital Den",
  description: "Digital Den",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.className} ${plusJakarta.variable} h-full antialiased`}
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
      <body className="min-h-full flex flex-col bg-den text-white selection:bg-teal-500 selection:text-white">
        <SiteLoader />
        <ImageReveal />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
