const ticketsModel = require("../models/tickets");
const drawNumbersModel = require("../models/drawNumbers");

/**
 * @swagger
 * /drawNumber:
 *   get:
 *     tags:
 *       - DrawNumber
 *     summary: Get draw details by draw number
 *     description: Retrieve draw details based on the provided draw number.
 *     parameters:
 *       - in: query
 *         name: drawNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: The draw number to retrieve details for.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 drawNumber:
 *                   type: string
 *                   description: The draw number.
 *                 nextDrawNumber:
 *                   type: string
 *                   description: The next draw number.
 *                 tickets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The ticket ID.
 *                       drawNumber:
 *                         type: string
 *                         description: The draw number for the ticket.
 *                       isWinner:
 *                         type: string
 *                         description: Indicates if the ticket is a winner.
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The ticket creation date and time.
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: The ticket last update date and time.
 *       500:
 *         description: Server error
 */

const getDrawNumberDetail = async (req, res, next) => {
  try{
    const { query } = req;
    const { drawNumber } = query;

    // 1. pre-check
    if (!drawNumber) { throw new Error("Excepted:Draw number is missing"); }
    const drawNumberInfo = await drawNumbersModel.findOne({ drawNumber }).lean();
    if (!drawNumberInfo) { throw new Error("Excepted:Draw number not found"); }

    // 2. response ticket detail
    const tickets = await ticketsModel.find({ drawNumber }).lean();
    res.send({
      drawNumber: drawNumberInfo.drawNumber,
      nextDrawNumber: drawNumberInfo.nextDrawNumber,
      tickets: tickets
    });
  } catch (error) {
    if (!/^Excepted:/.test(error.message)) { console.log(error); }
    next(error);
  }
};

module.exports = getDrawNumberDetail;