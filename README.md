# BookLeaf Publishing - Author Support Portal

A comprehensive web application for authors to manage their published books, track royalties, and submit support tickets, coupled with an AI-assisted admin dashboard for the operations team.

## Architecture

The project follows a standard MERN stack architecture with real-time socket communication and Google Gemini AI integration.

- **Frontend**: React (Vite), React Router, Context API for state management.
- **Backend**: Node.js, Express, MongoDB with Mongoose.
- **Real-time**: Socket.io for instant ticket updates and notifications.
- **AI Integration**: Google Gemini 2.0 Flash for ticket classification, prioritization, and drafting responses.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB instance)
- Google Gemini API Key

### Installation

1. **Clone the repository** (if applicable) and install dependencies.

   ```bash
   # Install backend dependencies
   cd Backend
   npm install

   # Install frontend dependencies
   cd ../Frontend
   npm install
   ```

2. **Environment Variables**

   Create a `.env` file in the `Backend` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

   *(Note: For this evaluation environment, the `.env` might already be present in the `Backend` directory.)*

3. **Database Seeding**

   Run the seed script to populate the database with authors, books, and create the admin user.

   ```bash
   cd Backend
   node seed.js
   ```

4. **Running the Application**

   Start the backend (from `Backend` dir):
   ```bash
   npm run dev
   ```

   Start the frontend (from `Frontend` dir):
   ```bash
   npm run dev
   ```

   Access the application at `http://localhost:5173`.

## Test Credentials

**Admin Access**
- Email: `admin@bookleaf.com`
- Password: `admin123`

**Author Access**
- Email: `priya.sharma@email.com` (or any other seeded author email)
- Password: `123456`

## Features Implemented

### Author Portal
- **Dashboard**: Overview of published books, total copies sold, royalties earned, and pending amounts. Quick actions and recent tickets.
- **My Books**: Detailed view of all books (published and in production), including platform distribution, print partners, and comprehensive royalty breakdown per copy and total.
- **Support Tickets**: Create tickets linked to specific books. Real-time updates via WebSockets when an admin responds.

### Admin Portal
- **Dashboard**: Real-time statistics on ticket queue, quick links to open tickets, and incoming ticket notifications.
- **All Books**: View all books across all authors, complete with search and summary statistics.
- **Ticket Queue**: Comprehensive list of all tickets with advanced filtering by status, category, priority, and sorting.
- **Ticket Management**: AI-assisted response drafting, status updates, priority/category overrides, assignment, and internal team notes.

### AI Integration (Gemini)
When an author submits a ticket, the AI:
1. **Classifies** the ticket into one of the 6 predefined BookLeaf categories.
2. **Prioritizes** the ticket (Critical, High, Medium, Low) based on urgency (e.g., ISBN errors or missing royalties are Critical).
3. **Drafts a Response** by consulting the embedded BookLeaf Knowledge Base, referencing exact company policies and next steps.

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user (Author or Admin)
- `POST /api/auth/login` - Authenticate user and get JWT

### Books
- `GET /api/books/my-books` - Get books for logged-in author
- `GET /api/books/all-books` - Get all books (Admin only)

### Tickets
- `POST /api/tickets` - Create a new ticket (triggers AI processing)
- `GET /api/tickets/my` - Get tickets for logged-in author
- `GET /api/tickets` - Get all tickets with filters (Admin only)
- `GET /api/tickets/stats` - Get ticket statistics (Admin only)
- `GET /api/tickets/:id` - Get single ticket by ID
- `PUT /api/tickets/:id/respond` - Update ticket details and send response (Admin only)
- `PUT /api/tickets/:id/assign` - Assign ticket to current admin (Admin only)

## Known Limitations & Future Improvements
- **File Uploads**: The file upload UI in the ticket creation form is a placeholder. Actual file storage (e.g., AWS S3) needs to be implemented.
- **Pagination**: The ticket and book lists do not have pagination. This should be added for production scale.
- **Email Notifications**: Currently, notifications are in-app (real-time via Sockets). Integrating an email service (like SendGrid or AWS SES) would be necessary for offline notifications.
