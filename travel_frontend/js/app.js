const API_BASE_URL = 'http://localhost:8080/api';
let currentUser = null;
let currentDestinationId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    loadTopDestinations();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('addDestinationForm').addEventListener('submit', handleAddDestination);
    document.getElementById('reviewForm').addEventListener('submit', handleAddReview);
}

// Authentication functions
function checkAuthStatus() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        updateAuthUI();
    }
}

function updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const welcomeUser = document.getElementById('welcomeUser');
    const addDestinationBtn = document.getElementById('addDestinationBtn');
    
    if (currentUser) {
        authButtons.style.display = 'none';
        userMenu.style.display = 'flex';
        welcomeUser.textContent = `Welcome, ${currentUser.username}`;
        
        if (currentUser.role === 'ADMIN') {
            addDestinationBtn.style.display = 'block';
        }
    } else {
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
        addDestinationBtn.style.display = 'none';
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        if (response.ok) {
            const user = await response.json();
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            updateAuthUI();
            showAlert('Login successful!', 'success');
            showHome();
        } else {
            showAlert('Invalid credentials!', 'error');
        }
    } catch (error) {
        showAlert('Login failed!', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
        });
        
        if (response.ok) {
            showAlert('Registration successful! Please login.', 'success');
            showLogin();
        } else {
            showAlert('Registration failed!', 'error');
        }
    } catch (error) {
        showAlert('Registration failed!', 'error');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    showHome();
    showAlert('Logged out successfully!', 'success');
}

// Navigation functions
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

function showHome() {
    showSection('homeSection');
    loadTopDestinations();
}

function showLogin() {
    showSection('loginSection');
}

function showRegister() {
    showSection('registerSection');
}

function showDestinations() {
    showSection('destinationsSection');
    loadAllDestinations();
}

function showReviews() {
    showSection('reviewsSection');
    loadAllReviews();
}

function showAddDestination() {
    showSection('addDestinationSection');
}

// Destination functions
async function loadTopDestinations() {
    try {
        const response = await fetch(`${API_BASE_URL}/destinations/top-rated`);
        const destinations = await response.json();
        displayDestinations(destinations, 'topDestinations');
    } catch (error) {
        console.error('Error loading top destinations:', error);
    }
}

async function loadAllDestinations() {
    try {
        const response = await fetch(`${API_BASE_URL}/destinations`);
        const destinations = await response.json();
        displayDestinations(destinations, 'destinationsList');
    } catch (error) {
        console.error('Error loading destinations:', error);
    }
}

function displayDestinations(destinations, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    destinations.forEach(destination => {
        const card = createDestinationCard(destination);
        container.appendChild(card);
    });
}

function createDestinationCard(destination) {
    const card = document.createElement('div');
    card.className = 'destination-card';
    card.onclick = () => showDestinationDetail(destination.id);
    
    card.innerHTML = `
        <img src="${destination.imageUrl || 'https://via.placeholder.com/300x200'}" alt="${destination.name}">
        <div class="destination-card-content">
            <h3>${destination.name}</h3>
            <p><strong>${destination.country}</strong></p>
            <p>${destination.description}</p>
            <div class="rating">
                <span>⭐ ${destination.averageRating.toFixed(1)}</span>
                <span>(${destination.reviewCount} reviews)</span>
            </div>
        </div>
    `;
    
    return card;
}

async function handleAddDestination(e) {
    e.preventDefault();
    
    const destination = {
        name: document.getElementById('destName').value,
        country: document.getElementById('destCountry').value,
        description: document.getElementById('destDescription').value,
        imageUrl: document.getElementById('destImageUrl').value,
        category: document.getElementById('destCategory').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/destinations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(destination)
        });
        
        if (response.ok) {
            showAlert('Destination added successfully!', 'success');
            document.getElementById('addDestinationForm').reset();
            showDestinations();
        } else {
            showAlert('Failed to add destination!', 'error');
        }
    } catch (error) {
        showAlert('Failed to add destination!', 'error');
    }
}

async function searchDestinations() {
    const query = document.getElementById('searchInput').value;
    if (!query) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/destinations/search?query=${encodeURIComponent(query)}`);
        const destinations = await response.json();
        displayDestinations(destinations, 'topDestinations');
    } catch (error) {
        console.error('Error searching destinations:', error);
    }
}

// Destination detail functions
async function showDestinationDetail(destinationId) {
    currentDestinationId = destinationId;
    showSection('destinationDetailSection');
    
    try {
        const response = await fetch(`${API_BASE_URL}/destinations/${destinationId}`);
        const destination = await response.json();
        displayDestinationDetail(destination);
        loadDestinationReviews(destinationId);
        
        const reviewFormContainer = document.getElementById('reviewFormContainer');
        if (currentUser) {
            reviewFormContainer.style.display = 'block';
        } else {
            reviewFormContainer.style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading destination detail:', error);
    }
}

function displayDestinationDetail(destination) {
    const container = document.getElementById('destinationDetail');
    container.innerHTML = `
        <div class="destination-detail">
            <img src="${destination.imageUrl || 'https://via.placeholder.com/800x400'}" alt="${destination.name}" style="width: 100%; height: 400px; object-fit: cover; border-radius: 10px;">
            <h1>${destination.name}</h1>
            <p><strong>Country:</strong> ${destination.country}</p>
            <p><strong>Category:</strong> ${destination.category || 'Not specified'}</p>
            <p>${destination.description}</p>
            <div class="rating">
                <span>⭐ ${destination.averageRating.toFixed(1)}</span>
                <span>(${destination.reviewCount} reviews)</span>
            </div>
        </div>
    `;
}

// Review functions
async function loadDestinationReviews(destinationId) {
    try {
        const response = await fetch(`${API_BASE_URL}/reviews/destination/${destinationId}`);
        const reviews = await response.json();
        displayReviews(reviews, 'destinationReviews');
    } catch (error) {
        console.error('Error loading reviews:', error);
    }
}

async function loadAllReviews() {
    try {
        const response = await fetch(`${API_BASE_URL}/reviews`);
        const reviews = await response.json();
        displayReviews(reviews, 'reviewsList');
    } catch (error) {
        console.error('Error loading reviews:', error);
    }
}

function displayReviews(reviews, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    if (reviews.length === 0) {
        container.innerHTML = '<p>No reviews yet.</p>';
        return;
    }
    
    reviews.forEach(review => {
        const reviewCard = createReviewCard(review);
        container.appendChild(reviewCard);
    });
}

function createReviewCard(review) {
    const card = document.createElement('div');
    card.className = 'review-card';
    
    card.innerHTML = `
        <div class="review-header">
            <strong>${review.username || 'Anonymous'}</strong>
            <div class="review-rating">
                ${'⭐'.repeat(review.rating)}
            </div>
        </div>
        <p>${review.comment}</p>
        ${review.destinationName ? `<p><em>Destination: ${review.destinationName}</em></p>` : ''}
    `;
    
    return card;
}

async function handleAddReview(e) {
    e.preventDefault();
    
    if (!currentUser || !currentDestinationId) {
        showAlert('Please login to submit a review!', 'error');
        return;
    }
    
    const review = {
        rating: parseInt(document.getElementById('reviewRating').value),
        comment: document.getElementById('reviewComment').value,
        userId: currentUser.id,
        destinationId: currentDestinationId,
        username: currentUser.username
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(review)
        });
        
        if (response.ok) {
            showAlert('Review submitted successfully!', 'success');
            document.getElementById('reviewForm').reset();
            loadDestinationReviews(currentDestinationId);
            // Reload destination to update rating
            showDestinationDetail(currentDestinationId);
        } else {
            showAlert('Failed to submit review!', 'error');
        }
    } catch (error) {
        showAlert('Failed to submit review!', 'error');
    }
}

// Utility functions
function showAlert(message, type) {
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    document.body.insertBefore(alert, document.body.firstChild);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}