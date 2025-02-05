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