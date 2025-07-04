
import { AntNotification } from '@components/global/notification';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { UsersService } from '@/services/api-user';
import { useAuth } from '@/contexts/authcontext';
import { Loading } from '@components/loading/loading';

export const UpdateAccount = () => {
    const Navigate = useNavigate();
    const { userId } = useParams('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({ fullname: '', status: 0 });
    const [emailError, setEmailError] = useState('');

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await UsersService.getUserById(userId);
                setUser(res);
            } catch (error) {
                AntNotification.showNotification("Có lỗi xảy ra", error.message, "error");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };
    const handleEmailChange = (e) => {
        const email = e.target.value;
        setUser({ ...user, email });

        if (validateEmail(email)) {
            setEmailError('');
        } else {
            setEmailError('Email không hợp lệ');
        }
    };

    const toggleStatus = () => {
        setUser((prevUser) => {
            const updatedUser = {
                ...prevUser,
                status: prevUser.status === 1 ? 0 : 1,
            };
            return updatedUser;
        });
    };


    const handSubmit = async (e) => {
        e.preventDefault();
        if (!validateEmail(user.email)) {
            setEmailError('Email không hợp lệ');
            return;
        }
        const formData = new FormData(e.target);
        formData.append('status', user.status);
        formData.forEach((value, key) => {
            console.log(key, value);
        });
        try {
            const res = await UsersService.updateUser(formData, userId);
            if (res?.status === 200) {
                AntNotification.showNotification("Cập nhật thành công", res.message, "success");
                Navigate('/admin/accounts');
            } else {
                AntNotification.showNotification("Cập nhật thất bại", res.message, "error");
            }
        } catch (error) {
            AntNotification.handleError(error);
        }
    };
    return (

        <div className="pt-20 px-4 lg:ml-64">
            <nav className="rounded-md w-full my-2">
                <ol className="list-reset flex">
                    <li>
                        <Link
                            to="/admin"
                            className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                        >
                            Quản Trị
                        </Link>
                    </li>
                    <li>
                        <span className="mx-2 text-neutral-500 dark:text-neutral-400">
                            /
                        </span>
                    </li>
                    <li>
                        <Link
                            to="/admin/accounts"
                            className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                        >
                            Quản lý người dùng
                        </Link>
                    </li>
                    <li>
                        <span className="mx-2 text-neutral-500 dark:text-neutral-400">
                            /
                        </span>
                    </li>
                    <li className="text-neutral-500 dark:text-neutral-400">
                        Cập nhật người dùng
                    </li>
                </ol>
            </nav>
            <div className="bg-white shadow rounded-lg mb-4 p-4 sm:p-6 h-full">
                <div className="flex justify-between items-center my-2">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Cập nhật người dùng: {user?.fullname}
                    </h5>
                </div>
                <form className="mt-5 max-w-sm" onSubmit={handSubmit}>
                    <div className="mb-5">
                        <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-2">Tên tài khoản</label>
                        <input type="text"
                            defaultValue={user.fullname}
                            name="fullname"
                            style={{ borderRadius: '4px', padding: '11px' }}
                            placeholder="Nhập tên tài khoản"
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input type="text"
                            defaultValue={user.email}
                            name="email"
                            onChange={handleEmailChange}
                            style={{ borderRadius: '4px', padding: '11px' }}
                            placeholder="Nhập email"
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                        {emailError && <div className="text-red-500 text-xs">{emailError}</div>}
                    </div>
                    <div className="mb-5">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                        <input type="text"
                            defaultValue={user.phone}
                            name="phone"
                            style={{ borderRadius: '4px', padding: '11px' }}
                            placeholder="Nhập số điện thoại"
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
                        <input type="password"
                            defaultValue={user.password}
                            name="password"
                            style={{ borderRadius: '4px', padding: '11px' }}
                            placeholder="Nhập mật khẩu"
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                    </div>
                    <div className=''>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={user.status === 1}
                                onChange={toggleStatus}
                            />
                            <div className="group peer bg-white rounded-full duration-300 w-16 h-8 ring-2 ring-red-500 after:duration-300 after:bg-red-500 peer-checked:after:bg-green-500 peer-checked:ring-green-500 after:rounded-full after:absolute after:h-6 after:w-6 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-8 peer-hover:after:scale-95" />
                        </label>
                    </div>
                    <button type="submit" className="mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </form>
            </div>
            <Loading isLoading={loading} />
        </div>
    );
}