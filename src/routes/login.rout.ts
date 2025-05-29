import { Router } from "express";
import { loginuser } from "../controllers/user.controller";

const router  = Router()

router.post("/login",loginuser)

export default router