const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  lecturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users', // Reference to the lecturer teaching the course
  },
});

const Course = mongoose.model('courses', courseSchema);

module.exports = Course;

