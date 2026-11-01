import { Clock, Mail, MapPin, Phone } from "lucide-react";

export const metadata = {
  title: "Contact",
  description: "Visit, call, or write to The Open Shelf independent bookshop.",
};

const details = [
  {
    icon: MapPin,
    label: "Visit the shop",
    value: "14 Willow Lane, Portland, OR 97201",
  },
  {
    icon: Phone,
    label: "Call us",
    value: "+1 (503) 555-0142",
    href: "tel:+15035550142",
  },
  {
    icon: Mail,
    label: "Write to us",
    value: "hello@theopenshelf.com",
    href: "mailto:hello@theopenshelf.com",
  },
  {
    icon: Clock,
    label: "Opening hours",
    value: "Mon-Sat, 9am - 7pm",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <header className="max-w-xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800 dark:text-emerald-400">
            Say hello
          </span>
          <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            We would love to hear from you
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Looking for a specific edition, planning a book club, or just want to talk about
            what you are reading? Drop by the shop or send us a note. A real bookseller will
            always reply.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="mailto:hello@theopenshelf.com"
              className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-900 px-6 text-sm font-medium text-amber-50 transition-colors hover:bg-emerald-800 dark:bg-emerald-700 dark:hover:bg-emerald-600"
            >
              Send an email
            </a>
            <a
              href="tel:+15035550142"
              className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-6 text-sm font-medium transition-colors hover:bg-muted"
            >
              Call the shop
            </a>
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          {details.map((detail) => (
            <div
              key={detail.label}
              className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-900/5 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300">
                <detail.icon className="size-5" />
              </span>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {detail.label}
              </p>
              {detail.href ? (
                <a
                  href={detail.href}
                  className="mt-1 block text-sm font-medium transition-colors hover:text-emerald-800 dark:hover:text-emerald-300"
                >
                  {detail.value}
                </a>
              ) : (
                <p className="mt-1 text-sm font-medium">{detail.value}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
