import { showToast, storage } from './utils.js';

class Auth {
  constructor() {
    this.user = storage.get('user');
  }

  isLoggedIn() {
    return !!this.user;
  }

  async login(email, password) {
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      const user = { email: data.user.email, token: data.token };
      this.user = user;
      storage.set('user', user);
      return user;
    } catch (err) {
      throw err;
    }
  }

  async signup(email, password, confirmPassword) {
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match.');
    }
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters.');
    }

    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      
      const user = { email: data.user.email, token: data.token };
      this.user = user;
      storage.set('user', user);
      return user;
    } catch (err) {
      throw err;
    }
  }

  logout() {
    this.user = null;
    storage.remove('user');
    window.location.href = '../index.html';
  }
}

export const auth = new Auth();

// Attach to global for easy HTML access
window.auth = auth;

// Auth Page Logic (if on auth.html)
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const tabLogin = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');

  if (tabLogin && tabSignup) {
    tabLogin.addEventListener('click', () => {
      loginForm.style.display = 'block';
      signupForm.style.display = 'none';
      tabLogin.classList.add('active');
      tabSignup.classList.remove('active');
    });

    tabSignup.addEventListener('click', () => {
      loginForm.style.display = 'none';
      signupForm.style.display = 'block';
      tabSignup.classList.add('active');
      tabLogin.classList.remove('active');
    });
  }

  // Password toggle
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const input = e.target.previousElementSibling.previousElementSibling;
      if (input.type === 'password') {
        input.type = 'text';
      } else {
        input.type = 'password';
      }
    });
  });

  const forgotPasswordBtn = document.getElementById('forgot-password-btn');
  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener('click', () => {
      showToast('A magic link to reset your password has been sent to your owl.', 'info');
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = e.target.email.value;
      const password = e.target.password.value;
      const btn = e.target.querySelector('button');
      
      const originalText = btn.innerText;
      btn.innerText = 'Loading...';
      btn.disabled = true;

      try {
        await auth.login(email, password);
        showToast('Login successful!', 'success');
        setTimeout(() => window.location.href = 'codex.html', 1000);
      } catch (err) {
        showToast(err.message, 'error');
        btn.innerText = originalText;
        btn.disabled = false;
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = e.target.email.value;
      const password = e.target.password.value;
      const confirmPassword = e.target.confirmPassword.value;
      const btn = e.target.querySelector('button');
      
      const originalText = btn.innerText;
      btn.innerText = 'Loading...';
      btn.disabled = true;

      try {
        await auth.signup(email, password, confirmPassword);
        showToast('Account created successfully!', 'success');
        setTimeout(() => window.location.href = 'codex.html', 1000);
      } catch (err) {
        showToast(err.message, 'error');
        btn.innerText = originalText;
        btn.disabled = false;
      }
    });
  }
  
  // Guard protected pages
  const isProtected = document.body.dataset.protected === 'true';
  if (isProtected && !auth.isLoggedIn()) {
    window.location.href = 'auth.html';
  }
});
