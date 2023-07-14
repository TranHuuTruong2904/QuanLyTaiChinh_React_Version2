import axios from "../api/axios";
import {toast } from "react-toastify";

const axiosApiInstance = axios.create({});

axiosApiInstance.interceptors.request.use((config) => {
    let tokenData = JSON.parse(localStorage.getItem("tokens"));
    if(tokenData === null)
    {
        localStorage.clear();
        toast.info("Vui lòng đăng nhập để tiếp tục!", {autoClose: 5000});
        window.location.href = "/login"
    } 
    config.headers = {
        Authorization: `Bearer ${tokenData?.accessToken}`,
        Accept: "application/json",
      "Content-Type": "application/json"
    };
    return config;
});

export default axiosApiInstance;
