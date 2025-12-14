/**
 * Portfolio JavaScript
 * Fetches data from Cloudflare Pages Functions API and populates the page
 */

// API Configuration
const API_BASE = '/api'; // Cloudflare Pages Functions automatically route /api/*

/**
 * Fetch biography data and update the page
 */
async function loadBiography() {
  try {
    const response = await fetch(`${API_BASE}/biography`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success && result.data) {
      const bio = result.data;
      
      // Update text content
      document.getElementById('full-name').textContent = bio.full_name || 'Your Name';
      document.getElementById('title').textContent = bio.title || 'Professional Title';
      document.getElementById('bio').textContent = bio.bio || 'Your biography here...';
      
      // Update contact info
      const emailEl = document.getElementById('email');
      emailEl.textContent = bio.email || 'email@example.com';
      emailEl.href = `mailto:${bio.email}`;
      
      document.getElementById('phone').textContent = bio.phone || 'Phone number';
      document.getElementById('location').textContent = bio.location || 'Location';
      
      // Update social links
      if (bio.linkedin_url) {
        document.getElementById('linkedin-link').href = bio.linkedin_url;
      }
      
      if (bio.github_url) {
        document.getElementById('github-link').href = bio.github_url;
      }
      
      // Update resume link (if available)
      if (bio.resume_file_key) {
        // When we integrate R2, this will point to the actual file
        document.getElementById('resume-link').href = bio.resume_file_key;
      }
      
      // Update profile photo (if available)
      if (bio.photo_file_key) {
        document.getElementById('profile-photo').src = bio.photo_file_key;
      }
      
      // Update contact section
      document.getElementById('contact-email').textContent = bio.email;
      document.getElementById('contact-location').textContent = bio.location;
      
      // Update footer
      document.getElementById('footer-name').textContent = bio.full_name;
    }
  } catch (error) {
    console.error('Error loading biography:', error);
    
    // Show error message to user
    document.getElementById('full-name').textContent = 'Error loading biography';
    document.getElementById('bio').textContent = 'Please refresh the page or contact support.';
  }
}

/**
 * Fetch projects data and render project cards
 */
async function loadProjects() {
  try {
    const response = await fetch(`${API_BASE}/projects`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success && result.data) {
      renderProjects(result.data);
    }
  } catch (error) {
    console.error('Error loading projects:', error);
    
    // Show error message
    const grid = document.getElementById('projects-grid');
    grid.innerHTML = '<div class="loading">Error loading projects. Please refresh the page.</div>';
  }
}

/**
 * Render project cards in the grid
 * @param {Array} projects - Array of project objects
 */
function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');
  
  if (!projects || projects.length === 0) {
    grid.innerHTML = '<div class="loading">No projects to display yet.</div>';
    return;
  }
  
  // Clear loading message
  grid.innerHTML = '';
  
  // Create a card for each project
  projects.forEach(project => {
    const card = createProjectCard(project);
    grid.appendChild(card);
  });
}

/**
 * Create a project card element
 * @param {Object} project - Project data
 * @returns {HTMLElement} Project card element
 */
function createProjectCard(project) {
  const card = document.createElement('div');
  card.className = 'project-card';
  
  // Get first letter for thumbnail placeholder
  const initial = project.title ? project.title.charAt(0).toUpperCase() : '?';
  
  // Build tech tags HTML
  const techTags = project.tech_stack
    ? project.tech_stack.split(',').map(tech => 
        `<span class="tech-tag">${tech.trim()}</span>`
      ).join('')
    : '';
  
  // Build project links HTML
  let linksHTML = '';
  if (project.project_url || project.github_url) {
    linksHTML = '<div class="project-links">';
    
    if (project.project_url) {
      linksHTML += `<a href="${project.project_url}" class="project-link" target="_blank" rel="noopener">View Live</a>`;
    }
    
    if (project.github_url) {
      linksHTML += `<a href="${project.github_url}" class="project-link secondary" target="_blank" rel="noopener">View Code</a>`;
    }
    
    linksHTML += '</div>';
  }
  
  // Demo badge
  const demoBadge = project.demo_type && project.demo_type !== 'none'
    ? `<span class="tech-tag" style="background-color: #10b981; color: white;">🎬 ${project.demo_type.toUpperCase()} Demo</span>`
    : '';
  
  // Build the card HTML
  card.innerHTML = `
    <div class="project-thumbnail">
      ${initial}
    </div>
    <h3 class="project-title">${escapeHtml(project.title)}</h3>
    <p class="project-description">${escapeHtml(project.description)}</p>
    <div class="project-tech">
      ${techTags}
      ${demoBadge}
    </div>
    ${linksHTML}
  `;
  
  return card;
}

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

/**
 * Set current year in footer
 */
function setCurrentYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/**
 * Smooth scroll for navigation links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/**
 * Add scroll-based header styling
 */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
    } else {
      header.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
    }
  });
}

/**
 * Initialize the application
 * Called when DOM is fully loaded
 */
async function init() {
  console.log('🚀 Initializing portfolio...');
  
  // Set current year
  setCurrentYear();
  
  // Initialize UI enhancements
  initSmoothScroll();
  initHeaderScroll();
  
  // Load data from APIs
  await Promise.all([
    loadBiography(),
    loadProjects()
  ]);
  
  console.log('✅ Portfolio loaded successfully!');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM is already ready
  init();
}

// Export functions for potential testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    loadBiography,
    loadProjects,
    renderProjects,
    createProjectCard
  };
}
