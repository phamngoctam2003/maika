import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthService } from '../services/api-auth';
import { AntNotification } from "@components/global/notification";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [roles, setRoles] = useState([]);
    // State để lưu thông tin gói hội viên của user
    const [userPackages, setUserPackages] = useState([]);
    // State để lưu gói hội viên đang active (nếu có)
    const [activePackage, setActivePackage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!(token && AuthService.isAuthenticated()));
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isPopupActiveLogin, setIsPopupActiveLogin] = useState(false);
    const [isSupportOpenModal, setIsSupportOpenModal] = useState(false);


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
            // Reset thông tin gói hội viên khi token hết hạn
            setUserPackages([]);
            setActivePackage(null);
            setToken(null);
            setIsAuthenticated(false);
            AntNotification.showNotification("Phiên đăng nhập hết hạn", "Vui lòng đăng nhập lại", "error");
        }
    }, [token]);

    // Kiểm tra xem người dùng đã đăng nhập khi component mount
    useEffect(() => {
        getCurrentUser();
    }, []);

    const getCurrentUser = async () => {
        try {
            if (AuthService.isAuthenticated()) {
                // Lấy thông tin user cùng với membership và user_packages
                const response = await AuthService.getCurrentUser();
                setCurrentUser(response.user);
                setPermissions(response.permissions || []);
                setRoles(response.roles || []);

                // Set thông tin gói hội viên từ response
                if (response.user_packages) {
                    setUserPackages(response.user_packages);
                }

                // Set active package từ membership info
                if (response.membership && response.has_membership) {
                    setActivePackage(response.membership);
                } else {
                    setActivePackage(null);
                }

                setIsAuthenticated(true);
            }
        } catch (err) {
            setError(err);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };
    // Kiểm tra quyền
    const hasPermission = (permission) => {
        return permissions.includes(permission);
    };

    // Kiểm tra vai trò
    const hasRole = (role) => {
        return roles.includes(role);
    };

    /**
     * Kiểm tra xem user có gói hội viên đang hoạt động không
     * @returns {boolean} - true nếu có gói hội viên active và chưa hết hạn
     */
    const hasMembership = () => {
        // Kiểm tra có activePackage và chưa hết hạn
        if (!activePackage) {
            return false;
        }

        // Kiểm tra thời gian hết hạn
        const now = new Date();
        const endsAt = new Date(activePackage.ends_at);

        const isActive = activePackage.status === 'active';
        const notExpired = endsAt > now;
        const result = isActive && notExpired;

        return result;
    };

    /**
     * Lấy thông tin chi tiết về gói hội viên đang active
     * @returns {object|null} - object chứa thông tin gói hội viên hoặc null
     */
    const getMembershipInfo = () => {
        if (!hasMembership()) return null;

        // Backend đã format sẵn thông tin membership
        return {
            packageId: activePackage.package_id,
            packageName: activePackage.package_name,
            startsAt: activePackage.starts_at,
            endsAt: activePackage.ends_at,
            status: activePackage.status,
            paymentMethod: activePackage.payment_method,
            amount: activePackage.amount,
            isExpiringSoon: activePackage.is_expiring_soon,
            daysRemaining: Math.ceil((new Date(activePackage.ends_at) - new Date()) / (1000 * 60 * 60 * 24))
        };
    };

    /**
     * Kiểm tra xem gói hội viên có sắp hết hạn không (trong vòng 7 ngày)
     * @returns {boolean} - true nếu gói sắp hết hạn
     */
    const isMembershipExpiringSoon = () => {
        // Backend đã tính toán sẵn
        return activePackage && activePackage.is_expiring_soon;
    };

    /**
     * Refresh thông tin user và gói hội viên
     * Dùng khi user vừa mua gói mới hoặc cần cập nhật thông tin
     */
    const refreshUserData = async () => {
        try {
            if (AuthService.isAuthenticated()) {
                const response = await AuthService.getCurrentUser();
                setCurrentUser(response.user);
                setPermissions(response.permissions || []);
                setRoles(response.roles || []);

                // Cập nhật thông tin gói hội viên
                if (response.user_packages) {
                    setUserPackages(response.user_packages);
                }

                if (response.membership && response.has_membership) {
                    setActivePackage(response.membership);
                } else {
                    setActivePackage(null);
                }
            }
        } catch (err) {
            console.error('Error refreshing user data:', err);
        }
    };
    const value = {
        currentUser,
        permissions,
        roles,
        // Thông tin gói hội viên
        userPackages,
        activePackage,
        loading,
        error,
        token,
        isLoginModalOpen,
        isPopupActiveLogin,
        isSupportOpenModal,
        setIsSupportOpenModal,
        setIsPopupActiveLogin,
        setIsLoginModalOpen,
        setLoading,
        setRoles,
        setToken,
        setPermissions,
        setUserPackages,
        setActivePackage,
        hasPermission,
        hasRole,
        // Functions để làm việc với gói hội viên
        hasMembership,
        getMembershipInfo,
        isMembershipExpiringSoon,
        refreshUserData,
        // isAuthenticated: AuthService.isAuthenticated(),
        isAuthenticated,
        setIsAuthenticated,
        setCurrentUser,
        getCurrentUser,
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