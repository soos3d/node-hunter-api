const Web3 = require('web3');

async function testNodeLatency(endpoint) {
    console.log('running...')
    const web3 = new Web3(endpoint);

    // Change the rounds contant to run the test more or less times
    const rounds = 11;
    let time = 0;
    let responses = [];
  
    for (let round = 0; round < rounds; round++) {
      // Send a request to the node and calculate how long it takes
      const start = Date.now();
      try {
        await web3.eth.getBlockNumber();
      } catch (error) {
        console.error(`Request ${round} failed: ${error}`);
        return false;
      }
      const end = Date.now();

      const result = end - start;

      // Add each response time to the array
      responses.push(result)

      // Sum the total time so far
      time += result;
    }

    //console.log(responses[0])
    console.log(`Not optimized average latency: ${time/rounds} ms`)

    // Isolate the first call of the sequence
    const firstCall = responses[0];

    // Calculate the average removing the first call
    const average = (time - firstCall) / (rounds -1);

    //console.log(`total: ${time}`)
    console.log(endpoint.substring(0, 20))
    console.log(`Average request time based on ${rounds} requests is ${average.toFixed(2)}ms \n`);
    return average.toFixed(2);
}

module.exports = testNodeLatency;

