import { Router } from "express";
import { createTodo, deletTodo, getTodo, updateTodo } from "../controllers/todo.controller";

const router = Router()

router.post("/", createTodo)
router.get("/", getTodo)
router.patch("/:id", updateTodo)
router.delete("/:id", deletTodo)

export default router