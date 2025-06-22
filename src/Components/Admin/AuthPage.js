import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setForm({ name: '', email: '', password: '', confirmPassword: '' });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword } = form;

    if (!email || !password || (!isLogin && (!name || !confirmPassword))) {
      Swal.fire('⚠️ Missing Fields', 'Please fill all the required fields.', 'warning');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire('⚠️ Invalid Email', 'Please enter a valid email address.', 'warning');
      return false;
    }

    if (!isLogin && password !== confirmPassword) {
      Swal.fire('❌ Password Mismatch', 'Passwords do not match.', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (isLogin) {
        const res = await axios.post('http://localhost:5000/auth/login', {
          email: form.email,
          password: form.password,
        });

        Swal.fire({
          icon: 'success',
          title: `Welcome back, ${res.data.name || 'User'}!`,
          text: 'Redirecting to dashboard...',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });

        setTimeout(() => navigate('/dashboard'), 2000);

      } else {
        const res = await axios.post('http://localhost:5000/auth/signup', {
          name: form.name,
          email: form.email,
          password: form.password,
        });

        Swal.fire({
          icon: 'success',
          title: `Account created for ${res.data.name || form.name}!`,
          text: 'You can now log in.',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });

        setIsLogin(true);
      }

      setForm({ name: '', email: '', password: '', confirmPassword: '' });
    } catch (err) {
      Swal.fire('❌ Error', err.response?.data?.message || 'Something went wrong.', 'error');
    }
  };

  // Add glowing and emoji animation
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes emojiFlare {
        0% { transform: rotate(0deg); opacity: 0.8; }
        25% { transform: rotate(90deg); opacity: 1; }
        50% { transform: rotate(180deg); opacity: 0.8; }
        100% { transform: rotate(360deg); opacity: 0.8; }
      }

      @keyframes whiteGlowSweep {
        0% {
          left: -100%;
          opacity: 0;
        }
        50% {
          left: 50%;
          opacity: 0.6;
        }
        100% {
          left: 100%;
          opacity: 0;
        }
      }

      .flare-button {
        position: relative;
        z-index: 1;
        overflow: hidden;
        box-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
      }

      .flare-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.71), transparent);
        animation: whiteGlowSweep 2s linear infinite;
        z-index: 0;
      }

     
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>{isLogin ? ' Login' : '📝 Sign Up'}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="👤 Name"
              value={form.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="📧 Email"
            value={form.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="🔒 Password"
            value={form.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="🔁 Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              style={styles.input}
            />
          )}
          <button type="submit" className="flare-button" style={styles.button}>
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>
        <button onClick={toggleMode}  style={styles.toggleBtn}>Don't have an accout
          {isLogin ? ' (Signup)' : '🔙 Back to Login'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(to right, #fbc2eb, #a6c1ee)',
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    background: '#fff',
    padding: '30px',
    borderRadius: '15px',
    width: '320px',
    textAlign: 'center',
    boxShadow: '0 0 20px rgba(0,0,0,0.2)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: '10px'
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '14px'
  },
  button: {
    padding: '12px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden'
  },
  toggleBtn: {
    marginTop: '15px',
    background: 'transparent',
    color: '#007bff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    textDecoration: 'none'
  }
};

export default AuthPage;
