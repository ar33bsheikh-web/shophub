// Sample product data
const products = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        category: "Electronics",
        price: 79.99,
        originalPrice: 99.99,
        image: "Wireless Headphones.jpg",
        rating: 4.5,
        reviews: 128,
        badge: "Sale",
        description: "Premium quality wireless headphones with noise cancellation and 30-hour battery life."
    },
    {
        id: 2,
        name: "Smart Watch Pro",
        category: "Electronics",
        price: 249.99,
        originalPrice: null,
        image: "Smart Watch.jpg",
        rating: 4.8,
        reviews: 256,
        badge: "New",
        description: "Advanced fitness tracking, heart rate monitoring, and smartphone integration."
    },
    {
        id: 3,
        name: "Cotton T-Shirt",
        category: "Fashion",
        price: 24.99,
        originalPrice: 34.99,
        image: "T-Shirt.jpg",
        rating: 4.3,
        reviews: 89,
        badge: "Sale",
        description: "100% organic cotton t-shirt, comfortable and breathable for everyday wear."
    },
    {
        id: 4,
        name: "Running Shoes",
        category: "Sports",
        price: 89.99,
        originalPrice: null,
        image: "Shoes.jpg",
        rating: 4.6,
        reviews: 167,
        badge: null,
        description: "Lightweight running shoes with advanced cushioning technology."
    },
    {
        id: 5,
        name: "Coffee Maker Deluxe",
        category: "Home & Living",
        price: 149.99,
        originalPrice: 199.99,
        image: "Coffee maker.jpg",
        rating: 4.7,
        reviews: 203,
        badge: "Sale",
        description: "Programmable coffee maker with thermal carafe and multiple brew settings."
    },
    {
        id: 6,
        name: "Yoga Mat Premium",
        category: "Sports",
        price: 39.99,
        originalPrice: null,
        image: "Yoga Cat.jpg",
        rating: 4.4,
        reviews: 95,
        badge: "New",
        description: "Extra thick, non-slip yoga mat with carrying strap included."
    },
    {
        id: 7,
        name: "Laptop Backpack",
        category: "Accessories",
        price: 59.99,
        originalPrice: 79.99,
        image: "Laptop Backpack.jpg",
        rating: 4.5,
        reviews: 142,
        badge: "Sale",
        description: "Water-resistant laptop backpack with multiple compartments and USB charging port."
    },
    {
        id: 8,
        name: "Wireless Mouse",
        category: "Electronics",
        price: 29.99,
        originalPrice: null,
        image: "Wireless Mouse.jpg",
        rating: 4.2,
        reviews: 78,
        badge: null,
        description: "Ergonomic wireless mouse with precision tracking and long battery life."
    }
];

// Shopping cart
let cart = [];

// DOM elements
const featuredProductsContainer = document.getElementById('featuredProducts');
const newArrivalsContainer = document.getElementById('newArrivals');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');
const productModal = document.getElementById('productModal');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayProducts('featured');
    displayProducts('new');
    updateCart();
    setupEventListeners();
});

// Display products
function displayProducts(type) {
    const container = type === 'featured' ? featuredProductsContainer : newArrivalsContainer;
    const productsToShow = type === 'featured' ? products.slice(0, 4) : products.slice(4, 8);
    
    container.innerHTML = productsToShow.map(product => createProductCard(product)).join('');
}

// Create product card HTML
function createProductCard(product) {
    return `
        <div class="product-card" onclick="showProductDetails(${product.id})">
            <div class="product-image">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <div class="product-actions">
                    <div class="product-action" onclick="event.stopPropagation(); toggleWishlist(${product.id})">
                        <i class="far fa-heart"></i>
                    </div>
                    <div class="product-action" onclick="event.stopPropagation(); quickView(${product.id})">
                        <i class="far fa-eye"></i>
                    </div>
                </div>
                <i class="fas fa-image" style="font-size: 60px; color: #ddd;"></i>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">
                    <span class="price">$${product.price}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
                </div>
                <div class="product-rating">
                    <div class="stars">${generateStars(product.rating)}</div>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Generate star rating HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = fullStars + (halfStar ? 1 : 0); i < 5; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart();
    showNotification('Product added to cart!');
}

// Update cart display
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <i class="fas fa-image" style="font-size: 30px; color: #ddd; display: flex; align-items: center; justify-content: center; height: 100%;"></i>
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <div class="cart-item-remove" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-times"></i>
                </div>
            </div>
        `).join('');
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Show product details
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    const modalBody = productModal.querySelector('.modal-body');
    
        modalBody.innerHTML = `
        <div class="modal-image">
            <i class="fas fa-image" style="font-size: 100px; color: #ddd; display: flex; align-items: center; justify-content: center; height: 100%;"></i>
        </div>
        <div class="modal-info">
            <h2>${product.name}</h2>
            <div class="product-rating">
                <div class="stars">${generateStars(product.rating)}</div>
                <span class="rating-count">(${product.reviews} reviews)</span>
            </div>
            <div class="modal-price">$${product.price}</div>
            <p class="modal-description">${product.description}</p>
            <div class="modal-actions">
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="changeModalQuantity(-1)">-</button>
                    <span id="modalQuantity">1</span>
                    <button class="quantity-btn" onclick="changeModalQuantity(1)">+</button>
                </div>
                <button class="btn btn-primary" onclick="addToCartFromModal(${product.id})">Add to Cart</button>
                <button class="btn btn-secondary" onclick="toggleWishlist(${product.id})">
                    <i class="far fa-heart"></i> Add to Wishlist
                </button>
            </div>
        </div>
    `;
    
    productModal.style.display = 'block';
}

// Change modal quantity
let modalQuantity = 1;
function changeModalQuantity(change) {
    modalQuantity = Math.max(1, modalQuantity + change);
    document.getElementById('modalQuantity').textContent = modalQuantity;
}

// Add to cart from modal
function addToCartFromModal(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += modalQuantity;
    } else {
        cart.push({ ...product, quantity: modalQuantity });
    }
    
    updateCart();
    productModal.style.display = 'none';
    modalQuantity = 1;
    showNotification(`${modalQuantity} item(s) added to cart!`);
}

// Quick view
function quickView(productId) {
    showProductDetails(productId);
}

// Toggle wishlist
function toggleWishlist(productId) {
    // This would normally save to a wishlist
    showNotification('Added to wishlist!');
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--success-color);
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Setup event listeners
function setupEventListeners() {
    // Cart toggle
    document.querySelector('.cart-toggle').addEventListener('click', () => {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    });
    
    // Close cart
    document.querySelector('.close-cart').addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
    
    function closeCart() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    }
    
    // Close modal
    document.querySelector('.close-modal').addEventListener('click', () => {
        productModal.style.display = 'none';
        modalQuantity = 1;
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === productModal) {
            productModal.style.display = 'none';
            modalQuantity = 1;
        }
    });
    
    // Newsletter form
    document.querySelector('.newsletter-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        showNotification('Successfully subscribed to newsletter!');
        e.target.reset();
    });
    
    // Mobile menu toggle
    document.querySelector('.mobile-menu-toggle').addEventListener('click', () => {
        const navMenu = document.querySelector('.nav-menu');
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.right = '0';
        navMenu.style.backgroundColor = 'white';
        navMenu.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    function performSearch() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            showNotification(`Searching for "${searchTerm}"...`);
            // Here you would implement actual search functionality
        }
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification {
        animation: slideIn 0.3s ease;
    }
`;
document.head.appendChild(style);

// Simulate loading more products on scroll
let loading = false;
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && !loading) {
        loading = true;
        // Here you would load more products
        setTimeout(() => {
            loading = false;
        }, 1000);
    }
});

// Category filter simulation
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', (e) => {
        e.preventDefault();
        const category = card.querySelector('h3').textContent;
        showNotification(`Filtering by ${category}...`);
        // Here you would implement category filtering
    });
});

// Initialize product image placeholders with random colors
document.addEventListener('DOMContentLoaded', () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
    document.querySelectorAll('.product-image').forEach((img, index) => {
        const color = colors[index % colors.length];
        img.style.background = `linear-gradient(135deg, ${color}22 0%, ${color}44 100%)`;
    });
});