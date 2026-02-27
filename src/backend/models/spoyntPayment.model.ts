import mongoose, { Schema, Document } from "mongoose";

export interface SpoyntPaymentDocument extends Document {
    cpi?: string;
    referenceId?: string;
    userId: mongoose.Types.ObjectId;
    tokens: number;
    amount: number;
    currency: string;
    gbpAmount?: number;
    uiCurrency?: string;
    uiAmount?: number;
    status?: string;
    resolution?: string;
    creditStatus: "none" | "processing" | "credited";
    credited: boolean;
    creditedAt?: Date;
    creditStartedAt?: Date;
    lastEventAt?: Date;
    webhookReceivedAt?: Date;
    confirmedAt?: Date;
    metadata?: Record<string, unknown>;
}

const spoyntPaymentSchema = new Schema<SpoyntPaymentDocument>(
    {
        cpi: { type: String, index: true, unique: true, sparse: true },
        referenceId: { type: String, index: true, unique: true, sparse: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        tokens: { type: Number, required: true },
        amount: { type: Number, required: true },
        currency: { type: String, required: true },
        gbpAmount: { type: Number },
        uiCurrency: { type: String },
        uiAmount: { type: Number },
        status: { type: String },
        resolution: { type: String },
        creditStatus: {
            type: String,
            enum: ["none", "processing", "credited"],
            default: "none",
        },
        credited: { type: Boolean, default: false },
        creditedAt: { type: Date },
        creditStartedAt: { type: Date },
        lastEventAt: { type: Date },
        webhookReceivedAt: { type: Date },
        confirmedAt: { type: Date },
        metadata: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
);

export const SpoyntPayment =
    mongoose.models.SpoyntPayment ||
    mongoose.model<SpoyntPaymentDocument>("SpoyntPayment", spoyntPaymentSchema);

