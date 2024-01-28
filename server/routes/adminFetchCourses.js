const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const Users = require('../models/users');

// Endpoint to get all courses with associated lecturer and description
router.get('/admin/courses', async (req, res) => {
  try {
    // Fetch all courses
    const allCourses = await Course.find();

    // Fetch lecturers with associated courses
    const lecturers = await Users.find({ userType: 'Lecturer' }, 'name courseId');

    // Map lecturers to courses based on courseId
    const coursesWithLecturers = allCourses.map(course => {
      const lecturer = lecturers.find(lecturer => lecturer.courseId === course.code);
      return {
        ...course.toObject(),
        lecturer: lecturer ? lecturer.name : null,
      };
    });

    res.json({ courses: coursesWithLecturers });
  } catch (error) {
    console.error('Error fetching all courses:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Export the router
module.exports = router;
