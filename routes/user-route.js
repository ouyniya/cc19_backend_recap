const express = require("express")
const router = express.Router()
const userControllers = require("../controllers/user-controller")
const { auth } = require("../middlewares/auth-middleware")


router.get("/users", auth, userControllers.listUsers)

router.patch("/user/update-role", auth, userControllers.updateRole)

router.delete("/user/:id", auth, userControllers.deleteUser)

module.exports = router