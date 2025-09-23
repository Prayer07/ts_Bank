export interface ITransaction {
    _id: string
    user: string
    type: "add" | "withdraw" | "transfer"
    amount: number
    to?: string
    createdAt: string
    updatedAt?: string
}