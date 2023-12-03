import React, { useState } from "react";

const ListGroup = () => {
  const items = [
    "Personal Details and Photo",
    "Education Background",
    "Special Skills",
    "Extra Curriculum Activities",
    "Hobbies and Interests",
    "Passed all courses in the semester",
    "Passed all courses in the year",
    "Failed one or more courses in the semester",
    "Failed one or more courses in the year",
    "Did not do exams (list of specials)",
    "Student doesn't have a mark for a course",
    "Register but missing marks in all courses",
    "Repeat course",
    "Edit marks",
    "Print mark (per semester and per year)",
  ];

  const [selectedItem, setSelectedItem] = (useState < string) | (null > null);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const renderDetailedPage = () => {
    if (selectedItem === null) {
      return null;
    }

    const sectionStyles = {
      padding: "20px",
      backgroundColor: "white",
      border: "1px solid #ccc",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    };

    const contentMap = {
      "Passed all courses in the semester": (
        <div style={sectionStyles}>
          <h2>Passed all courses in the semester</h2>
          {/* Add specific content for this item */}
        </div>
      ),
      "Passed all courses in the year": (
        <div style={sectionStyles}>
          <h2>Passed all courses in the year</h2>
          {/* Add specific content for this item */}
        </div>
      ),
      "Failed one or more courses in the semester": (
        <div style={sectionStyles}>
          <h2>Failed one or more courses in the semester</h2>
          {/* Add specific content for this item */}
        </div>
      ),
      "Failed one or more courses in the year": (
        <div style={sectionStyles}>
          <h2>Failed one or more courses in the year</h2>
          {/* Add specific content for this item */}
        </div>
      ),
      "Did not do exams (list of specials)": (
        <div style={sectionStyles}>
          <h2>Did not do exams (list of specials)</h2>
          {/* Add specific content for this item */}
        </div>
      ),
      "Student doesn't have a mark for a course": (
        <div style={sectionStyles}>
          <h2>Student doesn't have a mark for a course</h2>
          {/* Add specific content for this item */}
        </div>
      ),
      "Register but missing marks in all courses": (
        <div style={sectionStyles}>
          <h2>Register but missing marks in all courses</h2>
          {/* Add specific content for this item */}
        </div>
      ),
      "Repeat course": (
        <div style={sectionStyles}>
          <h2>Repeat course</h2>
          {/* Add specific content for this item */}
        </div>
      ),
      "Edit marks": (
        <div style={sectionStyles}>
          <h2>Edit marks</h2>
          {/* Add specific content for this item */}
        </div>
      ),
      "Print mark (per semester and per year)": (
        <div style={sectionStyles}>
          <h2>Print mark (per semester and per year)</h2>
          {/* Add specific content for this item */}
        </div>
      ),
    };
    return contentMap[selectedItem] || null;
  };

  return (
    <div className="container mt-4">
      <h1>Admin Dashboard</h1>
      <div className="row">
        <div className="col-md-4">
          <ul className="list-group">
            {items.map((item, index) => (
              <li
                key={index}
                className={`list-group-item ${
                  selectedItem === item ? "active" : ""
                }`}
                onClick={() => handleItemClick(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-8">{renderDetailedPage()}</div>
      </div>
    </div>
  );
};

export default ListGroup;
