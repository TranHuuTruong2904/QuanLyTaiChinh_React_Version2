import React, {useState} from "react";
import '../../assets/css/user-header.css'
import { Link, NavLink } from "react-router-dom";
import Dropdown from "./dropdown";

const UserHeader = () => {

    const [click, setClick] = useState(false);
    const [dropdown, setDropdown] = useState(false);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const onMouseEnter = () => {
        if (window.innerWidth < 960)
        {
            setDropdown(false);
        }
        else{
            setDropdown(true);
        }
    }

    const onMouseLeave = () => {
        if(window.innerWidth < 960)
        {
            setDropdown(false);
        }
        else{
            setDropdown(false);
        }
    }

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
                        <NavLink to="/category" activeClassName="active"  className="nav-links" onClick={closeMobileMenu}>
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
                        <Link to="/profile" className="nav-links" onClick={closeMobileMenu}>
                            Cài đặt <i className='fas fa-caret-down' />
                        </Link>
                        {dropdown && <Dropdown />}
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default UserHeader;