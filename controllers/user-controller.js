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