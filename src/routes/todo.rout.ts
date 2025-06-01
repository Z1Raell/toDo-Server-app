import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createTodo, getTodo } from "../controllers/todo.controller";

const router = Router()

router.post("/", authMiddleware, createTodo)
router.get("/", authMiddleware, getTodo)

export default router