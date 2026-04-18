const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const LootItem = require('../models/LootItem');

// POST /api/chest/open (protected)
router.post('/open', authMiddleware, async (req, res) => {
  try {
    const roll = Math.random();
    let rarity = 'common';
    if (roll > 0.95) rarity = 'legendary';
    else if (roll > 0.8) rarity = 'epic';
    else if (roll > 0.5) rarity = 'rare';

    // Fetch a random item of that rarity from DB (or generate one)
    // For now, we dynamically create and save one to the DB
    const newItem = new LootItem({
      name: `Mystic ${rarity.charAt(0).toUpperCase() + rarity.slice(1)} Relic`,
      rarity: rarity,
      description: 'A powerful relic from the void.',
      imageUrl: ''
    });
    
    await newItem.save();

    // Add to user's inventory
    const user = await User.findById(req.user.id);
    if(user) {
      user.inventory.push(newItem._id);
      await user.save();
    }

    res.json({ item: newItem });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
