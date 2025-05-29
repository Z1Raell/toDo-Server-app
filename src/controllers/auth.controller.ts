import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import User from "../moduls/user.model"
import { z } from "zod"

const registerSchema = z.object({
    userName: z.string().min(3,"Имя должно быть не короче 3 символов"),
    email: z.string().email("некоректный email"),
    password: z.string().min(6,"пароль должен быть не короче 6 символов")
})

export const registerUser = async (req: Request, res: Response) => {
    try {
        let parsed = registerSchema.safeParse(req.body)
        if(!parsed.success) {
            res.status(400).json({
                message: "Validation error",
                errors: parsed.error.errors.map(e => e.message)
            })
            return
        }
        const { userName, email, password } = parsed.data
        if (!userName || !email || !password) {
            res.status(400).json({
                message: "Please fill all fields"
            })
            return
        }
        const userExist = await User.findOne({ email })
        if (userExist) {
            res.status(200).json({
                message: "user alredy exist"
            })
            return
        }

        const salt = await bcrypt.genSalt(10)
        const hesgedPassword = await bcrypt.hash(password, salt)
        const user = await User.create({
            userName,
            email,
            password: hesgedPassword
        })

        res.status(201).json({
            _id: user._id,
            userName: user.userName,
            email: user.email
        })
    } catch (err) {
        res.status(500).json({
            message: `Server error ${err}`
        })
    }
}

