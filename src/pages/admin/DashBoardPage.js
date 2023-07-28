import React, { useEffect, useState } from "react";
import adminLayout from "../../layout/adminLayout";
import axiosApiInstance from "../../context/interceptor";

const DashboardPage = () => {

    const [listUser, setListUser] = useState([]);
    const [listCategoryType, setListCategoryType] = useState([]);
    const [listTransactionType, setListTransactionType] = useState([]);

    async function getAllUser() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/user/all`);
        setListUser(result?.data);
    }

    async function getAllTransactionType() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/transaction-type/all`);
        if (result?.data?.status === 200) {
            setListTransactionType(result?.data?.data);
        }
    }

    async function getAllCategoryType() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/category/all`);
        if (result?.data?.status === 200) {
            setListCategoryType(result?.data?.data);
        }
    }

    useEffect(() => {
        getAllUser();
        getAllTransactionType();
        getAllCategoryType();
    }, []);

    return (
        <>
            <div className="d-flex justify-content-center">
                <div className="table-container" style={{ minWidth: '90%' }}>
                    <div className="row g-3 my-2">
                        <div className="col-md-4">
                            <div className="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
                                <div>
                                    <h3 className="fs-2">{listCategoryType.length}</h3>
                                    <p className="fs-5">Catrgories Type</p>
                                </div>
                                <i className="fa fa-tags p-3 fs-1"></i>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
                                <div>
                                    <h3 className="fs-2">{listTransactionType.length}</h3>
                                    <p className="fs-5">Transactions Type</p>
                                </div>
                                <i className="fa fa-money-bill p-3 fs-1"></i>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
                                <div>
                                    <h3 className="fs-2">{listUser.length}</h3>
                                    <p className="fs-5">Users</p>
                                </div>
                                <i className="fa fa-user-circle p-3 fs-1"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default adminLayout(DashboardPage);