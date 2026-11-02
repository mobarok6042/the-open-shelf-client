import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-foreground/10 bg-background/50 px-6 py-12 text-center shadow-xl shadow-foreground/5 backdrop-blur-2xl sm:px-12 sm:py-16">
        <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <BookOpen className="size-8" aria-hidden="true" />
        </span>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          404 · Page not found
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          This page isn&apos;t on our shelf
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-muted-foreground">
          The page may have moved or the address might be incorrect. Let&apos;s help
          you find your next good read.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary/90"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back home
          </Link>
          <Link
            href="/books"
            className="inline-flex items-center rounded-full border border-foreground/15 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/8"
          >
            Browse books
          </Link>
        </div>
      </div>
    </section>
  );
}
