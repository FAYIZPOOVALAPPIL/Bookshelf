$(document).ready(function () {
    // Function to render cart items
    function renderCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const bookList = JSON.parse(localStorage.getItem('books')) || []; // Fetch latest stock
    const $cartItems = $('#cartItems');
    const $checkoutBtn = $('#checkoutBtn');
    let totalPrice = 0;
    let totalItems = 0;

    $cartItems.empty(); // Clear existing cart items

    cart.forEach((item, index) => {
        // Get updated stock from books array
        let bookInStock = bookList.find(b => b.isbn === item.isbn);
        let currentStock = bookInStock ? bookInStock.stock : item.stock;

        totalPrice += item.price * item.quantity;
        totalItems += item.quantity;

        const isOutOfStock = item.quantity > currentStock; // Check updated stock

        $cartItems.append(`
            <div class="col-lg-2 col-md-4 col-6 mb-3" data-index="${index}">
                <div class="card cart-card">
                    <img src="${item.image}" class="" alt="${item.title}" style="width: 194px; object-fit: cover;">
                    <div class="card-body d-flex flex-column justify-content-between">
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-text">Author: ${item.author}</p>
                        <p class="card-text">Price: ₹${item.price}</p>
                        <p class="card-text">Stock: ${currentStock}</p>
                        <label for="quantity-${index}">Quantity:</label>
                        <input type="number" class="form-control quantityInput" id="quantity-${index}" 
                            value="${item.quantity}" min="1" max="${currentStock}" data-index="${index}" 
                            ${isOutOfStock ? 'disabled' : ''}>
                        ${isOutOfStock ? '<p class="text-danger">Out of Stock</p>' : ''}
                        <button class="btn btn-danger removeItemBtn mt-2">Remove</button>
                    </div>
                </div>
            </div>
        `);
    });

    $('#totalPrice').text(totalPrice);
    $('#cartCount').text(totalItems);

    // Disable checkout if cart is empty or contains out-of-stock items
    $checkoutBtn.prop('disabled', totalItems === 0 || cart.some(item => item.quantity > (bookList.find(b => b.isbn === item.isbn)?.stock || 0)));
}


    // Event listener to update quantity
    $('#cartItems').on('change', '.quantityInput', function () {
        const index = $(this).data('index');
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        let newQuantity = parseInt($(this).val());

        if (newQuantity < 1) {
            newQuantity = 1;
            $(this).val(1);
        }

        cart[index].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
    });

    // Event listener to remove an item from cart
    $('#cartItems').on('click', '.removeItemBtn', function () {
        const index = $(this).closest('.col-lg-2, .col-md-4, .col-6').data('index');
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Remove item from cart array
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));

        // Re-render cart items
        renderCartItems();
    });

    // Checkout button logic
    $('#checkoutBtn').on('click', function () {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const books = JSON.parse(localStorage.getItem('books')) || [];

    if (cart.length === 0) {
        alert("Your cart is empty!");
    } else {
        // Update stock for each book in the cart
        cart.forEach(cartItem => {
            const bookIndex = books.findIndex(book => book.isbn === cartItem.isbn);
            if (bookIndex !== -1) {
                books[bookIndex].stock -= cartItem.quantity;
            }
        });

        // Save the updated books array back to localStorage
        localStorage.setItem('books', JSON.stringify(books));

        // Clear the cart
        localStorage.removeItem('cart');

        // Redirect to checkout page or show a success message
        alert("Proceeding to checkout...");
        window.location.href = 'checkout.html';
    }
});

    // Initial render of cart items
    renderCartItems();
});

