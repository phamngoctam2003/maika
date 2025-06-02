import { AdminHeader } from "./adminheader";
import { AdminFooter } from "./adminfooter";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@components/admin/adminsidebar";


export const AdminLayout = () => {
    return (
        <div className="bg-color-root-admin h-screen">
            <AdminHeader />
            <AdminSidebar />
            <Outlet />
            <AdminFooter />
        </div>
    );
};