import React from "react";
import Text from "@/components/constructor/text/Text";
import PolicyWrapper from "@/components/layout/policy-wrapper/PolicyWrapper";
import {
    COMPANY_NAME,
    COMPANY_LEGAL_NAME,
    COMPANY_NUMBER,
    COMPANY_ADDRESS,
    COMPANY_EMAIL,
} from "@/resources/constants";

export default function RefundPolicyPage() {
    return (
        <PolicyWrapper>
            <Text
                title="Refund & Cancellation Policy"
                description="Effective date: 10 September 2025"
            />

            <Text
                title="1. Customer Summary"
                bullets={[
                    "Refunds are handled according to this Policy and applicable consumer law.",
                    "Standard refund processing time is 5–10 business days after approval; the actual posting time may vary depending on banks or payment providers.",
                    "Refunds will never exceed the amount you originally paid (minus any non-refundable payment processing fees).",
                    "Tokens already spent on Services (draft generation, export, AI improvement, or manager review) are generally non-refundable.",
                    "Token packages may be refunded only if completely unused; once tokens are deducted, refunds are not available except in cases of technical fault.",
                    "Promotional credits, discounts, or bonus tokens are normally non-refundable, unless required by law or explicitly stated otherwise.",
                    `Refund requests must be submitted by email to ${COMPANY_EMAIL}, including full order details.`,
                    "This Policy may be updated from time to time; significant changes will be communicated as described in Section 8.",
                    "By requesting immediate access to Services (e.g., downloading or generating a CV), you may lose your statutory cancellation right — see Section 4.6.",
                ]}
            />

            <Text
                title="2. Scope and Legal Note"
                description={`This Policy applies to refunds and cancellations related to CV/resume creation, export, AI-assisted improvement, and related services offered by ${COMPANY_LEGAL_NAME}. Nothing in this Policy affects your statutory rights (including those under the Consumer Contracts Regulations 2013 and the Consumer Rights Act 2015, where applicable).`}
            />

            <Text
                title="3. Definitions"
                bullets={[
                    "Order / Service Fee — the amount you paid for token packages.",
                    "Token Package — prepaid credits purchased to access Services.",
                    "Used Tokens — tokens deducted for generating drafts, exporting files, or using AI/manager support.",
                    "Unused Tokens — tokens still available in your account balance.",
                    "Promotional Credits — bonus tokens or discounts granted under promotions.",
                ]}
            />

            <Text
                title="4. Core Refund Rules"
                description={
                    "4.1 Refund cap. Refunds will not exceed the amount actually paid (less any non-refundable payment provider fees). Refunds are issued in the original payment currency where possible.\n\n" +
                    "4.2 Used tokens. Tokens already used for Services are not eligible for refund, except where the Service was materially defective and could not be remedied.\n\n" +
                    "4.3 Cancellation before use. If you cancel before spending any tokens, the unused balance may be refunded, minus any reasonable costs incurred.\n\n" +
                    "4.4 Defective or non-conforming output. If a generated CV/resume is materially defective, we will first attempt to fix it through revisions or regeneration. If the issue cannot be resolved within a reasonable timeframe, a partial or full refund may be issued.\n\n" +
                    "4.5 Promotions. Promotional credits, bonus tokens, or discounts are normally non-refundable unless required by law.\n\n" +
                    "4.6 Immediate use / loss of cancellation right. If you request immediate access to Services and confirm you waive the statutory cancellation right (for example, by generating or downloading a CV), that right may no longer apply.\n\n" +
                    "4.7 Custom services. For services involving a personal manager, once the review has started, refunds are not available unless otherwise agreed in writing."
                }
            />

            <Text
                title="5. How to Request a Refund"
                description={`Send an email to ${COMPANY_EMAIL} including:`}
                bullets={[
                    "Your order reference number.",
                    "The account email used for purchase.",
                    "Whether the request concerns unused tokens, cancellation, or defective outputs.",
                    "For defective files: a description of the issue and supporting evidence (screenshots, filenames, timestamps).",
                    "Your preferred refund method (normally the original payment method).",
                    "We will acknowledge your request within 5 business days, investigate it, and if approved issue the refund within 5–10 business days (posting time depends on the payment provider).",
                ]}
            />

            <Text
                title="6. Investigation, Evidence and Decisions"
                description={
                    "6.1 We review order history, payment logs, token usage, and file generation records.\n\n" +
                    "6.2 Approved refunds are normally returned to the original payment method; if not possible, an alternative (such as bank transfer) may be offered.\n\n" +
                    "6.3 If your claim is refused, we will explain the reasons and outline possible next steps."
                }
            />

            <Text
                title="7. Chargebacks, Fraud and Abuse"
                description="If you initiate a chargeback while a refund request is pending, the case will be treated as a dispute. We will provide full evidence (order records, confirmations, timestamps, downloads) to the payment provider. Refunds may be refused and accounts suspended in cases of fraud, abuse, or repeated unwarranted chargebacks."
            />

            <Text
                title="8. Changes to this Policy"
                description="We may update this Policy periodically. Material changes will be announced on our website or sent via email. Updates apply only to future transactions and do not affect completed purchases."
            />

            <Text
                title="9. Record Retention"
                description="We retain necessary records (including order details, payment logs, and token usage) for at least 24 months, and up to 6 years in cases of disputes or corporate requirements, in line with our Privacy Policy and applicable law."
            />

            <Text
                title="10. Escalation and Disputes"
                description={`If you disagree with our decision, you may appeal by sending full details to ${COMPANY_EMAIL}. Appeals are normally reviewed within 10 business days. This does not affect your statutory right to seek dispute resolution or legal remedies.`}
            />

            <Text
                title="11. Examples"
                bullets={[
                    "Unused tokens: You purchased £20 = 2000 tokens, used 300 tokens → 1700 tokens remain. Refund possible for 1700 tokens (minus fees).",
                    "Used tokens: If tokens were spent to generate/download a CV, a refund is only possible if the file was materially defective.",
                    "Promotional tokens: 100 bonus tokens received in a promotion → non-refundable.",
                ]}
            />

            <Text
                title="12. Contact Details"
                bullets={[
                    `📧 ${COMPANY_EMAIL}`,
                    `🏢 ${COMPANY_LEGAL_NAME} (Company No. ${COMPANY_NUMBER})`,
                    COMPANY_ADDRESS ?? "Address not specified",
                ]}
            />
        </PolicyWrapper>
    );
}
