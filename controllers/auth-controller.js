const authController = {}

authController.register = (req, res, next) => {

    try {

        res.json({ message: "register... " })

    } catch (error) {

        // console.log(error)
        // res.status(500).json({ message: "server error!!..." })
        next(error)

    }
}

authController.login = (req, res, next) => {
    try {
        // console.log(sss) // test error
        res.json({ message: "login ..." })

    } catch (error) {
        
        next(error)
    }
}

module.exports = authController