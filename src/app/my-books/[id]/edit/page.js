import { Suspense } from "react";
import EditBookForm from "@/components/EditBookForm";

export const metadata = {
  title: "Edit Book",
  description: "Update a book you added to The Open Shelf collection.",
};

async function EditBookPageContent({ params }) {
  const { id } = await params;
  return <EditBookForm id={id} />;
}

export default function EditBookPage({ params }) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto h-96 max-w-2xl animate-pulse rounded-3xl bg-muted" />
        </main>
      }
    >
      <EditBookPageContent params={params} />
    </Suspense>
  );
}
