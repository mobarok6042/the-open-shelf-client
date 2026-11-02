import { Suspense } from "react";
import { BookOpen } from "lucide-react";

import CurrentDate from "@/components/CurrentDate";
import HeroSlider from "@/components/HeroSlider";
import NewArrivals from "@/components/NewArrivals";
import Reveal from "@/components/Reveal";

const featuredWriters = [
  {
    name: "William Shakespeare",
    years: "1564-1616",
    description:
      "The playwright and poet whose tragedies, comedies, and histories still shape how stories are told.",
    initials: "WS",
    color: "bg-rose-100 text-rose-800 dark:bg-rose-400/15 dark:text-rose-300",
  },
  {
    name: "Jane Austen",
    years: "1775-1817",
    description:
      "A sharp, warm observer of manners and relationships, celebrated for enduring novels like Pride and Prejudice.",
    initials: "JA",
    color: "bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300",
  },
  {
    name: "Maya Angelou",
    years: "1928-2014",
    description:
      "An acclaimed poet and memoirist whose writing gave voice to resilience, identity, and hope.",
    initials: "MA",
    color: "bg-sky-100 text-sky-800 dark:bg-sky-400/15 dark:text-sky-300",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Suspense
        fallback={
          <div
            aria-label="Loading featured books"
            className="h-[min(76svh,48rem)] min-h-[29rem] animate-pulse bg-primary/10 sm:min-h-[34rem]"
          />
        }
      >
        <HeroSlider />
      </Suspense>

      <NewArrivals />

      <section className="border-y border-border/70 bg-amber-50/70 dark:bg-amber-400/5">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-[auto_1fr] md:items-center md:gap-8 md:py-14 lg:px-8">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-amber-200/70 text-amber-900 dark:bg-amber-300/10 dark:text-amber-300">
            <BookOpen className="size-7" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800 dark:text-amber-300">
              Thought of the day
            </p>
            <CurrentDate />
            <blockquote className="mt-3 max-w-3xl font-heading text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
              &ldquo;I declare after all there is no enjoyment like reading!&rdquo;
            </blockquote>
            <p className="mt-3 text-sm text-muted-foreground">
              Jane Austen, <cite>Pride and Prejudice</cite>
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800 dark:text-emerald-400">
            Literary greats
          </span>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Get to know the writers
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Meet a few of the remarkable voices whose words continue to bring readers
            together across generations.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {featuredWriters.map((writer, index) => (
            <Reveal key={writer.name} delay={index * 0.08}>
              <article className="h-full rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
              <span
                className={`flex size-12 items-center justify-center rounded-full font-heading text-sm font-semibold ${writer.color}`}
                aria-hidden="true"
              >
                {writer.initials}
              </span>
              <p className="mt-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {writer.years}
              </p>
              <h3 className="mt-1 font-heading text-xl font-semibold">{writer.name}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {writer.description}
              </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
