const axios = require('axios');
const { port, mongoUrl, drawSchedule, winnerSchedule, defaultPageSize } = require('../configs');

module.exports.drawAPI = async () => {
  try{
    await axios.post(`http://localhost:${port}/draw`)
  } catch (error) {
    // Dont care the error response
  }
};

module.exports.setOffset = (page, size) => {
  const pageSize = size ? Number(size) : defaultPageSize;
  const _page = page && Number(page) > 0 ? Number(page) - 1 : 0;
  const offset = Math.abs(_page * pageSize);

  return { size: pageSize, offset };
}