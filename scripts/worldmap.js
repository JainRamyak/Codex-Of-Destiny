document.addEventListener('DOMContentLoaded', async () => {
  const utils = new GameUtils();
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'auth.html';
    return;
  }

  // Load components
  await utils.loadComponent('navbar-container', '../components/navbar.html');
  await utils.loadComponent('dialog-container', '../components/dialog-box.html');

  // Load User Data
  let user;
  try {
    const res = await fetch('http://localhost:3000/api/auth/me', {
      headers: { 'x-auth-token': token }
    });
    user = await res.json();
    
    // Setup HUD
    document.getElementById('hud-hero-name').innerText = user.heroName || user.username;
    document.getElementById('hud-level').innerText = user.level;
    document.getElementById('hud-hp-bar').style.width = `${user.hp}%`;
    document.getElementById('hud-xp-bar').style.width = `${(user.xp % 100)}%`;
    document.getElementById('hud-gold').innerText = user.gold;
    
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '../index.html';
    });
    
  } catch(err) {
    console.error(err);
  }

  // Generate Map Grid (visual flair)
  const mapEl = document.getElementById('world-map');
  for (let i = 0; i < 160; i++) {
    const cell = document.createElement('div');
    const rand = Math.random();
    if (rand < 0.1) cell.className = 'map-water';
    else if (rand < 0.3) cell.className = 'map-forest';
    else if (rand < 0.4) cell.className = 'map-mountain';
    else cell.className = 'map-cell';
    mapEl.appendChild(cell);
  }

  // Move hero and zone markers to top so they aren't hidden by grid
  const heroSprite = document.getElementById('hero-sprite');
  const pythonZone = document.getElementById('zone-python');
  const jsZone = document.getElementById('zone-js');
  const cppZone = document.getElementById('zone-cpp');
  
  mapEl.appendChild(heroSprite);
  mapEl.appendChild(pythonZone);
  mapEl.appendChild(jsZone);
  mapEl.appendChild(cppZone);
  
  // Set hero color based on selected avatar
  if(user && user.heroAvatar) {
     heroSprite.style.background = `var(--pixel-${user.heroAvatar})`;
  }

  // Calculate unlocks based on completed quests
  // For a real app we'd fetch the actual quests to see which are Python vs JS.
  // We'll approximate based on number of completed quests, assuming linear progression
  const completed = user ? user.completedQuests.length : 0;
  
  if (completed >= 5) {
    jsZone.classList.remove('zone-locked');
    jsZone.dataset.info = "The Electric Citadel: Master the web's interactivity.";
  }
  if (completed >= 10) {
    cppZone.classList.remove('zone-locked');
    cppZone.dataset.info = "The Iron Fortress: The final challenge.";
  }

  // Initial Hero Position
  heroSprite.style.left = pythonZone.style.left;
  heroSprite.style.top = pythonZone.style.top;

  // Interactions
  document.querySelectorAll('.zone-marker').forEach(zone => {
    zone.addEventListener('mouseenter', () => {
      utils.typeWriter(zone.dataset.info, 'dialog-text', 20);
    });

    zone.addEventListener('click', () => {
      if (zone.classList.contains('zone-locked')) {
        utils.playSound('wrong');
        utils.typeWriter("This area is locked. Complete more quests to enter.", 'dialog-text', 20);
        return;
      }

      utils.playSound('click');
      
      // Move Hero
      heroSprite.style.left = zone.style.left;
      heroSprite.style.top = zone.style.top;

      // Navigate after movement animation
      setTimeout(() => {
        window.location.href = `quest.html?zone=${zone.dataset.zone}`;
      }, 1000);
    });
  });
  
  utils.typeWriter("Welcome to Syntaxia. Select a realm to begin your quest.", 'dialog-text', 50);
});
