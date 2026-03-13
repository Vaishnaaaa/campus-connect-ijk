// backend/routes/deals.js
const express = require("express");
const router = express.Router();
const { protect, optionalAuth } = require("../middleware/auth");
const {
  getDeals, getDeal, createDeal, updateDeal, deleteDeal, getMyDeals,
} = require("../controllers/dealController");

router.get("/", optionalAuth, getDeals);
router.get("/mine", protect, getMyDeals);
router.get("/:id", optionalAuth, getDeal);
router.post("/", protect, createDeal);
router.put("/:id", protect, updateDeal);
router.delete("/:id", protect, deleteDeal);

module.exports = router;
