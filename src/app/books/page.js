import Link from "next/link";

export const metadata = {
  title: "Books",
  description: "Browse the full collection of hand-picked books at The Open Shelf.",
};

export default function BooksPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">
      <header className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800 dark:text-emerald-400">
          The collection
        </span>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Books worth making room for
        </h1>
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          From debut novels to timeless non-fiction, every title on this shelf has been read,
          discussed, and recommended by our booksellers.
        </p>
      </header>

      <section className="mt-10 rounded-3xl border border-border/70 bg-card/60 p-8 text-center shadow-sm backdrop-blur-xl sm:p-12">
        <h2 className="font-heading text-xl font-semibold">Your next read starts here</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
          The book collection is being prepared. Check back soon to explore the shelf.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Return home
        </Link>
      </section>
    </div>
  );
}
