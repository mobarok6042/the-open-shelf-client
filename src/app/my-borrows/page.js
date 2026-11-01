import StarterPage from "@/components/StarterPage";

export const metadata = {
  title: "My Borrows",
  description: "Keep track of books you have borrowed.",
};

export default function MyBorrowsPage() {
  return (
    <StarterPage
      eyebrow="Your reading list"
      title="My borrows"
      description="Borrowed books and their return details will appear here, so you can keep your reading plans in one place."
      actionLabel="Explore all books"
      actionHref="/books"
    />
  );
}
