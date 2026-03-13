// backend/controllers/hostelController.js
const Hostel = require("../models/Hostel");
const User = require("../models/User");

// ── GET /api/hostels ──────────────────────────────────────────────────────────
const getHostels = async (req, res) => {
  try {
    const { gender, minRent, maxRent, search, page = 1, limit = 12 } = req.query;
    const query = {};

    if (gender) query.gender = gender;
    if (minRent || maxRent) {
      query.price = {};
      if (minRent) query.price.$gte = Number(minRent);
      if (maxRent) query.price.$lte = Number(maxRent);
    }
    if (search) query.name = { $regex: search, $options: "i" };

    const skip = (Number(page) - 1) * Number(limit);
    const [hostels, total] = await Promise.all([
      Hostel.find(query)
        .sort({ rating: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("postedBy", "name email"),
      Hostel.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: hostels,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/hostels/:id ──────────────────────────────────────────────────────
const getHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id)
      .populate("postedBy", "name email")
      .populate("reviews.user", "name photoURL");

    if (!hostel) return res.status(404).json({ success: false, message: "Hostel not found" });

    res.status(200).json({ success: true, data: hostel });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/hostels ─────────────────────────────────────────────────────────
const createHostel = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const hostel = await Hostel.create({ ...req.body, postedBy: user._id });
    res.status(201).json({ success: true, data: hostel });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── PUT /api/hostels/:id ──────────────────────────────────────────────────────
const updateHostel = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const hostel = await Hostel.findById(req.params.id);

    if (!hostel) return res.status(404).json({ success: false, message: "Hostel not found" });
    if (hostel.postedBy.toString() !== user._id.toString() && user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not authorised" });

    const updated = await Hostel.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── DELETE /api/hostels/:id ───────────────────────────────────────────────────
const deleteHostel = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const hostel = await Hostel.findById(req.params.id);

    if (!hostel) return res.status(404).json({ success: false, message: "Hostel not found" });
    if (hostel.postedBy.toString() !== user._id.toString() && user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not authorised" });

    await hostel.deleteOne();
    res.status(200).json({ success: true, message: "Hostel deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/hostels/:id/reviews ─────────────────────────────────────────────
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const hostel = await Hostel.findById(req.params.id);

    if (!hostel) return res.status(404).json({ success: false, message: "Hostel not found" });

    // One review per user
    const existing = hostel.reviews.find((r) => r.user?.toString() === user._id.toString());
    if (existing) return res.status(400).json({ success: false, message: "Already reviewed" });

    hostel.reviews.push({ user: user._id, userName: user.name, rating, comment });
    hostel.updateAvgRating();
    await hostel.save();

    res.status(201).json({ success: true, data: hostel });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { getHostels, getHostel, createHostel, updateHostel, deleteHostel, addReview };
