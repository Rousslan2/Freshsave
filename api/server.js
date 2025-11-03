const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

app.use(express.json());

// CORS
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

// Connection MongoDB
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

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
        gems: data.gems || 0,
        scores: data.scores || {},
        stars: data.stars || {}
      });
    } else {
      res.json({ success: false, message: "No data found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

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
          [`score_${level - 1}`]: score,
          [`stars_${level - 1}`]: stars,
          lastUpdate: new Date()
        }
      },
      { upsert: true }
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Save failed" });
  }
});

module.exports = app;
