import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

const EditScoresModal = ({ show, handleClose, fetchData, selectedStudent, selectedCourse }) => {
  const [formData, setFormData] = useState({
    assignment1: 0,
    assignment2: 0,
    cat1: 0,
    cat2: 0,
    exam: 0,
  });

  useEffect(() => {
    // Update formData when selectedCourse scores change
    if (selectedCourse && selectedCourse.scores && selectedCourse.scores.length > 0) {
      const scores = selectedCourse.scores[0];
      setFormData({
        assignment1: scores.assignment1 || 0,
        assignment2: scores.assignment2 || 0,
        cat1: scores.cat1 || 0,
        cat2: scores.cat2 || 0,
        exam: scores.exam || 0,
      });
    }
  }, [selectedCourse]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to handle the edit and update scores
  const handleEditScores = async () => {
    try {
      if (!selectedStudent || !selectedCourse || !selectedCourse.scores || selectedCourse.scores.length === 0) {
        console.error('Invalid student data or no scores available for the selected course.');
        return;
      }

      const scoreId = selectedCourse.scores[0]._id;

      // Perform input validation
      if (
        formData.assignment1 > 10 ||
        formData.assignment2 > 10 ||
        formData.cat1 > 20 ||
        formData.cat2 > 20 ||
        formData.exam > 40
      ) {
        console.log('Invalid score values. Please check and try again.');
        return;
      }

      // Perform the update of scores
      const response = await axios.put(`http://localhost:7000/api/scores/${scoreId}`, {
        assignment1: formData.assignment1,
        assignment2: formData.assignment2,
        cat1: formData.cat1,
        cat2: formData.cat2,
        exam: formData.exam,
      });

      // Refresh table records by fetching students again
      fetchData();
      console.log('Scores updated successfully:', response.data);

      // You might want to update the UI or state after a successful update
      handleClose();
    } catch (error) {
      console.error('Error updating scores:', error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEditScores();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{`Edit Scores for ${selectedStudent && selectedStudent.user && selectedStudent.user.name}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="assignment1">
            <Form.Label>Assignment 1</Form.Label>
            <Form.Control
              type="number"
              name="assignment1"
              value={formData.assignment1}
              onChange={handleChange}
              max="10"
            />
          </Form.Group>

          <Form.Group controlId="assignment2">
            <Form.Label>Assignment 2</Form.Label>
            <Form.Control
              type="number"
              name="assignment2"
              value={formData.assignment2}
              onChange={handleChange}
              max="10"
            />
          </Form.Group>

          <Form.Group controlId="cat1">
            <Form.Label>CAT 1</Form.Label>
            <Form.Control
              type="number"
              name="cat1"
              value={formData.cat1}
              onChange={handleChange}
              max="20"
            />
          </Form.Group>

          <Form.Group controlId="cat2">
            <Form.Label>CAT 2</Form.Label>
            <Form.Control
              type="number"
              name="cat2"
              value={formData.cat2}
              onChange={handleChange}
              max="20"
            />
          </Form.Group>

          <Form.Group controlId="exam">
            <Form.Label>Exam</Form.Label>
            <Form.Control
              type="number"
              name="exam"
              value={formData.exam}
              onChange={handleChange}
              max="40"
            />
          </Form.Group>

          <Button className='mt-3' variant="primary" type="submit">
            Update Scores
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditScoresModal;
