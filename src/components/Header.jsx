"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigation = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/books" },
  { label: "Add Book", href: "/add-book" },
  { label: "My Books", href: "/my-books" },
  { label: "My Borrows", href: "/my-borrows" },
];

const accountLinks = [
  { label: "Sign in", href: "/signin" },
  { label: "Sign up", href: "/signup" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/35 shadow-[0_8px_30px_rgba(22,75,54,0.06)] backdrop-blur-2xl backdrop-saturate-150 transition-colors duration-300">
      <div className="mx-auto grid h-16 w-full max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-4 sm:h-20 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] sm:gap-3"
          aria-label="The Open Shelf home"
        >
          <Image
            src="/logo.png"
            alt=""
            width={88}
            height={88}
            priority
            className="size-11 shrink-0 object-contain sm:size-14"
          />
          <span className="flex min-w-0 flex-col">
            <span className="truncate font-heading text-sm font-semibold tracking-tight text-foreground transition-colors duration-300 sm:text-base">
              The Open Shelf
            </span>
            <span className="mt-0.5 hidden text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition-colors duration-300 sm:block">
              Books for curious minds
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center justify-center gap-1 lg:flex"
          aria-label="Main navigation"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-foreground/75 transition-all duration-200 hover:-translate-y-0.5 hover:bg-foreground/8 hover:text-foreground active:scale-95 xl:px-3.5"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center justify-end gap-2 lg:flex">
          {accountLinks.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${
                index === 1
                  ? "bg-primary text-primary-foreground shadow-md shadow-foreground/10 hover:bg-primary/90"
                  : "border border-foreground/15 text-foreground hover:bg-foreground/8"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger
            aria-label="Open navigation menu"
            className="inline-flex size-10 items-center justify-center justify-self-end rounded-full border border-foreground/15 bg-background/35 text-foreground shadow-sm backdrop-blur-xl transition-all duration-200 hover:scale-105 hover:bg-foreground/8 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F39A32] lg:hidden"
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(88vw,24rem)] border-l-foreground/10 bg-background/80 p-0 text-foreground backdrop-blur-2xl sm:max-w-sm">
            <SheetHeader className="border-b border-foreground/10 px-6 py-6 text-left">
              <SheetTitle className="flex items-center gap-3 text-foreground">
                <Image
                  src="/logo.png"
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 rounded-xl object-contain"
                />
                <span className="font-heading text-lg font-semibold">The Open Shelf</span>
              </SheetTitle>
              <SheetDescription className="pl-[3.25rem] text-foreground/65">
                Find your next favorite story.
              </SheetDescription>
            </SheetHeader>

            <nav className="flex flex-col gap-1 px-4 py-5" aria-label="Mobile navigation">
              {navigation.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 hover:translate-x-1 hover:bg-foreground/8 active:scale-[0.98]"
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-foreground/6 text-xs font-semibold text-foreground/60">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex gap-3 border-t border-foreground/10 px-6 py-5">
              {accountLinks.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex-1 rounded-full px-4 py-3 text-center text-sm font-semibold transition-colors ${
                    index === 1
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-foreground/15 text-foreground hover:bg-foreground/8"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
