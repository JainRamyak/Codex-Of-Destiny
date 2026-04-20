document.addEventListener('DOMContentLoaded', async () => {
  const utils = new GameUtils();
  const token = localStorage.getItem('token');
  if (!token) window.location.href = 'auth.html';

  await utils.loadComponent('navbar-container', '../components/navbar.html');

  const urlParams = new URLSearchParams(window.location.search);
  const zone = urlParams.get('zone') || 'python';

  let user;
  let bossHp = 100;

  const heroHpBar = document.getElementById('hero-hp');
  const bossHpBar = document.getElementById('boss-hp');
  const brokenCodeEl = document.getElementById('broken-code');
  const choicesContainer = document.getElementById('choices-container');
  const flashOverlay = document.getElementById('flash-overlay');
  const heroAvatar = document.getElementById('hero-avatar');
  
  const questionPanel = document.getElementById('question-panel');
  const endScreen = document.getElementById('end-screen');
  const endTitle = document.getElementById('end-title');
  const endDesc = document.getElementById('end-desc');

  // Load User
  try {
    const res = await fetch('http://localhost:3000/api/auth/me', {
      headers: { 'x-auth-token': token }
    });
    user = await res.json();
    updateHUD();
    if(user.heroAvatar) {
        heroAvatar.style.background = `var(--pixel-${user.heroAvatar})`;
    }
    heroHpBar.style.width = `${user.hp}%`;
  } catch(err) { console.error(err); }

  function updateHUD() {
    document.getElementById('hud-hero-name').innerText = user.heroName || user.username;
    document.getElementById('hud-level').innerText = user.level;
    document.getElementById('hud-hp-bar').style.width = `${user.hp}%`;
    document.getElementById('hud-xp-bar').style.width = `${(user.xp % 100)}%`;
    document.getElementById('hud-gold').innerText = user.gold;
  }

  const questions = {
      'python': [
          { code: "def hello()\n  print('hi')", choices: ["def hello():\n  print('hi')", "function hello() {}", "hello = 'hi'"], correct: 0 },
          { code: "for i in range(5)\n  print(i)", choices: ["for i in range(5);", "for i in range(5):", "for (i=0;i<5)"], correct: 1 },
          { code: "x = [1, 2, 3\nprint(x)", choices: ["x = [1, 2, 3]", "x = {1, 2, 3}", "x = (1, 2, 3)"], correct: 0 }
      ],
      'javascript': [
          { code: "const x = 5\nconst y = 10\nconsole.log(x y)", choices: ["console.log(x + y)", "console.log(x y);", "print(x, y)"], correct: 0 },
          { code: "function add(a, b) {\n return a + b\n", choices: ["return a + b; }", "return a + b", "}"], correct: 0 },
          { code: "let arr = [1, 2, 3];\narr.push_back(4);", choices: ["arr.append(4);", "arr.push(4);", "arr.add(4);"], correct: 1 }
      ],
      'cpp': [
          { code: "int main() {\n cout << 'hello'\n}", choices: ["cout << \"hello\";", "print('hello')", "Console.WriteLine()"], correct: 0 },
          { code: "int x = '5';", choices: ["int x = 5;", "string x = 5;", "int x = [5];"], correct: 0 },
          { code: "for(int i=0; i<5 i++)", choices: ["for(int i=0; i<5; i++)", "for i in 5:", "for(i=0, i<5)"], correct: 0 }
      ]
  };

  let qIndex = 0;
  const qList = questions[zone] || questions['python'];

  function loadQuestion() {
      if(bossHp <= 0) {
          endBattle(true);
          return;
      }
      if(user.hp <= 0) {
          endBattle(false);
          return;
      }
      if(qIndex >= qList.length) qIndex = 0; // loop if needed
      
      const q = qList[qIndex];
      brokenCodeEl.innerText = q.code;
      choicesContainer.innerHTML = '';
      
      q.choices.forEach((choice, idx) => {
          const btn = document.createElement('button');
          btn.className = 'btn choice-btn';
          btn.innerText = `[${String.fromCharCode(65+idx)}] ${choice}`;
          btn.onclick = () => handleChoice(idx === q.correct);
          choicesContainer.appendChild(btn);
      });
  }

  async function handleChoice(isCorrect) {
      if(isCorrect) {
          // Hero attacks boss
          utils.playSound('correct');
          bossHp -= 35;
          bossHpBar.style.width = `${Math.max(0, bossHp)}%`;
          
          document.getElementById('boss-combatant').classList.add('flash-white');
          setTimeout(() => document.getElementById('boss-combatant').classList.remove('flash-white'), 300);
          
      } else {
          // Boss attacks hero
          utils.playSound('wrong');
          user.hp -= 20;
          heroHpBar.style.width = `${Math.max(0, user.hp)}%`;
          updateHUD();
          
          flashOverlay.className = 'flash-red';
          flashOverlay.style.animation = 'none';
          void flashOverlay.offsetWidth;
          flashOverlay.style.animation = 'flashRed 0.5s';
          
          document.body.classList.add('shake');
          setTimeout(() => document.body.classList.remove('shake'), 400);
          
          // Save HP
          fetch('http://localhost:3000/api/progress/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
            body: JSON.stringify({ hp: user.hp })
          });
      }
      
      qIndex++;
      setTimeout(loadQuestion, 1000);
  }

  function endBattle(win) {
      questionPanel.style.display = 'none';
      endScreen.style.display = 'block';
      
      if(win) {
          utils.playSound('levelup');
          endTitle.innerText = "VICTORY!";
          endTitle.className = "text-gold";
          endDesc.innerText = "You have defeated the Bug Lord in this realm! Earned 100 XP and 50 Gold.";
          
          // Give rewards
          user.xp += 100;
          user.gold += 50;
          // Heal hero
          user.hp = 100;
          updateHUD();
          
          fetch('http://localhost:3000/api/progress/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
            body: JSON.stringify({ xp: user.xp, gold: user.gold, hp: user.hp })
          });
      } else {
          utils.playSound('wrong'); // or gameover sound
          endTitle.innerText = "GAME OVER";
          endTitle.className = "text-red";
          endDesc.innerText = "The Bug Lord's spaghetti code overwhelmed you. Rest and try again.";
          user.hp = 100; // revive for next time
          fetch('http://localhost:3000/api/progress/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
            body: JSON.stringify({ hp: user.hp })
          });
      }
  }

  loadQuestion();
});
