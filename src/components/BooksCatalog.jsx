"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { groupBookCopies } from "@/lib/book-copies";

const booksPerPage = 9;
const booksEndpoint = "http://localhost:5000/books";

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

export default function BooksCatalog() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadBooks() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(booksEndpoint, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Books could not be loaded (HTTP ${response.status}).`);
        }

        const data = await response.json();

        if (!Array.isArray(data) || !data.every(isBook)) {
          throw new Error("The books service returned data in an unexpected format.");
        }

        setBooks(data);
        setCurrentPage(1);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Books could not be loaded. Please try again.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadBooks();
    return () => controller.abort();
  }, [retryCount]);

  const groupedBooks = groupBookCopies(books);
  const pageCount = Math.ceil(groupedBooks.length / booksPerPage);
  const firstBookIndex = (currentPage - 1) * booksPerPage;
  const visibleBooks = groupedBooks.slice(firstBookIndex, firstBookIndex + booksPerPage);

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <header className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          The collection
        </span>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Books worth making room for
        </h1>
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          Browse the books currently available on The Open Shelf.
        </p>
      </header>

      {isLoading ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading books">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-border/70 bg-card/60"
            >
              <div className="aspect-[4/3] animate-pulse bg-muted" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : errorMessage ? (
        <section
          className="mt-10 rounded-3xl border border-destructive/20 bg-background/50 p-8 text-center shadow-sm backdrop-blur-xl"
          role="alert"
        >
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Couldn&apos;t load the books
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
            {errorMessage}
          </p>
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
        <section className="mt-10 rounded-3xl border border-border/70 bg-card/60 p-10 text-center shadow-sm backdrop-blur-xl">
          <h2 className="font-heading text-xl font-semibold">No books yet</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            New titles will appear here when they are added to the collection.
          </p>
        </section>
      ) : (
        <>
          <p className="mt-8 text-sm text-muted-foreground" aria-live="polite">
            Showing {firstBookIndex + 1}–{firstBookIndex + visibleBooks.length} of {groupedBooks.length}{" "}
            books
          </p>

          <section
            className="mt-5 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3"
            aria-label="Book collection"
          >
            {visibleBooks.map((book) => (
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
                  <Link
                    href={`/books/${encodeURIComponent(book._id)}`}
                    className="mt-5 inline-flex w-fit items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 active:scale-95"
                  >
                    Details
                  </Link>
                </div>
              </article>
            ))}
          </section>

          {pageCount > 1 && (
            <nav
              className="mt-10 flex flex-wrap items-center justify-center gap-2"
              aria-label="Book pagination"
            >
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="inline-flex size-10 items-center justify-center rounded-full border border-foreground/15 text-foreground transition-colors hover:bg-foreground/8 disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  aria-current={currentPage === page ? "page" : undefined}
                  aria-label={`Page ${page}`}
                  className={`inline-flex size-10 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                    currentPage === page
                      ? "bg-primary text-primary-foreground"
                      : "border border-foreground/15 text-foreground hover:bg-foreground/8"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
                disabled={currentPage === pageCount}
                aria-label="Next page"
                className="inline-flex size-10 items-center justify-center rounded-full border border-foreground/15 text-foreground transition-colors hover:bg-foreground/8 disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronRight className="size-4" />
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
