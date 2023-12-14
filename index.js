const cron = require('cron');
const express = require('express');
const mongoose = require('mongoose');

const { port, mongoUrl, drawSchedule, winnerSchedule } = require('./configs');
const routes = require('./routes');
const { drawAPI } = require('./services');
const setWinner = require('./controllers/setWinner');
const swagger = require('./swagger');
const app = express();

// Mongoose setup
mongoose.connect(mongoUrl).then(() => { console.log(`MongoDB(${mongoUrl}) connected`); });

// Swagger setup
swagger(app);

// Router setup
app.use('/', routes);

// Cron setup
const drawJob = new cron.CronJob(drawSchedule, async () => { await drawAPI(); });
const setWinnerJob = new cron.CronJob(winnerSchedule, async () => { await setWinner(); });

app.listen(port, () => {
  console.log(`Server(${port}) listening`);
  
  // Init the drawNumber and get the new winner
  setWinnerJob.start();

  // Todo: remove it when draw system ready
  drawJob.start();
});
