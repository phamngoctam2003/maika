import { Navigate } from "react-router-dom";
import { AuthService } from "../services/authservice";

export const ProtectedRoute = ({ children, role }) => {
    const userRole = AuthService.getUserRole();
    if (!role.includes(userRole)) {
        return <Navigate to="/" replace />;
    }
    return children;
};



