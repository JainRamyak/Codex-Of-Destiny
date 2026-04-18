import { storage } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const spotifyContainer = document.getElementById('spotify-widget');
  
  if (!spotifyContainer) return;

  const defaultPlaylist = '37i9dQZF1DX186v583rmzp'; // Some fantasy/epic playlist ID
  const savedPlaylist = storage.get('spotify_playlist') || defaultPlaylist;

  // We use the Spotify Embed API for the widget
  spotifyContainer.innerHTML = `
    <div class="spotify-glass-widget" style="
      position: fixed;
      bottom: var(--spacing-4);
      left: var(--spacing-4);
      width: 300px;
      background: rgba(26, 26, 46, 0.8);
      backdrop-filter: blur(10px);
      border-radius: var(--radius-md);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: var(--spacing-2);
      box-shadow: var(--shadow-glass);
      z-index: 999;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
      transition: var(--transition);
    ">
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0 var(--spacing-2);">
        <span style="font-size: 0.8rem; color: var(--color-muted); font-family: var(--font-display);">Codex Radio</span>
        <button id="toggle-spotify" style="color: var(--color-text); font-size: 1.2rem;">&times;</button>
      </div>
      <iframe style="border-radius:12px" 
        src="https://open.spotify.com/embed/playlist/${savedPlaylist}?utm_source=generator&theme=0" 
        width="100%" height="80" frameBorder="0" allowfullscreen="" 
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy">
      </iframe>
    </div>
  `;

  const toggleBtn = document.getElementById('toggle-spotify');
  const widget = spotifyContainer.querySelector('.spotify-glass-widget');
  let isMinimized = false;

  toggleBtn.addEventListener('click', () => {
    isMinimized = !isMinimized;
    if (isMinimized) {
      widget.style.transform = 'translateY(80px)';
      toggleBtn.innerHTML = '&uarr;';
    } else {
      widget.style.transform = 'translateY(0)';
      toggleBtn.innerHTML = '&times;';
    }
  });
});
