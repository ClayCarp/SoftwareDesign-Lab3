const express = require('express');
const path = require('path');
const { fileURLToPath } = require('url');
const cartRoutes = require('./routes/cart');

const app = express();
const port = process.env.PORT || 8080;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'frontend' directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Use the cart routes
app.use('/cart', cartRoutes);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});