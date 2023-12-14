const axios = require('axios');
const { port, mongoUrl, drawSchedule, winnerSchedule } = require('../configs');

module.exports.drawAPI = () => {
  // no need to wait, dont are when will call
  axios.post(`http://localhost:${port}/draw`)
};
