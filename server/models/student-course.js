const mongoose = require('mongoose');

const studentCourseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  scores: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Score',
  }],
});

const StudentCourse = mongoose.model('StudentCourse', studentCourseSchema);

module.exports = StudentCourse;
