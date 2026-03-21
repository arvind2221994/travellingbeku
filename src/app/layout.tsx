import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TravellingBeku — Adventure Awaits",
    template: "%s | TravellingBeku",
  },
  description:
    "Discover breathtaking travel stories, tips, and guides from around the world. TravellingBeku — your companion for every journey.",
  keywords: ["travel", "blog", "adventure", "backpacking", "travel tips"],
  authors: [{ name: "TravellingBeku" }],
  openGraph: {
    type: "website",
    siteName: "TravellingBeku",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-neutral-950 text-neutral-100 antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
