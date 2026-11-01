import Image from "next/image";
import { AtSign, Globe, Mail, MapPin, Phone } from "lucide-react";

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/", icon: AtSign },
  { label: "Facebook", href: "https://www.facebook.com/", icon: Globe },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/70 bg-background/45 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 sm:items-start">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="The Open Shelf"
                width={72}
                height={72}
                className="size-16 object-contain sm:size-[4.5rem]"
              />
              <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
                The Open Shelf
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              A welcoming shelf of thoughtfully chosen stories for curious minds.
            </p>
            <nav className="mt-5 flex items-center gap-3" aria-label="Social links">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-foreground/10 bg-background/50 text-foreground/75 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-foreground active:scale-95"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </nav>
          </div>

          <address className="flex flex-col gap-3 text-sm not-italic text-muted-foreground sm:items-end sm:text-right">
            <span className="flex items-center gap-2 sm:flex-row-reverse">
              <MapPin className="size-4 shrink-0 text-primary" />
              14 Willow Lane, Portland, OR
            </span>
            <a
              href="tel:+15035550142"
              className="flex items-center gap-2 transition-colors hover:text-foreground sm:flex-row-reverse"
            >
              <Phone className="size-4 shrink-0 text-primary" />
              +1 (503) 555-0142
            </a>
            <a
              href="mailto:hello@theopenshelf.com"
              className="flex items-center gap-2 transition-colors hover:text-foreground sm:flex-row-reverse"
            >
              <Mail className="size-4 shrink-0 text-primary" />
              hello@theopenshelf.com
            </a>
          </address>
        </div>

        <p className="mt-8 border-t border-border/70 pt-5 text-center text-xs text-muted-foreground">
          &copy; 2026 The Open Shelf. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
