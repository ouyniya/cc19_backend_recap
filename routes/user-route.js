const express = require("express")
const router = express.Router()
const userControllers = require("../controllers/user-controller")


router.get("/users", userControllers.listUsers)

router.patch("/user/update-role", userControllers.updateRole)

router.delete("/user/:id", userControllers.deleteUser)

module.exports = router