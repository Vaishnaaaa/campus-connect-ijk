// backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    photoURL: { type: String },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    department: { type: String, trim: true },
    year: { type: Number, min: 1, max: 6 },
    // Bookmarks
    savedHostels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hostel" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
