import { jwtDecode } from "jwt-decode";
export const AuthService = {
    getUserRole: () => {
        const token = localStorage.getItem("token");
        if (!token) return null;
        try {
            const decoded = jwtDecode(token);
            const currentTimestamp = Math.floor(Date.now() / 1000);
            if (decoded.exp < currentTimestamp) {
                return null;
            }
            return decoded.role;
        } catch (err) {
            console.error("token kkhông hợp lệ!!", err);
            return null;
        }
    },
};
