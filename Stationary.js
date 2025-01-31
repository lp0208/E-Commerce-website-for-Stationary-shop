// Cart array to store items
let cart = [];
let orders = [];

// Function to display products
function displayProducts() {
    let productContainer = document.getElementById("productList");
    productContainer.innerHTML = "";

    products.forEach((product, index) => {
        let productDiv = document.createElement("div");
        productDiv.className = "product";
        productDiv.dataset.name = product.name.toLowerCase();

        productDiv.innerHTML = `
            <h3>${product.name}</h3>
            <p>₹${product.price.toFixed(2)}</p>
            <button class="btn btn-primary" onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
            <button class="btn btn-success" onclick="buyNow('${product.name}', ${product.price})">Buy Now</button>
        `;

        productContainer.appendChild(productDiv);
    });
}

// Function to search products
function searchProducts() {
    let searchInput = document.getElementById("searchInput").value.toLowerCase();
    let productItems = document.querySelectorAll(".product");

    productItems.forEach(product => {
        let productName = product.dataset.name;
        product.style.display = productName.includes(searchInput) ? "block" : "none";
    });
}

// Function to add items to the cart
function addToCart(productName, price) {
    cart.push({ name: productName, price: price });
    updateCartDisplay();
}

// Function to update cart display
function updateCartDisplay() {
    let cartItems = document.getElementById("cartItems");
    let cartTotal = document.getElementById("cartTotal");
    let cartCount = document.getElementById("cartCount");

    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        let li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `${item.name} - ₹${item.price.toFixed(2)}
            <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Remove</button>`;
        cartItems.appendChild(li);
    });

    cartTotal.innerText = `Total: ₹${total.toFixed(2)}`;
    cartCount.innerText = cart.length;
}

// Function to remove an item from the cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

// Function to proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    

    document.getElementById("paymentPage").style.display = "block";
    document.querySelector("main").style.display = "none";

    let paymentDetails = document.getElementById("paymentDetails");
    paymentDetails.innerHTML = "";

    cart.forEach(item => {
        let li = document.createElement("li");
        li.className = "list-group-item";
        li.innerText = `${item.name} - ₹${item.price.toFixed(2)}`;
        paymentDetails.appendChild(li);
        
    });

    generateUPIQR();
}

// Function to update payment method fields
function updatePaymentFields() {
    let method = document.getElementById("paymentMethod").value;
    document.getElementById("cardPaymentFields").style.display = method === "card" ? "block" : "none";
    document.getElementById("upiPaymentFields").style.display = method === "upi" ? "block" : "none";
    document.getElementById("netBankingFields").style.display = method === "netBanking" ? "block" : "none";

    if (method === "upi") {
        generateUPIQR();
    }
}

// Function to generate UPI QR Code
function generateUPIQR() {
    let upiId = "yourupi@bank"; // Replace with actual UPI ID
    let totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

    let upiLink = `upi://pay?pa=${upiId}&pn=YourName&am=${totalAmount.toFixed(2)}&cu=INR`;

    let qrContainer = document.getElementById("upiQRContainer");
    qrContainer.innerHTML = "";

    let qrImg = document.createElement("img");
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;
    qrImg.alt = "UPI QR Code";

    qrContainer.appendChild(qrImg);
}

// Function to handle payment submission
document.getElementById("paymentForm").addEventListener("submit", function(event) {
    event.preventDefault();

    alert("Payment Successful! Your order has been placed.");
    orders.push(...cart);
    cart = [];
    updateCartDisplay();
    updateOrdersDisplay();

    document.getElementById("paymentPage").style.display = "none";
    document.querySelector("main").style.display = "block";
});

// Function to update order history
function updateOrdersDisplay() {
    let ordersList = document.getElementById("ordersList");
    ordersList.innerHTML = "";

    if (orders.length === 0) {
        ordersList.innerHTML = "<p>No orders placed yet.</p>";
        return;
    }

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.price;
        let li = document.createElement("li");
        li.className = "list-group-item";
        li.innerText = `${order.name} - ₹${order.price.toFixed(2)}`;
        ordersList.appendChild(li);
    });

    // Add total amount at the end of the order list
    let totalLi = document.createElement("li");
    totalLi.className = "list-group-item list-group-item-info font-weight-bold";
    totalLi.innerText = `Total Amount: ₹${totalAmount.toFixed(2)}`;
    ordersList.appendChild(totalLi);
}
    


// Function to buy an item instantly
function buyNow(productName, price) {
    cart = [{ name: productName, price: price }];
    proceedToCheckout();
}

// Function to go back to product section
function goBackToProducts() {
    document.getElementById("paymentPage").style.display = "none";
    document.querySelector("main").style.display = "block";
}

// Load products on page load
document.addEventListener("DOMContentLoaded", displayProducts);
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

