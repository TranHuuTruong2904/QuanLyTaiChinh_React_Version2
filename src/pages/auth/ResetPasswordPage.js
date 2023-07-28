import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../api/axios";
import axiosApiInstance from "../../context/interceptor";

const ResetPasswordPage = () => {

    const location = useLocation();
    const {email} = location.state || {};
    console.log(email)

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (event.target.elements.newPass.value !==
            event.target.elements.newPassRepeat.value) {
            toast.error("Xác nhận mật khẩu không khớp!");
            return;
        }

        const payload = {
            email : email,
            newPassword : event.target.elements.newPass.value,
        };

        const result = await axios.post(axiosApiInstance.defaults.baseURL + `/api/auth/reset-password`, payload);
        if(result?.data?.status === 200)
        {
            toast.success("Cấp lại mật khẩu thành công!");
            navigate("/login");
        }
        else
        {
            toast.error(result?.data?.message);
        }
    }

    return(
        <>
            <div>
                <nav className="nav-login">
                    <h1 className="nav-login-icon">
                        <i className='fa fa-coins'></i>
                        FINANCIAL MANAGEMENT
                    </h1>
                </nav>
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
                                        <label htmlFor="newPass">Nhập mật khẩu mới:</label>
                                        <input type="password" id="newPass" required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="newPassRepeat">Nhập lại mật khẩu mới:</label>
                                        <input type="password" id="newPassRepeat" required />
                                    </div>
                                    <div className="form-group">
                                        <button variant="primary" type="submit" className="btn-submit">
                                            Cập nhật mật khẩu
                                        </button>
                                    </div>
                                    <p className="form-group text">
                                        Bạn muốn đăng nhập?
                                        <Link className="form-recovery link-item" to="/login">
                                            {" "}
                                            Đăng nhập
                                        </Link>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResetPasswordPage;