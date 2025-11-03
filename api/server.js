const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

app.use(express.json());

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

// Test MongoDB connection
app.get('/api/test', async (req, res) => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      return res.json({ success: false, message: "No MONGODB_URI env var" });
    }
    
    const client = new MongoClient(uri);
    await client.connect();
    await client.close();
    
    res.json({ success: true, message: "MongoDB connected!" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

app.get('/api/load', (req, res) => {
  res.json({ success: true, message: "API works!", userId: req.query.userId });
});

app.post('/api/save', (req, res) => {
  console.log('Save request:', req.body);
  res.json({ success: true });
});

module.exports = app;
