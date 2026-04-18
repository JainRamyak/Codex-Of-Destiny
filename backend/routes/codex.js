const express = require('express');
const router = express.Router();
const CodexEntry = require('../models/CodexEntry');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/codex
router.get('/', async (req, res) => {
  try {
    const entries = await CodexEntry.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// POST /api/codex (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, summary, content, tags, image } = req.body;
    const newEntry = new CodexEntry({
      title, summary, content, tags, image, author: req.user.id
    });
    const entry = await newEntry.save();
    res.json(entry);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// DELETE /api/codex/:id (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const entry = await CodexEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ msg: 'Entry not found' });
    
    // In a real app, verify user owns the entry or is admin
    await CodexEntry.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Entry removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
