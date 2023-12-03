import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button } from "react-bootstrap";

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("semester1");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [studentName, setStudentName] = useState("");

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:7000/course");
      setCourses(response.data.courses);
    } catch (error) {
      console.error("Error fetching courses:", error.message);
    }
  };

  const fetchRegisteredCourses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/student/${selectedSemester}`
      );

      // Assuming the response contains a 'courses' field with an array of courses
      setRegisteredCourses(response.data.courses);
    } catch (error) {
      console.error("Error fetching registered courses:", error.message);
    }
  };

  const fetchStudentInfo = async () => {
    try {
      const response = await axios.get("http://localhost:7000/api/scores");
      setStudentName(response.data.scores[0].studentName); // Update to match your data structure
    } catch (error) {
      console.error("Error fetching student information:", error.message);
    }
  };

  const handleSemesterSelection = (semester) => {
    setSelectedSemester(semester);
    setSelectedCourses([]);
  };

  const handleCourseSelection = (courseCode) => {
    if (selectedCourses.includes(courseCode)) {
      // Deselect the course if it's already selected
      setSelectedCourses(selectedCourses.filter((code) => code !== courseCode));
    } else if (selectedCourses.length < 5) {
      // Select the course if not already selected and the limit is not reached
      setSelectedCourses([...selectedCourses, courseCode]);
    }
  };

  const registerCourses = async () => {
    try {
      // Replace 'studentId123' with the actual student ID (you may get it from user authentication)
      //const studentId = generateUniqueId();

      // Register the selected courses for the student
      await axios.post("http://localhost:7000/register-courses", {
        // studentId,
        semester: selectedSemester,
        courses: selectedCourses,
      });

      // Fetch the updated list of registered courses
      fetchRegisteredCourses();
    } catch (error) {
      console.error("Error registering courses:", error.message);
    }
  };

  const generateUniqueId = () => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  useEffect(() => {
    fetchStudentInfo();
    fetchCourses();
    fetchRegisteredCourses();
  }, [selectedSemester]);

  return (
    <div>
      <h2>Welcome, {studentName}!</h2>

      <div className="mb-4">
        <h4>Select Semester</h4>
        <select
          value={selectedSemester}
          onChange={(e) => handleSemesterSelection(e.target.value)}
        >
          <option value="semester1">Semester 1</option>
          <option value="semester2">Semester 2</option>
        </select>
      </div>

      <div className="mb-4">
        <h4>Available Courses</h4>
        <div className="d-flex flex-wrap">
          {courses.map((course) => (
            <Card
              key={course.code}
              className={`m-2 ${
                selectedCourses.includes(course.code) ? "selected" : ""
              }`}
              style={{ width: "18rem" }}
              onClick={() => handleCourseSelection(course.code)}
            >
              <Card.Body>
                <Card.Title>{course.name}</Card.Title>
                <Card.Text>{course.description}</Card.Text>
                <Button variant="primary">
                  {selectedCourses.includes(course.code)
                    ? "Selected"
                    : "Select"}
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h4>Registered Courses</h4>
        <ul>
          {registeredCourses.map((course) => (
            <li key={course.code}>{course.name}</li>
          ))}
        </ul>
      </div>

      <div>
        <Button
          variant="primary"
          onClick={registerCourses}
          disabled={selectedCourses.length === 0}
        >
          Register Selected Courses
        </Button>
      </div>

      {selectedCourses.length > 0 && (
        <div className="mt-4">
          <ol>
            {selectedCourses.map((courseCode, index) => (
              <li key={`${courseCode}-${index}`}>{courseCode}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
