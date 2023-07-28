import React from "react";
import adminLayout from "../../layout/adminLayout";
import axiosApiInstance from "../../context/interceptor";
import { useState } from "react";
import { useEffect } from "react";

const ManagerUserPage = () => {

    const [listUser, setListUser] = useState([]);

    async function getAllUser() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/user/all`);
        setListUser(result?.data);
    }

    useEffect(() => {
        getAllUser();
    }, []);

    return (
        <>
            <div className="d-flex justify-content-center">
                <div className="table-container" style={{ minWidth: '95%' }}>
                    <div className="row">
                        <div className="col">
                            <h4 className="pb-2 mb-0">Danh sách người dùng</h4>
                        </div>
                        <div className="col text-right">
                            <button className="btn btn-default low-height-btn" title="Thêm">
                                Thêm <i className="fa fa-plus"></i>
                            </button>
                        </div>
                    </div>

                    <div className="d-flex text-muted overflow-auto center">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col" className="col-1 col-name">ID</th>
                                    <th scope="col" className="col-3 col-name">Họ và tên</th>
                                    <th scope="col" className="col-2 col-name">Username</th>
                                    <th scope="col" className="col-2 col-name">Email</th>
                                    <th scope="col" className="col-1 col-name">Trạng thái</th>
                                    <th scope="col" className="col-1 col-name">Tác vụ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listUser.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.firstname} {item.lastname}</td>
                                        <td>{item.accountModel.username}</td>
                                        <td>{item.accountModel.email}</td>
                                        <td>{item.accountModel.activity ? "Hoạt động" : "Khóa"}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>
                                            {/* <button type="button"
                                                className="btn btn-outline-warning btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                                                title={item.name} id={item.id} onClick={handleInfo}
                                            >
                                                <FaPen />
                                            </button>

                                            <button type="button" id={item.id}
                                                className="btn btn-outline-danger btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                                                title="Xóa" onClick={handleDelete}><FaTrashAlt />
                                            </button> */}
                                        </td>
                                    </tr>))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default adminLayout(ManagerUserPage);