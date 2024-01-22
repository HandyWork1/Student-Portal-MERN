// Import necessary modules and models
const express = require("express");
const router = express.Router();
const StudentCourse = require("../models/student-course");
const Course = require("../models/course");
const User = require("../models/users");

// Endpoint to get students registered for the lecturer's course
router.get('/lecturer/students/:courseCode', async (req, res) => {
    try {
      const courseCode = req.params.courseCode;
  
      // Find the course details using the course code
      const course = await Course.findOne({ code: courseCode });
  
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      // Fetch student courses for the given course and populate user details
      const studentCourses = await StudentCourse.find({ course: course._id })
        .populate({
          path: 'user',
          model: User,
        });
  
      // Organize students by semester
      const studentsBySemester = {};
      studentCourses.forEach(course => {
        const semester = course.semester || 'Unknown Semester';
        if (!studentsBySemester[semester]) {
          studentsBySemester[semester] = [];
        }
        studentsBySemester[semester].push(course);
      });
      console.log(studentsBySemester);
      res.json({ studentsBySemester });
    } catch (error) {
      console.error("Error fetching students for the lecturer:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  
// Export the router
module.exports = router;
