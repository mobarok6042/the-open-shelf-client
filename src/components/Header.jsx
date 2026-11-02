"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Menu, UserRound } from "lucide-react";
import { toast } from "sonner";
import { authClient, useSession } from "@/lib/auth-client";
import LoadingSpinner from "@/components/LoadingSpinner";

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
  { label: "Sign in", href: "/sign-in" },
  { label: "Sign up", href: "/sign-up" },
];

function UserMenu({ user }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);
  const username = user.username || user.name;

  async function handleSignOut() {
    setErrorMessage("");
    setIsSigningOut(true);

    try {
      const { error } = await authClient.signOut();
      if (error) {
        throw new Error(error.message || "Could not sign out.");
      }

      setIsOpen(false);
      toast.success("You’ve been signed out.");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Sign-out failed. Please try again.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
        onFocus={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-full border border-foreground/10 bg-background/40 py-1 pl-1 pr-3 text-left text-sm font-medium text-foreground shadow-sm backdrop-blur-xl transition-all hover:bg-background/65"
      >
        <span className="inline-flex size-9 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-semibold text-primary">
          {user.image ? (
            <Image
              src={user.image}
              alt=""
              width={36}
              height={36}
              unoptimized
              className="size-full object-cover"
            />
          ) : (
            username?.charAt(0)?.toUpperCase() || "R"
          )}
        </span>
        <span className="max-w-32 truncate">Welcome, {username}</span>
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-[60] w-60 rounded-2xl border border-foreground/10 bg-background/90 p-2 text-foreground shadow-xl shadow-foreground/10 backdrop-blur-2xl"
        >
          <div className="border-b border-foreground/10 px-3 py-2">
            <p className="truncate text-sm font-semibold">Welcome, {username}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-foreground/8"
          >
            <UserRound className="size-4" />
            My profile
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
          >
            {isSigningOut ? <LoadingSpinner /> : <LogOut className="size-4" />}
            {isSigningOut ? "Signing out..." : "Sign out"}
          </button>
          {errorMessage && (
            <p role="alert" className="px-3 py-2 text-xs text-destructive">
              {errorMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, isPending } = useSession();
  const user = session?.user;

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
          {isPending ? (
            <LoadingSpinner className="size-5 text-primary" label="Loading account" />
          ) : user ? (
            <UserMenu user={user} />
          ) : (
            accountLinks.map((item, index) => (
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
            ))
          )}
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

            <div className="mt-auto flex items-center justify-between gap-3 border-t border-foreground/10 px-6 py-5">
              {user ? (
                <div className="ml-auto">
                  <UserMenu user={user} />
                </div>
              ) : (
                accountLinks.map((item, index) => (
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
                ))
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
