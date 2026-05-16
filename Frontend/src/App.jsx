import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTickets from "./pages/admin/AdminTickets";
import AdminTicketDetail from "./pages/admin/AdminTicketDetail";
import AdminBooks from "./pages/admin/AdminBooks";

import AuthorDashboard from "./pages/author/AuthorDashboard";
import MyBooks from "./pages/author/MyBooks";
import AddBook from "./pages/author/AddBook";
import CreateTicket from "./pages/author/CreateTicket";
import MyTickets from "./pages/author/MyTickets";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import AuthorRoute from "./routes/AuthorRoute";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tickets"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminTickets />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tickets/:id"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminTicketDetail />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/books"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminBooks />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        {/* Author routes */}
        <Route
          path="/author"
          element={
            <ProtectedRoute>
              <AuthorRoute>
                <AuthorDashboard />
              </AuthorRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/author/my-books"
          element={
            <ProtectedRoute>
              <AuthorRoute>
                <MyBooks />
              </AuthorRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/author/add-book"
          element={
            <ProtectedRoute>
              <AuthorRoute>
                <AddBook />
              </AuthorRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/author/create-ticket"
          element={
            <ProtectedRoute>
              <AuthorRoute>
                <CreateTicket />
              </AuthorRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/author/my-tickets"
          element={
            <ProtectedRoute>
              <AuthorRoute>
                <MyTickets />
              </AuthorRoute>
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;