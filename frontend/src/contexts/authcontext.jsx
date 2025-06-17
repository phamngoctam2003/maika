import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthService } from '../services/api-auth';
import { AntNotification } from "@components/ui/notification";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!(token && AuthService.isAuthenticated()));


    // Lưu token vào localStorage khi có sự thay đổi
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            setIsAuthenticated(!!(token && AuthService.isAuthenticated()));
        } else {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
        }
    }, [token]);

    useEffect(() => {
        if (AuthService.isTokenExpired() && token) {
            // Không gọi API logout vì token đã hết hạn
            setCurrentUser(null);
            setPermissions([]);
            setRoles([]);
            setToken(null);
            setIsAuthenticated(false);
            AntNotification.showNotification("Phiên đăng nhập hết hạn", "Vui lòng đăng nhập lại", "error");
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
                    setIsAuthenticated(true);
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
    // console.log('authenticated', isAuthenticated, token, currentUser, permissions, roles);
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
        isAuthenticated,
        setIsAuthenticated,
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