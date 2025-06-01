import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    userName: string,
    email: string,
    password: string
}

const userSchema = new Schema<IUser>({
    userName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
}, {
    timestamps: true
})

const User = mongoose.model<IUser>("User", userSchema)
export default User