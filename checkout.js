document.getElementById('paymentMethod').addEventListener('change', function () {
    const cardDetails = document.getElementById('cardDetails');
    if (this.value === 'Credit Card' || this.value === 'Debit Card') {
        cardDetails.style.display = 'block';
    } else {
        cardDetails.style.display = 'none';
    }
});

document.getElementById('checkoutForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const paymentMethod = document.getElementById('paymentMethod').value;

    const checkoutDetails = {
        name: document.getElementById('name').value,
        street: document.getElementById('street').value,
        city: document.getElementById('city').value,
        pinCode: document.getElementById('pinCode').value,
        district: document.getElementById('district').value,
        state: document.getElementById('state').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        paymentMethod: paymentMethod,
        books: cart // Include the cart items in the checkout details
    };

    if (paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') {
        checkoutDetails.cardNumber = document.getElementById('cardNumber').value;
        checkoutDetails.expiryDate = document.getElementById('expiryDate').value;
        checkoutDetails.cvv = document.getElementById('cvv').value;
    }

    // Save checkout details to localStorage
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(checkoutDetails);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear the cart from localStorage
    localStorage.removeItem('cart');

    // Show success message
    alert('Payment Successful!');

    // Redirect to home page
    window.location.href = 'index.html';
});