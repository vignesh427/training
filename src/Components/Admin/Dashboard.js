import React, { useState } from 'react';
import MenuManager from './MenuManager';
import CategoryManager from './CategoryManager';
import OrderManager from './OrderManager'; // You need to build this similar to others

function DashboardPage() {
  const [tab, setTab] = useState('menu');

  const tabStyle = (active) => ({
    padding: '10px 20px',
    margin: '0 10px',
    cursor: 'pointer',
    borderBottom: active ? '3px solid #007bff' : 'none',
    fontWeight: active ? 'bold' : 'normal',
    backgroundColor: active ? '#f0f8ff' : '#eaeaea',
    borderRadius: '8px 8px 0 0'
  });

  return (
    <div style={{ maxWidth: '1200px', margin: 'auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>📊 Restaurant Admin Dashboard</h1>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <div style={tabStyle(tab === 'menu')} onClick={() => setTab('menu')}>🍽️ Menu Items</div>
        <div style={tabStyle(tab === 'category')} onClick={() => setTab('category')}>📦 Categories</div>
        <div style={tabStyle(tab === 'orders')} onClick={() => setTab('orders')}>🧾 Orders</div>
      </div>

      {/* Tab Contents */}
      <div style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '20px', background: '#fff' }}>
        {tab === 'menu' && <MenuManager />}
        {tab === 'category' && <CategoryManager />}
        {tab === 'orders' && <OrderManager />}
      </div>
    </div>
  );
}

export default DashboardPage;
