import { Request, Response } from "express";
import Todo from "../models/todo.model"
import { z } from "zod"

const todoSchema = z.object({
    title: z.string().min(1, "Title required"),
    completed: z.boolean().optional()
})
const updateSchema = z.object({
    title: z.string().min(1).optional(),
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


export const getTodo = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId

        if (!userId) {
            res.status(403).json({
                message: "Unauthorizated"
            })
        }
        const todos = await Todo.find({ userId })
        res.status(200).json({
            message: "Todo fetching succsesfull",
            todos
        })
    } catch (error) {
        console.error("Get todos error:", error);
        res.status(500).json({ message: "Server error" });

    }
}

export const updateTodo = async (req: AuthRequest, res: Response) => {
    try {
        let todoId = req.params.id
        let userId = req.userId

        if (!userId) {
            res.status(403).json({
                message: "Unauthorized"

            })
            return
        }
        const todo = await Todo.findOne({ _id: todoId, userId: req.userId })
        if (!todo) {
            res.status(404).json({
                message: "Todo not found or access denied"
            })
            return
        }

        const parsed = updateSchema.safeParse(req.body)

        if (!parsed.success) {
            res.status(400).json({ errors: parsed.error.errors.map(e => e.message) })
            return
        }

        if (parsed.data.title !== undefined) todo.title = parsed.data.title;
        if (parsed.data.completed !== undefined) todo.completed = parsed.data.completed

        await todo.save()
        res.status(200).json({
            message: "Todod saved",
            todo
        })
    } catch (error) {
        console.error("Update todo error:", error)
        res.status(500).json({ message: "Server error" })

    }
}

export const deletTodo = async (req: AuthRequest, res: Response) => {
    try {
        let todoId = req.params.id
        let userId = req.userId

        if (!userId) {
            res.status(403).json({
                message: "Unauthorized"

            })
            return
        }
        const deleted = await Todo.findByIdAndDelete({ _id: todoId, userId: req.userId })
        if (!deleted) {
            res.status(404).json({
                message: "Todo not found or access denied"
            })
            return
        }

        res.status(200).json({
            message: "Todod deleted",
            todo: deleted
        })
    } catch (error) {
        console.error("Update todo error:", error)
        res.status(500).json({ message: "Server error" })

    }
}