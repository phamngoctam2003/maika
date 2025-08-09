import { UserHeader } from "./userheader";
import { UserFooter } from "./userfooter";
import { Outlet } from "react-router-dom";
import MediaPlayer from "@components/global/audio_player";
import ModalSupport from "@components/modal/modal_support";



export const UserLayout = () => {
    return (
        <div className="bg-color-root">
            <UserHeader />
            <div className="w-full">
                <Outlet />
            </div>
            <UserFooter />
            <MediaPlayer />
            <ModalSupport />
        </div>
    );
};