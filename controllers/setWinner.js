const ticketsModel = require("../models/tickets");
const drawNumbersModel = require("../models/drawNumbers");
const { v4: uuidv4 } = require('uuid');

const setWinner = async () => {
  try{
    // 1. get last draw number
    const lastDrawNumber = await drawNumbersModel.findOne({ locking: false }).sort({ createdAt: -1 });
    const { _id, drawNumber, locking, nextDrawNumber } = lastDrawNumber || { };

    if (drawNumber) {
      // 2. set locking = true if last drawNumber found.
      await drawNumbersModel.updateOne({ _id }, { locking: true });

      // 3. get winner if last drawNumber found
      const totalTickets = await ticketsModel.countDocuments({ drawNumber });
      const randomSkip = Math.floor(Math.random() * totalTickets);
      const winner = await ticketsModel.findOne({ drawNumber }).skip(randomSkip);
      await ticketsModel.updateOne({ _id: winner._id }, { isWinner: true });
      console.log(`drawNumber:${drawNumber} winner:${winner._id}`);
    }

    // 4. insert new drawNumber
    await drawNumbersModel.create({
      drawNumber: nextDrawNumber || uuidv4(),
      locking: false,
      nextDrawNumber: uuidv4(),
    });
  } catch (error) {
    if (!/^Excepted:/.test(error.message)) { console.log(error); }
    next(error);
  }
};

module.exports = setWinner;