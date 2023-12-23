const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  assignment1: {
    type: Number,
    required: true,
  },
  assignment2: {
    type: Number,
    required: true,
  },
  cat1: {
    type: Number,
    required: true,
  },
  cat2: {
    type: Number,
    required: true,
  },
  exam: {
    type: Number,
    required: true,
  },
  // Add other properties related to a score
});

const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;
