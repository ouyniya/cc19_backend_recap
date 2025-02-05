const authController = {}
const createError = require('../utils/createError')

authController.register = (req, res, next) => {

    try {
        // 1. req.body
        const { email, firstName, lastName, password, confirmPassword } = req.body
        console.log( email, firstName, lastName, password, confirmPassword)

        // 2. validate
        if (!email) {
            // return res.status(400).json({ message: "email is require" })
            return createError(400, "email is required")
        }

        if (!firstName) {
            // return res.status(400).json({ message: "first name is require" })
            return createError(400, "first name is required")
        }

        if (!lastName) {
            return createError(400, "last name is required")
        }

        // 3. check email(user) exist


        // 4. encrypt using 'bcrypt'


        // 5. insert into db


        // 6. response to frontend >> register success
        res.json({ message: "hello, register"})

    } catch (error) {
        next(error)
    }
}

authController.login = (req, res, next) => {
    try {
        // console.log(sss) // test error
        const { email, password } = req.body
        res.json({ message: "login ..." })

    } catch (error) {
        next(error)
    }
}

module.exports = authController