import React, { useEffect, useState } from 'react';
import { Card, Button, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';


function MenuUserCard() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/menu/view')
      .then(res => {
        setMenuItems(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('⚠️ Failed to fetch menu items.');
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (item) => {
    setCart([...cart, item]);
    alert(`🛒 ${item.name} added to cart!`);
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Loading menu items...</p>
      </Container>
    );
  }

  if (error) {
    return <Alert variant="danger" className="mt-3 text-center">{error}</Alert>;
  }

  return (
    <div style={{
      background: 'linear-gradient(to bottom right, #4BD6FB, #3DD2B6)',
      minHeight: '100vh',
      paddingTop: '40px',
      paddingBottom: '40px',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <Container>
        <h2 className="text-center text-success mb-4">🍽️ Explore Our Delicious Menu</h2>
        <Row className="justify-content-center">
          {menuItems.map(item => (
            <Col key={item._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card
                className="h-100 shadow-sm border-0"
                style={{
                  borderRadius: '15px',
                  transition: 'transform 0.2s',
                  backgroundColor: ' white'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Card.Img
                  variant="top"
                  src={item.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                  style={{
                    height: '200px',
                    objectFit: 'cover',
                    borderTopLeftRadius: '15px',
                    borderTopRightRadius: '15px'
                  }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-dark">{item.name}</Card.Title>
                  <Card.Text className="text-muted" style={{ fontSize: '0.9rem' }}>
                    {item.description}
                  </Card.Text>
                  <div className="mt-auto">
                    <Card.Text><strong>₹{item.price}</strong></Card.Text>
                    <Card.Text className="text-secondary" style={{ fontSize: '0.85rem' }}>
                      Category: {item.category}
                    </Card.Text>
                    <Button style={{backgroundColor:' #00FFDE'}} variant="success" className="w-100 mt-2" onClick={() => handleAddToCart(item)}>
                      🛒 Add to Cart
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default MenuUserCard;
