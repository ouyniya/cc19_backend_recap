const express = require("express");
const router = express.Router()
const authController = require("../controllers/auth-controller");
const { validationZod, loginSchema, registerSchema } = require("../middlewares/validators");
const { auth } = require("../middlewares/auth-middleware");

// {{url}}/api/register
router.post("/register", validationZod(registerSchema), authController.register)

// {{url}}/api/login
router.post("/login", validationZod(loginSchema), authController.login)

// {{url}}/api/current-user
router.get("/current-user", auth, authController.currentUser)

module.exports = router;