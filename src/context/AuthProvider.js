import axios from "../api/axios";
import { useState, createContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        if (localStorage.getItem("tokens")) {
            let tokens = JSON.parse(localStorage.getItem("tokens"));
            return tokens?.data?.userModel?.accountModel?.username;
        }
        return null;
    });

    const navigate = useNavigate();
    const login = async (payload) => {
        const apiReponse = await axios.post(axios.defaults.baseURL + `/api/auth/login`, payload);
        if (apiReponse?.data?.status == true) {
            localStorage.setItem("tokens", JSON.stringify(apiReponse.data));
            window.location.href = "/home";
        }
        else {
            if (apiReponse?.data?.message.includes("Tài khoản đã bị khóa!")) {
                toast.error("Tài khoản đã bị khóa. Vui lòng liên hệ với chúng tôi!");
            }
            else if (apiReponse?.data?.message.includes("Tài khoản hoặc mật khẩu không hợp lệ. Vui lòng thử lại")) {
                toast.error("Tài khoản hoặc mật khẩu không chính xác. Vui lòng thử lại!");
            }
            else {
                toast.error(apiReponse?.data?.message);
            }
        }
    };

    const logout = async () => {
        localStorage.removeItem("tokens");
        setUser(null);
        navigate("/login");
    }

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;