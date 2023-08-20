import React, { useEffect, useState } from "react";
import '../../assets/css/user-header.css'
import { Link, NavLink } from "react-router-dom";
import Dropdown from "./dropdown";
import axiosApiInstance from "../../context/interceptor";
import '../../assets/css/notification.css'

const UserHeader = () => {

    const [click, setClick] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const [listNotification, setListNotification] = useState([]);
    const [showNotification, setShowNotification] = useState(false);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const onMouseEnter = () => {
        if (window.innerWidth < 960) {
            setDropdown(false);
        }
        else {
            setDropdown(true);
        }
    };

    const onMouseLeave = () => {
        if (window.innerWidth < 960) {
            setDropdown(false);
        }
        else {
            setDropdown(false);
        }
    };

    async function handleClickNotifi() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/notification/all`);
        if (result?.data?.status === 101) {
            setShowNotification(!showNotification);
        }
        else {
            setListNotification(result?.data?.data);
            setShowNotification(!showNotification);
        }
    };

    const handleMouseEnter = (id) => {
        const updatedNotifications = listNotification.map((n) =>
            n.id === id ? { ...n, hovered: true } : n
        );
        setListNotification(updatedNotifications);
    };

    const handleMouseLeave = (id) => {
        const updatedNotifications = listNotification.map((n) =>
            n.id === id ? { ...n, hovered: false } : n
        );
        setListNotification(updatedNotifications);
    };

    useEffect(() => {
        handleClickNotifi();
    }, []);

    return (
        <>
            <nav class="navbar header nav-light navbar-expand-lg navbar-light shadow fixed-top">
                <Link to="/home" className="navbar-logo" onClick={closeMobileMenu}>
                    <i className='fa fa-coins'></i>
                    FINANCE
                </Link>
                <div className='menu-icon' onClick={handleClick}>
                    <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
                </div>
                <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                    <li className="nav-item">
                        <NavLink to="/home" activeClassName="active" className="nav-links" onClick={closeMobileMenu}>
                            Trang chủ
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/category" activeClassName="active" className="nav-links" onClick={closeMobileMenu}>
                            Danh mục
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/budget" activeClassName="active" className="nav-links" onClick={closeMobileMenu}>
                            Ngân sách
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/goal" activeClassName="active" className="nav-links" onClick={closeMobileMenu}>
                            Mục tiêu
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/transaction" activeClassName="active" className="nav-links" onClick={closeMobileMenu}>
                            Giao dịch
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/statistical" activeClassName="active" className="nav-links" onClick={closeMobileMenu}>
                            Thống kê
                        </NavLink>
                    </li>
                    <li className="nav-item"
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}>
                        <Link to="/profile" activeClassName="active" className="nav-links" onClick={closeMobileMenu}>
                            Cài đặt <i className='fas fa-caret-down' />
                        </Link>
                        {dropdown && <Dropdown />}
                    </li>
                </ul>
                <div className="">
                    <button onClick={handleClickNotifi}>
                        <i className="fa fa-bell"></i>
                        {!!listNotification.length && (
                            <span className="notification-count">
                                {listNotification.length}
                            </span>
                        )}
                        {!showNotification && (
                            <div className="notification-box">
                                <h4
                                    style={{
                                        marginTop: "10px",
                                        marginBottom: "20px",
                                        colors: "red",
                                    }}
                                >
                                    Thông báo
                                </h4>
                                {listNotification.length === 0 ? (
                                    <p>Không có thông báo mới.</p>
                                ) : (
                                    <p>
                                        {listNotification.map((notification) => (
                                            <div
                                                className="notification-item"
                                                key={notification.id}
                                                // onClick={() =>
                                                //     handleNotificationClick(notification.id)
                                                // }
                                                onMouseEnter={() => handleMouseEnter(notification.id)}
                                                onMouseLeave={() => handleMouseLeave(notification.id)}
                                            >
                                                <div key={notification.id}>
                                                    <p>
                                                        {notification.detail} --- Time:{" "}
                                                        {new Date(
                                                            notification.date
                                                        ).toLocaleDateString("en-GB")}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </p>
                                )}
                            </div>
                        )}
                    </button>
                </div>
            </nav>
        </>
    )
}

export default UserHeader;