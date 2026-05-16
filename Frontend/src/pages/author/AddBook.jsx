import { useState } from "react";
import API from "../../services/api";
import AuthorLayout from "../../components/AuthorLayout";
import { useNavigate } from "react-router-dom";

const AddBook = () => {

    const [form, setForm] = useState({
        title: "",
        genre: "",
        isbn: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.title.trim()) {
            setError("Book title is required");
            return;
        }

        try {
            setLoading(true);

            await API.post("/books", form);
            setSuccess(true);

            setTimeout(() => {
                navigate("/author/my-books");
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || "Failed to add book");
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

                <div style={{ marginBottom: "32px", display: "flex", alignItems: "center", gap: "16px" }}>
                    <button
                        onClick={() => navigate("/author/my-books")}
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
                    <div>
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "32px",
                            fontWeight: "700",
                            color: "#1a1a2e",
                            marginBottom: "4px",
                        }}>
                            Add New Book
                        </h1>
                        <p style={{ fontSize: "14px", color: "#64748b" }}>
                            Submit your manuscript details for production
                        </p>
                    </div>
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
                            Book Added Successfully!
                        </h3>
                        <p style={{ fontSize: "14px", color: "#64748b" }}>
                            Your book is now in production. Redirecting...
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

                            {/* Title */}
                            <div style={{ marginBottom: "24px" }}>
                                <label style={{
                                    display: "block",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    color: "#374151",
                                    marginBottom: "8px",
                                }}>
                                    Book Title *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. The Midnight Echo"
                                    value={form.title}
                                    style={inputStyle}
                                    onFocus={(e) => { e.target.style.borderColor = "#e94560"; e.target.style.background = "#fff"; }}
                                    onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; }}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                />
                            </div>

                            {/* Genre */}
                            <div style={{ marginBottom: "24px" }}>
                                <label style={{
                                    display: "block",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    color: "#374151",
                                    marginBottom: "8px",
                                }}>
                                    Genre
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Fiction, Non-Fiction, Poetry"
                                    value={form.genre}
                                    style={inputStyle}
                                    onFocus={(e) => { e.target.style.borderColor = "#e94560"; e.target.style.background = "#fff"; }}
                                    onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; }}
                                    onChange={(e) => setForm({ ...form, genre: e.target.value })}
                                />
                            </div>

                            {/* ISBN */}
                            <div style={{ marginBottom: "32px" }}>
                                <label style={{
                                    display: "block",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    color: "#374151",
                                    marginBottom: "8px",
                                }}>
                                    ISBN (Optional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Leave blank if BookLeaf is assigning it"
                                    value={form.isbn}
                                    style={inputStyle}
                                    onFocus={(e) => { e.target.style.borderColor = "#e94560"; e.target.style.background = "#fff"; }}
                                    onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; }}
                                    onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                                />
                                <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "6px" }}>
                                    If you have your own ISBN, enter it here. Otherwise, BookLeaf will provide one.
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
                                {loading ? "Saving..." : "Submit Book"}
                            </button>
                        </form>
                    </div>
                )}

            </div>
        </AuthorLayout>
    );
};

export default AddBook;
