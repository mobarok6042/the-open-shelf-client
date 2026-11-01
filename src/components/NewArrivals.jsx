"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, RefreshCw } from "lucide-react";

const latestBooksEndpoint = "http://localhost:5000/books/new-arrivals";

function isBook(book) {
  return (
    book &&
    typeof book === "object" &&
    typeof book._id === "string" &&
    typeof book.Title === "string" &&
    typeof book.Author === "string" &&
    typeof book.Category === "string" &&
    typeof book["Image-link"] === "string"
  );
}

export default function NewArrivals() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadLatestBooks() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(latestBooksEndpoint, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`New arrivals could not be loaded (HTTP ${response.status}).`);
        }

        const data = await response.json();
        if (!Array.isArray(data) || !data.every(isBook)) {
          throw new Error("The books service returned data in an unexpected format.");
        }

        setBooks(data.slice(0, 6));
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "New arrivals could not be loaded. Please try again.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadLatestBooks();
    return () => controller.abort();
  }, [retryCount]);

  return (
    <section
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8"
      aria-labelledby="new-arrivals-heading"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Fresh on the shelf
          </span>
          <h2
            id="new-arrivals-heading"
            className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            New arrivals
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            The six latest books added by our readers.
          </p>
        </div>
        <Link
          href="/books"
          className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-foreground/15 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/8"
        >
          View all books
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
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
        <div
          className="mt-8 rounded-2xl border border-destructive/20 bg-background/50 p-6 text-center"
          role="alert"
        >
          <p className="text-sm text-muted-foreground">{errorMessage}</p>
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <RefreshCw className="size-4" />
            Try again
          </button>
        </div>
      ) : books.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-border/70 bg-card/60 p-8 text-center text-sm text-muted-foreground">
          No books have been added yet. Check back soon for new arrivals.
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                <h3 className="mt-3 font-heading text-xl font-semibold text-card-foreground">
                  {book.Title}
                </h3>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  by {book.Author}
                </p>
                <Link
                  href={`/books/${encodeURIComponent(book._id)}`}
                  className="mt-5 inline-flex w-fit items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 active:scale-95"
                >
                  Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
