const express = require('express');
const pool = require('../db');  // Change import to require()

const router = express.Router();

// Add product to cart
router.post('/add', async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    console.log('Received request to add product to cart:', { userId, productId, quantity });

    // Check if the user has an active cart
    let cart = await pool.query('SELECT * FROM cart WHERE user_id = $1 AND checked_out = false', [userId]);

    if (cart.rows.length === 0) {
      // Create a new cart if none exists
      cart = await pool.query('INSERT INTO cart (user_id) VALUES ($1) RETURNING *', [userId]);
    }

    const cartId = cart.rows[0].id;

    // Add the product to the cart
    await pool.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)', [cartId, productId, quantity]);

    console.log('Product added to cart:', { cartId, productId, quantity });
    res.status(200).json({ message: 'Product added to cart' });
  } catch (err) {
    console.error('Error adding product to cart:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get cart items
router.get('/items', async (req, res) => {
  try {
    console.log('Received request to fetch cart items');
    const cartItems = await pool.query(`
      SELECT ci.product_id, ci.quantity, p.price
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
    `);
    console.log('Cart items fetched:', cartItems.rows);
    res.status(200).json(cartItems.rows);
  } catch (err) {
    console.error('Error fetching cart items:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Clear cart
router.post('/clear', async (req, res) => {
  const userId = 1; // Hardcoded user ID

  try {
    console.log('Received request to clear cart for user:', userId);

    // Get the active cart for the user
    const cart = await pool.query('SELECT * FROM cart WHERE user_id = $1 AND checked_out = false', [userId]);

    if (cart.rows.length > 0) {
      const cartId = cart.rows[0].id;

      // Delete cart items
      await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);

      // Optionally, delete the cart itself
      await pool.query('DELETE FROM cart WHERE id = $1', [cartId]);

      console.log('Cart cleared for user:', userId);
    }

    res.status(200).json({ message: 'Cart cleared' });
  } catch (err) {
    console.error('Error clearing cart:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;  // Use module.exports to export the router