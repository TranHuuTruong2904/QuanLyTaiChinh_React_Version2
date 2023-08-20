import React, { useEffect, useState } from "react";
import userLayout from "../../layout/userLayout";
import { Card, Pagination } from "antd";
import axiosApiInstance from "../../context/interceptor";
import ReactApexChart from "react-apexcharts";

const HomePage = () => {
    const [listIncomeInYear, setListIncomeInYear] = useState([]);
    const [listExpenseInYear, setListExpenseInYear] = useState([]);
    const [listExpenseFamilyInYear, setListExpenseFamilyInYear] = useState([]);
    const [allTransactionIncomeNearest, setListTransactionIncomeNearest] = useState([]);
    const [allTransactionExpenseNearest, setListTransactionExpenseNearest] = useState([]);
    const [allTransactionExpenseFamilyNearest, setListTransactionExpenseFamilyNearest] = useState([]);
    const [listIncomeExpensePersonalAndExpenseFamily, setListIncomeExpensePersonalAndExpenseFamily] = useState([]);
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

    // phân trang
    const [pageSize, setPageSize] = useState(4);
    const [currentPageTransactionIncome, setCurrentPageTransactionIncome] = useState(1);
    const [currentPageTransactionExpense, setCurrentPageTransactionExpense] = useState(1);
    const [currentPageTransactionExpenseFamily, setCurrentPageTransactionExpenseFamily] = useState(1);
    const paginate = (array, pageNumber, pageSize) => {
        const startIndex = (pageNumber - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return array.slice(startIndex, endIndex);
    };

    const currentTransactionIncome = paginate(allTransactionIncomeNearest, currentPageTransactionIncome, pageSize);
    const currentTransactionExpense = paginate(allTransactionExpenseNearest, currentPageTransactionExpense, pageSize);
    const currentTransactionExpenseFamily = paginate(allTransactionExpenseFamilyNearest, currentPageTransactionExpenseFamily, pageSize);

    const handlePageIncome = (pageNumber, pageSize) => {
        setCurrentPageTransactionIncome(pageNumber);
    };

    const handlePageExpense = (pageNumber, pageSize) => {
        setCurrentPageTransactionExpense(pageNumber);
    };

    const handlePageExpenseFamily = (pageNumber, pageSize) => {
        setCurrentPageTransactionExpenseFamily(pageNumber);
    };

    async function getListTotalIncome() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/transaction/list-income/year/${yearSelected}`);
        if (result?.data?.status === 200) {
            setListIncomeInYear(result?.data?.data);
        }
    };

    async function getListTotalExpense() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/transaction/list-expense/year/${yearSelected}`);
        if (result?.data?.status === 200) {
            setListExpenseInYear(result?.data?.data);
        }
    };

    async function getListTotalExpenseFamily() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/transaction/list-expense-family/year/${yearSelected}`);
        if (result?.data?.status === 200) {
            setListExpenseFamilyInYear(result?.data?.data);
        }
    };

    async function getTotalIncomeExpensePersonalAndExpenseFamilyInMonth() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/transaction/income-expense-personal-and-expense-family/${monthSelected}/2023`);
        if (result?.data?.status === 200) {
            setListIncomeExpensePersonalAndExpenseFamily(result?.data?.data);
        }
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

    async function getAllTransactionExpenseFamilyNearest() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/transaction/5-expense-family-nearest`);
        if (result?.data?.status === 200) {
            setListTransactionExpenseFamilyNearest(result?.data?.data || []);
        }
    };


    // data vẽ biểu đồ đường
    const dataIncome = {
        options: {
            chart: {
                type: 'area'
            },
            dataLabels: {
                enabled: false
            },
            subtitle: {
                text: `Năm ${yearSelected}`,
                align: 'left'
            },
            xaxis: {
                categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            },
            yaxis: {
                opposite: true
            },
        },
        series: [
            {
                name: "Thu Nhập",
                data: listIncomeInYear
            }
        ]
    };

    const dataExpense = {
        options: {
            chart: {
                type: 'area',
            },
            stroke: {
                curve: "smooth",
                width: 4,
                colors: ["#ff0000"],
                opacity: 0.3
            },
            dataLabels: {
                enabled: false
            },
            subtitle: {
                text: `Năm ${yearSelected}`,
                align: 'left'
            },
            fill: {
                colors: ["rgb(255, 99, 71)"]
            },
            xaxis: {
                categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            },
            yaxis: {
                opposite: true
            },
        },
        series: [
            {
                name: "Chi Tiêu",
                data: listExpenseInYear,
            }
        ]
    };

    const dataExpenseFamily = {
        options: {
            chart: {
                type: 'area',
            },
            stroke: {
                curve: "smooth",
                width: 4,
                colors: ["#ff0000"],
                opacity: 0.3
            },
            dataLabels: {
                enabled: false
            },
            subtitle: {
                text: `Năm ${yearSelected}`,
                align: 'left'
            },
            fill: {
                colors: ["rgb(255, 99, 71)"]
            },
            xaxis: {
                categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            },
            yaxis: {
                opposite: true
            },
        },
        series: [
            {
                name: "Chi Tiêu",
                data: listExpenseFamilyInYear,
            }
        ]
    };

    const dataIncomeExpensePersonalAndExpenseFamilyInMonth = {
        series: listIncomeExpensePersonalAndExpenseFamily,
        options: {
            chart: {
                width: '100%',
                type: 'pie',
            },
            labels: ["Thu nhập cá nhân", "Chi tiêu cá nhân", "Chi tiêu gia đình"],
            theme: {
                monochrome: {
                    enabled: true
                }
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        offset: -5
                    }
                }
            },
            subtitle: {
                text: `Tháng ${monthSelected}`,
                align: 'left'
            },
            title: {
                text: "Thống kê thu nhập và chi tiêu"
            },
            dataLabels: {
                style: {
                    colors: ['#333333', '#333333', '#333333'], // Mảng chứa mã màu của các chữ trong nhãn
                    fontSize: '16px', // Kích thước chữ
                },
                formatter(val, opts) {
                    const name = opts.w.globals.labels[opts.seriesIndex]
                    return [name, val.toFixed(2) + '%']
                }
            },
            legend: {
                show: false
            },
            fill: {
                colors: ['#33FFFF', '#FFFF33', '#f1bcbc']
            }
        },
    };

    useEffect(() => {
        getListTotalExpense();
        getListTotalIncome();
        getListTotalExpenseFamily();
        getTotalIncomeExpensePersonalAndExpenseFamilyInMonth();
    }, [yearSelected, monthSelected]);

    useEffect(() => {
        setFiveYear();
        setMonthInYear();
        getAllTransactionIncomeNearest();
        getAllTransactionExpenseNearest();
        getAllTransactionExpenseFamilyNearest();
    }, []);

    return (
        <>
            <div className="container py-5" style={{ minWidth: '95%' }}>
                <div className="justify-content-center">
                    <div>
                        <select className="form-control" id="statusChoose" onChange={handleChangeMonth}>
                            <option value={arrayMonth?.at(0)}>Tháng {arrayMonth?.at(0)}</option>
                            {arrayMonth?.map((m) => (
                                <option value={m} key={m}> Tháng {m}</option>
                            ))}
                        </select>
                        <div className="d-flex">
                            <Card title="" bordered={false} style={{ width: '50%', margin: '2px' }}>
                                <div>
                                    <ReactApexChart options={dataIncomeExpensePersonalAndExpenseFamilyInMonth.options} series={dataIncomeExpensePersonalAndExpenseFamilyInMonth.series} type="pie" height={300} />
                                    <div className="text-center">
                                            <h5>Tổng chi: {(listIncomeExpensePersonalAndExpenseFamily[1] + listIncomeExpensePersonalAndExpenseFamily[2])?.toLocaleString("vi", { style: "currency", currency: "VND" })}</h5>
                                            <h5>Tổng thu: {(listIncomeExpensePersonalAndExpenseFamily[0])?.toLocaleString("vi", { style: "currency", currency: "VND" })}</h5>
                                    </div>
                                </div>
                            </Card>
                            <Card title="Chi tiêu gia đình gần đây" bordered={false} style={{ width: '50%', margin: '2px' }}>
                                <table className="table">
                                    {/* <thead>
                                            <tr>
                                                <th scope="col" className="col-2 col-name"><h6>Tên GD</h6></th>
                                                <th scope="col" className="col-1 col-name"><h6>Số tiền</h6></th>
                                                <th scope="col" className="col-1 col-name"><h6>Ngày GD</h6></th>
                                                <th scope="col" className="col-3 col-name"><h6>Địa điểm</h6></th>
                                                <th scope="col" className="col-2 col-name"><h6>Danh mục</h6></th>
                                            </tr>
                                        </thead> */}
                                    <tbody>
                                        {currentTransactionExpenseFamily.map((item, index) => (
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
                                                {/* <td>{item.userCategory.name}</td> */}
                                            </tr>))}
                                    </tbody>
                                </table>
                                <Pagination
                                    onChange={handlePageExpenseFamily}
                                    current={currentPageTransactionExpenseFamily}
                                    pageSize={pageSize}
                                    total={allTransactionExpenseFamilyNearest.length}
                                />
                            </Card>
                        </div>
                        <div className="d-flex">
                            <Card title="Thu nhập cá nhân gần đây" bordered={false} style={{ width: '50%', margin: '2px', height: '350px' }}>
                                <table className="table">
                                    {/* <thead>
                                            <tr>
                                                <th scope="col" className="col-2 col-name"><h6>Tên GD</h6></th>
                                                <th scope="col" className="col-1 col-name"><h6>Số tiền</h6></th>
                                                <th scope="col" className="col-1 col-name"><h6>Ngày GD</h6></th>
                                                <th scope="col" className="col-3 col-name"><h6>Địa điểm</h6></th>
                                                <th scope="col" className="col-2 col-name"><h6>Danh mục</h6></th>
                                            </tr>
                                        </thead> */}
                                    <tbody>
                                        {currentTransactionIncome.map((item, index) => (
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
                                                {/* <td>{item.userCategory.name}</td> */}
                                            </tr>))}
                                    </tbody>
                                </table>
                                <Pagination
                                    onChange={handlePageIncome}
                                    current={currentPageTransactionIncome}
                                    pageSize={pageSize}
                                    total={allTransactionIncomeNearest.length}
                                />
                            </Card>
                            <Card title="Chi tiêu cá nhân gần đây" bordered={false} style={{ width: '50%', margin: '2px', height: '350px' }}>
                                <table className="table">
                                    {/* <thead>
                                            <tr>
                                                <th scope="col" className="col-2 col-name"><h6>Tên GD</h6></th>
                                                <th scope="col" className="col-1 col-name"><h6>Số tiền</h6></th>
                                                <th scope="col" className="col-1 col-name"><h6>Ngày GD</h6></th>
                                                <th scope="col" className="col-3 col-name"><h6>Địa điểm</h6></th>
                                                <th scope="col" className="col-2 col-name"><h6>Danh mục</h6></th>
                                            </tr>
                                        </thead> */}
                                    <tbody>
                                        {currentTransactionExpense.map((item, index) => (
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
                                                {/* <td>{item.userCategory.name}</td> */}
                                            </tr>))}
                                    </tbody>
                                </table>
                                <Pagination
                                    onChange={handlePageExpense}
                                    current={currentPageTransactionExpense}
                                    pageSize={pageSize}
                                    total={allTransactionExpenseNearest.length}
                                />
                            </Card>
                        </div>
                    </div>
                    {/* <div style={{ marginTop: "20px" }}>
                        <select className="form-control" id="statusChoose" onChange={handleChangeYear}>
                            <option value={arrayYear?.at(0)}>{arrayYear?.at(0)}</option>
                            {arrayYear?.map((y) => (
                                <option value={y} key={y}>{y}</option>
                            ))}
                        </select>
                        <div className="d-flex">
                            <Card title="Biểu đồ thống kê thu nhập cá nhân trong năm" bordered={false} style={{ width: '50%', margin: '2px' }}>
                                <Chart options={dataIncome.options} series={dataIncome.series} type="area"></Chart>
                            </Card>
                            <Card title="Biểu đồ thống kê chi tiêu cá nhân trong năm" bordered={false} style={{ width: '50%', margin: '2px' }}>
                                <Chart options={dataExpense.options} series={dataExpense.series} type="area"></Chart>
                            </Card>
                        </div>
                        <div style={{ marginTop: "10px" }}>
                            <Card title="Biểu đồ thống kê chi tiêu gia đình trong năm" bordered={false} style={{ width: '100%' }}>
                                <Chart options={dataExpenseFamily.options} series={dataExpenseFamily.series} type="area" height={300}></Chart>
                            </Card>
                        </div>
                    </div> */}
                </div>
            </div>
        </>
    )
}

export default userLayout(HomePage);
