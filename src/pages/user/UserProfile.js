import React, { useEffect, useState } from "react";
import userLayout from "../../layout/userLayout";
import axiosApiInstance from "../../context/interceptor";
import { toast } from "react-toastify";

const UserProfile = () => {

    const [admin, setAdmin] = useState(null);
    const [updateProfile, setUpdateProfile] = useState({
        firstname: "",
        lastname: "",
    });

    async function getProfile() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/auth/profile`);
        if (result?.data?.status === 200) {
            setAdmin(result?.data?.data);
        }
    };

    const handleUpdateProfile = async (event) => {
        event.preventDefault();
        const result = await axiosApiInstance.put(axiosApiInstance.defaults.baseURL + `/api/auth/profile/update`, updateProfile);
        if(result?.data?.status === 200)
        {
            toast.success("Thay đổi thông tin thành công");
        }
        else
        {
            toast.error("Có lỗi. Vui lòng thử lại");
        }
    }

    useEffect(() => {
        getProfile();
    }, []);

    return (
        <>
            <div className="container py-5" style={{ minWidth: '95%' }}>
                <div className="my-3 p-3 bg-body rounded shadow-sm">
                    <h6 className="border-bottom pb-2 mb-0 mb-3">User Info</h6>
                    <form>
                        <div className="row">
                            <div className="col">
                                <label htmlFor="exampleInputEmail1" className="form-label">Username</label>
                                <div className="input-group mb-3">
                                    <input type="text" className="form-control" placeholder="Username" value={admin?.accountModel?.username} />
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
                                    <input type="text" className="form-control" placeholder="First Name" defaultValue={admin?.firstname} 
                                    onChange={(e) => setUpdateProfile({ ...updateProfile, firstname: e.target.value })} />
                                    <span className="input-group-text" id="basic-addon2"><i className="fa fa-user"></i></span>
                                </div>
                            </div>
                            <div className="col">
                                <label htmlFor="exampleInputEmail1" className="form-label">Last Name</label>
                                <div className="input-group mb-3">
                                    <input type="text" className="form-control" placeholder="Last Name" defaultValue={admin?.lastname} 
                                    onChange={(e) => setUpdateProfile({ ...updateProfile, lastname: e.target.value })} />
                                    <span className="input-group-text" id="basic-addon2"><i className="fa fa-user"></i></span>
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-default" onClick={handleUpdateProfile}>Submit</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default userLayout(UserProfile);