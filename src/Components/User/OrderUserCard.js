import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';

function OrderUserCard({ selectedItems = [] }) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  const handlePlaceOrder = async () => {
    if (!customerName || !customerPhone || selectedItems.length === 0) {
      setError('All fields and at least one item are required.');
      return;
    }

    setPlacing(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/order/add', {
        customerName,
        customerPhone,
        items: selectedItems.map(item => ({
          item: item._id,
          quantity: item.quantity
        })),
        status: 'Pending'
      });

      setMessage(response.data.message || 'Order placed successfully');
    } catch (err) {
      setError('❌ Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  const handleCancel = () => {
    setCustomerName('');
    setCustomerPhone('');
    setMessage('');
    setError('');
  };

  const totalAmount = selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow" style={{ borderRadius: '20px', background: '#F4FCFF' }}>
        <h3 className="text-center text-primary mb-4">🛒 Place Your Order</h3>

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="customerName">
                <Form.Label>Customer Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="customerPhone">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your phone number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <h5 className="mt-4">🧾 Items Summary</h5>
          <ul>
            {selectedItems.map(item => (
              <li key={item._id}>
                {item.name} x {item.quantity} = ₹{item.price * item.quantity}
              </li>
            ))}
          </ul>

          <h5 className="mt-3">Total: ₹{totalAmount}</h5>

          <div className="d-flex justify-content-between mt-4">
            <Button
              style={{ backgroundColor: '#00FFDE', borderColor: '#00FFDE', color: 'black' }}
              onClick={handlePlaceOrder}
              disabled={placing}
            >
              ✅ Place Order
            </Button>

            <Button variant="outline-danger" onClick={handleCancel}>
              ❌ Cancel
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default OrderUserCard;
