const express = require('express');
const rateLimit = require("express-rate-limit");
const app = express();
const testNodeLatency = require('./testNodeLatency');
const endpointsList = require('./endpointsList');
require('dotenv').config();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.PERMITTED_DOMAIN);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 25, // limit each IP to 25 requests per windowMs
  message: "Too many requests, please try again later"
});

// apply the limiter to all requests
app.use(limiter);

let results = [];
let lastRun = null;

const intervalId = setInterval(async () => {
  lastRun = Date.now();
  results = [];
  for (let i = 0; i < endpointsList.length; i++) {
    const endpoint = endpointsList[i];
    const result = await testNodeLatency(endpoint);
    results.push(result);
    console.log(results)
  }
}, 300000); // 5 minutes in milliseconds

app.get('/results', (req, res) => {
  res.send({ results, lastRun });
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
