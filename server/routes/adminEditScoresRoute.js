// In your scores.js (or relevant file in your server-side code)

const express = require('express');
const router = express.Router();
const Score = require('../models/scores');

// Update scores for a specific student
router.put('/scores/:scoreId', async (req, res) => {
  try {
    const scoreId = req.params.scoreId;
    const { assignment1, assignment2, cat1, cat2, exam } = req.body;

    // Perform the update of scores
    const updatedScore = await Score.findByIdAndUpdate(
      scoreId,
      {
        assignment1,
        assignment2,
        cat1,
        cat2,
        exam,
      },
      { new: true } // Return the modified document
    );

    res.json(updatedScore);
  } catch (error) {
    console.error('Error updating scores:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
