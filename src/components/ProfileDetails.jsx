"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export default function ProfileDetails() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  if (isPending) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground" role="status">
          Loading your profile...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-16 sm:px-6 lg:px-8">
        <section className="w-full rounded-3xl border border-foreground/10 bg-background/45 p-8 text-center shadow-xl shadow-foreground/5 backdrop-blur-2xl sm:p-12">
          <h1 className="font-heading text-3xl font-semibold text-foreground">Your profile</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Sign in to view your account details.
          </p>
          <Link
            href="/sign-in"
            className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Sign in
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <section className="mx-auto w-full max-w-2xl rounded-3xl border border-foreground/10 bg-background/50 p-6 shadow-xl shadow-foreground/5 backdrop-blur-2xl sm:p-10">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          <span className="inline-flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-foreground/10 bg-primary/10 text-2xl font-semibold text-primary">
            {user.image ? (
              <Image
                src={user.image}
                alt={`${user.username || user.name}'s profile`}
                width={96}
                height={96}
                unoptimized
                className="size-full object-cover"
              />
            ) : (
              (user.username || user.name)?.charAt(0)?.toUpperCase() || "R"
            )}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              My account
            </p>
            <h1 className="mt-2 truncate font-heading text-3xl font-semibold tracking-tight text-foreground">
              Welcome, {user.username || user.name}
            </h1>
            <p className="mt-2 truncate text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <dl className="mt-8 grid gap-4 rounded-2xl border border-foreground/10 bg-background/40 p-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Name
            </dt>
            <dd className="mt-1 break-words text-sm font-medium text-foreground">{user.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Username
            </dt>
            <dd className="mt-1 break-words text-sm font-medium text-foreground">
              @{user.username || user.name}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Email
            </dt>
            <dd className="mt-1 break-words text-sm font-medium text-foreground">{user.email}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
