const ticketsModel = require("../models/tickets");
const drawNumbersModel = require("../models/drawNumbers");

/**
 * @swagger
 * /draw:
 *   post:
 *     tags:
 *       - Ticket
 *     summary: Create a ticket
 *     description: Create a new draw and retrieve the ticket number, draw number, and current draw number.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ticketNumber:
 *                   type: string
 *                   description: The ticket number for the draw.
 *                 drawNumber:
 *                   type: string
 *                   description: The draw number for the draw.
 *                 currentDrawNumber:
 *                   type: string
 *                   description: The current draw number.
 *       500:
 *         description: Server error
 *       400:
 *         description: Expected error
 */

const draw = async (req, res, next) => {
  try{
    // 1. get last draw number
    const lastDrawNumber = await drawNumbersModel.findOne({}).sort({ createdAt: -1 });
    const { drawNumber, locking, nextDrawNumber } = lastDrawNumber || { locking: true };

    // 2. throw error if current is not allow to draw
    if (locking && !nextDrawNumber) { throw new Error("Excepted:Draw is locking"); }

    // 3. insert ticket response
    const ticket = await ticketsModel.create({
      drawNumber: !locking? drawNumber : nextDrawNumber,
    });
    delete ticket.isWinner;

    // 4. response ticket id
    res.send({
      ticketNumber: ticket._id,
      drawNumber: ticket.drawNumber,
      currentDrawNumber: drawNumber,
    });
  } catch (error) {
    if (!/^Excepted:/.test(error.message)) { console.log(error); }
    next(error);
  }
};

module.exports = draw;