// backend/controllers/authController.js
const User = require("../models/User");

/**
 * POST /api/auth/sync
 * Called after Firebase login to create/update the MongoDB user document.
 * Requires: Bearer token in Authorization header.
 */
const syncUser = async (req, res) => {
  try {
    const { uid, email, name, picture } = req.user; // decoded Firebase token
    const { phone, department, year } = req.body;

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        name: name || email.split("@")[0],
        email,
        phone: phone || "",
        photoURL: picture || "",
        department: department || "",
        year: year || null,
      });
    } else {
      // Update mutable fields if provided
      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (picture) user.photoURL = picture;
      if (department) user.department = department;
      if (year) user.year = year;
      await user.save();
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/auth/me
 * Returns the current user's MongoDB document.
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid })
      .populate("savedHostels", "name type rent distanceFromCollege avgRating");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/auth/me
 * Update profile fields.
 */
const updateMe = async (req, res) => {
  try {
    const allowed = ["name", "phone", "department", "year", "photoURL"];
    const updates = {};
    allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const user = await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      updates,
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { syncUser, getMe, updateMe };
