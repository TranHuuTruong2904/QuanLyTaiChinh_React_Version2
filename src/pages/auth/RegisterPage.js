import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import axiosApiInstance from "../../context/interceptor";

const RegisterPage = () => {

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (event.target.elements.password.value !==
            event.target.elements.passwordRepeat.value) {
            toast.error("Xác nhận mật khẩu không khớp!");
            return;
        }
        const payload = {
            userName: event.target.elements.username.value,
            passWord: event.target.elements.password.value,
            firstname: event.target.elements.firstName.value,
            lastname: event.target.elements.lastName.value,
            email: event.target.elements.email.value,
            roleName: "USER",
        };

        const result = await axios.post(
            axiosApiInstance.defaults.baseURL + "/api/auth/register",
            payload
        );
        if (result.data.status) {
            toast.success("Tạo tài khoản thành công");
            navigate("/login");
        } else toast.error(result.data.message);
    };

    useEffect(() => {
    }, []);


    return (
        <>
            <div>
                <nav className="nav-login">
                    <h1 className="nav-login-icon">
                        <i className='fa fa-coins'></i>
                        FINANCIAL MANAGEMENT
                    </h1>
                </nav>
                <div class="bg">
                    <div class="img"></div>
                    <div class="formdk">
                        <div class="form-toggle"></div>
                        <div class="form-panelDK one">
                            <div class="form-header">
                                <h1>Đăng Ký</h1>
                            </div>
                            <div class="form-content">
                                <form
                                onSubmit={handleSubmit}
                                >
                                    <div className="row form-group">
                                        <div className="col-md-6">
                                            <label htmlFor="">Họ Đệm</label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                name="firstName"
                                                required="required"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="lastName">Tên</label>
                                            <input
                                                type="lastName"
                                                id="lastName"
                                                name=""
                                                required="required"
                                            />
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label for="email">Tên đăng nhập</label>
                                        <input
                                            type="username"
                                            id="username"
                                            name="username"
                                            required="required"
                                        />
                                    </div>
                                    <div class="form-group">
                                        <label for="email">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required="required"
                                        />
                                    </div>
                                    <div class="row form-group">
                                        <div class="col-md-6">
                                            <label for="password">Mật Khẩu</label>
                                            <input
                                                type="password"
                                                id="password"
                                                name="password"
                                                required="required"
                                            />
                                        </div>
                                        <div class="col-md-6">
                                            <label for="password">Xác Nhận Mật Khẩu</label>
                                            <input
                                                type="password"
                                                id="passwordRepeat"
                                                name="passwordRepeat"
                                                required="required"
                                            />
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <button type="submit" className="btn-submit">Đăng Ký</button>
                                    </div>
                                    <p class="form-group text">
                                        Bạn đã có tài khoản?
                                        <Link class="form-recovery link-item" to="/login">
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

export default RegisterPage;