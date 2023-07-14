import React, {useState, useContext} from "react";
import '../../assets/css/dropdown.css'
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthProvider";

function Dropdown() {
    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);

    const {logout} = useContext(AuthContext);
    const SettingItems = [
        {
          title: 'Hồ sơ',
          path: '/profile',
          cName: 'dropdown-link'
        },
        {
          title: 'Đổi mật khẩu',
          path: '/change-password',
          cName: 'dropdown-link'
        }
      ];

    return (
        <>
            <ul onClick={handleClick} className={click ? 'dropdown-menu-admin clicked' : 'dropdown-menu-admin'}>
                {SettingItems.map((item, index) => {
                    return (
                        <li key={index}>
                            <Link className={item.cName} to={item.path} onClick={() => setClick(false)}>
                                {item.title}
                            </Link>
                        </li>
                    );
                })}
                <a onClick={() => logout()} className="link-logout">
                            <div>Đăng xuất</div>
                        </a>
            </ul>
            
        </>
    )
}

export default Dropdown