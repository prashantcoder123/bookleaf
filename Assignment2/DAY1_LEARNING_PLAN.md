# Day 1 Learning Plan — Bubble.io & n8n

You're a MERN developer. You already know every concept these tools use.
The only new thing is **where to click**. Here's the fastest path.

---

## 🫧 Bubble.io (Spend 3-4 hours today)

### Mental Model (read this first — 5 min)

| What you know (Code) | What it's called in Bubble |
|----------------------|---------------------------|
| MongoDB Schema / Mongoose Model | **Data Type** (Data tab) |
| Express route + controller | **Workflow** (Workflow tab) |
| React component + JSX | **Element** on the page (Design tab) |
| `.map()` rendering a list | **Repeating Group** |
| `useState` | **Custom State** on a page/element |
| `if/else` in JSX | **Conditional** tab on any element |
| `useEffect` on page load | **Page Load** workflow event |
| `req.user` / auth middleware | **Current User** (built-in) |
| Row-level security | **Privacy Rules** (Data tab) |
| `fetch()` / `axios` | **API Connector** plugin |
| Express API endpoint | **Backend Workflow** |

That's it. Every Bubble concept maps to something you've already built.

### Watch These (in order) — ~2 hours

1. **Bubble Crash Course (30 min)**
   - YouTube: Search "Bubble.io crash course 2024" by Buildcamp or Gregory John
   - This gives you the visual layout of where everything is

2. **Build a Simple CRUD App (45 min)**
   - YouTube: Search "Build a simple app in Bubble.io" 
   - Follow along — create a to-do app or similar
   - Goal: Get comfortable with Data Types, Repeating Groups, and Workflows

3. **API Connector Tutorial (15 min)**
   - YouTube: Search "Bubble API Connector tutorial"
   - This is critical — it's how Bubble calls your n8n webhook

4. **Privacy Rules (15 min)**
   - YouTube: Search "Bubble privacy rules tutorial"
   - Short but important — the evaluators specifically test this

### Read These (skim, don't memorize) — 30 min

- [Bubble Manual - Data](https://manual.bubble.io/core-resources/data) — How database works
- [Bubble Manual - Workflows](https://manual.bubble.io/core-resources/logic/workflows) — How actions work
- [Bubble Manual - Privacy](https://manual.bubble.io/core-resources/data/the-privacy-tab) — How to lock down data

### Then Start Building — 1-2 hours

Don't wait until you "learn everything." Start building after the crash course video.

**Build in this order:**
1. Create the app → set up your 3 Data Types (User, Book, NotificationLog)
2. Manually enter 2-3 authors and 4-5 books (just to test)
3. Build the login page
4. Build one author page with a Repeating Group showing books

You'll learn 10x faster by building than by watching more videos.

---

## ⚡ n8n (Spend 1-2 hours today)

### Mental Model

| What you know (Code) | What it's called in n8n |
|----------------------|------------------------|
| Express route receiving POST | **Webhook** node |
| `fetch()` to external API | **HTTP Request** node |
| JS function transforming data | **Code** node |
| `if/else` logic | **IF** node |
| try/catch error handling | **Error output** (red dot on nodes) |
| SendGrid / nodemailer | **Send Email** node |
| Entire Express route chain | **Workflow** (visual chain of nodes) |

### Watch This — 30 min

1. **n8n Beginner Tutorial (20-30 min)**
   - YouTube: Search "n8n tutorial for beginners 2024"
   - Focus on: Webhook node, HTTP Request node, Code node, IF node

### Set Up n8n — 15 min

**Recommended: n8n Cloud (easiest)**
1. Go to [n8n.io](https://n8n.io) → Start free trial
2. No installation needed — it runs in your browser
3. Webhook URLs are public automatically (no ngrok needed)

**Alternative: Self-hosted (if you prefer control)**
```bash
# Using Docker
docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n

# Then use ngrok to expose it:
ngrok http 5678
```

### Import the Workflow I Created — 5 min

1. In n8n → **Workflows** → **Import from File**
2. Select `Assignment2/n8n-workflow/bookleaf-royalty-summary-workflow.json`
3. The entire workflow loads with all nodes pre-configured
4. You just need to add your credentials (Gemini API key, Bubble API key)

---

## 📅 Realistic 7-Day Schedule

| Day | What to Do | Hours |
|-----|-----------|-------|
| **Day 1 (Today)** | Watch tutorials, set up accounts, create Bubble app, set up database, enter sample data | 4-5h |
| **Day 2** | Build Login + Author Dashboard + My Books page | 4-5h |
| **Day 3** | Build Royalty Overview + Status Badges + Admin Dashboard | 4-5h |
| **Day 4** | Build Admin Author Detail + Notification Log pages | 3-4h |
| **Day 5** | Set up n8n (import workflow), configure API Connector in Bubble, wire the trigger button | 3-4h |
| **Day 6** | Test end-to-end, fix bugs, add privacy rules, error handling, polish UI | 3-4h |
| **Day 7** | Record Loom video, finalize README, export n8n workflow, submit | 2-3h |

**Total: ~25-30 hours over 7 days** — very doable.

---

## 💡 Tips From Developers Who Learned Bubble

1. **Don't fight Bubble's way of doing things.** It feels weird at first to not write code. Embrace the drag-and-drop. You'll be fast within a day.

2. **Use the Debugger.** In preview mode, click the bug icon (bottom-left). It shows you what data each element is loading, step-by-step. It's like `console.log` but visual.

3. **Responsive design is optional.** The assignment says "we're not expecting pixel-perfect design." Focus on functionality. Make it work on desktop — don't waste time on mobile.

4. **Repeating Groups are everything.** 80% of your pages are just Repeating Groups showing filtered data. Master this one element and you're set.

5. **"Search for" is your database query.** Every time you need data, you use `Do a search for [Type]` with constraints. It's like `Model.find({ field: value })` in Mongoose.

6. **Save often, preview often.** Bubble auto-saves, but preview your changes frequently. The preview mode shows your actual app with real data.

---

## ❓ Common "Where is this?" Questions

| "How do I..." | Where in Bubble |
|--------------|----------------|
| Create a database table | Data tab → Data Types → "New Type" |
| Add a field to a table | Data tab → click the type → "Create a new field" |
| Add data manually | Data tab → App Data → select type → "New entry" |
| Create a new page | Page dropdown (top-left) → "Add a new page" |
| Add a button | Design tab → drag "Button" from the element palette (left side) |
| Make a button do something | Click button → "Start/Edit workflow" → add actions |
| Show a list of items | Drag "Repeating Group" → set Type of content + Data source |
| Show a field inside a list | Inside repeating group → drag Text → click "Insert dynamic data" → Current cell's [Type]'s [field] |
| Filter/search | In a Repeating Group's data source → add constraints, or use `:filtered` |
| Hide/show based on condition | Click element → Conditional tab → add condition → change visibility |
| Call an external API | Plugins tab → API Connector → add API → add call |
| Receive an API call | Settings → API → enable Backend Workflows → new workflow |
| Set up login | Add Input fields + Button → Workflow: Account → Log the user in |
| Check current user | Anywhere: use "Current User" in dynamic expressions |
| Redirect on page load | Workflow tab → "Page is loaded" event → Navigation → Go to page |
