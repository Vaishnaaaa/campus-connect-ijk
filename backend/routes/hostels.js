// backend/routes/hostels.js
const express = require("express");
const router = express.Router();
const { protect, optionalAuth } = require("../middleware/auth");
const {
  getHostels, getHostel, createHostel, updateHostel, deleteHostel, addReview,
} = require("../controllers/hostelController");

router.get("/", optionalAuth, getHostels);
router.get("/:id", optionalAuth, getHostel);
router.post("/", protect, createHostel);
router.put("/:id", protect, updateHostel);
router.delete("/:id", protect, deleteHostel);
router.post("/:id/reviews", protect, addReview);

module.exports = router;
