const env = require("dotenv").config();

module.exports = {
	port: process.env.PORT,
	mongoUrl: process.env.MONGO_URL,
	drawSchedule: process.env.DRAW_SCHEDULE,
	winnerSchedule: process.env.WINNER_SCHEDULE
};