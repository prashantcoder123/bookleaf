import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import API from "../../services/api";
import socket from "../../socket/socket";

const AdminDashboard = () => {

    const [stats, setStats] = useState(null);
    const [recentTickets, setRecentTickets] = useState([]);
    const [notification, setNotification] = useState("");

    useEffect(() => {
        fetchData();

        // Listen for new tickets in real-time
        socket.on("newTicket", (data) => {
            setNotification(`New ticket: ${data.ticket?.subject || "New support query received"}`);
            fetchData();
            setTimeout(() => setNotification(""), 5000);
        });

        return () => {
            socket.off("newTicket");
        };
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, ticketsRes] = await Promise.all([
                API.get("/tickets/stats"),
                API.get("/tickets?sort=oldest"),
            ]);
            setStats(statsRes.data.stats);
            setRecentTickets(ticketsRes.data.tickets.slice(0, 5));
        } catch (error) {
            console.log(error);
        }
    };

    const statCards = stats ? [
        { label: "Total Tickets", value: stats.total, icon: "🎫", color: "#3b82f6", bg: "#eff6ff" },
        { label: "Open", value: stats.open, icon: "📬", color: "#f59e0b", bg: "#fffbeb" },
        { label: "In Progress", value: stats.inProgress, icon: "⚙️", color: "#6366f1", bg: "#eef2ff" },
        { label: "Resolved", value: stats.resolved, icon: "✅", color: "#10b981", bg: "#ecfdf5" },
        { label: "Critical", value: stats.critical, icon: "🔴", color: "#dc2626", bg: "#fef2f2" },
        { label: "High Priority", value: stats.high, icon: "🟠", color: "#ea580c", bg: "#fff7ed" },
    ] : [];

    const getStatusStyle = (status) => {
        switch (status) {
            case "Open": return { bg: "#fef3c7", color: "#92400e" };
            case "In Progress": return { bg: "#dbeafe", color: "#1e40af" };
            case "Resolved": return { bg: "#d1fae5", color: "#065f46" };
            case "Closed": return { bg: "#e2e8f0", color: "#475569" };
            default: return { bg: "#f1f5f9", color: "#64748b" };
        }
    };

    const getPriorityStyle = (priority) => {
        switch (priority) {
            case "Critical": return { bg: "#fef2f2", color: "#dc2626" };
            case "High": return { bg: "#fff7ed", color: "#ea580c" };
            case "Medium": return { bg: "#fefce8", color: "#ca8a04" };
            case "Low": return { bg: "#f0fdf4", color: "#16a34a" };
            default: return { bg: "#f1f5f9", color: "#64748b" };
        }
    };

    return (
        <AdminLayout>
            <div style={{ padding: "32px", maxWidth: "1200px" }}>

                {/* Notification */}
                {notification && (
                    <div className="animate-slide-in" style={{
                        background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                        border: "1px solid #93c5fd",
                        color: "#1e40af",
                        padding: "14px 20px",
                        borderRadius: "12px",
                        fontSize: "14px",
                        marginBottom: "20px",
                        fontWeight: "500",
                    }}>
                        🔔 {notification}
                    </div>
                )}

                <div style={{ marginBottom: "32px" }}>
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "32px",
                        fontWeight: "700",
                        color: "#1a1a2e",
                        marginBottom: "8px",
                    }}>
                        Admin Dashboard
                    </h1>
                    <p style={{ fontSize: "14px", color: "#64748b" }}>
                        BookLeaf Author Support Operations
                    </p>
                </div>

                {/* Stats */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(6, 1fr)",
                    gap: "16px",
                    marginBottom: "32px",
                }}>
                    {statCards.map((card, i) => (
                        <div key={i} className="animate-fade-in" style={{
                            background: "#fff",
                            borderRadius: "14px",
                            padding: "20px",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                            border: "1px solid #f1f5f9",
                            textAlign: "center",
                            animationDelay: `${i * 0.05}s`,
                        }}>
                            <div style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "10px",
                                background: card.bg,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "18px",
                                margin: "0 auto 12px",
                            }}>
                                {card.icon}
                            </div>
                            <p style={{ fontSize: "28px", fontWeight: "700", color: card.color }}>
                                {card.value}
                            </p>
                            <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                {card.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Quick links + Recent tickets */}
                <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "24px" }}>

                    {/* Quick actions */}
                    <div>
                        <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a2e", marginBottom: "12px" }}>
                            Quick Actions
                        </h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            <Link to="/admin/tickets" style={{
                                background: "linear-gradient(135deg, #e94560, #d63851)",
                                borderRadius: "12px",
                                padding: "20px",
                                textDecoration: "none",
                                color: "#fff",
                                display: "block",
                                transition: "transform 0.2s",
                                boxShadow: "0 4px 16px rgba(233,69,96,0.3)",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                            >
                                <span style={{ fontSize: "24px", display: "block", marginBottom: "8px" }}>🎫</span>
                                <strong style={{ fontSize: "15px" }}>Ticket Queue</strong>
                                <p style={{ fontSize: "12px", opacity: 0.8, marginTop: "4px" }}>
                                    Manage all support tickets
                                </p>
                            </Link>
                            <Link to="/admin/tickets?status=Open" style={{
                                background: "#fff",
                                borderRadius: "12px",
                                padding: "20px",
                                textDecoration: "none",
                                color: "#1a1a2e",
                                display: "block",
                                border: "1px solid #f1f5f9",
                                transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                            >
                                <span style={{ fontSize: "24px", display: "block", marginBottom: "8px" }}>📬</span>
                                <strong style={{ fontSize: "15px" }}>Open Tickets</strong>
                                <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                                    {stats?.open || 0} awaiting response
                                </p>
                            </Link>
                        </div>
                    </div>

                    {/* Recent tickets */}
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                            <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a2e" }}>
                                Recent Tickets
                            </h2>
                            <Link to="/admin/tickets" style={{ fontSize: "13px", color: "#e94560", textDecoration: "none", fontWeight: "500" }}>
                                View All →
                            </Link>
                        </div>
                        <div style={{
                            background: "#fff",
                            borderRadius: "14px",
                            overflow: "hidden",
                            border: "1px solid #f1f5f9",
                        }}>
                            {recentTickets.length === 0 ? (
                                <div style={{ padding: "40px", textAlign: "center" }}>
                                    <p style={{ color: "#94a3b8" }}>No tickets yet</p>
                                </div>
                            ) : (
                                recentTickets.map((ticket, i) => {
                                    const sStyle = getStatusStyle(ticket.status);
                                    const pStyle = getPriorityStyle(ticket.priority);
                                    return (
                                        <Link to={`/admin/tickets/${ticket._id}`} key={ticket._id} style={{
                                            padding: "16px 20px",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            borderBottom: i < recentTickets.length - 1 ? "1px solid #f1f5f9" : "none",
                                            textDecoration: "none",
                                            color: "inherit",
                                            transition: "background 0.15s",
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = "#fafbfc"}
                                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                        >
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: "14px", fontWeight: "500", color: "#1a1a2e", marginBottom: "4px" }}>
                                                    {ticket.subject}
                                                </p>
                                                <p style={{ fontSize: "12px", color: "#94a3b8" }}>
                                                    {ticket.author?.name} · {new Date(ticket.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div style={{ display: "flex", gap: "6px" }}>
                                                <span style={{
                                                    padding: "3px 8px",
                                                    borderRadius: "6px",
                                                    fontSize: "11px",
                                                    fontWeight: "600",
                                                    background: pStyle.bg,
                                                    color: pStyle.color,
                                                }}>
                                                    {ticket.priority}
                                                </span>
                                                <span style={{
                                                    padding: "3px 8px",
                                                    borderRadius: "6px",
                                                    fontSize: "11px",
                                                    fontWeight: "600",
                                                    background: sStyle.bg,
                                                    color: sStyle.color,
                                                }}>
                                                    {ticket.status}
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;