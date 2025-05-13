// script.js - Main application scripts

// Scroll animation for sections
const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

sections.forEach(section => {
  observer.observe(section);
});

// Floating decorative elements
const icons = ['fa-om', 'fa-lotus', 'fa-yin-yang', 'fa-peace', 'fa-hamsa', 'fa-spa'];
const colors = ['#FF9933', '#4B0082', '#D4AF37', '#E2725B', '#006666'];

function createFloatingIcon() {
  const icon = document.createElement('i');
  icon.className = `floating-icon fas ${icons[Math.floor(Math.random() * icons.length)]}`;
  icon.style.color = colors[Math.floor(Math.random() * colors.length)];
  icon.style.fontSize = `${Math.random() * 2 + 1}rem`;
  icon.style.left = `${Math.random() * 100}%`;
  icon.style.top = `${Math.random() * 100}%`;
  icon.style.opacity = Math.random() * 0.5 + 0.3;
  icon.style.animationDuration = `${Math.random() * 4 + 3}s`;
  document.body.appendChild(icon);

  // Remove icon after animation completes to prevent too many elements
  setTimeout(() => {
    icon.remove();
  }, 30000);
}

// Create initial floating icons
for (let i = 0; i < 10; i++) {
  setTimeout(createFloatingIcon, i * 3000);
}

// Initialize login status on page load
document.addEventListener('DOMContentLoaded', function() {
  updateLoginStatus();
});

// Add this to your script.js

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.getElementById('main-nav');
  
  if (hamburger && nav) {
    hamburger.addEventListener('click', function() {
      nav.classList.toggle('active');
      this.innerHTML = nav.classList.contains('active') ? 
        '<i class="fas fa-times"></i>' : 
        '<i class="fas fa-bars"></i>';
    });
  }
  
  // Close menu when clicking on a link (for single page navigation)
  const navLinks = document.querySelectorAll('#main-nav .nav-wrapper a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        nav.classList.remove('active');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  });
});


