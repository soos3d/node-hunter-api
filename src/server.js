const express = require('express');
const rateLimit = require("express-rate-limit");
const app = express();
const testNodeLatency = require('./testNodeLatency');
const testNodeSettings = require('./testNodeSettings');
const endpointsList = require('./endpointsList');
require('dotenv').config();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 25, // limit each IP to 25 requests per windowMs
  message: "Too many requests, please try again later"
});

// Apply the limiter to all requests
app.use(limiter);

let results = [];
let settingsResults = []
let lastRun = null;

async function runTests() {
  lastRun = Date.now();
  results = [];
  for (const endpoint of endpointsList) {
    const result = await testNodeLatency(endpoint);
    results.push(result);
  }
  console.log(results);
}

async function runSettings() {

  settingsResults = [];
  for (const endpoint of endpointsList) {
    const settingsResult = await testNodeSettings(endpoint);
    settingsResults.push(settingsResult);
  }
  console.log(settingsResults);
}

const intervalId = setInterval(async () => {
  lastRun = Date.now();
  results = [];
  settingsResults = [];
  runTests();
  runSettings();
}, 900000); // 15 minutes in milliseconds

runTests();
runSettings()

app.get('/results', (req, res) => {
  res.send({ results, lastRun });
});

app.get('/settings', (req, res) => {
  res.send({ settingsResults });
});

// Enable running on-demand tests
/*
app.get('/run-node', async (req, res) => {
  const index = req.query.index;
  const endpoint = endpointsList[index];
  const result = await testNodeLatency(endpoint);
  res.send({ result });
});
*/

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
