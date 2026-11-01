"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { addBorrowedBook, getBorrowedBooks } from "@/lib/borrowed-books";

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

export default function BookDetails({ id }) {
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [isBorrowed, setIsBorrowed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadBook() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(booksEndpoint, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Book details could not be loaded (HTTP ${response.status}).`);
        }

        const books = await response.json();

        if (!Array.isArray(books) || !books.every(isBook)) {
          throw new Error("The books service returned data in an unexpected format.");
        }

        const selectedBook = books.find((item) => item._id === id);
        setBook(selectedBook ?? null);
        setIsBorrowed(
          selectedBook
            ? getBorrowedBooks().some((item) => item.book._id === selectedBook._id)
            : false,
        );
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Book details could not be loaded. Please try again.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadBook();
    return () => controller.abort();
  }, [id, retryCount]);

  function handleBorrow() {
    if (!book) {
      return;
    }

    try {
      const added = addBorrowedBook(book);
      setIsBorrowed(true);
      if (added) {
        toast.success("This book was added to My Borrows.");
      } else {
        toast.info("This book is already in My Borrows.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "The book could not be borrowed.",
      );
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <Link
        href="/books"
        className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/8"
      >
        <ArrowLeft className="size-4" />
        Back to books
      </Link>

      {isLoading ? (
        <div className="mt-8 grid gap-8 rounded-3xl border border-border/70 bg-card/60 p-6 shadow-sm backdrop-blur-xl md:grid-cols-[minmax(240px,0.8fr)_1.2fr] md:p-10" aria-label="Loading book details">
          <div className="aspect-[4/3] animate-pulse rounded-2xl bg-muted md:aspect-[3/4]" />
          <div className="space-y-4 py-2">
            <div className="h-5 w-28 animate-pulse rounded bg-muted" />
            <div className="h-9 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-5 w-1/2 animate-pulse rounded bg-muted" />
            <div className="h-24 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      ) : errorMessage ? (
        <section className="mt-8 rounded-3xl border border-destructive/20 bg-background/50 p-8 text-center shadow-sm backdrop-blur-xl" role="alert">
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            Couldn&apos;t load this book
          </h1>
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
      ) : !book ? (
        <section className="mt-8 rounded-3xl border border-border/70 bg-card/60 p-10 text-center shadow-sm backdrop-blur-xl">
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            Book not found
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This book may have been removed from the collection.
          </p>
        </section>
      ) : (
        <article className="mt-8 grid gap-8 rounded-3xl border border-foreground/10 bg-background/45 p-5 shadow-xl shadow-foreground/5 backdrop-blur-2xl sm:p-8 md:grid-cols-[minmax(240px,0.8fr)_1.2fr] md:gap-12 md:p-10">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted md:aspect-[3/4]">
            <Image
              src={book["Image-link"]}
              alt={`Cover image for ${book.Title}`}
              fill
              unoptimized
              priority
              sizes="(max-width: 767px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col items-start justify-center">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {book.Category}
            </span>
            <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {book.Title}
            </h1>
            <p className="mt-2 text-base font-medium text-muted-foreground">
              by {book.Author}
            </p>
            <div className="mt-7 border-t border-foreground/10 pt-6">
              <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
                <BookOpen className="size-5 text-primary" />
                About this book
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground sm:text-base">
                {book.Details}
              </p>
            </div>
            <button
              type="button"
              onClick={handleBorrow}
              disabled={isBorrowed}
              className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 active:scale-95 disabled:pointer-events-none disabled:opacity-60"
            >
              {isBorrowed ? "Already borrowed" : "Borrow this book"}
            </button>
          </div>
        </article>
      )}
    </main>
  );
}
