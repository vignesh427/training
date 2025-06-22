import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/Category/view');
      setCategories(res.data);
    } catch (err) {
      console.error('Fetch Error:', err.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return alert("Category name is required");

    const trimmedForm = {
      name: form.name.trim(),
      description: form.description.trim()
    };

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/Category/${editId}`, trimmedForm);
      } else {
        await axios.post('http://localhost:5000/Category/add', trimmedForm);
      }

      setForm({ name: '', description: '' });
      setEditId(null);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (category) => {
    setForm({ name: category.name, description: category.description });
    setEditId(category._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this category?")) {
      try {
        await axios.delete(`http://localhost:5000/Category/${id}`);
        fetchCategories();
        if (editId === id) {
          setEditId(null);
          setForm({ name: '', description: '' });
        }
      } catch (err) {
        alert("Error deleting category");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2>📦 Category Manager</h2>

      <div style={styles.form}>
        <input
          style={styles.input}
          placeholder="Category Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <textarea
          style={styles.input}
          placeholder="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
        <button onClick={handleSubmit} style={styles.button}>
          {editId ? '🔄 Update Category' : '➕ Add Category'}
        </button>
      </div>

      <hr />

      <h3>📋 Categories</h3>
      <div style={styles.grid}>
        {categories.map((cat) => (
          <div key={cat._id} style={styles.card}>
            <h4>{cat.name}</h4>
            <p>{cat.description || <i>No description</i>}</p>
            <button onClick={() => handleEdit(cat)} style={styles.editBtn}>✏️ Edit</button>
            <button onClick={() => handleDelete(cat._id)} style={styles.deleteBtn}>🗑️ Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    backgroundColor: '#f5f5f5',
    padding: '15px',
    borderRadius: '10px'
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '6px'
  },
  button: {
    padding: '10px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '15px',
    marginTop: '20px'
  },
  card: {
    border: '1px solid #ddd',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '1px 1px 6px #aaa',
    backgroundColor: '#fff'
  },
  editBtn: {
    marginRight: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};

export default CategoryManager;
