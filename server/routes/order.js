const express = require('express');
const router = express.Router();
const Order = require('../model/Order');
const MenuItem = require('../model/MenuItem');

// ✅ Create Order
router.post('/add', async (req, res) => {
  try {
    const { items, customerName, customerPhone, status } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }
    if (!customerName || !customerPhone || !status) {
      return res.status(400).json({ message: 'Customer name, phone, and status are required' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (let i of items) {
      if (i.quantity <= 0) {
        return res.status(400).json({ message: `Invalid quantity for item ${i.item}` });
      }

      const menuItem = await MenuItem.findById(i.item);
      if (!menuItem) return res.status(404).json({ message: `Menu item not found: ${i.item}` });

      const itemTotal = menuItem.price * i.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        item: menuItem._id,
        quantity: i.quantity,
        price: menuItem.price
      });
    }

    const newOrder = new Order({
      items: orderItems,
      totalAmount,
      customerName,
      customerPhone,
      status
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', order: newOrder });

  } catch (error) {
    console.error('Order Error:', error);
    res.status(500).json({ message: 'Error placing order', error: error.message });
  }
});

// ✅ View Orders
router.get('/view', async (req, res) => {
  try {
    const order = await Order.find();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// ✅ Update Order
router.put('/:id', async (req, res) => {
  try {
    const { items, customerName, customerPhone, status } = req.body;
    const orderitem = await Order.findByIdAndUpdate(
      req.params.id,
      { items, customerName, customerPhone, status },
      { new: true }
    );
    if (!orderitem) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item updated', item: orderitem });
  } catch (err) {
    res.status(500).json({ message: 'Error updating item', error: err.message });
  }
});

// ✅ Delete Order
router.delete('/:id', async (req, res) => {
  try {
    const deletedorder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedorder) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted', order: deletedorder });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting order', error: err.message });
  }
});

module.exports = router;
