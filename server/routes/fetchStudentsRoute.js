// Import necessary modules and models
const express = require("express");
const router = express.Router();
const StudentCourse = require("../models/student-course");
const Course = require("../models/course");
const User = require("../models/users");
const Score = require("../models/scores"); // Import the Score model

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
      
      // Loop through studentCourses to get scores for each student
      for (const studentCourse of studentCourses) {
        const semester = studentCourse.semester || 'Unknown Semester';
        
        // Fetch scores for the student
        const scores = await Score.find({ studentCourse: studentCourse._id });

        // Add scores data to the studentCourse object
        const studentWithScores = {
          ...studentCourse.toObject(), // Convert to plain JavaScript object
          scores: scores,
        };

        if (!studentsBySemester[semester]) {
          studentsBySemester[semester] = [];
        }

        studentsBySemester[semester].push(studentWithScores);
      }

      console.log(studentsBySemester);
      res.json({ studentsBySemester });
    } catch (error) {
      console.error("Error fetching students for the lecturer:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
// Export the router
module.exports = router;
