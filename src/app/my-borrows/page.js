import BorrowedBooks from "@/components/BorrowedBooks";

export const metadata = {
  title: "My Borrows",
  description: "Keep track of books you have borrowed.",
};

export default function MyBorrowsPage() {
  return <BorrowedBooks />;
}
