const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs')

const app = express();
app.use(cors());
app.use(bodyParser.json());


// LOGIN
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === '1234') {
    loggedIn = true;
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// LOGOUT
app.post('/auth/logout', (req, res) => {
  loggedIn = false;
  res.status(200).json({ message: 'Logged out' });
});
const DATA_FILE = './cattle-data.json';

let loggedIn = true;  // Replace with your actual auth logic

let cattleData = [];

// Load cattle data from JSON file on server start
function loadCattleData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    cattleData = JSON.parse(data);
  } catch (err) {
    console.error('Failed to load cattle data:', err);
    cattleData = [];
  }
}

// Save cattle data to JSON file
function saveCattleData() {
    fs.writeFile(DATA_FILE, JSON.stringify(cattleData, null, 2), (err) => {
      if (err) console.error('Failed to save cattle data:', err);
    });
  }
  
  loadCattleData();

// GET cattle list
app.get('/cattle', (req, res) => {
  if (!loggedIn) return res.status(401).json({ message: 'Unauthorized' });
  res.json(cattleData);
});

app.get('/cattle/:id', (req, res) => {
    if (!loggedIn) return res.status(401).json({ message: 'Unauthorized' });
    const id = parseInt(req.params.id);
    const cattle = cattleData.find((c) => c.id === id);
    if (cattle) {
      res.json(cattle);
    } else {
      res.status(404).json({ message: 'Cattle not found' });
    }
  });

// ADD new cattle
app.post('/cattle', (req, res) => {
  const newCattle = { id: Date.now(), ...req.body };
  cattleData.push(newCattle);
  saveCattleData();
  res.status(201).json(newCattle);
});

// UPDATE cattle availability
app.patch('/cattle/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { available } = req.body;
  const cattle = cattleData.find(c => c.id === id);
  if (cattle) {
    cattle.available = available;
    saveCattleData();
    res.json(cattle);
  } else {
    res.status(404).json({ message: 'Cattle not found' });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
