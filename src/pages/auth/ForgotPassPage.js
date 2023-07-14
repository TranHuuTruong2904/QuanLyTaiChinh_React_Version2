import React from "react";
import { Link } from "react-router-dom";

const ForgotPassPage = () => {

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
                                <h1>Quên mật khẩu?</h1>
                            </div>
                            <div className="form-content">
                                <form
                                //   onSubmit={handleSubmit}
                                >
                                    <div className="form-group">
                                        <label htmlFor="email">Email:</label>
                                        <input type="email" id="email" required />
                                    </div>
                                    <div className="form-group">
                                        <button variant="primary" type="submit" className="btn-submit">
                                            Gửi mã
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

export default ForgotPassPage;