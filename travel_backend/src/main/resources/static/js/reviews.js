let currentUser = null;
let reviewToDelete = null;

document.addEventListener('DOMContentLoaded', function() {
    loadReviews();
    setupEventListeners();
    updateAuthUI();
});

function setupEventListeners() {
    document.getElementById('confirmDelete').addEventListener('click', confirmDeleteReview);
    document.getElementById('cancelDelete').addEventListener('click', () => hideModal('deleteModal'));
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

function showModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

async function loadReviews() {
    const grid = document.getElementById('reviewsGrid');
    grid.innerHTML = '<div class="col-span-full flex justify-center py-12"><div class="spinner"></div></div>';
    
    try {
        const response = await fetch('/api/reviews');
        const reviews = await response.json();
        displayReviews(reviews);
    } catch (error) {
        grid.innerHTML = '<div class="col-span-full text-center py-12"><p class="text-red-500">Failed to load reviews</p></div>';
    }
}

function displayReviews(reviews) {
    const grid = document.getElementById('reviewsGrid');
    
    if (reviews.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center py-12"><p class="text-gray-500 text-lg">No reviews found</p></div>';
        return;
    }
    
    grid.innerHTML = reviews.map((review, index) => {
        const safeUsername = escapeHtml(review.username || '');
        const safeDestinationName = escapeHtml(review.destinationName || '');
        const safeComment = escapeHtml(review.comment || '');
        
        return `
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow fade-in" style="animation-delay: ${index * 0.1}s">
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        ${safeUsername.charAt(0).toUpperCase()}
                    </div>
                    <div class="ml-3">
                        <h4 class="font-semibold text-gray-800">${safeUsername}</h4>
                        <p class="text-lg font-bold text-blue-600">${safeDestinationName}</p>
                    </div>
                </div>
                <button onclick="deleteReview(${review.id})" class="text-red-500 hover:text-red-700 transition">
                    <i class="fas fa-trash"></i>
                </button>
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

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="fas fa-star ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}"></i>`;
    }
    return stars;
}

function deleteReview(reviewId) {
    reviewToDelete = reviewId;
    showModal('deleteModal');
}

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

async function confirmDeleteReview() {
    if (!reviewToDelete) return;
    
    try {
        const response = await fetch(`/api/reviews/${reviewToDelete}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            hideModal('deleteModal');
            showNotification('Review deleted successfully!', 'success');
            loadReviews();
            reviewToDelete = null;
        } else {
            showNotification('Failed to delete review', 'error');
        }
    } catch (error) {
        showNotification('Failed to delete review', 'error');
    }
}