import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const RegistrationAlertModal = ({ show, onHide }) => {
  useEffect(() => {
    if (show) {
      const timeout = setTimeout(() => {
        onHide();
      }, 5000); // Timeout duration in milliseconds (e.g., 5000ms = 5 seconds)

      return () => clearTimeout(timeout);
    }
  }, [show, onHide]);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Registration Successful</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="alert alert-success text-center" role="alert">
          Your courses have been registered successfully!
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RegistrationAlertModal;
