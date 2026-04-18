# Codex of Destiny

A web-based fantasy game and lore platform built with a modern frontend stack and an Express backend. 
Designed following the Antigravity principles for an effortless, beautiful, and fully immersive experience.

## Features
- **Deep Lore Archives**: Browse and search through the history, beasts, and magic of Arcania.
- **Void Chests**: Daily interactive chests granting epic loot with stunning CSS particle animations.
- **Immersive Design**: A gorgeous UI powered by glassmorphism, parallax starfields, and custom typography (Cinzel & Inter).
- **Integrated Audio**: Persistent Spotify radio widget to set the perfect mood while exploring.
- **Responsive & Accessible**: Fully responsive layout optimized for all devices, with WCAG-compliant contrast and keyboard navigability.

## Tech Stack
- **Frontend**: HTML5, Vanilla CSS (CSS Variables, Grid, Animations), ES6+ JavaScript (Modular).
- **Backend**: Node.js, Express.js (scaffolded).
- **Database**: MongoDB/Mongoose (schema scaffolded).

## Project Structure
- `/pages` - HTML views
- `/assets` - Images, icons, and fonts
- `/styles` - Modular CSS files (globals, layout, components, animations)
- `/scripts` - Modular JavaScript logic
- `/backend` - Express server and REST API routes

## Setup Instructions

1. Install backend dependencies:
   ```bash
   npm install
   ```
2. Start the backend server:
   ```bash
   npm start
   ```
3. Open `index.html` in your browser (or serve the directory using a tool like Live Server).

## Contributing
All UI changes must adhere to the design system tokens located in `styles/globals.css`. Ensure no inline styles or click handlers are added directly to the HTML.