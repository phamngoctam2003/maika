import { UserHeader } from "./userheader";
import { UserFooter } from "./userfooter";
import { Outlet } from "react-router-dom";
import MediaPlayer from "@components/global/audio_player";


export const UserLayout = () => {
    return (
        <div className="bg-color-root">
            <UserHeader />
            <div className="w-full">
                <Outlet />
            </div>
            <UserFooter />
            <MediaPlayer />
        </div>
    );
};