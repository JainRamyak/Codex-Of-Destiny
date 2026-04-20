const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  
  heroName: { type: String, default: 'Hero' },
  heroClass: { type: String, enum: ['Code Mage', 'Script Knight', 'Iron Coder'], default: 'Code Mage' },
  heroAvatar: { type: String, default: 'blue' },
  
  xp: { type: Number, default: 0 },
  gold: { type: Number, default: 100 },
  level: { type: Number, default: 1 },
  hp: { type: Number, default: 100 },
  
  completedQuests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quest' }],
  inventory: [{ type: String }],
  badges: [{ type: String }],
  
  streak: { type: Number, default: 0 },
  lastLogin: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
