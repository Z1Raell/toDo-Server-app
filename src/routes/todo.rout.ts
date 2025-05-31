import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createTodo } from "../controllers/todo.controller";

const router = Router()

router.post("/", authMiddleware, createTodo)