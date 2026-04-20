document.addEventListener('DOMContentLoaded', async () => {
  const utils = new GameUtils();
  const token = localStorage.getItem('token');
  if (!token) window.location.href = 'auth.html';

  await utils.loadComponent('navbar-container', '../components/navbar.html');

  const urlParams = new URLSearchParams(window.location.search);
  const zone = urlParams.get('zone') || 'python';

  let user;
  let quests = [];
  let currentQuestIndex = 0;
  let currentQuest = null;

  // UI Elements
  const titleEl = document.getElementById('quest-title');
  const storyEl = document.getElementById('quest-story');
  const langEl = document.getElementById('quest-lang');
  const diffEl = document.getElementById('quest-diff');
  const hintBtn = document.getElementById('hint-btn');
  const hintText = document.getElementById('hint-text');
  const rewardXp = document.getElementById('reward-xp');
  const rewardGold = document.getElementById('reward-gold');
  const rewardItem = document.getElementById('reward-item');
  const runBtn = document.getElementById('run-btn');
  const nextBtn = document.getElementById('next-btn');
  const terminal = document.getElementById('terminal');
  const leftPanel = document.getElementById('left-panel');
  const flashOverlay = document.getElementById('flash-overlay');

  // Load User
  try {
    const res = await fetch('http://localhost:3000/api/auth/me', {
      headers: { 'x-auth-token': token }
    });
    user = await res.json();
    updateHUD();
  } catch(err) { console.error(err); }

  function updateHUD() {
    document.getElementById('hud-hero-name').innerText = user.heroName || user.username;
    document.getElementById('hud-level').innerText = user.level;
    document.getElementById('hud-hp-bar').style.width = `${user.hp}%`;
    document.getElementById('hud-xp-bar').style.width = `${(user.xp % 100)}%`;
    document.getElementById('hud-gold').innerText = user.gold;
  }

  // Load Quests
  try {
    const res = await fetch(`http://localhost:3000/api/quests/zone/${zone}`);
    quests = await res.json();
    
    // Find first uncompleted quest
    currentQuestIndex = quests.findIndex(q => !user.completedQuests.includes(q._id));
    if(currentQuestIndex === -1) currentQuestIndex = 0; // all done, just show first
    
    loadQuest(quests[currentQuestIndex]);
  } catch(err) { console.error(err); }

  // Initialize CodeMirror
  let modeMap = {
      'python': 'python',
      'javascript': 'javascript',
      'cpp': 'text/x-c++src'
  };
  
  const editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
    mode: modeMap[zone] || 'javascript',
    theme: 'monokai',
    lineNumbers: true,
    indentUnit: 4
  });

  function loadQuest(quest) {
    if(!quest) {
        titleEl.innerText = "Zone Complete!";
        storyEl.innerText = "You have defeated all enemies here. The boss awaits in battle.html! (Click Next Quest)";
        nextBtn.style.display = 'block';
        nextBtn.onclick = () => window.location.href = `battle.html?zone=${zone}`;
        return;
    }
    currentQuest = quest;
    titleEl.innerText = quest.title;
    langEl.innerText = quest.zone.toUpperCase();
    diffEl.innerText = '⭐'.repeat(quest.difficulty);
    rewardXp.innerText = `+${quest.xpReward} XP`;
    rewardGold.innerText = `+${quest.goldReward} Gold`;
    rewardItem.innerText = quest.itemReward ? `+ ${quest.itemReward}` : '';
    
    hintText.style.display = 'none';
    nextBtn.style.display = 'none';
    terminal.innerHTML = '> Awaiting execution...';
    leftPanel.classList.remove('shake');
    
    editor.setValue(quest.starterCode || '');
    
    utils.typeWriter(quest.story, 'quest-story', 30);
  }

  hintBtn.addEventListener('click', () => {
    if(user.gold >= 10 && currentQuest) {
      user.gold -= 10;
      updateHUD();
      utils.playSound('click');
      hintText.innerText = `HINT: ${currentQuest.hint}`;
      hintText.style.display = 'block';
      // Optimistically save gold
      fetch('http://localhost:3000/api/progress/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ gold: user.gold })
      });
    } else {
      utils.playSound('wrong');
    }
  });

  runBtn.addEventListener('click', async () => {
    if(!currentQuest) return;
    utils.playSound('click');
    terminal.innerHTML = '> Running...<br>';
    runBtn.disabled = true;

    try {
      const code = editor.getValue();
      const res = await fetch(`http://localhost:3000/api/quests/${currentQuest._id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ code, language: currentQuest.zone })
      });
      
      const result = await res.json();

      if (result.correct) {
        // CORRECT
        utils.playSound('correct');
        flashOverlay.style.animation = 'none';
        void flashOverlay.offsetWidth; // trigger reflow
        flashOverlay.className = 'flash-white';
        flashOverlay.style.animation = 'flashWhite 0.5s';
        
        terminal.innerHTML += `<span class="text-green">${result.message}</span><br>`;
        
        // Float text
        const floatMsg = document.createElement('div');
        floatMsg.className = 'floating-text text-green';
        floatMsg.innerText = `+${result.xp} XP`;
        floatMsg.style.left = '50%';
        floatMsg.style.top = '50%';
        document.body.appendChild(floatMsg);
        setTimeout(() => floatMsg.remove(), 1000);

        // Update User
        user.xp += result.xp;
        user.gold += result.gold;
        if (result.item) user.inventory.push(result.item);
        
        // Level up check
        if (user.xp >= user.level * 100) {
            user.level += 1;
            setTimeout(() => utils.playSound('levelup'), 1000);
        }

        user.completedQuests.push(currentQuest._id);
        updateHUD();

        // Save
        await fetch('http://localhost:3000/api/progress/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
            body: JSON.stringify({
                xp: user.xp,
                gold: user.gold,
                level: user.level,
                completedQuests: user.completedQuests,
                inventory: user.inventory
            })
        });

        nextBtn.style.display = 'block';

      } else {
        // WRONG
        utils.playSound('wrong');
        
        leftPanel.classList.remove('shake');
        void leftPanel.offsetWidth;
        leftPanel.classList.add('shake');

        flashOverlay.className = 'flash-red';
        flashOverlay.style.animation = 'none';
        void flashOverlay.offsetWidth;
        flashOverlay.style.animation = 'flashRed 0.5s';

        terminal.innerHTML += `<span class="text-red">💀 THE BUG LORD RESISTS!</span><br>`;
        if (result.failedTest) {
           terminal.innerHTML += `<span class="text-gold">Failed: ${result.failedTest}</span><br>`;
        }
        terminal.innerHTML += `<span>TRY AGAIN</span>`;
        
        user.hp -= 10;
        updateHUD();
        // Save HP
        await fetch('http://localhost:3000/api/progress/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
            body: JSON.stringify({ hp: user.hp })
        });
      }
    } catch(err) {
      terminal.innerHTML += `<span class="text-red">Error connecting to server.</span>`;
    }
    
    runBtn.disabled = false;
  });

  nextBtn.addEventListener('click', () => {
      currentQuestIndex++;
      if (currentQuestIndex < quests.length) {
          loadQuest(quests[currentQuestIndex]);
      } else {
          loadQuest(null); // End of zone
      }
  });

});
