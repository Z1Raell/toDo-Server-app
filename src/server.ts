import dotenv from "dotenv"
import app from "./app"
import conectDB from "./config/db"


dotenv.config()

const PORT = process.env.PORT || 5000;

const start = async () => {
    await conectDB()
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        
    })
}
start()