import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import User from "../moduls/user.model"
import { z } from "zod"
import jwt from "jsonwebtoken"

const loginSchema = z.object({
    password: z.string(),
    email: z.string().email("Некоректный email")
})
const jwtConfigSchema = z.object({
    secret: z.string().min(16, "JWT_SECRET is required"),
    expiresIn: z.enum(["15m","1d","30m", "1h", "2h", "24h", "7d", "30d"])
})

export const loginuser = async (req: Request, res: Response) => {
    try {
        const parsed = loginSchema.safeParse(req.body)

        if (!parsed.success) {
            res.status(400).json({
                message: "Validation error",
                errors: parsed.error.errors.map(e => e.message)
            })
            return
        }

        const { email, password } = parsed.data
        if (!email || !password) {
            res.status(400).json({
                message: "Please provide email and password"
            })
            return
        }
        const user = await User.findOne({ email })
        if (!user) {
            res.status(404).json({
                message: "User not found"
            })
            return
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid password" })
            return
        }

        const jwtConfigResult = jwtConfigSchema.safeParse({
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRES_IN
        })
        if (!jwtConfigResult.success) {
            console.error("JWT configuration error:", jwtConfigResult.error.errors)
            res.status(500).json({ 
                message: "Server configuration error" 
            })
            return
        }
        const {secret,expiresIn } = jwtConfigResult.data


        const token = jwt.sign(
            { userId: user._id },
            secret,
            { expiresIn } 

        )

        res.status(200).json({
            message: "Login successful", token
        })
    } catch (err) {
        console.error("Login error:", err)
        res.status(500).json({ message: "Server error" })

    }
}