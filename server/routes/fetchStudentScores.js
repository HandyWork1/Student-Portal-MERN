// Import necessary modules and models
const express = require('express');
const router = express.Router();
const StudentCourse = require('../models/student-course');
const Score = require('../models/scores');
const Course = require('../models/course');

// Endpoint to get scores for a student
router.get('/student/scores/:studentId', async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // Find the student's courses with detailed information
    const studentCourses = await StudentCourse.find({ 'user': studentId }).populate({
      path: 'course',
      model: Course,
      select: 'code name', // Specify the fields you want from the Course model
    }).populate({
      path: 'scores',
      model: Score,
    });

    res.json({ studentCourses });
  } catch (error) {
    console.error('Error fetching scores:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Export the router
module.exports = router;
