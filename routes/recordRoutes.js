const express = require("express");
const router = express.Router();

const {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
} = require("../controllers/recordController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.use(protect);

/**
 * @swagger
 * /api/records:
 *   post:
 *     summary: Create a financial record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - type
 *               - category
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 5000
 *               type:
 *                 type: string
 *                 example: income
 *               category:
 *                 type: string
 *                 example: salary
 *               notes:
 *                 type: string
 *                 example: March salary
 *     responses:
 *       201:
 *         description: Record created
 *       403:
 *         description: Not authorized
 */
// Only admin can create
router.post("/", authorizeRoles("admin"), createRecord);

/**
 * @swagger
 * /api/records:
 *   get:
 *     summary: Get all records with filters, pagination, and search
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 5
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: salary
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         example: income
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         example: food
 *     responses:
 *       200:
 *         description: Records fetched successfully
 */
// Everyone can view
router.get("/", authorizeRoles("viewer", "analyst", "admin"), getRecords);

// Only admin can update/delete
router.put("/:id", authorizeRoles("admin"), updateRecord);
router.delete("/:id", authorizeRoles("admin"), deleteRecord);

module.exports = router;