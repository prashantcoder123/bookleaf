import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {

    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext);

    const logoutHandler = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    return (

        <div style={{
            background: "#fff",
            borderBottom: "1px solid #e2e8f0",
            padding: "0 32px",
            height: "64px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 10,
        }}>

            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
            }}>
                <span style={{
                    fontSize: "14px",
                    color: "#64748b",
                }}>
                    Welcome,
                </span>
                <span style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#1a1a2e",
                }}>
                    {user?.name || "User"}
                </span>
                <span style={{
                    fontSize: "11px",
                    padding: "3px 10px",
                    borderRadius: "20px",
                    background: user?.role === "ADMIN" ? "rgba(233, 69, 96, 0.1)" : "rgba(59, 130, 246, 0.1)",
                    color: user?.role === "ADMIN" ? "#e94560" : "#3b82f6",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                }}>
                    {user?.role}
                </span>
            </div>

            <button
                onClick={logoutHandler}
                style={{
                    background: "transparent",
                    border: "1px solid #e2e8f0",
                    color: "#64748b",
                    padding: "8px 20px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                    e.target.style.borderColor = "#e94560";
                    e.target.style.color = "#e94560";
                }}
                onMouseLeave={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.color = "#64748b";
                }}
            >
                Logout
            </button>

        </div>

    );
};

export default Navbar;