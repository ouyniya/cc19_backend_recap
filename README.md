# Server

## Step 1 create `package.json`
```bash
npm init -y
```

## Step 2 install package
```bash
npm install express nodemon cors morgan bcryptjs jsonwebtoken zod prisma dotenv
```

สร้างไฟล์ .env และ /prisma ที่มีไฟล์ schema.prisma
```bash
npx prisma init
```

### สร้างไฟล์ `.gitignore`
```
/node_modules
.env
```


### create server and update middlewares
create `index.js` and update as follows:
```js
// import
require("dotenv").config()
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")

// instance
const app = express()

// middlewares 
app.use(express.json()) // for read json from req.body
app.use(cors()) // allow cross domain: diff port can get data from our server
app.use(morgan("dev")) // show output colored by response status for development use in terminal

// routes
app.get("/", (req, res, next) => {
    res.json({ message: "get home" })
})

// error middlewares


// open server
const port = 8000
app.listen(port, () => console.log(`Server is running on port ${port}`))

```


## Step 3 Git
```bash
git init
git add .
git commit -m "start"
```

next step
copy code from repo
```bash
git remote add origin https://github.com/ouyniya/cc19_backend_recap.git
git branch -M main
git push -u origin main
```

when update code
```bash
git add .
git commit -m "message"
git push
```

## Step 4
update package.json
```js
 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon ."
  },
```

start server
```bash
npm start
```
console: Server is running on port 8000


## Step 5 create routes
create folder `routes`
files:
- `auth-route.js`

```js
const express = require("express");
const authController = require("../controllers/auth-controller"); // insert after create controller 
const router = express.Router()

router.post("/register", authController.register)

module.exports = router;
```


## Step 6 create controller

create folder `controllers`
files:
- `auth-controller.js`

```js
const authController = {}

authController.register = (req, res, next) => {
    
    try {

        res.json({ message: "register... " })

    } catch (error) {

        console.log(error)
        res.status(500).json({ message: "server error!!..." })
        // next(error)

    }
}

module.exports = authController
```

## Step 7 update index.js
add this code:
```js
// import
// ...
const authRoute = require('./routes/auth-route')
// ...
```

```js
// routes
app.use("/api", authRoute)
```

test postman
```
Method: POST
{{url}}/api/register
```

result
```
{
    "message": "register... "
}
```

## Step 8 update auth-controller.js
add login function before module.exports

```js
authController.login = (req, res, next) => {
    try {
        // console.log(sss) // test error
        res.json({ message: "login ..." })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "server error..." })
    }
}

// module.exports = authController
```

### update auth-route.js
```js
const express = require("express");
const authController = require("../controllers/auth-controller");
const router = express.Router()

// {{url}}/api/register
router.post("/register", authController.register)

// {{url}}/api/login
router.post("/login", authController.login)

module.exports = router;
```


## Step 9 create error middleware
create folder `middlewares`
file: `error.js`

```js
const handleErrors = (err, req, res, next) => {

    // err from util > createError
    console.log(err)

    res
        .status(err.statusCode || 500)
        .json({ 
            message: err.message || "Internal server error!!!" 
        })
    
}

module.exports = handleErrors;
```

### update index.js

```js
// import
require("dotenv").config()
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")

const authRoute = require('./routes/auth-route')
const handleErrors = require("./middlewares/error") // ***

// instance
const app = express()

// middlewares 
app.use(express.json()) // for read json from req.body
app.use(cors()) // allow cross domain: diff port can get data from our server
app.use(morgan("dev")) // show output colored by response status for development use in terminal

// routes
app.use("/api", authRoute)

// error middlewares
app.use(handleErrors) // ***


// open server
const port = 8000
app.listen(port, () => console.log(`Server is running on port ${port}`))
```

### update auth-controller.js
change code in catch >> next(error) 
`error` will to to handlerErrors middlewares

```js
catch (error) {
    next(error) // ***
}
```

test in postman 
`auth-controller.js` 

```js
try {
        console.log(sss) // test error ***
        res.json({ message: "login ..." })
    } 
```

result in postman body
```
{
    "message": "sss is not defined"
}
```

## Step 10 create `createError.js`
folder: `utils`
file: `createError.js`

```js
const createError = (statusCode, message) => {
    const error = new Error(message)
    error.statusCode = statusCode // add key = statusCode, value = statusCode 
    throw error 
}

module.exports = createError;
```
## Step 11 import to use the util
update auth-controller.js

```js
// top
const createError = require('../utils/createError')
```

```js

authController.register = (req, res, next) => {

    try {
        // 1. req.body
        const { email, firstName, lastName, password, confirmPassword } = req.body
        console.log( email, firstName, lastName, password, confirmPassword)

        // 2. validate
        // if (!email) {
        //     // return res.status(400).json({ message: "email is require" })
        //     return createError(400, "email is required")
        // }

        // if (!firstName) {
        //     // return res.status(400).json({ message: "first name is require" })
        //     return createError(400, "first name is required")
        // }

        // if (!lastName) {
        //     return createError(400, "last name is required")
        // }

// ....

```


## Step 12 create `middlewares` > `validators.js`

```js
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
        // combine all err msg

        next(mergeError)
    }
}
```


## Step 13 update auth-route.js

```js
const express = require("express");
const router = express.Router()
const authController = require("../controllers/auth-controller");
const { validationZod, loginSchema, registerSchema } = require("../middlewares/validators")

// {{url}}/api/register
router.post("/register", validationZod(registerSchema), authController.register)

// {{url}}/api/login
router.post("/login", validationZod(loginSchema), authController.login)

module.exports = router;
```

## Step 14 prisma update
`prisma > schema.prisma`

```js
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}


enum Role {
  USER
  ADMIN
}

model Profile {
  id           Int        @id @default(autoincrement())
  email       String  
  firstName   String
  lastName    String
  role        Role        @default(USER)
  password    String
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}
```

`.env`
```
DATABASE_URL="mysql://root:password@localhost:3306/landmark"
```

## Step 15 prisma migrate
```bash
npx prisma migrate dev --name init
```
prisma > migrations > 202502050xxxxxx_init > `migration.sql`
we'll see tables in db

## Step 16
create folder `configs`

file: prisma.js
```js
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

module.exports = prisma;
```


## Step 17 update controllers >  `auth-controller.js`
check and create email

```js
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
```

check register using postman 

path: {{url}}/api/register

```
{
    "email": "admin@test.com",
    "firstName": "admin",
    "lastName": "admin",
    "password": "12sdfsdf34",
    "confirmPassword": "12sdfsdf34"
}
```

## Step 18 log in 

update file `auth-controller.js`

```js
// top
const jwt = require("jsonwebtoken")
```

```js
// bottom

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

        console.log(profile)

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
            lastName: profile.lastName
        }

        
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRED_IN
        })
        
        // console.log(token)

        // 4. response

        // console.log(sss) // test error
        res.json({ message: "login success",
            payload,
            token
         })

    } catch (error) {
        next(error)
    }
}

module.exports = authController
```

## Step 20 update .env
```js
// bottom 

JWT_SECRET_KEY=facebook
JWT_EXPIRED_IN=1d
```

test: postman
method: post
url: {{url}}/api/login

```
{
    "email": "admin@test.com",
    "password": "12sdfsdf34"
}
```
```
{
    "message": "login success",
    "payload": {
        "id": 2,
        "email": "admin@test.com",
        "firstName": "admin",
        "lastName": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJhZG1pbkB0ZXN0LmNvbSIsImZpcnN0TmFtZSI6ImFkbWluIiwibGFzdE5hbWUiOiJhZG1pbiIsImlhdCI6MTczODc0NTc5NCwiZXhwIjoxNzM4ODMyMTk0fQ.HmXsYGBfZTokrNW-wj-IZjThoDwT6QoEnqSzkfWiFvA"
}
```

## Step 21 Current user

update `auth-controller.js`

```js
// bottom 

authController.currentUser = async (req, res, next) => {
    try {
        res.json({ message: "Hello current user" })
    } catch (error) {
        next(error)
    }
}


module.exports = authController
```

## Step 22 validator using Zod
create middlewares/ `validators.js`

```bash
npm i zod
```

```js
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
        // console.log("hello middleware")
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

```

## Step 23 update auth-route.js
```js
const express = require("express");
const router = express.Router()
const authController = require("../controllers/auth-controller");
const { validationZod, loginSchema, registerSchema } = require("../middlewares/validators"); // ***

// {{url}}/api/register
router.post("/register", validationZod(registerSchema), authController.register) // ***

// {{url}}/api/login
router.post("/login", validationZod(loginSchema), authController.login) // ***

// {{url}}/api/current-user
router.get("/current-user", authController.currentUser)

module.exports = router;
```


## Step 24 create user controller and routes 

update controllers/user-routes.js
```js
// 1. list all users
// 2. update role
// 3. delete user

exports.listUsers = async (req, res, next) => {
    try {
        res.json({ message: "Hello, list user" })
    } catch (error) {
        next(error)
    }
}

exports.updateRole = async (req, res, next) => {
    try {
        res.json({ message: "update role" })
    } catch (error) {
        next(error)
    }
}

exports.deleteUser = (req, res, next) => {
    try {
        res.json({ message: "delete user" })
    } catch (error) {
        next(error)
    }
}
```

/routes/user-routes.js
```js
const express = require("express")
const router = express.Router()
const userControllers = require("../controllers/user-controller")


router.get("/users", userControllers.listUsers)

router.patch("/user/update-role", userControllers.updateRole)

router.delete("/user/:id", userControllers.deleteUser)

module.exports = router
```

update index.js
```js
// import
require("dotenv").config()
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")

const authRoute = require('./routes/auth-route')
const handleErrors = require("./middlewares/error")
const userRoute = require("./routes/user-route") // ******

// instance
const app = express()

// middlewares 
app.use(express.json()) // for read json from req.body
app.use(cors()) // allow cross domain: diff port can get data from our server
app.use(morgan("dev")) // show output colored by response status for development use in terminal
// e.g. POST /api/login 200 3.006 ms - 23

// routes
app.use("/api", authRoute)
app.use("/api/user", userRoute) // ******

// error middlewares
app.use(handleErrors)


// open server
const port = 8000
app.listen(port, () => console.log(`Server is running on port ${port}`))
```


## Step 25 create `auth-middleware.js` 
folder `middlewares`

```js
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
        // {
        // id: 2,
        // email: 'admin@test.com',
        // firstName: 'admin',
        // lastName: 'admin',
        // role: 'ADMIN',
        // iat: 1738813871,
        // exp: 1738900271
        // }

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decode) => {
            // console.log(err)
            // console.log(decode)

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
```

## Step 26 update `auth-route.js`
```js
const express = require("express");
const router = express.Router()
const authController = require("../controllers/auth-controller");
const { validationZod, loginSchema, registerSchema } = require("../middlewares/validators");
const { auth } = require("../middlewares/auth-middleware"); // ***

// {{url}}/api/register
router.post("/register", validationZod(registerSchema), authController.register)

// {{url}}/api/login
router.post("/login", validationZod(loginSchema), authController.login)

// {{url}}/api/current-user
router.get("/current-user", auth, authController.currentUser) // ***

module.exports = router;
```