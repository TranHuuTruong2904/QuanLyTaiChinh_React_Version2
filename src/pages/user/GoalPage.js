import React, { useState } from "react";
import userLayout from "../../layout/userLayout";
import ReactLoading from "react-loading"
import axiosApiInstance from "../../context/interceptor";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { FaPen, FaTrashAlt, FaListOl, FaPlusCircle, FaSearch } from "react-icons/fa";
import { Progress, Modal, Input, Form, DatePicker, Pagination } from "antd";

const GoalPage = () => {

    const [load, setLoad] = useState(false);
    const [listGoal, setListGoal] = useState([]);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [deposit, setDeposit] = useState();
    const [change, setChange] = useState(false);
    const [newGoal, setNewGoal] = useState({
        name: "",
        amount: "",
        deadline: "",
    });

    const [pageSize, setPageSize] = useState(8);
    const [currentPage, setCurrentPage] = useState(1);
    const paginate = (array, pageNumber, pageSize) => {
        const startIndex = (pageNumber - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return array.slice(startIndex, endIndex);
    };
    const currentGoalList = paginate(listGoal, currentPage, pageSize);
    const handlePageChange = (pageNumber, pageSize) => {
        setCurrentPage(pageNumber);
    };
    const handleDatePickerChange = (date) => {
        setNewGoal({ ...newGoal, deadline: date });
    };

    const handleDatePickerChangeSelectedGoal = (date) => {
        setSelectedGoal({ ...selectedGoal, deadline: date });
    }

    async function getGoal() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/goal/all`);
        setLoad(true);
        if (result?.data?.status === 101) {
            toast.success(result?.data?.message);
        }
        else {
            setListGoal(result?.data?.data);
        }
    }

    const [isModalProgressOpen, setIsModalProgressOpen] = useState(false);
    const [isModalAddDeposit, setIsModalAddDeposit] = useState(false);
    const [isModalAddGoal, setIsModalAddGoal] = useState(false);
    const [isModalUpdateGoal, setIsModelUpdateGoal] = useState(false);
    const [isModalDeleteGoal, setIsModalDeleteGoal] = useState(false);

    const [form] = Form.useForm();

    const openModalWithGoal = (item) => {
        setSelectedGoal(item);
        setIsModelUpdateGoal(true);
        form.setFieldsValue({
            name: item?.name || '',
            amount: item?.amount || 0,
        });
    };

    const handleOk = () => {
        setIsModalProgressOpen(false);
    };

    const handleCancel = () => {
        setIsModalProgressOpen(false);
        setIsModalAddDeposit(false);
        setIsModalAddGoal(false);
        setIsModelUpdateGoal(false);
        setIsModalDeleteGoal(false);
    };

    const handleAddDeposit = async (e) => {
        e.preventDefault();
        const payload = {
            deposit: deposit,
        };
        try {
            const result = await axiosApiInstance.post(
                axiosApiInstance.defaults.baseURL + `/api/goal/add-deposit/${selectedGoal?.id}`,
                payload
            );
            if (result?.data?.status === 200) {
                toast.success(result?.data?.message);
                setChange(!change);
                setIsModalAddDeposit(false);
            } else {
                toast.error(result?.data?.message);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra trong quá trình xử lý');
        }
    }

    const handleAddGoal = async () => {
        try {
            const result = await axiosApiInstance.post(axiosApiInstance.defaults.baseURL + `/api/goal/add`, newGoal);
            if (result?.data?.message.includes("Mục tiêu với mốc thời gian đã được đặt ra")) {
                toast.error(result?.data?.message);
            }
            else if (result?.data?.message.includes("Mốc thời gian đặt ra mục tiêu phải lớn hơn ngaày hiện tại!")) {
                toast.error(result?.data?.message);
            }
            else {
                toast.success("Thêm mục tiêu thành công!");
                setChange(!change);
                setIsModalAddGoal(false);
            }
        }
        catch (error) {
            toast.error("Có lỗi. Vui lòng thử lại");
        }
    };

    const handleUpdateGoal = async () => {
        try {
            const payload = {
                name: selectedGoal.name,
                amount: selectedGoal.amount,
                deadline: selectedGoal.deadline,
            }
            const result = await axiosApiInstance.put(axiosApiInstance.defaults.baseURL + `/api/goal/update/${selectedGoal?.id}`, payload);
            if (result?.data?.message.includes("Mục tiêu với mốc thời gian đã được đặt ra")) {
                toast.error(result?.data?.message);
            }
            else if (result?.data?.message.includes("Mốc thời gian đặt ra mục tiêu phải lớn hơn ngaày hiện tại!")) {
                toast.error(result?.data?.message);
            }
            else {
                toast.success("Sửa mục tiêu thành công!");
                setChange(!change);
                setIsModelUpdateGoal(false);
            }
        }
        catch (error) {
            toast.error("Xảy ra lỗi. Vui lòng thử lại!");
        }
    }

    async function deleteGoal() {
        try {
            const result = await axiosApiInstance.delete(axiosApiInstance.defaults.baseURL + `/api/goal/delete/${selectedGoal?.id}`);
            if (result?.data?.status === 200) {
                toast.success("Xóa mục tiêu thành công");
                setChange(!change);
                setIsModalDeleteGoal(false);
            }
        }
        catch (error) {
            toast.error("Có lỗi xảy ra. Vui lòng thử lại");
        }
    }

    useEffect(() => {
        getGoal();
    }, [change]);

    return (
        <>
            {load ?
                <div className="container py-5" style={{ minWidth: '95%' }}>
                    <div className="justify-content-center">
                        <div className="row">
                            <div className="col text-left">
                                <Input
                                    style={{ width: "200px" }}
                                    size="small"
                                    placeholder="Tìm mục tiêu"
                                    prefix={<FaSearch />}
                                />
                            </div>
                            <div className="col text-center">
                                <h4 className="pb-2 mb-0">Danh sách mục tiêu</h4>
                            </div>
                            <div className="col text-right">
                                <button className="btn btn-default low-height-btn" title="Thêm" onClick={() => { setIsModalAddGoal(true) }}>
                                    Thêm <i className="fa fa-plus"></i>
                                </button>
                            </div>
                        </div>
                        <div className="d-flex text-muted overflow-auto center">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col" className="col-2 col-name">Tên mục tiêu</th>
                                        <th scope="col" className="col-1 col-name">Mục tiêu</th>
                                        <th scope="col" className="col-1 col-name">Đến ngày</th>
                                        <th scope="col" className="col-2 col-name">Theo dõi</th>
                                        <th scope="col" className="col-1 col-name">Trạng thái</th>
                                        <th scope="col" className="col-1 col-name">Tùy chọn</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentGoalList.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td>{item.amount?.toLocaleString("vi", {
                                                style: "currency",
                                                currency: "VND",
                                            })}</td>
                                            <td>{new Date(item.deadline).toLocaleDateString(
                                                "en-GB"
                                            )}</td>
                                            <td><Progress percent={((item.totalDeposit / item.amount) * 100).toFixed(2)} ></Progress></td>
                                            <td>{item.status}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                <button type="button" id={item.id}
                                                    className="btn btn-outline-success btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                                                    title="Xem chi tiết" onClick={() => {
                                                        setSelectedGoal(item);
                                                        setIsModalProgressOpen(true);
                                                    }}><FaListOl />
                                                </button>
                                                <button type="button" id={item.id}
                                                    className="btn btn-outline-primary btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                                                    title="Thêm tiền" onClick={() => {
                                                        setSelectedGoal(item);
                                                        setIsModalAddDeposit(true);
                                                    }}><FaPlusCircle />
                                                </button>
                                                <button type="button"
                                                    className="btn btn-outline-warning btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                                                    title="Chỉnh sửa" id={item.id} onClick={() => {
                                                        openModalWithGoal(item);
                                                    }}>
                                                    <FaPen /></button>
                                                <button type="button" id={item.id}
                                                    className="btn btn-outline-danger btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                                                    title="Xóa" onClick={() => {
                                                        setSelectedGoal(item);
                                                        setIsModalDeleteGoal(true);
                                                    }}><FaTrashAlt />
                                                </button>
                                            </td>
                                        </tr>))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            onChange={handlePageChange}
                            current={currentPage}
                            pageSize={pageSize}
                            total={listGoal.length}
                        />
                    </div>
                </div>
                :
                <div className={"center loading"}>
                    <ReactLoading type={'cylon'} color='#fffff' height={'33px'} width={'9%'} />
                </div>
            }

            <Modal title="Theo dõi mục tiêu" open={isModalProgressOpen} onOk={handleOk} onCancel={handleCancel}>
                <div className="d-flex text-muted overflow-auto center">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col" className="col-5 col-name">Ngày thêm</th>
                                <th scope="col" className="col-5 col-name">Số tiền thêm</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedGoal?.goalDetailList.map((item) => (
                                <tr key={item.id}>
                                    <td>{new Date(item.date).toLocaleDateString(
                                        "en-GB"
                                    )}</td>
                                    <td>{item.deposit?.toLocaleString("vi", {
                                        style: "currency",
                                        currency: "VND",
                                    })}</td>
                                </tr>))}
                        </tbody>
                        <tbody>
                            <p>Tổng: {selectedGoal?.totalDeposit?.toLocaleString("vi", {
                                style: "currency",
                                currency: "VND",
                            })}</p>
                        </tbody>
                    </table>
                </div>
            </Modal>

            <Modal title={<div className="text-center">Thêm tiền cho mục tiêu</div>} open={isModalAddDeposit} onOk={handleAddDeposit} onCancel={handleCancel}>
                <Form layout="vertical" autoComplete="off">
                    <Form.Item name="name" label="Số tiền thêm">
                        <Input type="number" onChange={(e) => setDeposit(e.target.value)} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal title={<div className="text-center">Thêm mục tiêu mới</div>} open={isModalAddGoal} onOk={handleAddGoal} onCancel={handleCancel}>
                <Form layout="vertical" autoComplete="off">
                    <Form.Item name="name" label="Tên mục tiêu">
                        <Input type="text" onChange={(e) =>
                            setNewGoal({ ...newGoal, name: e.target.value })
                        } />
                    </Form.Item>
                    <Form.Item name="amount" label="Số tiền mục tiêu">
                        <Input type="number" onChange={(e) =>
                            setNewGoal({ ...newGoal, amount: e.target.value })
                        } />
                    </Form.Item>
                    <Form.Item name="deadline" label="Mục tiêu đến ngày">
                        <DatePicker onChange={handleDatePickerChange} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal title={<div className="text-center">Sửa mục tiêu</div>} open={isModalUpdateGoal} onOk={handleUpdateGoal} onCancel={handleCancel}>
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Tên mục tiêu">
                        <Input type="text" onChange={(e) =>
                            setSelectedGoal({ ...selectedGoal, name: e.target.value })
                        } />
                    </Form.Item>
                    <Form.Item name="amount" label="Số tiền mục tiêu">
                        <Input type="number" onChange={(e) =>
                            setSelectedGoal({ ...selectedGoal, amount: e.target.value })} />
                    </Form.Item>
                    <Form.Item name="deadline" label="Mục tiêu đến ngày">
                        <DatePicker onChange={handleDatePickerChangeSelectedGoal} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal title={<div className="text-center">Bạn có chắc muốn xóa mục tiêu</div>} open={isModalDeleteGoal} onOk={deleteGoal} onCancel={handleCancel}>
            </Modal>
        </>
    );
}

export default userLayout(GoalPage);