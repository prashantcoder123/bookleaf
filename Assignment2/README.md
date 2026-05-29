# BookLeaf Publishing — Assignment 2
## Author Royalty Dashboard & Automated Notification System

**Candidate:** Prashant Kumar  
**Tech Stack:** Bubble.io + n8n + Google Gemini 2.0 Flash  
**Date:** May 2026

---

## Table of Contents

1. [Live Links & Credentials](#live-links--credentials)
2. [Bubble Database Schema](#bubble-database-schema)
3. [Application Architecture](#application-architecture)
4. [Bubble ↔ n8n Integration](#bubble--n8n-integration)
5. [AI Prompt Strategy](#ai-prompt-strategy)
6. [Error Handling Approach](#error-handling-approach)
7. [Idempotency & Duplicate Prevention](#idempotency--duplicate-prevention)
8. [Privacy Rules](#privacy-rules)
9. [Challenges & Learning Process](#challenges--learning-process)
10. [Setup Instructions](#setup-instructions)

---

## Live Links & Credentials

| Resource | Link |
|----------|------|
| **Bubble App (Live)** | `https://bookleaf-royalty-dashboar-71859.bubbleapps.io/version-test` |
| **Workflow API Root** | `https://bookleaf-royalty-dashboar-71859.bubbleapps.io/version-test/api/1.1/wf` |
| **Bubble Editor** | Collaborator access given to specified email |
| **n8n Workflow** | `https://prashant1718.app.n8n.cloud/webhook/royalty-summary` |

### Test Credentials

**Admin Access:**
- Email: `admin@bookleaf.com`
- Password: `admin123`

**Author Access (Sample):**
- Email: `priya.sharma@email.com`
- Password: `123456`

All 10 seeded author accounts use password `123456`. Full list:

| Author | Email |
|--------|-------|
| Priya Sharma | priya.sharma@email.com |
| Rohit Kapoor | rohit.kapoor@email.com |
| Ananya Reddy | ananya.reddy@email.com |
| Vikram Joshi | vikram.joshi@email.com |
| Meera Nair | meera.nair@email.com |
| Arjun Malhotra | arjun.malhotra@email.com |
| Sneha Kulkarni | sneha.kulkarni@email.com |
| Farhan Sheikh | farhan.sheikh@email.com |
| Kavita Deshmukh | kavita.deshmukh@email.com |
| Diya Chatterjee | diya.chatterjee@email.com |

---

## Bubble Database Schema

### Design Philosophy

I structured the Bubble database to mirror a relational model — **normalized, with clear entity separation and foreign-key-style relationships.** This matches how the data would be structured in a production system (PostgreSQL, MongoDB, etc.) and makes it easy to query, filter, and extend.

### Data Types

#### 1. User

Stores both authors and admins. Bubble's built-in User type is extended with custom fields.

| Field | Type | Description |
|-------|------|-------------|
| `email` | email (built-in) | Login email, unique per user |
| `role` | text | `"author"` or `"admin"` — controls access and portal routing |
| `author_id` | text | Original dataset ID (e.g., "AUTH001") — useful for reference |
| `name` | text | Full display name |
| `phone` | text | Contact number |
| `city` | text | City — used for admin filtering |
| `joined_date` | date | When the author joined BookLeaf |

**Why extend User instead of a separate Author type?**  
Bubble's authentication system is tied to the `User` type. By adding author-specific fields directly to `User`, we avoid the complexity of maintaining a separate `Author` type with a 1:1 relationship to `User`. The `role` field cleanly separates author vs. admin behavior.

#### 2. Book

Each book is a separate record linked to its author via a relational field.

| Field | Type | Description |
|-------|------|-------------|
| `book_id` | text | Original dataset ID (e.g., "BK001") |
| `title` | text | Book title |
| `isbn` | text | ISBN number |
| `genre` | text | Genre/category |
| `publication_date` | date | Nullable — empty for "In Production" books |
| `status` | text | "Published & Live", "In Production - Cover Design", etc. |
| `mrp` | number | Maximum retail price in ₹ |
| `author_royalty_per_copy` | number | Per-copy royalty in ₹ |
| `total_copies_sold` | number | Lifetime copies sold |
| `total_royalty_earned` | number | Total royalty earned in ₹ |
| `royalty_paid` | number | Amount already paid out |
| `royalty_pending` | number | Amount still owed |
| `last_royalty_payout_date` | date | Nullable — empty if never paid |
| `print_partner` | text | "In-House", "Repro India", or "Epitome Books" |
| `available_on` | list of texts | Platforms where the book is listed |
| `author` | User | **Relationship** — links to the owning User |

**Why `available_on` as a list of texts instead of a separate Platform type?**  
The platform list is simple (5 known values), static, and only used for display. A separate `Platform` type would add unnecessary complexity for this use case. In a production system with dynamic platform management, I'd normalize this into a separate type.

#### 3. NotificationLog

Tracks every royalty summary trigger — the audit trail the admin needs.

| Field | Type | Description |
|-------|------|-------------|
| `author` | User | Which author the summary was generated for |
| `triggered_by` | User | Which admin triggered the action |
| `triggered_at` | date | Timestamp when admin clicked the button |
| `status` | text | "Pending", "Success", or "Failed" |
| `completed_at` | date | When n8n finished processing |
| `email_content` | text | The AI-generated email text (for audit/review) |
| `error_message` | text | Error details if status is "Failed" |
| `idempotency_key` | text | Deduplication key (e.g., "AUTH001_2026-05-25") |

**Why a separate NotificationLog instead of fields on User?**  
1. An author can receive multiple notifications over time — this is inherently a one-to-many relationship.
2. The assignment explicitly requires a "log" with timestamps and statuses — a list naturally fits a separate data type.
3. It enables the admin Notification Log page with sorting, filtering, and pagination.
4. It cleanly separates concerns: `User` stores identity, `NotificationLog` stores event history.

---

## Application Architecture

```
┌─────────────────────────────────────────────────────┐
│                  BUBBLE.IO APP                       │
│                                                     │
│  ┌──────────────┐     ┌──────────────────────┐     │
│  │ Author Portal │     │    Admin Portal       │     │
│  │              │     │                      │     │
│  │ • Dashboard  │     │ • Author Overview    │     │
│  │ • My Books   │     │ • Author Detail      │     │
│  │ • Royalties  │     │ • Trigger Summary    │     │
│  │              │     │ • Bulk Trigger       │     │
│  │              │     │ • Notification Log   │     │
│  └──────────────┘     └──────┬───────────────┘     │
│                              │                      │
│                    API Connector                     │
│                    (POST webhook)                    │
│                              │                      │
│  ┌───────────────────────────┤                      │
│  │ Backend Workflow:         │                      │
│  │ /api/1.1/wf/n8n-callback │                      │
│  │ (receives callback)       │                      │
│  └───────────────────────────┘                      │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ HTTPS (webhook call)
                       │ Header: X-API-Key
                       ▼
┌─────────────────────────────────────────────────────┐
│                    n8n WORKFLOW                       │
│                                                     │
│  Webhook ──► Validate ──► Fetch Author ──►          │
│              API Key      from Bubble               │
│                              │                      │
│                    Fetch Books from Bubble           │
│                              │                      │
│                    Build AI Prompt (Code node)       │
│                              │                      │
│                    Gemini API → Generate Summary     │
│                              │                      │
│                    Send Email (bonus) ──►            │
│                    Callback to Bubble                │
│                              │                      │
│              ┌───── Error Branch ─────┐             │
│              │ Callback with "Failed" │             │
│              └────────────────────────┘             │
└─────────────────────────────────────────────────────┘
```

---

## Bubble ↔ n8n Integration

### Outbound: Bubble → n8n (Trigger)

**Mechanism:** Bubble's API Connector plugin makes a POST request to the n8n webhook URL.

**When triggered:** Admin clicks "Generate & Send Royalty Summary" button on an author's detail page, or the "Bulk Trigger" button on the admin dashboard.

**Payload sent:**
```json
{
  "author_bubble_id": "1737283948x123",
  "author_id": "AUTH001",
  "idempotency_key": "AUTH001_2026-05-25",
  "callback_url": "https://your-app.bubbleapps.io/api/1.1/wf/n8n-callback",
  "bubble_app_url": "https://your-app.bubbleapps.io"
}
```

**Headers:**
- `Content-Type: application/json`
- `X-API-Key: bookleaf-n8n-secret-2026` (shared secret for webhook security)

**Bubble workflow (on button click):**
1. Check idempotency: Search NotificationLog where `idempotency_key` = generated key AND `status` = "Pending". If found → show alert, abort.
2. Create NotificationLog entry with status "Pending", current timestamp, and idempotency key.
3. Call n8n webhook via API Connector.
4. If API Connector returns error → update NotificationLog to "Failed", show error toast.

### Inbound: n8n → Bubble (Callback)

**Mechanism:** n8n makes a POST request to a Bubble Backend Workflow (API endpoint).

**Bubble Backend Workflow: `n8n-callback`**
- **Endpoint:** `/api/1.1/wf/n8n-callback`
- **Method:** POST
- **Authentication:** API key in header
- **Parameters:** `author_bubble_id` (text), `idempotency_key` (text), `status` (text), `email_content` (text), `error_message` (text), `completed_at` (text)

**Workflow logic:**
1. Search NotificationLog where `idempotency_key` = received key.
2. Update the record: set `status`, `email_content` (or `error_message`), `completed_at`.

### Data Fetching Strategy: API Call vs. Webhook Payload

**Decision: n8n fetches data from Bubble's Data API** (rather than receiving full payload in the webhook).

**Justification:**
1. **Data freshness:** Fetching at processing time ensures the data is current, not stale from when the admin clicked the button.
2. **Small payload:** The webhook only sends IDs and metadata, keeping the request lean and fast.
3. **Security:** Financial data (royalty figures) doesn't travel in the webhook payload. Only identifiers are sent, and the full data is fetched over an authenticated API call.
4. **Single source of truth:** Bubble's database remains the canonical source. No risk of webhook payload diverging from actual data.
5. **Simplicity:** The webhook format stays stable regardless of schema changes to Books or Users.

**Trade-off:** One additional API call per trigger (actually two — one for User, one for Books). For a dataset of 10 authors and 18 books, this is negligible. In a production system with thousands of authors, I would consider batching or sending the payload directly.

---

## AI Prompt Strategy

### Model Choice: Google Gemini 2.0 Flash

I chose Gemini 2.0 Flash for consistency with Assignment 1 (where the same model powers ticket classification, prioritization, and response drafting). This demonstrates that the same AI infrastructure can serve different use cases across platforms.

**Alternative considered:** OpenAI gpt-4o-mini (n8n has a native OpenAI node). Gemini was preferred for continuity and because the API key was already available from Assignment 1.

### Prompt Design

The prompt is constructed dynamically in the n8n Code node. Key design decisions:

1. **Knowledge Base injection:** The BookLeaf royalty policy (80/20 split, quarterly cycle, 45-day window, ₹1,000 threshold) is embedded directly in the prompt. This ensures the AI references actual company policy rather than generic financial advice.

2. **Tone guidelines embedded:** The same tone guidelines from the BookLeaf Knowledge Base are included — empathetic, specific, authors-as-partners. This ensures the generated email matches the company's communication style.

3. **Structured data input:** The author's books are formatted as a structured list with all financial fields, making it easy for the model to extract and reference specific numbers.

4. **Consolidated summary pre-calculated:** The Code node calculates total_earned, total_paid, total_pending before passing to the AI. This prevents mathematical errors in the model's output.

5. **Edge case instructions:**
   - If all royalties are paid → positive acknowledgement (not silence)
   - If books are in production → status update with next expected stage
   - If pending amount exists → specific payout date calculation based on quarterly cycle

6. **Formatting guardrails:**
   - 300-500 word target
   - ₹ symbol for currency
   - No subject line (generated separately)
   - Sign off as "The BookLeaf Royalty Team"

### Sample Output (for Priya Sharma)

```
Dear Priya,

Thank you for being a valued BookLeaf partner. Here's your latest royalty summary.

📚 Book-wise Royalty Breakdown

1. "Whispers of the Ganges" (Literary Fiction)
   - Copies Sold: 342
   - Total Royalty Earned: ₹11,970
   - Royalty Paid: ₹8,400
   - Royalty Pending: ₹3,570
   - Last Payout: October 15, 2025

2. "The Saffron Diaries" (Non-Fiction / Memoir)
   - Copies Sold: 189
   - Total Royalty Earned: ₹7,938
   - Royalty Paid: ₹7,938 ✅
   - Status: Fully Paid

📊 Consolidated Summary
   - Total Earned: ₹19,908
   - Total Paid: ₹16,338
   - Total Pending: ₹3,570

💰 Next Payout Information
You have ₹3,570 in pending royalties from "Whispers of the Ganges."
As per BookLeaf's royalty policy, payouts are processed quarterly within
45 days of the quarter end. [Specific date based on current quarter.]

Thank you for continuing to create with us. Your stories are reaching
readers across India, and we're proud to be part of your journey.

Warm regards,
The BookLeaf Royalty Team
```

---

## Error Handling Approach

### n8n Workflow Error Handling

Every external API call in the workflow has an **error output** that routes to a centralized error handler:

| Node | Possible Failure | Handling |
|------|-----------------|----------|
| **Webhook Trigger** | Invalid API key in header | Return 401 immediately, do not process |
| **Fetch Author from Bubble** | Bubble API timeout, invalid ID, rate limit | Route to Error Handler → callback with "Failed" |
| **Fetch Books from Bubble** | Same as above | Route to Error Handler → callback with "Failed" |
| **Gemini AI Call** | API rate limit (429), timeout, content filter block | Route to Error Handler → callback with "Failed" |
| **Extract Email Content** | Unexpected AI response format | Throws error → caught by Error Handler |
| **Send Email (SMTP)** | SMTP credentials invalid, recipient bounced | `onError: continueRegularOutput` — continues to callback even if email fails |
| **Callback to Bubble** | Bubble API unreachable | Final node — n8n logs the failure internally |

**Error Handler Logic (Code node):**
1. Extracts the error message from whichever node failed.
2. Constructs a standardized failure payload.
3. Sends callback to Bubble with `status: "Failed"` and `error_message`.
4. Returns 500 to the webhook caller with error details.

### Bubble Error Handling

**On API Connector error:**
- If the n8n webhook returns an error or times out (default 30s Bubble timeout):
  - The NotificationLog entry (created before the call) is updated to `status: "Failed"` with the error info.
  - A visible alert/toast is shown to the admin: _"Notification failed. Please check the notification log for details."_
  - The button is re-enabled (not left in loading state).

**On callback never received:**
- If n8n crashes mid-workflow and never sends a callback, the NotificationLog stays as "Pending."
- On the admin Notification Log page, entries stuck as "Pending" for more than 5 minutes are visually flagged (yellow highlight) with a "Retry" button.

---

## Idempotency & Duplicate Prevention

### Strategy

**Idempotency Key:** `{author_id}_{YYYY-MM-DD}`

Example: `AUTH001_2026-05-25`

This means only **one summary per author per day** can be in-flight.

### Bubble-side Deduplication

Before creating a new NotificationLog entry, the Bubble workflow checks:

```
Search for NotificationLog:
  WHERE idempotency_key = [generated key]
  AND status = "Pending"
  Count > 0 → Block the trigger, show alert
```

If a matching "Pending" entry exists, the admin sees:  
_"A royalty summary is already being generated for this author. Please check the notification log."_

### Why this approach?

1. **Prevents double-click issues:** Two rapid clicks won't create two webhooks calls.
2. **Allows intentional re-triggers:** If the first attempt failed, the admin can retry (the failed entry won't block because its status is "Failed", not "Pending").
3. **Allows next-day triggers:** The date component ensures re-triggering on a different day works fine.
4. **Simple and predictable:** Both the admin and the system can reason about the behavior easily.

---

## Privacy Rules

### Bubble Privacy Tab Configuration

#### User Data Type

| Rule Name | Condition | Visibility |
|-----------|-----------|------------|
| Author sees self | Current User's role is "author" | This User is visible when: This User = Current User. All fields visible. |
| Admin sees all | Current User's role is "admin" | Always visible. All fields visible. |

#### Book Data Type

| Rule Name | Condition | Visibility |
|-----------|-----------|------------|
| Author sees own books | Current User's role is "author" | This Book is visible when: This Book's author = Current User. All fields visible. |
| Admin sees all books | Current User's role is "admin" | Always visible. All fields visible. |

#### NotificationLog Data Type

| Rule Name | Condition | Visibility |
|-----------|-----------|------------|
| Admin only | Current User's role is "admin" | Always visible. All fields visible. |
| Block authors | Current User's role is "author" | Nothing visible. |

### Testing Privacy Rules

To verify data isolation:
1. Log in as `priya.sharma@email.com` → should only see BK001 and BK002.
2. Log in as `rohit.kapoor@email.com` → should only see BK003 and BK004.
3. Try accessing another author's book detail page via direct URL → should show empty/error.
4. Log in as `admin@bookleaf.com` → should see all 10 authors and 18 books.

---

## Challenges & Learning Process

### Bubble.io — Learning Curve

**Prior experience:** This was my first time using Bubble.io. My background is in code-based full-stack development (MERN stack, as demonstrated in Assignment 1).

**Learning approach:**
1. **Day 1:** Read through Bubble's official manual (manual.bubble.io), focusing on: Data Types, Privacy Rules, Workflows, and the API Connector plugin. Watched two YouTube tutorials on building a basic CRUD app.
2. **Day 2:** Started building — database schema first, then the simpler Author Portal pages. The repeating group concept clicked quickly since it maps to `.map()` in React.
3. **Day 3-4:** Built the Admin Portal and tackled the more complex parts: conditional formatting for royalty badges, API Connector for n8n, and Backend Workflows for callbacks.

**What was intuitive:**
- Database design — translating my Mongoose schema from Assignment 1 to Bubble data types was straightforward.
- Privacy rules — the concept maps directly to row-level security in SQL or middleware auth checks in Express.
- Conditional formatting — similar to ternary operators / conditional rendering in React.

**What was challenging:**
- **Workflow debugging:** Bubble's workflow debugger is less transparent than console.log. I had to use the Step-by-Step mode extensively.
- **API Connector configuration:** Getting the dynamic headers and body parameters right required trial and error, especially for the n8n callback URL.
- **List operations:** Performing `:sum` on a list of related items' numeric fields felt unintuitive at first compared to `Array.reduce()` in JavaScript.

**What I'd do differently:**
- Start with a paper wireframe before building pages. I rebuilt the admin dashboard layout twice.
- Use Option Sets for the `role` field instead of text — cleaner and prevents typos.

### n8n

**Prior experience:** First time using n8n. I've built automation workflows with custom scripts and cron jobs, but not with a visual workflow tool.

**Learning approach:** n8n's documentation is excellent. The node-based paradigm maps well to how I think about data pipelines (input → transform → output). Setting up the error branches was the most valuable learning — n8n's `onError: continueErrorOutput` pattern is elegant.

---

## Setup Instructions

### If Setting Up From Scratch

#### 1. Bubble App
1. Create a new Bubble app at [bubble.io](https://bubble.io).
2. Set up the database schema as described above.
3. Import the provided CSV files (`authors.csv`, `books.csv`) via Data → App Data → Import.
4. Note: After importing authors as User records, you'll need to manually set passwords in Bubble's Users tab (Bubble doesn't import passwords via CSV). Set all author passwords to `123456` and admin password to `admin123`.
5. Build the pages following the structure in this document.

#### 2. n8n Workflow
1. Sign up for [n8n Cloud](https://n8n.io) (free trial) or self-host via Docker.
2. Import the provided `bookleaf-royalty-summary-workflow.json` via Workflows → Import.
3. Configure credentials:
   - **Bubble API Key:** Go to Bubble → Settings → API → Generate new API key. Add as HTTP Header Auth in n8n (`Authorization: Bearer <key>`).
   - **Gemini API Key:** Add as HTTP Query Auth in n8n (key = your Gemini API key from Assignment 1).
   - **SMTP (optional):** Configure if you want actual email sending.
4. Activate the webhook and note the URL.

#### 3. Connect Bubble to n8n
1. In Bubble → Plugins → API Connector → Add API: `n8n_webhook`.
2. Set the URL to your n8n webhook URL.
3. Add header `X-API-Key: bookleaf-n8n-secret-2026`.
4. Create a Bubble Backend Workflow at `/api/1.1/wf/n8n-callback` to receive the n8n callback.

---

## Files Included in Submission

| File | Description |
|------|-------------|
| `README.md` | This document |
| `n8n-workflow/bookleaf-royalty-summary-workflow.json` | Importable n8n workflow |
| `data/authors.csv` | Author data for Bubble import |
| `data/books.csv` | Book data for Bubble import |
| `screen-recording.mp4` | 3-5 minute walkthrough (Loom) |
