const ticketsModel = require("../models/tickets");
const drawNumbersModel = require("../models/drawNumbers");
const { defaultPageSize } = require('../configs');
const { setOffset } = require("../services");

/**
 * @swagger
 * /drawNumber/hisotry:
 *   get:
 *     tags:
 *       - DrawNumber
 *     summary: Get draw number history
 *     description: Get all draw number history and show the winner.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: start from 1, default 1 if no page
 *       - in: query
 *         name: size
 *         schema:
 *           type: number
 *         description: default 50 if no size
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

const getDrawNumberHistory = async (req, res, next) => {
  try{
    const { query } = req;
    const { page, size } = query;

    // 1. get all frawNumber
    const queryPage = page || 1;
    const querySize = size || defaultPageSize;
    const { offset } = setOffset(queryPage, querySize);
    const drawNumbers = await drawNumbersModel
      .aggregate([
        { $sort: { createdAt: -1} },
        { $facet: {
          results: [
            { $skip: offset },
            { $limit: querySize },
          ],
          totals: [{ $count: 'count' }],
        } }
      ]);
    
    // 2. get relaed tickets
    const results = [];
    for (const drawNumber of drawNumbers[0].results) {
      const { drawNumber: currentDrawNumber, nextDrawNumber, locking, createdAt: drawNumberCreatedAt } = drawNumber;
      
      const totalTicket = await ticketsModel.find({
        drawNumber: currentDrawNumber
      }).count();
      const winner = await ticketsModel.find({
        drawNumber: currentDrawNumber,
        isWinner: true
      });

      results.push({
        drawNumber: currentDrawNumber,
        nextDrawNumber: nextDrawNumber,
        locking,
        drawNumberCreatedAt,
        totalTicket,
        winner,
      });
    }

    res.send({
      page: queryPage,
      results,
      total: drawNumbers[0].totals[0].count,
    })
  } catch (error) {
    if (!/^Excepted:/.test(error.message)) { console.log(error); }
    next(error);
  }
};

module.exports = getDrawNumberHistory;