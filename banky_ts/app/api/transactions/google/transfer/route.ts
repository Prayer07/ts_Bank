    // app/api/transfer/route.ts
    import { NextResponse } from "next/server";
    import { auth } from "../../../../../auth";
    import { connectDB } from "../../../../../lib/db";
    import Users from "../../../../../models/Users";

    export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { accountNo, email, amount } = await req.json();
    const senderId = session.user.id;

    if (!accountNo || !amount) {
        return NextResponse.json(
        { error: "Email and amount required" },
        { status: 400 }
        );
    }

    // Find sender & receiver
    const sender = await Users.findById(senderId);
    const receiver = await Users.findOne({ accountNo });

    if (!sender || !receiver) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (accountNo == sender.accountNo){
        return NextResponse.json({error: "Thef you cannot send money to yourself"}, {status: 400})
    }

    const amt = parseFloat(amount)
    if(isNaN(amt) || amt <= 0){
        return NextResponse.json({error: "Inavlid amount"}, {status: 400})
    }

    if (sender.balance < amount) {
        return NextResponse.json({ error: "Insufficient balance" },{ status: 400 });
    }

    // Update balances
    sender.balance -= amt;
    receiver.balance += amt;

    const newTx = {
        type: 'transfer',
        amount: amt,
        to: email,
    }

    sender.transactions.push(newTx)

    sender.transactions.push({
        type: 'transfer',
        amount: amt,
        to: receiver.email,
        from: sender.email,
    })

        receiver.transactions.push({
        type: 'receive',
        amount: amt,
        from: sender.email,
    })

        await sender.save()
        await receiver.save()

    return NextResponse.json({
        success: true,
        receiptId: sender.transactions[sender.transactions.length - 1]._id.toString(), // ✅ use the last pushed
    })
}