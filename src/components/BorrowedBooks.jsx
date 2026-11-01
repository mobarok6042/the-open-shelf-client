"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getBorrowedBooks } from "@/lib/borrowed-books";

export default function BorrowedBooks() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        setBorrowedBooks(getBorrowedBooks());
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Your saved borrow list could not be loaded.",
        );
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

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
          Books you&apos;ve chosen to borrow are saved here on this device.
        </p>
      </header>

      {errorMessage ? (
        <p className="mt-8 rounded-2xl border border-destructive/20 bg-background/50 p-5 text-sm text-destructive" role="alert">
          {errorMessage}
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
          {borrowedBooks.map(({ book, borrowedAt }) => (
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
                  Borrowed {new Date(borrowedAt).toLocaleDateString()}
                </p>
                <Link
                  href={`/books/${encodeURIComponent(book._id)}`}
                  className="mt-5 inline-flex w-fit items-center justify-center rounded-full border border-foreground/15 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/8"
                >
                  View details
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
