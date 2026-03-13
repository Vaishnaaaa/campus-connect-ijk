// backend/controllers/bookingController.js
const Booking = require("../models/Booking");
const Hostel = require("../models/Hostel");
const User = require("../models/User");

// ── POST /api/bookings ────────────────────────────────────────────────────────
const createBooking = async (req, res) => {
  try {
    const { hostelId, moveInDate, message, studentPhone } = req.body;
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const hostel = await Hostel.findById(hostelId);
    if (!hostel) return res.status(404).json({ success: false, message: "Hostel not found" });
    if (hostel.vacantRooms < 1)
      return res.status(400).json({ success: false, message: "No vacant rooms" });

    // Prevent duplicate pending booking for same hostel
    const duplicate = await Booking.findOne({
      hostel: hostelId,
      student: user._id,
      status: "pending",
    });
    if (duplicate)
      return res.status(400).json({ success: false, message: "You already have a pending booking" });

    const booking = await Booking.create({
      hostel: hostelId,
      student: user._id,
      studentName: user.name,
      studentEmail: user.email,
      studentPhone: studentPhone || user.phone,
      moveInDate,
      message,
    });

    // Decrement vacant rooms
    hostel.vacantRooms = Math.max(0, hostel.vacantRooms - 1);
    await hostel.save();

    await booking.populate("hostel", "name type rent distanceFromCollege");

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── GET /api/bookings/mine ────────────────────────────────────────────────────
const getMyBookings = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const bookings = await Booking.find({ student: user._id })
      .populate("hostel", "name type rent distanceFromCollege images")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/bookings/hostel/:hostelId  (owner sees bookings for their hostel)
const getHostelBookings = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const hostel = await Hostel.findById(req.params.hostelId);

    if (!hostel) return res.status(404).json({ success: false, message: "Hostel not found" });
    if (hostel.postedBy.toString() !== user._id.toString() && user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not authorised" });

    const bookings = await Booking.find({ hostel: req.params.hostelId })
      .populate("student", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /api/bookings/:id/status ──────────────────────────────────────────────
const updateBookingStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const booking = await Booking.findById(req.params.id).populate("hostel");

    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    const isOwner = booking.hostel.postedBy.toString() === user._id.toString();
    const isStudent = booking.student.toString() === user._id.toString();

    // Hostel owner can confirm/reject; student can cancel
    if (!isOwner && !isStudent && user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not authorised" });

    if (isStudent && status !== "cancelled")
      return res.status(403).json({ success: false, message: "Students can only cancel" });

    // If rejecting or cancelling, restore vacancy
    if (["rejected", "cancelled"].includes(status) && booking.status === "pending") {
      await Hostel.findByIdAndUpdate(booking.hostel._id, { $inc: { vacantRooms: 1 } });
    }

    booking.status = status;
    if (adminNote) booking.adminNote = adminNote;
    await booking.save();

    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { createBooking, getMyBookings, getHostelBookings, updateBookingStatus };
