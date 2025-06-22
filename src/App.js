// App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import AuthPage from './Components/Admin/AuthPage';
import Home from './Components/Admin/Home';
import AdminPage from './Components/Admin/AdminPage';
import Dashboard from './Components/Admin/Dashboard';
import MenuManager from './Components/Admin/MenuManager';
import CategoryManager from './Components/Admin/CategoryManager';
import OrderManager from './Components/Admin/OrderManager';
import MenuUserCard from './Components/User/MenuUserCard';
import OrderUserCard from './Components/User/OrderUserCard';


function App() {
  return (
    <Router>
      {/* Optional: Navbar can go here if used globally */}

      <MenuUserCard/>
      <OrderUserCard/>
      
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/menumanager" element={<MenuManager />} />
        <Route path="/category" element={<CategoryManager />} />
        <Route path="/orders" element={<OrderManager />} />
        <Route path="/menu" element={<MenuUserCard />} />
      </Routes>
    </Router>
  );
}

export default App;
