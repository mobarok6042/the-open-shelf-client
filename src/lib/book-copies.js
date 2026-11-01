export function getBookGroupKey(book) {
  const title = book.Title.trim().normalize("NFKC").toLowerCase();
  const author = book.Author.trim().normalize("NFKC").toLowerCase();
  return `${title}\u0000${author}`;
}

export function getAvailableCopies(book, books) {
  const key = getBookGroupKey(book);

  return books.filter(
    (copy) =>
      getBookGroupKey(copy) === key &&
      (typeof copy.BorrowedByEmail !== "string" || !copy.BorrowedByEmail),
  ).length;
}

export function groupBookCopies(books) {
  const groups = new Map();

  for (const book of books) {
    const key = getBookGroupKey(book);
    const group = groups.get(key);

    if (group) {
      group.AvailableCopies +=
        typeof book.BorrowedByEmail === "string" && book.BorrowedByEmail ? 0 : 1;
    } else {
      groups.set(key, {
        ...book,
        AvailableCopies:
          typeof book.BorrowedByEmail === "string" && book.BorrowedByEmail ? 0 : 1,
      });
    }
  }

  return Array.from(groups.values());
}
