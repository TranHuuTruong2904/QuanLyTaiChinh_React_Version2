import React from "react";
import adminLayout from "../../layout/adminLayout";
import { useState } from "react";
import axiosApiInstance from "../../context/interceptor";
import { useEffect } from "react";

const AdminProfile = () => {

    const [admin, setAdmin] = useState(null);
    
    async function getProfile() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/auth/profile`);
        if(result?.data?.status === 200)
        {
            setAdmin(result?.data?.data);
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    return (
        <>
            <div className="d-flex justify-content-center">
                <div className="table-container" style={{ minWidth: '90%' }}>
                    <div className="my-3 p-3 bg-body rounded shadow-sm">
                        <h6 className="border-bottom pb-2 mb-0 mb-3">Admin Info</h6>
                        <form>
                            <div className="row">
                                <div className="col">
                                    <label htmlFor="exampleInputEmail1" className="form-label">Username</label>
                                    <div className="input-group mb-3">
                                        <input type="text" className="form-control" placeholder="Username" value={admin?.accountModel?.username}/>
                                        <span className="input-group-text" id="basic-addon2"><i className="fa fa-user"></i></span>
                                    </div>
                                </div>
                                <div className="col">
                                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                                    <div className="input-group mb-3">
                                        <input type="text" className="form-control" placeholder="Email Address" value={admin?.accountModel?.email} />
                                        <span className="input-group-text" id="basic-addon2">@</span>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <label htmlFor="exampleInputEmail1" className="form-label">First Name</label>
                                    <div className="input-group mb-3">
                                        <input type="text" className="form-control" placeholder="First Name" value={admin?.firstname} />
                                        <span className="input-group-text" id="basic-addon2"><i className="fa fa-user"></i></span>
                                    </div>
                                </div>
                                <div className="col">
                                    <label htmlFor="exampleInputEmail1" className="form-label">Last Name</label>
                                    <div className="input-group mb-3">
                                        <input type="text" className="form-control" placeholder="Last Name" value={admin?.lastname} />
                                        <span className="input-group-text" id="basic-addon2"><i className="fa fa-user"></i></span>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-default">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default adminLayout(AdminProfile);