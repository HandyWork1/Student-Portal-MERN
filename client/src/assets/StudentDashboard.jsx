import React, { useState, useEffect } from "react";
import axios from "axios";
import { Accordion, Card, Table, Button} from "react-bootstrap";
import RegistrationAlertModal from "./modals/RegistrationAlertModal"
import LogoutAlertModal from "./modals/LogoutAlertModal"
import {Link} from "react-router-dom"

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("semester1");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedCoursesCount, setSelectedCoursesCount] = useState(0);
  const [studentName, setStudentName] = useState("");
  const [error, setError] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [showRegistrationAlert, setShowRegistrationAlert] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");

  // Fetch courses for registration
  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:7000/api/course");
      setCourses(response.data.courses);
    } catch (error) {
      console.error("Error fetching courses:", error.message);
    }
  };

  // Fetch courses registered by student
  const fetchRegisteredCourses = async () => {
    try {
      const userDetails = JSON.parse(localStorage.getItem('userDetails'));
      const userId = userDetails?.userId;

      const response = await axios.get(`http://localhost:7000/api/student/courses/${userId}`);
      console.log(response.data);
      console.log(response.data.courses);
      if (response.data && response.data.courses) {
        setRegisteredCourses(response.data.courses);
        if(registeredCourses && registeredCourses.length > 0 ){

          console.log("Went inside the filled array", registeredCourses);
        }
      } else {
        setRegisteredCourses([]); // Set an empty array if no courses are found
      }
      console.log(registeredCourses);
    } catch (error) {
      console.error('Error fetching registered courses:', error.message);
      setRegisteredCourses([]); // Set an empty array on error
    }
  };
  const groupedCoursesBySemester = registeredCourses.reduce((acc, course) => {
    if (!acc[course.semester]) {
      acc[course.semester] = [];
    }
    acc[course.semester].push(course);
    return acc;
  }, {});


  // Course selection for each semester
  const handleSemesterSelection = (semester) => {
    setSelectedSemester(semester);
    setSelectedCourses([]);
  };

  // Course selection ensuring student registers at least 5 courses
  const handleCourseSelection = (courseCode) => {
    if (selectedCoursesCount < 5) {
      if (selectedCourses.includes(courseCode)) {
        setSelectedCoursesCount(selectedCoursesCount - 1);
        setSelectedCourses(selectedCourses.filter((code) => code !== courseCode));
      } else {
        setSelectedCoursesCount(selectedCoursesCount + 1);
        setSelectedCourses([...selectedCourses, courseCode]);
      }
    }
  };

  // Course registration for student
  const registerCourses = async () => {
    try {
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));
      const userId = userDetails?.userId; 

      const response = await axios.post("http://localhost:7000/api/register-courses", {
        userId,
        semester: selectedSemester,
        courses: selectedCourses,
      });

      // Assuming the registration was successful, update the local state
      // const updatedRegisteredCourses = [...registeredCourses, ...selectedCourses];
      // setRegisteredCourses(updatedRegisteredCourses);

      // Reset selected courses and count after successful registration
      setSelectedCourses([]);
      setSelectedCoursesCount(0);
      setShowRegistrationAlert(true);
    } catch (error) {
      console.error("Error registering courses:", error.message);
      setError("Error registering courses");
    }
  };
  
  // Remove Selected Courses
  const removeSelectedCourse = (courseCode) => {
    setSelectedCoursesCount(selectedCoursesCount - 1);
    setSelectedCourses(selectedCourses.filter((code) => code !== courseCode));
  };
  
  // Function to handle logout
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  // Function to close modal
  const handleClose = () => {
    setShowLogoutModal(false);
  };
  
  // Function to handle sidebar item click
  const handleSidebarItemClick = (item) => {
    setActiveItem(item);
    console.log(item,"clicked")
  };
  
  useEffect(() => {
    // Retrieve the object from local storage
    const storedUserDetails = JSON.parse(localStorage.getItem("userDetails"));

    // Set the userDetails state with the retrieved object
    if (storedUserDetails) {
      setUserDetails(storedUserDetails);
    }

  }, []);

  useEffect(() => {
    if (activeItem === "registeredCourses") {
       // Fetch courses callback
     fetchRegisteredCourses();
    }
  }, [activeItem]);

  useEffect(() => {
    fetchCourses();
  }, [selectedSemester]);

  return (
    <div>
      <div className="container-fluid">

      <div className="row">
      {/* Sidebar */}
      <div className="col-md-3 col-lg-2 bg-primary vh-100">
        <nav className="navbar navbar-expand-md navbar-light">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav flex-column mt-4">
              <div className="text-light mb-4">
                <h3>Student Dashboard</h3>
              </div>
              <li className="nav-item">
                <Link
                  to="#"
                  className={`nav-link text-light ${
                    activeItem === "dashboard" ? "active" : ""
                  }`}
                  onClick={() => handleSidebarItemClick("dashboard")}
                >
                  <i className="fas fa-tachometer-alt me-2"></i> Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="#"
                  className={`nav-link text-light ${
                    activeItem === "registeredCourses" ? "active" : ""
                  }`}
                  onClick={() => handleSidebarItemClick("registeredCourses")}
                >
                  <i className="fas fa-graduation-cap me-2"></i> Registered Courses
                </Link>
              </li>
              <li className="nav-item">
                <Link
                    to="#"
                    className={`nav-link text-light ${
                      activeItem === "viewScores" ? "active" : ""
                    }`}
                    onClick={() => handleSidebarItemClick("viewScores")}
                  >
                    <i className="fas fa-chart-bar me-2"></i> View Scores
                  </Link>
              </li>
              <li className="nav-item">
                <Link to="#" className="nav-link text-light" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt me-2"></i> Logout
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      {/* Display the registration alert modal */}
      <RegistrationAlertModal
        show={showRegistrationAlert}
        onHide={() => setShowRegistrationAlert(false)}
      />
      {/* Display Logout alert modal */}
      <LogoutAlertModal
        show={showLogoutModal}
        onHide={handleClose}
      />

      {/* Main Content */}
        <div className="col-md-9 mt-3">
          <div className="row">
            <div className="col-lg-5">
              <div className="card bg-light text-center">
                <div className="card-body">
                  <h5 className="card-title">Welcome, {userDetails ? userDetails.name : 'Guest'}</h5>
                </div>
              </div>
            </div>
          </div>
          {activeItem === "dashboard" && (
          <div id="dashboard">          
            <div className="card bg-light my-4">
              <div className="card-header">
                <div className="row">
                  <div className="col-lg-2 col-md-3">
                    <label htmlFor="semesterSelect" className="form-label">Select Semester</label>
                  </div>
                  <div className="col-lg-3 col-md-4">
                    <select
                      id="semesterSelect"
                      className="form-select form-select-sm"
                      value={selectedSemester}
                      onChange={(e) => handleSemesterSelection(e.target.value)}
                      style={{ width: 'auto' }}
                    >
                      <option value="semester1">Semester 1</option>
                      <option value="semester2">Semester 2</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="mb-4">
                  <h4>Available Courses</h4>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((course) => (
                        <tr key={course.code}>
                          <td>{course.code}</td>
                          <td>{course.name}</td>
                          <td>{course.description}</td>
                          <td>
                            <Button
                              variant="primary"
                              onClick={() => handleCourseSelection(course.code)}
                              disabled={
                                selectedCourses.includes(course.code) ||
                                selectedCourses.length >= 5
                              }
                            >
                              {selectedCourses.includes(course.code)
                                ? "Course Added"
                                : "Add Course"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
            <div className="card bg-light mb-2">
              <div className="card-body">
                <div>
                  <h4 className="card-title">Selected Courses</h4>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCourses.map((courseCode, index) => (
                        <tr key={`${courseCode}-${index}`}>
                          <td>{courseCode}</td>
                          <td>
                            {/* Display course name based on courseCode */}
                            {courses.find((course) => course.code === courseCode)?.name}
                          </td>
                          <td>
                            <Button
                              variant="danger"
                              onClick={() => removeSelectedCourse(courseCode)}
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                <div>
                  <Button
                    variant="primary"
                    onClick={registerCourses}
                    disabled={selectedCourses.length === 0 || selectedCoursesCount < 5}
                  >
                    Register Selected Courses
                  </Button>
                  {error && <p className="text-danger mt-3">{error}</p>}
                </div>
              </div>
            </div>
          </div>
          )}
          {activeItem === "registeredCourses" && (
            <div id="registeredCourses">
              <h2 className="mt-4 mb-3">Registered Courses</h2>
              {/* Display registered courses per semester */}
              {Object.entries(groupedCoursesBySemester).map(([semester, courses]) => (
                <div className="accordion" key={semester}>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id={`heading-${semester}`}>
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse-${semester}`}
                        aria-expanded="true"
                        aria-controls={`collapse-${semester}`}
                      >
                        {semester}
                      </button>
                    </h2>
                    <div
                      id={`collapse-${semester}`}
                      className="accordion-collapse collapse"
                      aria-labelledby={`heading-${semester}`}
                    >
                      <div className="accordion-body">
                        {courses.map((course) => (
                          <div className="card mb-3" key={course._id}>
                            <div className="card-body">
                              <h5 className="card-title">{course.course.code}</h5>
                              <p className="card-text">{course.course.name}</p>
                              {/* Add other course details as needed */}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}




          {activeItem === "viewScores" && (
              <div id="viewScores">
                {/* View Scores content here */}
              </div>
            )}
        </div>
        </div>

      </div>
    </div>
    
  );
};

export default StudentDashboard;
