
import { AntNotification } from '@components/global/notification';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { UsersService } from '@/services/api-user';
import { useAuth } from '@/contexts/authcontext';
import { Loading } from '@components/loading/loading';

export const Set_Role_Account = () => {
    const Navigate = useNavigate();
    const { userId } = useParams('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});
    const [roles, setRole] = useState([]);
    const [selectRole, setselectRole] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const res = await UsersService.getUserById(userId);
                setUser(res);
                setselectRole(res.roles.map((role) => role.id));
            } catch (error) {
                AntNotification.showNotification("Có lỗi xảy ra", error.message, "error");
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await UsersService.showRoles();
                console.log(res);
                if (res.status === 200) {
                    setRole(res.roles);
                } else {
                    AntNotification.showNotification("Có lỗi xảy ra", res.message, "error");
                    Navigate('/admin/accounts');
                }
            } catch (error) {
                AntNotification.handleError(error);
                Navigate('/admin/accounts');
            }finally {
                setLoading(false);
            }
        })();
    }, [userId]);

    const handleRoleChange = (event) => {
        const userId = parseInt(event.target.value);
        setselectRole((perv) => {
            if (perv.includes(userId)) {
                return perv.filter((id) => id !== userId);
            }
            return [...perv, userId];
        })
    };

    const handSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        if (selectRole.length > 0) {
            selectRole.forEach(userId => {
                formData.append('roles[]', userId);
            });
        }
        try {
            const res = await UsersService.roleLevel(formData, userId);
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
                        Câp nhật vai trò người dùng
                    </li>
                </ol>
            </nav>
            <div className="bg-white shadow rounded-lg mb-4 p-4 sm:p-6 h-full">
                <div className="flex justify-between items-center my-2">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Cập nhật vai trò cho người dùng: {user?.fullName}
                    </h5>
                </div>
                <form className="mt-5" onSubmit={handSubmit}>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Cấp vai trò</label>
                    <div className="grid grid-cols-3 gap-4">

                        {
                            (roles.length > 0) ? (
                                roles.map((role) => (
                                    <div key={role.id} className="flex gap-4 select-none">
                                        <input type="checkbox" checked={selectRole.includes(role.id)}
                                            onChange={handleRoleChange}
                                            className="cursor-pointer" name="roles[]" value={role.id} id={role.id} />
                                        <label className="cursor-pointer" htmlFor={role.id}>{role.name}</label>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center">Không có vai trò nào</div>
                            )
                        }
                    </div>
                    <button type="submit" className="mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </form>
            </div>
            <Loading isLoading={loading} />
        </div>
    );
}