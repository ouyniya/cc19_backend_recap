const authController = {}
const prisma = require('../configs/prisma')
const createError = require('../utils/createError')
const bcrypt = require("bcryptjs")

authController.register = async (req, res, next) => {

    try {
        // 1. req.body
        const { email, firstName, lastName, password, confirmPassword } = req.body
        
        // 2. validate
        // 3. check email(user) exist

        const checkEmail = await prisma.profile.findFirst({
            where: {
                email,
            }
        })

        // console.log(checkEmail) // return null is not dup. >> OK

        if (checkEmail) {
            return createError(400, "email is already used")
        }

        // 4. encrypt using 'bcrypt'
        const salt = bcrypt.genSaltSync(10)
        // console.log(salt)

        const hashedPassword = await bcrypt.hash(password, salt)
        console.log(hashedPassword)

        // 5. insert into db
        // 12sdfsdf34
        const profile = await prisma.profile.create({
            data: {
                email,
                firstName,
                lastName,
                password: hashedPassword
            }
        })

        // 6. response to frontend >> register success
        res.json({ message: "register success"})

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