require('dotenv').config();

const endpointsList = [
    process.env.CHAINSTACK_AWS_VIRGINIA,
    process.env.ALCHEMY,
    process.env.QUICKNODE,
    process.env.INFURA,
    process.env.ANKR,
    process.env.CLOUDFLARE,
    process.env.FLASHBOTS,
    process.env.LAMA,
    process.env.RIVET,
  ];
  
module.exports = endpointsList;
  