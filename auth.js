// auth.js - Authentication handling with localStorage

// Check authentication status on page load
document.addEventListener('DOMContentLoaded', function() {
  // Initialize login status
  updateLoginStatus();

  // Prevent accessing login/signup pages when already logged in
  if (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html')) {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      window.location.href = 'index.html';
    }
  }

  // Check if trying to access AR Tales without login
  if (window.location.pathname.includes('AR Tales.html') && localStorage.getItem('isLoggedIn') !== 'true') {
    alert('Please login to access AR Tales');
    window.location.href = 'login.html';
    return;
  }

  // Login form handler
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Signup form handler
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }

  // Handle AR Tales link click from any page
  const arTalesLink = document.getElementById('ar-tales-link');
  if (arTalesLink) {
    arTalesLink.addEventListener('click', function(e) {
      if (localStorage.getItem('isLoggedIn') !== 'true') {
        e.preventDefault();
        alert('Please login to access AR Tales');
        window.location.href = 'login.html';
      }
    });
  }
});

// Handle login form submission
function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errorElement = document.getElementById('auth-error');
  
  // Simple validation
  if (!email || !password) {
    showError(errorElement, 'Please fill in all fields');
    return;
  }
  
  // Check credentials
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Store login status
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Redirect to index.html
    window.location.href = 'dashboard.html';
  } else {
    showError(errorElement, 'Invalid email or password');
  }
}

// Handle signup form submission
function handleSignup(e) {
  e.preventDefault();
  
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirm = document.getElementById('signup-confirm').value;
  const errorElement = document.getElementById('auth-error');
  
  // Validation
  if (password !== confirm) {
    showError(errorElement, 'Passwords do not match');
    return;
  }
  
  if (password.length < 8) {
    showError(errorElement, 'Password must be at least 8 characters');
    return;
  }
  
  // Check if user already exists
  const users = JSON.parse(localStorage.getItem('users')) || [];
  if (users.some(u => u.email === email)) {
    showError(errorElement, 'Email already registered');
    return;
  }
  
  // Create new user
  const newUser = {
    name,
    email,
    password, // Note: In production, never store plain text passwords - use proper hashing
    region: document.getElementById('region').value,
    interest: document.getElementById('interest').value,
    joined: new Date().toISOString(),
    dharmaPoints: 0 // Initialize Dharma Points
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  // Auto-login the new user
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  
  // Redirect to index.html
  window.location.href = 'index.html';
}

// Handle logout functionality
function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}

// Update UI based on login status
function updateLoginStatus() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const loginLink = document.getElementById('login-logout-link');
  const userInfo = document.getElementById('user-info');
  const currentPath = window.location.pathname;

  if (loginLink) {
    if (isLoggedIn) {
      // Only show Dashboard button on index.html or AR Tales.html
      if (currentPath.includes('index.html') || currentPath.includes('ARTales.html')) {
        loginLink.innerHTML = '<i class="fas fa-tachometer-alt"></i> Dashboard';
        loginLink.href = 'dashboard.html';
        loginLink.onclick = null; // Clear logout behavior
      } else {
        // Default to logout on other pages
        loginLink.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        loginLink.href = '#';
        loginLink.onclick = logout;
      }
    } else {
      loginLink.innerHTML = '<i class="fas fa-user"></i> Login';
      loginLink.href = 'login.html';
      loginLink.onclick = null;
    }
  }

  // Update user info if logged in
  if (isLoggedIn && userInfo) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    userInfo.textContent = `Welcome, ${user.name}`;
    userInfo.style.display = 'block';
  } else if (userInfo) {
    userInfo.style.display = 'none';
  }
}


// Display error messages
function showError(element, message) {
  if (element) {
    element.textContent = message;
    element.style.display = 'block';
    setTimeout(() => {
      element.style.display = 'none';
    }, 5000);
  }
}

// Get current user data
function getCurrentUser() {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}

// Update user data in storage
function updateUserData(updatedUser) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const index = users.findIndex(u => u.email === updatedUser.email);
  
  if (index !== -1) {
    users[index] = updatedUser;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    return true;
  }
  return false;
}

// Add Dharma Points to user
function addDharmaPoints(points) {
  const user = getCurrentUser();
  if (user) {
    user.dharmaPoints = (user.dharmaPoints || 0) + points;
    updateUserData(user);
  }
}

// Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem('isLoggedIn') === 'true';
}