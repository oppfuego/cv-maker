import { NextRequest, NextResponse } from "next/server";
import { userController } from "@/backend/controllers/user.controller";
import { connectDB } from "@/backend/config/db";
import { User } from "@/backend/models/user.model";

// Sandbox-only: credit tokens by email, no auth
export async function POST(req: NextRequest) {
    try {
        const { email, amount } = await req.json();
        if (!email || typeof email !== "string" || !amount || amount <= 0) {
            return NextResponse.json({ message: "Invalid email or amount" }, { status: 400 });
        }
        await connectDB();
        const user = await User.findOne({ email });
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
        user.tokens = (user.tokens || 0) + Math.floor(amount);
        await user.save();
        return NextResponse.json({ user, info: `Credited ${amount} tokens to ${email}` });
    } catch (err: any) {
        return NextResponse.json({ message: err?.message || "Unknown error" }, { status: 400 });
    }
}

