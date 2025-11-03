app.post('/api/save', async (req, res) => {
  try {
    const { userId, ...data } = req.body;  // ← RÉCUPÈRE TOUTES LES DONNÉES
    console.log('Saving data for user:', userId, data);
    
    await client.connect();
    const db = client.db('juicefresh');
    const collection = db.collection('players');
    
    // Créer un objet de mise à jour dynamique
    const updateData = { lastUpdate: new Date() };
    Object.keys(data).forEach(key => {
      updateData[key] = data[key];
    });
    
    await collection.updateOne(
      { userId },
      { $set: updateData },
      { upsert: true }
    );
    
    console.log('✅ Data saved to MongoDB for user:', userId);
    res.json({ success: true });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ success: false, message: "Save failed" });
  }
});
