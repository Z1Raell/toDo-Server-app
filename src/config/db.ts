import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config();

const conectDB = async () => {
    try {
        await mongoose.connect(process.env.URL!);
        console.log("MongoDB conected");
    } catch (err) {
        console.error("DB connection failed:", err);
        process.exit(1);

    }
}

export default conectDB