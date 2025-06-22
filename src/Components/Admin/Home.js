import React from 'react';
import MenuManager from './MenuManager';

function Home() {
  return (
    <div className="home-page" style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Welcome to Our Restaurant</h1>
      <p>Explore our delicious menu below!</p>
      <MenuManager />
    </div>
  );
}

export default Home;
