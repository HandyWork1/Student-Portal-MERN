const express = require("express");
const router = express.Router();
const Users = require("../models/users");
const Course = require("../models/course")

router.post("/register", async (req, res) => {
  const { name, email, password, userType, courseId } = req.body;
  console.log("the course", courseId);

  try {
    // Check if the email already exists
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }
    // Find the course by its code
    let courseId2 = null;
    if (userType === "Lecturer") {
      // Fetch the code attribute from the Course collection
      Course.find({}, 'code')
      .then(courses => {
        console.log(courses.map(course => course.code));
      })
      .catch(error => {
        console.error('Error retrieving codes:', error);
      });
      const course = await Course.findOne({ code: courseId });
      console.log("The database course", course.code);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      courseId2 = course.code; 
    }
    // Create a new user based on the received data
    const newUser = new Users({
      name,
      email,
      password,
      userType,
      courseId: userType === "Lecturer" ? courseId : null,
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
