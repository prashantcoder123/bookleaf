# Screen Recording Script (3-5 minutes)

Use Loom (loom.com) or OBS Studio to record this walkthrough.

---

## Recording Structure

### Intro (15 seconds)
> "Hi, I'm Prashant. This is a walkthrough of my BookLeaf Royalty Dashboard
> built with Bubble.io and n8n. I'll show the author portal, admin portal,
> and the automated royalty summary generation flow."

---

### Part 1: Author Portal (60-90 seconds)

**Login as Author:**
1. Show the login page
2. Enter: `priya.sharma@email.com` / `123456`
3. Point out the role-based redirect

**Dashboard:**
> "Here's Priya's dashboard. She can see her consolidated stats —
> 2 books, total royalties earned, and what's pending."

**My Books:**
> "The My Books page shows her two published books with their details.
> Notice the royalty status badges — 'Whispers of the Ganges' shows RED
> because the last payout was over 90 days ago, while 'The Saffron Diaries'
> shows GREEN because it's fully paid."

**Royalty Overview:**
> "Each book has a detailed royalty breakdown — copies sold, earned, paid,
> pending, and the last payout date."

**Logout**

---

### Part 2: Admin Portal (60-90 seconds)

**Login as Admin:**
1. Enter: `admin@bookleaf.com` / `admin123`

**Author Overview:**
> "The admin dashboard shows all 10 authors with their summary stats.
> I can filter by city — let me select 'Mumbai' — and by payout status.
> Let me search for 'Sneha' to find her quickly."

**Author Detail:**
1. Click on Sneha Kulkarni
> "Here's Sneha's detail page. She has 3 books — two published with
> pending royalties, and one, 'Midnight in Mysore,' still in production
> at the Cover Design stage. The system correctly shows no royalty data
> for the in-production book."

**Notification Log:**
> "And here's the notification log — a complete audit trail of every
> royalty summary that's been triggered."

---

### Part 3: Trigger Royalty Summary (60-90 seconds)

> "Now let me trigger a royalty summary for Priya Sharma."

1. Go to Priya Sharma's admin detail page
2. Click **"Generate & Send Royalty Summary"**
3. Show the NotificationLog entry appear as "Pending"

> "The button creates a notification log entry and calls our n8n webhook.
> Let me switch to n8n to show the workflow executing."

**Switch to n8n:**
4. Show the n8n workflow canvas
5. Point out the nodes: Webhook → Validate API Key → Fetch Author → Fetch Books → Build Prompt → Gemini AI → Extract Email → Callback

> "The workflow validates the API key, fetches Priya's data from Bubble's
> Data API, constructs a detailed prompt with the BookLeaf knowledge base,
> sends it to Gemini, and then calls back to Bubble with the result."

6. Show the execution log — green checkmarks on each node

**Back to Bubble:**
7. Show the NotificationLog updated to "Success"
8. Click to view the AI-generated email content

> "The notification log now shows 'Success,' and we can see the
> AI-generated email. It includes a personalised greeting, book-by-book
> royalty breakdown, the consolidated summary, and the expected next
> payout date based on BookLeaf's quarterly cycle."

---

### Part 4: Data Isolation / Privacy (20 seconds)

> "Finally, let me quickly show the privacy rules working.
> If I log in as Rohit Kapoor, I can only see his 2 books —
> none of Priya's data is accessible."

1. Login as rohit.kapoor@email.com
2. Show only his books appear

---

### Closing (10 seconds)

> "That's the complete flow — author dashboard, admin management,
> and automated AI-powered royalty summaries via n8n.
> The error handling, idempotency, and webhook security details
> are all documented in the README. Thanks for reviewing!"

---

## Recording Tips

- **Resolution**: 1080p minimum
- **Browser**: Use Chrome, clean bookmarks bar
- **Zoom**: Increase browser zoom to 110-125% for readability
- **Speed**: Don't rush — let pages load fully before moving on
- **Tabs**: Pre-open Bubble preview in one tab, n8n in another for quick switching
- **Audio**: Use a quiet environment, speak clearly
- **Length**: Aim for 4 minutes — under 3 feels rushed, over 5 loses attention
