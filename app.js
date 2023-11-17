const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const jsonFilePath = 'hospitalData.json';

// Read hospital data from JSON file
function readData() {
  try {
    const data = fs.readFileSync(jsonFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Write hospital data to JSON file
function writeData(data) {
  fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), 'utf8');
}

// Get all hospitals
app.get('/hospitals', (req, res) => {
  const hospitals = readData();
  console.log('All Hospitals:', hospitals);
  res.json(hospitals);
});

// Get a specific hospital by name
app.get('/hospitals/:name', (req, res) => {
  const hospitals = readData();
  const hospital = hospitals.find(h => h.name === req.params.name);

  if (hospital) {
    res.json(hospital);
  } else {
    res.status(404).json({ error: 'Hospital not found' });
  }
});

// Add a new hospital
app.post('/hospitals', (req, res) => {
  const hospitals = readData();
  const newHospital = req.body;

  hospitals.push(newHospital);
  writeData(hospitals);

  res.json(newHospital);
});

// Update a hospital by name
app.put('/hospitals/:name', (req, res) => {
  const hospitals = readData();
  const index = hospitals.findIndex(h => h.name === req.params.name);

  if (index !== -1) {
    hospitals[index] = req.body;
    writeData(hospitals);
    res.json(req.body);
  } else {
    res.status(404).json({ error: 'Hospital not found' });
  }
});

// Delete a hospital by name
app.delete('/hospitals/:name', (req, res) => {
  const hospitals = readData();
  const index = hospitals.findIndex(h => h.name === req.params.name);

  if (index !== -1) {
    const deletedHospital = hospitals.splice(index, 1);
    writeData(hospitals);
    res.json(deletedHospital[0]);
  } else {
    res.status(404).json({ error: 'Hospital not found' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
