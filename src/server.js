const express = require('express');
const rateLimit = require("express-rate-limit");
const app = express();
const testNodeLatency = require('./testNodeLatency');
const testNodeSettings = require('./testNodeSettings');
const getLocation = require('./getLocation');
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
let location = []
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
  console.log(`Running settings test...`)
  settingsResults = [];
  for (const endpoint of endpointsList) {
    const settingsResult = await testNodeSettings(endpoint);
    settingsResults.push(settingsResult);
  }
  console.log(settingsResults);
}

async function findLocation() {
  console.log(`Running location test...`)
  location = [];
  for (const endpoint of endpointsList) {
    const findLocation = await getLocation(endpoint);
    location.push(findLocation);
  }
  console.log(location);
}

const intervalId = setInterval(async () => {
  lastRun = Date.now();
  results = [];
  settingsResults = [];
  await runTests();
  await runSettings();
  await findLocation();
}, 900000); // 15 minutes in milliseconds

// Run the tests once when the server is deployed
async function  main() {
  await runTests();
  await runSettings();
  await findLocation();
}

main()

app.get('/results', (req, res) => {
  res.send({ results, lastRun });
});

app.get('/settings', (req, res) => {
  res.send({ settingsResults });
});

app.get('/location', (req, res) => {
  res.send({ location });
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
