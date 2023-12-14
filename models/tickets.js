const mongoose = require('mongoose');
const collectionName = 'tickets';

const schema = new mongoose.Schema(
  {
    drawNumber: { type: String, required: true },
    isWinner: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    collection: collectionName,
  }
);

schema.index({ drawNumber: -1 });

const model = mongoose.model(collectionName, schema);

module.exports = model;