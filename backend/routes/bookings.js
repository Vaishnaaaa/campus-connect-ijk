// backend/routes/bookings.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  createBooking, getMyBookings, getHostelBookings, updateBookingStatus,
} = require("../controllers/bookingController");

router.post("/", protect, createBooking);
router.get("/mine", protect, getMyBookings);
router.get("/hostel/:hostelId", protect, getHostelBookings);
router.put("/:id/status", protect, updateBookingStatus);

module.exports = router;
