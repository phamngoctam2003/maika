import Sidebar from "@components/user/sidebar";
import SlideCarousel from "../../components/ui/slide_swiper";
import LoginSidebar from "@/components/auth/loginsidebar";


export const UserHome = () => {

  return (
    <>
      <SlideCarousel />

      <h1 className="text-cyan-100">
        Hello world!
      </h1>
    </>
  );
}   