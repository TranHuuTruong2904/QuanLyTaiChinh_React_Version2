import React, { useEffect, useState } from "react";
import userLayout from "../../layout/userLayout";
import { Card, Pagination } from "antd";
import axiosApiInstance from "../../context/interceptor";
import { Chart as chartjs, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, BarElement, ArcElement } from 'chart.js';
import Chart from "react-apexcharts";
import ReactApexChart from "react-apexcharts";

chartjs.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    BarElement,
    ArcElement,
);

const HomePage = () => {
    const [listIncomeInYear, setListIncomeInYear] = useState([]);
    const [listExpenseInYear, setListExpenseInYear] = useState([]);
    const [listExpenseFamilyInYear, setListExpenseFamilyInYear] = useState([]);
    const [allTransactionIncomeInMonth, setListTransactionIncomeInMonth] = useState([]);
    const [allTransactionExpenseInMonth, setListTransactionExpenseInMonth] = useState([]);
    const [allTransactionExpenseFamilyInMonth, setListTransactionExpenseFamilyInMonth] = useState([]);
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

    const currentTransactionIncome = paginate(allTransactionIncomeInMonth, currentPageTransactionIncome, pageSize);
    const currentTransactionExpense = paginate(allTransactionExpenseInMonth, currentPageTransactionExpense, pageSize);
    const currentTransactionExpenseFamily = paginate(allTransactionExpenseFamilyInMonth, currentPageTransactionExpenseFamily, pageSize);

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

    async function getAllTransactionIncomeInMonth() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/transaction/all-income-personal-month/${monthSelected}/2023`);
        if (result?.data?.status === 200) {
            setListTransactionIncomeInMonth(result?.data?.data);
        }
        else
            setListTransactionIncomeInMonth([]);
    };

    async function getAllTransactionExpenseInMonth() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/transaction/all-expense-personal-month/${monthSelected}/2023`);
        if (result?.data?.status === 200) {
            setListTransactionExpenseInMonth(result?.data?.data);
        }
        else
            setListTransactionExpenseInMonth([]);
    };

    async function getAllTransactionExpenseFamilyInMonth() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/transaction/all-expense-family-month/${monthSelected}/2023`);
        if (result?.data?.status === 200) {
            setListTransactionExpenseFamilyInMonth(result?.data?.data || []);
        }
        else
            setListTransactionExpenseFamilyInMonth([]);
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
                formatter(val, opts) {
                    const name = opts.w.globals.labels[opts.seriesIndex]
                    return [name, val.toFixed(2) + '%']
                }
            },
            legend: {
                show: false
            }
        },
    };

    useEffect(() => {
        getListTotalExpense();
        getListTotalIncome();
        getListTotalExpenseFamily();
        getTotalIncomeExpensePersonalAndExpenseFamilyInMonth();
        getAllTransactionIncomeInMonth();
        getAllTransactionExpenseInMonth();
        getAllTransactionExpenseFamilyInMonth();
    }, [yearSelected, monthSelected]);

    useEffect(() => {
        setFiveYear();
        setMonthInYear();
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
                                <ReactApexChart options={dataIncomeExpensePersonalAndExpenseFamilyInMonth.options} series={dataIncomeExpensePersonalAndExpenseFamilyInMonth.series} type="pie" height={300} />
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
                                    total={allTransactionExpenseFamilyInMonth.length}
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
                                    total={allTransactionIncomeInMonth.length}
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
                                    total={allTransactionExpenseInMonth.length}
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
