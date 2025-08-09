import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/authcontext';
import { Helmet } from "react-helmet";
import SidebarProfile from '@components/user/sidebar/SidebarMenuProfile';
import PackageService from "@/services/users/api-package";
const TransactionHistories = () => {
    const { currentUser, activePackage, loading, setLoading, isAuthenticated } = useAuth();
    const [books, setBooks] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        if (loading) return;
        if (!isAuthenticated) {
            message.error('Bạn cần đăng nhập để truy cập trang này.');
            navigate('/');
        }
    }, [isAuthenticated, loading, navigate]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await PackageService.getTransactionHistories();
            console.log('Transaction Histories:', response);
            setTransactions(response || []);
        } catch (error) {
            console.error('Không lấy được lịch sử giao dịch.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <>
            <Helmet>
                <title>Lịch sử giao dịch | Maika</title>
                <meta name="description" content="Xem lịch sử giao dịch của bạn tại Maika" />
            </Helmet>
            <div className="min-h-screen bg-color-root pt-28 w-full px-4 lg:px-12">
                <div className="flex flex-col lg:flex-row min-h-screen">
                    <SidebarProfile formData={currentUser} activePackage={activePackage} />
                    <div className="flex-1 p-6 lg:p-8">
                        <h1 className="text-xl font-semibold mb-6">Lịch sử giao dịch</h1>
                        <div className="py-2">
                            <h2 className='text-lg font-semibold mb-6 text-maika-500'>Mua gói cước</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-gray-800 rounded">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left">#</th>
                                            <th className="px-4 py-2 text-left">Gói</th>
                                            <th className="px-4 py-2 text-left">Số tiền</th>
                                            <th className="px-4 py-2 text-left">Phương thức</th>
                                            <th className="px-4 py-2 text-left">Trạng thái giao dịch</th>
                                            <th className="px-4 py-2 text-left">Trạng thái gói cước</th>
                                            <th className="px-4 py-2 text-left">Ngày giao dịch</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="text-center py-4 text-gray-400">Không có giao dịch nào.</td>
                                            </tr>
                                        )}
                                        {transactions.map((item, idx) => (
                                            <tr key={item.id || idx} className="border-b border-gray-700">
                                                <td className="px-4 py-2">{idx + 1}</td>
                                                <td className="px-4 py-2">{item.package_name || item.package?.name || '-'}</td>
                                                <td className="px-4 py-2">{item.amount ? item.amount.toLocaleString() + ' đ' : '-'}</td>
                                                <td className="px-4 py-2">{item.payment_method || '-'}</td>
                                                <td className="px-4 py-2">
                                                    {item.payment_status === 'completed' && <span className="text-green-500">Thành công</span>}
                                                    {item.payment_status === 'failed' && <span className="text-red-500">Thất bại</span>}
                                                    {item.status === 'pending' && <span className="text-red-500">Thất bại</span>}
                                                    {!['completed', 'failed', 'pending'].includes(item.payment_status) && <span className="text-gray-400">{item.payment_status}</span>}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {item.status === 'active' && new Date(item.ends_at) < new Date() && (
                                                        <span className="text-yellow-500">Đã hết hạn</span>
                                                    )}
                                                    {item.status === 'active' && new Date(item.ends_at) >= new Date() && (
                                                        <span className="text-green-500">Hoạt động</span>
                                                    )}
                                                    {item.status === 'failed' && <span className="text-red-500">Thất bại</span>}
                                                    {item.status === 'pending' && <span className="text-red-500">Thất bại</span>}
                                                    {item.status === 'cancelled' && <span className="text-gray-400">Đã hủy</span>}
                                                    {item.status === 'expired' && <span className="text-yellow-500">Đã hết hạn</span>}
                                                    {!['active', 'failed', 'pending', 'cancelled', 'expired'].includes(item.status) && (
                                                        <span className="text-gray-400">{item.status}</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2">{item.created_at ? new Date(item.created_at).toLocaleString() : '-'}</td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TransactionHistories;
