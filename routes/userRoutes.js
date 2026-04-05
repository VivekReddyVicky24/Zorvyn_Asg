const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  registerUser,
  getUsers,
  loginUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/validateMiddleware");

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Vivek
 *               email:
 *                 type: string
 *                 example: vivek@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               role:
 *                 type: string
 *                 example: admin
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  validateRequest,
  registerUser
);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user and get token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: vivek@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful with token
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", loginUser);
router.get("/", protect, getUsers);

module.exports = router;