const mongoose = require('mongoose');
const collectionName = 'drawNumbers';

const schema = new mongoose.Schema(
  {
    locking: Boolean,
    drawNumber: { type: String, required: true },
    nextDrawNumber: { type: String, required: true },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    collection: collectionName,
  }
);

schema.index({ createdAt: -1 });

const model = mongoose.model(collectionName, schema);

schema.pre('save', async (next) => {
  const currentDrawNumber = this.constructor;
  try {
    const existingUnlock = await model.findOne({ locking: false });
    if (existingUnlock) {
      const err = new Error(`existingUnlock: ${existingUnlock._id}`);
      return next(err);
    }
    next();
  } catch (error) {
    return next(error);
  }
});

module.exports = model;