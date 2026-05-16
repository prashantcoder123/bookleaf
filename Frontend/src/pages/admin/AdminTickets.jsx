import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import AdminLayout from "../../components/AdminLayout";
import socket from "../../socket/socket";

const AdminTickets = () => {

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: "",
        category: "",
        priority: "",
        sort: "",
    });

    useEffect(() => {
        fetchTickets();
    }, [filters]);

    useEffect(() => {
        socket.on("newTicket", () => fetchTickets());
        return () => socket.off("newTicket");
    }, []);

    const fetchTickets = async () => {
        try {
            const query = new URLSearchParams();
            if (filters.status) query.append("status", filters.status);
            if (filters.category) query.append("category", filters.category);
            if (filters.priority) query.append("priority", filters.priority);
            if (filters.sort) query.append("sort", filters.sort);

            const { data } = await API.get(`/tickets?${query.toString()}`);
            setTickets(data.tickets);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = () => {
        if (tickets.length === 0) return;
        
        // Define headers
        const headers = ["Ticket ID", "Subject", "Author", "Email", "Category", "Priority", "Status", "Date Created"];
        
        // Map data to rows
        const rows = tickets.map(t => [
            t._id,
            `"${t.subject.replace(/"/g, '""')}"`, // escape quotes
            `"${t.author?.name || 'Unknown'}"`,
            t.author?.email || 'Unknown',
            t.category,
            t.priority,
            t.status,
            new Date(t.createdAt).toLocaleDateString()
        ]);
        
        // Combine headers and rows
        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.join(","))
        ].join("\n");
        
        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `bookleaf_tickets_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const categories = [
        "Royalty & Payments",
        "ISBN & Metadata Issues",
        "Printing & Quality",
        "Distribution & Availability",
        "Book Status & Production Updates",
        "General Inquiry",
    ];

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

    const selectStyle = {
        padding: "8px 12px",
        border: "1.5px solid #e2e8f0",
        borderRadius: "8px",
        fontSize: "13px",
        outline: "none",
        fontFamily: "inherit",
        background: "#fff",
        cursor: "pointer",
        color: "#374151",
    };

    return (
        <AdminLayout>
            <div style={{ padding: "32px", maxWidth: "1200px" }}>

                <div style={{ marginBottom: "24px" }}>
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "32px",
                        fontWeight: "700",
                        color: "#1a1a2e",
                        marginBottom: "8px",
                    }}>
                        Ticket Queue
                    </h1>
                    <p style={{ fontSize: "14px", color: "#64748b" }}>
                        {tickets.length} ticket{tickets.length !== 1 ? "s" : ""} found
                    </p>
                </div>

                {/* Filters */}
                <div style={{
                    background: "#fff",
                    borderRadius: "12px",
                    padding: "16px 20px",
                    marginBottom: "24px",
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                    flexWrap: "wrap",
                    border: "1px solid #f1f5f9",
                }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>Filters:</span>

                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        style={selectStyle}
                    >
                        <option value="">All Status</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                    </select>

                    <select
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        style={selectStyle}
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <select
                        value={filters.priority}
                        onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                        style={selectStyle}
                    >
                        <option value="">All Priorities</option>
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>

                    <select
                        value={filters.sort}
                        onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                        style={selectStyle}
                    >
                        <option value="">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>

                    {(filters.status || filters.category || filters.priority || filters.sort) && (
                        <button
                            onClick={() => setFilters({ status: "", category: "", priority: "", sort: "" })}
                            style={{
                                padding: "8px 14px",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "12px",
                                color: "#e94560",
                                background: "#fef2f2",
                                cursor: "pointer",
                                fontWeight: "600",
                                fontFamily: "inherit",
                            }}
                        >
                            Clear Filters
                        </button>
                    )}

                    <div style={{ flex: 1 }}></div>

                    <button
                        onClick={exportToCSV}
                        style={{
                            padding: "8px 16px",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            fontSize: "13px",
                            color: "#1a1a2e",
                            background: "#fff",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontFamily: "inherit",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                        }}
                    >
                        <span>📥</span> Export CSV
                    </button>
                </div>

                {/* Ticket list */}
                {loading ? (
                    <div style={{ padding: "60px", textAlign: "center" }}>
                        <p style={{ color: "#64748b" }}>Loading tickets...</p>
                    </div>
                ) : tickets.length === 0 ? (
                    <div style={{
                        background: "#fff",
                        borderRadius: "14px",
                        padding: "60px",
                        textAlign: "center",
                        border: "1px solid #f1f5f9",
                    }}>
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎫</div>
                        <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1a2e" }}>
                            No tickets match your filters
                        </h3>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {tickets.map((ticket, i) => {
                            const sStyle = getStatusStyle(ticket.status);
                            const pStyle = getPriorityStyle(ticket.priority);
                            const daysSinceCreation = Math.floor((Date.now() - new Date(ticket.createdAt)) / (1000 * 60 * 60 * 24));

                            return (
                                <Link to={`/admin/tickets/${ticket._id}`} key={ticket._id} className="animate-fade-in" style={{
                                    background: "#fff",
                                    borderRadius: "12px",
                                    padding: "20px 24px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    border: ticket.priority === "Critical" ? "1px solid #fecaca" : "1px solid #f1f5f9",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                                    textDecoration: "none",
                                    color: "inherit",
                                    transition: "all 0.2s",
                                    animationDelay: `${i * 0.03}s`,
                                    borderLeft: ticket.priority === "Critical" ? "4px solid #dc2626" : ticket.priority === "High" ? "4px solid #ea580c" : "4px solid transparent",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
                                    e.currentTarget.style.transform = "translateY(-1px)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
                                    e.currentTarget.style.transform = "translateY(0)";
                                }}
                                >
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                                            <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#1a1a2e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {ticket.subject}
                                            </h3>
                                            {ticket.priority === "Critical" && (
                                                <span style={{ fontSize: "12px", animation: "pulse-glow 2s infinite" }}>🔴</span>
                                            )}
                                        </div>
                                        <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "#94a3b8" }}>
                                            <span>👤 {ticket.author?.name}</span>
                                            <span>📅 {new Date(ticket.createdAt).toLocaleDateString()}</span>
                                            {daysSinceCreation > 3 && ticket.status === "Open" && (
                                                <span style={{ color: "#dc2626", fontWeight: "600" }}>
                                                    ⚠️ {daysSinceCreation}d old
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
                                        <span style={{
                                            padding: "4px 10px",
                                            borderRadius: "6px",
                                            fontSize: "11px",
                                            fontWeight: "600",
                                            background: "#f1f5f9",
                                            color: "#64748b",
                                            maxWidth: "120px",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}>
                                            {ticket.category}
                                        </span>
                                        <span style={{
                                            padding: "4px 10px",
                                            borderRadius: "6px",
                                            fontSize: "11px",
                                            fontWeight: "600",
                                            background: pStyle.bg,
                                            color: pStyle.color,
                                        }}>
                                            {ticket.priority}
                                        </span>
                                        <span style={{
                                            padding: "4px 10px",
                                            borderRadius: "6px",
                                            fontSize: "11px",
                                            fontWeight: "600",
                                            background: sStyle.bg,
                                            color: sStyle.color,
                                        }}>
                                            {ticket.status}
                                        </span>
                                        <span style={{ fontSize: "16px", color: "#cbd5e1" }}>→</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

            </div>
        </AdminLayout>
    );
};

export default AdminTickets;