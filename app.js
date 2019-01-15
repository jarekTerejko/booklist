const list = document.querySelector("#book-list");

// Book class
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI Class
class UI {
  static displayBooks() {
    const StoredBooks = [
      {
        title: "book one",
        author: "junusz",
        isbn: 1234
      },
      {
        title: "book two",
        author: "grażyna",
        isbn: 5678
      }
    ];

    const books = StoredBooks;

    books.forEach(book => UI.addBookToList(book));
  }

  static addBookToList(book) {
    // const list = document.querySelector("#book-list");

    const tableRow = document.createElement("tr");

    tableRow.insertAdjacentHTML(
      "afterbegin",
      `<td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><button class="btn red darken-3 delete-btn">X</button></td>
        `
    );

    list.appendChild(tableRow);
  }

  static clearFields() {
    document.querySelector("#book-title").value = "";
    document.querySelector("#book-author").value = "";
    document.querySelector("#book-isbn").value = "";
  }

  static deleteBook(element) {
    if(element.classList.contains('delete-btn')) {
        element.parentElement.parentElement.remove()
    }
  }
}
// end of UI Class

// Storage class

// Events: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks());

// Events: Add new Book
const bookForm = document.querySelector("#book-form");
bookForm.addEventListener("submit", e => {
  e.preventDefault();
  // get values from inputs
  let title = document.querySelector("#book-title").value;
  let author = document.querySelector("#book-author").value;
  let isbn = document.querySelector("#book-isbn").value;

  const book = new Book(title, author, isbn);
  console.log(book);

  // wywołanie metody UI.addBookToList(book) i przekazanie do niej obiektu book 
  UI.addBookToList(book);

  // wyczyszcznie pól formularza po submicie
  UI.clearFields();
});


// Events: Delete a Book
 list.addEventListener('click', (e) => {
     UI.deleteBook(e.target)
 })
