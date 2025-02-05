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
const handleError = (err, req, res, next) => {

    // err from util > createError
    console.log(err)

    res
        .status(err.statusCode || 500)
        .json({ 
            message: err.message || "Internal server error!!!" 
        })
    
}

module.exports = handleError;
```