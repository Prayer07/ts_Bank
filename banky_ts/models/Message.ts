import mongoose, { Schema, model, models, Document } from 'mongoose'

export interface IMessage extends Document {
  from: string
  to: string
  text: string
  createdAt: Date
}

const MessageSchema = new Schema<IMessage>(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

const MessageModel = models.Message || model<IMessage>('Message', MessageSchema)
// const MessageModel =  mongoose.models.Message || mongoose.model('Message', messageSchema)

export default MessageModel
