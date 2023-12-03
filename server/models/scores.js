
const mongoose = require('mongoose');



const scoreSchema = new mongoose.Schema({
  studentName: String,
  assignment1: Number,
  assignment2: Number,
  cat1: Number,
  cat2: Number,
  exam: Number,
});

const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;
