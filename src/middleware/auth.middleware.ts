import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
    userId?: string
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "No token provided" });
        return
    }
    const token = authHeader.split(" ")[1];

    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) throw new Error("JWT_SECRET is not defined");

        const decode = jwt.verify(token, jwtSecret) as { userId: string }
        req.userId = decode.userId
        next()
    } catch (error) {
        res.status(401).json({
            message: "Invalid token"
        })
        return
    }
}