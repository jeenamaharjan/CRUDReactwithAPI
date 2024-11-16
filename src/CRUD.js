import React, { useState, useEffect, Fragment } from "react";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import axios from "axios";

const CRUD = () => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);

  // For creating a new employee
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [isActive, setIsActive] = useState(false);

  // For editing an employee
  const [editID, setEditID] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editIsActive, setEditIsActive] = useState(false);

  // Show/hide modal
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Fetch data on component load
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get("https://localhost:7060/api/Employees");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Handle form submission for creating a new employee
  const handleSave = async () => {
    if (!name || isNaN(age) || age <= 0) {
      alert("Please provide a valid name and age.");
      return;
    }

    const newEmployee = {
      name,
      age: Number(age),
      isActive,
    };

    try {
      await axios.post("https://localhost:7060/api/Employees", newEmployee);
      getData(); // Refresh the table
      clearForm();
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  // Prepare modal for editing an employee
  const handleEdit = async (id) => {
    handleShow();

    try {
      const response = await axios.get(`https://localhost:7060/api/Employees/${id}`);
      setEditID(response.data.id);
      setEditName(response.data.name);
      setEditAge(response.data.age);
      setEditIsActive(response.data.isActive);
    } catch (error) {
      console.error("Error fetching employee for edit:", error);
    }
  };

  // Handle update of employee
  const handleUpdate = async () => {
    if (!editName || isNaN(editAge) || editAge <= 0) {
      alert("Please provide a valid name and age.");
      return;
    }

    const updatedEmployee = {
      id: editID,
      name: editName,
      age: Number(editAge),
      isActive: editIsActive,
    };

    try {
      await axios.put(`https://localhost:7060/api/Employees/${editID}`, updatedEmployee);
      getData(); // Refresh the table
      handleClose();
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      await axios.delete(`https://localhost:7060/api/Employees/${id}`);
      getData(); // Refresh the table
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  // Clear form fields
  const clearForm = () => {
    setName("");
    setAge("");
    setIsActive(false);
    setEditID(null);
    setEditName("");
    setEditAge("");
    setEditIsActive(false);
  };

  return (
    <Fragment>
      <h1 className="text-center my-4">Employee Management</h1>
      <Container>
        <Row>
          <Col>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Col>
          <Col>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </Col>
          <Col>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <label className="ml-2">Is Active</label>
          </Col>
          <Col>
            <button className="btn btn-primary" onClick={handleSave}>
              Add Employee
            </button>
          </Col>
        </Row>
      </Container>

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Age</th>
            <th>Is Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.age}</td>
                <td>{item.isActive ? "Yes" : "No"}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => handleEdit(item.id)}>
                    Edit
                  </button>
                  <button className="btn btn-danger ml-2" onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No data available</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Edit Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </Col>
            <Col>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Age"
                value={editAge}
                onChange={(e) => setEditAge(e.target.value)}
              />
            </Col>
            <Col>
              <input
                type="checkbox"
                checked={editIsActive}
                onChange={(e) => setEditIsActive(e.target.checked)}
              />
              <label className="ml-2">Is Active</label>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default CRUD;
