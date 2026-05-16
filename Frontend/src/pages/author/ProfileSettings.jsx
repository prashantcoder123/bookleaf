import { useState, useEffect, useContext } from "react";
import API from "../../services/api";
import AuthorLayout from "../../components/AuthorLayout";
import { AuthContext } from "../../context/AuthContext";

const ProfileSettings = () => {
    const { user, setUser } = useContext(AuthContext);
    
    const [form, setForm] = useState({
        name: "",
        phone: "",
        bankDetails: {
            accountName: "",
            accountNumber: "",
            ifscCode: "",
            bankName: "",
        }
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await API.get("/users/profile");
            setForm({
                name: data.name || "",
                phone: data.phone || "",
                bankDetails: {
                    accountName: data.bankDetails?.accountName || "",
                    accountNumber: data.bankDetails?.accountNumber || "",
                    ifscCode: data.bankDetails?.ifscCode || "",
                    bankName: data.bankDetails?.bankName || "",
                }
            });
        } catch (error) {
            console.log("Error fetching profile", error);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: "", type: "" });

        try {
            const { data } = await API.put("/users/profile", form);
            setUser({ ...user, name: data.name }); // update context
            setMessage({ text: "Profile updated successfully!", type: "success" });
            
            setTimeout(() => setMessage({ text: "", type: "" }), 3000);
        } catch (error) {
            setMessage({ text: error.response?.data?.message || "Failed to update profile", type: "error" });
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

    const labelStyle = {
        display: "block",
        fontSize: "13px",
        fontWeight: "600",
        color: "#374151",
        marginBottom: "8px",
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
                        marginBottom: "4px",
                    }}>
                        Profile & Settings
                    </h1>
                    <p style={{ fontSize: "14px", color: "#64748b" }}>
                        Manage your account details and royalty payout information
                    </p>
                </div>

                {message.text && (
                    <div className="animate-fade-in" style={{
                        background: message.type === "success" ? "#ecfdf5" : "#fef2f2",
                        border: `1px solid ${message.type === "success" ? "#a7f3d0" : "#fecaca"}`,
                        color: message.type === "success" ? "#065f46" : "#dc2626",
                        padding: "12px 16px",
                        borderRadius: "10px",
                        fontSize: "13px",
                        marginBottom: "24px",
                    }}>
                        {message.type === "success" ? "✅ " : "⚠️ "}
                        {message.text}
                    </div>
                )}

                <div style={{
                    background: "#fff",
                    borderRadius: "14px",
                    padding: "32px",
                    border: "1px solid #f1f5f9",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}>
                    <form onSubmit={submitHandler}>
                        
                        <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1a2e", marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
                            Personal Information
                        </h3>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px" }}>
                            <div>
                                <label style={labelStyle}>Full Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    style={inputStyle}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Phone Number</label>
                                <input
                                    type="text"
                                    value={form.phone}
                                    style={inputStyle}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1a2e", marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
                            Royalty Payout Details
                        </h3>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                            <div>
                                <label style={labelStyle}>Account Holder Name</label>
                                <input
                                    type="text"
                                    value={form.bankDetails.accountName}
                                    style={inputStyle}
                                    onChange={(e) => setForm({ ...form, bankDetails: { ...form.bankDetails, accountName: e.target.value } })}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Bank Name</label>
                                <input
                                    type="text"
                                    value={form.bankDetails.bankName}
                                    style={inputStyle}
                                    onChange={(e) => setForm({ ...form, bankDetails: { ...form.bankDetails, bankName: e.target.value } })}
                                />
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px" }}>
                            <div>
                                <label style={labelStyle}>Account Number</label>
                                <input
                                    type="text"
                                    value={form.bankDetails.accountNumber}
                                    style={inputStyle}
                                    onChange={(e) => setForm({ ...form, bankDetails: { ...form.bankDetails, accountNumber: e.target.value } })}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>IFSC Code</label>
                                <input
                                    type="text"
                                    value={form.bankDetails.ifscCode}
                                    style={inputStyle}
                                    onChange={(e) => setForm({ ...form, bankDetails: { ...form.bankDetails, ifscCode: e.target.value } })}
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            style={{
                                padding: "14px 28px",
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
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                </div>
            </div>
        </AuthorLayout>
    );
};

export default ProfileSettings;
