import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthorLayout from "../../components/AuthorLayout";
import { AuthContext } from "../../context/AuthContext";
import API from "../../services/api";

const AuthorDashboard = () => {

    const { user } = useContext(AuthContext);
    const [books, setBooks] = useState([]);
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [booksRes, ticketsRes] = await Promise.all([
                API.get("/books/my-books"),
                API.get("/tickets/my"),
            ]);
            setBooks(booksRes.data);
            setTickets(ticketsRes.data.tickets);
        } catch (error) {
            console.log(error);
        }
    };

    const totalRoyalty = books.reduce((sum, b) => sum + (b.total_royalty_earned || 0), 0);
    const totalPending = books.reduce((sum, b) => sum + (b.royalty_pending || 0), 0);
    const totalSold = books.reduce((sum, b) => sum + (b.total_copies_sold || 0), 0);
    const openTickets = tickets.filter(t => t.status === "Open" || t.status === "In Progress").length;

    const statCards = [
        { label: "Published Books", value: books.filter(b => b.status?.includes("Published")).length, icon: "📚", color: "#3b82f6", bg: "#eff6ff" },
        { label: "Total Copies Sold", value: totalSold.toLocaleString(), icon: "📈", color: "#10b981", bg: "#ecfdf5" },
        { label: "Total Royalty", value: `₹${totalRoyalty.toLocaleString()}`, icon: "💰", color: "#c9a84c", bg: "#fefce8" },
        { label: "Pending Royalty", value: `₹${totalPending.toLocaleString()}`, icon: "⏳", color: "#f59e0b", bg: "#fffbeb" },
    ];

    const quickActions = [
        { path: "/author/my-books", label: "My Books", desc: "View your published books and royalty details", icon: "📚", color: "#3b82f6" },
        { path: "/author/create-ticket", label: "Create Ticket", desc: "Raise a support query for any issue", icon: "🎫", color: "#e94560" },
        { path: "/author/my-tickets", label: "My Tickets", desc: "Track your support tickets and responses", icon: "📋", color: "#10b981" },
    ];

    return (
        <AuthorLayout>
            <div style={{ padding: "32px", maxWidth: "1200px" }}>

                {/* Header */}
                <div style={{ marginBottom: "32px" }}>
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "32px",
                        fontWeight: "700",
                        color: "#1a1a2e",
                        marginBottom: "8px",
                    }}>
                        Welcome, {user?.name} 👋
                    </h1>
                    <p style={{ fontSize: "14px", color: "#64748b" }}>
                        Here's an overview of your publishing journey with BookLeaf
                    </p>
                </div>

                {/* Stats */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "20px",
                    marginBottom: "32px",
                }}>
                    {statCards.map((card, i) => (
                        <div key={i} className="animate-fade-in" style={{
                            background: "#fff",
                            borderRadius: "14px",
                            padding: "24px",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                            border: "1px solid #f1f5f9",
                            animationDelay: `${i * 0.1}s`,
                        }}>
                            <div style={{
                                width: "44px",
                                height: "44px",
                                borderRadius: "12px",
                                background: card.bg,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "22px",
                                marginBottom: "16px",
                            }}>
                                {card.icon}
                            </div>
                            <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "6px" }}>
                                {card.label}
                            </p>
                            <p style={{
                                fontSize: "28px",
                                fontWeight: "700",
                                color: card.color,
                            }}>
                                {card.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <h2 style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#1a1a2e",
                    marginBottom: "16px",
                }}>
                    Quick Actions
                </h2>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "20px",
                    marginBottom: "32px",
                }}>
                    {quickActions.map((action, i) => (
                        <Link key={i} to={action.path} style={{
                            background: "#fff",
                            borderRadius: "14px",
                            padding: "28px",
                            textDecoration: "none",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                            border: "1px solid #f1f5f9",
                            transition: "all 0.25s ease",
                            display: "block",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-4px)";
                            e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.1)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)";
                        }}
                        >
                            <span style={{ fontSize: "32px", display: "block", marginBottom: "16px" }}>
                                {action.icon}
                            </span>
                            <h3 style={{
                                fontSize: "18px",
                                fontWeight: "600",
                                color: "#1a1a2e",
                                marginBottom: "8px",
                            }}>
                                {action.label}
                            </h3>
                            <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.5" }}>
                                {action.desc}
                            </p>
                            <div style={{
                                marginTop: "16px",
                                fontSize: "13px",
                                color: action.color,
                                fontWeight: "600",
                            }}>
                                Go →
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Recent Tickets */}
                {tickets.length > 0 && (
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1a2e" }}>
                                Recent Tickets
                            </h2>
                            {openTickets > 0 && (
                                <span style={{
                                    background: "#fef2f2",
                                    color: "#e94560",
                                    padding: "4px 12px",
                                    borderRadius: "20px",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                }}>
                                    {openTickets} Active
                                </span>
                            )}
                        </div>
                        <div style={{
                            background: "#fff",
                            borderRadius: "14px",
                            overflow: "hidden",
                            border: "1px solid #f1f5f9",
                        }}>
                            {tickets.slice(0, 3).map((ticket, i) => (
                                <div key={ticket._id} style={{
                                    padding: "16px 24px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    borderBottom: i < 2 ? "1px solid #f1f5f9" : "none",
                                }}>
                                    <div>
                                        <p style={{ fontSize: "14px", fontWeight: "500", color: "#1a1a2e" }}>
                                            {ticket.subject}
                                        </p>
                                        <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                                            {ticket.category} · {new Date(ticket.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span style={{
                                        padding: "4px 12px",
                                        borderRadius: "20px",
                                        fontSize: "12px",
                                        fontWeight: "500",
                                        background: ticket.status === "Open" ? "#fef3c7" : ticket.status === "Resolved" ? "#d1fae5" : ticket.status === "Closed" ? "#e2e8f0" : "#dbeafe",
                                        color: ticket.status === "Open" ? "#92400e" : ticket.status === "Resolved" ? "#065f46" : ticket.status === "Closed" ? "#475569" : "#1e40af",
                                    }}>
                                        {ticket.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </AuthorLayout>
    );
};

export default AuthorDashboard;