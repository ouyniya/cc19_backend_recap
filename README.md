# Server# Node.js Express API Setup Guide

## Table of Contents
1. [Initialize the Project](#step-1-initialize-the-project)
2. [Install Dependencies](#step-2-install-dependencies)
3. [Set Up Git](#step-3-set-up-git)
4. [Update Package Scripts and Start Server](#step-4-update-package-scripts-and-start-server)
5. [Create Routes](#step-5-create-routes)
6. [Create Controller](#step-6-create-controller)
7. [Update Main Server File](#step-7-update-main-server-file)
8. [Enhance Authentication](#step-8-enhance-authentication)
9. [Implement Error Handling](#step-9-implement-error-handling)

---

## Step 1: Initialize the Project
Run the following command to create a `package.json` file:
```bash
npm init -y
```

## Step 2: Install Dependencies
Install the required packages:
```bash
npm install express nodemon cors morgan bcryptjs jsonwebtoken zod prisma dotenv
```
Initialize Prisma:
```bash
npx prisma init
```
Create a `.gitignore` file and add:
```
/node_modules
.env
```

## Step 3: Set Up Git
Initialize a Git repository and commit initial files:
```bash
git init
git add .
git commit -m "Initial commit"
```
Connect to a GitHub repository:
```bash
git remote add origin https://github.com/yourusername/repository.git
git branch -M main
git push -u origin main
```
To update code:
```bash
git add .
git commit -m "Your commit message"
git push
```

## Step 4: Update Package Scripts and Start Server
Modify `package.json` to include:
```json
"scripts": {
    "start": "nodemon ."
}
```
Start the server:
```bash
npm start
```
Expected console output:
```
Server is running on port 8000
```

## Step 5: Create Routes
Create a `routes` folder and add `auth-route.js`:
```js
const express = require("express");
const authController = require("../controllers/auth-controller");
const router = express.Router();

router.post("/register", authController.register);

module.exports = router;
```

## Step 6: Create Controller
Create a `controllers` folder and add `auth-controller.js`:
```js
const authController = {};

authController.register = (req, res, next) => {
    try {
        res.json({ message: "Register successful" });
    } catch (error) {
        next(error);
    }
};

module.exports = authController;
```

## Step 7: Update Main Server File
Create `index.js` and set up the server:
```js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoute = require("./routes/auth-route");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/api", authRoute);

const port = 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
```

## Step 8: Enhance Authentication
Add a login function to `auth-controller.js`:
```js
authController.login = (req, res, next) => {
    try {
        res.json({ message: "Login successful" });
    } catch (error) {
        next(error);
    }
};
```
Update `auth-route.js`:
```js
router.post("/login", authController.login);
```

## Step 9: Implement Error Handling
Create a `middlewares` folder and add `error.js`:
```js
const handleErrors = (err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
};

module.exports = handleErrors;
```
Update `index.js` to use error handling:
```js
const handleErrors = require("./middlewares/error");
app.use(handleErrors);
```
Test error handling by triggering an error in `auth-controller.js`:
```js
console.log(undefinedVariable);
```
Expected response in Postman:
```json
{
    "message": "undefinedVariable is not defined"
}
```
## Step 10: Create `createError.js`
**Folder:** `utils`

```js
const createError = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;
};

module.exports = createError;
```

## Step 11: Import `createError.js` in `auth-controller.js`

```js
// Top of the file
const createError = require('../utils/createError');
```

```js
authController.register = (req, res, next) => {
    try {
        const { email, firstName, lastName, password, confirmPassword } = req.body;
        console.log(email, firstName, lastName, password, confirmPassword);

        // Validation example
        if (!email) {
            return createError(400, "Email is required");
        }
    } catch (error) {
        next(error);
    }
};
```

## Step 12: Create `validators.js` in `middlewares`

```js
const { z } = require("zod");

exports.registerSchema = z.object({
    email: z.string().email("Invalid email"),
    firstName: z.string().min(3, "First name must be at least 3 characters"),
    lastName: z.string().min(3, "Last name must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters")
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

exports.loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

exports.validationZod = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        const errMsg = error.errors.map(el => el.message).join(", ");
        const mergeError = new Error(errMsg);
        next(mergeError);
    }
};
```

## Step 13: Update `auth-route.js`

```js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controller");
const { validationZod, loginSchema, registerSchema } = require("../middlewares/validators");

router.post("/register", validationZod(registerSchema), authController.register);
router.post("/login", validationZod(loginSchema), authController.login);

module.exports = router;
```

## Step 14: Update Prisma Schema (`schema.prisma`)

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
  id         Int      @id @default(autoincrement())
  email      String   @unique
  firstName  String
  lastName   String
  role       Role     @default(USER)
  password   String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

## Step 15: Prisma Migration

```bash
npx prisma migrate dev --name init
```

## Step 16: Create Prisma Configuration (`prisma.js`)

```js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = prisma;
```

## Step 17: Update `auth-controller.js`

```js
const authController = {};
const prisma = require('../configs/prisma');
const createError = require('../utils/createError');
const bcrypt = require("bcryptjs");

authController.register = async (req, res, next) => {
    try {
        const { email, firstName, lastName, password } = req.body;

        const checkEmail = await prisma.profile.findFirst({ where: { email } });
        if (checkEmail) return createError(400, "Email is already used");

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await prisma.profile.create({
            data: { email, firstName, lastName, password: hashedPassword }
        });

        res.json({ message: "Register success" });
    } catch (error) {
        next(error);
    }
};

module.exports = authController;
```

## Step 18: Login Function

```js
const jwt = require("jsonwebtoken");

authController.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const profile = await prisma.profile.findFirst({ where: { email } });

        if (!profile || !(await bcrypt.compare(password, profile.password))) {
            return createError(400, "Email or password is invalid");
        }

        const payload = {
            id: profile.id,
            email: profile.email,
            firstName: profile.firstName,
            lastName: profile.lastName
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRED_IN
        });

        res.json({ message: "Login success", payload, token });
    } catch (error) {
        next(error);
    }
};

module.exports = authController;
```

## Step 19: Update `.env` File

```env
DATABASE_URL="mysql://root:password@localhost:3306/landmark"
JWT_SECRET_KEY=facebook
JWT_EXPIRED_IN=1d
```

## Step 20: Test with Postman

### Register

**Method:** `POST`
**URL:** `{{url}}/api/register`
**Body:**
```json
{
    "email": "admin@test.com",
    "firstName": "admin",
    "lastName": "admin",
    "password": "12sdfsdf34",
    "confirmPassword": "12sdfsdf34"
}
```

### Login

**Method:** `POST`
**URL:** `{{url}}/api/login`
**Body:**
```json
{
    "email": "admin@test.com",
    "password": "12sdfsdf34"
}
```

-----




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

update controllers/user-controller.js
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
### update auth-controller.js
```js
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
        res.json({ message: "Hello current user" })
    } catch (error) {
        next(error)
    }
}


module.exports = authController
```

## Step 27 update user-controller.js

```js
// 1. list all users
// 2. update role
// 3. delete user

const prisma = require("../configs/prisma")

exports.listUsers = async (req, res, next) => {
    try {
        console.log(req.user)

        // no password 
        const users = await prisma.profile.findMany({
            omit: {
                password: true
            }
        })
        console.log(users)

        res.json({ result: users })
    } catch (error) {
        next(error)
    }
}

exports.updateRole = async (req, res, next) => {
    try {
        const { id, role } = req.body
        console.log(id, role)

        const updated = await prisma.profile.update({
            where: {
                id: Number(id)
            },
            data: {
                role: role
            }
        })

        res.json({ message: "update role success" })
    } catch (error) {
        next(error)
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params
        console.log(id)

        const deleted = await prisma.profile.delete({
            where: {
                id: Number(id)
            }, 
            select: {
                id: true,
            }
        })

        console.log(deleted)
        
        res.json({ message: "delete user successfully!!", 
            id: deleted.id
         })
    } catch (error) {
        next(error)
    }
}
```