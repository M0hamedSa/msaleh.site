import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

import { Cursor } from "@/components/cursor";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PageTransition } from "@/components/transition/page-transition";
import { initScript } from "@/lib/init-script";

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
  title: "Mohamed Saleh · Systems developer",
  description:
    "Mohamed Saleh builds the systems businesses run on: ERP, ledgers, factory-floor tools and offline apps, from Giza.",
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eceae4" },
    { media: "(prefers-color-scheme: dark)", color: "#121417" },
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
            <SiteHeader />
            {/* The page sits above the footer, which waits underneath to be revealed. */}
            <div data-page className="relative z-10 bg-bg">
              {children}
            </div>
            <SiteFooter />
          </PageTransition>
          <Cursor />
        </SmoothScroll>
      </body>
    </html>
  );
}
