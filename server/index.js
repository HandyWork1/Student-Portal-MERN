const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const usersmodel = require('./models/users');
const usersTypes =require('./models/usertypes');
const Course = require('./models/course');
const bodyParser = require('body-parser');
const Score= require('./models/scores');
const StudentCourse= require('./models/student-course');
const app = express(); 
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://kimiri:GqDczRFsa9VW1ksc@cluster12.d3hhmlb.mongodb.net/", 
{ useNewUrlParser: true, 
    useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });

//   const upload = multer({ storage: multer.memoryStorage() }); // Initialize multer

  //////////////////This is login in ///////////

  app.post("/", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await usersmodel.findOne({ email: email });
  
      if (user) {
        if (user.password === password) {
          const response = {
            message: "success",
            userType: user.userType,
          };
  
          // If the user is a lecturer, include the courseId information
          if (user.userType === "Lecturer") {
            response.courseId = user.courseId;
          }
  
          res.json(response);
        } else {
          res.json("The password is incorrect");
        }
      } else {
        res.json("No record existed");
      }
    } catch (err) {
      console.error(err);
      res.status(500).json("Server error");
    }
  });
  
//////////       this is login /////////////
app.post("/register", async (req, res) => {
  const { name, email, password, userType, courseId } = req.body;

  try {
    if (!['Admin', 'Lecturer', 'Student'].includes(userType)) {
      return res.status(400).json({ error: "Invalid userType" });
    }

    const existingUser = await usersmodel.findOne({ email: email });

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const validUserTypes = Object.values(usersTypes).map(type => type.charAt(0).toUpperCase() + type.slice(1));
    if (!validUserTypes.includes(userType)) {
      return res.status(400).json({ error: "Invalid userType" });
    }

    const newUser = await usersmodel.create({
      name,
      email,
      password, // Storing plain-text password
      userType,
      courseId,
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});




  app.get('/user', async (req, res) => {
    try {
        // Fetch scores from the database
        const name = await usersmodel.find();
        res.status(200).json({ name }); // Update to use 'scores' instead of 'newScore'
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

   
//////////////////get lecturer////////
app.get('/lecturers', async (req, res) => {
  try {
    // Fetch lecturer information from the database
    const lecturers = await usersmodel.find({ userType: 'Lecturer' }, 'courseId'); // Assuming 'Lecturer' is the userType for lecturers
    res.status(200).json({ lecturers });
  } catch (error) {
    console.error('Error fetching lecturers:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//////////////////////////courses//////////////

app.get("/studentId", async (req, res) => {
    try {
      const studentName = req.query.studentName;  // Change this line
      const registeredCourses = await StudentCourse.find({ studentName });
      res.json({ courses: registeredCourses.map((course) => course.courseId) });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
/////////////////above to be deleted//////////////////

  // ...

// Register a course for a student
app.post("/register-courses", async (req, res) => {
  try {
    const { studentName, semester, courses } = req.body;

    // Loop through the selected courses
    for (const courseCode of courses) {
      // Find the course in the database
      const course = await Course.findOne({ code: courseCode });

      if (!course) {
        return res.status(404).json({
          message: `Course with code ${courseCode} not found.`,
        });
      }

      // Assuming you have a StudentCourse model for storing student-course relationships
      const newRegistration = new StudentCourse({
        studentName,
        semester,
        course: course._id, // Associate the course with the student
      });

      await newRegistration.save();
    }

    res.json({ message: "Courses registered successfully." });
  } catch (error) {
    console.error("Error registering courses:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


  // ...
  app.get("/api/student/:semester", async (req, res) => {
    try {
      const { semester } = req.params;
  
      // Fetch student-course relationships for the specified semester
      const registrations = await StudentCourse.find({ semester })
        .populate("course", "code name"); // Populate the associated course fields
  
      // Extract relevant information for the response
      const registeredCourses = registrations.map((registration) => ({
        code: registration.course.code,
        name: registration.course.name,
      }));
  
      res.json({ courses: registeredCourses });
    } catch (error) {
      console.error("Error fetching registered courses:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  

//////////////////////////////

app.get("/course", async (req, res) => {
    try {
      const courses = await Course.find();
      res.json({ courses });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


  /////////////////lecturer
  app.use(bodyParser.json());

  app.get('/api/scores', async (req, res) => {
    try {
        // Fetch scores from the database
        const scores = await Score.find();
        res.status(200).json({ scores }); // Update to use 'scores' instead of 'newScore'
    } catch (error) {
        console.error('Error fetching scores:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/api/scores', async (req, res) => {
    try {
      // Create a new Score instance based on the request body
      const { studentName, assignment1, assignment2, cat1, cat2, exam } = req.body;
      const newScore = new Score({
        studentName,
        assignment1,
        assignment2,
        cat1,
        cat2,
        exam,
      });
      // Save the score to the database
      await newScore.save();
  
      res.status(201).json({ message: 'Score saved successfully' });
    } catch (error) {
      console.error('Error saving score:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
////////////////check this/////////


  // Endpoint to fetch scores based on report type
app.get("/api/scores/:reportType", async (req, res) => {
  try {
    const reportType = req.params.reportType;

    // Fetch scores from the database based on the report type
    let scores;
    switch (reportType) {
      case "All students that Passed the Semester":
        scores = await Score.find(); // Fetch all scores
        break;
      // Add cases for other report types as needed

      case "All students that Passed the year":
        // Assuming you have information about the year in your data structure
        scores = await Score.find(); 
        break;


        case "Failed Courses in a Year":
        
        scores = await Score.find();

        // Filter scores where the total grade is less than 60
        scores = scores.filter((score) => {
          const totalScore =
            score.assignment1 + score.assignment2 + score.cat1 + score.cat2 + score.exam;
          return totalScore < 60;
        });
        break;

        case "No marks":
        // Fetch students with 0 in all assignments, cats, and exams
        scores = await Score.find({
          assignment1: 0,
          assignment2: 0,
          cat1: 0,
          cat2: 0,
          exam: 0,
        });
        break;

        case "No grades for cats and exams":
          scores = await Score.find({
            
            cat1:0,
            cat2: 0,
            exam: 0,
          });
          break;

      default:
        return res.status(400).json({ error: "Invalid report type" });
    }

    res.status(200).json({ scores });
  } catch (error) {
    console.error("Error fetching scores:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
////////////No marks//////////
app.get("/no-marks", async (req, res) => {
  try {
    // Fetch all scores
    const allScores = await Score.find();

    // Filter students with no marks for all courses
    const studentsWithNoMarks = allScores.filter((score) => {
      return (
        score.assignment1 === 0 &&
        score.assignment2 === 0 &&
        score.cat1 === 0 &&
        score.cat2 === 0 &&
        score.exam === 0
      );
    });

    // Respond with the list of students with no marks
    res.json({ students: studentsWithNoMarks });
  } catch (error) {
    console.error("Error fetching students with no marks:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
/////////////////////////////


app.listen(7000, () => {
    console.log("The server is running on port 7000");
  });
  