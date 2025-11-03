const express = require('express');
const app = express();

app.use(express.json());

// Pas de CORS du tout - juste pour test
app.get('/api/load', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.json({ success: false, message: "API works!" });
});

app.post('/api/save', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  console.log('Save:', req.body);
  res.json({ success: true });
});

app.options('*', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(200);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('API running on port ' + port);
});
