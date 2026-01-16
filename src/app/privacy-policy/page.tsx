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

export default function PrivacyPolicyPage() {
    return (
        <PolicyWrapper>
            <Text
                title="Privacy Policy"
                description="Effective date: 10 September 2025"
            />

            <Text
                title="1. Introduction"
                description={`We value your privacy and are committed to handling personal data responsibly. This Privacy Policy explains what data we collect, why we process it, how long we retain it, who we may share it with, and how you can exercise your rights under applicable data-protection law in connection with the services provided by ${COMPANY_NAME}, operated by ${COMPANY_LEGAL_NAME} (Company No. ${COMPANY_NUMBER}), registered at ${COMPANY_ADDRESS}.\n\nFor any questions or data requests, please contact us at: ${COMPANY_EMAIL}.`}
            />

            <Text
                title="2. What Personal Data We Collect"
                description="We only collect the personal data necessary to operate and improve our Services. Typical categories include:"
                bullets={[
                    "Identity & contact details: name, email address, billing/postal address.",
                    "Transaction & order details: token purchases, order references, invoices, payment identifiers (note: we do not store full card details).",
                    "Account data: username, password hash, saved preferences.",
                    "Usage & technical information: IP address, browser/device type, access logs, timestamps.",
                    "CV/resume content: text or documents you provide to create drafts, improvements, or exports.",
                    "Support & correspondence: communications with our support team, uploaded files, and service history.",
                    "Other information: any additional details you voluntarily provide while using our Services.",
                    "We do not collect more information than is required for these purposes.",
                ]}
            />

            <Text
                title="3. Why We Process Your Data and Legal Bases"
                description="We process your data for the following purposes and on these legal grounds:"
                bullets={[
                    "Service delivery (contract performance): to generate drafts, create PDF/DOCX files, apply AI improvements, deliver manager feedback, and communicate with you.",
                    "Payment processing and fraud prevention (legal obligation / legitimate interests): to verify purchases, detect misuse, and comply with accounting and tax requirements.",
                    "Support, refunds, and dispute resolution (contract / legitimate interests).",
                    "Marketing communications (consent): sent only if you opt in; you may withdraw consent at any time.",
                    "Legal and regulatory compliance (legal obligation): such as record-keeping and tax reporting.",
                    "Business interests (legitimate interests): including service improvements, security monitoring, and anonymised analytics — always balanced against your rights.",
                ]}
            />

            <Text
                title="4. Sharing and International Transfers"
                description="We may share personal data with trusted third parties where required to provide Services, including:"
                bullets={[
                    "Payment providers and banks.",
                    "Hosting and cloud service providers (for account storage and CV drafts).",
                    "Analytics, monitoring, and customer support tools.",
                    "Professional advisers (legal or financial), if required.",
                    "Regulators, courts, or law enforcement where legally necessary.",
                    "Some providers may be located outside the UK/EEA. In these cases, we rely on safeguards such as UK adequacy regulations or Standard Contractual Clauses (SCCs). We will not transfer your data in a way that reduces the protections guaranteed under applicable law.",
                ]}
            />

            <Text
                title="5. Cookies and Similar Technologies"
                description="We use cookies and related technologies for essential operations, security, analytics, and (with your consent) marketing. Essential cookies are required for the platform to function. For details and opt-out options, please see our Cookies Policy."
            />

            <Text
                title="6. Data Retention"
                description="We keep personal data only for as long as needed for the purposes outlined in this Policy and to meet legal obligations:"
                bullets={[
                    "Order and payment records: minimum 24 months, up to 6 years in case of disputes or corporate requirements.",
                    "Account and support data: retained as long as your account is active and for legitimate business purposes.",
                    "CV/resume drafts and files: stored only during your active use, unless saved to your account; temporary files may be deleted automatically after processing.",
                    "Marketing data: kept until you withdraw consent or there is no lawful reason to retain it.",
                    "Once no longer required, data is securely deleted or anonymised.",
                ]}
            />

            <Text
                title="7. Your Rights"
                description="Under applicable data-protection laws (including UK GDPR), you have the right to:"
                bullets={[
                    "Access your personal data.",
                    "Request correction or deletion.",
                    "Restrict processing.",
                    "Request portability of your data.",
                    "Object to certain types of processing (including marketing).",
                    "Withdraw consent at any time (where processing is based on consent).",
                ]}
            />

            <Text
                description={`To exercise these rights, please contact us at ${COMPANY_EMAIL}. We may request verification of your identity. We will respond within statutory deadlines unless an extension or lawful refusal applies.`}
            />

            <Text
                title="8. Security Measures"
                description="We implement appropriate technical and organisational measures to protect personal data, including encryption in transit, access controls, secure backups, system monitoring, and staff training. While no system is fully secure, if a breach occurs that affects your rights, we will notify you and the regulator in accordance with the law."
            />

            <Text
                title="9. Automated Decision-Making and Profiling"
                description="We do not engage in automated decision-making that has legal or similarly significant effects on you. Limited automated processes may be used for analytics and service improvements, but these do not override your rights. You may request further information or opt out, where applicable."
            />

            <Text
                title="10. Changes to this Policy"
                description="We may revise this Privacy Policy from time to time. Major updates will be communicated via email or a notice on our website. Otherwise, the revised Policy will be published with a new effective date."
            />

            <Text
                title="11. Contact & Complaints"
                description={`For questions, requests, or complaints about personal data, please contact us at: ${COMPANY_EMAIL}.\n\nIf you are unsatisfied with our handling of your personal data, you have the right to lodge a complaint with the UK Information Commissioner’s Office (ICO).`}
            />

            <Text
                title="Company Details"
                bullets={[
                    `Company: ${COMPANY_LEGAL_NAME}`,
                    `Company number: ${COMPANY_NUMBER}`,
                    `Registered office: ${COMPANY_ADDRESS}`,
                    `Email: ${COMPANY_EMAIL}`,
                ]}
            />
        </PolicyWrapper>
    );
}
