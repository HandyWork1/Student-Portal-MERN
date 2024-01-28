// Import necessary modules and models
const express = require('express');
const router = express.Router();
const Course = require('../models/course');

// Endpoint to add a new course
router.post('/admin/add-course', async (req, res) => {
  try {
    const { courseCode, courseName, courseDescription } = req.body;
    console.log('Received request body:', req.body);

    // Check if the course with the given code already exists
    const existingCourse = await Course.findOne({ code: courseCode });
    if (existingCourse) {
        return res.status(400).json({ error: 'CourseAlreadyExists', message: 'Course with this code already exists.' });
    }

    // Create a new course
    const newCourse = new Course({
      code: courseCode,
      name: courseName,
      description: courseDescription,
    });

    // Save the new course to the database
    await newCourse.save();

    res.status(201).json({ message: 'Course added successfully.' });
  } catch (error) {
    console.error('Error adding course:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Export the router
module.exports = router;
