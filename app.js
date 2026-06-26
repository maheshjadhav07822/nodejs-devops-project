const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to NodeJS DevOps Project!  ',
    version: '1.0.0',
    status: 'Running'
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime()
  });
});

// Hello route
app.get('/hello', (req, res) => {
  res.json({
    message: 'Hello from NodeJS Application!'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
