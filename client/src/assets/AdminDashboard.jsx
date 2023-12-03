import React, { useState } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";

const AdminDashboard = () => {
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

  return (
    <div>
      <h2 className="text-center mb-4">Admin Dashboard</h2>

      <div className="d-flex flex-wrap">
        <div className="flex-shrink-0">
          <Card
            style={{ width: "18rem", marginRight: "16px", cursor: "pointer" }}
            className="mb-4"
            onClick={() =>
              generateReport("All students that Passed the Semester")
            }
          >
            <Card.Header>Passed all Courses in Semester</Card.Header>
          </Card>

          <Card
            style={{ width: "18rem", marginRight: "16px", cursor: "pointer" }}
            className="mb-4"
            onClick={() => generateReport("All students that Passed the year")}
          >
            <Card.Header>Passed All Courses in a year</Card.Header>
          </Card>

          <Card
            style={{ width: "18rem", marginRight: "16px", cursor: "pointer" }}
            className="mb-4"
            onClick={() => generateReport("Failed Courses in a Year")}
          >
            <Card.Header>
              Students Failed Courses in the year and course failed
            </Card.Header>
          </Card>

          <Card
            style={{ width: "18rem", marginRight: "16px", cursor: "pointer" }}
            className="mb-4"
            onClick={() => generateReport("Excuse")}
          >
            <Card.Header>Missed exam with Excuse</Card.Header>
          </Card>

          <Card
            style={{ width: "18rem", marginRight: "16px", cursor: "pointer" }}
            className="mb-4"
            onClick={() => generateReport("No grades for cats and exams")}
          >
            <Card.Header>No grades for cats and Exams</Card.Header>
          </Card>

          <Card
            style={{ width: "18rem", marginRight: "16px", cursor: "pointer" }}
            className="mb-4"
            onClick={() => generateReport("No marks")}
          >
            <Card.Header>No marks in all courses</Card.Header>
          </Card>

          <Card
            style={{ width: "18rem", marginRight: "16px", cursor: "pointer" }}
            className="mb-4"
            onClick={() => generateReport("Repeated")}
          >
            <Card.Header>Repeated</Card.Header>
          </Card>

          <Card
            style={{ width: "18rem", marginRight: "16px", cursor: "pointer" }}
            className="mb-4"
            onClick={() => generateReport("show grades ")}
          >
            <Card.Header>show grades for semester and year</Card.Header>
          </Card>
        </div>

        <div>{renderReportResults()}</div>
      </div>
      {showEditForm && (
        <Modal show={showEditForm} onHide={() => setShowEditForm(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Grades</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formAssignment1">
                <Form.Label>Assignment 1</Form.Label>
                <Form.Control
                  type="number"
                  value={editedScores.assignment1}
                  onChange={(e) =>
                    setEditedScores({
                      ...editedScores,
                      assignment1: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formAssignment2">
                <Form.Label>Assignment 2</Form.Label>
                <Form.Control
                  type="number"
                  value={editedScores.assignment2}
                  onChange={(e) =>
                    setEditedScores({
                      ...editedScores,
                      assignment2: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formCat1">
                <Form.Label>Cat 1</Form.Label>
                <Form.Control
                  type="number"
                  value={editedScores.cat1}
                  onChange={(e) =>
                    setEditedScores({
                      ...editedScores,
                      cat1: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formCat2">
                <Form.Label>Cat 2</Form.Label>
                <Form.Control
                  type="number"
                  value={editedScores.cat2}
                  onChange={(e) =>
                    setEditedScores({
                      ...editedScores,
                      cat2: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formExam">
                <Form.Label>Exam</Form.Label>
                <Form.Control
                  type="number"
                  value={editedScores.exam}
                  onChange={(e) =>
                    setEditedScores({
                      ...editedScores,
                      exam: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditForm(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveEditedScores}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;
