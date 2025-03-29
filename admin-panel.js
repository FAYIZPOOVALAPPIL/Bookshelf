$(document).ready(function () {
    // Check if user is already logged in
    if (sessionStorage.getItem("adminLoggedIn") === "true") {
        $("#loginSection").hide();
        $("#adminSection").show();
    }

    // Handle Login Form Submission
    $("#loginForm").on("submit", function (e) {
        e.preventDefault(); // Prevent form submission

        const username = $("#username").val();
        const password = $("#password").val();

        // Check credentials
        if (username === "BOOKSHELF" && password === "Bookshelf@2025") {
            sessionStorage.setItem("adminLoggedIn", "true"); // Store login state
            $("#loginSection").hide();
            $("#adminSection").show();
        } else {
            alert("Invalid username or password!");
        }
    });

    // Logout Functionality
    $("#logoutBtn").on("click", function () {
        sessionStorage.removeItem("adminLoggedIn"); // Clear login state
        location.reload(); // Refresh page
    });

    let bookList = JSON.parse(localStorage.getItem('books')) || [];
    let editingIndex = null; // Track the index of the book being edited

    // Function to save books to localStorage
    function saveBooks() {
        localStorage.setItem('books', JSON.stringify(bookList));
    }

    // Function to render the book table
    function renderTable() {
        const $tableBody = $('#bookTable');
        $tableBody.empty(); // Clear the table before rendering

        bookList.forEach((book, index) => {
            $tableBody.append(`
                <tr>
                    <td><img src="${book.image}" alt="${book.title}" style="width: 50px;"></td>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.category}</td>
                    <td>${book.rating} ★</td>
                    <td>₹${book.price}</td>
                    <td>${book.stock}</td>
                    <td>
                        <button class="btn btn-warning btn-sm editBook" data-index="${index}">Edit</button>
                        <button class="btn btn-danger btn-sm deleteBook" data-index="${index}">Delete</button>
                    </td>
                </tr>
            `);
        });
    }

    // Handle form submission to add or update a book
 // Handle form submission to add or update a book
$('#bookForm').on('submit', function (e) {
    e.preventDefault(); // Prevent the form from submitting

    const file = $('#bookImage')[0].files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const newBook = {
            image: e.target.result, // Base64 image data
            title: $('#bookTitle').val(),
            author: $('#authorName').val(),
            category: $('#category').val(),
            isbn: $('#isbn').val(),
            publisher: $('#publisher').val(),
            language: $('#language').val(),
            about: $('#about').val(),
            rating: $('#rating').val(),
            price: $('#price').val(),
            stock: $('#stock').val()
        };

        // Check if the ISBN already exists in the bookList
        const isbnExists = bookList.some(book => book.isbn === newBook.isbn);

        if (isbnExists && editingIndex === null) {
            alert('A book with this ISBN already exists. Please use a unique ISBN.');
              $('#isbn').focus(); 
            return; // Stop further execution
        }

        if (editingIndex !== null) {
            // Update existing book
            bookList[editingIndex] = newBook;
            alert('Book updated successfully!');
            editingIndex = null; // Reset editing index
            $('#bookForm button[type="submit"]').text('Add Book'); // Change button text back to "Add Book"
        } else {
            // Add new book
            bookList.push(newBook);
            alert('Book added successfully!');
        }

        saveBooks(); // Save to localStorage
        renderTable(); // Update the table
        $('#bookForm')[0].reset(); // Reset the form
        $('#bookImagePreview').hide(); // Hide the image preview
    };

    if (file) {
        reader.readAsDataURL(file); // Read the image file
    } else if (editingIndex !== null) {
        // If editing and no new image is selected, keep the existing image
        const existingBook = bookList[editingIndex];
        reader.onload({ target: { result: existingBook.image } });
    } else {
        alert('Please select a valid image file.');
    }
});

    // Handle delete button click in Book List Table
    $('#bookTable').on('click', '.deleteBook', function () {
        const index = $(this).data('index');
        if (confirm('Are you sure you want to delete this book?')) {
            bookList.splice(index, 1); // Remove the book from the list
            saveBooks(); // Save to localStorage
            renderTable(); // Update the table
            alert('Book deleted successfully!');
        }
    });

    // Handle edit button click in Book List Table
    $('#bookTable').on('click', '.editBook', function () {
        editingIndex = $(this).data('index');
        const book = bookList[editingIndex];

        // Populate the form with the selected book's data
        $('#bookImage').val(''); // Clear the image input
        $('#bookImagePreview').attr('src', book.image).show(); // Show the existing image
        $('#bookTitle').val(book.title);
        $('#authorName').val(book.author);
        $('#category').val(book.category);
        $('#isbn').val(book.isbn);
        $('#publisher').val(book.publisher);
        $('#language').val(book.language);
        $('#about').val(book.about);
        $('#rating').val(book.rating);
        $('#price').val(book.price);
        $('#stock').val(book.stock);

        // Change the button text to "Update Book"
        $('#bookForm button[type="submit"]').text('Update Book');

        // Focus on the image input
        $('#bookImage').focus();
    });

    // Render the table on page load
    renderTable();
});

// Function to render orders in the table
   // Function to render orders in the table
  // Function to render orders in the table
// Function to render orders in the table
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const tableBody = document.getElementById('orderTableBody');
    tableBody.innerHTML = ''; // Clear existing rows

    orders.forEach((order, index) => {
        const bookDetails = order.books.map(book => `${book.title} (₹${book.price})`).join(', '); // Map books to show title and price
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.name}</td>
            <td>${order.street}</td>
            <td>${order.city}</td>
            <td>${order.pinCode}</td>
            <td>${order.district}</td>
            <td>${order.state}</td>
            <td>${order.phoneNumber}</td>
            <td>${order.paymentMethod}</td>
            <td>${order.cardNumber || '-'}</td>
            <td>${order.expiryDate || '-'}</td>
            <td>${order.cvv || '-'}</td>
           
            <td><button class="btn btn-danger" onclick="deleteOrder(${index})">Delete</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to delete an order
function deleteOrder(index) {
    if (confirm('Are you sure you want to delete this order details?')) {
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.splice(index, 1); // Remove the order from the array
        localStorage.setItem('orders', JSON.stringify(orders)); // Save back to localStorage
        loadOrders(); // Reload the order table
    }
}


        // Load orders when the page loads
        window.onload = loadOrders;

// Render orders when the page loads
document.addEventListener('DOMContentLoaded', renderOrders);