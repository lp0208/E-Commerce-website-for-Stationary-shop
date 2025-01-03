let cart = [];
let cartCount = 0;

// Function to add a product to the cart
function addToCart(productName, price) {
    cart.push({ productName, price });
    cartCount++;
    updateCartDisplay();
}

// Function to update the cart display
function updateCartDisplay() {
    const cartItemsList = document.getElementById('cartItems');
    const totalAmountElement = document.getElementById('totalAmount');
    const cartCountElement = document.getElementById('cartCount');

    cartItemsList.innerHTML = ''; // Clear previous items
    let totalAmount = 0;

    cart.forEach((item, index) => {
        totalAmount += item.price;

        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${item.productName} - $${item.price.toFixed(2)}
            <button class="btn btn-danger btn-sm ms-2" onclick="removeFromCart(${index})">Remove</button>
        `;
        cartItemsList.appendChild(listItem);
    });

    // Update total amount and cart count
    totalAmountElement.textContent = totalAmount.toFixed(2);
    cartCountElement.textContent = cart.length;
}

// Function to remove an item from the cart
function removeFromCart(index) {
    cart.splice(index, 1);
    cartCount--;
    updateCartDisplay();
}

// Function to filter products based on search input
function filterProducts() {
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    const productCards = document.querySelectorAll('#products .card');

    productCards.forEach(card => {
        const productName = card.querySelector('.card-title').textContent.toLowerCase();
        card.parentElement.style.display = productName.includes(searchTerm) ? 'block' : 'none';
    });
}

// Function to handle search and redirect
function redirectToProductPage(event) {
    event.preventDefault(); // Prevent form submission
    const searchTerm = document.getElementById('searchBar').value.trim();
    if (searchTerm) {
        window.location.href = `#products?search=${encodeURIComponent(searchTerm)}`;
    }
}

// Function to handle search from URL
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    const searchTerm = urlParams.get('search');

    if (searchTerm) {
        document.getElementById('searchBar').value = searchTerm;
        filterProductsBySearchTerm(searchTerm.toLowerCase());
    }
});

function filterProductsBySearchTerm(searchTerm) {
    const productCards = document.querySelectorAll('#products .card');

    productCards.forEach(card => {
        const productName = card.querySelector('.card-title').textContent.toLowerCase();
        card.parentElement.style.display = productName.includes(searchTerm) ? 'block' : 'none';
    });
}

// Checkout functionality
document.getElementById('checkoutButton').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Calculate total amount
    const totalAmount = cart.reduce((total, item) => total + item.price, 0);

    // Show confirmation message in a modal
    const checkoutModal = document.getElementById('cartModal');
    const modalBody = checkoutModal.querySelector('.modal-body');
    modalBody.innerHTML = `
        <h3>Checkout</h3>
        <p>Your cart contains ${cart.length} items.</p>
        <p>Total: ₹${totalAmount.toFixed(2)}</p>
        <button class="btn btn-success" onclick="completeCheckout()">Complete Purchase</button>
        <button class="btn btn-secondary" onclick="cancelCheckout()">Cancel</button>
    `;

    const bootstrapModal = new bootstrap.Modal(checkoutModal);
    bootstrapModal.show();
});

// Function to complete checkout
function completeCheckout() {
    alert('Thank you for your purchase!');
    cart = [];
    cartCount = 0;
    updateCartDisplay();
    window.location.href = '#home'; // Redirect to home
}

// Function to cancel checkout
function cancelCheckout() {
    const checkoutModal = document.getElementById('cartModal');
    const bootstrapModal = bootstrap.Modal.getInstance(checkoutModal);
    bootstrapModal.hide();
}
