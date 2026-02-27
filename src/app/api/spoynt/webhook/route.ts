// app/api/spoynt/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { userController } from "@/backend/controllers/user.controller";
import { spoyntPaymentService } from "@/backend/services/spoyntPayment.service";

function assertEnv(name: string): string {
    const v = process.env[name];
    if (!v) throw new Error(`Missing env: ${name}`);
    return v;
}

/**
 * Spoynt signature:
 * base64_encode( sha1( secret + rawJson + secret, true ) )
 * :contentReference[oaicite:9]{index=9}
 */
function spoyntSignature(secret: string, rawBody: string) {
    const sha1 = crypto.createHash("sha1");
    sha1.update(secret + rawBody + secret, "utf8");
    const digest = sha1.digest(); // binary
    return Buffer.from(digest).toString("base64");
}

export async function POST(req: NextRequest) {
    try {
        const secret = assertEnv("SPOYNT_PRIVATE_KEY");

        const rawBody = await req.text();
        const theirSig =
            req.headers.get("x-signature") ||
            req.headers.get("X-Signature") ||
            "";

        if (!theirSig) {
            return NextResponse.json({ message: "Missing X-Signature" }, { status: 400 });
        }

        const ourSig = spoyntSignature(secret, rawBody);

        const a = Buffer.from(ourSig);
        const b = Buffer.from(theirSig);
        if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
            return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
        }

        const payload = JSON.parse(rawBody);

        const type = payload?.data?.type;
        const cpi = payload?.data?.id;
        const attrs = payload?.data?.attributes;

        if (type !== "payment-invoices" || !cpi) {
            return NextResponse.json({ message: "Unsupported callback type" }, { status: 200 });
        }

        const status = attrs?.status;
        const resolution = attrs?.resolution;
        const metadata = attrs?.metadata || {};

        await spoyntPaymentService.markStatusByCpi({
            cpi,
            status,
            resolution,
            metadata,
            webhook: true,
            referenceId: attrs?.reference_id,
            userId: metadata?.user_id,
            tokens: Number(metadata?.tokens),
            amount: Number(attrs?.amount),
            currency: attrs?.currency,
        });

        if (status === "processed" && resolution === "ok") {
            const userId = metadata.user_id;
            const tokensStr = metadata.tokens;

            const tokens = Number(tokensStr);
            if (!userId || !Number.isFinite(tokens) || tokens <= 0) {
                return NextResponse.json({ message: "Missing metadata for crediting" }, { status: 200 });
            }

            const creditLock = await spoyntPaymentService.tryBeginCredit(cpi);
            if (!creditLock) {
                return NextResponse.json({ ok: true });
            }

            try {
                await userController.buyTokens(userId, Math.floor(tokens));
                await spoyntPaymentService.markCredited(cpi);
            } catch (err) {
                await spoyntPaymentService.releaseCreditLock(cpi);
                throw err;
            }

            return NextResponse.json({ ok: true });
        }

        return NextResponse.json({ ok: true });
    } catch (err: any) {
        return NextResponse.json({ message: err?.message || "Webhook error" }, { status: 400 });
    }
}