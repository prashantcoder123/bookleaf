import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import AdminLayout from "../../components/AdminLayout";
import { AuthContext } from "../../context/AuthContext";

const AdminTicketDetail = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    // Editable fields
    const [response, setResponse] = useState("");
    const [status, setStatus] = useState("");
    const [category, setCategory] = useState("");
    const [priority, setPriority] = useState("");
    const [internalNotes, setInternalNotes] = useState("");

    useEffect(() => {
        fetchTicket();
    }, [id]);

    const fetchTicket = async () => {
        try {
            const { data } = await API.get(`/tickets/${id}`);
            setTicket(data.ticket);
            setResponse(data.ticket.aiDraft || "");
            setStatus(data.ticket.status);
            setCategory(data.ticket.category);
            setPriority(data.ticket.priority);
            setInternalNotes(data.ticket.internalNotes || "");
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendResponse = async () => {
        if (!response.trim()) return;

        try {
            setSaving(true);
            await API.put(`/tickets/${id}/respond`, {
                adminResponse: response,
                status,
                category,
                priority,
                internalNotes,
            });
            setSuccessMsg("Response sent successfully!");
            fetchTicket();
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (error) {
            console.log(error);
            alert("Failed to send response");
        } finally {
            setSaving(false);
        }
    };

    const handleAssignToMe = async () => {
        try {
            await API.put(`/tickets/${id}/assign`);
            fetchTicket();
            setSuccessMsg("Ticket assigned to you!");
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateFields = async () => {
        try {
            setSaving(true);
            await API.put(`/tickets/${id}/respond`, {
                status,
                category,
                priority,
                internalNotes,
            });
            setSuccessMsg("Ticket updated!");
            fetchTicket();
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (error) {
            console.log(error);
        } finally {
            setSaving(false);
        }
    };

    const categories = [
        "Royalty & Payments",
        "ISBN & Metadata Issues",
        "Printing & Quality",
        "Distribution & Availability",
        "Book Status & Production Updates",
        "General Inquiry",
    ];

    const getStatusStyle = (s) => {
        switch (s) {
            case "Open": return { bg: "#fef3c7", color: "#92400e" };
            case "In Progress": return { bg: "#dbeafe", color: "#1e40af" };
            case "Resolved": return { bg: "#d1fae5", color: "#065f46" };
            case "Closed": return { bg: "#e2e8f0", color: "#475569" };
            default: return { bg: "#f1f5f9", color: "#64748b" };
        }
    };

    const getPriorityStyle = (p) => {
        switch (p) {
            case "Critical": return { bg: "#fef2f2", color: "#dc2626" };
            case "High": return { bg: "#fff7ed", color: "#ea580c" };
            case "Medium": return { bg: "#fefce8", color: "#ca8a04" };
            case "Low": return { bg: "#f0fdf4", color: "#16a34a" };
            default: return { bg: "#f1f5f9", color: "#64748b" };
        }
    };

    const selectStyle = {
        width: "100%",
        padding: "10px 14px",
        border: "1.5px solid #e2e8f0",
        borderRadius: "8px",
        fontSize: "13px",
        outline: "none",
        fontFamily: "inherit",
        background: "#f8fafc",
        cursor: "pointer",
        boxSizing: "border-box",
    };

    if (loading) {
        return (
            <AdminLayout>
                <div style={{ padding: "32px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
                    <p style={{ color: "#64748b" }}>Loading ticket...</p>
                </div>
            </AdminLayout>
        );
    }

    if (!ticket) {
        return (
            <AdminLayout>
                <div style={{ padding: "32px", textAlign: "center" }}>
                    <p style={{ color: "#64748b" }}>Ticket not found</p>
                </div>
            </AdminLayout>
        );
    }

    const sStyle = getStatusStyle(ticket.status);
    const pStyle = getPriorityStyle(ticket.priority);

    return (
        <AdminLayout>
            <div style={{ padding: "32px", maxWidth: "1100px" }}>

                {/* Success notification */}
                {successMsg && (
                    <div className="animate-slide-in" style={{
                        background: "#ecfdf5",
                        border: "1px solid #6ee7b7",
                        color: "#065f46",
                        padding: "12px 20px",
                        borderRadius: "10px",
                        fontSize: "14px",
                        marginBottom: "20px",
                        fontWeight: "500",
                    }}>
                        ✅ {successMsg}
                    </div>
                )}

                {/* Back + header */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                    <button
                        onClick={() => navigate("/admin/tickets")}
                        style={{
                            background: "#f1f5f9",
                            border: "none",
                            borderRadius: "8px",
                            padding: "8px 14px",
                            fontSize: "13px",
                            cursor: "pointer",
                            fontFamily: "inherit",
                            color: "#64748b",
                        }}
                    >
                        ← Back
                    </button>
                    <div style={{ flex: 1 }}>
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "24px",
                            fontWeight: "700",
                            color: "#1a1a2e",
                        }}>
                            {ticket.subject}
                        </h1>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <span style={{ padding: "5px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", background: pStyle.bg, color: pStyle.color }}>
                            {ticket.priority}
                        </span>
                        <span style={{ padding: "5px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", background: sStyle.bg, color: sStyle.color }}>
                            {ticket.status}
                        </span>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px" }}>

                    {/* Main content */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                        {/* Author query */}
                        <div style={{
                            background: "#fff",
                            borderRadius: "14px",
                            padding: "24px",
                            border: "1px solid #f1f5f9",
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                                <div>
                                    <p style={{ fontSize: "12px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                                        Author Query
                                    </p>
                                    <p style={{ fontSize: "14px", fontWeight: "500", color: "#1a1a2e" }}>
                                        {ticket.author?.name} ({ticket.author?.email})
                                    </p>
                                </div>
                                <p style={{ fontSize: "12px", color: "#94a3b8" }}>
                                    {new Date(ticket.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <p style={{ fontSize: "14px", color: "#374151", lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
                                {ticket.description}
                            </p>
                            {ticket.book && (
                                <div style={{
                                    marginTop: "16px",
                                    padding: "12px 16px",
                                    background: "#f8fafc",
                                    borderRadius: "8px",
                                    fontSize: "13px",
                                    color: "#475569",
                                }}>
                                    📖 Related Book: <strong>{ticket.book.title}</strong> (ISBN: {ticket.book.isbn})
                                </div>
                            )}
                        </div>

                        {/* Previous admin response */}
                        {ticket.adminResponse && (
                            <div style={{
                                background: "#eff6ff",
                                borderRadius: "14px",
                                padding: "24px",
                                border: "1px solid #bfdbfe",
                            }}>
                                <p style={{ fontSize: "12px", fontWeight: "600", color: "#1e40af", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
                                    ✉️ Sent Response
                                </p>
                                <p style={{ fontSize: "14px", color: "#1e3a5f", lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
                                    {ticket.adminResponse}
                                </p>
                            </div>
                        )}

                        {/* AI Draft + Edit Response */}
                        <div style={{
                            background: "#fff",
                            borderRadius: "14px",
                            padding: "24px",
                            border: "1px solid #f1f5f9",
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                <div>
                                    <p style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a2e" }}>
                                        {ticket.adminResponse ? "Send Updated Response" : "Compose Response"}
                                    </p>
                                    <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                                        AI draft pre-filled below — edit before sending
                                    </p>
                                </div>
                                <span style={{
                                    padding: "4px 10px",
                                    borderRadius: "6px",
                                    fontSize: "11px",
                                    fontWeight: "600",
                                    background: "linear-gradient(135deg, #eff6ff, #faf5ff)",
                                    color: "#6366f1",
                                }}>
                                    🤖 AI-assisted
                                </span>
                            </div>

                            <textarea
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                                style={{
                                    width: "100%",
                                    minHeight: "200px",
                                    padding: "16px",
                                    border: "1.5px solid #e2e8f0",
                                    borderRadius: "10px",
                                    fontSize: "14px",
                                    outline: "none",
                                    fontFamily: "inherit",
                                    background: "#fafbfc",
                                    resize: "vertical",
                                    lineHeight: "1.7",
                                    boxSizing: "border-box",
                                    transition: "border-color 0.2s",
                                }}
                                onFocus={(e) => { e.target.style.borderColor = "#6366f1"; e.target.style.background = "#fff"; }}
                                onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#fafbfc"; }}
                                placeholder="Edit the AI draft or write your own response..."
                            />

                            <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                                <button
                                    onClick={handleSendResponse}
                                    disabled={saving || !response.trim()}
                                    style={{
                                        flex: 1,
                                        padding: "12px",
                                        background: saving ? "#94a3b8" : "linear-gradient(135deg, #e94560, #d63851)",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "10px",
                                        fontSize: "14px",
                                        fontWeight: "600",
                                        cursor: saving ? "not-allowed" : "pointer",
                                        fontFamily: "inherit",
                                        boxShadow: saving ? "none" : "0 4px 16px rgba(233,69,96,0.25)",
                                    }}
                                >
                                    {saving ? "Sending..." : "Send Response to Author"}
                                </button>
                                <button
                                    onClick={() => setResponse(ticket.aiDraft || "")}
                                    style={{
                                        padding: "12px 20px",
                                        background: "#f1f5f9",
                                        color: "#64748b",
                                        border: "none",
                                        borderRadius: "10px",
                                        fontSize: "13px",
                                        cursor: "pointer",
                                        fontFamily: "inherit",
                                    }}
                                >
                                    Reset to AI Draft
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar — ticket management */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                        {/* Assignment */}
                        <div style={{
                            background: "#fff",
                            borderRadius: "14px",
                            padding: "20px",
                            border: "1px solid #f1f5f9",
                        }}>
                            <p style={{ fontSize: "12px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
                                Assignment
                            </p>
                            {ticket.assignedTo ? (
                                <p style={{ fontSize: "14px", color: "#1a1a2e" }}>
                                    Assigned to: <strong>{ticket.assignedTo.name}</strong>
                                </p>
                            ) : (
                                <button
                                    onClick={handleAssignToMe}
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        background: "#1a1a2e",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "8px",
                                        fontSize: "13px",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                        fontFamily: "inherit",
                                    }}
                                >
                                    Assign to Me
                                </button>
                            )}
                        </div>

                        {/* Status */}
                        <div style={{
                            background: "#fff",
                            borderRadius: "14px",
                            padding: "20px",
                            border: "1px solid #f1f5f9",
                        }}>
                            <p style={{ fontSize: "12px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>
                                Status
                            </p>
                            <select value={status} onChange={(e) => setStatus(e.target.value)} style={selectStyle}>
                                <option value="Open">Open</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>

                        {/* Category (override) */}
                        <div style={{
                            background: "#fff",
                            borderRadius: "14px",
                            padding: "20px",
                            border: "1px solid #f1f5f9",
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                <p style={{ fontSize: "12px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                    Category
                                </p>
                                <span style={{ fontSize: "10px", color: "#6366f1", background: "#eef2ff", padding: "2px 6px", borderRadius: "4px" }}>
                                    AI classified
                                </span>
                            </div>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} style={selectStyle}>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Priority (override) */}
                        <div style={{
                            background: "#fff",
                            borderRadius: "14px",
                            padding: "20px",
                            border: "1px solid #f1f5f9",
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                <p style={{ fontSize: "12px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                    Priority
                                </p>
                                <span style={{ fontSize: "10px", color: "#6366f1", background: "#eef2ff", padding: "2px 6px", borderRadius: "4px" }}>
                                    AI scored
                                </span>
                            </div>
                            <select value={priority} onChange={(e) => setPriority(e.target.value)} style={selectStyle}>
                                <option value="Critical">Critical</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>

                        {/* Internal notes */}
                        <div style={{
                            background: "#fff",
                            borderRadius: "14px",
                            padding: "20px",
                            border: "1px solid #f1f5f9",
                        }}>
                            <p style={{ fontSize: "12px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>
                                Internal Notes
                            </p>
                            <p style={{ fontSize: "11px", color: "#f59e0b", marginBottom: "8px" }}>
                                ⚠️ Not visible to author
                            </p>
                            <textarea
                                value={internalNotes}
                                onChange={(e) => setInternalNotes(e.target.value)}
                                placeholder="Add internal notes for the team..."
                                style={{
                                    ...selectStyle,
                                    minHeight: "100px",
                                    resize: "vertical",
                                    lineHeight: "1.5",
                                }}
                            />
                        </div>

                        {/* Save changes */}
                        <button
                            onClick={handleUpdateFields}
                            disabled={saving}
                            style={{
                                width: "100%",
                                padding: "12px",
                                background: "#1a1a2e",
                                color: "#fff",
                                border: "none",
                                borderRadius: "10px",
                                fontSize: "13px",
                                fontWeight: "600",
                                cursor: "pointer",
                                fontFamily: "inherit",
                            }}
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>

                    </div>
                </div>

            </div>
        </AdminLayout>
    );
};

export default AdminTicketDetail;
