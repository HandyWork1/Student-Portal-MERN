const mongoose = require("mongoose");

const studentCourseSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  courseId: { type: String, required: true },
  semester: {
    type: String,
    required: true,
  },
});

const StudentCourse = mongoose.model("StudentCourse", studentCourseSchema);

module.exports = StudentCourse;

