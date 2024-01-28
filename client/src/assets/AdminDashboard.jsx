import React, { useState, useEffect } from "react";
import LogoutAlertModal from "./modals/LogoutAlertModal"
import AddCourseModal from "./modals/AddCourseModal"
import { Card, Button, Modal, Form, Table } from "react-bootstrap";
import { Link} from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [adminInfo, setAdminInfo] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [allCourses, setAllCourses] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportResults, setReportResults] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editedScores, setEditedScores] = useState({
    assignment1: 0,
    assignment2: 0,
    cat1: 0,
    cat2: 0,
    exam: 0,
  });
  // Function to handle sidebar item click
  const handleSidebarItemClick = (item) => {
    setActiveItem(item);
  }
  // Function to handle logout
  const handleLogout = () => {
    setShowLogoutModal(true);
  };
  // Function to handle Adding a Course
  const handleAddCourse = () => {
    setShowAddCourseModal(true);
  };
  // Function to close modal
  const handleClose = () => {
    setShowLogoutModal(false);
    setShowAddCourseModal(false);
  };
  // Fetch Admin Info
  const fetchAdminInfo = async () => {
    try {
      // Retrieve the object from local storage
      const storedUserDetails = JSON.parse(localStorage.getItem("userDetails"));

      if (!storedUserDetails) {
        console.error("User details not found in local storage.");
        return;
      }

      // Use stored userDetails directly
      setAdminInfo(storedUserDetails);
    } catch (error) {
      console.error("Error fetching lecturer information:", error.message);
    } 
  };
  // Fetch All Courses
  const handleFetchAllCourses = async () => {
    try {
      const response = await axios.get('http://localhost:7000/api/admin/courses');
      const { courses } = response.data;
      console.log(response.data);
  
      // Use await when setting the state to ensure it's updated before proceeding
      await setAllCourses(courses);
    } catch (error) {
      console.error('Error fetching all courses:', error.message);
    }
  };

  const generateReport = async (reportType) => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/scores/${reportType}`
      );

      // Set the generated report in state
      setSelectedReport(`Results for ${reportType} report`);

      if (
        reportType === "No marks" ||
        reportType === "Failed Courses in a Year" ||
        reportType === "No grades for cats and exams"
      ) {
        // For "No marks," "Failed Courses in a Year," and "No grades for cats and exams" report types, directly set the scores in state
        setReportResults(response.data.scores);
      } else if (reportType === "Edit grades") {
        // For "Edit grades" report type, set the scores in state and show the edit form
        setReportResults(response.data.scores);
        setShowEditForm(true);
      } else {
        // For other report types, filter scores based on conditions
        const filteredScores = response.data.scores.filter((score) => {
          return (
            score.assignment1 >= 5 &&
            score.assignment2 >= 5 &&
            score.cat1 >= 10 &&
            score.cat2 >= 10 &&
            score.exam >= 20
          );
        });
        setReportResults(filteredScores);
      }
    } catch (error) {
      console.error("Error generating report:", error.message);
    }
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setEditedScores({
      assignment1: student.assignment1,
      assignment2: student.assignment2,
      cat1: student.cat1,
      cat2: student.cat2,
      exam: student.exam,
    });
    setShowEditForm(true);
  };

  const handleSaveEditedScores = async () => {
    try {
      // Make API call to update scores in the backend
      await axios.put(
        `http://localhost:7000/api/scores/${selectedStudent._id}`,
        editedScores
      );

      // Refresh the scores after editing
      generateReport(selectedReport);
      setShowEditForm(false);
    } catch (error) {
      console.error("Error editing scores:", error.message);
    }
  };

  const calculateGrade = (totalScore) => {
    // Function to calculate grade based on the total score
    if (totalScore >= 90) return "A";
    if (totalScore >= 87) return "A-";
    if (totalScore >= 84) return "B";
    if (totalScore >= 80) return "B-";
    if (totalScore >= 77) return "C+";
    if (totalScore >= 74) return "C";
    if (totalScore >= 67) return "D+";
    if (totalScore >= 64) return "D";
    if (totalScore >= 62) return "D-";
    if (totalScore >= 0 && totalScore < 60) return "F";
    return "F";
  };

  const renderReportResults = () => {
    if (reportResults && reportResults.length > 0) {
      const tableHeaders = (
        <thead>
          <tr>
            <th>Student Name</th>
            <th>assignment1</th>
            <th>assignment2</th>
            <th>Cat1</th>
            <th>Cat2</th>
            <th>Exams</th>
            <th>Total</th>
            <th>Grade</th>
            <th>Action</th>
          </tr>
        </thead>
      );

      const tableRows = reportResults.map((score, index) => {
        const totalScore =
          score.assignment1 +
          score.assignment2 +
          score.cat1 +
          score.cat2 +
          score.exam;

        return (
          <tr key={index}>
            <td>{score.studentName}</td>
            <td>
              {score.assignment1 === undefined ? "No Grade" : score.assignment1}
            </td>
            <td>
              {score.assignment2 === undefined ? "No Grade" : score.assignment2}
            </td>
            <td>{score.cat1 === undefined ? "No Grade" : score.cat1}</td>
            <td>{score.cat2 === undefined ? "No Grade" : score.cat2}</td>
            <td>{score.exam === undefined ? "No Grade" : score.exam}</td>
            <td>{totalScore}</td>
            <td>{calculateGrade(totalScore)}</td>{" "}
            <td>
              <Button variant="primary" onClick={() => handleEditClick(score)}>
                Edit
              </Button>
            </td>
          </tr>
        );
      });

      return (
        <div>
          {selectedReport}
          <table className="table">
            {tableHeaders}
            <tbody>{tableRows}</tbody>
          </table>
        </div>
      );
    } else if (reportResults && reportResults.length === 0) {
      return <div>No results found.</div>;
    }
    return <div>{selectedReport}</div>;
  };
  useEffect(() => {
    fetchAdminInfo();
    handleFetchAllCourses();
  }, []);

  return (
    <div className="h-100">
        <div className="row h-100">
          <div className="col-md-3 col-lg-3 col-xl-2 bg-light sidebar vh-100">
            <nav className="navbar navbar-expand-md ">
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
              <div className="py-4 collapse navbar-collapse" id="navbarNav">
              
                <ul className="navbar-nav flex-column mt-4">
                  <div className="container-fluid">
                    <div className="mb-4">
                      <h4>Admin Dashboard</h4>
                    </div>
                    <li className="nav-item">
                      <Link
                        to="#"
                        className={`nav-link ${
                          activeItem === "dashboard" ? "active" : ""
                        }`}
                        onClick={() => handleSidebarItemClick("dashboard")}
                      >
                        <i className="fas fa-tachometer-alt mx-2 pl-2"></i> Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="#" 
                        className={`nav-link ${
                          activeItem === "students" ? "active" : ""
                        }`}
                        onClick={() => handleSidebarItemClick("students")}
                        >
                        <i className="fas fa-user-graduate mx-2"></i> Students
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="#"
                        className={`nav-link ${
                          activeItem === "courses" ? "active" : ""
                        }`}
                        onClick={() => handleSidebarItemClick("courses")}
                      >
                        <i className="fas fa-book mx-2"></i> Courses
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="#"
                        className={`nav-link ${
                          activeItem === "lecturers" ? "active" : ""
                        }`}
                        onClick={() => handleSidebarItemClick("lecturers")}
                      >
                        <i className="fas fa-chalkboard-teacher mx-2"></i> Lecturers
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="#" 
                        className={`nav-link ${
                            activeItem === "settings" ? "active" : ""
                          }`}
                          onClick={() => handleSidebarItemClick("settings")}
                          >
                        <i className="fas fa-cog mx-2"></i> Settings
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="#" className="nav-link" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt mx-2"></i> Logout
                      </Link>
                    </li>
                  </div>
                </ul>
              </div>
            </nav>
          </div>
          {/* Display Logout alert modal */}
          <LogoutAlertModal
            show={showLogoutModal}
            onHide={handleClose}
          />
          <AddCourseModal
            show={showAddCourseModal}
            onHide={handleClose}
          />
      
          <main role="main" className="col-md-9 ml-sm-auto col-lg-9 px-4 mt-3">
            <div className="container-fluid">
            <div className="col-lg-5">
              <div className="card bg-light text-center">
                <div className="card-body">
                  <h5 className="card-title">Welcome, {adminInfo ? adminInfo.name : 'Guest'}</h5>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <div>
                {/* <p className="sub-header">Course Teaching: {lecturerInfo.courseId}</p> */}
              </div>
            </div>
            {/* Dashboard */}
            {activeItem === "dashboard" && (
              <div id="dashboard">
                <h3>Dashboard</h3>
                
              </div>
              
            )}
            {activeItem === "students" && (
              <div id="students">
                <h3>Students</h3>
                
              </div>
            )}
            {activeItem === "courses" && (
              <div id="courses">
                <div className="d-flex justify-content-between mb-3">
                  <div className="left-side">
                    <h3>Courses</h3>
                  </div>
                  <div className="right-side">
                    <button type="button" className="btn btn-primary px-3"onClick={handleAddCourse}>
                      <i className="fas fa-plus-circle mx-2"></i>
                      Add Course
                    </button>
                  </div>

                </div>
                {/* Check if courses are available before rendering */}
                {allCourses.length > 0 ? (
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Course Code</th>
                        <th>Course Name</th>
                        <th>Description</th>
                        <th>Lecturer</th> 
                      </tr>
                    </thead>
                    <tbody>
                      {allCourses.map((course, index) => (
                        <tr key={index}>
                          <td>{course.code}</td>
                          <td>{course.name}</td>
                          <td>{course.description}</td>
                          <td>{course.lecturer ? course.lecturer : 'N/A'}</td> 
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p>No courses available.</p>
                )}                
              </div>
            )}
            {activeItem === "lecturers" && (
              <div id="lecturers">
                <h3>Lecturers</h3>
                
              </div>
            )}
            {activeItem === "settings" && (
              <div id="settings">
                <h3>Settings</h3>
              </div>
              
            )}
          </div>
          </main>
        </div>
    </div>
    // <div className="container mt-4">
    //   <h1 className="mb-4">Admin Dashboard</h1>

    //   <div className="row">
    //     {/* Reports Section */}
    //     <div className="col-md-6">
    //       <div className="card mb-4">
    //         <div className="card-header">
    //           <h4>Reports</h4>
    //         </div>
    //         <div className="card-body">
    //           <Link to="/pass-all-courses" className="btn btn-light">
    //             <i className="fas fa-check-circle mr-2"></i>
    //             Students Passed All Courses
    //           </Link>
    //           {/* Add other report links here */}
    //         </div>
    //       </div>
    //     </div>

    //     {/* Marks Section */}
    //     <div className="col-md-6">
    //       <div className="card mb-4">
    //         <div className="card-header">
    //           <h4>Marks</h4>
    //         </div>
    //         <div className="card-body">
    //           <Link to="/edit-marks" className="btn btn-light">
    //             <i className="fas fa-edit mr-2"></i>
    //             Edit Marks
    //           </Link>
    //           {/* Add other marks-related links here */}
    //         </div>
    //       </div>
    //     </div>

    //     {/* Summary Section */}
    //     <div className="col-md-6">
    //       <div className="card mb-4">
    //         <div className="card-header">
    //           <h4>Summary</h4>
    //         </div>
    //         <div className="card-body">
    //           <Link to="/print-summary" className="btn btn-light">
    //             <i className="fas fa-print mr-2"></i>
    //             Print Summary
    //           </Link>
    //           {/* Add other summary-related links here */}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default AdminDashboard;
