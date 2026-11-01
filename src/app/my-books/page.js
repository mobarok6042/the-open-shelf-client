import StarterPage from "@/components/StarterPage";

export const metadata = {
  title: "My Books",
  description: "Keep track of your personal reading shelf.",
};

export default function MyBooksPage() {
  return (
    <StarterPage
      eyebrow="Your personal shelf"
      title="My books"
      description="Your saved and owned books will be collected here, making it easy to keep track of what you have and what you want to read next."
      actionLabel="Explore all books"
      actionHref="/books"
    />
  );
}
