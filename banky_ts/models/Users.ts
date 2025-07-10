import mongoose, { Document, Schema } from "mongoose"

export interface ITransaction {
  type: string
  amount: number
  to?: string
  from?: string
  date?: Date
}

export interface IUser extends Document {
  fname: string
  lname: string
  phone: string
  password: string
  balance: number
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
    fname: {
      type: String,
      required: true,
      trim: true,
    },
    lname: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{10}$/, 'Phone number must be 10 digits'],
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    balance: {
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
