import React, { useState } from "react";
import userLayout from "../../layout/userLayout";
import { Input } from "antd";
import ReactLoading from 'react-loading'
import { FaSearch } from "react-icons/fa";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import axiosApiInstance from "../../context/interceptor";
import { useEffect } from "react";
import { DatePicker, Form, Modal, TreeSelect } from "antd";
import { toast } from "react-toastify";
const { RangePicker } = DatePicker;

const TransactionPage = () => {
    const [allTransactionIncomeNearest, setListTransactionIncomeNearest] = useState([]);
    const [allTransactionExpenseNearest, setListTransactionExpenseNearest] = useState([]);
    const [allTransactionExpenseFamilyNearest, setListTransactionExpenseFamilyNearest] = useState([]);
    const [listUserCategory, setListUserCategory] = useState([]);
    const [listIncomeCategory, setListIncomeCategory] = useState([]);
    const [listExpenseCategory, setListExpenseCategory] = useState([]);
    const [idCategory, setIdCategory] = useState();
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isButton1Selected, setIsButton1Selected] = useState(true);
    const [isButton2Selected, setIsButton2Selected] = useState(false);
    const [searchTextFamily, setSearchTextFamily] = useState('');
    const [searchTextPersonalIncome, setSearchTextPersonalIncome] = useState('');
    const [searchTextPersonalExpense, setSearchTextPersonalExpense] = useState('');
    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());
    const [startDateTransactionIncome, setStartDateTransactionIncome] = useState('');
    const [endDateTransactionIncome, setEndDateTransactionIncome] = useState('');
    const [startDateTransactionExpense, setStartDateTransactionExpense] = useState('');
    const [endDateTransactionExpense, setEndDateTransactionExpense] = useState('');

    const handleDateChange = (date) => {
        const dateSelected = new Date(date);
        setSelectedMonth(dateSelected.getMonth() + 1);
        setSelectedYear(dateSelected.getFullYear());
    };

    const [load, setLoad] = useState(false);
    const [change, setChange] = useState(false);

    const [newTransaction, setNewTransaction] = useState({
        name: "",
        amount: "",
        location: "",
        date: "",
        description: "",
    });

    const [form1] = Form.useForm();
    const openModalUpdateTransaction = (item) => {
        setSelectedTransaction(item);
        setIsModalUpdateTransaction(true);
        form1.setFieldsValue({
            name: item?.name || '',
            amount: item?.amount || 0,
            location: item?.location || '',
            // date: new Date(item?.date) || '',
            description: item?.description || '',
        });
    };

    const handleDatePickerChange = (date) => {
        setNewTransaction({ ...newTransaction, date: date });
    };

    const handleDatePickerSeletedTransactionChange = (date) => {
        setSelectedTransaction({ ...selectedTransaction, date: date });
    }

    const [form] = Form.useForm();

    const handleButton1Click = () => {
        setIsButton1Selected(true);
        setIsButton2Selected(false);
    };

    const handleButton2Click = () => {
        setIsButton1Selected(false);
        setIsButton2Selected(true);
    };

    async function getAllTransactionIncomeNearest() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/transaction/10-income-personal-nearest`);
        if (result?.data?.status === 200) {
            setListTransactionIncomeNearest(result?.data?.data);
        }
    };

    async function getAllTransactionExpenseNearest() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/transaction/10-expense-personal-nearest`);
        if (result?.data?.status === 200) {
            setListTransactionExpenseNearest(result?.data?.data);
        }
    };

    const handleKeyPressFamily = (e) => {
        if (e.key === 'Enter') {
            setSearchTextFamily(e.target.value);
        }
    };

    const handleKeyPresPersonalIncome = (e) => {
        if (e.key === 'Enter') {
            setSearchTextPersonalIncome(e.target.value);
        }
    };

    const handleKeyPresPersonalExpense = (e) => {
        if (e.key === 'Enter') {
            setSearchTextPersonalExpense(e.target.value);
        }
    };

    const formatDate = (date) => {
        const dateSelected = new Date(date);
        const year = dateSelected.getFullYear();
        const month = String(dateSelected.getMonth() + 1).padStart(2, '0');
        const day = String(dateSelected.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleRangePickerChangeIncome = (dates) => {
        if (dates && dates.length === 2) {
            const [start, end] = dates;
            const formattedStartDate = formatDate(start); // Định dạng startDate thành chuỗi yyyy-mm-dd
            const formattedEndDate = formatDate(end); // Định dạng endDate thành chuỗi yyyy-mm-dd
            setStartDateTransactionIncome(formattedStartDate);
            setEndDateTransactionIncome(formattedEndDate);
        } else {
            setStartDateTransactionIncome(null);
            setEndDateTransactionIncome(null);
        }
    };

    const handleRangePickerChangeExpense = (dates) => {
        if (dates && dates.length === 2) {
            const [start, end] = dates;
            const formattedStartDate = formatDate(start); // Định dạng startDate thành chuỗi yyyy-mm-dd
            const formattedEndDate = formatDate(end); // Định dạng endDate thành chuỗi yyyy-mm-dd
            setStartDateTransactionExpense(formattedStartDate);
            setEndDateTransactionExpense(formattedEndDate);
        } else {
            setStartDateTransactionExpense(null);
            setEndDateTransactionExpense(null);
        }
    };

    async function listTransactionFamilySearch() {
        const encodedSearchText = encodeURIComponent(searchTextFamily);
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/transaction/search-family?name=${encodedSearchText}`);
        if (result?.data?.status === 101) {
            toast.error("Không có giao dịch cần tìm kiếm");
            setListTransactionExpenseFamilyNearest([]);
        }
        else {
            setListTransactionExpenseFamilyNearest(result?.data?.data);
        }
    };

    async function listTransactionIncomePersonalSearch() {
        const encodedSearchText = encodeURIComponent(searchTextPersonalIncome);
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/transaction/search-personal-income?name=${encodedSearchText}`);
        if (result?.data?.status === 101) {
            toast.error("Không có giao dịch cần tìm kiếm");
            setListTransactionIncomeNearest([]);
        }
        else {
            setListTransactionIncomeNearest(result?.data?.data);
        }
    };

    async function listTransactionExpensePersonalSearch() {
        const encodedSearchText = encodeURIComponent(searchTextPersonalExpense);
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/transaction/search-personal-expense?name=${encodedSearchText}`);
        if (result?.data?.status === 101) {
            toast.error("Không có giao dịch cần tìm kiếm");
            setListTransactionExpenseNearest([]);
        }
        else {
            setListTransactionExpenseNearest(result?.data?.data);
        }
    };

    async function listTransactionFamilyInMonth() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/transaction/all-expense-family-month/${selectedMonth}/${selectedYear}`);
        if (result?.data?.status === 101) {
            toast.success("Không có giao gia đình trong tháng " + selectedMonth);
            setListTransactionExpenseFamilyNearest([]);
        }
        else {
            setListTransactionExpenseFamilyNearest(result?.data?.data);
        }
    };

    async function getUserCategory() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/user-category/all`);
        setLoad(true);
        if (result?.data?.status === 200) {
            setListUserCategory(result?.data?.data);
        }
    };

    async function getIncomeUserCategory() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/user-category/income`);
        setLoad(true);
        if (result?.data?.status === 200) {
            setListIncomeCategory(result?.data?.data);
        }
    };

    async function getExpenseUserCategory() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/user-category/expense`);
        setLoad(true);
        if (result?.data?.status === 200) {
            setListExpenseCategory(result?.data?.data);
        }
    };

    // lấy giao dịch cá nhân và thu nhập theo khoảng thời gian
    async function getTransactionPersonalIncomeTimeRange() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/transaction/income-personal-timerange/${startDateTransactionIncome}/${endDateTransactionIncome}`);
        if (result?.data?.status === 200) {
            setListTransactionIncomeNearest(result?.data?.data);
        }
        else {
            toast.success("Không có giao dịch trong khoảng thời gian");
            setListTransactionIncomeNearest([]);
        }
    };

    async function getTransactionPersonalExpenseTimeRange() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/transaction/expense-personal-timerange/${startDateTransactionExpense}/${endDateTransactionExpense}`);
        if (result?.data?.status === 200) {
            setListTransactionExpenseNearest(result?.data?.data);
        }
        else {
            toast.success("Không có giao dịch trong khoảng thời gian");
            setListTransactionExpenseNearest([]);
        }
    };

    useEffect(() => {
        if (startDateTransactionIncome !== '' && endDateTransactionIncome !== '') {
            getTransactionPersonalIncomeTimeRange();
        }

        if (startDateTransactionExpense !== '' && endDateTransactionExpense !== '') {
            getTransactionPersonalExpenseTimeRange();
        }
    }, [startDateTransactionIncome, endDateTransactionIncome, startDateTransactionExpense, endDateTransactionExpense]);

    const transformToTreeData = (list) => {
        const treeData = list.map((item) => ({
            title: item.name,
            value: item.id,
            key: item.id,
        }));

        return treeData;
    };

    // Biến đổi dữ liệu danh mục thu nhập thành cấu trúc cây
    const incomeTreeData = transformToTreeData(listIncomeCategory);

    // Biến đổi dữ liệu danh mục chi tiêu thành cấu trúc cây
    const expenseTreeData = transformToTreeData(listExpenseCategory);

    const handleAddTransactionPersonal = async () => {
        try {
            const result = await axiosApiInstance.post(axiosApiInstance.defaults.baseURL + `/api/transaction/add-personal/${idCategory}`, newTransaction);
            if (result?.data?.status === 200) {
                toast.success(result?.data?.message);
                setChange(!change);
                setIsModalAddTransaction(false);
                form.resetFields();
            }
        }
        catch (error) {
            toast.error("Có lỗi. Vui lòng thử lại!");
        }
    };

    const handleAddTransactionFamily = async () => {
        try {
            const result = await axiosApiInstance.post(axiosApiInstance.defaults.baseURL + `/api/transaction/add-family/${idCategory}`, newTransaction);
            if (result?.data?.status === 200) {
                toast.success(result?.data?.message);
                setChange(!change);
                setIsModalAddTransaction(false);
                form.resetFields();
            }
        }
        catch (error) {
            toast.error("Có lỗi. Vui lòng thử lại!");
        }
    }

    const handleUpdateTransaction = async () => {
        try {
            const payload = {
                name: selectedTransaction.name,
                amount: selectedTransaction.amount,
                location: selectedTransaction.location,
                date: selectedTransaction.date,
                description: selectedTransaction.description
            };
            const result = await axiosApiInstance.put(axiosApiInstance.defaults.baseURL + `/api/transaction/update/${selectedTransaction.id}`, payload);
            if (result?.data?.status === 200) {
                toast.success(result?.data?.message);
                setChange(!change);
                setIsModalUpdateTransaction(false);
            }
        }
        catch (error) {
            toast.error("Có lỗi! Vui lòng thử lại!");
        }
    }

    const handleDeleteTransaction = async () => {
        try {
            const result = await axiosApiInstance.delete(axiosApiInstance.defaults.baseURL + `/api/transaction/delete/${selectedTransaction.id}`);
            if (result?.data?.status === 200) {
                toast.success("Xóa giao dịch thành công");
                setChange(!change);
                setIsModalDeleteTransaction(false);
            }
        }
        catch
        {
            toast.error("Có lỗi. Vui lòng thử lại!");
        }
    };

    // lấy tổng các loại giao dịch
    const sumTotalIncomeTransactionPersonal = allTransactionIncomeNearest.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.amount;
    }, 0);

    const sumTotalExpenseTransactionPersonal = allTransactionExpenseNearest.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.amount;
    }, 0);

    const sumTotalExpenseTransactionFamily = allTransactionExpenseFamilyNearest.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.amount;
    }, 0);

    // xử lý các modal thêm sửa xóa
    const [isModalAddTransaction, setIsModalAddTransaction] = useState(false);
    const [isModalUpdateTransaction, setIsModalUpdateTransaction] = useState(false);
    const [isModalDeleteTransaction, setIsModalDeleteTransaction] = useState(false);

    const handleCancel = () => {
        setIsModalAddTransaction(false);
        setIsModalUpdateTransaction(false);
        setIsModalDeleteTransaction(false);
    };

    const handleTreeSelectChange = (value) => {
        setIdCategory(value);
    };

    useEffect(() => {
        listTransactionFamilySearch();
        listTransactionExpensePersonalSearch();
        listTransactionIncomePersonalSearch();
    }, [searchTextFamily, searchTextPersonalExpense, searchTextPersonalIncome]);

    useEffect(() => {
        getAllTransactionIncomeNearest();
        getAllTransactionExpenseNearest();
        listTransactionFamilyInMonth();
        getUserCategory();
        getIncomeUserCategory();
        getExpenseUserCategory()
    }, [selectedMonth, selectedYear, change]);

    return (
        <>
            <div className="container py-5" style={{ minWidth: '95%' }}>
                <div className="container-button">
                    <button onClick={handleButton1Click} className={`button-layout ${isButton1Selected ? 'active-button' : ''}`}>
                        <h2>Giao dịch cá nhân</h2>
                    </button>
                    <button onClick={handleButton2Click} className={`button-layout ${isButton2Selected ? 'active-button' : ''}`}>
                        <h2>Giao dịch gia đình</h2>
                    </button>
                </div>

                {isButton1Selected &&
                    (
                        load ?
                            <div className="justify-content-center">
                                <div className="row">
                                    <div className="col text-right">
                                        <button className="btn btn-default low-height-btn" title="Thêm" onClick={() => {
                                            setIsModalAddTransaction(true);
                                        }}>
                                            Thêm <i className="fa fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col text-left">
                                        <Input
                                            style={{ width: "200px" }}
                                            size="small"
                                            placeholder="Tìm kiếm giao dịch"
                                            prefix={<FaSearch />}
                                            onKeyDown={handleKeyPresPersonalExpense}
                                        />
                                    </div>
                                    <div className="col text-center" style={{ margin: "5px" }}>
                                        <h5>Chi tiêu cá nhân gần đây</h5>
                                    </div>
                                    <div className="col text-right">
                                        <RangePicker size="small" onChange={handleRangePickerChangeExpense} />
                                    </div>
                                </div>
                                <div className="d-flex text-muted overflow-auto center">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="col-2 col-name">Tên giao dịch</th>
                                                <th scope="col" className="col-1 col-name">Số tiền</th>
                                                <th scope="col" className="col-1 col-name">Ngày GD</th>
                                                <th scope="col" className="col-2 col-name">Địa điểm</th>
                                                <th scope="col" className="col-2 col-name">Danh mục</th>
                                                <th scope="col" className="col-1 col-name">Tác vụ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allTransactionExpenseNearest.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{item.name}</td>
                                                    <td>{item.amount?.toLocaleString("vi", {
                                                        style: "currency",
                                                        currency: "VND",
                                                    })}</td>
                                                    <td>{new Date(item.date).toLocaleDateString(
                                                        "en-GB"
                                                    )}</td>
                                                    <td>{item.location}</td>
                                                    <td>{item.userCategory.name}</td>
                                                    <td style={{ whiteSpace: 'nowrap' }}>
                                                        <button type="button"
                                                            className="btn btn-outline-warning btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                                                            title="Chỉnh sửa" id={item.id} onClick={() => {
                                                                openModalUpdateTransaction(item);
                                                            }}>
                                                            <FaPen /></button>
                                                        <button type="button" id={item.id}
                                                            className="btn btn-outline-danger btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                                                            title="Xóa" onClick={() => {
                                                                setSelectedTransaction(item);
                                                                setIsModalDeleteTransaction(true);
                                                            }} ><FaTrashAlt />
                                                        </button>
                                                    </td>
                                                </tr>))}
                                            <td>Tổng: {sumTotalExpenseTransactionPersonal?.toLocaleString("vi", {
                                                style: "currency",
                                                currency: "VND",
                                            })}</td>
                                        </tbody>
                                    </table>
                                </div>
                                {/* <Pagination
                                    onChange={handlePagePersonal}
                                    current={currentPageTranPersonal}
                                    pageSize={pageSize}
                                    total={listTransactionPersonal.length}
                                /> */}

                                <div className="row">
                                    <div className="col text-left">
                                        <Input
                                            style={{ width: "200px" }}
                                            size="small"
                                            placeholder="Tìm kiếm giao dịch"
                                            prefix={<FaSearch />}
                                            onKeyDown={handleKeyPresPersonalIncome}
                                        />
                                    </div>
                                    <div className="col text-center" style={{ margin: "5px" }}>
                                        <h5>Thu nhập cá nhân gần đây</h5>
                                    </div>
                                    <div className="col text-right">
                                        <RangePicker size="small" onChange={handleRangePickerChangeIncome} />
                                    </div>
                                </div>
                                <div className="d-flex text-muted overflow-auto center">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="col-2 col-name">Tên giao dịch</th>
                                                <th scope="col" className="col-1 col-name">Số tiền</th>
                                                <th scope="col" className="col-1 col-name">Ngày GD</th>
                                                <th scope="col" className="col-2 col-name">Địa điểm</th>
                                                <th scope="col" className="col-2 col-name">Danh mục</th>
                                                <th scope="col" className="col-1 col-name">Tác vụ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allTransactionIncomeNearest.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{item.name}</td>
                                                    <td>{item.amount?.toLocaleString("vi", {
                                                        style: "currency",
                                                        currency: "VND",
                                                    })}</td>
                                                    <td>{new Date(item.date).toLocaleDateString(
                                                        "en-GB"
                                                    )}</td>
                                                    <td>{item.location}</td>
                                                    <td>{item.userCategory.name}</td>
                                                    <td style={{ whiteSpace: 'nowrap' }}>
                                                        <button type="button"
                                                            className="btn btn-outline-warning btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                                                            title="Chỉnh sửa" id={item.id} onClick={() => {
                                                                openModalUpdateTransaction(item);
                                                            }}>
                                                            <FaPen /></button>
                                                        <button type="button" id={item.id}
                                                            className="btn btn-outline-danger btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                                                            title="Xóa" onClick={() => {
                                                                setSelectedTransaction(item);
                                                                setIsModalDeleteTransaction(true);
                                                            }} ><FaTrashAlt />
                                                        </button>
                                                    </td>
                                                </tr>))}
                                            <td>Tổng: {sumTotalIncomeTransactionPersonal?.toLocaleString("vi", {
                                                style: "currency",
                                                currency: "VND",
                                            })}</td>
                                        </tbody>
                                    </table>
                                </div>
                                {/* <Pagination
                                    onChange={handlePagePersonal}
                                    current={currentPageTranPersonal}
                                    pageSize={pageSize}
                                    total={listTransactionPersonal.length}
                                /> */}
                            </div>
                            :
                            <div className={"center loading"}>
                                <ReactLoading type={'cylon'} color='#fffff' height={'33px'} width={'9%'} />
                            </div>
                    )
                }

                {isButton2Selected &&
                    (load ?
                        <div className="justify-content-center">
                            <div className="row">
                                <div className="col text-left" style={{ display: "flex", gap: "5px" }}>
                                    <Input
                                        style={{ width: "200px" }}
                                        size="small"
                                        placeholder="Tìm kiếm giao dịch"
                                        prefix={<FaSearch />}
                                        onKeyDown={handleKeyPressFamily}
                                    />
                                    <DatePicker picker="month" size="small" placeholder="Chọn tháng" onChange={handleDateChange} />
                                </div>
                                <div className="col text-center">
                                    <h5>Chi tiêu gia đình gần đây</h5>
                                </div>
                                <div className="col text-right">
                                    <button className="btn btn-default low-height-btn" title="Thêm" onClick={() => {
                                        setIsModalAddTransaction(true);
                                    }}>
                                        Thêm <i className="fa fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="d-flex text-muted overflow-auto center">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="col-2 col-name">Tên giao dịch</th>
                                            <th scope="col" className="col-1 col-name">Số tiền</th>
                                            <th scope="col" className="col-1 col-name">Ngày GD</th>
                                            <th scope="col" className="col-3 col-name">Địa điểm</th>
                                            <th scope="col" className="col-2 col-name">Danh mục</th>
                                            <th scope="col" className="col-1 col-name">Tác vụ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allTransactionExpenseFamilyNearest.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{item.name}</td>
                                                <td>{item.amount?.toLocaleString("vi", {
                                                    style: "currency",
                                                    currency: "VND",
                                                })}</td>
                                                <td>{new Date(item.date).toLocaleDateString(
                                                    "en-GB"
                                                )}</td>
                                                <td>{item.location}</td>
                                                <td>{item.userCategory.name}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>
                                                    <button type="button"
                                                        className="btn btn-outline-warning btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                                                        title="Chỉnh sửa" id={item.id} onClick={() => {
                                                            openModalUpdateTransaction(item);
                                                        }}>
                                                        <FaPen /></button>
                                                    <button type="button" id={item.id}
                                                        className="btn btn-outline-danger btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                                                        title="Xóa" ><FaTrashAlt />
                                                    </button>
                                                </td>
                                            </tr>))}
                                        <td>Tổng: {sumTotalExpenseTransactionFamily?.toLocaleString("vi", {
                                            style: "currency",
                                            currency: "VND",
                                        })}</td>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        :
                        <div className={"center loading"}>
                            <ReactLoading type={'cylon'} color='#fffff' height={'33px'} width={'9%'} />
                        </div>
                    )
                }
            </div>

            <Modal style={{ top: 60 }} title={<div className="text-center">Thêm giao dịch mới</div>} onOk={isButton1Selected ? handleAddTransactionPersonal : handleAddTransactionFamily} open={isModalAddTransaction} onCancel={handleCancel}>
                <Form form={form} layout="vertical">
                    <Form.Item name="category" label="Danh mục">
                        <TreeSelect
                            showSearch
                            style={{ width: '100%' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            placeholder="Chọn danh mục"
                            allowClear
                            treeDefaultExpandAll
                            filterTreeNode={(input, treeNode) =>
                                treeNode.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            treeData={[
                                {
                                    title: 'Thu nhập',
                                    value: 'income',
                                    key: 'income',
                                    children: incomeTreeData,
                                },
                                {
                                    title: 'Chi tiêu',
                                    value: 'expense',
                                    key: 'expense',
                                    children: expenseTreeData,
                                },
                            ]}
                            onChange={handleTreeSelectChange}
                            value={idCategory}
                        />
                        {/* <Select onChange={handleChangeCategory}>
                            {listUserCategory.map((category) => (
                                <Select.Option key={category?.id} value={category?.id}>
                                    {category?.name} - {category.category.name}
                                </Select.Option>
                            ))}
                        </Select> */}
                    </Form.Item>
                    <Form.Item name="name" label="Tên giao dịch">
                        <Input type="text"
                            onChange={(e) => setNewTransaction({ ...newTransaction, name: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item name="amount" label="Số tiền giao dịch">
                        <Input type="number"
                            onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item name="location" label="Địa điểm giao dịch">
                        <Input type="text"
                            onChange={(e) => setNewTransaction({ ...newTransaction, location: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item name="description" label="Ghi chú">
                        <Input type="text"
                            onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item name="date" label="Ngày giao dịch">
                        <DatePicker onChange={handleDatePickerChange} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal style={{ top: 60 }} title={<div className="text-center">Sửa giao dịch</div>} open={isModalUpdateTransaction} onOk={handleUpdateTransaction} onCancel={handleCancel}>
                <Form form={form1} layout="vertical">
                    <Form.Item name="name" label="Tên giao dịch">
                        <Input type="text"
                            onChange={(e) => setSelectedTransaction({ ...selectedTransaction, name: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item name="amount" label="Số tiền giao dịch">
                        <Input type="number"
                            onChange={(e) => setSelectedTransaction({ ...selectedTransaction, amount: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item name="location" label="Địa điểm giao dịch">
                        <Input type="text"
                            onChange={(e) => setSelectedTransaction({ ...selectedTransaction, location: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item name="description" label="Ghi chú">
                        <Input type="text"
                            onChange={(e) => setSelectedTransaction({ ...selectedTransaction, description: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item name="date" label="Ngày giao dịch">
                        <DatePicker onChange={handleDatePickerSeletedTransactionChange} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal title={<div className="text-center">Bạn có chắc muốn xóa giao dịch</div>} open={isModalDeleteTransaction} onOk={handleDeleteTransaction} onCancel={handleCancel}>
            </Modal>
        </>
    );
}

export default userLayout(TransactionPage);