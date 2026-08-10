"""
Big Data Analytics — Assignment (3)
Key-Value Database Implementation: a Library Books Store
=========================================================

A key-value database stores data as (key -> value) pairs instead of rows and
columns. There is no fixed schema: the key uniquely identifies a record, and
the value carries the whole record payload.

In this library database:

    KEY   = Book ID          e.g. "B001"
    VALUE = {title, author, category}

The KeyValueDB class below is a minimal key-value store engine implementing
the core operations any key-value database provides (PUT / GET / UPDATE /
DELETE / SCAN), backed by a Python dictionary — which is itself an in-memory
hash-map key-value structure.
"""

from collections import Counter


# ===========================================================================
# 1. The Key-Value database engine
# ===========================================================================
class KeyValueDB:
    """A minimal key-value database (in-memory, dictionary-backed)."""

    def __init__(self, name="db"):
        self.name = name
        self._store = {}          # <-- the actual key -> value dictionary

    # ---- core key-value operations -------------------------------------
    def put(self, key, value):
        """Insert or replace the record stored under `key`."""
        self._store[key] = value
        return key

    def get(self, key):
        """Retrieve the value stored under `key` (None if the key is absent)."""
        return self._store.get(key)

    def exists(self, key):
        """Return True if `key` is present in the store."""
        return key in self._store

    def update_field(self, key, field, new_value):
        """Update a single field inside the value of an existing key."""
        if key not in self._store:
            return False
        self._store[key][field] = new_value
        return True

    def delete(self, key):
        """Remove the record stored under `key`."""
        return self._store.pop(key, None)

    def keys(self):
        """All keys currently in the store."""
        return list(self._store.keys())

    def items(self):
        """All (key, value) pairs — a full scan of the store."""
        return list(self._store.items())

    def count(self):
        """Total number of records stored."""
        return len(self._store)


# ===========================================================================
# 2. Build the sample library database (Python dictionary of 12 books)
#    KEY = Book ID, VALUE = (title, author, category)
# ===========================================================================
BOOKS = {
    "B001": {"title": "Hadoop: The Definitive Guide", "author": "Tom White",        "category": "Big Data"},
    "B002": {"title": "Learning Spark",               "author": "Holden Karau",     "category": "Big Data"},
    "B003": {"title": "Designing Data-Intensive Apps","author": "Martin Kleppmann", "category": "Databases"},
    "B004": {"title": "NoSQL Distilled",              "author": "Martin Fowler",    "category": "Databases"},
    "B005": {"title": "Python Crash Course",          "author": "Eric Matthes",     "category": "Programming"},
    "B006": {"title": "Fluent Python",                "author": "Luciano Ramalho",  "category": "Programming"},
    "B007": {"title": "Clean Code",                   "author": "Robert C. Martin", "category": "Programming"},
    "B008": {"title": "Introduction to Algorithms",   "author": "Thomas H. Cormen", "category": "Algorithms"},
    "B009": {"title": "Data Science from Scratch",    "author": "Joel Grus",        "category": "Data Science"},
    "B010": {"title": "Pattern Recognition and ML",   "author": "Christopher Bishop","category": "Machine Learning"},
    "B011": {"title": "Deep Learning",                "author": "Ian Goodfellow",   "category": "Machine Learning"},
    "B012": {"title": "MapReduce Design Patterns",    "author": "Donald Miner",     "category": "Big Data"},
}


def build_library():
    """Load the sample books dictionary into the key-value database."""
    db = KeyValueDB(name="library")
    for book_id, info in BOOKS.items():
        db.put(book_id, dict(info))       # PUT: key = Book ID, value = book info
    return db


# ===========================================================================
# Helpers for printing tidy output
# ===========================================================================
def banner(number, text):
    print()
    print("=" * 78)
    print(f"  {number}. {text}")
    print("=" * 78)


def print_book_row(book_id, info):
    print(f"  {book_id:<6} {info['title']:<34} {info['author']:<22} {info['category']}")


def print_table_header():
    print(f"  {'ID':<6} {'TITLE':<34} {'AUTHOR':<22} CATEGORY")
    print("  " + "-" * 74)


# ===========================================================================
# 3. Display all the stored records
# ===========================================================================
def display_all_records(db):
    banner(3, "DISPLAY ALL STORED RECORDS")
    print_table_header()
    for book_id, info in db.items():
        print_book_row(book_id, info)
    print("  " + "-" * 74)
    print(f"  {db.count()} records stored in the '{db.name}' key-value database.")


# ===========================================================================
# 4. Retrieve a book using its Book ID   (GET by key)
# ===========================================================================
def retrieve_book(db, book_id):
    banner(4, f"RETRIEVE A BOOK USING ITS BOOK ID  ->  GET('{book_id}')")
    book = db.get(book_id)
    if book is None:
        print(f"  No book found with ID '{book_id}'.")
        return None

    print(f"  Key   : {book_id}")
    print(f"  Value : {book}")
    print()
    print(f"    Title    : {book['title']}")
    print(f"    Author   : {book['author']}")
    print(f"    Category : {book['category']}")
    return book


# ===========================================================================
# 5. Update the category of an existing book
# ===========================================================================
def update_category(db, book_id, new_category):
    banner(5, f"UPDATE THE CATEGORY OF AN EXISTING BOOK  ->  '{book_id}'")
    old = db.get(book_id)
    if old is None:
        print(f"  No book found with ID '{book_id}' — nothing to update.")
        return False

    old_category = old["category"]
    db.update_field(book_id, "category", new_category)
    print(f"  Book    : {old['title']}")
    print(f"  Category: '{old_category}'  ->  '{new_category}'")
    print("  Update applied successfully.")
    return True


# ===========================================================================
# 6. Display the updated record
# ===========================================================================
def display_updated_record(db, book_id):
    banner(6, f"DISPLAY THE UPDATED RECORD  ->  '{book_id}'")
    book = db.get(book_id)
    print_table_header()
    print_book_row(book_id, book)


# ===========================================================================
# 7. Count total books
# ===========================================================================
def count_total_books(db):
    banner(7, "COUNT TOTAL BOOKS")
    print(f"  Total books in the library database: {db.count()}")
    return db.count()


# ===========================================================================
# 8. Count books per category
# ===========================================================================
def count_books_per_category(db):
    banner(8, "COUNT BOOKS PER CATEGORY")
    counts = Counter(info["category"] for _, info in db.items())
    print(f"  {'CATEGORY':<22} COUNT")
    print("  " + "-" * 34)
    for category, count in sorted(counts.items(), key=lambda kv: (-kv[1], kv[0])):
        bar = "#" * count
        print(f"  {category:<22} {count:<5} {bar}")
    return counts


# ===========================================================================
# 9. Display the available categories
# ===========================================================================
def display_categories(db):
    banner(9, "DISPLAY AVAILABLE CATEGORIES")
    categories = sorted({info["category"] for _, info in db.items()})
    print(f"  {len(categories)} distinct categories:")
    for i, category in enumerate(categories, start=1):
        print(f"    {i}. {category}")
    return categories


# ===========================================================================
# 10. Display the most common category
# ===========================================================================
def display_most_common_category(db):
    banner(10, "DISPLAY THE MOST COMMON CATEGORY")
    counts = Counter(info["category"] for _, info in db.items())
    if not counts:
        print("  The database is empty.")
        return None

    category, count = counts.most_common(1)[0]
    print(f"  Most common category: '{category}'  ({count} books)")
    print()
    print("  Books in this category:")
    for book_id, info in db.items():
        if info["category"] == category:
            print(f"    - {book_id}  {info['title']}")
    return category, count


# ===========================================================================
# Main program — runs every required operation in order
# ===========================================================================
def main():
    print("*" * 78)
    print("   BIG DATA ANALYTICS — ASSIGNMENT (3)")
    print("   KEY-VALUE DATABASE IMPLEMENTATION  —  LIBRARY BOOKS STORE")
    print("   KEY = Book ID      VALUE = (title, author, category)")
    print("*" * 78)

    # (1) + (2) create the sample database from a dictionary of 12 books
    banner(1, "CREATE THE LIBRARY KEY-VALUE DATABASE")
    db = build_library()
    print(f"  Key-value database '{db.name}' created.")
    print(f"  {db.count()} books loaded (requirement: at least 10).")
    print(f"  Keys stored: {db.keys()}")

    banner(2, "THE UNDERLYING PYTHON DICTIONARY (first 3 key-value pairs)")
    for book_id in db.keys()[:3]:
        print(f"  '{book_id}' : {db.get(book_id)}")
    print("  ...")

    # (3) display all records
    display_all_records(db)

    # (4) retrieve one book by its key
    retrieve_book(db, "B005")

    # (5) update the category of an existing book
    update_category(db, "B005", "Education")

    # (6) display the updated record
    display_updated_record(db, "B005")

    # (7) count total books
    count_total_books(db)

    # (8) count books per category
    count_books_per_category(db)

    # (9) display available categories
    display_categories(db)

    # (10) display the most common category
    display_most_common_category(db)

    print()
    print("=" * 78)
    print("  All 10 required operations completed successfully.")
    print("=" * 78)


if __name__ == "__main__":
    main()
