const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const StudentCourse = require("../models/student-course");

// Register a course for a student
router.post("/register-courses", async (req, res) => {
    try {
      const { studentName, semester, courses } = req.body;
  
      // Loop through the selected courses
      for (const courseCode of courses) {
        // Find the course in the database
        const course = await Course.findOne({ code: courseCode });
  
        if (!course) {
          return res.status(404).json({
            message: `Course with code ${courseCode} not found.`,
          });
        }
  
        // Assuming you have a StudentCourse model for storing student-course relationships
        const newRegistration = new StudentCourse({
          studentName,
          semester,
          course: course._id, // Associate the course with the student
        });
  
        await newRegistration.save();
      }
  
      res.json({ message: "Courses registered successfully." });
    } catch (error) {
      console.error("Error registering courses:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  module.exports = router;