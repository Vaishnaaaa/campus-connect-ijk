// backend/models/Deal.js
const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: {
      type: String,
      enum: ["Books", "Stationery", "Electronics", "Other"],
      required: true,
    },
    price: { type: Number, required: true },
    condition: { type: String, enum: ["New", "Like New", "Good", "Fair"], default: "Good" },
    images: [String],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sellerName: { type: String, required: true },
    sellerEmail: { type: String, required: true },
    sellerPhone: { type: String },
    isSold: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Full-text search index on title + description
dealSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Deal", dealSchema);
