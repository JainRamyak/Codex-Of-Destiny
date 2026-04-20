const mongoose = require('mongoose');

const QuestSchema = new mongoose.Schema({
  zone: { type: String, enum: ['python', 'javascript', 'cpp'], required: true },
  title: { type: String, required: true },
  story: { type: String, required: true },
  difficulty: { type: Number, enum: [1, 2, 3], required: true },
  starterCode: { type: String, default: '' },
  testCases: [{
    input: { type: mongoose.Schema.Types.Mixed },
    expected: { type: mongoose.Schema.Types.Mixed }
  }],
  hint: { type: String, default: '' },
  xpReward: { type: Number, default: 10 },
  goldReward: { type: Number, default: 5 },
  itemReward: { type: String, default: null }
});

module.exports = mongoose.model('Quest', QuestSchema);
