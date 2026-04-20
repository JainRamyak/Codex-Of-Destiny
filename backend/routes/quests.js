const express = require('express');
const router = express.Router();
const Quest = require('../models/Quest');
const User = require('../models/User');

// Get all quests by zone
router.get('/zone/:zone', async (req, res) => {
  try {
    const quests = await Quest.find({ zone: req.params.zone });
    res.json(quests);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get quest by ID
router.get('/:id', async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.id);
    if (!quest) return res.status(404).json({ msg: 'Quest not found' });
    res.json(quest);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Submit quest code
router.post('/:id/submit', async (req, res) => {
  try {
    const { code, language } = req.body;
    const quest = await Quest.findById(req.params.id);
    if (!quest) return res.status(404).json({ msg: 'Quest not found' });

    let correct = false;
    let failedTest = null;
    let message = 'Code execution failed.';

    if (language === 'javascript') {
      try {
        // Safe evaluation simulation
        const evaluate = new Function(`
          try {
            ${code}
            return { ${quest.testCases.map(tc => `'${tc.input}': (typeof ${tc.input} !== 'undefined' ? ${tc.input} : null)`).join(', ')} };
          } catch(e) {
            return { error: e.message };
          }
        `);
        const result = evaluate();

        if (result.error) {
          message = result.error;
        } else {
          correct = true;
          for (let tc of quest.testCases) {
            if (result[tc.input] !== tc.expected) {
              correct = false;
              failedTest = `Expected ${tc.input} to be ${tc.expected}, got ${result[tc.input]}`;
              message = failedTest;
              break;
            }
          }
        }
      } catch (e) {
        message = e.message;
      }
    } else {
      // For Python/C++, simple string matching against expected hints/patterns for MVP
      const strippedCode = code.replace(/\s+/g, '');
      const expectedPattern = quest.hint.replace(/\s+/g, '');
      if (strippedCode.includes(expectedPattern)) {
        correct = true;
      } else {
        failedTest = "Code doesn't match expected logic pattern.";
        message = failedTest;
      }
    }

    if (correct) {
      res.json({
        correct: true,
        message: '✨ SPELL CAST!',
        xp: quest.xpReward,
        gold: quest.goldReward,
        item: quest.itemReward
      });
    } else {
      res.json({
        correct: false,
        message,
        failedTest
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
