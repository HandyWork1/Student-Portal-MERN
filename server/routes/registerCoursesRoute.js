const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const StudentCourse = require("../models/student-course");
const User = require("../models/users"); // Import the User model

// Register a course for a student
router.post("/register-courses", async (req, res) => {
  try {
    const { userId, semester, courses } = req.body;

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user || user.userType !== 'Student') {
      return res.status(404).json({ message: "User not found or not a student." });
    }

    // Loop through the selected courses
    for (const courseCode of courses) {
      // Find the course in the database
      const course = await Course.findOne({ code: courseCode });

      if (!course) {
        return res.status(404).json({
          message: `Course with code ${courseCode} not found.`,
        });
      }

      // Create a new StudentCourse document
      const newRegistration = new StudentCourse({
        user: userId, // Reference to the user
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
