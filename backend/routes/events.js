// backend/routes/events.js
const express = require("express");
const router = express.Router();
const { protect, optionalAuth } = require("../middleware/auth");
const {
  getEvents, getEvent, createEvent, updateEvent, deleteEvent, registerForEvent,
} = require("../controllers/eventController");

router.get("/", optionalAuth, getEvents);
router.get("/:id", optionalAuth, getEvent);
router.post("/", protect, createEvent);
router.put("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);
router.post("/:id/register", protect, registerForEvent);

module.exports = router;
