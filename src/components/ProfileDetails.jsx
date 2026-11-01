"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useSession } from "@/lib/auth-client";

const inputClassName =
  "mt-2 block w-full rounded-xl border border-foreground/15 bg-background/50 px-4 py-3 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function ProfileDetails() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const user = session?.user;
  const signedInAt = session?.session?.createdAt
    ? new Date(session.session.createdAt)
    : null;

  async function handleProfileUpdate(event) {
    event.preventDefault();
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") || "").trim().toLowerCase();
    const photo = formData.get("photo");

    try {
      const updates = { username };

      if (photo instanceof File && photo.size > 0) {
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

        updates.image = uploadResult.imageUrl;
      }

      const { error } = await authClient.updateUser(updates);

      if (error) {
        throw new Error(error.message || "Could not update your profile.");
      }

      toast.success("Your profile has been updated.");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Profile update failed. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

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
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Signed in
            </dt>
            <dd className="mt-1 text-sm font-medium text-foreground">
              {signedInAt && !Number.isNaN(signedInAt.getTime()) ? (
                <time dateTime={signedInAt.toISOString()}>
                  {new Intl.DateTimeFormat(undefined, {
                    dateStyle: "long",
                    timeStyle: "short",
                  }).format(signedInAt)}
                </time>
              ) : (
                "Sign-in time unavailable"
              )}
            </dd>
          </div>
        </dl>

        <form
          key={user.id}
          className="mt-6 space-y-5 rounded-2xl border border-foreground/10 bg-background/40 p-5"
          onSubmit={handleProfileUpdate}
        >
          <div>
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Update your profile
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Change your username or upload a new profile picture.
            </p>
          </div>

          <div>
            <label htmlFor="profile-username" className="text-sm font-medium text-foreground">
              Username
            </label>
            <input
              id="profile-username"
              name="username"
              type="text"
              autoComplete="username"
              defaultValue={user.username || ""}
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
            <label htmlFor="profile-photo" className="text-sm font-medium text-foreground">
              Profile picture
            </label>
            <input
              id="profile-photo"
              name="photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className={`${inputClassName} file:mr-4 file:rounded-lg file:border file:border-foreground/15 file:bg-background/50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground`}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Optional. JPEG, PNG, or WebP up to 5 MB.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-foreground/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
          >
            {isSaving ? "Saving changes..." : "Save profile"}
          </button>
        </form>
      </section>
    </div>
  );
}
