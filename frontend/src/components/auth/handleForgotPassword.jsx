import { useState } from "react";
import { AuthService } from "@/services/api-auth";
import { notification } from "antd"
export default function ForgotPassword({ isOpen, onClose }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await AuthService.forgotPassword(email);
            setLoading(false);
            onClose();
            notification.success({
                message: "Gửi thành công", 
                description: res.message || "Có lỗi xảy ra!",
                duration: 7, 
                
            });
        } catch (err) {
            console.log(err);
            notification.warning({
                message: "Chú ý",
                description: err.response?.data?.message || "Có lỗi xảy ra!",
                duration: 6, 
            });
        } finally {
            setLoading(false);
        }
    };
    console.log(loading)
    if (!isOpen) return null;
    return (
        <div className="forgot-password">
            <div className="logo-container">
                Quyên mật khẩu
                <button
                    type="button"
                    className="close-btn p-1"
                    style={{ float: "right", background: "none", border: "none", fontSize: "25px", cursor: "pointer" }}
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>
            </div>
            <form className="form" onSubmit={handleForgotPassword}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="text" id="email" name="email" placeholder="Enter your email" required="" />
                </div>
                <button
                    disabled={loading}
                    className="form-submit-btn"
                    type="submit"
                >
                    {loading ? (
                        <span
                            className="ant-btn-loading-icon"
                            style={{
                                display: "inline-block",
                                verticalAlign: "middle",
                                marginRight: 8,
                            }}
                        >
                            <svg
                                viewBox="0 0 1024 1024"
                                focusable="false"
                                data-icon="loading"
                                width="1em"
                                height="1em"
                                fill="currentColor"
                                aria-hidden="true"
                                style={{ animation: "spin 1s linear infinite" }}
                            >
                                <path d="M988 548H836c-17.7 0-32-14.3-32-32s14.3-32 32-32h120c17.7 0 32 14.3 32 32 0 243.4-197.6 441-441 441S44 759.4 44 516 241.6 75 485 75c17.7 0 32 14.3 32 32s-14.3 32-32 32C273.7 139 108 304.7 108 516s165.7 377 377 377 377-165.7 377-377z"></path>
                            </svg>
                            <style>
                                {`@keyframes spin { 100% { transform: rotate(360deg); } }`}
                            </style>
                        </span>
                    ) : null}
                    Gửi Email
                </button>
            </form>
        </div>
    );
}
