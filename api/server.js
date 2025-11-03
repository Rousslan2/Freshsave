const express = require('express');
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

app.get('/api/test', (req, res) => {
  try {
    const hasMongo = !!require('mongodb');
    const hasUri = !!process.env.MONGODB_URI;
    
    res.json({
      success: true,
      message: "Function works!",
      mongodb: hasMongo,
      uri: hasUri,
      uriLength: process.env.MONGODB_URI?.length || 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack
    });
  }
});

module.exports = app;
