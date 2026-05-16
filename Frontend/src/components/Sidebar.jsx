import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ role }) => {

    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const authorLinks = [
        { path: "/author", label: "Dashboard", icon: "📊" },
        { path: "/author/my-books", label: "My Books", icon: "📚" },
        { path: "/author/create-ticket", label: "Create Ticket", icon: "🎫" },
        { path: "/author/my-tickets", label: "My Tickets", icon: "📋" },
        { path: "/author/settings", label: "Settings", icon: "⚙️" },
    ];

    const adminLinks = [
        { path: "/admin", label: "Dashboard", icon: "📊" },
        { path: "/admin/books", label: "All Books", icon: "📚" },
        { path: "/admin/tickets", label: "Ticket Queue", icon: "🎫" },
    ];

    const links = role === "ADMIN" ? adminLinks : authorLinks;

    return (

        <div style={{
            width: "260px",
            minHeight: "100vh",
            background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
            padding: "0",
            display: "flex",
            flexDirection: "column",
            position: "sticky",
            top: 0,
            height: "100vh",
        }}>

            {/* Logo */}
            <div style={{
                padding: "28px 24px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                }}>
                    <div style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #e94560, #c9a84c)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                    }}>
                        📖
                    </div>
                    <div>
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "20px",
                            fontWeight: "700",
                            color: "#fff",
                            letterSpacing: "0.5px",
                        }}>
                            BookLeaf
                        </h1>
                        <p style={{
                            fontSize: "11px",
                            color: "rgba(255,255,255,0.4)",
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                            marginTop: "2px",
                        }}>
                            {role === "ADMIN" ? "Admin Portal" : "Author Portal"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav style={{
                padding: "20px 12px",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "4px",
            }}>
                {links.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "12px 16px",
                            borderRadius: "10px",
                            color: isActive(link.path) ? "#fff" : "rgba(255,255,255,0.6)",
                            background: isActive(link.path) ? "rgba(233, 69, 96, 0.2)" : "transparent",
                            textDecoration: "none",
                            fontSize: "14px",
                            fontWeight: isActive(link.path) ? "600" : "400",
                            transition: "all 0.2s ease",
                            borderLeft: isActive(link.path) ? "3px solid #e94560" : "3px solid transparent",
                        }}
                        onMouseEnter={(e) => {
                            if (!isActive(link.path)) {
                                e.target.style.background = "rgba(255,255,255,0.05)";
                                e.target.style.color = "rgba(255,255,255,0.9)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isActive(link.path)) {
                                e.target.style.background = "transparent";
                                e.target.style.color = "rgba(255,255,255,0.6)";
                            }
                        }}
                    >
                        <span style={{ fontSize: "18px" }}>{link.icon}</span>
                        {link.label}
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <div style={{
                padding: "16px 24px",
                borderTop: "1px solid rgba(255,255,255,0.08)",
            }}>
                <p style={{
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.3)",
                    textAlign: "center",
                }}>
                    © 2025 BookLeaf Publishing
                </p>
            </div>

        </div>

    );
};

export default Sidebar;