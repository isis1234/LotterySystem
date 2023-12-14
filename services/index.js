const axios = require('axios');
const { port, mongoUrl, drawSchedule, winnerSchedule } = require('../configs');

module.exports.drawAPI = async () => {
  try{
    await axios.post(`http://localhost:${port}/draw`)
  } catch (error) {
    // Dont care the error response
  }
};
