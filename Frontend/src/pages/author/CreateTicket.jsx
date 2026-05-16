import { useState, useEffect } from "react";
import API from "../../services/api";
import AuthorLayout from "../../components/AuthorLayout";
import { useNavigate } from "react-router-dom";

const CreateTicket = () => {

    const [form, setForm] = useState({
        book: "",
        subject: "",
        description: "",
    });

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [fileName, setFileName] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const { data } = await API.get("/books/my-books");
            setBooks(data);
        } catch (err) {
            console.log(err);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.subject.trim()) {
            setError("Subject is required");
            return;
        }
        if (!form.description.trim()) {
            setError("Description is required");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                subject: form.subject,
                description: form.description,
            };

            if (form.book) {
                payload.book = form.book;
            }

            await API.post("/tickets", payload);
            setSuccess(true);

            setTimeout(() => {
                navigate("/author/my-tickets");
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || "Failed to create ticket");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "12px 16px",
        border: "1.5px solid #e2e8f0",
        borderRadius: "10px",
        fontSize: "14px",
        outline: "none",
        fontFamily: "inherit",
        background: "#f8fafc",
        boxSizing: "border-box",
        transition: "border-color 0.2s",
    };

    return (
        <AuthorLayout>
            <div style={{ padding: "32px", maxWidth: "800px" }}>

                <div style={{ marginBottom: "32px" }}>
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "32px",
                        fontWeight: "700",
                        color: "#1a1a2e",
                        marginBottom: "8px",
                    }}>
                        Submit a Support Ticket
                    </h1>
                    <p style={{ fontSize: "14px", color: "#64748b" }}>
                        Our AI will classify and prioritize your query automatically
                    </p>
                </div>

                {success ? (
                    <div className="animate-fade-in" style={{
                        background: "#fff",
                        borderRadius: "14px",
                        padding: "60px",
                        textAlign: "center",
                        border: "1px solid #d1fae5",
                    }}>
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
                        <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#065f46", marginBottom: "8px" }}>
                            Ticket Created Successfully!
                        </h3>
                        <p style={{ fontSize: "14px", color: "#64748b" }}>
                            Your ticket has been classified by AI and sent to our support team. Redirecting...
                        </p>
                    </div>
                ) : (
                    <div style={{
                        background: "#fff",
                        borderRadius: "14px",
                        padding: "32px",
                        border: "1px solid #f1f5f9",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                    }}>
                        {error && (
                            <div style={{
                                background: "#fef2f2",
                                border: "1px solid #fecaca",
                                color: "#dc2626",
                                padding: "12px 16px",
                                borderRadius: "10px",
                                fontSize: "13px",
                                marginBottom: "24px",
                            }}>
                                ⚠️ {error}
                            </div>
                        )}

                        <form onSubmit={submitHandler}>

                            {/* Book selection */}
                            <div style={{ marginBottom: "24px" }}>
                                <label style={{
                                    display: "block",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    color: "#374151",
                                    marginBottom: "8px",
                                }}>
                                    Related Book
                                </label>
                                <select
                                    value={form.book}
                                    onChange={(e) => setForm({ ...form, book: e.target.value })}
                                    style={{
                                        ...inputStyle,
                                        cursor: "pointer",
                                        appearance: "auto",
                                    }}
                                >
                                    <option value="">General / Account Level</option>
                                    {books.map((book) => (
                                        <option key={book._id} value={book._id}>
                                            {book.title} ({book.isbn})
                                        </option>
                                    ))}
                                </select>
                                <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "6px" }}>
                                    Select the book this query is about, or leave as "General" for account-level issues
                                </p>
                            </div>

                            {/* Subject */}
                            <div style={{ marginBottom: "24px" }}>
                                <label style={{
                                    display: "block",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    color: "#374151",
                                    marginBottom: "8px",
                                }}>
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Brief summary of your issue"
                                    value={form.subject}
                                    style={inputStyle}
                                    onFocus={(e) => { e.target.style.borderColor = "#e94560"; e.target.style.background = "#fff"; }}
                                    onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; }}
                                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                />
                            </div>

                            {/* Description */}
                            <div style={{ marginBottom: "24px" }}>
                                <label style={{
                                    display: "block",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    color: "#374151",
                                    marginBottom: "8px",
                                }}>
                                    Description *
                                </label>
                                <textarea
                                    placeholder="Describe your issue in detail. Include any relevant information like order numbers, dates, or specific problems you're facing."
                                    value={form.description}
                                    style={{
                                        ...inputStyle,
                                        minHeight: "160px",
                                        resize: "vertical",
                                        lineHeight: "1.6",
                                    }}
                                    onFocus={(e) => { e.target.style.borderColor = "#e94560"; e.target.style.background = "#fff"; }}
                                    onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; }}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />
                            </div>

                            {/* File attachment (UI only) */}
                            <div style={{ marginBottom: "32px" }}>
                                <label style={{
                                    display: "block",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    color: "#374151",
                                    marginBottom: "8px",
                                }}>
                                    Attachment (Optional)
                                </label>
                                <div style={{
                                    border: "2px dashed #e2e8f0",
                                    borderRadius: "10px",
                                    padding: "24px",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    transition: "border-color 0.2s",
                                    background: "#fafbfc",
                                }}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.style.borderColor = "#e94560";
                                }}
                                onDragLeave={(e) => {
                                    e.currentTarget.style.borderColor = "#e2e8f0";
                                }}
                                onClick={() => document.getElementById("file-upload").click()}
                                >
                                    <input
                                        id="file-upload"
                                        type="file"
                                        style={{ display: "none" }}
                                        accept="image/*,.pdf,.doc,.docx"
                                        onChange={(e) => {
                                            if (e.target.files[0]) {
                                                setFileName(e.target.files[0].name);
                                            }
                                        }}
                                    />
                                    {fileName ? (
                                        <div>
                                            <span style={{ fontSize: "24px" }}>📎</span>
                                            <p style={{ fontSize: "14px", color: "#1a1a2e", fontWeight: "500", marginTop: "8px" }}>
                                                {fileName}
                                            </p>
                                            <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                                                Click to change file
                                            </p>
                                        </div>
                                    ) : (
                                        <div>
                                            <span style={{ fontSize: "24px" }}>📤</span>
                                            <p style={{ fontSize: "14px", color: "#64748b", marginTop: "8px" }}>
                                                Click to upload or drag and drop
                                            </p>
                                            <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                                                Images, PDF, DOC (max 10MB)
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* AI info banner */}
                            <div style={{
                                background: "linear-gradient(135deg, #eff6ff, #faf5ff)",
                                borderRadius: "10px",
                                padding: "16px 20px",
                                marginBottom: "24px",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                            }}>
                                <span style={{ fontSize: "20px" }}>🤖</span>
                                <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.5" }}>
                                    Our AI will automatically classify your ticket, assign a priority, and generate an initial response draft for our support team.
                                </p>
                            </div>

                            <button
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    padding: "14px",
                                    background: loading ? "#94a3b8" : "linear-gradient(135deg, #e94560, #d63851)",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "10px",
                                    fontSize: "15px",
                                    fontWeight: "600",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    fontFamily: "inherit",
                                    boxShadow: loading ? "none" : "0 4px 16px rgba(233,69,96,0.3)",
                                    transition: "all 0.2s",
                                }}
                            >
                                {loading ? "🤖 AI is processing your ticket..." : "Submit Ticket"}
                            </button>
                        </form>
                    </div>
                )}

            </div>
        </AuthorLayout>
    );
};

export default CreateTicket;