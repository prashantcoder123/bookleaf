import { useEffect, useState, useContext } from "react";
import API from "../../services/api";
import AuthorLayout from "../../components/AuthorLayout";
import socket from "../../socket/socket";
import { AuthContext } from "../../context/AuthContext";

const MyTickets = () => {

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedTicket, setExpandedTicket] = useState(null);
    const [notification, setNotification] = useState("");

    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchTickets();

        // Join user's room for real-time updates
        if (user?._id) {
            socket.emit("join", user._id);
        }

        // Listen for ticket updates from admin
        socket.on("ticketUpdated", (data) => {
            setNotification(data.message);
            fetchTickets(); // Refresh tickets

            // Clear notification after 5 seconds
            setTimeout(() => setNotification(""), 5000);
        });

        return () => {
            socket.off("ticketUpdated");
        };
    }, [user]);

    const fetchTickets = async () => {
        try {
            const { data } = await API.get("/tickets/my");
            setTickets(data.tickets);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

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
            case "Critical": return { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" };
            case "High": return { bg: "#fff7ed", color: "#ea580c", border: "#fed7aa" };
            case "Medium": return { bg: "#fefce8", color: "#ca8a04", border: "#fef08a" };
            case "Low": return { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" };
            default: return { bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0" };
        }
    };

    if (loading) {
        return (
            <AuthorLayout>
                <div style={{ padding: "32px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
                    <p style={{ color: "#64748b" }}>Loading tickets...</p>
                </div>
            </AuthorLayout>
        );
    }

    return (
        <AuthorLayout>
            <div style={{ padding: "32px", maxWidth: "1000px" }}>

                {/* Real-time notification */}
                {notification && (
                    <div className="animate-slide-in" style={{
                        background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
                        border: "1px solid #6ee7b7",
                        color: "#065f46",
                        padding: "14px 20px",
                        borderRadius: "12px",
                        fontSize: "14px",
                        marginBottom: "20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
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
                        My Tickets
                    </h1>
                    <p style={{ fontSize: "14px", color: "#64748b" }}>
                        {tickets.length} ticket{tickets.length !== 1 ? "s" : ""} · Updates appear in real-time
                    </p>
                </div>

                {tickets.length === 0 ? (
                    <div style={{
                        background: "#fff",
                        borderRadius: "14px",
                        padding: "60px",
                        textAlign: "center",
                        border: "1px solid #f1f5f9",
                    }}>
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎫</div>
                        <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1a2e", marginBottom: "8px" }}>
                            No Tickets Yet
                        </h3>
                        <p style={{ fontSize: "14px", color: "#64748b" }}>
                            Submit a support ticket and it will appear here
                        </p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {tickets.map((ticket, i) => {
                            const statusStyle = getStatusStyle(ticket.status);
                            const priorityStyle = getPriorityStyle(ticket.priority);
                            const isExpanded = expandedTicket === ticket._id;

                            return (
                                <div key={ticket._id} className="animate-fade-in" style={{
                                    background: "#fff",
                                    borderRadius: "14px",
                                    overflow: "hidden",
                                    border: ticket.priority === "Critical" ? "1px solid #fecaca" : "1px solid #f1f5f9",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                                    animationDelay: `${i * 0.05}s`,
                                    transition: "box-shadow 0.2s",
                                }}>
                                    {/* Header */}
                                    <div
                                        onClick={() => setExpandedTicket(isExpanded ? null : ticket._id)}
                                        style={{
                                            padding: "20px 24px",
                                            cursor: "pointer",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                                                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a2e" }}>
                                                    {ticket.subject}
                                                </h3>
                                            </div>
                                            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                                                <span style={{
                                                    padding: "3px 10px",
                                                    borderRadius: "6px",
                                                    fontSize: "11px",
                                                    fontWeight: "600",
                                                    background: statusStyle.bg,
                                                    color: statusStyle.color,
                                                }}>
                                                    {ticket.status}
                                                </span>
                                                <span style={{
                                                    padding: "3px 10px",
                                                    borderRadius: "6px",
                                                    fontSize: "11px",
                                                    fontWeight: "600",
                                                    background: priorityStyle.bg,
                                                    color: priorityStyle.color,
                                                }}>
                                                    {ticket.priority}
                                                </span>
                                                <span style={{
                                                    padding: "3px 10px",
                                                    borderRadius: "6px",
                                                    fontSize: "11px",
                                                    background: "#f1f5f9",
                                                    color: "#64748b",
                                                }}>
                                                    {ticket.category}
                                                </span>
                                                <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                                                    · {new Date(ticket.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                </span>
                                            </div>
                                        </div>
                                        <span style={{
                                            fontSize: "18px",
                                            color: "#94a3b8",
                                            transform: isExpanded ? "rotate(180deg)" : "rotate(0)",
                                            transition: "transform 0.2s",
                                        }}>
                                            ▼
                                        </span>
                                    </div>

                                    {/* Expanded content */}
                                    {isExpanded && (
                                        <div style={{ borderTop: "1px solid #f1f5f9" }}>
                                            {/* Description */}
                                            <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9" }}>
                                                <p style={{ fontSize: "12px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                                                    Your Query
                                                </p>
                                                <p style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6" }}>
                                                    {ticket.description}
                                                </p>
                                                {ticket.book && (
                                                    <p style={{ fontSize: "13px", color: "#64748b", marginTop: "12px" }}>
                                                        📖 Related book: <strong>{ticket.book.title}</strong> ({ticket.book.isbn})
                                                    </p>
                                                )}
                                            </div>

                                            {/* Admin Response */}
                                            {ticket.adminResponse ? (
                                                <div style={{
                                                    padding: "20px 24px",
                                                    background: "#eff6ff",
                                                    borderBottom: "1px solid #f1f5f9",
                                                }}>
                                                    <p style={{ fontSize: "12px", fontWeight: "600", color: "#1e40af", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                                                        ✉️ Admin Response
                                                    </p>
                                                    <p style={{ fontSize: "14px", color: "#1e3a5f", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                                                        {ticket.adminResponse}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div style={{
                                                    padding: "16px 24px",
                                                    background: "#fafbfc",
                                                }}>
                                                    <p style={{ fontSize: "13px", color: "#94a3b8", fontStyle: "italic" }}>
                                                        ⏳ Awaiting admin response...
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
        </AuthorLayout>
    );
};

export default MyTickets;