$(document).ready(function () {
    // Get wishlist from localStorage
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const $wishlistItems = $('#wishlistItems');
    
    // Render Wishlist Items
    wishlist.forEach((book, index) => {
        $wishlistItems.append(
            `<div class="col-md-2 mb-4">
                <div class="card">
                    <img src="${book.image}" class="card-img-top" alt="${book.title}">
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text"><strong>Author:</strong> ${book.author}</p>
                        <p class="card-text"><strong>Price:</strong> ₹${book.price}</p>
                        <button class="btn btn-danger removeFromWishlist" data-index="${index}">Remove</button>
                    </div>
                </div>
            </div>`
        );
    });

    // Remove Book from Wishlist
    $wishlistItems.on('click', '.removeFromWishlist', function () {
        const index = $(this).data('index');
        wishlist.splice(index, 1); // Remove book from wishlist array
        
        // Save the updated wishlist back to localStorage
        localStorage.setItem('wishlist', JSON.stringify(wishlist));

        // Re-render the wishlist
        location.reload(); // Refresh the page to reflect changes
    });
});