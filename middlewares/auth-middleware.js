const createError = require('../utils/createError')
const jwt = require("jsonwebtoken")

exports.auth = (req, res, next) => {
    try {
        // authorize 
        const authorization = req.headers.authorization

        // ---- req.headers ----
        // {
        //     authorization: 'Bearer kaika',
        //     'user-agent': 'PostmanRuntime/7.40.0',
        //     accept: '*/*',
        //     'postman-token': '0d01b66f-8809-4d0a-95c0-d46f78ccf8e7',
        //     host: 'localhost:8000',
        //     'accept-encoding': 'gzip, deflate, br',
        //     connection: 'keep-alive'
        //   }

        // console.log(authorization)
        // // >> Bearer kaika

        if (!authorization) {
            // authorization === undefined 
            return createError(400, "Missing value!!")
        }

        // only txt after Bearer
        const token = authorization.split(" ")[1]

        // var decoded = jwt.decode(token);
        // console.log("d", decoded)

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decode) => {
            // console.log(err)
            // console.log('****', decode)

            if (err) {
                return createError(401, "Unauthorized")
            }
            // create property decode 
            req.user = decode
            // console.log(req.user)

            next()
        })

    } catch (error) {
        next(error)
    }
};