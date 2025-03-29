$(document).ready(function () {
    const bookList = JSON.parse(localStorage.getItem('books')) || [];

    // Render Book Cards
    function renderCards(filterCategory = 'all') {
        const $bookCards = $('#bookCards');
        $bookCards.empty();

        bookList.forEach((book, index) => {
            if (filterCategory === 'all' || book.category === filterCategory) {
                const stars = '★'.repeat(book.rating) + '☆'.repeat(5 - book.rating);

                // Determine stock color and status
                let stockText = `<span style="color: black;">${book.stock}</span>`;
                let buttonDisabled = "";

                if (book.stock === 0) {
                    stockText = `<span style="color: red; font-weight: bold;">Out of stock</span>`;
                  //  buttonDisabled = "disabled";
                } else if (book.stock === 1) {
                    stockText = `<span style="color: red;">${book.stock}</span>`;
                } else if (book.stock <= 3) {
                    stockText = `<span style="color: rgb(180, 69, 4);">${book.stock}</span>`;
                }

                $bookCards.append(`
                    <div class="col-lg-2 col-md-4 col-6 mb-4">
                        <div class="card h-100">
                            <img src="${book.image}" class="card-img-top" alt="${book.title}" style="height: 200px; object-fit: cover;">
                            <div class="card-body d-flex flex-column justify-content-between">
                                <div>
                                    <h5 class="card-title">${book.title}</h5>
                                    <p class="card-text"><strong>Author:</strong> ${book.author}</p>
                                    <p class="card-text"><strong>Price:</strong> ₹${book.price}</p>
                                    <p class="card-text star"><strong>Rating:</strong> ${stars}</p>
                                    <p class="card-text"><strong>Stock:</strong> ${stockText}</p>
                                </div>
                                <button class="btn btn-info viewDetails" data-index="${index}" data-bs-toggle="modal" data-bs-target="#bookDetailsModal" ${buttonDisabled}>View Details</button>
                            </div>
                        </div>
                    </div>
                `);
            }
        });
    }

    // Handle Category Filter
    $('.category-filter').on('click', function (e) {
        e.preventDefault();
        const category = $(this).data('category');
        renderCards(category);
    });

    // Handle View Details Button
    $('#bookCards').on('click', '.viewDetails', function () {
        const index = $(this).data('index');
        const book = bookList[index];

        $('#modalBookImage').attr('src', book.image);
        $('#modalBookTitle').text(book.title);
        $('#modalAuthorName').text(book.author);
        $('#modalCategory').text(book.category);
        $('#modalISBN').text(book.isbn);
        $('#modalPublisher').text(book.publisher);
        $('#modalRating').html('★'.repeat(book.rating) + '☆'.repeat(5 - book.rating));
        $('#modalPrice').text(book.price);
        
        // Change stock color based on the stock level
        $('#modalStock').text(book.stock);
        if (book.stock === 1) {
            $('#modalStock').css('color', 'red');
        } else if (book.stock <= 3) {
            $('#modalStock').css('color', 'rgb(180, 69, 4)');
        } 
         else {
            $('#modalStock').css('color', 'black');
        }

        $('#modalAbout').text(book.about);

        // Set max quantity based on stock
        $('#quantity').attr('max', book.stock);

        // Quantity Selector Logic
        $('#decrementQuantity').off('click').on('click', function () {
            const quantityInput = $('#quantity');
            let quantity = parseInt(quantityInput.val());
            if (quantity > 1) {
                quantityInput.val(quantity - 1);
            }
        });

        $('#incrementQuantity').off('click').on('click', function () {
            const quantityInput = $('#quantity');
            let quantity = parseInt(quantityInput.val());
            if (quantity < book.stock) {
                quantityInput.val(quantity + 1);
            }
        });

        // Add event listeners for modal buttons
        $('#addToCartBtn').off('click').on('click', function () {
    const quantity = parseInt($('#quantity').val());

    // Get existing cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Find the book in books list
    let bookList = JSON.parse(localStorage.getItem('books')) || [];
    let bookIndex = bookList.findIndex(b => b.isbn === book.isbn);

    // Check if the book is already in the cart
    let existingItem = cart.find(item => item.isbn === book.isbn);
    
    if (existingItem) {
        if (existingItem.quantity + quantity > bookList[bookIndex].stock) {
            alert("Cannot add more than available stock.");
            return;
        }
        existingItem.quantity += quantity;
    } else {
        cart.push({
            title: book.title,
            author: book.author,
            price: book.price,
            quantity: quantity,
            image: book.image,
            isbn: book.isbn,
            stock: bookList[bookIndex].stock // Store current stock for reference
        });
    }

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update cart count in navbar
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    $('#cartItemCount').text(cartCount);

    // Close the modal
    $('#bookDetailsModal').modal('hide');

    // Alert or notification
    alert(`${quantity} copies of ${book.title} added to cart!`);

    // Re-render book list to show updated stock (no stock change here)
    renderCards();
});


        $('#addToWishlistBtn').off('click').on('click', function () {
            const quantity = parseInt($('#quantity').val());

            // Get existing wishlist from localStorage, or initialize as empty array
            let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

            // Check if the book is already in the wishlist
            const existingItem = wishlist.find(item => item.isbn === book.isbn);
            if (!existingItem) {
                // Add the new book to the wishlist
                wishlist.push({
                    title: book.title,
                    author: book.author,
                    price: book.price,
                    quantity: quantity,
                    image: book.image,
                    isbn: book.isbn
                });
            }

            // Save the updated wishlist to localStorage
            localStorage.setItem('wishlist', JSON.stringify(wishlist));

            // Close the modal
            $('#bookDetailsModal').modal('hide');

            // Alert or notification
            alert(`${book.title} added to wishlist!`);
        });

        $('#buyNowBtn').off('click').on('click', function () {
    const quantity = parseInt($('#quantity').val());

    // Check if the selected quantity is greater than the available stock
    if (quantity > book.stock) {
        alert("Out of Stock");
        return; // Stop further execution
    }

    // Update the book stock only when buying
    book.stock -= quantity;

    // Save the updated book list with updated stock to localStorage
    localStorage.setItem('books', JSON.stringify(bookList));

    // Re-render book cards to reflect the updated stock
    renderCards();
    alert("Go to payment section");

    // Redirect to checkout page with book details
    window.location.href = `checkout.html?title=${encodeURIComponent(book.title)}&quantity=${quantity}&price=${book.price}`;
});
    });

    // Initial render
    renderCards();
});