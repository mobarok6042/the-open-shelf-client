import StarterPage from "@/components/StarterPage";

export const metadata = {
  title: "Add Book",
  description: "Share a book with The Open Shelf collection.",
};

export default function AddBookPage() {
  return (
    <StarterPage
      eyebrow="Grow the shelf"
      title="Add a book"
      description="This is the starting point for adding a title to your collection. Book submission tools will be available here."
      actionLabel="Browse all books"
      actionHref="/books"
    />
  );
}
