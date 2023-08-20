import React, { useContext, useRef } from "react";
import AuthContext from "../../context/AuthProvider";
import { Link } from "react-router-dom";
import '../../assets/css/login.css'
import '../../assets/css/user-view.css'
import { FaFacebook } from "react-icons/fa";

const LoginPage = () => {
    const userName = useRef("");
    const password = useRef("");
    const { login } = useContext(AuthContext)

    const loginSubmit = async (e) => {
        e.preventDefault();
        let payload = {
            username: userName.current.value,
            password: password.current.value,
        };
        await login(payload);
    };

    return (
        <>
            <div>
                <nav className="nav-login shadow">
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
                                <h1>Đăng nhập</h1>
                            </div>
                            <div className="form-content">
                                <form onSubmit={loginSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="username">Tên đăng nhập</label>
                                        <input type="text" id="username" ref={userName} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Mật Khẩu</label>
                                        <input
                                            type="password"
                                            id="password"
                                            ref={password}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-remember">
                                            <input type="checkbox" />
                                            Nhớ tài khoản
                                        </label>
                                        <Link className="form-recovery link-item" to="/forgot-pass">
                                            Quên mật khẩu?
                                        </Link>
                                    </div>
                                    <div className="form-group">
                                        <button variant="primary" type="submit" className="btn-submit">
                                            Đăng nhập
                                        </button>
                                    </div>
                                    <p className="form-group text">
                                        Bạn chưa có tài khoản?
                                        <Link className="form-recovery link-item" to="/register">
                                            {" "}
                                            Đăng ký
                                        </Link>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <footer id="footer" className="">
                    <footer className="bg-light fixed-bottom" id="tempaltemo_footer">
                        <div className="container footer-center">
                            <div className="row">
                                <div className="col-md-4 pt-5">
                                    <h3 className="h3 fw-bolder text-dark border-bottom pb-3 border-light">
                                        Thông tin liên hệ:
                                    </h3>
                                    <p className="text-dark">
                                        Email : tranhuutruong290401@gmail.com
                                    </p>
                                    <p className="text-dark">Số điện thoại : 0987654321</p>
                                </div>

                                <div className="col-md-2 pt-5">
                                    <h3 className="h3 fw-bolder text-dark border-bottom pb-3 border-light">
                                        Fanpage
                                    </h3>
                                    <a
                                        className="btn bg-primary btn-floating m-1"
                                        href="https://www.facebook.com/profile.php?id=100091576287029&sk=photos"
                                        role="button"
                                    >
                                        <FaFacebook />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </footer>
                </footer>
            </div>
        </>
    );
};

export default LoginPage;