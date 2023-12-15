const draw = require('../controllers/draw');
const getDrawNumberDetail = require('../controllers/getDrawNumberDetail');
const getDrawNumberHistory = require('../controllers/getDrawNumberHistory');
const router = require('express').Router();

// inbound
router.use((req, res, next) => {
    const { method, _parsedUrl } = req;
    const { pathname } = _parsedUrl;
    const startTime = Date.now();

    console.log('inbound', { startTime, method, pathname });

    next();
});

// route
router.post('/draw', draw);
router.get('/drawNumber', getDrawNumberDetail);
router.get('/drawNumber/history', getDrawNumberHistory);

// error handler
router.use((error, req, res, next) => {
  if (/^Excepted:/.test(error.message)) {
    res.status(400).json({
      error: 'Error',
      message: (error.message).split("Excepted:")[1]
    });
  } else {
    // Set the status code and return the error response
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An internal server error occurred'
    });
  }
  next();
});

module.exports = router;