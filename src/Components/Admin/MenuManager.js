import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MenuManager() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: '', price: '', description: '', category: '', image: ''
  });
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:5000/menu/view');
      setItems(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to fetch menu items");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
      setPreview(reader.result);
    };
    reader.readAsDataURL(file); // This converts the image to base64 (e.g., data:image/jpeg;base64,...)
  }
};

  

  const validateForm = () => {
    if (!form.name.trim() || !form.price || !form.category.trim()) {
      alert("Name, Price, and Category are required fields.");
      return false;
    }
    const price = parseFloat(form.price);
    if (isNaN(price) || price < 0) {
      alert("Please enter a valid positive number for price.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!form.image && !editId) {
      alert("Please upload an image before submitting.");
      return;
    }

    try {
      const payload = {
        name: form.name.trim(),
        price: parseFloat(form.price),
        description: form.description.trim(),
        category: form.category.trim(),
        image: form.image
      };

      if (editId) {
        await axios.put(`http://localhost:5000/menu/${editId}`, payload);
        alert("Item updated successfully!");
      } else {
        await axios.post('http://localhost:5000/menu/add', payload);
        alert("Item added successfully!");
      }

      setForm({ name: '', price: '', description: '', category: '', image: '' });
      setPreview(null);
      setEditId(null);
      fetchItems();
    } catch (err) {
      console.error("Submit error:", err);
      alert("Error saving item. Please try again.");
    }
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      price: item.price,
      description: item.description,
      category: item.category,
      image: item.image || ''
    });
    setEditId(item._id);
    setPreview(item.image || null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`http://localhost:5000/menu/${id}`);
        alert("Item deleted successfully!");
        fetchItems();
      } catch (err) {
        console.error("Delete error:", err);
        alert("Error deleting item.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2>🍽️ Menu Management</h2>

      <div style={styles.form}>
        <input
          style={styles.input}
          placeholder="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          style={styles.input}
          placeholder="Price"
          name="price"
          value={form.price}
          onChange={handleChange}
          type="number"
        />
        <textarea
          style={styles.input}
          placeholder="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          style={styles.input}
          placeholder="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
        />
        <input
          style={styles.input}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            style={{ width: 150, margin: '10px 0', borderRadius: 10 }}
          />
        )}
        <button onClick={handleSubmit} style={styles.button}>
          {editId ? '🔄 Update Item' : '➕ Add Item'}
        </button>
      </div>

      <hr />
      <h3>📋 Menu Items</h3>
      <div style={styles.grid}>
        {items.map((item) => (
          <div key={item._id} style={styles.card}>
            {item.image && (
              <img src={item.image} alt={item.name} style={styles.image} />
            )}
            <h4>{item.name}</h4>
            <p>₹ {item.price}</p>
            <p>{item.description}</p>
            <small>📁 {item.category}</small>
            <div>
              <button onClick={() => handleEdit(item)} style={styles.editBtn}>
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                style={styles.deleteBtn}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    background: '#f8f8f8',
    padding: '15px',
    borderRadius: '10px'
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc'
  },
  button: {
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px'
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '15px',
    textAlign: 'center',
    boxShadow: '2px 2px 8px #ccc'
  },
  image: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px'
  },
  editBtn: {
    margin: '5px',
    padding: '5px 10px',
    backgroundColor: '#2196F3',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  deleteBtn: {
    margin: '5px',
    padding: '5px 10px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};

export default MenuManager;
