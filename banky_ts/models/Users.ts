import mongoose, { Document, Schema } from "mongoose"

export interface ITransaction {
    type: string
    amount: number
    to?: string
    from?: string
    date?: Date
}

export interface IUser extends Document {
    fullname: string
    email: string
    password: string
    balance: number
    accountNo: number
    transactions: ITransaction[]
}

const transactionSchema = new mongoose.Schema({
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    to: { type: String },
    from: { type: String },
    date: { type: Date, default: Date.now },
})

const UserSchema = new Schema<IUser>(
    {
        fullname: {
        type: String,
        required: true,
        trim: true,
        },
        email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        },
        password: {
        type: String,
        trim: true,
        },
        balance: {
        type: Number,
        default: 0,
        },
        accountNo: {
        type: Number,
        default: 0,
        },
        transactions: {
        type: [transactionSchema],
        default: [],
        },
    },
    { timestamps: true }
)

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)