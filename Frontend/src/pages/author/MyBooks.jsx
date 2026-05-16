import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import AuthorLayout from "../../components/AuthorLayout";

const MyBooks = () => {

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const { data } = await API.get("/books/my-books");
            setBooks(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        if (status?.includes("Published")) return { bg: "#d1fae5", color: "#065f46", label: "Published & Live" };
        if (status?.includes("Cover Design")) return { bg: "#dbeafe", color: "#1e40af", label: "In Production - Cover Design" };
        if (status?.includes("Typesetting")) return { bg: "#fef3c7", color: "#92400e", label: "In Production - Typesetting" };
        return { bg: "#e2e8f0", color: "#475569", label: status };
    };

    if (loading) {
        return (
            <AuthorLayout>
                <div style={{ padding: "32px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "40px", marginBottom: "16px" }}>📚</div>
                        <p style={{ color: "#64748b" }}>Loading your books...</p>
                    </div>
                </div>
            </AuthorLayout>
        );
    }

    return (
        <AuthorLayout>
            <div style={{ padding: "32px", maxWidth: "1200px" }}>

                <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "32px",
                            fontWeight: "700",
                            color: "#1a1a2e",
                            marginBottom: "8px",
                        }}>
                            My Books
                        </h1>
                        <p style={{ fontSize: "14px", color: "#64748b" }}>
                            {books.length} book{books.length !== 1 ? "s" : ""} in your catalog
                        </p>
                    </div>
                    <Link
                        to="/author/add-book"
                        style={{
                            background: "linear-gradient(135deg, #e94560, #d63851)",
                            color: "#fff",
                            padding: "10px 20px",
                            borderRadius: "10px",
                            fontSize: "14px",
                            fontWeight: "600",
                            textDecoration: "none",
                            boxShadow: "0 4px 12px rgba(233,69,96,0.25)",
                            transition: "all 0.2s",
                        }}
                    >
                        + Add New Book
                    </Link>
                </div>

                {books.length === 0 ? (
                    <div style={{
                        background: "#fff",
                        borderRadius: "14px",
                        padding: "60px",
                        textAlign: "center",
                        border: "1px solid #f1f5f9",
                    }}>
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📚</div>
                        <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1a2e", marginBottom: "8px" }}>
                            No Books Yet
                        </h3>
                        <p style={{ fontSize: "14px", color: "#64748b" }}>
                            Your published books will appear here
                        </p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        {books.map((book, i) => {
                            const statusStyle = getStatusStyle(book.status);
                            const isPublished = book.status?.includes("Published");

                            return (
                                <div key={book._id} className="animate-fade-in" style={{
                                    background: "#fff",
                                    borderRadius: "14px",
                                    overflow: "hidden",
                                    border: "1px solid #f1f5f9",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                                    animationDelay: `${i * 0.08}s`,
                                }}>
                                    {/* Book header */}
                                    <div style={{
                                        padding: "24px 28px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        borderBottom: "1px solid #f1f5f9",
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                                                <h2 style={{
                                                    fontFamily: "'Playfair Display', serif",
                                                    fontSize: "22px",
                                                    fontWeight: "600",
                                                    color: "#1a1a2e",
                                                }}>
                                                    {book.title}
                                                </h2>
                                                <span style={{
                                                    padding: "4px 12px",
                                                    borderRadius: "20px",
                                                    fontSize: "11px",
                                                    fontWeight: "600",
                                                    background: statusStyle.bg,
                                                    color: statusStyle.color,
                                                }}>
                                                    {statusStyle.label}
                                                </span>
                                            </div>
                                            <div style={{
                                                display: "flex",
                                                gap: "20px",
                                                fontSize: "13px",
                                                color: "#64748b",
                                            }}>
                                                <span>📖 {book.genre}</span>
                                                <span>🔗 ISBN: {book.isbn}</span>
                                                {book.publication_date && (
                                                    <span>📅 {new Date(book.publication_date).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</span>
                                                )}
                                            </div>
                                        </div>
                                        {isPublished && book.mrp && (
                                            <div style={{
                                                textAlign: "right",
                                            }}>
                                                <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>MRP</p>
                                                <p style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a2e" }}>₹{book.mrp}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Stats grid (only for published books) */}
                                    {isPublished ? (
                                        <div style={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(5, 1fr)",
                                            borderBottom: "1px solid #f1f5f9",
                                        }}>
                                            {[
                                                { label: "Copies Sold", value: book.total_copies_sold?.toLocaleString() || "0", icon: "📈" },
                                                { label: "Royalty/Copy", value: `₹${book.author_royalty_per_copy || 0}`, icon: "💎" },
                                                { label: "Total Earned", value: `₹${(book.total_royalty_earned || 0).toLocaleString()}`, icon: "💰" },
                                                { label: "Royalty Paid", value: `₹${(book.royalty_paid || 0).toLocaleString()}`, icon: "✅" },
                                                { label: "Pending", value: `₹${(book.royalty_pending || 0).toLocaleString()}`, icon: "⏳" },
                                            ].map((stat, j) => (
                                                <div key={j} style={{
                                                    padding: "20px 24px",
                                                    borderRight: j < 4 ? "1px solid #f1f5f9" : "none",
                                                    textAlign: "center",
                                                }}>
                                                    <span style={{ fontSize: "18px" }}>{stat.icon}</span>
                                                    <p style={{ fontSize: "18px", fontWeight: "700", color: "#1a1a2e", margin: "8px 0 4px" }}>
                                                        {stat.value}
                                                    </p>
                                                    <p style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                                        {stat.label}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{
                                            padding: "20px 28px",
                                            background: "#fffbeb",
                                            borderBottom: "1px solid #f1f5f9",
                                        }}>
                                            <p style={{ fontSize: "13px", color: "#92400e" }}>
                                                ⏳ This book is currently in production. Details will be available once published.
                                            </p>
                                        </div>
                                    )}

                                    {/* Footer — distribution & payout */}
                                    <div style={{
                                        padding: "16px 28px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        background: "#fafbfc",
                                    }}>
                                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                            {book.available_on?.length > 0 ? (
                                                book.available_on.map((platform, k) => (
                                                    <span key={k} style={{
                                                        padding: "4px 10px",
                                                        borderRadius: "6px",
                                                        fontSize: "11px",
                                                        fontWeight: "500",
                                                        background: "#f1f5f9",
                                                        color: "#475569",
                                                    }}>
                                                        {platform}
                                                    </span>
                                                ))
                                            ) : (
                                                <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                                                    Not yet distributed
                                                </span>
                                            )}
                                        </div>
                                        {book.last_royalty_payout_date && (
                                            <span style={{ fontSize: "12px", color: "#64748b" }}>
                                                Last payout: {new Date(book.last_royalty_payout_date).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                                            </span>
                                        )}
                                        {book.print_partner && (
                                            <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                                                Print: {book.print_partner}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
        </AuthorLayout>
    );
};

export default MyBooks;
