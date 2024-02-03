const express = require("express");
const router = express.Router();
const StudentCourse = require("../models/student-course");
const Course = require("../models/course");
const User = require("../models/users");
const Score = require("../models/scores");

router.get('/student/courses/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch the user based on the userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    // Fetch registered courses for the user and populate course details
    const registeredCourses = await StudentCourse.find({ user: userId })
      .populate({
        path: 'course',
        model: Course,
      }).populate({
        path: 'scores',
        model: Score,
        select: 'assignment1 assignment2 cat1 cat2 exam', // Specify the fields you want from the Score model
      });

    res.json({ courses: registeredCourses });
  } catch (error) {
    console.error("Error fetching registered courses:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
