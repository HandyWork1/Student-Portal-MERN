const express = require('express');
const router = express.Router();
const Score = require('../models/scores');

router.get('/scores/:studentCourseId', async (req, res) => {
    try {
      const studentCourseId = req.params.studentCourseId;
  
      // Assuming you have a way to find scores by studentId
      const scores = await Score.find({ studentCourse: studentCourseId });
  
      res.status(200).json(scores);
    } catch (error) {
      console.error('Error fetching scores:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  module.exports = router;