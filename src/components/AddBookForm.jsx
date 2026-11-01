"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

const booksEndpoint = "http://localhost:5000/books";
const inputClassName =
  "mt-2 block w-full rounded-xl border border-foreground/15 bg-background/50 px-4 py-3 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";

const categories = ["Fiction", "Science", "History", "Kids","Novel", "Others"];

export default function AddBookForm() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = session?.user;
  const userName = user?.username || user?.name || "";

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    if (!userName || !user?.email) {
      const message = "Your account name and email are required to add a book.";
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const image = formData.get("image");

    if (!(image instanceof File) || image.size === 0) {
      const message = "Choose a book cover image to continue.";
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    setIsSubmitting(true);

    try {
      const imageFormData = new FormData();
      imageFormData.set("image", image);

      const uploadResponse = await fetch("/api/profile-photo", {
        method: "POST",
        body: imageFormData,
      });
      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadResult.error || "Could not upload the book cover.");
      }

      const book = {
        Title: String(formData.get("title") || "").trim(),
        Author: String(formData.get("author") || "").trim(),
        Category: String(formData.get("category") || ""),
        "Image-link": uploadResult.imageUrl,
        Details: String(formData.get("description") || "").trim(),
        UserName: userName,
        Email: user.email,
      };

      const response = await fetch(booksEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error ||
            result?.message ||
            `The book could not be added (HTTP ${response.status}).`,
        );
      }

      toast.success("Your book was added to the collection.");
      formElement.reset();
      router.push("/books");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not add the book. Please try again.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isPending) {
    return (
      <main className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground" role="status">
          Loading your account...
        </p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-16 sm:px-6 lg:px-8">
        <section className="mx-auto w-full max-w-2xl rounded-3xl border border-foreground/10 bg-background/45 p-8 text-center shadow-xl shadow-foreground/5 backdrop-blur-2xl sm:p-12">
          <h1 className="font-heading text-3xl font-semibold text-foreground">
            Sign in to add a book
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Your account name and email will be attached to the book submission.
          </p>
          <Link
            href="/sign-in"
            className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Sign in
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <section className="mx-auto w-full max-w-2xl rounded-3xl border border-foreground/10 bg-background/50 p-6 shadow-xl shadow-foreground/5 backdrop-blur-2xl sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Grow the shelf
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Add a book
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Share a title with the community. Your account information will be included with your submission.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="book-title" className="text-sm font-medium text-foreground">
              Book Title
            </label>
            <input
              id="book-title"
              name="title"
              type="text"
              maxLength={200}
              placeholder="Enter the book title"
              className={inputClassName}
              required
            />
          </div>

          <div>
            <label htmlFor="book-author" className="text-sm font-medium text-foreground">
              Author Name
            </label>
            <input
              id="book-author"
              name="author"
              type="text"
              maxLength={120}
              placeholder="Enter the author's name"
              className={inputClassName}
              required
            />
          </div>

          <div>
            <label htmlFor="book-category" className="text-sm font-medium text-foreground">
              Category
            </label>
            <select
              id="book-category"
              name="category"
              defaultValue=""
              className={inputClassName}
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="book-image" className="text-sm font-medium text-foreground">
              Book Image
            </label>
            <input
              id="book-image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className={`${inputClassName} file:mr-4 file:rounded-lg file:border file:border-foreground/15 file:bg-background/50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground`}
              required
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Choose a JPEG, PNG, or WebP file (up to 5 MB). It will be uploaded to ImgBB when you add the book.
            </p>
          </div>

          <div>
            <label htmlFor="book-description" className="text-sm font-medium text-foreground">
              Short Description
            </label>
            <textarea
              id="book-description"
              name="description"
              rows={5}
              maxLength={3000}
              placeholder="What is this book about?"
              className={`${inputClassName} resize-y`}
              required
            />
          </div>

          <div className="grid gap-5 rounded-2xl border border-foreground/10 bg-background/35 p-4 sm:grid-cols-2">
            <div>
              <label htmlFor="book-user-name" className="text-sm font-medium text-foreground">
                User Name
              </label>
              <input
                id="book-user-name"
                type="text"
                value={userName}
                readOnly
                className={`${inputClassName} cursor-not-allowed opacity-75`}
              />
            </div>
            <div>
              <label htmlFor="book-user-email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="book-user-email"
                type="email"
                value={user.email}
                readOnly
                className={`${inputClassName} cursor-not-allowed opacity-75`}
              />
            </div>
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
            {isSubmitting ? "Adding book..." : "Add Book"}
          </button>
        </form>
      </section>
    </main>
  );
}
