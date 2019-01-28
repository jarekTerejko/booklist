const list = document.querySelector("#book-list");
const bookBtn = document.querySelector("#book-picker");
const deleteBooksBtn = document.querySelector("#delete-books");
let currentBook = null;

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
  // pobranie książek z LS i dodanie do tabeli
  static displayBooks() {
    // const StoredBooks = [
    //   {
    //     title: "book one",
    //     author: "junusz",
    //     isbn: 1234
    //   },
    //   {
    //     title: "book two",
    //     author: "grażyna",
    //     isbn: 5678
    //   }
    // ];

    // const books = StoredBooks;

    const books = Storage.getBooksFromStorage();

    books.forEach(book => UI.addBookToList(book));
  }

  // dodanie książki do UI
  static addBookToList(book) {
    // console.log(book);

    // utworzenie tr
    const tableRow = document.createElement("tr");
    // dodanie atrybutow id oraz data
    tableRow.dataset.id = `${book.id}`;
    tableRow.setAttribute("id", `${book.id}`);

    // umieszczenie w tableRow HTML z danymi o kiążce
    tableRow.insertAdjacentHTML(
      "afterbegin",
      `<td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><button class="btn orange darken-3 btn-small edit-btn">edytuj</button><button class="btn green darken-3 btn-small update-btn">zatwierdź</button><button class="btn blue darken-3 btn-small back-btn">Zrezygnuj</button><button class="btn red darken-3 btn-small delete-btn">usuń</button></td>`
    );

    // umieszczenie każdej kolejnej książki jako pierwszej w tabeli
    list.insertAdjacentElement("afterbegin", tableRow);
  }

  static updateBookList(updatedBook) {
    // console.log(updatedBook);

    // pobranie wszystkich istniejących juz tr z książkami
    let tableRows = document.querySelectorAll("#book-list tr");
    // console.log(tableRows);

    // odnalezienie tr którego id jest zgodne z id książki edytowanej
    tableRows.forEach(tableRow => {
      let tableRowID = tableRow.id;
      tableRowID = parseFloat(tableRowID)
      // console.log(tableRowID);
      // console.log(updatedBook.id);

      if (tableRowID === updatedBook.id) {

        // aktualizacja UI nowymi danymi o książce
        document.getElementById(`${tableRowID}`).innerHTML = `
          <td>${updatedBook.title}</td>
          <td>${updatedBook.author}</td>
          <td>${updatedBook.isbn}</td>
          <td><button class="btn orange darken-3 btn-small edit-btn">edytuj</button><button class="btn green darken-3 btn-small update-btn">zatwierdź</button><button class="btn blue darken-3 btn-small back-btn">Zrezygnuj</button><button class="btn red darken-3 btn-small delete-btn">usuń</button></td>`;
      }
    });
  }

  // info
  static showMessage(message, className) {
    const container = document.querySelector("#message");

    // zapobiega wyswietlaniu wielu komunikatów
    if (!container.hasChildNodes()) {
      const messageContainer = document.createElement("div");
      messageContainer.className = `alert alert-${className}`;
      messageContainer.textContent = message;

      // info znika po podanym czasie
      container.appendChild(messageContainer);
      setTimeout(() => {
        messageContainer.remove();
      }, 3000);
    }
  }

  // wy zeszczenie pól formularza
  static clearFields() {
    document.querySelector("#book-title").value = "";
    document.querySelector("#book-author").value = "";
    document.querySelector("#book-isbn").value = "";
  }

  // usunięcie książki z UI
  static deleteBook(element) {
    // po kliknięciu na delete-btn usuwamy cały tr
    if (element.classList.contains("delete-btn")) {
      element.parentElement.parentElement.remove();

      UI.showMessage("Usunięto książkę", "success");
    }
  }

  // usunięcie wszystkich książek z UI
  static deleteAllBooks() {
    if(list.hasChildNodes()) {
      list.innerHTML = "";
      UI.showMessage("Usunięto wszystkie książki", "success");
    }
  }

  // wyszukanie książki w tablicy z obiektami
  static findBookById(id) {
    let found = null;
    const books = Storage.getBooksFromStorage();
    console.log(books);
    books.forEach(book => {
      if (book.id == id) {
        found = book;
      }
    });
    return found;
  }

  // obiekt do edycji zapisujemy do zmiennej currentBook
  static setCurrentBook(bookToEdit) {
    currentBook = bookToEdit;
    // console.log(currentBook);
  }

  // wyszukanie książki do edycji do przekazanie do niej nowych wartości z formularza
  static bookUpdate(title, author, isbn) {
    let found = null;
    const books = Storage.getBooksFromStorage();
    books.forEach(book => {
      if (book.id == currentBook.id) {
        book.title = title;
        book.author = author;
        book.isbn = isbn;
        found = book;
      }
    });
    return found;
  }

  // wstawia wartości z currentBook do formualrza
  static addBookToForm() {
    document.querySelector("#book-title").value = currentBook.title;
    document.querySelector("#book-author").value = currentBook.author;
    document.querySelector("#book-isbn").value = currentBook.isbn;
  }

  // edycja istniejącej książki
  static editBook(element) {
    // console.log(element);

    // jesli kliknięto w edit-btn...
    if (element.classList.contains("edit-btn")) {
      // ... to pobieramy i zapisujemy do zmiennej id całego tr z książką...
      const trID = element.parentElement.parentElement.dataset.id;
      // console.log(trID);

      // ... to id przekazujemy do UI.findBookById(trID) która zwraca obiekt z książką przenaczoną do edycji...
      const bookToEdit = UI.findBookById(trID);
      // console.log(bookToEdit);

      // ... ten obiekt przekazujemy do UI.setCurrentBook(bookToEdit)
      UI.setCurrentBook(bookToEdit);

      // wstawienie wartości z currentBook do odpowiednich pól formularza
      UI.addBookToForm();

      // info
      UI.showMessage("Edycja książki w trakcie", "success");
    }
  }

  // potwierdzenie dodania istniejącej juz książki z nowymi danymi
  static updateBook(element) {
    let title = document.querySelector("#book-title").value;
    let author = document.querySelector("#book-author").value;
    let isbn = document.querySelector("#book-isbn").value;

    // jeśli kliknięto na update-btn i currentBook nie jest null tzn jesli wczesniej wciśnieto edit-btn co pozwoliło dodać do currentBook wartości
    if (element.classList.contains("update-btn") && currentBook !== null) {
      // console.log("update");

      // utworzenie obiektu który przechowuje nowe dane o książce
      const updatedBook = UI.bookUpdate(title, author, isbn);
      // console.log(updatedBook);

      // aktualizacja LS
      Storage.updateBookStorage(updatedBook);

      // aktualizacja UI
      UI.updateBookList(updatedBook);

      // info
      UI.showMessage("Edycja ukończona pomyślnie", "success");

      // wyczyszcznie pól formularza
      UI.clearFields();
    }
  }

  // Wyswielenie wylosowanego tytułu książki
  static chooseBook() {
    const books = Storage.getBooksFromStorage();
    const randomNum = Math.floor(Math.random() * books.length);
    // console.log(randomNum);
    const bookTitle = document.querySelector(".book-title");

    bookTitle.textContent = books[randomNum].title;
  }
}
// end of UI Class

// Storage class
class Storage {
  // pobranie tablicy z LS
  static getBooksFromStorage() {
    let books;
    // jesli w LS brak tablicy to ja dodajemy
    if (localStorage.getItem("books") === null) {
      books = [];
      localStorage.setItem("books", JSON.stringify(books));
      // jeśli jest to ja pobieramy
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBookToStorage(book) {
    // pobieramy tablice z LS
    const books = Storage.getBooksFromStorage();

    // wstawiamy do  tablicy nowa książkę
    books.push(book);

    // zapisujemy w LS aktualną tablice
    localStorage.setItem("books", JSON.stringify(books));
  }

  static deleteBookFromStorage(id) {
    // pobieramy tablice z LS
    const books = Storage.getBooksFromStorage();

    // szukamy książki której id jest zgodne z dateset elementu tr
    books.forEach((book, index) => {
      // jesli jest zgodność usuwamy jeden obiekt z tablicy
      if (book.id === parseFloat(id)) {
        books.splice(index, 1);
      }
    });

    // zapisujemy w LS aktualną tablice
    localStorage.setItem("books", JSON.stringify(books));
  }
  // usunięcie wszystkich książek z LS
  static deleteAllBooksFromStorage() {
    // usuwa tablice z LS
    localStorage.removeItem("books");
  }

  // aktualizacja pojedynczej książki
  static updateBookStorage(updatedBook) {
    // pobieramy tablice z LS
    const books = Storage.getBooksFromStorage();

    // szukamy zgodności id ksiażki z tablicy i książki która jest edytowana
    books.forEach((book, index) => {
      // jesli znaleziono to zamieniamy książkę z tablicy na nową przekazaną jako argument do funkcji
      if (updatedBook.id === book.id) {
        books.splice(index, 1, updatedBook);
      }
    });
    // zapisujemy w LS aktualną tablice
    localStorage.setItem("books", JSON.stringify(books));
  }
}
// end of Storage class

// Event:
// Po załadowaniu DOM wywołanie UI.displayBooks()
document.addEventListener("DOMContentLoaded", UI.displayBooks());

// Event:
// Dodanie nowej książki po wypełnieniu pól formularza
const bookForm = document.querySelector("#book-form");
bookForm.addEventListener("submit", e => {
  e.preventDefault();

  // pobranie wartości z inputów
  let title = document.querySelector("#book-title").value;
  let author = document.querySelector("#book-author").value;
  let isbn = document.querySelector("#book-isbn").value;

  // walidacja - brak pustych inputów
  if (title === "" || author === "" || isbn === "") {
    UI.showMessage("Wszystkie pola są wymagane", "danger");
  } else {
    // utworzenie pojedyńczego obiektu Book
    const book = new Book(title, author, isbn);
    // dodanie do biektu właściwości id i nadanie jej wartości losowej
    book.id = Math.random();
    // console.log(book);

    // wywołanie metody UI.addBookToList(book) i przekazanie do niej obiektu book
    UI.addBookToList(book);

    // wywołanie metody Storage.addBookToStorage(book) i przekazanie do niej obiektu book
    Storage.addBookToStorage(book);

    // info
    UI.showMessage("Dodano książkę do tabeli", "success");

    // wyczyszcznie pól formularza po submicie
    UI.clearFields();
  }
});

// Events:
// Usuniecię ksążki z UI i LS
list.addEventListener("click", e => {
  UI.deleteBook(e.target);

  if (e.target.classList.contains("delete-btn")) {
    Storage.deleteBookFromStorage(
      e.target.parentElement.parentElement.dataset.id
    );
  }
});

// Event:
// rozpoczęcie edycji książki po kliknieciu
list.addEventListener("click", e => {
  UI.editBook(e.target);
});

// Event:
// zatwierdzenie zmian po edycji
list.addEventListener("click", e => {
  UI.updateBook(e.target);
});

// Event:
// rezygancja z edycji danych książki
list.addEventListener("click", e => {
  // console.log(currentBook);
  if (e.target.classList.contains("back-btn")) {
    UI.clearFields();
    UI.showMessage("Zrezygnowano z edycji", "success");
    currentBook = null;
  }
});

// Event:
// po kliknieciu wyswietlenie modalu z losowo wybranym tytułem książki
bookBtn.addEventListener("click", () => {
  UI.chooseBook();
});

// Event:
// po kliknięciu usunięcie Z UI i LS wszystkich wpisanych książek
deleteBooksBtn.addEventListener("click", e => {
  e.preventDefault();
  UI.deleteAllBooks();
  Storage.deleteAllBooksFromStorage();
});

// unicjalizacja komponentów interaktywnych Materialize 
M.AutoInit();
