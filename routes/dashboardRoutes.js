const express = require("express");
const router = express.Router();

const { getDashboard } = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard summary (income, expense, balance)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data fetched successfully
 */
router.get("/", protect, getDashboard);

module.exports = router;