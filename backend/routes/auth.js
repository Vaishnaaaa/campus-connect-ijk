// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { syncUser, getMe, updateMe } = require("../controllers/authController");

router.post("/sync", protect, syncUser);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);

module.exports = router;
