require('dotenv').config();

const endpointsList = [
    process.env.CHAINSTACK_AWS_VIRGINIA,
    process.env.ALCHEMY,
    process.env.QUICKNODE,
    process.env.INFURA,
  ];
  
module.exports = endpointsList;
  