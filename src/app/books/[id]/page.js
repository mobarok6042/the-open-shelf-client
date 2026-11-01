import { Suspense } from "react";
import BookDetails from "@/components/BookDetails";

export const metadata = {
  title: "Book details",
  description: "Read more about a book in The Open Shelf collection.",
};

async function BookDetailsContent({ params }) {
  const { id } = await params;
  return <BookDetails id={id} />;
}

export default function BookDetailsPage({ params }) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
          <div className="h-96 animate-pulse rounded-3xl bg-muted" />
        </main>
      }
    >
      <BookDetailsContent params={params} />
    </Suspense>
  );
}
