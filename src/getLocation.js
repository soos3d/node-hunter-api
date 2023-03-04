const axios = require('axios');

async function getLocation(endpoint) {

  try {
    // Extract the hostname from the endpoint
    const hostname = endpoint.split("//")[1].split("/")[0];

    // Query the ip=api
    const response = await axios.get(`http://ip-api.com/json/${hostname}`);
    //console.log(response.data)

    // Get the data we want from the response
    const region = response.data.regionName
    const country = response.data.countryCode

    // Pack the data into an array and return
    const location = [region, country]
    return location

  } catch (error) {
    //console.error(error);
    return false
  }
}

module.exports = getLocation;