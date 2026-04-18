import { showToast } from './utils.js';

const lootTable = [
  { name: 'Rusty Sword', rarity: 'common', color: '#9ca3af' },
  { name: 'Health Potion', rarity: 'common', color: '#9ca3af' },
  { name: 'Elven Bow', rarity: 'rare', color: '#3b82f6' },
  { name: 'Mage Staff', rarity: 'epic', color: '#a855f7' },
  { name: 'Crown of the Void', rarity: 'legendary', color: '#f59e0b' }
];

document.addEventListener('DOMContentLoaded', () => {
  const chestWrapper = document.getElementById('chest-wrapper');
  const lootContainer = document.getElementById('loot-container');
  const openBtn = document.getElementById('btn-open-chest');

  if (!chestWrapper || !openBtn || !lootContainer) return;

  let isOpening = false;

  openBtn.addEventListener('click', async () => {
    if (isOpening) return;
    isOpening = true;
    
    // Animate chest
    chestWrapper.classList.add('open');
    openBtn.disabled = true;
    openBtn.innerText = 'Opening...';

    try {
      // Small delay to allow CSS animation to start
      await new Promise(r => setTimeout(r, 1000));
      
      const res = await fetch('http://localhost:3000/api/chest/open', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': window.auth && window.auth.user ? window.auth.user.token : ''
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to open chest. Are you logged in?');
      }
      
      const data = await res.json();
      const lootItem = data.item;
      
      let color = '#9ca3af';
      if (lootItem.rarity === 'rare') color = '#3b82f6';
      if (lootItem.rarity === 'epic') color = '#a855f7';
      if (lootItem.rarity === 'legendary') color = '#f59e0b';

      showToast(`You found a ${lootItem.rarity} item!`, 'success');
      
      lootContainer.innerHTML = `
        <div class="card animate-pulse-glow" style="border-color: ${color}; text-align: center;">
          <h2 style="color: ${color}; text-transform: uppercase;">${lootItem.rarity}</h2>
          <h3>${lootItem.name}</h3>
          <p style="color: var(--color-muted); font-size: 0.9rem; margin-top: 8px;">${lootItem.description || ''}</p>
          <button class="btn btn-outline" id="btn-claim" style="margin-top: 16px; border-color: ${color}; color: ${color}">Claim to Inventory</button>
        </div>
      `;

      document.getElementById('btn-claim').addEventListener('click', (e) => {
        showToast(`${lootItem.name} added to inventory.`, 'info');
        e.target.disabled = true;
        e.target.innerText = 'Claimed';
        
        // Reset chest
        setTimeout(() => {
          chestWrapper.classList.remove('open');
          openBtn.disabled = false;
          openBtn.innerText = 'Open Another Chest';
          isOpening = false;
          setTimeout(() => lootContainer.innerHTML = '', 500);
        }, 1500);
      });

    } catch (err) {
      showToast(err.message, 'error');
      chestWrapper.classList.remove('open');
      openBtn.disabled = false;
      openBtn.innerText = 'Open Void Chest';
      isOpening = false;
    }
  });
});
