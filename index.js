require("dotenv").config()
const express = require("express")
const app = express()

// middlewares 
app.use(express.json())
app.use(cors())

// routes
app.get("/", (req, res, next) => {
    res.json({ message: "get home" })
})


// open server
const port = 8000
app.listen(port, () => console.log(`Server is running on port ${port}`))