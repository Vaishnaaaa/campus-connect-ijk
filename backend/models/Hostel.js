// backend/models/Hostel.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userName: String,
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

const hostelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["Ladies PG", "Mens Hostel", "Mixed PG"] }, // optional for backward compatibility
    gender: { type: String, enum: ["girls", "boys"], required: true }, // new field for filtering
    description: { type: String, trim: true },
    address: { type: String, trim: true },
    location: { type: String, trim: true },
    distance_from_college: { type: String, required: true }, // e.g. "1.2 km"
    price: { type: Number, required: true },              // per month in ₹
    rent: { type: Number }, // optional for compatibility
    totalRooms: { type: Number, default: 0 },
    vacantRooms: { type: Number, default: 0 },
    facilities: [String],                                  // WiFi, AC, Laundry …
    amenities: [String], // optional for compatibility
    images: [String],                                     // URLs
    image: String, // optional for compatibility
    contactName: { type: String, trim: true },
    contactPhone: { type: String, trim: true },
    contactEmail: { type: String, trim: true },
    isAvailable: { type: Boolean, default: true },
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 }, // use rating instead of avgRating
    avgRating: { type: Number, default: 0 }, // optional for compatibility
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Recompute avgRating whenever reviews change
hostelSchema.methods.updateAvgRating = function () {
  if (this.reviews.length === 0) {
    this.avgRating = 0;
    this.rating = 0;
  } else {
    const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = Math.round((sum / this.reviews.length) * 10) / 10;
    this.avgRating = avg;
    this.rating = avg;
  }
};

module.exports = mongoose.model("Hostel", hostelSchema);
