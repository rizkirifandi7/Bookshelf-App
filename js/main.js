// Fungsi untuk menyimpan buku ke localStorage
function saveBookToLocalStorage(books) {
	localStorage.setItem("books", JSON.stringify(books));
}

// Fungsi untuk mendapatkan buku dari localStorage
function getBooksFromLocalStorage() {
	const booksData = localStorage.getItem("books");
	return booksData ? JSON.parse(booksData) : [];
}

// Fungsi untuk menampilkan buku pada rak
function renderBooks(books) {
	const unfinishedShelf = document.getElementById("unfinishedShelf");
	const finishedShelf = document.getElementById("finishedShelf");

	unfinishedShelf.innerHTML = "";
	finishedShelf.innerHTML = "";

	books.forEach((book) => {
		const li = document.createElement("li");
		li.innerHTML = `
		<div class='bor'>
			<h4 class='fw-semibold'>${book.title}</h4> 
			<p class='p-edit'>(${book.year})</p>
			<p class='p-edit'>-${book.author}</p>
			<div>
				<button class='btn-custom' onclick="moveBook(${book.id})">Pindahkan</button>
				<button class='btn-custom m-2' onclick="editBook(${book.id})">Edit</button>
				<button class='btn-custom mt-2' onclick="deleteBook(${book.id})">Hapus</button>
			</div>
		</div>
        `;

		if (book.isComplete) {
			finishedShelf.appendChild(li);
		} else {
			unfinishedShelf.appendChild(li);
		}
	});
}

// Fungsi untuk menampilkan modal sukses
function showSuccessModal() {
	const successModal = new bootstrap.Modal(document.getElementById("successModal"));
	successModal.show();
}

// Fungsi untuk menambahkan buku baru
function addBook(event) {
	event.preventDefault();

	const title = document.getElementById("title").value;
	const author = document.getElementById("author").value;
	const year = document.getElementById("year").value;
	const isComplete = document.getElementById("isComplete").checked;
	const id = +new Date();

	const newBook = {
		id,
		title,
		author,
		year,
		isComplete,
	};

	// Dapatkan buku-buku dari localStorage
	const books = getBooksFromLocalStorage();
	books.push(newBook);

	// Simpan buku baru ke localStorage
	saveBookToLocalStorage(books);

	// Perbarui tampilan rak buku
	renderBooks(books);

	// Reset form
	document.getElementById("addBookForm").reset();

	// Tampilkan modal sukses
	showSuccessModal();
}

// Fungsi untuk menampilkan modal edit buku
function editBook(bookId) {
	const books = getBooksFromLocalStorage();
	const book = books.find((b) => b.id === bookId);

	if (book) {
		// Isi formulir edit dengan data buku yang ingin diedit
		document.getElementById("editBookId").value = book.id;
		document.getElementById("editTitle").value = book.title;
		document.getElementById("editAuthor").value = book.author;
		document.getElementById("editYear").value = book.year;
		document.getElementById("editIsComplete").checked = book.isComplete;

		// Tampilkan modal edit buku
		const editModal = new bootstrap.Modal(document.getElementById("editModal"));
		editModal.show();
	}
}

// Fungsi untuk menyimpan perubahan yang dibuat dalam modal edit buku
function saveEditedBook() {
	const editedBookId = document.getElementById("editBookId").value;
	const editedTitle = document.getElementById("editTitle").value;
	const editedAuthor = document.getElementById("editAuthor").value;
	const editedYear = document.getElementById("editYear").value;
	const editedIsComplete = document.getElementById("editIsComplete").checked;

	const books = getBooksFromLocalStorage();
	const bookIndex = books.findIndex((book) => book.id === +editedBookId);

	if (bookIndex !== -1) {
		books[bookIndex] = {
			id: +editedBookId,
			title: editedTitle,
			author: editedAuthor,
			year: editedYear,
			isComplete: editedIsComplete,
		};

		saveBookToLocalStorage(books);
		renderBooks(books);

		// Tutup modal edit buku
		const editModal = new bootstrap.Modal(document.getElementById("editModal"));
		editModal.hide();
	}
}

// Fungsi untuk memindahkan buku antar rak
function moveBook(bookId) {
	const books = getBooksFromLocalStorage();
	const bookIndex = books.findIndex((book) => book.id === bookId);

	if (bookIndex !== -1) {
		books[bookIndex].isComplete = !books[bookIndex].isComplete;
		saveBookToLocalStorage(books);
		renderBooks(books);
	}
}

// Fungsi untuk menghapus buku
function deleteBook(bookId) {
	const books = getBooksFromLocalStorage();
	const updatedBooks = books.filter((book) => book.id !== bookId);
	saveBookToLocalStorage(updatedBooks);
	renderBooks(updatedBooks);
}

// Menambahkan event listener ke elemen input pencarian buku
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", searchBook);

// Fungsi untuk mencari buku
function searchBook() {
	const searchInputValue = searchInput.value.toLowerCase();
	const books = getBooksFromLocalStorage();

	const searchResults = books.filter((book) => {
		const title = book.title.toLowerCase();
		const author = book.author.toLowerCase();
		return title.includes(searchInputValue) || author.includes(searchInputValue);
	});

	renderBooks(searchResults);
}

// Memuat buku saat halaman pertama kali dimuat
const initialBooks = getBooksFromLocalStorage();
renderBooks(initialBooks);

// Menambahkan event listener untuk form
document.getElementById("addBookForm").addEventListener("submit", addBook);

// Menambahkan event listener untuk tombol "Simpan Perubahan" pada modal edit buku
document.getElementById("editModalSaveButton").addEventListener("click", saveEditedBook);
