// types/message.ts
export interface Message {
  _id: string
  from: string
  to: string
  text: string
  createdAt: string
  updatedAt?: string
}
