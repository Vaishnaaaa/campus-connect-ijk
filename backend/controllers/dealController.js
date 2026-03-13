// backend/controllers/dealController.js
const Deal = require("../models/Deal");
const User = require("../models/User");

// ── GET /api/deals ────────────────────────────────────────────────────────────
const getDeals = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, condition, page = 1, limit = 12 } = req.query;
    const query = { isSold: false, isActive: true };

    if (category) query.category = category;
    if (condition) query.condition = condition;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) query.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);
    const [deals, total] = await Promise.all([
      Deal.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("seller", "name email photoURL"),
      Deal.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: deals,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/deals/:id ────────────────────────────────────────────────────────
const getDeal = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id).populate("seller", "name email phone photoURL");
    if (!deal) return res.status(404).json({ success: false, message: "Deal not found" });
    res.status(200).json({ success: true, data: deal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/deals ───────────────────────────────────────────────────────────
const createDeal = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const deal = await Deal.create({
      ...req.body,
      seller: user._id,
      sellerName: user.name,
      sellerEmail: user.email,
      sellerPhone: user.phone || req.body.sellerPhone,
    });

    res.status(201).json({ success: true, data: deal });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── PUT /api/deals/:id ────────────────────────────────────────────────────────
const updateDeal = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const deal = await Deal.findById(req.params.id);

    if (!deal) return res.status(404).json({ success: false, message: "Deal not found" });
    if (deal.seller.toString() !== user._id.toString() && user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not authorised" });

    const updated = await Deal.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── DELETE /api/deals/:id ─────────────────────────────────────────────────────
const deleteDeal = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const deal = await Deal.findById(req.params.id);

    if (!deal) return res.status(404).json({ success: false, message: "Deal not found" });
    if (deal.seller.toString() !== user._id.toString() && user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not authorised" });

    await deal.deleteOne();
    res.status(200).json({ success: true, message: "Deal deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/deals/mine ───────────────────────────────────────────────────────
const getMyDeals = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const deals = await Deal.find({ seller: user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: deals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getDeals, getDeal, createDeal, updateDeal, deleteDeal, getMyDeals };
