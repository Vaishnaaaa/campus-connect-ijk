// backend/controllers/eventController.js
const Event = require("../models/Event");
const User = require("../models/User");

// ── GET /api/events ───────────────────────────────────────────────────────────
const getEvents = async (req, res) => {
  try {
    const { type, upcoming, page = 1, limit = 20 } = req.query;
    const query = {};

    if (type) query.type = type;
    if (upcoming === "true") query.date = { $gte: new Date() };

    const skip = (Number(page) - 1) * Number(limit);
    const [events, total] = await Promise.all([
      Event.find(query)
        .sort({ date: 1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("postedBy", "name"),
      Event.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: events,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/events/:id ───────────────────────────────────────────────────────
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("postedBy", "name");
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    res.status(200).json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/events  (admin only in production; open here for seeding) ───────
const createEvent = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const event = await Event.create({ ...req.body, postedBy: user._id });
    res.status(201).json({ success: true, data: event });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── PUT /api/events/:id ───────────────────────────────────────────────────────
const updateEvent = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    if (event.postedBy.toString() !== user._id.toString() && user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not authorised" });

    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── DELETE /api/events/:id ────────────────────────────────────────────────────
const deleteEvent = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    if (event.postedBy.toString() !== user._id.toString() && user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not authorised" });

    await event.deleteOne();
    res.status(200).json({ success: true, message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/events/:id/register ─────────────────────────────────────────────
const registerForEvent = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    if (!event.isOpen) return res.status(400).json({ success: false, message: "Registration closed" });

    // Prevent duplicate registration
    const already = event.registrations.find(
      (r) => r.user?.toString() === user._id.toString()
    );
    if (already) return res.status(400).json({ success: false, message: "Already registered" });

    if (event.maxParticipants && event.registrations.length >= event.maxParticipants)
      return res.status(400).json({ success: false, message: "Event is full" });

    event.registrations.push({
      user: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    });

    await event.save();
    res.status(200).json({ success: true, message: "Registered successfully", data: event });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { getEvents, getEvent, createEvent, updateEvent, deleteEvent, registerForEvent };
