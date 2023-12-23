const express = require('express');
const Course = require('../models/course');

const router = express.Router();

router.get("/course", async (req, res) => {
    try {
      const courses = await Course.find();
      res.json({ courses });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;