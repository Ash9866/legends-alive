// dashboard.js - Dashboard specific functionality with mobile navigation fixes

// Mobile menu functionality
function setupMobileMenu() {
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
  
  // Close menu when clicking on a link
  const navLinks = document.querySelectorAll('#main-nav .nav-wrapper a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        nav.classList.remove('active');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in, if not redirect to login
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
    return;
  }

  // Initialize mobile menu
  setupMobileMenu();

  // Load user data
  loadUserData();
  
  // Initialize dashboard components
  initDashboard();
  
  // Set up event listeners
  setupDashboardEvents();

  // Initialize camera check
  if (localStorage.getItem('cameraPermissionGranted')) {
    enableARFeatures();
  } else {
    setTimeout(() => {
      showModal();
      checkCameraCompatibility();
    }, 1000);
  }
  
  // Set up modal events
  document.getElementById('requestCameraBtn')?.addEventListener('click', requestCameraPermission);
  document.querySelector('.close-modal')?.addEventListener('click', closeModal);
  
  // Close modal when clicking outside
  window.addEventListener('click', (event) => {
    if (event.target === document.getElementById('cameraModal')) {
      closeModal();
    }
  });
  
  // Disable AR features initially if no permission
  if (!localStorage.getItem('cameraPermissionGranted')) {
    const arButtons = document.querySelectorAll('[data-requires-camera]');
    arButtons.forEach(button => {
      button.disabled = true;
      button.classList.add('disabled-feature');
    });
  }
});

function loadUserData() {
  const user = getCurrentUser();
  if (user) {
    // Update user greeting
    document.getElementById('user-greeting').textContent = user.name.split(' ')[0];
    
    // Update stats
    document.getElementById('dharma-points').textContent = user.dharmaPoints || 0;
    document.getElementById('stories-explored').textContent = user.storiesExplored || 0;
    document.getElementById('achievements').textContent = user.achievements ? user.achievements.length : 0;
    
    // Update user info in header
    document.getElementById('user-info').textContent = `Welcome, ${user.name}`;
    document.getElementById('user-info').style.display = 'block';
  }
}

function initDashboard() {
  // Load timeline
  populateTimeline();
  
  // Load user roadmap
  populateRoadmap();
  
  // Check for unfinished adventures
  checkUnfinishedAdventures();
}

function setupDashboardEvents() {
  // Logout link
  document.getElementById('login-logout-link').addEventListener('click', function(e) {
    e.preventDefault();
    logout();
  });
  
  // AR Tales link
  document.getElementById('ar-tales-link').addEventListener('click', function(e) {
    // Already logged in, no need to check
  });
}

function populateTimeline() {
  const user = getCurrentUser();
  const timeline = document.getElementById('journey-timeline');
  
  if (!user || !user.activityLog || user.activityLog.length === 0) {
    timeline.innerHTML = '<div class="timeline-item"><p>Your journey timeline will appear here as you explore stories.</p></div>';
    return;
  }
  
  // Sort activities by date (newest first)
  const activities = user.activityLog.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Display last 5 activities
  const recentActivities = activities.slice(0, 5);
  
  timeline.innerHTML = recentActivities.map(activity => `
    <div class="timeline-item">
      <div class="timeline-date">${formatDate(activity.date)}</div>
      <div class="timeline-content">
        ${activity.description}
        ${activity.pointsEarned ? `<span class="points-earned">+${activity.pointsEarned} Dharma Points</span>` : ''}
      </div>
    </div>
  `).join('');
}

function populateRoadmap() {
  const user = getCurrentUser();
  const roadmap = document.getElementById('user-roadmap');
  
  if (!user) {
    roadmap.innerHTML = '<li>Your personalized roadmap will appear here</li>';
    return;
  }
  
  // Generate roadmap based on user interests
  let roadmapItems = [];
  
  if (user.interest === 'Ramayana' || user.interest === 'All') {
    roadmapItems.push('<li><strong>Next in Ramayana:</strong> Complete the Kishkindha Kanda</li>');
  }
  
  if (user.interest === 'Mahabharata' || user.interest === 'All') {
    roadmapItems.push('<li><strong>Next in Mahabharata:</strong> Experience the Bhagavad Gita</li>');
  }
  
  if (user.interest === 'Panchatantra' || user.interest === 'All') {
    roadmapItems.push('<li><strong>Coming Soon:</strong> The Lion and the Rabbit tale</li>');
  }
  
  if (user.interest === 'Folk Tales' || user.interest === 'All') {
    roadmapItems.push('<li><strong>Coming Soon:</strong> Birbal\'s Wisdom stories</li>');
  }
  
  if (roadmapItems.length === 0) {
    roadmapItems.push('<li>Explore our stories to get personalized recommendations</li>');
  }
  
  roadmap.innerHTML = roadmapItems.join('');
}

function checkUnfinishedAdventures() {
  const user = getCurrentUser();
  if (user && user.lastAdventure) {
    // Could show a notification or highlight the continue button
  }
}

function continueLastAdventure() {
  const user = getCurrentUser();
  if (user && user.lastAdventure) {
    loadARExperience(user.lastAdventure);
  } else {
    alert('You haven\'t started any adventures yet! Explore our AR Tales to begin.');
  }
  window.location.href = 'ARTales.html';
}

function showRecommendations() {
  const user = getCurrentUser();
  if (user) {
    alert(`Based on your interest in ${user.interest}, we recommend:\n\n- The Battle of Lanka (Ramayana)\n- Krishna's Wisdom (Mahabharata)`);
  }
}

function viewDharmaPath() {
  const user = getCurrentUser();
  if (user) {
    alert(`Your current Dharma Path:\n\n- ${user.dharmaPoints || 0} Dharma Points earned\n- ${user.storiesExplored || 0} stories explored\n- ${user.achievements ? user.achievements.length : 0} achievements unlocked`);
  }
}

function continueStory(story) {
  alert(`Continuing your ${story} adventure...`);
  window.location.href = 'ARTales.html';
}

function contactSupport() {
  window.location.href = 'mailto:support@legendsalive.in';
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Camera Permission Functions
function checkCameraCompatibility() {
  const compatibilityMessage = document.getElementById('compatibilityMessage');
  const cameraError = document.getElementById('cameraError');
  
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    showCameraError("Your browser doesn't support camera access.", compatibilityMessage);
    return false;
  }
  
  navigator.mediaDevices.enumerateDevices()
    .then(devices => {
      const hasCamera = devices.some(device => device.kind === 'videoinput');
      
      if (hasCamera) {
        compatibilityMessage.innerHTML = `
          <div class="compatibility-status compatible">
            <i class="fas fa-check-circle"></i>
            <span>Your device has a camera and is compatible with AR features</span>
          </div>
        `;
        document.getElementById('requestCameraBtn').style.display = 'inline-block';
      } else {
        showCameraError("No camera found on this device. AR features will be limited.", compatibilityMessage);
      }
    })
    .catch(err => {
      showCameraError("Could not check camera devices. Error: " + err.message, compatibilityMessage);
    });
}

function showCameraError(message, element) {
  element.innerHTML = `
    <div class="compatibility-status not-compatible">
      <i class="fas fa-exclamation-circle"></i>
      <span>${message}</span>
    </div>
  `;
  document.getElementById('requestCameraBtn').style.display = 'none';
}

function requestCameraPermission() {
  const cameraError = document.getElementById('cameraError');
  cameraError.textContent = '';
  
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      const cameraFeed = document.getElementById('cameraFeed');
      cameraFeed.srcObject = stream;
      document.getElementById('cameraTest').style.display = 'block';
      
      setTimeout(() => {
        closeModal();
        document.getElementById('cameraTest').style.display = 'none';
        stream.getTracks().forEach(track => track.stop());
        localStorage.setItem('cameraPermissionGranted', 'true');
        enableARFeatures();
      }, 2000);
    })
    .catch(err => {
      cameraError.textContent = "Could not access camera: " + err.message;
    });
}

function showModal() {
  document.getElementById('cameraModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('cameraModal').style.display = 'none';
}

function enableARFeatures() {
  const arButtons = document.querySelectorAll('[data-requires-camera]');
  arButtons.forEach(button => {
    button.disabled = false;
    button.classList.remove('disabled-feature');
  });
  
  const userInfo = document.getElementById('user-info');
  userInfo.innerHTML += '<span class="camera-success"><i class="fas fa-camera"></i> Camera Ready</span>';
}