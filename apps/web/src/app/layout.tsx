import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionInitializer } from "@/components/auth/session-initializer";
import { ToastContainer } from "@/components/toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FeaturePulse — Feature intelligence for engineering teams",
    template: "%s · FeaturePulse",
  },
  description:
    "A multi-tenant feature intelligence platform: track feature lifecycle, define events, manage sources and API keys, and measure instrumentation coverage.",
  applicationName: "FeaturePulse",
  openGraph: {
    title: "FeaturePulse — Feature intelligence for engineering teams",
    description:
      "Track feature lifecycle, define events, manage sources and API keys, and measure instrumentation coverage.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SessionInitializer>{children}</SessionInitializer>
        <ToastContainer />
      </body>
    </html>
  );
}
