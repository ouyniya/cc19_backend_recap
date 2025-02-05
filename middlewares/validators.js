const { z } = require("zod")

// npm i zod
// TEST validation
exports.registerSchema = z.object({
    email: z.string().email("email invalid"),
    firstName: z.string().min(3, "firstName must > 3"),
    lastName: z.string().min(3, "lastName must > 3"),
    password: z.string().min(6, "password must > 6"),
    confirmPassword: z.string().min(6, "password must > 6")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password not match",
    path: ["confirmPassword"]
})

exports.loginSchema = z.object({
    email: z.string().email("email invalid"),
    password: z.string().min(6, "password must > 6")
})

exports.validationZod = (schema) => (req, res, next) => {
    try {
        console.log("hello middleware")
        // console.log("hello middleware")
        schema.parse(req.body)

        next()
    } catch (error) {
        // console.log(error.errors[1].message)
        const errMsg = error.errors.map(el => el.message)
        const errTxt = errMsg.join(", ")
        const mergeError = new Error(errTxt)

        next(mergeError)
    }
}

