const express = require('express');
const app = express();

app.use(express.json());

// CORS pour WebGL
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Vos routes API
app.get('/api/load', (req, res) => {
  res.json({ success: false, message: "API works!" });
});

app.post('/api/save', (req, res) => {
  console.log('Save:', req.body);
  res.json({ success: true });
});

module.exports = app;
