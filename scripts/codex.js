import { showToast } from './utils.js';

const mockCodexEntries = [
  { id: 1, title: 'The Fall of Arcania', summary: 'The beginning of the end for the crystal mages.', tags: ['Lore', 'History'], image: '../assets/images/knights.jpg' },
  { id: 2, title: 'Beasts of the Void', summary: 'A comprehensive bestiary of the voidborn creatures.', tags: ['Bestiary', 'Danger'], image: '../assets/images/beast.jpg' },
  { id: 3, title: 'Secrets of the Alchemist', summary: 'Forbidden potions and their disastrous effects.', tags: ['Magic', 'Crafting'], image: '../assets/images/alchemist.jpg' },
  { id: 4, title: 'The Lost Elven City', summary: 'Ruins that hold the key to the ancient prophecies.', tags: ['Lore', 'Exploration'], image: '../assets/images/elf.jpg' }
];

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('codex-container');
  const searchInput = document.getElementById('search-codex');
  
  if (!container) return;

  let codexEntries = [];

  // Fetch from backend
  async function loadCodex() {
    renderSkeletons();
    try {
      const res = await fetch('http://localhost:3000/api/codex');
      if (res.ok) {
        codexEntries = await res.json();
      } else {
        throw new Error('Failed to fetch');
      }
    } catch (e) {
      console.error(e);
      // fallback to mock for demo purposes if backend offline
      codexEntries = mockCodexEntries;
    }
    renderEntries(codexEntries);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  function renderSkeletons() {
    container.innerHTML = '';
    for(let i=0; i<4; i++) {
      container.innerHTML += `
        <div class="card skeleton" style="height: 350px;"></div>
      `;
    }
  }

  function renderEntries(entries) {
    container.innerHTML = '';
    
    if (entries.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; grid-column: 1/-1; padding: 40px;">
          <h3 style="color: var(--color-muted)">No entries found in the archives.</h3>
        </div>
      `;
      return;
    }

    entries.forEach(entry => {
      const tags = entry.tags || [];
      const tagsHtml = tags.map(t => `<span class="badge">${t}</span>`).join(' ');
      const image = entry.image || '../assets/images/knights.jpg';
      const summary = entry.summary || '';
      
      const el = document.createElement('div');
      el.className = 'card reveal-text';
      el.style.animationDelay = `${Math.random() * 0.5}s`;
      el.innerHTML = `
        <img src="${image}" alt="${entry.title}" class="card-img-top">
        <h3>${entry.title}</h3>
        <p style="color: var(--color-muted); margin-bottom: 16px;">${summary}</p>
        <div style="margin-bottom: 16px;">${tagsHtml}</div>
        <button class="btn btn-outline" style="width: 100%">Read Entry</button>
      `;
      container.appendChild(el);
      observer.observe(el);
    });
  }

  loadCodex();

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const filtered = codexEntries.filter(entry => 
        entry.title.toLowerCase().includes(term) || 
        (entry.tags && entry.tags.some(tag => tag.toLowerCase().includes(term)))
      );
      renderEntries(filtered);
    });
  }
});
