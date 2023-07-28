import React from "react";
import userLayout from "../../layout/userLayout";
import axiosApiInstance from "../../context/interceptor";
import { toast } from "react-toastify";
import { useState } from "react";
import { useEffect } from "react";
import ReactLoading from "react-loading"
import { FaPen, FaTrashAlt, FaSearch } from "react-icons/fa";
import { Input, ColorPicker, Modal, Form, Select, Pagination } from "antd";

const CategoryPage = () => {
    const [load, setLoad] = useState(false);
    const [change, setChange] = useState(false);
    const [listUserCategory, setListUserCategory] = useState([]);
    const [listCategory, setListCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [newCategory, setNewCategory] = useState({
        name: "",
        color: "#1677FF",
        description: "",
    });
    const [idCategoryType, setIdCategoryType] = useState();
    const [pageSize, setPageSize] = useState(8);
    const [currentPage, setCurrentPage] = useState(1);
    const paginate = (array, pageNumber, pageSize) => {
        const startIndex = (pageNumber - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return array.slice(startIndex, endIndex);
    };
    const currentUserCategoryList = paginate(listUserCategory, currentPage, pageSize);
    const handlePageChange = (pageNumber, pageSize) => {
        setCurrentPage(pageNumber);
    };

    async function getUserCategory() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/user-category/all`);
        setLoad(true);
        if (result?.data?.status == 101) {
            toast.success(result?.data?.message);
        }
        else {
            setListUserCategory(result?.data?.data);
        }
    };

    async function getAllCategory() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/category/all`);
        setLoad(true);
        setListCategory(result?.data?.data);
    }

    const [isModalAddUserCategory, setIsModalAddUserCategory] = useState(false);
    const [isModalUpdateUserCategory, setIsModelUpdateUserCategory] = useState(false);
    const [isModalDeleteUserCategory, setIsModalDeleteUserCategory] = useState(false);
    const [form] = Form.useForm();
    const openModalWithCategory = (item) => {
        setSelectedCategory(item);
        setIsModelUpdateUserCategory(true);
        form.setFieldsValue({
            name: item?.name,
            description: item?.description,
        });
    };

    const handleCancel = () => {
        setIsModalAddUserCategory(false);
        setIsModelUpdateUserCategory(false);
        setIsModalDeleteUserCategory(false);
    };

    const handleColorChange = (color) => {
        setNewCategory({ ...newCategory, color: color.toHexString() });
        setSelectedCategory({ ...selectedCategory, color: color.toHexString() });
    };

    const handleTypeChange = (event) => {
        setIdCategoryType(event);
    };

    const handleAddCategory = async () => {
        try {
            const result = await axiosApiInstance.post(axiosApiInstance.defaults.baseURL + `/api/user-category/add/${idCategoryType}`, newCategory);
            if (result?.data?.status === 101) {
                toast.error(result?.data?.message);
            }
            else {
                toast.success("Thêm danh mục thành công");
                setChange(!change);
                setIsModalAddUserCategory(false);
            }
        }
        catch (error) {
            toast.error("Có lỗi xảy ra. Vui lòng thử lại");
        }
    }

    const handleUpdateCategory = async () => {
        try {
            const payload = {
                name: selectedCategory.name,
                color: selectedCategory.color,
                description: selectedCategory.description,
            }
            const result = await axiosApiInstance.put(axiosApiInstance.defaults.baseURL + `/api/user-category/update/${selectedCategory?.id}/${idCategoryType}`, payload);
            if (result?.data?.status === 101) {
                toast.error(result?.data?.message);
            }
            else {
                toast.success("Sửa danh mục thành công");
                setChange(!change);
                setIsModelUpdateUserCategory(false);
            }
        }
        catch (error) {
            toast.error("Có lỗi. Vui lòng thử lại!");
        }
    }

    async function deleteUserCategory() {
        try {
            const result = await axiosApiInstance.delete(axiosApiInstance.defaults.baseURL + `/api/user-category/delete/${selectedCategory?.id}`);
            if (result?.data?.status === 200) {
                toast.success(result?.data?.message);
                setChange(!change);
                setIsModalDeleteUserCategory(false);
            }
            else {
                if (result?.data?.message.includes("Danh mục đang được sử dụng để lưu trữ giao dịch. Không được phép xóa")) {
                    toast.error(result?.data?.message);
                    setIsModalDeleteUserCategory(false);
                }
                if (result?.data?.message.includes("Danh mục đang được sử dụng cho một ngân sách. Không được xóa")) {
                    toast.error(result?.data?.message);
                    setIsModalDeleteUserCategory(false);
                }
            }
        }
        catch (error) {
            toast.error("Có lỗi. vui lòng thử lại");
        }
    }

    useEffect(() => {
        getUserCategory();
        getAllCategory();
    }, [change])

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
                                    placeholder="Tìm danh mục"
                                    prefix={<FaSearch />}
                                />
                            </div>
                            <div className="col text-center">
                                <h4 className="pb-2 mb-0">Danh sách danh mục</h4>
                            </div>
                            <div className="col text-right">
                                <button className="btn btn-default low-height-btn" title="Thêm" onClick={() => {
                                    setIsModalAddUserCategory(true);
                                }}>
                                    Thêm <i className="fa fa-plus"></i>
                                </button>
                            </div>
                        </div>
                        <div className="d-flex text-muted overflow-auto center">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col" className="col-1 col-name">Mã DM</th>
                                        <th scope="col" className="col-1 col-name">Màu sắc</th>
                                        <th scope="col" className="col-3 col-name">Tên danh mục</th>
                                        <th scope="col" className="col-3 col-name">Ghi chú</th>
                                        <th scope="col" className="col-1 col-name">Thể loại</th>
                                        <th scope="col" className="col-1 col-name">Tác vụ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUserCategoryList.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td><div
                                                style={{
                                                    backgroundColor: item.color,
                                                    height: "25px",
                                                    width: "25px",
                                                    borderRadius: "50%",
                                                }}
                                            ></div></td>
                                            <td>{item.name}</td>
                                            <td>{item.description}</td>
                                            <td>{item.category.name}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                <button type="button"
                                                    className="btn btn-outline-warning btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                                                    title="Chỉnh sửa" id={item.id} onClick={() => {
                                                        openModalWithCategory(item);
                                                    }}>
                                                    <FaPen />
                                                </button>

                                                <button type="button" id={item.id}
                                                    className="btn btn-outline-danger btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                                                    title="Xóa" onClick={() => {
                                                        setSelectedCategory(item);
                                                        setIsModalDeleteUserCategory(true);
                                                    }} ><FaTrashAlt />
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
                            total={listUserCategory.length}
                        />
                    </div>
                </div>
                :
                <div className={"center loading"}>
                    <ReactLoading type={'cylon'} color='#fffff' height={'33px'} width={'9%'} />
                </div>
            }

            <Modal title={<div className="text-center">Thêm danh mục mới</div>} open={isModalAddUserCategory} onOk={handleAddCategory} onCancel={handleCancel}>
                <Form layout="vertical">
                    <Form.Item name="name" label="Tên danh mục">
                        <Input type="text"
                            onChange={(e) =>
                                setNewCategory({ ...newCategory, name: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item name="color" label="Màu sắc">
                        <ColorPicker showText onChange={handleColorChange} />
                    </Form.Item>
                    <Form.Item name="description" label="Ghi chú">
                        <Input type="text" onChange={(e) =>
                            setNewCategory({ ...newCategory, description: e.target.value })} />
                    </Form.Item>
                    <Form.Item name="category" label="Chọn loại danh mục">
                        <Select onChange={handleTypeChange}>
                            {listCategory.map((category) => (
                                <Select.Option key={category?.id} value={category?.id}>
                                    {category?.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal title={<div className="text-center">Sửa danh mục</div>} open={isModalUpdateUserCategory} onOk={handleUpdateCategory} onCancel={handleCancel}>
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Tên danh mục">
                        <Input type="text"
                            onChange={(e) =>
                                setSelectedCategory({ ...selectedCategory, name: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item name="color" label="Màu sắc">
                        <ColorPicker showText onChange={handleColorChange} />
                    </Form.Item>
                    <Form.Item name="description" label="Ghi chú">
                        <Input type="text" onChange={(e) =>
                            setSelectedCategory({ ...selectedCategory, description: e.target.value })} />
                    </Form.Item>
                    <Form.Item name="category" label="Chọn loại danh mục">
                        <Select onChange={handleTypeChange}>
                            {listCategory.map((category) => (
                                <Select.Option key={category?.id} value={category?.id}>
                                    {category?.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal title={<div className="text-center">Bạn có chắc muốn xóa danh mục</div>} open={isModalDeleteUserCategory} onOk={deleteUserCategory} onCancel={handleCancel}>
            </Modal>
        </>
    )
}

export default userLayout(CategoryPage);
