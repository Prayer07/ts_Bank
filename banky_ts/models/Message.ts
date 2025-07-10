import mongoose, { Schema, Document } from 'mongoose'

export interface IMessage extends Document {
  from: string
  to: string
  text: string
  createdAt: Date
}

const messageSchema = new Schema<IMessage>(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
)

export default mongoose.models.Message || mongoose.model<IMessage>('Message', messageSchema)
