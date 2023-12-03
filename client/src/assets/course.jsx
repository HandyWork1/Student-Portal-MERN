import React from "react";
import { Card, Button } from "react-bootstrap";

const Courses = ({ courses, onCourseSelect }) => {
  return (
    <div>
      <h2>Available Courses</h2>
      {courses.map((course) => (
        <Card key={course.id}>
          <Card.Body>
            <Card.Title>{course.title}</Card.Title>
            <Card.Text>{course.description}</Card.Text>
            <Button onClick={() => onCourseSelect(course)}>
              Select Course
            </Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default Courses;
