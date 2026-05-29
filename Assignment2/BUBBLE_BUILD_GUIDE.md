# Bubble.io — Step-by-Step Build Guide

This guide walks you through building the entire BookLeaf Royalty Dashboard in Bubble.
Follow these steps in order.

---

## Phase 1: Account & App Setup (15 min)

### Step 1: Create Your Bubble Account
1. Go to [bubble.io](https://bubble.io) → Sign up (free plan is fine).
2. Click **"Create a new app"**.
3. App name: `bookleaf-royalty-dashboard`
4. Select **"Start from scratch"** (not a template).
5. Skip the tutorial if prompted — follow this guide instead.

### Step 2: Understand Bubble's Interface
- **Design tab**: Where you build pages (drag & drop UI elements)
- **Workflow tab**: Where you define actions (button clicks, API calls)
- **Data tab**: Where you set up your database and view/edit records
- **Settings tab**: API keys, domain, privacy rules
- **Plugins tab**: Where you add API Connector and other plugins

---

## Phase 2: Database Setup (30 min)

### Step 3: Define Data Types

Go to **Data → Data Types**.

**User (built-in — modify it):**
1. Bubble already has a `User` type. Click on it.
2. Add these fields:
   - `role` → type: text
   - `author_id` → type: text
   - `name` → type: text
   - `phone` → type: text
   - `city` → type: text
   - `joined_date` → type: date

**Book (create new):**
1. Click **"New Type"** → name it `Book`
2. Add fields:
   - `book_id` → text
   - `title` → text
   - `isbn` → text
   - `genre` → text
   - `publication_date` → date
   - `status` → text
   - `mrp` → number
   - `author_royalty_per_copy` → number
   - `total_copies_sold` → number
   - `total_royalty_earned` → number
   - `royalty_paid` → number
   - `royalty_pending` → number
   - `last_royalty_payout_date` → date
   - `print_partner` → text
   - `available_on` → **list of texts** (important: check the "list" checkbox!)
   - `author` → **User** (this creates the relationship)

**NotificationLog (create new):**
1. Click **"New Type"** → name it `NotificationLog`
2. Add fields:
   - `author` → User
   - `triggered_by` → User
   - `triggered_at` → date
   - `status` → text
   - `completed_at` → date
   - `email_content` → text
   - `error_message` → text
   - `idempotency_key` → text

### Step 4: Import Data

**Option A: Manual Entry (Recommended for 28 records)**

Go to **Data → App Data → All Users**.

1. Click **"New entry"** → create the admin:
   - email: admin@bookleaf.com
   - role: admin
   - name: BookLeaf Admin
   *Note: Bubble does not allow setting passwords directly in the database tab for security. We will set their passwords via the SignUp/Login page in preview mode once built.*

2. Create each author user manually:
   - email: priya.sharma@email.com
   - role: author
   - author_id: AUTH001
   - name: Priya Sharma
   - phone: +91-98765-43210
   - city: Mumbai
   - joined_date: 2023-03-15

3. Repeat for all 10 authors (refer to `data/authors.csv`).

4. Go to **Data → App Data → All Books**.
5. Create each book, selecting the correct author from the User dropdown.

**Option B: CSV Upload**

1. Go to **Data → App Data → select the type → "Upload"**
2. Upload `authors.csv` for Users and `books.csv` for Books.
3. Map columns to fields.
4. ⚠️ CSV upload doesn't handle passwords or relationships perfectly — you'll need to:
   - Set passwords for each user by temporarily using a "Sign the user up" workflow action on your Login page in Preview mode.
   - Link books to authors (if the relationship didn't auto-map).


---

## Phase 3: Author Portal (2-3 hours)

### Step 5: Create Login Page

1. Go to **Design tab** → you'll see `index` (the default page).
2. Rename it to `login` (or keep as index).
3. Drag these elements onto the page:
   - **Text**: "BookLeaf Publishing" (header)
   - **Text**: "Sign in to your account"
   - **Input** (type: Email): set placeholder "Email address"
   - **Input** (type: Password): set placeholder "Password"
   - **Button**: "Sign In"

4. **Workflow** (click the button → "Start/Edit workflow"):
   - **Action 1**: Account → Log the user in
     - Email: `Input Email's value`
     - Password: `Input Password's value`
   - **Action 2**: Navigation → Go to page...
     - Use a conditional:
       - If `Current User's role is "admin"` → go to `admin-dashboard`
       - If `Current User's role is "author"` → go to `author-dashboard`

### Step 6: Create Author Dashboard Page

1. **Add new page**: click the page dropdown → "Add a new page..." → name: `author-dashboard`
2. Add a **header section**:
   - Text: "Welcome back, [Current User's name]" (use dynamic data: insert `Current User's name`)
   - Text: "Your publishing dashboard"
   - Button: "Logout" → Workflow: Account → Log the user out → Navigate to login

3. Add **Summary Cards** (use a Group element for each card):

   **Card 1: Total Books**
   - Text (dynamic): `Search for Books (constraint: author = Current User):count`

   **Card 2: Total Copies Sold**
   - Text (dynamic): `Search for Books (constraint: author = Current User):each item's total_copies_sold:sum`

   **Card 3: Total Royalty Earned**
   - Text (dynamic): `Search for Books (constraint: author = Current User):each item's total_royalty_earned:sum`
   - Format as currency: ₹

   **Card 4: Total Pending**
   - Text (dynamic): `Search for Books (constraint: author = Current User):each item's royalty_pending:sum`

4. Add a **Repeating Group** for books:
   - Type of content: `Book`
   - Data source: `Search for Books` with constraint `author = Current User`
   - Layout: Full list (or fixed number of cells)
   - Inside each cell:
     - Text: `Current cell's Book's title`
     - Text: `Current cell's Book's status`
     - Text: `₹Current cell's Book's royalty_pending` (formatted)
     - **Royalty Status Badge** (see Step 7)

### Step 7: Royalty Status Badge (Conditional Formatting)

1. Inside the repeating group cell, add a **Shape** (or Text element).
2. Default state: background color green, text "Fully Paid"
3. Click on the element → **Conditional** tab → Add conditions:

   **Condition 1 (Yellow):**
   - When: `Current cell's Book's royalty_pending > 0` AND `Current cell's Book's last_royalty_payout_date +(days):90 > Current date/time`
   - Property: Background color → Yellow/Orange
   - Property: Text → "Pending"

   **Condition 2 (Red - Overdue, has payout date):**
   - When: `Current cell's Book's royalty_pending > 0` AND `Current cell's Book's last_royalty_payout_date +(days):90 < Current date/time`
   - Property: Background color → Red
   - Property: Text → "Overdue"

   **Condition 3 (Red - Never paid, published > 90 days):**
   - When: `Current cell's Book's royalty_pending > 0` AND `Current cell's Book's last_royalty_payout_date is empty` AND `Current cell's Book's publication_date is not empty` AND `Current cell's Book's publication_date +(days):90 < Current date/time`
   - Property: Background color → Red
   - Property: Text → "Overdue"

   ⚠️ **Order matters in Bubble conditionals** — conditions lower in the list override those above them. Put the Red conditions BELOW Yellow.

### Step 8: My Books Page

1. **Add new page**: `author-my-books`
2. Add a **Repeating Group**:
   - Type: Book
   - Data source: `Search for Books (author = Current User)`
3. Inside each cell, show:
   - Title, ISBN, Genre, Status, Publication Date, MRP
   - **Available On**: Use a nested Repeating Group with type "text" and data source `Current cell's Book's available_on`. Each cell shows the platform name as a chip/tag.
4. Make each row clickable → Navigate to `author-book-detail` with URL parameter: `book_id = Current cell's Book's book_id`

### Step 9: Book Detail / Royalty Overview Page

1. **Add new page**: `author-book-detail`
2. Set the page's **Type of content** to `Book`.
3. Use URL parameter or page data to load the specific book.
4. Display all royalty fields:
   - Total Copies Sold, Total Royalty Earned, Royalty Paid, Royalty Pending, Last Payout Date
   - Royalty Status Badge (same conditional logic as Step 7)
   - Platform availability

---

## Phase 4: Admin Portal (2-3 hours)

### Step 10: Admin Dashboard Page

1. **Add new page**: `admin-dashboard`
2. **Stats cards** (same pattern as author, but search ALL records without author constraint):
   - Total Authors: `Search for Users (role = author):count`
   - Total Books: `Search for Books:count`
   - Total Pending Royalties: `Search for Books:each item's royalty_pending:sum`

3. **Filter controls** (above the repeating group):
   - **Dropdown - City**: Type = text, Choices = "Mumbai, Delhi, Hyderabad, Pune, Kochi, Chandigarh, Bangalore, Lucknow, Nagpur, Kolkata" (or dynamic from data)
   - **Dropdown - Payout Status**: Choices = "All, Fully Paid, Pending, Overdue"
   - **Search Input**: For author name

4. **Author List Repeating Group**:
   - Type: User
   - Data source: `Search for Users (role = author)` then apply `:filtered` for search/filter
   - Columns per cell:
     - Name: `Current cell's User's name`
     - City: `Current cell's User's city`
     - Total Books: `Search for Books (author = Current cell's User):count`
     - Total Earned: `Search for Books (author = Current cell's User):each item's total_royalty_earned:sum`
     - Total Pending: `Search for Books (author = Current cell's User):each item's royalty_pending:sum`
   - Click action: Navigate to `admin-author-detail?author_id=Current cell's User's unique id`

5. **Bulk Trigger Button**: "Generate Summaries for All Pending"
   - Workflow: See Step 12

6. **Notification Log Section** (or separate page):
   - Repeating Group of `NotificationLog`, sorted by `triggered_at` descending
   - Columns: Author Name, Triggered At, Status (with color), Completed At, View Email Content

### Step 11: Admin Author Detail Page

1. **Add new page**: `admin-author-detail`
2. Type of content: `User`
3. Display author info: Name, Email, Phone, City, Joined Date
4. Book list (same as author's view, but for this specific author)
5. Royalty summary (consolidated figures)
6. **"Generate & Send Royalty Summary" Button**: See Step 12
7. **Notification History**: Filtered NotificationLog for this author

### Step 12: Trigger Workflows (Bubble → n8n)

#### Install API Connector Plugin
1. Go to **Plugins → Add plugins → search "API Connector" → Install**
2. Click **"Add another API"**:
   - API Name: `n8n_webhook`
   - Authentication: None (we handle it via custom header)
3. Click **"Add a call"**:
   - Name: `trigger_royalty_summary`
   - Method: **POST**
   - URL: `https://your-n8n.app.n8n.cloud/webhook/royalty-summary` (your n8n webhook URL)
   - Add Header: Key=`X-API-Key`, Value=`bookleaf-n8n-secret-2026` (mark as private)
   - Add Header: Key=`Content-Type`, Value=`application/json`
   - Body type: JSON
   - Body:
   ```json
   {
     "author_bubble_id": "<author_unique_id>",
     "author_id": "<author_id>",
     "idempotency_key": "<key>",
     "callback_url": "https://your-app.bubbleapps.io/api/1.1/wf/n8n-callback",
     "bubble_app_url": "https://your-app.bubbleapps.io"
   }
   ```
   - Click **"Initialize call"** to test (use sample values).

#### Single Author Trigger Workflow (on button click):

1. **Step 1 - Check Idempotency:**
   - "Only when" condition on the button: `Search for NotificationLogs (idempotency_key = [generated key] AND status = Pending):count is 0`

2. **Step 2 - Create NotificationLog:**
   - Action: Data → Create a new thing → NotificationLog
   - author = [the author User]
   - triggered_by = Current User
   - triggered_at = Current date/time
   - status = "Pending"
   - idempotency_key = [author's author_id] + "_" + Current date/time:formatted as YYYY-MM-DD

3. **Step 3 - Call n8n webhook:**
   - Action: Plugins → n8n_webhook - trigger_royalty_summary
   - Fill in the dynamic parameters

4. **Step 4 - Error handling:**
   - If the API call fails, add an event: "When n8n_webhook returns an error"
   - → Make changes to the NotificationLog → set status = "Failed", error_message = "Webhook call failed"
   - → Show alert: "Failed to trigger summary. Check notification log."

#### Bulk Trigger Workflow:

1. **Step 1**: Search for Users where role = author AND (their books' royalty_pending sum > 0)
2. **Step 2**: Schedule API Workflow on a list → for each author, run the single trigger workflow
3. ⚠️ Add a small delay between calls to avoid overwhelming n8n

### Step 13: Backend Workflow (n8n → Bubble Callback)

1. Go to **Settings → API → Enable Backend Workflows**.
2. Create a new **Backend Workflow**:
   - Name: `n8n-callback`
   - Add parameters:
     - `author_bubble_id` (text)
     - `idempotency_key` (text)
     - `status` (text)
     - `email_content` (text)
     - `error_message` (text)
     - `completed_at` (text)
3. Workflow actions:
   - **Search** for NotificationLog where `idempotency_key = idempotency_key parameter`
   - **Make changes** to Result of search:first item:
     - `status` = status parameter
     - `email_content` = email_content parameter
     - `error_message` = error_message parameter
     - `completed_at` = completed_at parameter (converted to date)

---

## Phase 5: Privacy Rules (20 min)

### Step 14: Configure Privacy

Go to **Data → Privacy**.

1. Click on **User**:
   - Remove or modify the default rule
   - **Add Rule: "Author sees self"**
     - Define a "who" condition: Current User's role is "author"
     - Check: "This User = Current User" for visibility
     - Check all field boxes for visible fields
   - **Add Rule: "Admin sees all"**
     - Define a "who" condition: Current User's role is "admin"
     - Keep default visibility (everyone matching this condition sees all)

2. Click on **Book**:
   - **Add Rule: "Author sees own books"**
     - Condition: Current User's role is "author"
     - Visibility: This Book's author = Current User
   - **Add Rule: "Admin sees all"**
     - Condition: Current User's role is "admin"
     - All visible

3. Click on **NotificationLog**:
   - **Add Rule: "Admin only"**
     - Condition: Current User's role is "admin"
     - All visible
   - Default (no rule match) = not visible → authors can't see logs

### Step 15: Test Privacy

1. Preview the app → log in as `priya.sharma@email.com`
2. Check that only Priya's books appear
3. Try navigating to admin pages → should redirect or show empty
4. Log in as `admin@bookleaf.com`
5. Check that all 10 authors and 18 books are visible
6. Check notification log is visible

---

## Phase 6: Polish & Testing (1-2 hours)

### Step 16: Page Access Rules

On each page, add a **Page Load workflow**:

**Author pages** (`author-dashboard`, `author-my-books`, etc.):
- Only when: `Current User's role is not "author"` → Navigate to login

**Admin pages** (`admin-dashboard`, `admin-author-detail`, etc.):
- Only when: `Current User's role is not "admin"` → Navigate to login

### Step 17: UI Polish

- Use consistent colors (BookLeaf brand: deep greens, warm golds)
- Add a navigation sidebar or top nav
- Format numbers with commas: use `:formatted as 1,234`
- Format dates: use `:formatted as MMM DD, YYYY`
- Add loading states on buttons that trigger API calls

### Step 18: Full End-to-End Test

1. Log in as admin
2. Go to Author Detail for Priya Sharma
3. Click "Generate & Send Royalty Summary"
4. Check notification log → should show "Pending" then update to "Success"
5. Check the email content in the notification log
6. Log in as an author → verify data isolation
7. Test with edge cases: Ananya Reddy (never paid), Kavita Deshmukh (book in production)

---

## Quick Reference: Bubble Concepts → Code Equivalents

| Bubble Concept | Code Equivalent |
|---------------|-----------------|
| Data Type | Mongoose Schema / SQL Table |
| Privacy Rules | Middleware auth + row-level security |
| Repeating Group | `.map()` rendering a list |
| Conditional | Ternary operator / `if-else` in JSX |
| Workflow | Event handler / API route |
| API Connector | `fetch()` / `axios.post()` |
| Backend Workflow | Express API endpoint |
| `:filtered` | `.filter()` on an array |
| `:each item's field:sum` | `.reduce()` aggregation |
| Custom State | `useState()` in React |
