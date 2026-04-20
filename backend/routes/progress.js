const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Save all hero stats
router.post('/save', async (req, res) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    const { heroName, heroClass, heroAvatar, xp, gold, level, hp, completedQuests, inventory, badges } = req.body;
    
    let user = await User.findById(decoded.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (heroName) user.heroName = heroName;
    if (heroClass) user.heroClass = heroClass;
    if (heroAvatar) user.heroAvatar = heroAvatar;
    if (xp !== undefined) user.xp = xp;
    if (gold !== undefined) user.gold = gold;
    if (level !== undefined) user.level = level;
    if (hp !== undefined) user.hp = hp;
    
    if (completedQuests && Array.isArray(completedQuests)) {
        // add unique
        completedQuests.forEach(q => {
            if (!user.completedQuests.includes(q)) {
                user.completedQuests.push(q);
            }
        });
    }
    
    if (inventory) user.inventory = inventory;
    if (badges) user.badges = badges;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Leaderboard top 20 by XP
router.get('/leaderboard', async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ xp: -1 })
      .limit(20)
      .select('heroName heroClass level xp completedQuests');
    res.json(topUsers);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
