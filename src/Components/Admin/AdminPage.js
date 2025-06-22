import React from 'react';
import CategoryManager from './CategoryManager';
import MenuManager from './MenuManager'; // ✅ FIXED path
import OrderManager from './OrderManager';

function AdminPage() {
  return (
    <div>
      <h1>Admin_Dashboard</h1>
      <CategoryManager />
      <MenuManager />
      <OrderManager />
    </div>
  );
}

export default AdminPage;
