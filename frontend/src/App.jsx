import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [studentsList, setStudentsList] = useState([]);
  // State for POST request (adding a student)
  const [studentData, setStudentData] = useState({
    name: "",
    seatNumber: "",
    mobileNumber: "",
    paymentHistory: [{ amountPaid: "" }],
  });

  // State for search (retrieving students by name)
  const [searchName, setSearchName] = useState("");
  const [students, setStudents] = useState([]);

  // State for PUT request (updating payment)
  const [paymentUpdate, setPaymentUpdate] = useState({
    seatNumber: "",
    amountPaid: "",
  });

  // State for DELETE request (deleting a student)
  const [deleteData, setDeleteData] = useState({
    name: "",
    seatNumber: "",
  });

  // Handle input change for student form
  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });
  };

  // Handle payment history change for student form
  const handlePaymentHistoryChange = (e) => {
    const { name, value } = e.target;
    setStudentData({
      ...studentData,
      paymentHistory: [{ ...studentData.paymentHistory[0], [name]: value }],
    });
  };

  // Handle input change for payment update form
  const handlePaymentUpdateChange = (e) => {
    const { name, value } = e.target;
    setPaymentUpdate({ ...paymentUpdate, [name]: value });
  };

  // Handle input change for delete form
  const handleDeleteChange = (e) => {
    const { name, value } = e.target;
    setDeleteData({ ...deleteData, [name]: value });
  };

  // POST request to add a student
  const addStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/students",
        studentData
      );
      alert(response.data.message);
      setStudentData({
        name: "",
        seatNumber: "",
        mobileNumber: "",
        paymentHistory: [{ amountPaid: "" }],
      });
    } catch (error) {
      alert("Error adding student");
      console.error(error);
    }
  };

  // GET request to search students by name
  const searchStudentByName = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:3000/api/students/name/${searchName}`
      );
      setStudents(response.data);
      setSearchName("");
    } catch (error) {
      alert("Error fetching students");
      console.error(error);
    }
  };

  // PUT request to update payment history
  const updatePayment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/api/students/payment/seat/${paymentUpdate.seatNumber}`,
        {
          amountPaid: paymentUpdate.amountPaid,
        }
      );
      alert(response.data.message);

      setPaymentUpdate({
        seatNumber: "",
        amountPaid: "",
      });
    } catch (error) {
      alert("Error updating payment");
      console.error(error);
    }
  };

  const deleteStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/students/${deleteData.name}/${deleteData.seatNumber}`
      );
      alert(response.data.message);
      setDeleteData({
        name: "",
        seatNumber: "",
      });
    } catch (error) {
      alert("Error deleting student");
      console.error(error);
    }
  };

  // Handle closing a student's details
  const closeStudentDetails = (studentId) => {
    setStudents(students.filter((student) => student._id !== studentId));
  };

  useEffect(() => {
    // Fetch students names and seat numbers when the component mounts
    axios
      .get("http://localhost:3000/api/students/all")
      .then((response) => {
        setStudentsList(response.data); // Set the retrieved data to the studentsList state
      })
      .catch((error) => {
        console.error("Error fetching students list:", error);
      });
  }, []);

  return (
    <div>
      <h1 className="title">Library Management System</h1> {/* Title at the top */}
      <div className="main-container">
        {/* Left section: Form */}
        <div className="left-section">
          <div>
            {/* Form to add a student */}
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
                value={studentData.paymentHistory[0].amountPaid}
                onChange={handlePaymentHistoryChange}
                required
              />
              <button className="button" type="submit">
                Add Student
              </button>
            </form>

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


          {/* Display searched students */}
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
                  {/* <button className="close-button" onClick={() => closeStudentDetails(student._id)}>
                    &#10005; 
                  </button> */}
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
  
            {/* Form to update payment history */}
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
  
            {/* Form to delete a student */}
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
        </div>
  
        {/* Right section: Students List */}
        <div className="right-section">
          <div className="students-list-container">
            <h2>All Students</h2>
            <div className="students-list">
              <div className="student-row">
                <div className="column-title">Name</div>
                <div className="column-title">Seat Number</div>
              </div>
              {studentsList.map((student) => (
                <div key={student.seatNumber} className="student-row">
                  <div className="student-name">{student.name}</div>
                  <div className="student-seatNumber">{student.seatNumber}</div>
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
