"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import GoogleAuthButton from "@/components/GoogleAuthButton";

const inputClassName =
  "mt-2 block w-full rounded-xl border border-foreground/15 bg-background/50 px-4 py-3 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function SignUpForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const photo = formData.get("photo");

    if (!(photo instanceof File) || photo.size === 0) {
      const message = "Choose a profile photo to continue.";
      setErrorMessage(message);
      toast.error(message);
      setIsSubmitting(false);
      return;
    }

    try {
      const photoFormData = new FormData();
      photoFormData.set("photo", photo);

      const uploadResponse = await fetch("/api/profile-photo", {
        method: "POST",
        body: photoFormData,
      });
      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadResult.error || "Could not upload your profile photo.");
      }

      const { error } = await authClient.signUp.email({
        name: String(formData.get("name") || ""),
        username: String(formData.get("username") || "").trim().toLowerCase(),
        email: String(formData.get("email") || ""),
        password: String(formData.get("password") || ""),
        image: uploadResult.imageUrl,
      });

      if (error) {
        throw new Error(error.message || "Could not create your account.");
      }

      toast.success("Your account was created. Sign in to continue.");
      router.push("/sign-in");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed. Please try again.";
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
          Join the community
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Create your account
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Sign up to start building your reading shelf.
        </p>

        <div className="mt-8">
          <GoogleAuthButton />
        </div>
        <div className="my-6 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          <span>or register with email</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="signup-name" className="text-sm font-medium text-foreground">
              Name
            </label>
            <input
              id="signup-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              className={inputClassName}
              required
            />
          </div>

          <div>
            <label htmlFor="signup-username" className="text-sm font-medium text-foreground">
              Username
            </label>
            <input
              id="signup-username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="reader_name"
              minLength={3}
              maxLength={20}
              pattern="[A-Za-z0-9_]+"
              title="Use 3–20 letters, numbers, or underscores."
              className={inputClassName}
              required
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Use 3–20 letters, numbers, or underscores.
            </p>
          </div>

          <div>
            <label htmlFor="signup-email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={inputClassName}
              required
            />
          </div>

          <div>
            <label htmlFor="signup-photo" className="text-sm font-medium text-foreground">
              Photo
            </label>
            <input
              id="signup-photo"
              name="photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className={`${inputClassName} file:mr-4 file:rounded-lg file:border file:border-foreground/15 file:bg-background/50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground`}
              required
            />
            <p className="mt-2 text-xs text-muted-foreground">
              JPEG, PNG, or WebP. Maximum file size: 5 MB.
            </p>
          </div>

          <div>
            <label htmlFor="signup-password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              minLength={8}
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
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </section>
    </div>
  );
}
