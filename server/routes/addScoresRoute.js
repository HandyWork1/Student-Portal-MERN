const express = require('express');
const router = express.Router();
const Score = require('../models/scores');
const StudentCourse = require('../models/student-course');

router.post('/scores', async (req, res) => {
  try {
    const { studentName, studentCourse, assignment1, assignment2, cat1, cat2, exam } = req.body;

    // Check if scores already exist for the student
    const existingScore = await Score.findOne({ studentName, studentCourse });

    if (existingScore) {
      return res.status(400).json({ message: 'Scores already exist for this student. Editing is not allowed.' });
    }

    // Create a new score
    const newScore = new Score({
      studentName,
      studentCourse,
      assignment1,
      assignment2,
      cat1,
      cat2,
      exam,
    });

    // Save the score to the database
    await newScore.save();
    // Find the corresponding student-course document
    const studentCourseUpdated = await StudentCourse.findOneAndUpdate(
      { user: newScore.studentName, _id: newScore.studentCourse },
      { $push: { scores: newScore._id } },
      { new: true } // Return the modified document
    );

    res.status(201).json(newScore);
  } catch (error) {
    console.error('Error adding scores:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
