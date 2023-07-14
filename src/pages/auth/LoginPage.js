import React, { useContext, useRef } from "react";
import AuthContext from "../../context/AuthProvider";
import { Link } from "react-router-dom";
import '../../assets/css/login.css'
import '../../assets/css/user-view.css'

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
        </>
    );
};

export default LoginPage;