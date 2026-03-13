// backend/seed.js
// Run: node seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Hostel = require("./models/Hostel");
const Event = require("./models/Event");
const Deal = require("./models/Deal");

const seed = async () => {
  await connectDB();

  // ── Clear ──────────────────────────────────────────────────────────────────
  await Promise.all([Hostel.deleteMany(), Event.deleteMany(), Deal.deleteMany()]);
  console.log("🗑  Cleared existing data");

  // ── Hostels ────────────────────────────────────────────────────────────────
  await Hostel.insertMany([
    {
      name: "Melam Residency",
      type: "Ladies PG",
      description: "Clean, well-maintained PG for lady students with home-cooked meals.",
      address: "Melam, Irinjalakuda",
      distanceFromCollege: "500 m",
      rent: 5500,
      totalRooms: 20,
      vacantRooms: 8,
      amenities: ["WiFi", "Meals Included", "Laundry", "CCTV", "24/7 Water"],
      images: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80"],
      contactName: "Mrs. Latha",
      contactPhone: "9876501111",
      contactEmail: "melam.pg@gmail.com",
      avgRating: 4.2,
    },
    {
      name: "Christ Nagar Homes",
      type: "Mens Hostel",
      description: "Affordable men's hostel, 5 min walk to college.",
      address: "Christ Nagar, Irinjalakuda",
      distanceFromCollege: "1.2 km",
      rent: 4800,
      totalRooms: 15,
      vacantRooms: 4,
      amenities: ["WiFi", "Parking", "Common Hall", "Gym"],
      images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80"],
      contactName: "Mr. Sajan",
      contactPhone: "9876502222",
      contactEmail: "christnagar.hostel@gmail.com",
      avgRating: 3.5,
    },
    {
      name: "Irinjalakuda Residency",
      type: "Ladies PG",
      description: "Premium ladies PG with AC rooms and study hall.",
      address: "Near Bus Stand, Irinjalakuda",
      distanceFromCollege: "800 m",
      rent: 5000,
      totalRooms: 25,
      vacantRooms: 11,
      amenities: ["WiFi", "AC", "Meals Included", "Study Hall", "CCTV"],
      images: ["https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=80"],
      contactName: "Mrs. Priya",
      contactPhone: "9876503333",
      contactEmail: "ijk.residency@gmail.com",
      avgRating: 4.8,
    },
    {
      name: "Campus View PG",
      type: "Mens Hostel",
      description: "Walking distance from college gate, ideal for first-years.",
      address: "College Road, Irinjalakuda",
      distanceFromCollege: "300 m",
      rent: 6200,
      totalRooms: 12,
      vacantRooms: 2,
      amenities: ["WiFi", "Meals Included", "AC", "Laundry", "CCTV"],
      images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80"],
      contactName: "Mr. Thomas",
      contactPhone: "9876504444",
      contactEmail: "campusview.pg@gmail.com",
      avgRating: 4.0,
    },
  ]);
  console.log("✅ Hostels seeded");

  // ── Events ─────────────────────────────────────────────────────────────────
  await Event.insertMany([
    {
      name: "Pragathi — Annual Science Fest",
      description:
        "PRAGATHI is Christ College's flagship annual science symposium, drawing students from across Kerala for paper presentations, project exhibitions, model contests, and science quizzes — celebrating innovation and curiosity.",
      type: "Science & Technology",
      date: new Date("2025-03-18"),
      time: "9:00 AM",
      venue: "Christ College Main Auditorium",
      isOpen: true,
      maxParticipants: 500,
      videoUrl: "https://www.youtube.com/embed/m5Q5MGVNwMw",
    },
    {
      name: "Christotsav — Cultural Fiesta",
      description:
        "Christotsav is the vibrant annual cultural celebration showcasing music, dance, drama, fine arts, and literary events. A week-long festival honouring creativity and the cultural heritage of our students.",
      type: "Cultural & Arts",
      date: new Date("2025-04-05"),
      time: "10:00 AM",
      venue: "Open Air Theatre, Christ College",
      isOpen: true,
      maxParticipants: 1000,
      videoUrl: "https://www.youtube.com/embed/m5Q5MGVNwMw",
    },
    {
      name: "Inter-Collegiate Sports Meet",
      description:
        "The annual inter-collegiate sports tournament brings together student athletes across Kerala. Track & field, court sports, and aquatic events across a three-day celebration.",
      type: "Sports & Athletics",
      date: new Date("2025-05-12"),
      time: "8:00 AM",
      venue: "College Grounds & Sports Complex",
      isOpen: true,
      maxParticipants: 300,
    },
    {
      name: "Commerce Conclave 2025",
      description:
        "An industry-academia meet for Commerce and BBA students with guest lectures by finance professionals, case study competitions, and networking sessions.",
      type: "Commerce & Management",
      date: new Date("2025-03-28"),
      time: "9:30 AM",
      venue: "Commerce Seminar Hall",
      isOpen: true,
      maxParticipants: 200,
    },
  ]);
  console.log("✅ Events seeded");

  // ── Deals ──────────────────────────────────────────────────────────────────
  await Deal.insertMany([
    {
      title: "Organic Chemistry Vol. I",
      description: "Good condition, minor highlights. Suitable for B.Sc. Chemistry 2nd year.",
      category: "Books",
      price: 220,
      condition: "Good",
      sellerName: "Akhil R",
      sellerEmail: "akhil@christcollegeijk.edu.in",
      sellerPhone: "9876501234",
      seller: new mongoose.Types.ObjectId(),
    },
    {
      title: "Calculus & Analysis",
      description: "Purchased last year, no tears or missing pages.",
      category: "Books",
      price: 180,
      condition: "Like New",
      sellerName: "Sneha M",
      sellerEmail: "sneha@christcollegeijk.edu.in",
      sellerPhone: "9845123456",
      seller: new mongoose.Types.ObjectId(),
    },
    {
      title: "Premium Stationery Kit",
      description: "Geometry box, pens, pencils, ruler — barely used.",
      category: "Stationery",
      price: 130,
      condition: "Like New",
      sellerName: "John D",
      sellerEmail: "john@christcollegeijk.edu.in",
      sellerPhone: "9876543210",
      seller: new mongoose.Types.ObjectId(),
    },
    {
      title: "Scientific Calculator Casio fx-991EX",
      description: "Works perfectly. Selling because switching to a newer model.",
      category: "Electronics",
      price: 1400,
      condition: "Good",
      sellerName: "Alice B",
      sellerEmail: "alice@christcollegeijk.edu.in",
      sellerPhone: "9876543213",
      seller: new mongoose.Types.ObjectId(),
    },
    {
      title: "USB Hub 7-Port",
      description: "All ports working. Selling after upgrading laptop.",
      category: "Electronics",
      price: 580,
      condition: "Good",
      sellerName: "Bob C",
      sellerEmail: "bob@christcollegeijk.edu.in",
      sellerPhone: "9876543214",
      seller: new mongoose.Types.ObjectId(),
    },
  ]);
  console.log("✅ Deals seeded");

  console.log("\n🎉 Database seeded successfully!");
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
