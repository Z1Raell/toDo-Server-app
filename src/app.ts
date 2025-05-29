import express, { Request, Response } from "express";
import authRout from "./routes/auth.rout"
import loginRout from "./routes/login.rout"


const app = express();
app.use(express.json());


app.get("/", (_: Request, res: Response) => {
    res.send("Api is ranning")
})
app.use("/api/auth", authRout)
app.use("/api/auth", loginRout)

export default app