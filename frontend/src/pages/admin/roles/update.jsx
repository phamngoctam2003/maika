import { AntNotification } from '@components/global/notification';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { RolesService } from "../../../services/api-roles";
import { Loading } from '@components/loading/loading';

export const Update_Role = () => {
    const Navigate = useNavigate();
    const { roleId } = useParams('');
    const [loading, setLoading] = useState(false);
    const [Role, setRole] = useState({});
    const [permissions, setPermissions] = useState([]);
    const [selectPermiss, setSelectPermiss] = useState([]);
    const [filteredPermissions, setfilteredPermissions] = useState([]);
    useEffect(() => {
        (async () => {
            try {
                const res = await RolesService.showPermission();
                setPermissions(res?.permissions || []);
            } catch (error) {
                AntNotification.handleError(error);
            }
        })();
    }, []);
    useEffect(() => {
        setfilteredPermissions(permissions.filter((permission) => permission.guard_name === "api"));
    }, [permissions]);

    const handleGuardNameChange = (e) => {
        e.preventDefault();
        setfilteredPermissions(permissions.filter(permission => permission.guard_name === e.target.value));
    };
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await RolesService.showRole(roleId);
                if (res.status === 200) {
                    setRole(res.role);
                    setSelectPermiss(res.role.permissions.map((permiss) => permiss.id));
                } else {
                    AntNotification.showNotification("Có lỗi xảy ra", res.message, "error");
                    Navigate('/admin/roles');
                }
            } catch (error) {
                AntNotification.handleError(error);
                Navigate('/admin/roles');
            } finally {
                setLoading(false);
            }
        })();
    }, [roleId]);
    const handlePermissChange = (event) => {
        const roleId = parseInt(event.target.value);
        setSelectPermiss((perv) => {
            if (perv.includes(roleId)) {
                return perv.filter((id) => id !== roleId);
            }
            return [...perv, roleId];
        })
    };

    const handSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        if (selectPermiss.length > 0) {
            selectPermiss.forEach(roleId => {
                formData.append('permissions[]', roleId);
            });
        }
        try {
            const res = await RolesService.update(formData, roleId);
            if (res?.status === 200) {
                AntNotification.showNotification("Cập nhật thành công", res.message, "success");
                Navigate('/admin/roles');
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
                            to="/admin/roles"
                            className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                        >
                            Quản lý vai trò
                        </Link>
                    </li>
                    <li>
                        <span className="mx-2 text-neutral-500 dark:text-neutral-400">
                            /
                        </span>
                    </li>
                    <li className="text-neutral-500 dark:text-neutral-400">
                        Cập nhật vai trò
                    </li>
                </ol>
            </nav>
            <div className="bg-white shadow rounded-lg mb-4 p-4 sm:p-6 h-full">
                <div className="flex justify-between items-center my-2">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Cập nhật vai trò
                    </h5>
                </div>
                <form className="mt-5" onSubmit={handSubmit}>
                    <div className="mb-5 lg:w-1/4">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tên vai trò</label>
                        <input type="name" name="name" defaultValue={Role.name} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" />
                    </div>
                    <div className="mb-5 lg:w-1/4">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Guard Name</label>
                        <select name="guard_name" onChange={(e) => handleGuardNameChange(e)} id="" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light">
                            {(Role.guard_name === 'web') ? (
                                <>
                                    <option value="web">web</option>
                                    <option value="api">api</option>
                                </>
                            ) : (
                                <>
                                    <option value="api">api</option>
                                    <option value="web">web</option>
                                </>
                            )}
                        </select>
                    </div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Cấp quyền</label>
                    <div className="grid grid-cols-3 gap-4">

                        {
                            (filteredPermissions.length > 0) ? (
                                filteredPermissions.map((permission) => (
                                    <div key={permission.id} className="flex gap-4 select-none">
                                        <input type="checkbox" checked={selectPermiss.includes(permission.id)}
                                            onChange={handlePermissChange}
                                            className="cursor-pointer" name="permissions[]" value={permission.id} id={permission.id} />
                                        <label className="cursor-pointer" htmlFor={permission.id}>{permission.name}</label>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center">Không có quyền nào</div>
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