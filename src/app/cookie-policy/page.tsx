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

export default function CookiesPolicyPage() {
    return (
        <PolicyWrapper>
            <Text
                title="Cookies Policy"
                description="Effective date: 10 September 2025"
            />

            <Text
                title="1. Overview"
                description={`This Cookies Policy explains how ${COMPANY_NAME}, operated by ${COMPANY_LEGAL_NAME} (Company No. ${COMPANY_NUMBER}, registered office: ${COMPANY_ADDRESS}), uses cookies and similar technologies (such as localStorage, sessionStorage, pixels, and other identifiers) across our website and services. This Policy complements our Privacy Policy. By continuing to browse the site or interacting with the cookie banner, you can manage or provide consent to non-essential cookies as outlined below.`}
            />

            <Text
                title="2. What Are Cookies?"
                description="Cookies are small text files or browser entries placed on your device when you visit a website. They enable essential site functionality (such as login sessions), help remember your preferences, support performance improvements, and — with your consent — activate analytics and marketing features."
            />

            <Text
                title="3. Categories of Cookies We Use"
                description="We use cookies only for limited, clearly defined purposes. The main categories include:"
                bullets={[
                    "Essential / Necessary — required for core platform features (e.g., login, security, session management). These are strictly necessary and do not require consent.",
                    "Functional — store user preferences such as language, layout, and interface settings.",
                    "Performance / Analytics — collect aggregated information about site usage (page views, load times, errors) to improve service reliability. Depending on the tool, these may rely on legitimate interests or user consent.",
                    "Marketing / Advertising — activated only with your consent; used for campaign tracking, remarketing, and personalised offers.",
                    "Security / Anti-abuse — help detect suspicious activity, fraud, bots, or misuse of the platform.",
                ]}
            />

            <Text
                title="4. Examples of Typical Cookies"
                description="The names, lifetimes, and providers of cookies may change. Current information is always available in the cookie settings panel on our website. Examples include:"
                bullets={[
                    "session_id — Keeps you logged in/session • Essential • Lifetime: Session",
                    "csrf_token — Provides CSRF protection • Essential • Lifetime: Session",
                    "cookie_consent — Stores your cookie preferences • Functional • Lifetime: 6–12 months",
                    "ui_prefs — Saves UI/language settings • Functional • Lifetime: ~6 months",
                    "_ga, _gid — Basic analytics (Google) • Performance/Analytics • Lifetime: 1–24 months",
                    "campaign_src — Tracks marketing attribution • Marketing • Lifetime: 30–90 days",
                ]}
            />

            <Text
                title="5. Consent and Lawful Basis"
                bullets={[
                    "Essential cookies are used without consent, as they are required for the Service to function.",
                    "Non-essential cookies (functional, analytics, marketing) are only activated after you provide consent via the cookie banner or settings panel, unless we rely on legitimate interests for limited analytics or security.",
                    "Our legal bases for cookie use include contract performance, consent, and legitimate interests (e.g., fraud prevention, service improvement, dispute defence).",
                ]}
            />

            <Text
                title="6. How We Record and Retain Consent"
                description="When you provide cookie consent, we log the version of the text shown, timestamp, IP address, and browser details as proof of your choice. Consent records are retained for at least 24 months, and up to 6 years where required for enterprise or dispute resolution purposes, in line with our Privacy Policy."
            />

            <Text
                title="7. Third Parties and International Transfers"
                description="We work with trusted third-party providers (e.g., payment processors, hosting/cloud platforms, analytics, marketing, customer support tools) that may place cookies or similar identifiers. Some providers are located outside the UK/EEA. In such cases, we rely on safeguards such as UK adequacy regulations, Standard Contractual Clauses (SCCs), or equivalent legal mechanisms. A current list of active providers is available in the cookie settings panel."
            />

            <Text
                title="8. How to Manage or Withdraw Cookie Consent"
                bullets={[
                    "Use the cookie banner or cookie settings panel on our website to accept, decline, or customise non-essential cookies.",
                    "You may withdraw or adjust your consent at any time via the cookie settings link in the footer.",
                    "You can also manage cookies directly through your browser settings or by using private/incognito mode.",
                    "Please note: disabling certain cookies may reduce functionality (e.g., automatic login or saved preferences).",
                ]}
            />

            <Text
                title="9. Updates to this Policy"
                description="We may update this Cookies Policy periodically (for example, if new tools or technologies are introduced). Significant changes will be communicated by a notice on the website or, where appropriate, by email to registered users. The effective date will always be updated accordingly."
            />

            <Text
                title="10. Contact"
                bullets={[
                    `📧 ${COMPANY_EMAIL}`,
                    `🏢 ${COMPANY_LEGAL_NAME}`,
                    COMPANY_ADDRESS ?? "Address not specified",
                ]}
            />
        </PolicyWrapper>
    );
}
