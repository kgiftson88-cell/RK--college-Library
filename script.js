// Initial Book Data
let books = [
    {
        id: "1",
        title: "Clean Code",
        author: "Robert C. Martin",
        isbn: "978-0132350884",
        category: "Science & Tech",
        status: "Available"
    },
    {
        id: "2",
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        isbn: "978-0061120084",
        category: "Fiction",
        status: "Issued"
    },
    {
        id: "3",
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        isbn: "978-0062316097",
        category: "History",
        status: "Available"
    }
];

// DOM Elements
const bookForm = document.getElementById('book-form');
const bookIdInput = document.getElementById('book-id');
const bookTitleInput = document.getElementById('book-title');
const bookAuthorInput = document.getElementById('book-author');
const bookIsbnInput = document.getElementById('book-isbn');
const bookCategoryInput = document.getElementById('book-category');
const bookStatusInput = document.getElementById('book-status');

const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-title');

const bookList = document.getElementById('book-list');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const statusFilter = document.getElementById('status-filter');

// Render Books Function
function renderBooks() {
    const searchVal = searchInput.value.toLowerCase();
    const catVal = categoryFilter.value;
    const statVal = statusFilter.value;

    bookList.innerHTML = '';

    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchVal) ||
                              book.author.toLowerCase().includes(searchVal) ||
                              book.isbn.toLowerCase().includes(searchVal);

        const matchesCategory = (catVal === 'All') || (book.category === catVal);
        const matchesStatus = (statVal === 'All') || (book.status === statVal);

        return matchesSearch && matchesCategory && matchesStatus;
    });

    if (filteredBooks.length === 0) {
        bookList.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: #a3aed0; padding: 20px;">
                    No books found matching your criteria.
                </td>
            </tr>
        `;
        return;
    }

    filteredBooks.forEach(book => {
        const tr = document.createElement('tr');

        const isAvailable = book.status === 'Available';
        const badgeClass = isAvailable ? 'badge-available' : 'badge-issued';
        const toggleBtnText = isAvailable ? 'Issue Book' : 'Return Book';
        const toggleBtnClass = isAvailable ? 'btn-issue' : 'btn-return';

        tr.innerHTML = `
            <td><strong>${book.title}</strong></td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td>${book.category}</td>
            <td><span class="badge ${badgeClass}">${book.status}</span></td>
            <td>
                <button class="btn btn-toggle ${toggleBtnClass}" onclick="toggleBookStatus('${book.id}')">
                    ${toggleBtnText}
                </button>
                <button class="btn-action btn-edit" onclick="editBook('${book.id}')" title="Edit Book">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn-action btn-delete" onclick="deleteBook('${book.id}')" title="Delete Book">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;

        bookList.appendChild(tr);
    });
}

// Add or Edit Book
bookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = bookIdInput.value;
    const title = bookTitleInput.value.trim();
    const author = bookAuthorInput.value.trim();
    const isbn = bookIsbnInput.value.trim();
    const category = bookCategoryInput.value;
    const status = bookStatusInput.value;

    if (id) {
        // Edit existing book
        const bookIndex = books.findIndex(b => b.id === id);
        if (bookIndex !== -1) {
            books[bookIndex] = { id, title, author, isbn, category, status };
        }
    } else {
        // Add new book
        const newBook = {
            id: Date.now().toString(),
            title,
            author,
            isbn,
            category,
            status
        };
        books.push(newBook);
    }

    resetForm();
    renderBooks();
});

// Edit Book Setup
function editBook(id) {
    const book = books.find(b => b.id === id);
    if (!book) return;

    bookIdInput.value = book.id;
    bookTitleInput.value = book.title;
    bookAuthorInput.value = book.author;
    bookIsbnInput.value = book.isbn;
    bookCategoryInput.value = book.category;
    bookStatusInput.value = book.status;

    formTitle.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Edit Book`;
    saveBtn.innerHTML = `<i class="fa-solid fa-check"></i> Update Book`;
    cancelBtn.classList.remove('hidden');
}

// Toggle Book Issue/Return Status
function toggleBookStatus(id) {
    const book = books.find(b => b.id === id);
    if (book) {
        book.status = book.status === 'Available' ? 'Issued' : 'Available';
        renderBooks();
    }
}

// Delete Book
function deleteBook(id) {
    if (confirm("Are you sure you want to delete this book record?")) {
        books = books.filter(b => b.id !== id);
        renderBooks();
    }
}

// Reset Form
function resetForm() {
    bookForm.reset();
    bookIdInput.value = '';
    formTitle.innerHTML = `<i class="fa-solid fa-plus-circle"></i> Add New Book`;
    saveBtn.innerHTML = `<i class="fa-solid fa-save"></i> Save Book`;
    cancelBtn.classList.add('hidden');
}

cancelBtn.addEventListener('click', resetForm);

// Search and Filter Listeners
searchInput.addEventListener('input', renderBooks);
categoryFilter.addEventListener('change', renderBooks);
statusFilter.addEventListener('change', renderBooks);

// Initial Load
renderBooks();