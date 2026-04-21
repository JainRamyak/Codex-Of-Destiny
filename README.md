# ⚔️ CODEX OF DESTINY

<div align="center">

```
 ██████╗ ██████╗ ██████╗ ███████╗██╗  ██╗
██╔════╝██╔═══██╗██╔══██╗██╔════╝╚██╗██╔╝
██║     ██║   ██║██║  ██║█████╗   ╚███╔╝ 
██║     ██║   ██║██║  ██║██╔══╝   ██╔██╗ 
╚██████╗╚██████╔╝██████╔╝███████╗██╔╝ ██╗
 ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝
          O F   D E S T I N Y
```

### 🎮 *"Write Code. Cast Spells. Save the Realm."*

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

</div>

---

## 📖 The Story

The Kingdom of **Syntaxia** is under attack by the **Bug Lord** — a dark entity made of broken code and corrupted logic. Villages burn. Programs crash. The realm falls into chaos.

You are a young **Code Mage**, chosen by the ancient Codex of Destiny. Your only weapon? The power to write real code.

Journey through 3 legendary kingdoms, solve coding quests, defeat bosses, and save Syntaxia. The Bug Lord fears only one thing — a developer who knows what they're doing.

---

## 🗺️ The Three Kingdoms

| Kingdom | Language | Difficulty | Unlock Condition |
|---------|----------|------------|-----------------|
| 🐍 **The Serpent Marshes** | Python | ⭐ Novice | Always Unlocked |
| ⚡ **The Electric Citadel** | JavaScript | ⭐⭐ Apprentice | Complete 5 Python Quests |
| ⚔️ **The Iron Fortress** | C++ | ⭐⭐⭐ Wizard | Complete 5 JS Quests |

---

## 🧙 Choose Your Hero Class

| Class | Specialty | Bonus |
|-------|-----------|-------|
| 🧙 **Code Mage** | Python spells | +25% XP on Python quests |
| ⚡ **Script Knight** | JavaScript sorcery | +25% XP on JS quests |
| 🤖 **Iron Coder** | C++ warfare | +25% XP on C++ quests |

---

## ✨ Features

- 🎮 **Pixel RPG UI** — Press Start 2P font, 8-bit pixel borders, golden theme throughout
- ⚔️ **30 Coding Quests** — 10 each in Python, JavaScript, and C++
- 🏰 **Boss Battles** — Defeat zone bosses by fixing broken code
- 🎒 **Inventory System** — Collect items, spells, and badges as you learn
- 🏆 **Leaderboard** — Compete with other Code Mages globally
- 🎵 **8-bit Sounds** — Procedurally generated Web Audio API sounds
- 📈 **XP & Leveling** — Real RPG progression system with animated XP bars
- 💡 **Hint System** — Spend gold to unlock hints on tough quests
- 🔒 **Zone Unlocking** — Complete quests to unlock new kingdoms
- 📱 **Responsive** — Works on desktop, tablet, and mobile

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- A browser (Chrome recommended)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/JainRamyak/Codex-Of-Destiny.git
cd Codex-Of-Destiny

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your values (see below)

# 4. Seed the database with 30 quests
node backend/data/seed.js

# 5. Start the backend server
node backend/server.js

# 6. In a new terminal, serve the frontend
npx serve . --listen 5000
```

### Environment Variables

Create a `.env` file in the root:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/codex-of-destiny
JWT_SECRET=your_super_secret_key_here
```

### Open in Browser

```
🌐 Frontend  →  http://localhost:5000
⚙️  Backend   →  http://localhost:3000
```

---

## 🎮 How to Play

```
1. 🆕  Click NEW GAME on the title screen
2. 🧙  Create your hero — pick a name, class, and avatar
3. 🗺️  Explore the World Map — start with The Serpent Marshes
4. 📜  Accept a Quest — read the fantasy story, understand the challenge
5. 💻  Write your code in the built-in editor
6. ▶️  Hit RUN CODE — watch the magic happen
7. ✅  Correct? Earn XP, Gold, and Items!
8. ❌  Wrong? The Bug Lord resists — check the hint and try again
9. 🏆  Complete all quests in a zone → face the BOSS BATTLE
10. 🔓 Defeat the boss → unlock the next kingdom
```

---

## 🗂️ Project Structure

```
Codex-Of-Destiny/
│
├── index.html                  ← Pixel title screen
├── /pages
│   ├── character-create.html   ← Hero creation
│   ├── world-map.html          ← Overworld map
│   ├── quest.html              ← Coding challenge screen
│   ├── battle.html             ← Boss battle
│   ├── inventory.html          ← Items & badges
│   ├── leaderboard.html        ← Global rankings
│   ├── auth.html               ← Login / Register
│   └── 404.html                ← A wild bug appeared!
│
├── /styles
│   ├── globals.css             ← Design tokens, pixel font
│   ├── components.css          ← Buttons, cards, inputs
│   ├── animations.css          ← XP bars, battles, effects
│   └── layout.css              ← Grid, responsive breakpoints
│
├── /scripts
│   ├── utils.js                ← Toast, auth guard, audio
│   ├── auth.js                 ← Login/register logic
│   ├── character.js            ← Hero stats & leveling
│   ├── worldmap.js             ← Map + zone unlock logic
│   ├── quest.js                ← Quest loader + code editor
│   ├── battle.js               ← Boss battle engine
│   ├── inventory.js            ← Items + badges display
│   └── leaderboard.js          ← Leaderboard fetching
│
├── /assets
│   ├── /sprites                ← Pixel art sprites (CSS/SVG)
│   ├── /maps                   ← World map zone art
│   └── /fonts                  ← Press Start 2P
│
├── /components
│   ├── navbar.html             ← HUD: HP, XP, Gold, Level
│   ├── dialog-box.html         ← RPG dialog component
│   └── footer.html
│
├── /backend
│   ├── server.js               ← Express app entry point
│   ├── /routes
│   │   ├── auth.js             ← /api/auth/*
│   │   ├── quests.js           ← /api/quests/*
│   │   ├── progress.js         ← /api/progress/*
│   │   └── leaderboard.js      ← /api/leaderboard
│   ├── /models
│   │   ├── User.js             ← Hero + auth data
│   │   ├── Quest.js            ← Quest definitions
│   │   └── Progress.js         ← Player progress
│   ├── /middleware
│   │   └── auth.js             ← JWT verification
│   └── /data
│       └── seed.js             ← Seeds 30 quests to DB
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 🧪 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create new hero account | ❌ |
| POST | `/api/auth/login` | Login returning hero | ❌ |
| GET | `/api/quests?zone=python` | Get quests for a zone | ✅ |
| GET | `/api/quests/:id` | Get single quest | ✅ |
| POST | `/api/quests/:id/submit` | Submit code answer | ✅ |
| POST | `/api/quests/:id/hint` | Get hint (costs 10 gold) | ✅ |
| GET | `/api/progress` | Get player progress | ✅ |
| POST | `/api/progress/save` | Save player progress | ✅ |
| GET | `/api/leaderboard` | Top 20 players by XP | ✅ |

---

## 🏆 Quest List Preview

### 🐍 Python — The Serpent Marshes
1. The Sum Spell — add two numbers
2. The Echo Ritual — print a message
3. The String Weaver — concatenate strings
4. The Condition Gate — if/else logic
5. The Loop Curse — for loop
6. The While Watcher — while loop
7. The Function Forge — define a function
8. The List Labyrinth — work with lists
9. The Dict Dragon — use dictionaries
10. **BOSS** — The Python Serpent Boss Battle

### ⚡ JavaScript — The Electric Citadel
1. The Variable Vault — declare variables
2. The Console Oracle — console.log
3. The Arithmetic Arcane — math operations
4. The String Sorcerer — string methods
5. The Condition Codex — if/else
6. The Loop Lightning — for loops
7. The Function Familiar — write functions
8. The Array Alchemist — array methods
9. The Object Oracle — JS objects
10. **BOSS** — The Electric Golem Boss Battle

### ⚔️ C++ — The Iron Fortress
1. The Hello Warrior — Hello World
2. The Variable Vault — declare variables
3. The Input Inquisitor — cin/cout
4. The Math Mercenary — arithmetic
5. The Condition Commander — if/else
6. The Loop Legion — for loops
7. The While Warlord — while loops
8. The Function Forgemaster — functions
9. The Array Army — arrays
10. **BOSS** — The Bug Lord Final Battle

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Code Editor | CodeMirror (CDN) |
| Pixel Font | Press Start 2P (Google Fonts) |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Audio | Web Audio API (no files needed) |
| Hosting | Any static host (Vercel, Netlify) + Node host |

---

## 🤝 Contributing

Contributions are welcome, brave Code Mage!

```bash
# Fork the repo
# Create your feature branch
git checkout -b feature/new-quest-pack

# Commit your changes
git commit -m "feat: add 10 new TypeScript quests"

# Push and open a Pull Request
git push origin feature/new-quest-pack
```

Ideas for contributions:
- 🐍 New quest packs (TypeScript, Rust, Java)
- 🎨 New pixel art sprites and maps
- 🏰 New boss battles
- 🌍 Translations / localization
- 🐛 Bug fixes (ironically)

---

## 📜 License

MIT License — free to use, modify, and share.

---

## 👨‍💻 Creator

Made with ❤️ and too much coffee by **Ramyak Jain**

> *"The best way to learn code is to believe you're casting spells."*

---

<div align="center">

⭐ **Star this repo if the realm of Syntaxia calls to you!** ⭐

```
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ THE BUG LORD SHALL BE DEFEATED █
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
```

</div>
