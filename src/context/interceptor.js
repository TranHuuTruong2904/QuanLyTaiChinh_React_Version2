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

axiosApiInstance.interceptors.response.use(
    response  => response,
    async (error) => {
      if (error.response.status === 401) {
        toast.error("Access Token đã hết hạn")
        const authData = JSON.parse(localStorage.getItem("tokens"));
        console.log(authData.data.refreshToken);
       if(authData.data.refreshToken){
         let apiResponse = await axios.get(
             axios.defaults.baseURL + `/api/auth/refresh/${authData.data.refreshToken}`
         );
         if(apiResponse.data.data.status && apiResponse){
           localStorage.setItem("tokens", JSON.stringify(apiResponse.data));
           error.config.headers = {
             'Authorization': `Bearer ${apiResponse.data.accessToken}`
           }
           window.location.reload()
         }
         else {
           localStorage.clear()
           window.location.href = "/login";
           toast.error("Token đã hết hạn. Vui lòng đăng nhập lại")
         }
       }
        /*error.config.headers[
          "Authorization"
        ] = `Bearer ${apiResponse.data.accessToken}`;*/
        //return axios(error.config);
      } else {
        return Promise.reject(error);
      }
    }
);

export default axiosApiInstance;
