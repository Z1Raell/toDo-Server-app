import mongoose, { Document, Schema } from "mongoose";

export interface ITodo extends Document {
    title: string,
    completed: boolean,
    userId: mongoose.Types.ObjectId
}

const todoSchema = new Schema<ITodo>({
    title: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
    { timestamps: true }
)

export default mongoose.model<ITodo>("Todo", todoSchema)