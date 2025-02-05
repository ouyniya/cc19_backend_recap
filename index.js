// import
require("dotenv").config()
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")

const authRoute = require('./routes/auth-route')

// instance
const app = express()

// middlewares 
app.use(express.json()) // for read json from req.body
app.use(cors()) // allow cross domain: diff port can get data from our server
app.use(morgan("dev")) // show output colored by response status for development use in terminal

// routes
app.use("/api", authRoute)

// error middlewares


// open server
const port = 8000
app.listen(port, () => console.log(`Server is running on port ${port}`))