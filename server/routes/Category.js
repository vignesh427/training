const express = require('express');
const router = express.Router();
const Category = require('../model/Category');

// ✅ Create category
router.post('/add', async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) return res.status(400).json({ message: 'Category name is required' });

    const existing = await Category.findOne({ name });
    if (existing) return res.status(409).json({ message: 'Category already exists' });

    const category = new Category({ name, description });
    await category.save();

    res.status(201).json({ message: 'Category created', category });
  } catch (err) {
    res.status(500).json({ message: 'Error creating category', error: err.message });
  }
});

// ✅ Get all categories
router.get('/view', async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });                      
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories', error: err.message });
  }
});

// ✅ Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching category', error: err.message });
  }
});

// ✅ Update category by ID
router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json({ message: 'Order updated', category: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating category', error: err.message });
  }
});

// ✅ Delete category by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Category not found' });

    res.status(200).json({ message: 'Category deleted', category: deleted });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting category', error: err.message });
  }
});

module.exports = router;
