import { FaBars, FaTh, FaArrowLeft, FaPaintBrush } from 'react-icons/fa';
import '../../assets/css/admin-sidebar.css'
import { NavLink } from "react-router-dom";
import { useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthProvider';

const Sidebar = ({ isActive, toggleSidebar }) => {

    const [isOpen, setIsOpen] = useState(true);

    const toggle = () => {
        setIsOpen(!isOpen);
        toggleSidebar();
    };

    const { logout } = useContext(AuthContext);

    const sidebarItems = [
        {
            icon: <FaTh />,
            path: "/home",
            name: "Dashboard",
        },
        {
            icon: <i className="fa fa-user-circle"></i>,
            path: "/user",
            name: "QL Người dùng",
        },
        {
            icon: <i className="fa fa-list"></i>,
            path: "/category",
            name: "QL danh mục",
        },
        {
            icon: <i className="fa fa-money-bill "></i>,
            path: "/transaction-type",
            name: "QL loại giao dịch",
        },
    ]

    return (
        <>
            <div className="container-sidebar">
                <div style={{ width: isOpen ? "250px" : "50px" }} className="sidebar-admin">
                    <div className="top-section">
                        <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">FINANCE</h1>
                        <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className="bars">
                            <FaBars onClick={toggle} />
                        </div>
                    </div>
                    {sidebarItems.map((item, index) => (
                        <NavLink to={item.path} key={index} className="link" activeClassName='active'>
                            <div className="icon">{item.icon}</div>
                            <div style={{ display: isOpen ? "block" : "none" }} className="link-text">{item.name}</div>
                        </NavLink>
                    ))}
                    <div className='bottom-section' style={{ width: isOpen ? "250px" : "50px" }}>
                        <NavLink to="/profile" className="link" activeClassName='active'>
                            <div className='icon'><FaPaintBrush /></div>
                            <div style={{ display: isOpen ? "block" : "none" }} className="link-text">Hồ sơ</div>
                        </NavLink>
                        <a onClick={() => logout()} className="link">
                            <div className='icon'><FaArrowLeft /></div>
                            <div style={{ display: isOpen ? "block" : "none" }} className="link-text">Đăng xuất</div>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Sidebar