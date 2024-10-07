const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  seatNumber: { type: Number, required: true, unique: true },
  mobileNumber: { type: String, required: true /*unique: true*/ },
  paymentHistory: [
    {
      amountPaid: { type: Number, required: true },
      paymentDate: { type: Date, default: Date.now },
    },
  ],
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
