// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

// ==================== REVIEWS SYSTEM ====================

// Star Rating System
const starRating = document.getElementById('starRating');
const ratingValue = document.getElementById('ratingValue');

if (starRating) {
    const stars = starRating.querySelectorAll('i');
    
    stars.forEach(star => {
        // Hover effect
        star.addEventListener('mouseenter', () => {
            const rating = star.dataset.rating;
            highlightStars(rating);
        });
        
        // Click to select
        star.addEventListener('click', () => {
            const rating = star.dataset.rating;
            ratingValue.value = rating;
            setActiveStars(rating);
        });
    });
    
    // Reset on mouse leave
    starRating.addEventListener('mouseleave', () => {
        const currentRating = ratingValue.value;
        if (currentRating > 0) {
            setActiveStars(currentRating);
        } else {
            resetStars();
        }
    });
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('#starRating i');
    stars.forEach(star => {
        star.classList.remove('active', 'hovered');
        if (star.dataset.rating <= rating) {
            star.classList.add('hovered');
        }
    });
}

function setActiveStars(rating) {
    const stars = document.querySelectorAll('#starRating i');
    stars.forEach(star => {
        star.classList.remove('hovered');
        if (star.dataset.rating <= rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function resetStars() {
    const stars = document.querySelectorAll('#starRating i');
    stars.forEach(star => {
        star.classList.remove('active', 'hovered');
    });
}

// Review Form Submission
const reviewForm = document.getElementById('reviewForm');

if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('reviewName').value.trim();
        const rating = document.getElementById('ratingValue').value;
        const text = document.getElementById('reviewText').value.trim();
        
        if (rating === '0') {
            alert('Proszę wybrać ocenę (gwiazdki)!');
            return;
        }
        
        const review = {
            id: Date.now(),
            name: name,
            rating: parseInt(rating),
            text: text,
            date: new Date().toLocaleDateString('pl-PL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };
        
        saveReview(review);
        displayReviews();
        
        // Reset form
        reviewForm.reset();
        ratingValue.value = '0';
        resetStars();
        
        alert('Dziękujemy za opinię!');
    });
}

// Save review to localStorage
function saveReview(review) {
    let reviews = getReviews();
    reviews.unshift(review); // Add to beginning
    localStorage.setItem('bdStarKebabReviews', JSON.stringify(reviews));
}

// Get reviews from localStorage
function getReviews() {
    const reviews = localStorage.getItem('bdStarKebabReviews');
    return reviews ? JSON.parse(reviews) : [];
}

// Display reviews
function displayReviews() {
    const reviewsList = document.getElementById('reviewsList');
    if (!reviewsList) return;
    
    const reviews = getReviews();
    
    if (reviews.length === 0) {
        reviewsList.innerHTML = `
            <div class="no-reviews">
                <i class="fas fa-comments"></i>
                <p>Brak opinii. Bądź pierwszy i podziel się swoją opinią!</p>
            </div>
        `;
        return;
    }
    
    reviewsList.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div class="review-author">
                    <div class="review-avatar">${review.name.charAt(0).toUpperCase()}</div>
                    <div class="review-author-info">
                        <h4>${escapeHtml(review.name)}</h4>
                        <span class="review-date">${review.date}</span>
                    </div>
                </div>
                <div class="review-stars">
                    ${generateStars(review.rating)}
                </div>
            </div>
            <p class="review-text">${escapeHtml(review.text)}</p>
        </div>
    `).join('');
}

// Generate star HTML
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Load reviews on page load
document.addEventListener('DOMContentLoaded', () => {
    displayReviews();
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(13, 13, 13, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(13, 13, 13, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animation to elements
document.querySelectorAll('.info-card, .feature, .menu-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
