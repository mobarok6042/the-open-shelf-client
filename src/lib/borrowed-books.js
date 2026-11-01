const borrowedBooksKey = "open-shelf-borrows";

export function getBorrowedBooks() {
  const storedBooks = window.localStorage.getItem(borrowedBooksKey);

  if (!storedBooks) {
    return [];
  }

  const borrowedBooks = JSON.parse(storedBooks);

  if (
    !Array.isArray(borrowedBooks) ||
    borrowedBooks.some(
      (item) =>
        !item ||
        typeof item.book?._id !== "string" ||
        typeof item.book?.Title !== "string" ||
        typeof item.borrowedAt !== "string",
    )
  ) {
    throw new Error("Your saved borrow list could not be read.");
  }

  return borrowedBooks;
}

export function addBorrowedBook(book) {
  const borrowedBooks = getBorrowedBooks();

  if (borrowedBooks.some((item) => item.book._id === book._id)) {
    return false;
  }

  borrowedBooks.push({ book, borrowedAt: new Date().toISOString() });
  window.localStorage.setItem(borrowedBooksKey, JSON.stringify(borrowedBooks));
  return true;
}
