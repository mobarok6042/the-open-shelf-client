"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { apiFetch, booksEndpoint, myBooksEndpoint } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import LoadingOverlay from "@/components/LoadingOverlay";

const inputClassName =
  "mt-2 block w-full rounded-xl border border-foreground/15 bg-background/50 px-4 py-3 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";

const categories = ["Fiction", "Science", "History", "Kids", "Novel", "Others"];

function isBook(book) {
  return (
    book &&
    typeof book === "object" &&
    typeof book._id === "string" &&
    typeof book.Title === "string" &&
    typeof book.Author === "string" &&
    typeof book.Category === "string" &&
    typeof book.Details === "string" &&
    typeof book["Image-link"] === "string"
  );
}

export default function EditBookForm({ id }) {
  const { data: session, isPending: isSessionPending } = useSession();
  const router = useRouter();
  const user = session?.user;
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (isSessionPending || !user?.email) {
      return;
    }

    const controller = new AbortController();

    async function loadBook() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await apiFetch(myBooksEndpoint, {
          signal: controller.signal,
          cache: "no-store",
        });
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.message || `Your books could not be loaded (HTTP ${response.status}).`,
          );
        }
        if (!Array.isArray(data) || !data.every(isBook)) {
          throw new Error("The books service returned data in an unexpected format.");
        }

        const selectedBook = data.find((item) => item._id === id);
        if (!selectedBook) {
          throw new Error("This book was not found on your shelf.");
        }

        setBook(selectedBook);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        setErrorMessage(
          error instanceof Error ? error.message : "The book could not be loaded.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadBook();
    return () => controller.abort();
  }, [id, isSessionPending, retryCount, user?.email]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!book || isSubmitting) {
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const image = formData.get("image");
      let imageUrl = book["Image-link"];

      if (image instanceof File && image.size > 0) {
        const imageFormData = new FormData();
        imageFormData.set("image", image);
        const uploadResponse = await fetch("/api/profile-photo", {
          method: "POST",
          body: imageFormData,
        });
        const uploadResult = await uploadResponse.json().catch(() => null);

        if (!uploadResponse.ok || typeof uploadResult?.imageUrl !== "string") {
          throw new Error(uploadResult?.error || "Could not upload the book cover.");
        }
        imageUrl = uploadResult.imageUrl;
      }

      const updatedBook = {
        Title: String(formData.get("title") || "").trim(),
        Author: String(formData.get("author") || "").trim(),
        Category: String(formData.get("category") || ""),
        "Image-link": imageUrl,
        Details: String(formData.get("description") || "").trim(),
      };

      const response = await apiFetch(
        `${booksEndpoint}/${encodeURIComponent(book._id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedBook),
        },
      );
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error ||
            result?.message ||
            `The book could not be updated (HTTP ${response.status}).`,
        );
      }

      toast.success("Your book was updated.");
      window.dispatchEvent(
        new CustomEvent("open-shelf:navigate", { detail: "/my-books" }),
      );
      router.push("/my-books");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not update the book. Please try again.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSessionPending || (user?.email && isLoading)) {
    return <LoadingOverlay label="Loading your book..." />;
  }

  if (!user?.email) {
    return (
      <main className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-16 sm:px-6 lg:px-8">
        <section role="alert" className="mx-auto w-full max-w-2xl rounded-3xl border border-foreground/10 bg-background/45 p-8 text-center shadow-xl shadow-foreground/5 backdrop-blur-2xl sm:p-12">
          <h1 className="font-heading text-3xl font-semibold text-foreground">Account required</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Sign in with the account that added this book to edit it.
          </p>
          <Link href="/sign-in" className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            Sign in
          </Link>
        </section>
      </main>
    );
  }

  if (!book) {
    return (
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <section role="alert" className="mx-auto max-w-2xl rounded-3xl border border-destructive/20 bg-background/50 p-8 text-center shadow-sm backdrop-blur-xl">
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            Couldn&apos;t load this book
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {errorMessage || "This book is not available on your shelf."}
          </p>
          {errorMessage && (
            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Try again
            </button>
          )}
          <Link href="/my-books" className="mt-5 block text-sm font-semibold text-primary hover:underline">
            Back to My Books
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <section className="mx-auto w-full max-w-2xl rounded-3xl border border-foreground/10 bg-background/50 p-6 shadow-xl shadow-foreground/5 backdrop-blur-2xl sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Your personal shelf
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Edit book
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Update the details or choose a new cover image.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="edit-book-title" className="text-sm font-medium text-foreground">
              Book Title
            </label>
            <input id="edit-book-title" name="title" type="text" maxLength={200} defaultValue={book.Title} className={inputClassName} required />
          </div>

          <div>
            <label htmlFor="edit-book-author" className="text-sm font-medium text-foreground">
              Author Name
            </label>
            <input id="edit-book-author" name="author" type="text" maxLength={120} defaultValue={book.Author} className={inputClassName} required />
          </div>

          <div>
            <label htmlFor="edit-book-category" className="text-sm font-medium text-foreground">
              Category
            </label>
            <select id="edit-book-category" name="category" defaultValue={book.Category} className={inputClassName} required>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              {!categories.includes(book.Category) && (
                <option value={book.Category}>{book.Category}</option>
              )}
            </select>
          </div>

          <div>
            <label htmlFor="edit-book-image" className="text-sm font-medium text-foreground">
              Book Cover
            </label>
            <div className="mt-2 flex items-center gap-4">
              <Image
                src={book["Image-link"]}
                alt={`Current cover for ${book.Title}`}
                width={80}
                height={100}
                unoptimized
                className="h-24 w-20 rounded-lg object-cover"
              />
              <input
                id="edit-book-image"
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className={`${inputClassName} mt-0 file:mr-4 file:rounded-lg file:border file:border-foreground/15 file:bg-background/50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground`}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Leave this empty to keep the current cover. New images must be JPEG, PNG, or WebP (up to 5 MB).
            </p>
          </div>

          <div>
            <label htmlFor="edit-book-description" className="text-sm font-medium text-foreground">
              Short Description
            </label>
            <textarea
              id="edit-book-description"
              name="description"
              rows={5}
              maxLength={3000}
              defaultValue={book.Details}
              className={`${inputClassName} resize-y`}
              required
            />
          </div>

          {errorMessage && (
            <p role="alert" className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {errorMessage}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-foreground/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner />
                  Saving changes...
                </>
              ) : "Save changes"}
            </button>
            <Link
              href="/my-books"
              className="inline-flex items-center justify-center rounded-full border border-foreground/15 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/8"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
