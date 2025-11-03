app.get('/api/test', async (req, res) => {
  try {
    console.log('Environment check:');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('URI length:', process.env.MONGODB_URI?.length || 0);
    
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      return res.json({ success: false, message: "MONGODB_URI not set in Vercel" });
    }
    
    console.log('Attempting connection...');
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000
    });
    
    await client.connect();
    console.log('✅ Connected!');
    
    const db = client.db('juicefresh');
    const collections = await db.collections();
    
    await client.close();
    
    res.json({ 
      success: true, 
      message: "MongoDB connected!", 
      collections: collections.length,
      db: 'juicefresh'
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.json({ 
      success: false, 
      message: error.message, 
      code: error.code,
      codeName: error.codeName
    });
  }
});
