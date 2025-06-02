import { Navigate } from "react-router-dom";
import { AuthService } from "../services/authservice";
import { useAuth } from "../contexts/authcontext";
import { Loading } from "../components/loading/loading";

export const ProtectedRoute = ({ children, role }) => {

    const { permissions, roles, isAuthenticated, loading } = useAuth();
    if (loading) {
        return null;
    }
    if (role.some(r => roles.includes(r)) || permissions.length === 0) {
        return <Navigate to="/" replace />;
    }

    return children;
};

