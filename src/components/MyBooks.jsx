"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { getAvailableCopies, getBookGroupKey } from "@/lib/book-copies";
import { apiFetch, booksEndpoint } from "@/lib/api";

const myBooksEndpoint = `${booksEndpoint.replace(/\/books$/, "")}/my-books`;

function isBook(book) {
  return (
    book &&
    typeof book === "object" &&
    typeof book._id === "string" &&
    typeof book.Title === "string" &&
    typeof book.Author === "string" &&
    typeof book.Category === "string" &&
    typeof book.Details === "string" &&
    typeof book["Image-link"] === "string"
  );
}

export default function MyBooks() {
  const { data: session, isPending: isSessionPending } = useSession();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [deletingBookId, setDeletingBookId] = useState("");
  const user = session?.user;

  useEffect(() => {
    if (!isSessionPending && !user?.email) {
      toast.error("Sign in or create an account to access My Books.");
    }
  }, [isSessionPending, user?.email]);

  useEffect(() => {
    if (isSessionPending || !user?.email) {
      return;
    }

    const controller = new AbortController();

    async function loadBooks() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [inventoryResponse, response] = await Promise.all([
          fetch(booksEndpoint, { signal: controller.signal, cache: "no-store" }),
          apiFetch(myBooksEndpoint, { signal: controller.signal, cache: "no-store" }),
        ]);

        if (!inventoryResponse.ok) {
          throw new Error(`The book inventory could not be loaded (HTTP ${inventoryResponse.status}).`);
        }
        if (!response.ok) {
          throw new Error(`Your books could not be loaded (HTTP ${response.status}).`);
        }

        const [inventory, data] = await Promise.all([
          inventoryResponse.json(),
          response.json(),
        ]);

        if (
          !Array.isArray(inventory) ||
          !inventory.every(isBook) ||
          !Array.isArray(data) ||
          !data.every(isBook)
        ) {
          throw new Error("The books service returned data in an unexpected format.");
        }

        setBooks(
          data.map((book) => ({
            ...book,
            AvailableCopies: getAvailableCopies(book, inventory),
          })),
        );
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Your books could not be loaded. Please try again.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadBooks();
    return () => controller.abort();
  }, [isSessionPending, retryCount, user?.email]);

  async function handleRemove(book) {
    if (!user?.email || deletingBookId) {
      return;
    }

    setDeletingBookId(book._id);

    try {
      const response = await apiFetch(
        `${booksEndpoint}/${encodeURIComponent(book._id)}`,
        { method: "DELETE" },
      );
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message || `The book could not be removed (HTTP ${response.status}).`,
        );
      }

      const removedBookKey = getBookGroupKey(book);
      setBooks((currentBooks) =>
        currentBooks
          .filter((item) => item._id !== book._id)
          .map((item) =>
            getBookGroupKey(item) === removedBookKey
              ? { ...item, AvailableCopies: Math.max(0, item.AvailableCopies - 1) }
              : item,
          ),
      );
      toast.success("The book was removed from your shelf.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "The book could not be removed.",
      );
    } finally {
      setDeletingBookId("");
    }
  }

  if (isSessionPending) {
    return (
      <main className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground" role="status">
          Loading your account...
        </p>
      </main>
    );
  }

  if (!user?.email) {
    return (
      <main className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-16 sm:px-6 lg:px-8">
        <section role="alert" className="w-full rounded-3xl border border-foreground/10 bg-background/45 p-8 text-center shadow-xl shadow-foreground/5 backdrop-blur-2xl sm:p-12">
          <h1 className="font-heading text-3xl font-semibold text-foreground">
            Account required
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Sign in or create an account to see books you have added to the collection.
          </p>
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
          Your personal shelf
        </span>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          My books
        </h1>
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          Books added by {user.username || user.name} appear here.
        </p>
      </header>

      {isLoading ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading your books">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-border/70 bg-card/60"
            >
              <div className="aspect-[4/3] animate-pulse bg-muted" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : errorMessage ? (
        <section className="mt-8 rounded-3xl border border-destructive/20 bg-background/50 p-8 text-center shadow-sm backdrop-blur-xl" role="alert">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Couldn&apos;t load your books
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{errorMessage}</p>
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <RefreshCw className="size-4" />
            Try again
          </button>
        </section>
      ) : books.length === 0 ? (
        <section className="mt-8 rounded-3xl border border-border/70 bg-card/60 p-10 text-center shadow-sm backdrop-blur-xl">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            You haven&apos;t added any books yet
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Add a book to the collection and it will appear here.
          </p>
          <Link
            href="/add-book"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary/90"
          >
            Add a book <ArrowRight className="size-4" />
          </Link>
        </section>
      ) : (
        <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Books you added">
          {books.map((book) => (
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
                <p className="mt-3 text-sm font-semibold text-primary">
                  {book.AvailableCopies}{" "}
                  {book.AvailableCopies === 1 ? "copy" : "copies"} available
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
                  <Link
                    href={`/books/${encodeURIComponent(book._id)}`}
                    className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary/90"
                  >
                    Details
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleRemove(book)}
                    disabled={Boolean(deletingBookId)}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-destructive/30 px-5 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:pointer-events-none disabled:opacity-60"
                  >
                    <Trash2 className="size-4" />
                    {deletingBookId === book._id ? "Removing..." : "Remove"}
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
