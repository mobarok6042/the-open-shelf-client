import BooksCatalog from "@/components/BooksCatalog";

export const metadata = {
  title: "Books",
  description: "Browse the book collection at The Open Shelf.",
};

export default function BooksPage() {
  return <BooksCatalog />;
}
