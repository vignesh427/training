const express = require('express');
const router = express.Router();
const MenuItem = require('../model/MenuItem');

// GET all
router.get('/view', async (req, res) => {
  const items = await MenuItem.find().sort({ createdAt: -1 });
  res.json(items);
});

// POST new item
router.post('/add', async (req, res) => {
  try {
    const newItem = new MenuItem(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add item', details: err.message });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update item', details: err.message });
  }
});

// DELETE item
router.delete('/:id', async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete item', details: err.message });
  }
});

module.exports = router;
