const express = require("express");
const authController = require("../controllers/auth-controller");
const router = express.Router()

// {{url}}/api/register
router.post("/register", authController.register)

// {{url}}/api/login
router.post("/login", authController.login)

module.exports = router;