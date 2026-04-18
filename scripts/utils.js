// utils.js - Shared helpers

// --- Toast System ---
export function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeOutRight 0.3s ease forwards';
    setTimeout(() => {
      toast.remove();
      if (container.childElementCount === 0) container.remove();
    }, 300);
  }, 3000);
}

// --- LocalStorage Helpers ---
export const storage = {
  get: (key) => JSON.parse(localStorage.getItem(key)),
  set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  remove: (key) => localStorage.removeItem(key)
};

// --- Ripple Effect ---
export function createRipple(event) {
  const button = event.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
  circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
  circle.classList.add('ripple');

  const ripple = button.querySelector('.ripple');
  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);
}

// --- Component Loading ---
export async function loadComponents() {
  const navbarContainer = document.getElementById('navbar-container');
  const footerContainer = document.getElementById('footer-container');
  
  if (navbarContainer) {
    try {
      const res = await fetch('/components/navbar.html');
      const html = await res.text();
      navbarContainer.innerHTML = html;
      initNavbar();
    } catch (e) {
      console.error('Failed to load navbar', e);
    }
  }

  if (footerContainer) {
    try {
      const res = await fetch('/components/footer.html');
      const html = await res.text();
      footerContainer.innerHTML = html;
    } catch (e) {
      console.error('Failed to load footer', e);
    }
  }
}

function initNavbar() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeMenu = document.querySelector('.mobile-menu-close');

  if (hamburger && mobileMenu && closeMenu) {
    hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
    closeMenu.addEventListener('click', () => mobileMenu.classList.remove('open'));
  }
  
  // Update active links
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Auth button logic
  if (window.auth && window.auth.isLoggedIn()) {
    const authBtn = document.getElementById('nav-auth-btn');
    const mobileAuthBtn = document.getElementById('nav-mobile-auth-btn');
    const userEmail = window.auth.user.email.split('@')[0];
    
    if (authBtn) {
      const greeting = document.createElement('span');
      greeting.innerText = `Welcome, ${userEmail}`;
      greeting.style.color = 'var(--color-primary)';
      greeting.style.marginRight = 'var(--spacing-4)';
      greeting.style.display = 'inline-block';
      authBtn.parentNode.insertBefore(greeting, authBtn);
      
      authBtn.innerText = 'Log Out';
      authBtn.classList.remove('btn-primary');
      authBtn.classList.add('btn-outline');
      authBtn.onclick = (e) => { e.preventDefault(); window.auth.logout(); };
    }
    if (mobileAuthBtn) {
      mobileAuthBtn.innerText = 'Log Out';
      mobileAuthBtn.onclick = (e) => { e.preventDefault(); window.auth.logout(); };
    }
  }
}

// --- Scroll Progress Bar ---
function initScrollProgress() {
  let progressBar = document.getElementById('scroll-progress');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.cssText = 'position: fixed; top: 0; left: 0; height: 3px; background: var(--color-primary); z-index: 10000; width: 0%; transition: width 0.1s;';
    document.body.appendChild(progressBar);
  }

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

// --- Page Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  loadComponents();
  initScrollProgress();

  // Add ripples to buttons
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', createRipple);
  });
});
