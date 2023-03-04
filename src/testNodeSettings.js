const Web3 = require('web3');

async function isArchive(endpoint) {
    const web3 = new Web3(endpoint);

    // define the address and block number
    const address = '0x19C5D0eB11FC445E8BDB0f800596D533A02A3f79';
    const latestBlock = await web3.eth.getBlockNumber();
    const blockNumber = latestBlock - 1000; // 1000 block behind the head.

    // get the balance of the address at the specified block
    try {
        const balance = await web3.eth.getBalance(address, blockNumber)
        //console.log(balance);
        return true; // It is archive
    } catch (error) {
        //console.log(error);
        return false; // It is not archive
    }
}

async function isDebug(endpoint) {
      const web3 = new Web3(endpoint);
      // define the transaction hash and params
      const txHash = '0x6eb4a0f16e9fe3d12d8c8796ae0c2306d744693bcece2fbdcf2c5f08e77afe18'; // Ethereum chain transaction
      const params = { "tracer": "callTracer" };
  
      // create a debug object using the web3 provider
      web3.extend({
        property: 'eth',
        methods: [{
          name: 'traceTransaction',
          call: 'debug_traceTransaction',
          params: 2,
          inputFormatter: [web3.extend.formatters.inputBlockNumberFormatter, web3.extend.formatters.inputCallFormatter],
          outputFormatter: web3.extend.formatters.outputCallFormatter
        }]
      });

      try {
        const trace = await web3.eth.traceTransaction(txHash, params);
        //console.log(trace);
        return true; // It is debug
    } catch (error) {
        //console.log(error);
        return false; // It is not debug
    }
  }

  async function clientVersion(endpoint) {
    const web3 = new Web3(endpoint);

    try {
        const client = await web3.eth.getNodeInfo();
        const outputString = client.split('/').slice(0, 2).join('/');
        //console.log(outputString);
        return outputString; 

    } catch (error) {
        return error; 

    }
    
  } 

  async function testNodeSettings(nodeEndpoint) {
    
    try {
      const [isArchiveResult, isDebugResult, client] = await Promise.all([isArchive(nodeEndpoint), isDebug(nodeEndpoint), clientVersion(nodeEndpoint)]);
      //console.log(`isArchive: ${isArchiveResult}, isDebug: ${isDebugResult}, client: ${client}`);
      return [isArchiveResult, isDebugResult, client];
    } catch (error) {
      console.error(`Error while testing node settings: ${error}`);
      return [false];
    }
  }
  
module.exports = testNodeSettings;

