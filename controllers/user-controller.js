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