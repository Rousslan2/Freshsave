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

// Connection MongoDB avec options SSL
const uri = process.env.MONGODB_URI || "mongodb+srv://rousslanfk_db_user:sZemKJAmuwUQAIb2@fresh.km6f53f.mongodb.net/juicefresh?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  tls: true,
  tlsAllowInvalidCertificates: true,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000
});

// Test MongoDB connection
app.get('/api/test', async (req, res) => {
  try {
    await client.connect();
    res.json({ success: true, message: "MongoDB connected!" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Load player data
app.get('/api/load', async (req, res) => {
  try {
    const { userId } = req.query;
    await client.connect();
    const db = client.db('juicefresh');
    const collection = db.collection('players');
    
    const data = await collection.findOne({ userId });
    if (data) {
      res.json({
        success: true,
        level: data.level || 1,
        gems: data.gems || 0
      });
    } else {
      res.json({ success: false, message: "No data found" });
    }
  } catch (error) {
    console.error('Load error:', error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Save player data
app.post('/api/save', async (req, res) => {
  try {
    const { userId, level, gems, score, stars } = req.body;
    await client.connect();
    const db = client.db('juicefresh');
    const collection = db.collection('players');
    
    await collection.updateOne(
      { userId },
      { 
        $set: { 
          level, 
          gems, 
          lastUpdate: new Date()
        }
      },
      { upsert: true }
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ success: false, message: "Save failed" });
  }
});

module.exports = app;
