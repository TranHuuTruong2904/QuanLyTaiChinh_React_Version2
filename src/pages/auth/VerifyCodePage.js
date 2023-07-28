import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../api/axios";
import axiosApiInstance from "../../context/interceptor";
import { useEffect } from "react";

const VerifyCodePage = () => {

    const location = useLocation();
    const {email} = location.state || {};
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const payload = {
            emailRequest : email,
            code: event.target.elements.code.value,
        };
        console.log(payload+ "1234");
        const result = await axios.post(axiosApiInstance.defaults.baseURL + `/api/auth/verify-code`, payload);
        if(result?.data?.status === 101)
        {
            toast.error(result?.data?.message);
        }
        else
        {
            toast.success("Xác nhận thành công!");
            navigate("/reset-pass", { state: { email: email } });
        }
    }

    useEffect(() => {

    }, [])
    

    return (
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
                                <h1>Mã xác thực lấy lại mật khẩu?</h1>
                            </div>
                            <div className="form-content">
                                <form
                                  onSubmit={handleSubmit}
                                >
                                    <div className="form-group">
                                        <label htmlFor="code">Nhập mã xác thực:</label>
                                        <input type="text" id="code" required />
                                    </div>
                                    <div className="form-group">
                                        <button variant="primary" type="submit" className="btn-submit">
                                            Xác nhận
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
};

export default VerifyCodePage;