const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  studentName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  studentCourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentCourse',
    required: true,
  },
  assignment1: {
    type: Number,
    required: true,
    max: 10,
  },
  assignment2: {
    type: Number,
    required: true,
    max: 10,
  },
  cat1: {
    type: Number,
    required: true,
    max: 20,
  },
  cat2: {
    type: Number,
    required: true,
    max: 20,
  },
  exam: {
    type: Number,
    required: true,
    max: 40,
  },
  // Add other properties related to a score
});

const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;
