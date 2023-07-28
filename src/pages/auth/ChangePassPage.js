import React from "react";
import userLayout from "../../layout/userLayout";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosApiInstance from "../../context/interceptor";
import { useContext } from "react";
import AuthContext from "../../context/AuthProvider";

const ChangePassPage = () => {
    const { logout } = useContext(AuthContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (event.target.elements.newPass.value !==
            event.target.elements.newPassRepeat.value) {
            toast.error("Xác nhận mật khẩu không khớp!");
            return;
        }
        const payload = {
            password: event.target.elements.pass.value,
            newPassword: event.target.elements.newPass.value,
        };
        try {
            const result = await axiosApiInstance.put(axiosApiInstance.defaults.baseURL + `/api/auth/change-password`, payload);
            if (result?.data?.status === 101) {
                toast.error(result?.data?.message);
            }
            else {
                toast.success(result?.data?.message);
                logout();
            }
        }
        catch {
            toast.error("Có lỗi hệ thống. Vui lòng thử lại!");
        }
    }

    return (
        <>
            <div>
                <div className="bg">
                    <div className="form">
                        <div className="form-toggle"></div>
                        <div className="form-panel one">
                            <div className="form-header">
                                <h1>Đặt lại mật khẩu</h1>
                            </div>
                            <div className="form-content">
                                <form
                                    onSubmit={handleSubmit}
                                >
                                    <div className="form-group">
                                        <label htmlFor="newPass">Nhập mật khẩu cũ</label>
                                        <input type="password" id="pass" required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="newPass">Nhập mật khẩu mới</label>
                                        <input type="password" id="newPass" required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="newPassRepeat">Nhập lại mật khẩu mới</label>
                                        <input type="password" id="newPassRepeat" required />
                                    </div>
                                    <div className="form-group">
                                        <button variant="primary" type="submit" className="btn-submit">
                                            Cập nhật mật khẩu
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default userLayout(ChangePassPage);