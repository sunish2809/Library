import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

// Use local backend for development
const API_URL = "https://library-backend-q0fy.onrender.com";

const App = () => {
  const [studentsList, setStudentsList] = useState([]);
  const [studentData, setStudentData] = useState({
    name: "",
    seatNumber: "",
    mobileNumber: "",
    paymentHistory: [],
  });
  const [searchName, setSearchName] = useState("");
  const [students, setStudents] = useState([]);
  const [paymentUpdate, setPaymentUpdate] = useState({
    seatNumber: "",
    amountPaid: "",
  });
  const [deleteData, setDeleteData] = useState({
    name: "",
    seatNumber: "",
  });

  // Handle input changes for student data
  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });
  };

  // Handle payment history input changes
  const handlePaymentHistoryChange = (e) => {
    const { name, value } = e.target;
    setStudentData({
      ...studentData,
      paymentHistory: [{ ...studentData.paymentHistory[0], [name]: value }],
    });
  };

  // Handle payment update input changes
  const handlePaymentUpdateChange = (e) => {
    const { name, value } = e.target;
    setPaymentUpdate({ ...paymentUpdate, [name]: value });
  };

  // Handle delete student input changes
  const handleDeleteChange = (e) => {
    const { name, value } = e.target;
    setDeleteData({ ...deleteData, [name]: value });
  };

  // Add a new student
  const addStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/students`, studentData);
      alert(response.data.message);
      setStudentData({
        name: "",
        seatNumber: "",
        mobileNumber: "",
        paymentHistory: [{ amountPaid: "" }],
      });
    } catch (error) {
      const errMsg = error.response
        ? error.response.data.message
        : "Error adding student";
      alert(errMsg);
      console.error(errMsg);
    }
  };

  // Search student by name
  const searchStudentByName = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${API_URL}/api/students/name/${searchName}`
      );
      setStudents(response.data);
      setSearchName("");
    } catch (error) {
      const errMsg = error.response
        ? error.response.data.message
        : "Error fetching students";
      alert(errMsg);
      console.error(errMsg);
    }
  };

  // Update student payment
  const updatePayment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${API_URL}/api/students/payment/seat/${paymentUpdate.seatNumber}`,
        {
          amountPaid: paymentUpdate.amountPaid,
        }
      );
      alert(response.data.message);
      setPaymentUpdate({ seatNumber: "", amountPaid: "" });
    } catch (error) {
      const errMsg = error.response
        ? error.response.data.message
        : "Error updating payment";
      alert(errMsg);
      console.error(errMsg);
    }
  };

  // Delete a student
  const deleteStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(
        `${API_URL}/api/students/${deleteData.name}/${deleteData.seatNumber}`
      );
      alert(response.data.message);
      setDeleteData({ name: "", seatNumber: "" });
    } catch (error) {
      const errMsg = error.response
        ? error.response.data.message
        : "Error deleting student";
      alert(errMsg);
      console.error(errMsg);
    }
  };

  // Close student details
  const closeStudentDetails = (studentId) => {
    setStudents(students.filter((student) => student._id !== studentId));
  };

  // Fetch all students' names and seat numbers on component mount
  useEffect(() => {
    axios
      .get(`${API_URL}/api/students/all`)
      .then((response) => {
        setStudentsList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching students list:", error);
      });
  }, []);

  return (
    <div>
      <h1 className="title">Library Management System</h1>
      <div className="main-container">
        <div className="left-section">
          {/* Add Student Form */}
          <form className="form add-student-form" onSubmit={addStudent}>
            <h2 className="form-title">Add Student</h2>
            <input
              type="text"
              name="name"
              className="input"
              placeholder="Name"
              value={studentData.name}
              onChange={handleStudentChange}
              required
            />
            <input
              type="number"
              name="seatNumber"
              className="input"
              placeholder="Seat Number"
              value={studentData.seatNumber}
              onChange={handleStudentChange}
              required
            />
            <input
              type="text"
              name="mobileNumber"
              className="input"
              placeholder="Mobile Number"
              value={studentData.mobileNumber}
              onChange={handleStudentChange}
              required
            />
            <input
              type="number"
              name="amountPaid"
              className="input"
              placeholder="Amount Paid"
              value={studentData.paymentHistory[0]?.amountPaid || ""}
              onChange={handlePaymentHistoryChange}
              required
            />
            <button className="button" type="submit">
              Add Student
            </button>
          </form>

          {/* Search Student Form */}
          <form className="form search-form" onSubmit={searchStudentByName}>
            <h2 className="form-title">Search Student by Name</h2>
            <input
              type="text"
              className="input"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Enter student name"
              required
            />
            <button className="button" type="submit">
              Search
            </button>
          </form>

          {/* Search Results */}
          {students.length > 0 && (
            <div className="student-results">
              <h3 className="results-title">Search Results:</h3>
              {students.map((student) => (
                <div key={student._id} className="student-item">
                  <div className="student-header">
                    <p className="student-info">Name: {student.name}</p>
                    <p className="student-info">
                      Seat Number: {student.seatNumber}
                    </p>
                    <p className="student-info">
                      Mobile Number: {student.mobileNumber}
                    </p>
                  </div>
                  <div className="student-details">
                    <h4 className="payment-history-title">Payment History:</h4>
                    {student.paymentHistory.map((payment, index) => (
                      <p key={index} className="payment-info">
                        ₹{payment.amountPaid} (Paid on:{" "}
                        {new Date(payment.paymentDate).toLocaleDateString()})
                      </p>
                    ))}
                  </div>
                  <button
                    className="close-button"
                    onClick={() => closeStudentDetails(student._id)}
                  >
                    &#10005;
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Update Payment Form */}
          <form className="form update-payment-form" onSubmit={updatePayment}>
            <h2 className="form-title">Update Payment</h2>
            <input
              type="number"
              name="seatNumber"
              className="input"
              placeholder="Seat Number"
              value={paymentUpdate.seatNumber}
              onChange={handlePaymentUpdateChange}
              required
            />
            <input
              type="number"
              name="amountPaid"
              className="input"
              placeholder="Amount Paid"
              value={paymentUpdate.amountPaid}
              onChange={handlePaymentUpdateChange}
              required
            />
            <button className="button" type="submit">
              Update Payment
            </button>
          </form>

          {/* Delete Student Form */}
          <form className="form delete-student-form" onSubmit={deleteStudent}>
            <h2 className="form-title">Delete Student</h2>
            <input
              type="text"
              name="name"
              className="input"
              placeholder="Name"
              value={deleteData.name}
              onChange={handleDeleteChange}
              required
            />
            <input
              type="number"
              name="seatNumber"
              className="input"
              placeholder="Seat Number"
              value={deleteData.seatNumber}
              onChange={handleDeleteChange}
              required
            />
            <button className="button" type="submit">
              Delete Student
            </button>
          </form>
        </div>

        {/* All Students List */}
        <div className="right-section">
          <div className="students-list-container">
            <h2>All Students</h2>
            <div className="students-list">
              <div className="student-row">
                <div className="column-title">Name</div>
                <div className="column-title">Seat Number</div>
              </div>
              {studentsList
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((student) => (
                  <div key={student.seatNumber} className="student-row">
                    <div className="student-name">{student.name}</div>
                    <div className="student-seatNumber">
                      {student.seatNumber}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
