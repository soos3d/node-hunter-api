const express = require('express');
const app = express();
const testNodeLatency = require('./testNodeLatency');
const endpointsList = require('./endpointsList');
require('dotenv').config();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

let results = [];

const intervalId = setInterval(async () => {
  results = [];
  for (let i = 0; i < endpointsList.length; i++) {
    const endpoint = endpointsList[i];
    const result = await testNodeLatency(endpoint);
    results.push(result);
    console.log(results)
  }
}, 300000); // 5 minutes in milliseconds

app.get('/results', (req, res) => {
  res.send({ results });
});

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

