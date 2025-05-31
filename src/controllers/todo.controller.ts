import { Request, Response } from "express";
import Todo from "../moduls/todo.model"
import { z } from "zod"

const todoSchema = z.object({
    title: z.string().min(1, "Title required"),
    completed: z.boolean().optional()
})
interface AuthRequest extends Request {
    userId?: string;
}

export const createTodo = async (req: AuthRequest, res: Response) => {
    try {
        const parsed = todoSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                errors: parsed.error.errors.map(e => e.message)
            })
            return
        }
        const { title, completed = false } = parsed.data;
        const userId = req.userId
        if (!userId) {
            res.status(403).json({
                message: "Unauthorized"
            })
            return
        }
        const todo = await Todo.create({ title, completed, userId })

        res.status(201).json({
            message: "Todo created", todo
        })
    } catch (error) {
        console.error("Create todo error:", error);
        res.status(500).json({ message: "Server error" });

    }
}