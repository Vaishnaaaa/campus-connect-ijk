// backend/models/Booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    hostel: { type: mongoose.Schema.Types.ObjectId, ref: "Hostel", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    studentPhone: { type: String, required: true },
    moveInDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected", "cancelled"],
      default: "pending",
    },
    message: { type: String, trim: true },  // optional note from student
    adminNote: { type: String, trim: true }, // optional note from hostel owner
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
