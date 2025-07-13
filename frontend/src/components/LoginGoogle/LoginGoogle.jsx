import { useGoogleLogin } from "@react-oauth/google";
import { AuthService } from "../../services/api-auth";
import { message } from "antd";

export const LoginGoogle = ({ onSuccess, setLoading, logoGoogle }) => {
    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                setLoading(true);
                const response = await AuthService.Login_Google(tokenResponse.access_token);
                // localStorage.setItem("refreshToken", response.refresh_token);
                onSuccess(response);
            } catch (error) {
                console.error("Login failed:", error);
                message.error("Đăng nhập thất bại, vui lòng thử lại sau");
            } finally {
                setLoading(false);
            }
        },
        onError: (error) => {
            console.error("Login failed:", error);
            message.error("Đăng nhập thất bại, vui lòng thử lại sau");
        },
        flow: "implicit",
    })
    const handleLogin = (e) => {
        e.preventDefault();
        e.stopPropagation();
        login();
    };

    return (
        <button 
            type="button"
            onClick={handleLogin} 
            className='flex items-center justify-center w-full h-full cursor-pointer bg-transparent border-none p-0'
        >
            {logoGoogle ? (
                logoGoogle
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mr-2">
                    <path d="M21.35 11.1H12v2h5.59c-.24 1.26-.96 2.33-2.04 3.05l3.03 2.36c1.77-1.63 2.81-4 2.81-6.41 0-5.52-4.48-10-10-10S2 5.48 2 11s4.48 10 10 10c5.04 0 9.22-3.73 9.95-8.64l-3.6-1z"></path>
                </svg>
            )}
        </button>
    );
}