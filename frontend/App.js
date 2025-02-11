import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', quantity: '' });

  useEffect(() => {
    const fetchItems = async () => {
      const res = await axios.get('http://localhost:5000/api/items');
      setItems(res.data);
    };
    fetchItems();
  }, []);

  const addItem = async (e) => {
    e.preventDefault();
    const res = await axios.post('http://localhost:5000/api/items', form);
    setItems([...items, res.data]);
    setForm({ name: '', price: '', quantity: '' });
  };

  return (
    <div>
      <h1>Shopping Cart</h1>
      <form onSubmit={addItem}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          required
        />
        <button type="submit">Add Item</button>
      </form>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price} x {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
