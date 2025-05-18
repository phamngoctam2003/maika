import { UserHeader } from "./userheader";
import { UserFooter } from "./userfooter";
import { Outlet } from "react-router-dom";


export const UserLayout = () => {
    return (
        <div className="bg-color-root">
            <UserHeader />
            <Outlet />
            <UserFooter />
        </div>
    );
};