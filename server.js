const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();

const uri = "mongodb+srv://rousslanfk_db_user:Tj5e2o4Xd4KG0BUs@fresh.km6f53f.mongodb.net/?appName=Fresh";
const client = new MongoClient(uri);

app.use(cors());
app.use(express.json());

app.post('/api/save', async (req, res) => {
  try {
    const { userId, field, value } = req.body;
    
    await client.connect();
    const db = client.db('juicefresh');
    
    await db.collection('players').updateOne(
      { userId },
      { 
        $set: { 
          [field]: parseInt(value),
          lastUpdate: new Date()
        }
      },
      { upsert: true }
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/load', async (req, res) => {
  try {
    const { userId } = req.query;
    
    await client.connect();
    const db = client.db('juicefresh');
    
    const player = await db.collection('players').findOne({ userId });
    
    if (player) {
      res.json({
        success: true,
        level: player.level || 1,
        gems: player.gems || 0
      });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('API running on port 3000');
});
