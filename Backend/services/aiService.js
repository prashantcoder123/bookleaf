import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});

// BookLeaf Knowledge Base — kept as a single reusable constant to avoid duplication
const BOOKLEAF_KB = `
BOOKLEAF PUBLISHING — KNOWLEDGE BASE

Company: BookLeaf Publishing is a self-publishing company operating in India and the US.
Packages: Standard Free (no upfront cost) and Bestseller Breakthrough (premium, paid with marketing and distribution add-ons).
Services: Cover design, typesetting, ISBN assignment, printing, distribution, and royalty management.
Printing: In-house facility and warehouse in Delhi. Print partners: Repro India and Epitome Books.

ROYALTY POLICY:
- 80/20 split: 80% of net profit to author, 20% to BookLeaf.
- Net profit = MRP minus printing cost, platform commission (Amazon/Flipkart), and shipping charges.
- Royalties calculated quarterly, paid within 45 days of quarter end.
- Minimum payout threshold: ₹1,000. Below this, rolls over to next quarter.
- Payouts via bank transfer to linked account.
- Authors can view detailed royalty breakdown per platform in dashboard.

ISBN POLICY:
- Every book gets a unique ISBN assigned by BookLeaf under BookLeaf's publisher imprint.
- Authors wanting ISBN under own imprint must obtain independently.
- ISBN errors (duplicate, wrong book linked) are HIGH PRIORITY — escalated to production team immediately.

PRINTING & QUALITY:
- In-house printing handles most orders. Overflow goes to Repro India or Epitome Books.
- Standard turnaround: 5–7 business days from order confirmation.
- Quality issues (misprints, binding defects, color inconsistency): BookLeaf arranges FREE reprint after verification. Author shares photos of defective copy.

DISTRIBUTION:
- Books listed on: Amazon India, Flipkart, Amazon US, Amazon UK, BookLeaf Store.
- New listings go live within 7–10 business days after publication.
- "Currently Unavailable" usually = stock sync issue. Re-sync within 24–48 hours.

PRODUCTION STAGES:
Manuscript Received → Editing (if opted) → Cover Design → Typesetting → Proofreading → ISBN Assignment → Printing → Distribution Setup → Published & Live.
- Authors updated at each stage via email.
- Delays typically at Cover Design (waiting for author approval) and Proofreading (revision rounds).

TONE GUIDELINES:
- Always empathetic and professional. Authors are partners, not customers.
- Acknowledge concern before solutions.
- Be specific with numbers, dates, statuses — no vague reassurances.
- If BookLeaf's fault, own it directly. No corporate deflection.
- If escalation needed, give clear timeline (e.g., "within 48 hours").
- Always end with clear next step for author and/or BookLeaf team.
`;

// Classify ticket into one of the required categories
const classifyTicket = async (description) => {
    try {
        const prompt = `You are a support ticket classifier for BookLeaf Publishing, a self-publishing company.

Classify this support ticket into EXACTLY ONE of these categories:
- Royalty & Payments
- ISBN & Metadata Issues
- Printing & Quality
- Distribution & Availability
- Book Status & Production Updates
- General Inquiry

Context about what each category covers:
- "Royalty & Payments": Questions about royalty amounts, payout delays, payment calculations, bank details, payout schedules.
- "ISBN & Metadata Issues": ISBN errors, wrong ISBN, metadata updates, book description changes, wrong book linked.
- "Printing & Quality": Print quality issues, misprints, binding defects, blurry images, color problems, reprint requests.
- "Distribution & Availability": Book not available on platforms, stock sync issues, listing delays, platform availability.
- "Book Status & Production Updates": Production delays, typesetting status, cover design approval, proofreading, publication timeline.
- "General Inquiry": Author bio updates, general questions, account issues, anything else.

Ticket description: "${description}"

Respond with ONLY the category name, nothing else.`;

        const result = await model.generateContent(prompt);
        const category = result.response.text().trim();

        // Validate the response matches allowed categories
        const validCategories = [
            "Royalty & Payments",
            "ISBN & Metadata Issues",
            "Printing & Quality",
            "Distribution & Availability",
            "Book Status & Production Updates",
            "General Inquiry",
        ];

        if (validCategories.includes(category)) {
            return category;
        }

        // Fuzzy match if AI returns slight variation
        const match = validCategories.find((c) =>
            category.toLowerCase().includes(c.toLowerCase().split(" ")[0])
        );

        return match || "General Inquiry";

    } catch (error) {
        console.log("AI Classification failed:", error.message);
        return "General Inquiry";
    }
};

// Generate priority score
const generatePriority = async (description) => {
    try {
        const prompt = `You are a support ticket priority analyzer for BookLeaf Publishing.

Analyze this support ticket and assign a priority level.

Priority guidelines:
- "Critical": Financial loss, ISBN errors showing wrong book, royalties not received for 3+ months, legal/compliance issues, books wrongly attributed.
- "High": Significant delays (2+ weeks overdue), quality defects requiring reprints, payment discrepancies, distribution issues affecting sales.
- "Medium": General production delays, standard royalty inquiries, metadata update requests, moderate timeline questions.
- "Low": Bio updates, general information requests, minor cosmetic changes, questions with no urgency.

Ticket: "${description}"

Respond with ONLY one word: Critical, High, Medium, or Low.`;

        const result = await model.generateContent(prompt);
        const priority = result.response.text().trim();

        const validPriorities = ["Critical", "High", "Medium", "Low"];

        if (validPriorities.includes(priority)) {
            return priority;
        }

        // Normalize
        const normalized = priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
        if (validPriorities.includes(normalized)) {
            return normalized;
        }

        return "Medium";

    } catch (error) {
        console.log("AI Priority generation failed:", error.message);
        return "Medium";
    }
};

// Generate a draft response using the Knowledge Base
const generateDraftResponse = async (description, category) => {
    try {
        // Only include relevant KB sections based on category to save tokens
        let contextHint = "";
        if (category?.includes("Royalty")) {
            contextHint = "Focus on the ROYALTY POLICY section of the knowledge base.";
        } else if (category?.includes("ISBN")) {
            contextHint = "Focus on the ISBN POLICY section. ISBN errors are high priority.";
        } else if (category?.includes("Printing")) {
            contextHint = "Focus on the PRINTING & QUALITY section.";
        } else if (category?.includes("Distribution")) {
            contextHint = "Focus on the DISTRIBUTION section.";
        } else if (category?.includes("Production")) {
            contextHint = "Focus on the PRODUCTION STAGES section.";
        }

        const prompt = `You are a customer support representative for BookLeaf Publishing. Write a professional, empathetic draft response to this author's support query.

${BOOKLEAF_KB}

${contextHint}

IMPORTANT TONE RULES:
- Address the author as a valued partner
- Acknowledge their concern FIRST before offering solutions
- Be specific — include actual policies, timelines, and next steps from the knowledge base
- If it's BookLeaf's fault, own it directly
- End with a clear next step
- Keep response concise but thorough (150-250 words)
- Do NOT use placeholder names or generic greetings — start with "Dear Author,"

Author's query: "${description}"
Category: ${category || "General Inquiry"}

Write the response:`;

        const result = await model.generateContent(prompt);
        return result.response.text().trim();

    } catch (error) {
        console.log("AI Draft generation failed:", error.message);
        return "Thank you for reaching out to BookLeaf Publishing. We have received your query and our support team will review it shortly. We aim to respond within 48 hours. If your issue is urgent, please don't hesitate to follow up.";
    }
};

// AI Deflection - attempt to answer user query instantly
const deflectQuery = async (query) => {
    try {
        const prompt = `You are a helpful AI assistant for BookLeaf Publishing authors.
        
${BOOKLEAF_KB}

The author is about to submit a support ticket with this query: "${query}"

Your goal is to see if this query can be answered instantly using the Knowledge Base.
If the Knowledge Base clearly answers the question (e.g. royalty percentage, payout threshold, printing turnaround), provide a concise, friendly answer (max 3 sentences).
If the Knowledge Base does NOT answer it, or it requires human intervention (like looking up a specific account, fixing an error, or checking book status), respond exactly with the word "NO_DEFLECTION".

Respond:`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();

        if (text === "NO_DEFLECTION" || text.includes("NO_DEFLECTION")) {
            return null;
        }

        return text;

    } catch (error) {
        console.log("AI Deflection failed:", error.message);
        return null;
    }
};

export {
    classifyTicket,
    generatePriority,
    generateDraftResponse,
    deflectQuery,
};