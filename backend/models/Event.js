// backend/models/Event.js
const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    email: String,
    phone: String,
  },
  { timestamps: true }
);

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    type: {
      type: String,
      enum: ["Science & Technology", "Cultural & Arts", "Sports & Athletics", "Commerce & Management", "Academic", "Other"],
      required: true,
    },
    date: { type: Date, required: true },
    time: { type: String },                // "10:00 AM"
    venue: { type: String, trim: true },
    image: { type: String },               // URL
    registrationDeadline: { type: Date },
    maxParticipants: { type: Number },
    isOpen: { type: Boolean, default: true },
    videoUrl: { type: String },            // YouTube embed URL
    registrations: [registrationSchema],
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
