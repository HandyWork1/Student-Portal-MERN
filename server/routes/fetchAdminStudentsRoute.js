const express = require('express');
const router = express.Router();
const StudentCourse = require('../models/student-course');
const Users = require('../models/users');
const Score = require('../models/scores');
const Course = require('../models/course');

// Endpoint to get all students with their courses and scores
router.get('/admin/students', async (req, res) => {
  try {
    // Fetch all student courses with associated user, course, and scores
    const studentsWithCourses = await StudentCourse.find()
    .populate({
        path: 'user', 
        model: Users
    }).populate({
        path: 'course', 
        model: Course,
    }).populate({
        path:'scores',
        model: Score,
    });

    // Transform the data as needed
    const formattedData = studentsWithCourses.map(studentCourse => ({
      semester: studentCourse.semester,
      user: {
        name: studentCourse.user.name,
        email: studentCourse.user.email,
      },
      course: {
        code: studentCourse.course.code,
        name: studentCourse.course.name,
        description: studentCourse.course.description,
      },
      scores: studentCourse.scores.map(score => ({
        _id: score._id,
        assignment1: score.assignment1,
        assignment2: score.assignment2,
        cat1: score.cat1,
        cat2: score.cat2,
        exam: score.exam,
      })),
    }));

    res.json({ students: formattedData });
    console.log("Formatted Data", formattedData);
  } catch (error) {
    console.error('Error fetching students with courses:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Export the router
module.exports = router;
