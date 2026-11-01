"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import GoogleAuthButton from "@/components/GoogleAuthButton";

const inputClassName =
  "mt-2 block w-full rounded-xl border border-foreground/15 bg-background/50 px-4 py-3 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function SignInForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("protected") === "1") {
      toast.error("Sign in or create an account to access that page.");
      window.history.replaceState(window.history.state, "", "/sign-in");
    }
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const { error } = await authClient.signIn.email({
        email: String(formData.get("email") || ""),
        password: String(formData.get("password") || ""),
        callbackURL: "/my-books",
      });

      if (error) {
        throw new Error(error.message || "Could not sign in.");
      }

      toast.success("You’re signed in. Welcome back!");
      router.push("/my-books");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Sign-in failed. Please try again.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <section className="mx-auto w-full max-w-xl rounded-3xl border border-foreground/10 bg-background/50 p-6 shadow-xl shadow-foreground/5 backdrop-blur-2xl sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Welcome back
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Sign in
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Sign in to continue to your reading shelf.
        </p>

        <div className="mt-8">
          <GoogleAuthButton />
        </div>
        <div className="my-6 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          <span>or sign in with email</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="signin-email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="signin-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={inputClassName}
              required
            />
          </div>

          <div>
            <label htmlFor="signin-password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="signin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              className={inputClassName}
              required
            />
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-foreground/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to The Open Shelf?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </section>
    </div>
  );
}
