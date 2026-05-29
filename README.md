# BookLeaf Publishing - Author Support Portal

A comprehensive web application for authors to manage their published books, track royalties, and submit support tickets. It features an AI-assisted admin dashboard for the operations team to efficiently handle author queries.

## 🚀 Live Links
- **Frontend (Vercel)**: [https://bookleaf-delta.vercel.app](https://bookleaf-delta.vercel.app)
- **Backend (Render)**: [https://bookleaf-2t1p.onrender.com](https://bookleaf-2t1p.onrender.com)

## 🛠️ Architecture

The project follows a standard MERN stack architecture with real-time socket communication and Google Gemini AI integration.

- **Frontend**: React (Vite), React Router, Context API for state management.
- **Backend**: Node.js, Express, MongoDB with Mongoose.
- **Real-time**: Socket.io for instant ticket updates and notifications.
- **AI Integration**: Google Gemini 2.0 Flash for ticket classification, prioritization, and drafting responses.

---

## ⚙️ Setup Instructions (Local Deployment)

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB instance)
- Google Gemini API Key

### 1. Installation
Clone the repository and install dependencies for both the Backend and Frontend.
```bash
# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install
```

### 2. Environment Variables (.env)
*Note: The following credentials are provided strictly for the evaluator to easily set up the local environment and test the live application. Please do not misuse them.*

Create a `.env` file inside the `Backend` directory and paste the following:
```env
PORT=5000
MONGO_URI=mongodb+srv://prashantkum7676_db_user:uUXob4Yva01sy659@cluster0.m25fwms.mongodb.net/?appName=Cluster0
JWT_SECRET=bookleafsecret
GEMINI_API_KEY=AIzaSyBIMgcp2esJCFiY0w9lc-dSVRpRgkWVoX8
```   

### 3. Database Seeding
Run the seed script to populate the database with authors, books, and create the admin user.
```bash
cd Backend
node seed.js
```

### 4. Running the Application
Start the backend (from `Backend` dir):
```bash
npm run dev
```

Start the frontend (from `Frontend` dir):
```bash
npm run dev
```
Access the application at `http://localhost:5173`.

---

## 🔑 Test Credentials
If you have run the `seed.js` script, you can use the following credentials. **The password for all seeded accounts is `123456`.**

**Admin Access**
- Email: `admin@bookleaf.com`
- Password: `123456`

**Author Access**
- Email: `priya.sharma@email.com` (or any other seeded author email)
- Password: `123456`

---

## ✨ Core Features Implemented

### Author Portal
- **Dashboard**: Overview of published books, total copies sold, royalties earned, and pending amounts. Quick actions and recent tickets.
- **My Books**: Detailed view of all books (published and in production). Includes an **Add New Book** feature to submit new manuscripts.
- **Support Tickets**: Create tickets linked to specific books.
- **Profile Settings**: Manage personal details and Royalty Payout (Bank) information.

### Admin Portal
- **Dashboard**: Real-time statistics on the ticket queue and incoming ticket notifications.
- **All Books**: View all books across all authors.
- **Ticket Management**: Advanced filtering (status, category, priority), assignment capabilities, internal team notes, and AI-assisted response drafting.

---

## 🌟 Bonus Features Added

1. **🤖 Smart AI Ticket Deflection**: When an author types their issue into the ticket form, an "Ask AI" button appears. The AI checks the BookLeaf Knowledge Base and attempts to instantly resolve the author's query *before* they even submit the ticket, directly reducing the support team's backlog.
2. **📥 Export to CSV**: Admins can export both the "Ticket Queue" and the "All Books" catalog directly to an Excel-ready CSV file with a single click.
3. **👤 Author Profile & Bank Settings**: Authors can securely update their personal information and royalty bank account details.

---

## 🧠 AI Integration (Gemini)
When an author submits a ticket, the AI:
1. **Classifies** the ticket into one of the 6 predefined BookLeaf categories.
2. **Prioritizes** the ticket (Critical, High, Medium, Low) based on urgency.
3. **Drafts a Response** by consulting the embedded BookLeaf Knowledge Base, referencing exact company policies.

---

## 🔌 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Authenticate user and get JWT

### Books
- `POST /api/books` - Add a new book (Author)
- `GET /api/books/my-books` - Get books for logged-in author
- `GET /api/books/all-books` - Get all books (Admin)

### Tickets
- `POST /api/tickets/deflect` - AI attempts to resolve query instantly
- `POST /api/tickets` - Create a new ticket (triggers AI processing)
- `GET /api/tickets/my` - Get tickets for logged-in author
- `GET /api/tickets` - Get all tickets with filters (Admin)
- `GET /api/tickets/stats` - Get ticket statistics (Admin)
- `GET /api/tickets/:id` - Get single ticket by ID
- `PUT /api/tickets/:id/respond` - Update ticket and send response (Admin)
- `PUT /api/tickets/:id/assign` - Assign ticket to current admin (Admin)

### Users
- `GET /api/users/profile` - Get author profile & settings
- `PUT /api/users/profile` - Update author profile & settings
