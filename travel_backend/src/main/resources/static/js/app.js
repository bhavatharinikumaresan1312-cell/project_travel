// Global variables
let currentUser = null;
let selectedRating = 0;
let selectedDestinationId = null;

// DOM elements
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const reviewModal = document.getElementById('reviewModal');
const destinationsGrid = document.getElementById('destinationsGrid');
const reviewsGrid = document.getElementById('reviewsGrid');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadDestinations();
    loadReviews();
    setupEventListeners();
});

// Event listeners
function setupEventListeners() {
    // Modal controls
    document.getElementById('loginBtn').addEventListener('click', () => showModal('loginModal'));
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('closeModal').addEventListener('click', () => hideModal('loginModal'));
    document.getElementById('closeRegisterModal').addEventListener('click', () => hideModal('registerModal'));
    document.getElementById('closeReviewModal').addEventListener('click', () => hideModal('reviewModal'));
    document.getElementById('showRegister').addEventListener('click', () => {
        hideModal('loginModal');
        showModal('registerModal');
    });

    // Forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('reviewForm').addEventListener('submit', handleReviewSubmit);
    document.getElementById('searchBtn').addEventListener('click', handleSearch);
    document.getElementById('categoryFilter').addEventListener('change', handleSearch);

    // Star rating
    document.querySelectorAll('#starRating i').forEach(star => {
        star.addEventListener('click', handleStarClick);
        star.addEventListener('mouseover', handleStarHover);
    });
}

// Modal functions
function showModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// API functions
async function loadDestinations() {
    destinationsGrid.innerHTML = '<div class="col-span-full flex justify-center py-12"><div class="spinner"></div></div>';
    try {
        const response = await fetch('/api/destinations');
        const destinations = await response.json();
        displayDestinations(destinations);
    } catch (error) {
        console.error('Error loading destinations:', error);
        destinationsGrid.innerHTML = '<div class="col-span-full text-center py-12"><p class="text-red-500">Failed to load destinations</p></div>';
    }
}

async function loadReviews() {
    try {
        const response = await fetch('/api/reviews');
        const reviews = await response.json();
        displayReviews(reviews.slice(0, 6)); // Show latest 6 reviews
    } catch (error) {
        console.error('Error loading reviews:', error);
    }
}

async function handleSearch() {
    const query = document.getElementById('searchInput').value;
    const category = document.getElementById('categoryFilter').value;
    
    try {
        let url = '/api/destinations';
        
        if (category && query) {
            url = `/api/destinations/category/${encodeURIComponent(category)}`;
            const response = await fetch(url);
            let destinations = await response.json();
            destinations = destinations.filter(dest => 
                dest.name.toLowerCase().includes(query.toLowerCase()) ||
                dest.country.toLowerCase().includes(query.toLowerCase())
            );
            displayDestinations(destinations);
        } else if (category) {
            url = `/api/destinations/category/${encodeURIComponent(category)}`;
            const response = await fetch(url);
            const destinations = await response.json();
            displayDestinations(destinations);
        } else if (query) {
            url = `/api/destinations/search?query=${encodeURIComponent(query)}`;
            const response = await fetch(url);
            const destinations = await response.json();
            displayDestinations(destinations);
        } else {
            loadDestinations();
        }
    } catch (error) {
        console.error('Error searching destinations:', error);
    }
}

// Display functions
function displayDestinations(destinations) {
    if (destinations.length === 0) {
        destinationsGrid.innerHTML = '<div class="col-span-full text-center py-12"><p class="text-gray-500 text-lg">No destinations found</p></div>';
        return;
    }
    
    destinationsGrid.innerHTML = destinations.map((dest, index) => {
        const safeName = escapeHtml(dest.name || '');
        const safeCountry = escapeHtml(dest.country || '');
        const safeDescription = escapeHtml(dest.description || '');
        const safeCategory = escapeHtml(dest.category || '');
        const safeImageUrl = escapeHtml(dest.imageUrl || getDefaultImage(dest.name));
        
        return `
        <div class="bg-white rounded-xl shadow-lg overflow-hidden card-hover fade-in" style="animation-delay: ${index * 0.1}s">
            <div class="h-48 relative overflow-hidden">
                <img src="${safeImageUrl}" 
                     alt="${safeName}" 
                     class="w-full h-full object-cover"
                     onerror="this.src='${getDefaultImage(dest.name)}'; this.onerror=null;">
                <div class="absolute inset-0 bg-black bg-opacity-30"></div>
                <div class="absolute bottom-4 left-4 text-white">
                    <h3 class="text-xl font-bold">${safeName}</h3>
                    <p class="text-sm opacity-90">${safeCountry}</p>
                </div>
            </div>
            <div class="p-6">
                <p class="text-gray-600 mb-4">${safeDescription}</p>
                <div class="flex justify-between items-center mb-4">
                    <div class="flex items-center">
                        ${generateStars(dest.averageRating || 0)}
                        <span class="ml-2 text-gray-600">(${dest.reviewCount || 0})</span>
                    </div>
                    <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">${safeCategory}</span>
                </div>
                <div class="space-y-2 mb-4 text-sm">
                    <div class="flex items-center text-gray-600">
                        <i class="fas fa-calendar-alt mr-2 text-blue-500"></i>
                        <span class="font-medium">Best Time:</span>
                        <span class="ml-1">${escapeHtml(dest.bestTimeToVisit || 'Year-round')}</span>
                    </div>
                    <div class="flex items-center text-gray-600">
                        <i class="fas fa-clock mr-2 text-green-500"></i>
                        <span class="font-medium">Duration:</span>
                        <span class="ml-1">${escapeHtml(dest.duration || 'Flexible')}</span>
                    </div>
                    <div class="flex items-center text-gray-600">
                        <i class="fas fa-dollar-sign mr-2 text-yellow-500"></i>
                        <span class="font-medium">Budget:</span>
                        <span class="ml-1">${escapeHtml(dest.budget || 'Varies')}</span>
                    </div>
                </div>
                <button onclick="openReviewModal(${dest.id})" class="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-600 transition">
                    <i class="fas fa-plus mr-2"></i>Add Review
                </button>
            </div>
        </div>`;
    }).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function displayReviews(reviews) {
    reviewsGrid.innerHTML = reviews.map(review => {
        const safeUsername = escapeHtml(review.username || '');
        const safeDestinationName = escapeHtml(review.destinationName || '');
        const safeComment = escapeHtml(review.comment || '');
        
        return `
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div class="flex items-center mb-3">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    ${safeUsername.charAt(0).toUpperCase()}
                </div>
                <div class="ml-3">
                    <h4 class="font-semibold text-gray-800">${safeUsername}</h4>
                    <p class="text-lg font-bold text-blue-600">${safeDestinationName}</p>
                </div>
            </div>
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center">
                    ${generateStars(review.rating)}
                </div>
                <span class="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                    📍 ${safeDestinationName}
                </span>
            </div>
            <p class="text-gray-700">${safeComment}</p>
        </div>`;
    }).join('');
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="fas fa-star ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}"></i>`;
    }
    return stars;
}

// Authentication functions
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const user = await response.json();
            currentUser = user;
            updateAuthUI();
            hideModal('loginModal');
            showNotification('Login successful!', 'success');
        } else {
            showNotification('Invalid credentials', 'error');
        }
    } catch (error) {
        showNotification('Login failed', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        if (response.ok) {
            hideModal('registerModal');
            showNotification('Registration successful! Please login.', 'success');
        } else {
            showNotification('Registration failed', 'error');
        }
    } catch (error) {
        showNotification('Registration failed', 'error');
    }
}

// Review functions
function openReviewModal(destinationId) {
    if (!currentUser) {
        showModal('loginModal');
        return;
    }
    selectedDestinationId = destinationId;
    showModal('reviewModal');
}

function handleStarClick(e) {
    selectedRating = parseInt(e.target.dataset.rating);
    updateStarDisplay();
}

function handleStarHover(e) {
    const rating = parseInt(e.target.dataset.rating);
    document.querySelectorAll('#starRating i').forEach((star, index) => {
        star.classList.toggle('text-yellow-400', index < rating);
        star.classList.toggle('text-gray-300', index >= rating);
    });
}

function updateStarDisplay() {
    document.querySelectorAll('#starRating i').forEach((star, index) => {
        star.classList.toggle('text-yellow-400', index < selectedRating);
        star.classList.toggle('text-gray-300', index >= selectedRating);
    });
}

async function handleReviewSubmit(e) {
    e.preventDefault();
    if (!selectedRating) {
        showNotification('Please select a rating', 'error');
        return;
    }

    const comment = document.getElementById('reviewComment').value;

    try {
        const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                rating: selectedRating,
                comment,
                userId: currentUser.id,
                destinationId: selectedDestinationId,
                username: currentUser.username
            })
        });

        if (response.ok) {
            hideModal('reviewModal');
            showNotification('Review submitted successfully!', 'success');
            loadReviews();
            loadDestinations();
            // Reset form
            selectedRating = 0;
            document.getElementById('reviewComment').value = '';
            updateStarDisplay();
        } else {
            showNotification('Failed to submit review', 'error');
        }
    } catch (error) {
        showNotification('Failed to submit review', 'error');
    }
}

// Helper function for default images
function getDefaultImage(destinationName) {
    const imageMap = {
        'Paris': 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=400&h=300&fit=crop',
        'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
        'Bali': 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop',
        'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
        'Rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop',
        'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop',
        'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop',
        'Barcelona': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop',
        'Sydney': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        'Santorini': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop',
        'Maldives': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        'Iceland': 'https://images.unsplash.com/photo-1539066033332-e2c6c9b5b5b5?w=400&h=300&fit=crop'
    };
    return imageMap[destinationName] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop';
}

// Authentication UI functions
function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const userSection = document.getElementById('userSection');
    const welcomeMsg = document.getElementById('welcomeMsg');
    
    if (currentUser) {
        loginBtn.classList.add('hidden');
        userSection.classList.remove('hidden');
        userSection.classList.add('flex');
        welcomeMsg.textContent = `Welcome, ${currentUser.username}!`;
    } else {
        loginBtn.classList.remove('hidden');
        userSection.classList.add('hidden');
        userSection.classList.remove('flex');
    }
}

function handleLogout() {
    currentUser = null;
    updateAuthUI();
    showNotification('Logged out successfully!', 'success');
}

// Utility functions
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}