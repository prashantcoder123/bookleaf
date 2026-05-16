import { useContext, useState } from "react";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const submitHandler = async (e) => {

        e.preventDefault();
        setError("");

        if (!form.email || !form.password) {
            setError("Please fill in all fields");
            return;
        }

        try {
            setLoading(true);

            const { data } = await API.post("/auth/login", form);

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            setUser(data.user);

            if (data.user.role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/author");
            }

        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)",
            position: "relative",
            overflow: "hidden",
        }}>

            {/* Decorative elements */}
            <div style={{
                position: "absolute",
                top: "-150px",
                right: "-150px",
                width: "400px",
                height: "400px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(233,69,96,0.15), transparent 70%)",
            }} />
            <div style={{
                position: "absolute",
                bottom: "-100px",
                left: "-100px",
                width: "300px",
                height: "300px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(201,168,76,0.1), transparent 70%)",
            }} />

            {/* Left branding panel */}
            <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "60px",
            }}>
                <div style={{ textAlign: "center", maxWidth: "400px" }}>
                    <div style={{
                        width: "72px",
                        height: "72px",
                        borderRadius: "18px",
                        background: "linear-gradient(135deg, #e94560, #c9a84c)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "36px",
                        margin: "0 auto 24px",
                        boxShadow: "0 8px 32px rgba(233,69,96,0.3)",
                    }}>
                        📖
                    </div>
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "42px",
                        fontWeight: "700",
                        color: "#fff",
                        marginBottom: "12px",
                        letterSpacing: "1px",
                    }}>
                        BookLeaf
                    </h1>
                    <p style={{
                        fontSize: "14px",
                        color: "rgba(255,255,255,0.4)",
                        letterSpacing: "4px",
                        textTransform: "uppercase",
                        marginBottom: "32px",
                    }}>
                        Publishing
                    </p>
                    <p style={{
                        fontSize: "16px",
                        color: "rgba(255,255,255,0.6)",
                        lineHeight: "1.7",
                    }}>
                        Author Support & Communication Portal.
                        <br />
                        Manage your books, royalties, and support queries.
                    </p>
                </div>
            </div>

            {/* Right login form */}
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px",
            }}>
                <div style={{
                    background: "rgba(255,255,255,0.97)",
                    borderRadius: "20px",
                    padding: "48px",
                    width: "420px",
                    boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
                    backdropFilter: "blur(20px)",
                }}>
                    <h2 style={{
                        fontSize: "28px",
                        fontWeight: "700",
                        color: "#1a1a2e",
                        marginBottom: "6px",
                    }}>
                        Welcome Back
                    </h2>
                    <p style={{
                        fontSize: "14px",
                        color: "#64748b",
                        marginBottom: "32px",
                    }}>
                        Sign in to your account
                    </p>

                    {error && (
                        <div style={{
                            background: "#fef2f2",
                            border: "1px solid #fecaca",
                            color: "#dc2626",
                            padding: "12px 16px",
                            borderRadius: "10px",
                            fontSize: "13px",
                            marginBottom: "20px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={submitHandler}>

                        <div style={{ marginBottom: "20px" }}>
                            <label style={{
                                display: "block",
                                fontSize: "13px",
                                fontWeight: "500",
                                color: "#374151",
                                marginBottom: "8px",
                            }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "1.5px solid #e2e8f0",
                                    borderRadius: "10px",
                                    fontSize: "14px",
                                    outline: "none",
                                    transition: "border-color 0.2s",
                                    fontFamily: "inherit",
                                    background: "#f8fafc",
                                    boxSizing: "border-box",
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = "#e94560";
                                    e.target.style.background = "#fff";
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = "#e2e8f0";
                                    e.target.style.background = "#f8fafc";
                                }}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                            />
                        </div>

                        <div style={{ marginBottom: "28px" }}>
                            <label style={{
                                display: "block",
                                fontSize: "13px",
                                fontWeight: "500",
                                color: "#374151",
                                marginBottom: "8px",
                            }}>
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={form.password}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "1.5px solid #e2e8f0",
                                    borderRadius: "10px",
                                    fontSize: "14px",
                                    outline: "none",
                                    transition: "border-color 0.2s",
                                    fontFamily: "inherit",
                                    background: "#f8fafc",
                                    boxSizing: "border-box",
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = "#e94560";
                                    e.target.style.background = "#fff";
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = "#e2e8f0";
                                    e.target.style.background = "#f8fafc";
                                }}
                                onChange={(e) =>
                                    setForm({ ...form, password: e.target.value })
                                }
                            />
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
                                transition: "all 0.2s ease",
                                fontFamily: "inherit",
                                boxShadow: loading ? "none" : "0 4px 16px rgba(233,69,96,0.3)",
                            }}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>

                    </form>

                    <p style={{
                        textAlign: "center",
                        marginTop: "24px",
                        fontSize: "13px",
                        color: "#64748b",
                    }}>
                        Don't have an account?{" "}
                        <Link to="/register" style={{
                            color: "#e94560",
                            fontWeight: "600",
                            textDecoration: "none",
                        }}>
                            Register
                        </Link>
                    </p>

                </div>
            </div>

        </div>
    );
};

export default Login;