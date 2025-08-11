import React, { useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/services/api-auth";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const email = params.get("email");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await AuthService.resetPassword({
                email,
                token,
                password,
                password_confirmation: passwordConfirmation,
            });
            message.success("Đổi mật khẩu thành công!");
            navigate("/");
        } catch (err) {
            message.error(err.response?.data?.message || "Có lỗi xảy ra.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white w-full max-w-md p-6 rounded-lg shadow-md space-y-4"
            >
                <h2 className="text-xl font-bold text-center">Đặt lại mật khẩu</h2>

                <input
                    type="password"
                    placeholder="Mật khẩu mới"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                />

                <input
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 rounded text-white font-semibold transition ${loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                        }`}
                >
                    {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
