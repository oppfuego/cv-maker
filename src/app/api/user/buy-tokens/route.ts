import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/backend/middlewares/auth.middleware";
import { userController } from "@/backend/controllers/user.controller";

const TOKENS_PER_GBP = 100;
const RATES_TO_GBP = { GBP: 1, EUR: 1.17, USD: 1.27 } as const;

export async function POST(req: NextRequest) {
    try {
        const payload = await requireAuth(req);
        const body = await req.json();

        if (body.currency && body.amount) {
            const { currency, amount } = body;
            if (!Object.keys(RATES_TO_GBP).includes(currency)) {
                return NextResponse.json({ message: "Unsupported currency" }, { status: 400 });
            }

            const amountNum = Number(amount);
            if (!Number.isFinite(amountNum) || amountNum <= 0) {
                return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
            }

            const gbpEquivalent = amountNum / RATES_TO_GBP[currency as "GBP" | "EUR" | "USD"];
            const tokens = Math.max(1, Math.floor(gbpEquivalent * TOKENS_PER_GBP));

            const user = await userController.buyTokens(payload.sub, tokens);

            return NextResponse.json({ user, info: `Converted ${amountNum} ${currency} → ${tokens} tokens` });
        }

        const amountNum = Number(body?.amount);
        if (!Number.isFinite(amountNum) || amountNum <= 0) {
            return NextResponse.json({ message: "Invalid token amount" }, { status: 400 });
        }

        const user = await userController.buyTokens(payload.sub, Math.floor(amountNum));
        return NextResponse.json({ user });
    } catch (err: any) {
        const message = err?.message || "Unknown error";
        const isAuthError = /Missing auth|Invalid or expired token/i.test(String(message));
        return NextResponse.json({ message }, { status: isAuthError ? 401 : 400 });
    }
}
