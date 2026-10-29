import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

import { Cursor } from "@/components/cursor";
import { InkTrail } from "@/components/ink-trail";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PageTransition } from "@/components/transition/page-transition";
import { initScript } from "@/lib/init-script";
import { SITE_URL } from "@/lib/site";

import "./globals.css";

const clash = localFont({
  src: "../fonts/ClashDisplay-Semibold.woff2",
  weight: "600",
  variable: "--font-clash",
  display: "swap",
});

const general = localFont({
  src: [
    { path: "../fonts/GeneralSans-Regular.woff2", weight: "400" },
    { path: "../fonts/GeneralSans-Medium.woff2", weight: "500" },
  ],
  variable: "--font-general",
  display: "swap",
});

const geistMono = Geist_Mono({
  weight: ["400", "500"],
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  twitter: { card: "summary_large_image" },
  title: "Mohamed Saleh · Full-stack developer",
  description:
    "Mohamed Saleh builds the systems businesses run on: ERP, ledgers, factory-floor tools and offline apps, from Giza.",
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eceae4" },
    { media: "(prefers-color-scheme: dark)", color: "#141311" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${clash.variable} ${general.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body>
        <SmoothScroll>
          <PageTransition>
            <a
              href="#content"
              className="label-mono sr-only rounded-full bg-fg px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100]"
            >
              Skip to content
            </a>
            <SiteHeader />
            {/* The page sits above the footer, which waits underneath to be revealed. */}
            <div id="content" tabIndex={-1} data-page className="relative z-10 bg-bg outline-none">
              {children}
            </div>
            <SiteFooter />
          </PageTransition>
          <InkTrail />
          <Cursor />
        </SmoothScroll>
        {/* Vercel Web Analytics: page views, no cookies. */}
        <Analytics />
      </body>
    </html>
  );
}
