import React from "react";
import adminLayout from "../../layout/adminLayout";
import axiosApiInstance from "../../context/interceptor";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";

const ManagerUserPage = () => {

    const [listUser, setListUser] = useState([]);

    async function getAllUser() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/user/all`);
        setListUser(result?.data);
    };

    const handleUnBlock = async (idUser) => {
        const result = await axiosApiInstance.put(axiosApiInstance.defaults.baseURL + `/api/user/unlock/${idUser}`);
        if(result?.data?.status === 200)
        {
            toast.success(result?.data?.message);
            getAllUser();
        }
    };

    const handleBlock = async (idUser) => {
        const result = await axiosApiInstance.put(axiosApiInstance.defaults.baseURL + `/api/user/delete/${idUser}`);
        if(result?.data?.status === 200)
        {
            toast.success(result?.data?.message);
            getAllUser();
        }
    };

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
                    </div>

                    <div className="d-flex text-muted overflow-auto center">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col" className="col-1 col-name">ID</th>
                                    <th scope="col" className="col-2 col-name">Họ và tên</th>
                                    <th scope="col" className="col-2 col-name">Username</th>
                                    <th scope="col" className="col-2 col-name">Email</th>
                                    <th scope="col" className="col-2 col-name">Trạng thái</th>
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
                                            {item.accountModel.activity ?
                                                <button type="button"
                                                    className="btn btn-outline-danger btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                                                    title="Mở khóa"
                                                onClick={() => {handleBlock(item.id);}}
                                                ><i className="fa fa-unlock"
                                                    aria-hidden="true"></i>
                                                </button> :
                                                <button type="button"
                                                    className="btn btn-outline-danger btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                                                    title="Khóa"
                                                    onClick={() => {handleUnBlock(item.id);}}
                                                ><i className="fa fa-lock"
                                                    aria-hidden="true"></i>
                                                </button>
                                            }
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