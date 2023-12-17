const ticketsModel = require("../models/tickets");
const drawNumbersModel = require("../models/drawNumbers");
const { defaultPageSize } = require('../configs');
const { setOffset } = require("../services");

/**
 * @swagger
 * /drawNumber/history:
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
 *                 page:
 *                   type: number
 *                   description: The page number.
 *                 total:
 *                   type: number
 *                   description: The total number of drawNumber.
 *                 tickets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       drawNumber:
 *                         type: string
 *                         description: The draw number.
 *                       nextDrawNumber:
 *                         type: string
 *                         description: The next draw number.
 *                       winner:
 *                         type: array
 *                         description: List of the winners (in case any bugs found).
 *                       drawNumberCreatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: The ticket creation date and time.
 *                       totalTicket:
 *                         type: number
 *                         description: The number of total draw.
 *       500:
 *         description: Server error
 */

const getDrawNumberHistory = async (req, res, next) => {
  try{
    const { query } = req;
    const { page, size } = query;

    // 1. Pre-check
    if(!Number(page)) { throw Error("Excepted:page is not a number."); }
    if(!Number(size)) { throw Error("Excepted:size is not a number."); }

    // 2. get all frawNumber
    const queryPage = Number(page) || 1;
    const querySize = Number(size) || defaultPageSize;
    const { offset } = setOffset(queryPage, querySize);
    const relatedDrawNumbers = await drawNumbersModel
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
    const totalDrawNumber = relatedDrawNumbers[0].totals[0].count;
    const totalPage = Math.ceil(totalDrawNumber/size);

    // // 3. get total ticket
    // const drawNumberCount = await drawNumbersModel.find({}).count();
    
    // 2. get relaed tickets
    const results = [];
    for (const drawNumber of relatedDrawNumbers[0].results) {
      const { drawNumber: currentDrawNumber, nextDrawNumber, locking, createdAt: drawNumberCreatedAt } = drawNumber;
      
      const totalTicket = await ticketsModel.find({
        drawNumber: currentDrawNumber
      }).count();
      const winners = await ticketsModel.find({
        drawNumber: currentDrawNumber,
        isWinner: true
      });

      results.push({
        drawNumber: currentDrawNumber,
        nextDrawNumber: nextDrawNumber,
        locking,
        drawNumberCreatedAt,
        totalTicket,
        winners,
      });
    }

    res.send({
      totalDrawNumber,
      totalPage,
      page: queryPage,
      results,
    })
  } catch (error) {
    if (!/^Excepted:/.test(error.message)) { console.log(error); }
    next(error);
  }
};

module.exports = getDrawNumberHistory;