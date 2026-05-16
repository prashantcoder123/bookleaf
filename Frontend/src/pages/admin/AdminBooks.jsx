import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminLayout from "../../components/AdminLayout";

const AdminBooks = () => {

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const { data } = await API.get("/books/all-books");
            setBooks(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        if (status?.includes("Published")) return { bg: "#d1fae5", color: "#065f46" };
        if (status?.includes("Cover Design")) return { bg: "#dbeafe", color: "#1e40af" };
        if (status?.includes("Typesetting")) return { bg: "#fef3c7", color: "#92400e" };
        return { bg: "#e2e8f0", color: "#475569" };
    };

    const filtered = books.filter((b) =>
        b.title?.toLowerCase().includes(search.toLowerCase()) ||
        b.author?.name?.toLowerCase().includes(search.toLowerCase()) ||
        b.isbn?.toLowerCase().includes(search.toLowerCase())
    );

    const totalRoyalty = books.reduce((s, b) => s + (b.total_royalty_earned || 0), 0);
    const totalSold = books.reduce((s, b) => s + (b.total_copies_sold || 0), 0);
    const publishedCount = books.filter((b) => b.status?.includes("Published")).length;
    const inProductionCount = books.filter((b) => b.status?.includes("Production")).length;

    if (loading) {
        return (
            <AdminLayout>
                <div style={{ padding: "32px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
                    <p style={{ color: "#64748b" }}>Loading books...</p>
                </div>
            </AdminLayout>
        );
    }

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
                        All Books
                    </h1>
                    <p style={{ fontSize: "14px", color: "#64748b" }}>
                        {books.length} books across all authors
                    </p>
                </div>

                {/* Summary stats */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "16px",
                    marginBottom: "24px",
                }}>
                    {[
                        { label: "Total Books", value: books.length, icon: "📚", color: "#3b82f6", bg: "#eff6ff" },
                        { label: "Published", value: publishedCount, icon: "✅", color: "#10b981", bg: "#ecfdf5" },
                        { label: "In Production", value: inProductionCount, icon: "⏳", color: "#f59e0b", bg: "#fffbeb" },
                        { label: "Total Copies Sold", value: totalSold.toLocaleString(), icon: "📈", color: "#6366f1", bg: "#eef2ff" },
                    ].map((card, i) => (
                        <div key={i} style={{
                            background: "#fff",
                            borderRadius: "14px",
                            padding: "20px",
                            border: "1px solid #f1f5f9",
                            textAlign: "center",
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
                                margin: "0 auto 10px",
                            }}>
                                {card.icon}
                            </div>
                            <p style={{ fontSize: "24px", fontWeight: "700", color: card.color }}>{card.value}</p>
                            <p style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "4px" }}>{card.label}</p>
                        </div>
                    ))}
                </div>

                {/* Search */}
                <div style={{
                    background: "#fff",
                    borderRadius: "12px",
                    padding: "12px 20px",
                    marginBottom: "20px",
                    border: "1px solid #f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                }}>
                    <span style={{ fontSize: "16px", color: "#94a3b8" }}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search by title, author, or ISBN..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            flex: 1,
                            border: "none",
                            outline: "none",
                            fontSize: "14px",
                            fontFamily: "inherit",
                            background: "transparent",
                            color: "#1a1a2e",
                        }}
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "14px",
                                color: "#94a3b8",
                            }}
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Books table */}
                <div style={{
                    background: "#fff",
                    borderRadius: "14px",
                    overflow: "hidden",
                    border: "1px solid #f1f5f9",
                }}>
                    {/* Table header */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1.2fr 1fr 0.8fr 0.8fr 0.8fr 0.8fr",
                        padding: "14px 24px",
                        borderBottom: "1px solid #f1f5f9",
                        background: "#fafbfc",
                    }}>
                        {["Book Title", "Author", "ISBN", "Status", "Copies Sold", "Royalty Earned", "Pending"].map((h) => (
                            <p key={h} style={{
                                fontSize: "11px",
                                fontWeight: "700",
                                color: "#94a3b8",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                            }}>
                                {h}
                            </p>
                        ))}
                    </div>

                    {/* Rows */}
                    {filtered.length === 0 ? (
                        <div style={{ padding: "40px", textAlign: "center" }}>
                            <p style={{ color: "#94a3b8" }}>No books found</p>
                        </div>
                    ) : (
                        filtered.map((book, i) => {
                            const sStyle = getStatusStyle(book.status);
                            return (
                                <div key={book._id} style={{
                                    display: "grid",
                                    gridTemplateColumns: "2fr 1.2fr 1fr 0.8fr 0.8fr 0.8fr 0.8fr",
                                    padding: "16px 24px",
                                    borderBottom: i < filtered.length - 1 ? "1px solid #f8f9fc" : "none",
                                    alignItems: "center",
                                    transition: "background 0.15s",
                                    cursor: "default",
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = "#fafbfc"}
                                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                >
                                    <div>
                                        <p style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a2e" }}>{book.title}</p>
                                        <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>{book.genre}</p>
                                    </div>
                                    <p style={{ fontSize: "13px", color: "#475569" }}>{book.author?.name || "—"}</p>
                                    <p style={{ fontSize: "12px", color: "#64748b", fontFamily: "monospace" }}>{book.isbn}</p>
                                    <span style={{
                                        padding: "4px 10px",
                                        borderRadius: "6px",
                                        fontSize: "11px",
                                        fontWeight: "600",
                                        background: sStyle.bg,
                                        color: sStyle.color,
                                        display: "inline-block",
                                        whiteSpace: "nowrap",
                                    }}>
                                        {book.status?.includes("Published") ? "Published" : book.status?.split(" - ")[1] || book.status}
                                    </span>
                                    <p style={{ fontSize: "14px", fontWeight: "500", color: "#1a1a2e" }}>
                                        {(book.total_copies_sold || 0).toLocaleString()}
                                    </p>
                                    <p style={{ fontSize: "14px", fontWeight: "500", color: "#10b981" }}>
                                        ₹{(book.total_royalty_earned || 0).toLocaleString()}
                                    </p>
                                    <p style={{
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        color: (book.royalty_pending || 0) > 0 ? "#f59e0b" : "#94a3b8",
                                    }}>
                                        ₹{(book.royalty_pending || 0).toLocaleString()}
                                    </p>
                                </div>
                            );
                        })
                    )}
                </div>

            </div>
        </AdminLayout>
    );
};

export default AdminBooks;
