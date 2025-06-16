import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthService } from '../services/api-auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    // const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    // Lưu token vào localStorage khi có sự thay đổi
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);
    // Kiểm tra xem người dùng đã đăng nhập khi component mount
    useEffect(() => {
        (async () => {
            try {
                if (AuthService.isAuthenticated()) {
                    const response = await AuthService.getCurrentUser();
                    setCurrentUser(response.user);
                    setPermissions(response.permissions || []);
                    setRoles(response.roles || []);
                    // setIsAuthenticated(true);
                }
            } catch (err) {
                setError(err);
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        })();
    }, []);
    // Kiểm tra quyền
    const hasPermission = (permission) => {
        return permissions.includes(permission);
    };

    // Kiểm tra vai trò
    const hasRole = (role) => {
        return roles.includes(role);
    };

    const value = {
        currentUser,
        permissions,
        roles,
        loading,
        error,
        token,
        setRoles,
        setToken,
        setPermissions,
        hasPermission,
        hasRole,
        // isAuthenticated: AuthService.isAuthenticated(),
        isAuthenticated: !!token,
        // setIsAuthenticated,
        setCurrentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook để sử dụng AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};