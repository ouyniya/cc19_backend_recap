const authController = {}
const prisma = require('../configs/prisma')
const createError = require('../utils/createError')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

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
        // console.log(hashedPassword)

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

authController.login = async (req, res, next) => {
    try {
        // 1. req.body
        const { email, password } = req.body

        // 2. check email and password
        const profile = await prisma.profile.findFirst({
            where: {
                email,
            }
        })

        if (!profile) {
            return createError(400, "Email or password is invalid")
        }

        // console.log(profile)

        // check password valid

        const isPasswordValid = await bcrypt.compare(password, profile.password)

        if (!isPasswordValid) {
            return createError(400, "Password is invalid")
        }

        // 3. generate token
        const payload = { 
            id: profile.id,
            email: profile.email,
            firstName: profile.firstName,
            lastName: profile.lastName,
            role: profile.role
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn:"1d"
        })
        
        // console.log(token)

        // 4. response

        // console.log(sss) // test error
        // send to frontend (Zustand) : local storage
        // use to redirect page (admin, user)
        res.json({ message: "login success",
            payload,
            token
         })

    } catch (error) {
        next(error)
    }
}

authController.currentUser = async (req, res, next) => {
    try {
        // console.log(req.user)

        const { email } = req.user

        const profile = await prisma.profile.findFirst({
            where: {
                email
            }, 
            select: {
                id: true,
                email: true,
                role: true
            }
        })

        // console.log(profile)

        res.json({ result: profile })
    } catch (error) {
        next(error)
    }
}


module.exports = authController