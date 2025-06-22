import React, { useEffect, useState } from 'react';
import axios from 'axios';

function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    status: 'Pending',
    items: [],
  });
  const [editId, setEditId] = useState(null);
  const [newItem, setNewItem] = useState({ item: '', quantity: 1 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchOrders();
    fetchMenuItems();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/Order/view');
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const res = await axios.get('http://localhost:5000/menu/view');
      setMenuItems(res.data);
    } catch (err) {
      console.error('Error fetching menu items:', err);
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNewItemChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const addItemToOrder = () => {
    if (!newItem.item || newItem.quantity <= 0) return;
    setForm({ ...form, items: [...form.items, newItem] });
    setNewItem({ item: '', quantity: 1 });
  };

  const removeItem = (index) => {
    const updatedItems = [...form.items];
    updatedItems.splice(index, 1);
    setForm({ ...form, items: updatedItems });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...form,
        items: form.items.map((i) => ({
          item: i.item,
          quantity: parseInt(i.quantity),
        })),
      };

      if (editId) {
        await axios.put(`http://localhost:5000/Order/${editId}`, payload);
        setMessage('✅ Order updated successfully');
      } else {
        await axios.post('http://localhost:5000/Order/add', payload);
        setMessage('✅ Order placed successfully');
      }

      setForm({ customerName: '', customerPhone: '', status: 'Pending', items: [] });
      setEditId(null);
      fetchOrders();
    } catch (err) {
      console.error(err);
      setMessage('❌ Error submitting order');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleEdit = (order) => {
    const formattedItems = order.items.map((i) => ({
      item: i.item?._id || i.item, // Supports both populated and plain ID
      quantity: i.quantity,
    }));

    setForm({
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      status: order.status,
      items: formattedItems,
    });
    setEditId(order._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/Order/${id}`);
      fetchOrders();
    } catch (err) {
      console.error('Error deleting order:', err);
    }
  };

  const styles = {
    container: {
      padding: '20px',
      fontFamily: 'Segoe UI',
      maxWidth: '900px',
      margin: 'auto',
    },
    formBox: {
      backgroundColor: '#f9f9f9',
      padding: '20px',
      borderRadius: '10px',
      marginBottom: '20px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    },
    input: {
      width: '100%',
      padding: '8px',
      marginBottom: '10px',
    },
    select: {
      width: '100%',
      padding: '8px',
      marginBottom: '10px',
    },
    itemRow: {
      display: 'flex',
      gap: '10px',
      marginBottom: '10px',
      flexWrap: 'wrap',
    },
    button: {
      padding: '8px 12px',
      cursor: 'pointer',
      border: 'none',
      borderRadius: '4px',
    },
    orderCard: {
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '10px',
      backgroundColor: '#fff',
    },
  };

  return (
    <div style={styles.container}>
      <h2>📦 Order Management</h2>
      {message && (
        <p style={{ color: message.startsWith('✅') ? 'green' : 'red' }}>{message}</p>
      )}

      <div style={styles.formBox}>
        <input
          placeholder="Customer Name"
          name="customerName"
          value={form.customerName}
          onChange={handleInputChange}
          style={styles.input}
        />
        <input
          placeholder="Phone"
          name="customerPhone"
          value={form.customerPhone}
          onChange={handleInputChange}
          style={styles.input}
        />

        <select
          name="status"
          value={form.status}
          onChange={handleInputChange}
          style={styles.select}
        >
          <option>Pending</option>
          <option>Confirmed</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>

        <div style={styles.itemRow}>
          <select
            name="item"
            value={newItem.item}
            onChange={handleNewItemChange}
            style={{ flex: 2 }}
          >
            <option value="">Select Item</option>
            {menuItems?.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="quantity"
            value={newItem.quantity}
            min="1"
            onChange={handleNewItemChange}
            style={{ width: '80px' }}
          />
          <button
            onClick={addItemToOrder}
            style={{ ...styles.button, backgroundColor: '#28a745', color: '#fff' }}
          >
            ➕
          </button>
        </div>

        <ul>
          {form.items.map((i, idx) => {
            const itemName = menuItems.find((m) => m._id === i.item)?.name || 'Unknown';
            return (
              <li key={idx}>
                {itemName} × {i.quantity}
                <button onClick={() => removeItem(idx)} style={{ marginLeft: '10px' }}>
                  ❌
                </button>
              </li>
            );
          })}
        </ul>

        <button
          onClick={handleSubmit}
          style={{
            ...styles.button,
            width: '100%',
            backgroundColor: '#007bff',
            color: 'white',
          }}
          disabled={loading}
        >
          {loading ? 'Processing...' : editId ? 'Update Order' : 'Place Order'}
        </button>
      </div>

      <h3>📋 Orders List</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {orders.map((order) => (
          <div key={order._id} style={styles.orderCard}>
            <strong>{order.customerName}</strong> ({order.customerPhone})<br />
            <b>Status:</b> {order.status}
            <br />
            <b>Items:</b>
            <ul>
              {order.items?.map((i, idx) => {
                const item = menuItems.find((m) => m._id === (i.item?._id || i.item));
                return (
                  <li key={idx}>
                    {item?.name || 'Unknown'} × {i.quantity}
                  </li>
                );
              })}
            </ul>
            <p>
              <b>Total:</b> ₹{order.totalAmount}
            </p>
            <button onClick={() => handleEdit(order)} style={styles.button}>
              ✏️ Edit
            </button>
            <button
              onClick={() => handleDelete(order._id)}
              style={{ ...styles.button, marginLeft: '10px', backgroundColor: 'red', color: 'white' }}
            >
              🗑️ Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderManager;
