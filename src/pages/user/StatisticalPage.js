import React, { useEffect } from "react";
import userLayout from "../../layout/userLayout";
import { useState } from "react";
import { Select, DatePicker } from "antd";
import axiosApiInstance from "../../context/interceptor";
import * as XLSX from 'xlsx'
import { saveAs } from "file-saver";
const { RangePicker } = DatePicker;

const StatisticalPage = () => {

    const [selectedOption, setSelectedOption] = useState('');
    const [listTransactionInMonth, setListTransactionInMonth] = useState([]);
    const [listTransactionInYear, setListTransactionInYear] = useState([]);
    const [listTransactionInRangeTime, setListTransactionInRangeTime] = useState([]);

    const [startDate, setStartDate] = useState('2023-07-01');
    const [endDate, setEndDate] = useState('2023-07-31');

    const [yearSelected, setYearSelected] = useState('2023');
    const today = new Date();
    const [monthSelected, setMonthSelected] = useState(today.getMonth() + 1);
    const [arrayYear, setYear] = useState([]);
    const [arrayMonth, setMonth] = useState([]);

    const handleChangeYear = (e) => {
        setYearSelected(e.target.value)
    };

    const setFiveYear = () => {
        const currentYear = new Date().getFullYear();
        setYearSelected(currentYear);
        let years = [];
        for (let i = 0; i < 5; i++) {
            years.push(currentYear - i);
        }
        setYear(years);
    };

    const handleChangeMonth = (e) => {
        setMonthSelected(e.target.value);
    }

    const setMonthInYear = () => {
        const currentMonth = new Date().getMonth();
        setMonthSelected(currentMonth + 1);
        let months = [];
        for (let i = 0; i < currentMonth + 1; i++) {
            months.push(currentMonth + 1 - i);
        }
        setMonth(months);
    };

    const handleOptionChange = (value) => {
        setSelectedOption(value);
    };

    const handleRangePickerChange = (dates) => {
        if (dates && dates.length === 2) {
            const [start, end] = dates;
            const formattedStartDate = formatDate(start); // Định dạng startDate thành chuỗi yyyy-mm-dd
            const formattedEndDate = formatDate(end); // Định dạng endDate thành chuỗi yyyy-mm-dd
            setStartDate(formattedStartDate);
            setEndDate(formattedEndDate);
        } else {
            setStartDate(null);
            setEndDate(null);
        }
    };

    const formatDate = (date) => {
        const dateSelected = new Date(date);
        const year = dateSelected.getFullYear();
        const month = String(dateSelected.getMonth() + 1).padStart(2, '0');
        const day = String(dateSelected.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    async function getAllTransactionInTimeRange() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/transaction/all/timerange/${startDate}/${endDate}`);
        if (result?.data?.status === 200) {
            setListTransactionInRangeTime(result?.data?.data);
        }
        else {
            setListTransactionInRangeTime([]);
        }
    };

    async function getAllTransactionInMonth() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/transaction/all/month/${monthSelected}/year/${yearSelected}`);
        if (result?.data?.status === 200) {
            setListTransactionInMonth(result?.data?.data);
        }
        else {
            setListTransactionInMonth([]);
        }
    };

    async function getAllTransactionInYear() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/transaction/all/year/${yearSelected}`);
        if (result?.data?.status === 200) {
            setListTransactionInYear(result?.data?.data);
        }
        else {
            setListTransactionInYear([]);
        }
    };

    // xuất dữ liệu excel theo tháng
    const handleExportExcelAllInMonth = () => {
        const workbook = XLSX.utils.book_new();

        const modifiedData = listTransactionInMonth.map(item => ({
            'Mã giao dịch': item.id,
            'Tên giao dịch': item.name,
            'Số tiền': item.amount,
            'Địa điểm': item.location,
            'Ngày': item.date,
            'Ghi chú': item.description,
            'Danh mục chi tiêu': item.userCategory.name,
            'Loại giao dịch': item.transactionType.name,
            'Loại danh mục': item.userCategory.category.name,
        }));

        // Sheet 1: Thu nhập
        const incomeSheetData = modifiedData.filter((item) => item['Loại giao dịch'] === 'Personal' && item['Loại danh mục'] === 'Thu nhập');
        const incomeSheet = XLSX.utils.json_to_sheet(incomeSheetData);
        XLSX.utils.book_append_sheet(workbook, incomeSheet, 'Thu nhập - Personal');

        // Tính tổng tiền cho sheet Thu nhập
        const incomeTotal = incomeSheetData.reduce((total, item) => total + item['Số tiền'], 0);
        const incomeTotalRow = [{}, 'Tổng tiền', incomeTotal, {}, {}, {}, {}, {}, {}];
        XLSX.utils.sheet_add_aoa(incomeSheet, [incomeTotalRow], { origin: -1 });

        // Sheet 2: Chi tiêu - Personal
        const expensePersonalData = modifiedData.filter((item) => item['Loại giao dịch'] === 'Personal' && item['Loại danh mục'] === 'Chi tiêu');
        const expensePersonalSheet = XLSX.utils.json_to_sheet(expensePersonalData);
        XLSX.utils.book_append_sheet(workbook, expensePersonalSheet, 'Chi tiêu - Personal');

        const expensePersonalTotal = expensePersonalData.reduce((total, item) => total + item['Số tiền'], 0);
        const expensePersonalTotalRow = [{}, 'Tổng tiền', expensePersonalTotal, {}, {}, {}, {}, {}, {}];
        XLSX.utils.sheet_add_aoa(expensePersonalSheet, [expensePersonalTotalRow], { origin: -1 });

        // Sheet 3: Chi tiêu - Family
        const expenseFamilyData = modifiedData.filter((item) => item['Loại giao dịch'] === 'Family');
        const expenseFamilySheet = XLSX.utils.json_to_sheet(expenseFamilyData);
        XLSX.utils.book_append_sheet(workbook, expenseFamilySheet, 'Chi tiêu - Family');

        // Tính tổng tiền cho sheet Chi tiêu - Family
        const expenseFamilyTotal = expenseFamilyData.reduce((total, item) => total + item['Số tiền'], 0);
        const expenseFamilyTotalRow = [{}, 'Tổng tiền', expenseFamilyTotal, {}, {}, {}, {}, {}, {}];
        XLSX.utils.sheet_add_aoa(expenseFamilySheet, [expenseFamilyTotalRow], { origin: -1 });

        // Xuất file
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const fileName = 'Thống kê giao dịch tháng : ' + monthSelected;
        saveAs(dataBlob, fileName);
    };

    // xuất dữ liệu excel theo năm
    const handleExportExcelAllInYear = () => {
        const workbook = XLSX.utils.book_new();

        const modifiedData = listTransactionInYear.map(item => ({
            'Mã giao dịch': item.id,
            'Tên giao dịch': item.name,
            'Số tiền': item.amount,
            'Địa điểm': item.location,
            'Ngày': item.date,
            'Ghi chú': item.description,
            'Danh mục chi tiêu': item.userCategory.name,
            'Loại giao dịch': item.transactionType.name,
            'Loại danh mục': item.userCategory.category.name,
        }));

        // Sheet 1: Thu nhập
        const incomeSheetData = modifiedData.filter((item) => item['Loại giao dịch'] === 'Personal' && item['Loại danh mục'] === 'Thu nhập');
        const incomeSheet = XLSX.utils.json_to_sheet(incomeSheetData);
        XLSX.utils.book_append_sheet(workbook, incomeSheet, 'Thu nhập - Personal');

        // Tính tổng tiền cho sheet Thu nhập
        const incomeTotal = incomeSheetData.reduce((total, item) => total + item['Số tiền'], 0);
        const incomeTotalRow = [{}, 'Tổng tiền', incomeTotal, {}, {}, {}, {}, {}, {}];
        XLSX.utils.sheet_add_aoa(incomeSheet, [incomeTotalRow], { origin: -1 });

        // Sheet 2: Chi tiêu - Personal
        const expensePersonalData = modifiedData.filter((item) => item['Loại giao dịch'] === 'Personal' && item['Loại danh mục'] === 'Chi tiêu');
        const expensePersonalSheet = XLSX.utils.json_to_sheet(expensePersonalData);
        XLSX.utils.book_append_sheet(workbook, expensePersonalSheet, 'Chi tiêu - Personal');

        const expensePersonalTotal = expensePersonalData.reduce((total, item) => total + item['Số tiền'], 0);
        const expensePersonalTotalRow = [{}, 'Tổng tiền', expensePersonalTotal, {}, {}, {}, {}, {}, {}];
        XLSX.utils.sheet_add_aoa(expensePersonalSheet, [expensePersonalTotalRow], { origin: -1 });

        // Sheet 3: Chi tiêu - Family
        const expenseFamilyData = modifiedData.filter((item) => item['Loại giao dịch'] === 'Family');
        const expenseFamilySheet = XLSX.utils.json_to_sheet(expenseFamilyData);
        XLSX.utils.book_append_sheet(workbook, expenseFamilySheet, 'Chi tiêu - Family');

        // Tính tổng tiền cho sheet Chi tiêu - Family
        const expenseFamilyTotal = expenseFamilyData.reduce((total, item) => total + item['Số tiền'], 0);
        const expenseFamilyTotalRow = [{}, 'Tổng tiền', expenseFamilyTotal, {}, {}, {}, {}, {}, {}];
        XLSX.utils.sheet_add_aoa(expenseFamilySheet, [expenseFamilyTotalRow], { origin: -1 });

        // Xuất file
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const fileName = 'Thống kê giao dịch năm : ' + yearSelected;
        saveAs(dataBlob, fileName);
    };

    // xuất excel giao dịch theo khoảng thời gian
    const handleExportExcelAllInTimeRange = () => {
        const workbook = XLSX.utils.book_new();

        const modifiedData = listTransactionInRangeTime.map(item => ({
            'Mã giao dịch': item.id,
            'Tên giao dịch': item.name,
            'Số tiền': item.amount,
            'Địa điểm': item.location,
            'Ngày': item.date,
            'Ghi chú': item.description,
            'Danh mục chi tiêu': item.userCategory.name,
            'Loại giao dịch': item.transactionType.name,
            'Loại danh mục': item.userCategory.category.name,
        }));

        // Sheet 1: Thu nhập
        const incomeSheetData = modifiedData.filter((item) => item['Loại giao dịch'] === 'Personal' && item['Loại danh mục'] === 'Thu nhập');
        const incomeSheet = XLSX.utils.json_to_sheet(incomeSheetData);
        XLSX.utils.book_append_sheet(workbook, incomeSheet, 'Thu nhập - Personal');

        // Tính tổng tiền cho sheet Thu nhập
        const incomeTotal = incomeSheetData.reduce((total, item) => total + item['Số tiền'], 0);
        const incomeTotalRow = [{}, 'Tổng tiền', incomeTotal, {}, {}, {}, {}, {}, {}];
        XLSX.utils.sheet_add_aoa(incomeSheet, [incomeTotalRow], { origin: -1 });

        // Sheet 2: Chi tiêu - Personal
        const expensePersonalData = modifiedData.filter((item) => item['Loại giao dịch'] === 'Personal' && item['Loại danh mục'] === 'Chi tiêu');
        const expensePersonalSheet = XLSX.utils.json_to_sheet(expensePersonalData);
        XLSX.utils.book_append_sheet(workbook, expensePersonalSheet, 'Chi tiêu - Personal');

        const expensePersonalTotal = expensePersonalData.reduce((total, item) => total + item['Số tiền'], 0);
        const expensePersonalTotalRow = [{}, 'Tổng tiền', expensePersonalTotal, {}, {}, {}, {}, {}, {}];
        XLSX.utils.sheet_add_aoa(expensePersonalSheet, [expensePersonalTotalRow], { origin: -1 });

        // Sheet 3: Chi tiêu - Family
        const expenseFamilyData = modifiedData.filter((item) => item['Loại giao dịch'] === 'Family');
        const expenseFamilySheet = XLSX.utils.json_to_sheet(expenseFamilyData);
        XLSX.utils.book_append_sheet(workbook, expenseFamilySheet, 'Chi tiêu - Family');

        // Tính tổng tiền cho sheet Chi tiêu - Family
        const expenseFamilyTotal = expenseFamilyData.reduce((total, item) => total + item['Số tiền'], 0);
        const expenseFamilyTotalRow = [{}, 'Tổng tiền', expenseFamilyTotal, {}, {}, {}, {}, {}, {}];
        XLSX.utils.sheet_add_aoa(expenseFamilySheet, [expenseFamilyTotalRow], { origin: -1 });

        // Xuất file
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const fileName = 'Thống kê giao dịch từ : ' + startDate + ' đến ' + endDate;
        saveAs(dataBlob, fileName);
    };

    useEffect(() => {
        getAllTransactionInMonth();
        getAllTransactionInYear();
        getAllTransactionInTimeRange();
    }, [startDate, endDate, monthSelected, yearSelected]);

    useEffect(() => {
        setFiveYear();
        setMonthInYear();
    }, []);

    return (
        <>
            <div className="container py-5" style={{ minWidth: '95%' }}>
                <div className="justify-content-center">
                    <div>
                        <Select value={selectedOption} onChange={handleOptionChange} style={{ width: "100%" }}>
                            <Select.Option value="">Chọn hình thức thống kê</Select.Option>
                            <Select.Option value="monthly">Thống kê theo tháng</Select.Option>
                            <Select.Option value="yearly">Thống kê theo năm</Select.Option>
                            <Select.Option value="timeRange">Thống kê theo khoảng thời gian</Select.Option>
                        </Select>
                    </div>

                    {selectedOption === 'monthly' && (
                        <div style={{ marginTop: "5px" }}>
                            <div className="row">
                                <div className="col text-left d-flex">
                                    <select className="form-control" id="statusChoose" style={{ width: "20%" }} onChange={handleChangeMonth}>
                                        <option value={arrayMonth?.at(0)}>Tháng {arrayMonth?.at(0)}</option>
                                        {arrayMonth?.map((m) => (
                                            <option value={m} key={m}> Tháng {m}</option>
                                        ))}
                                    </select>
                                    <select className="form-control" id="statusChoose" style={{ width: "20%" }} onChange={handleChangeYear}>
                                        <option value={arrayYear?.at(0)}> Năm {arrayYear?.at(0)}</option>
                                        {arrayYear?.map((y) => (
                                            <option value={y} key={y}> Năm {y}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col text-right">
                                    <button className="btn btn-default low-height-btn bg-success" style={{ height: "100%" }} onClick={handleExportExcelAllInMonth}>
                                        Export Excel
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listTransactionInMonth.map((item, index) => (
                                            <tr key={item.name}>
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
                                            </tr>))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {selectedOption === 'yearly' && (
                        <div style={{ marginTop: "5px" }}>
                            <div className="row">
                                <div className="col text-left d-flex">
                                    <select className="form-control" id="statusChoose" style={{ width: "20%" }} onChange={handleChangeYear}>
                                        <option value={arrayYear?.at(0)}> Năm {arrayYear?.at(0)}</option>
                                        {arrayYear?.map((y) => (
                                            <option value={y} key={y}> Năm {y}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col text-right">
                                    <button className="btn btn-default low-height-btn bg-success" style={{ height: "100%" }} onClick={handleExportExcelAllInYear}>
                                        Export Excel
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listTransactionInYear.map((item, index) => (
                                            <tr key={item.name}>
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
                                            </tr>))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {selectedOption === 'timeRange' && (
                        <div style={{ marginTop: "5px" }}>
                            <div className="row">
                                <div className="col text-left d-flex">
                                    <RangePicker size="small" onChange={handleRangePickerChange} />
                                </div>
                                <div className="col text-right">
                                    <button className="btn btn-default low-height-btn bg-success" style={{ height: "100%" }} onClick={handleExportExcelAllInTimeRange}>
                                        Export Excel
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listTransactionInRangeTime.map((item, index) => (
                                            <tr key={item.name}>
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
                                            </tr>))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default userLayout(StatisticalPage);