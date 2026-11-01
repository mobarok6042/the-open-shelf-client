import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Footer from "@/components/Footer";
import AppToaster from "@/components/AppToaster";
import Header from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";
import ThemeToggle from "@/components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "The Open Shelf | Books for curious minds",
    template: "%s | The Open Shelf",
  },
  description:
    "An independent bookshop with hand-picked fiction, non-fiction, and beautiful editions for curious minds.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Header />
        <SmoothScroll />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
        <ThemeToggle />
        <AppToaster />
      </body>
    </html>
  );
}
