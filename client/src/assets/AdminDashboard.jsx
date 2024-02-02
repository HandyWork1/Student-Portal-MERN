import React, { useState, useEffect } from "react";
import LogoutAlertModal from "./modals/LogoutAlertModal"
import AddCourseModal from "./modals/AddCourseModal"
import EditScoresModal from "./modals/EditScoresModal"
import LecturerRegistrationForm from "./modals/LecturerRegistrationForm";
import { Card, Button, Modal, Form, Table } from "react-bootstrap";
import { Link} from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [adminInfo, setAdminInfo] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [allCourses, setAllCourses] = useState([]);
  const [studentsData, setStudentsData] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  // Include state to store fetched data
  const [passedStudentsInSemester, setPassedStudentsInSemester] = useState([]);
  const [passedStudentsInYear, setPassedStudentsInYear] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportResults, setReportResults] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editedScores, setEditedScores] = useState({
    assignment1: 0,
    assignment2: 0,
    cat1: 0,
    cat2: 0,
    exam: 0,
  });
  const [showAddLecturerModal, setShowAddLecturerModal] = useState(false);

  const handleShowAddLecturerModal = () => {
    setShowAddLecturerModal(true);
  };

  const handleHideAddLecturerModal = () => {
    setShowAddLecturerModal(false);
    handleFetchAllCourses();
  };
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
  // Fetch Students and their courses
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:7000/api/admin/students');
      setStudentsData(response.data.students);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };
  console.log("Students object", studentsData);
   // Extract semesters from the data
   const semesters = [...new Set(studentsData.map((student) => student.semester))];

   // Assuming your data structure is stored in the variable 'studentsData'
  const groupedData = studentsData.reduce((result, student) => {
    // Find the semester in the result array
    let semesterGroup = result.find((group) => group.semester === student.semester);

    // If the semester group doesn't exist, create a new one
    if (!semesterGroup) {
      semesterGroup = {
        semester: student.semester,
        students: [],
      };
      result.push(semesterGroup);
    }

    // Find the student in the semester group
    let studentGroup = semesterGroup.students.find((s) => s.user.name === student.user.name);

    // If the student group doesn't exist, create a new one
    if (!studentGroup) {
      studentGroup = {
        user: student.user,
        courses: [],
      };
      semesterGroup.students.push(studentGroup);
    }

    // Add the course to the student's courses
    studentGroup.courses.push({
      code: student.course.code,
      name: student.course.name,
      description: student.course.description,
      scores: student.scores,
    });

    return result;
  }, []);

  // Now 'groupedData' contains the grouped information
  console.log("Grouped data",groupedData);
  // Function to handle opening the edit scores modal
  const handleOpenEditModal = (student, course) => {
    setSelectedStudent(student);
    setSelectedCourse(course);
    setShowEditModal(true);
  };

  // Function to handle closing the edit scores modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedStudent(null);
  };


  // Function to check if a student has passed all courses in a semester
  const hasPassedAllCoursesInSemester = (student, semester) => {
    // Check if the student entry is for the selected semester
    if (student.semester === semester) {
      // Check if the course has scores and the student has passed
      return (
        student.scores &&
        hasPassed(calculateTotalScore(student.scores))
      );
    }

    return false; // Student entry is not for the selected semester
  };



  // Function to handle generating reports
  const handleGenerateReport = (reportType) => {
    try {
      if (!studentsData || studentsData.length === 0) {
        console.error('No student data available.');
        return;
      }
      console.log("Student report data", studentsData);
      if (reportType === 'semester') {
        // Extract students who have passed all courses in the selected semester
        const passedStudents = studentsData
          .filter(student => hasPassedAllCoursesInSemester(student, selectedSemester));
        console.log("passed students", passedStudents);

        setReportResults(passedStudents);
      } else if (reportType === 'year') {
        // Extract passed students in the entire year
        const passedStudents = studentsData
          .filter(student => hasPassed(calculateTotalScore(student.scores)));

        setReportResults(passedStudents);
      }

      // Set the selected report for rendering
      setSelectedReport(reportType);
    } catch (error) {
      console.error('Error generating report:', error.message);
    }
  };
  // Function to check if a student has passed
  const hasPassed = (totalScore) => {
    const grade = calculateGrade(totalScore);
    return grade !== 'F' && grade !== undefined;
  };

  // Function to render the selected report
  const renderReport = () => {
    if (selectedReport === 'semester') {
      // Render the semester report
      return (
        <div>
          <div className="mb-3">
            <label htmlFor="semesterDropdown" className="mr-2">
              Select Semester:
            </label>
            <select
              id="semesterDropdown"
              className="form-select"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              <option value="">All Semesters</option>
              {semesters.map((semester) => (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              ))}
            </select>
          </div>
          <h3>Students Passed All Courses in {selectedSemester === 'semester1' ? 'Semester 1' : 'Semester 2'}</h3>
          {/* Display the data in a Bootstrap table */}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>Courses Passed</th>
              </tr>
            </thead>
            <tbody>
              {reportResults.map((student, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{student.user.name}</td>
                  <td>
                    {student.courses.map((course, courseIndex) => (
                      <div key={courseIndex}>{course.code}</div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      );
    } else if (selectedReport === 'year') {
      // Render the year report
      return (
        <div>
          <h3>Students Passed All Courses in the Year</h3>
          {/* Display the data in a Bootstrap table */}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>Courses Passed</th>
              </tr>
            </thead>
            <tbody>
              {reportResults.map((student, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{student.user.name}</td>
                  <td>
                    {student.courses.map((course, courseIndex) => (
                      <div key={courseIndex}>{course.code}</div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      );
    }

    return null;
  };

  // Function to calculate total score for a student
const calculateTotalScore = (scores) => {
  // Check if scores exist
  if (scores && scores.length > 0) {
    const { assignment1 = 0, assignment2 = 0, cat1 = 0, cat2 = 0, exam = 0 } = scores;
    const totalScores = assignment1 + assignment2 + cat1 + cat2 + exam;
    return totalScores > 100 ? 100 : totalScores;
  }
  return undefined; // Return undefined for students without scores
};
  const calculateGrade = (totalScore) => {
    // Function to calculate grade based on the total score
    if (score === undefined) return 'N/A';
    if (totalScore >= 90) return 'A';
    if (totalScore >= 87) return 'A-';
    if (totalScore >= 84) return 'B+';
    if (totalScore >= 80) return 'B';
    if (totalScore >= 77) return 'B-';
    if (totalScore >= 74) return 'C+';
    if (totalScore >= 70) return 'C';
    if (totalScore >= 67) return 'C-';
    if (totalScore >= 64) return 'D+';
    if (totalScore >= 60) return 'D';
    return "F";
  };

  useEffect(() => {
    fetchAdminInfo();
    handleFetchAllCourses();
    fetchData();
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
          {/* Edit Scores Modal */}
          <EditScoresModal
            show={showEditModal}
            handleClose={handleCloseEditModal}
            fetchData={fetchData} 
            selectedStudent={selectedStudent}
            selectedCourse={selectedCourse}
          />
          {/* Modal for adding a lecturer */}
          <Modal show={showAddLecturerModal} onHide={handleHideAddLecturerModal}>
            <Modal.Header closeButton>
              <Modal.Title>Add Lecturer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <LecturerRegistrationForm onHide={handleHideAddLecturerModal} />
            </Modal.Body>
          </Modal>
      
          <main role="main" className="col-md-9 ml-sm-auto col-lg-9 px-4 mt-3">
            <div className="container-fluid">
            <div className="col-lg-5">
              <div className="card bg-light text-center">
                <div className="card-body">
                  <h5 className="card-title">Welcome, {adminInfo ? adminInfo.name : 'Guest'}</h5>
                </div>
              </div>
            </div>
            {/* Dashboard */}
            {activeItem === "dashboard" && (
              <div id="dashboard">
                <h3>Dashboard</h3>
                <div className="row">
                  <div className="col-md-6 my-3">
                    <button className="btn btn-primary" onClick={() => handleGenerateReport('semester')}>
                      <i className="fas fa-check-circle mr-2"></i>
                      Students Passed All Courses in a Semester
                    </button>  
                  </div>
                  <div className="col-md-6 my-3">
                    <button className="btn btn-primary" onClick={() => handleGenerateReport('year')}>
                      <i className="fas fa-check-circle mr-2"></i>
                      Students Passed All Courses in the Year
                    </button>
                  </div>
                </div>
                {renderReport()}
              </div>
              
            )}
            {activeItem === "students" && (
              <div id="students" className="container-fluid">
                <h3>Students</h3>
                <div className="mb-3">
                  <label htmlFor="semesterDropdown" className="mr-2">
                    Select Semester:
                  </label>
                  <select
                    id="semesterDropdown"
                    className="form-select"
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                  >
                    <option value="">All Semesters</option>
                    {semesters.map((semester) => (
                      <option key={semester} value={semester}>
                        {semester}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="thead-light">
                      <tr>
                        <th>Name</th>
                        <th>Course Code</th>
                        <th>Course Name</th>
                        <th>Scores</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedData
                        .filter((group) => (selectedSemester ? group.semester === selectedSemester : true))
                        .map((group, groupIndex) => (
                          <React.Fragment key={groupIndex}>
                            {group.students.map((student, studentIndex) => (
                              <React.Fragment key={studentIndex}>
                                {student.courses.length > 0 ? (
                                  student.courses.map((course, courseIndex) => (
                                    <tr key={courseIndex}>
                                      {courseIndex === 0 && (
                                        <td rowSpan={student.courses.length}>{student.user.name}</td>
                                      )}
                                      <td>{course.code}</td>
                                      <td>{course.name}</td>
                                      <td>
                                        {course.scores.length > 0 ? (
                                          course.scores.map((score, scoreIndex) => (
                                            <div key={scoreIndex}>
                                              Assignment 1: {score.assignment1}, Assignment 2: {score.assignment2}, Cat 1: {score.cat1}, Cat 2: {score.cat2}, Exam: {score.exam}
                                            </div>
                                          ))
                                        ) : (
                                          <div>N/A</div>
                                        )}
                                      </td>
                                      <td>
                                        <button className="btn btn-primary px-4" onClick={() => handleOpenEditModal(student, course)}>
                                          <div className="d-flex align-items-center">
                                            <i className="fas fa-edit mr-1" />
                                            Edit
                                          </div>
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td>{student.user.name}</td>
                                    <td colSpan="4">No courses registered.</td>
                                  </tr>
                                )}
                              </React.Fragment>
                            ))}
                          </React.Fragment>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeItem === "courses" && (
              <div id="courses">
                <div className="d-flex justify-content-between my-3">
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
                          <td>{course.lecturer ? course.lecturer.name : 'N/A'}</td> 
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
                <div className="d-flex justify-content-between my-3">
                  <div className="left-side">
                    <h3>Lecturers</h3>
                  </div>
                  <div className="right-side">
                    <button type="button" className="btn btn-primary px-3"onClick={handleShowAddLecturerModal}>
                      <i className="fas fa-user-plus mx-2"></i>
                      Add Lecturer
                    </button>
                  </div>
                </div>
                {/* Check if courses are available before rendering */}
                {allCourses.filter(course => course.lecturer).length > 0 ? (
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Course Code</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allCourses
                        .filter(course => course.lecturer)
                        .map((course, index) => (
                          <tr key={index}>
                            <td>{course.lecturer.name}</td>
                            <td>{course.lecturer.email}</td>
                            <td>{course.lecturer.courseId}</td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                ) : (
                  <p>No Lecturers available.</p>
                )}
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
  );
};

export default AdminDashboard;
