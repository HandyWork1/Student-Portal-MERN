const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ['Student', 'Lecturer', 'Admin'],
    required: true,
  },
  // For Lecturer: courseId represents the course they teach
  // For Student: courses represents an array of courses they're registered for
  courseId: {
    type: String,
    ref: 'courses',
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'courses',
  }],
});

const Users = mongoose.model('Users', userSchema);

module.exports = Users;

