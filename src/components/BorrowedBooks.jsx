"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, RefreshCw, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { apiFetch, API_BASE_URL } from "@/lib/api";

export default function BorrowedBooks() {
  const { data: session, isPending: isSessionPending } = useSession();
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [returningBookId, setReturningBookId] = useState("");
  const user = session?.user;

  useEffect(() => {
    if (!isSessionPending && !user?.email) {
      toast.error("Sign in or create an account to access My Borrows.");
    }
  }, [isSessionPending, user?.email]);

  useEffect(() => {
    if (isSessionPending || !user?.email) {
      return;
    }

    const controller = new AbortController();

    async function loadBorrowedBooks() {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const response = await apiFetch(
          `${API_BASE_URL}/borrows`,
          { signal: controller.signal, cache: "no-store" },
        );
        const data = await response.json();

        if (!response.ok || !Array.isArray(data)) {
          throw new Error(data?.message || "Your borrowed books could not be loaded.");
        }

        setBorrowedBooks(data);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Your borrowed books could not be loaded.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadBorrowedBooks();
    return () => controller.abort();
  }, [isSessionPending, retryCount, user?.email]);

  async function handleReturn(book) {
    if (!user?.email || returningBookId) {
      return;
    }

    setReturningBookId(book._id);
    try {
      const response = await apiFetch(
        `${API_BASE_URL}/borrows/${encodeURIComponent(book._id)}/return`,
        {
          method: "POST",
        },
      );
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || "The book could not be returned.");
      }

      setBorrowedBooks((current) => current.filter((item) => item._id !== book._id));
      toast.success("Book returned. Availability has been updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The book could not be returned.");
    } finally {
      setReturningBookId("");
    }
  }

  if (isSessionPending) {
    return (
      <main className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground" role="status">Loading your account...</p>
      </main>
    );
  }

  if (!user?.email) {
    return (
      <main className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-16 sm:px-6 lg:px-8">
        <section role="alert" className="w-full rounded-3xl border border-foreground/10 bg-background/45 p-8 text-center shadow-xl shadow-foreground/5 backdrop-blur-2xl sm:p-12">
          <h1 className="font-heading text-3xl font-semibold text-foreground">Account required</h1>
          <p className="mt-3 text-sm text-muted-foreground">Sign in or create an account to view your borrowed books.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/sign-in" className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              Sign in
            </Link>
            <Link href="/sign-up" className="inline-flex rounded-full border border-foreground/15 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/8">
              Create account
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <header className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Your reading list
        </span>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          My borrows
        </h1>
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          Books you&apos;ve borrowed are saved to your account.
        </p>
      </header>

      {isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground" role="status">Loading your borrowed books...</p>
      ) : errorMessage ? (
        <p className="mt-8 rounded-2xl border border-destructive/20 bg-background/50 p-5 text-sm text-destructive" role="alert">
          {errorMessage}
          <button type="button" onClick={() => setRetryCount((count) => count + 1)} className="ml-3 inline-flex items-center gap-2 font-semibold underline">
            <RefreshCw className="size-4" /> Try again
          </button>
        </p>
      ) : borrowedBooks.length === 0 ? (
        <section className="mt-8 rounded-3xl border border-border/70 bg-card/60 p-10 text-center shadow-sm backdrop-blur-xl">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            No borrowed books yet
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Explore the collection and borrow a book to see it here.
          </p>
          <Link
            href="/books"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary/90"
          >
            Explore books <ArrowRight className="size-4" />
          </Link>
        </section>
      ) : (
        <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Borrowed books">
          {borrowedBooks.map((book) => (
            <article
              key={book._id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/70 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-foreground/10"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image
                  src={book["Image-link"]}
                  alt={`Cover image for ${book.Title}`}
                  fill
                  unoptimized
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {book.Category}
                </span>
                <h2 className="mt-3 font-heading text-xl font-semibold text-card-foreground">
                  {book.Title}
                </h2>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  by {book.Author}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Borrowed {new Date(book.BorrowedAt).toLocaleDateString()}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/books/${encodeURIComponent(book._id)}`}
                    className="inline-flex w-fit items-center justify-center rounded-full border border-foreground/15 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/8"
                  >
                    View details
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleReturn(book)}
                    disabled={Boolean(returningBookId)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60"
                  >
                    <RotateCcw className="size-4" />
                    {returningBookId === book._id ? "Returning..." : "Return"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
