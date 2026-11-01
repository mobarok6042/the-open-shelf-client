import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function StarterPage({
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref,
}) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-16 sm:px-6 md:py-20 lg:px-8">
      <section className="w-full rounded-3xl border border-foreground/10 bg-background/45 p-8 shadow-xl shadow-foreground/5 backdrop-blur-2xl sm:p-12 lg:p-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
          {description}
        </p>
        <Link
          href={actionHref}
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 active:scale-95"
        >
          {actionLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </section>
    </div>
  );
}
