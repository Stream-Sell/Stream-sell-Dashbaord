import { useEffect, useRef, useState } from "react";
import {
  getDashboard,
  getTopSellingProduct,
  getTopSellingSeller,
  getTopUser,
  getPopularProduct,
  getRecenetOrder,
  getUser,
  getOrder,
  getUserChart,
  getRevenueChart,
} from "../../store/dashboard/dashboard.action";
import { connect, useDispatch, useSelector } from "react-redux";
import { Chart as ChartJS, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import Table2 from "../../extra/Table2";
import { useNavigate } from "react-router-dom";
import DateRangePicker1 from "react-bootstrap-daterangepicker";
import DateRangePicker2 from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import dayjs from "dayjs";
import { getDefaultCurrency } from "../../store/currency/currency.action";
import { getAdminEarning } from "../../store/redeem/redeem.action";
import { getCategory } from "../../store/category/category.action";
import { getAllSubcategory } from "../../store/attribute/attribute.action";
import formatImageUrl from "../../extra/functions";
import defaultImage from "../../../assets/images/default.jpg";

const Dashboard = (props) => {
  let label = [];
  let label1 = [];
  let dataUser = [];
  let data = [];
  let dataTotal = [];
  let dataWith = [];
  let dataWithOut = [];
  
  const {
    dashboard,
    product,
    seller,
    user,
    orderData,
    popularProduct,
    recentOrders,
    userCount,
    userChart,
    total,
    withCom,
    withOut,
  } = useSelector((state) => state.dashboard);

  const { adminTotalEarnings } = useSelector((state) => state.redeem);
  const { category } = useSelector((state) => state.category);
  const { subcategory } = useSelector((state) => state.attribute);

  useEffect(() => {
    dispatch(getAdminEarning("1", "10", "All", "All"));
    dispatch(getCategory());
    dispatch(getAllSubcategory());
  }, []);

  const [type, setType] = useState("Product");
  const [order, setOrder] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dateRangerShowType, setDateRangerShowType] = useState({
    toggle: false,
    type: "",
  });
  
  const dispatch = useDispatch();
  const [date, setDate] = useState([]);
  const [sDate, setsDate] = useState("All");
  const [eDate, seteDate] = useState("All");
  const [date2, setDate2] = useState([]);
  const [sDate3, setSDate3] = useState("All");
  const [eDate3, setEDate3] = useState("All");
  const [sDate2, setsDate2] = useState("All");
  const [eDate2, seteDate2] = useState("All");

  const startDateFormat = (startDate) => {
    return startDate && dayjs(startDate).isValid()
      ? dayjs(startDate).format("YYYY-MM-DD")
      : dayjs().subtract(7, "day").format("YYYY-MM-DD");
  };
  
  const endDateFormat = (endDate) => {
    return endDate && dayjs(endDate).isValid()
      ? dayjs(endDate).format("YYYY-MM-DD")
      : dayjs().format("YYYY-MM-DD");
  };

  const startDateData = startDateFormat(sDate);
  const endDateData = endDateFormat(eDate);
  const { defaultCurrency } = useSelector((state) => state.currency);
  const [userChartData, setUserChartData] = useState();
  const [startDate, setStartDate] = useState("All");
  const [endDate, setEndDate] = useState("All");
  const [sDate1, setSDate1] = useState("All");
  const [eDate1, setEDate1] = useState("All");

  const startDateFormat1 = (startDate) => {
    return startDate && dayjs(startDate).isValid()
      ? dayjs(startDate).format("YYYY-MM-DD")
      : dayjs().subtract(7, "day").format("YYYY-MM-DD");
  };
  
  const endDateFormat1 = (endDate) => {
    return endDate && dayjs(endDate).isValid()
      ? dayjs(endDate).format("YYYY-MM-DD")
      : dayjs().format("YYYY-MM-DD");
  };

  const startDateData1 = startDateFormat1(sDate1);
  const endDateData1 = endDateFormat1(eDate1);
  const [analyticTotal, setAnalyticTotal] = useState([]);
  const [analyticWith, setAnalyticWith] = useState([]);
  const [analyticWithOut, setAnalyticWithOut] = useState([]);
  const dateRangePickerRef = useRef();
  const dateRangePickerRef1 = useRef();

  useEffect(() => {
    dispatch(getDefaultCurrency());
  }, [dispatch]);

  useEffect(() => {
    setAnalyticTotal(total);
  }, [total]);

  useEffect(() => {
    setAnalyticWith(withCom);
  }, [withCom]);
  
  useEffect(() => {
    setAnalyticWithOut(withOut);
  }, [withOut]);

  var dateAnalytic = new Date();
  var firstDay = new Date(
    dateAnalytic?.getFullYear(),
    dateAnalytic?.getMonth() - 1,
    1
  );

  const maxDate = new Date();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getDashboard());
    dispatch(getTopSellingProduct());
    dispatch(getTopSellingSeller());
    dispatch(getTopUser());
    dispatch(getPopularProduct());
    dispatch(getRecenetOrder());
    dispatch(getOrder(startDate, endDate));
  }, [dispatch, startDate, endDate]);

  useEffect(() => {
    dispatch(getUserChart(startDateData, endDateData));
  }, [dispatch, startDateData, endDateData]);

  useEffect(() => {
    dispatch(getRevenueChart(startDateData1, endDateData1));
  }, [dispatch, startDateData1, endDateData1]);

  useEffect(() => {
    if (sDate3 === "All" && eDate3 === "All") {
      dispatch(getUser(sDate1, eDate1));
    }
  }, [dispatch, sDate3, eDate3]);

  useEffect(() => {
    setOrder(recentOrders);
    setUserChartData(userChart);
  }, [recentOrders, userChart]);

  const collapsedDatePicker = (type) => {
    if (type === "dateRangeOne") {
      setDateRangerShowType({
        type: "dateRangeOne",
        toggle: !dateRangerShowType.toggle,
      });
    } else {
      setDateRangerShowType({
        type: "dateRangeTwo",
        toggle: !dateRangerShowType.toggle,
      });
    }
  };

  const handleCloseDateRange = () => {
    setDateRangerShowType({
      type: "",
      toggle: false,
    });
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dateRangePickerRef.current &&
        !dateRangePickerRef.current.contains(event.target) &&
        dateRangePickerRef1.current &&
        !dateRangePickerRef1.current.contains(event.target)
      ) {
        handleCloseDateRange();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (date.length === 0) {
      setDate([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        },
      ]);
    }
  }, [date]);

  useEffect(() => {
    if (date2.length === 0) {
      setDate2([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        },
      ]);
    }
  }, [date2]);

  const handleOpen = (id) => {
    navigate("/admin/order/orderDetail", {
      state: id,
    });
  };

  if (userChartData?.length > 0) {
    userChartData.map((data_) => {
      const newDate = data_._id;
      var date;
      if (newDate._id) {
        data = dayjs(newDate?._id).format("DD MMM YYYY");
      } else {
        date = dayjs(newDate).format("DD MMM YYYY");
      }
      date?.length > 0 && label1.push(date);
      dataUser.push(data_.count);
    });
  }

  const chartData = {
    labels: label1,
    datasets: [
      {
        type: "line",
        label: "User",
        data: dataUser,
        fill: false,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        borderColor: "#000000",
        lineTension: 0.4,
        pointBorderWidth: 2,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#000000",
      },
    ],
  };

  const handleApply = (event, picker) => {
    picker.element.val(
      picker.startDate.format("YYYY-MM-DD") +
        " / " +
        picker.endDate.format("YYYY-MM-DD")
    );
    const dayStart = dayjs(picker.startDate).format("YYYY-MM-DD");
    const dayEnd = dayjs(picker.endDate).format("YYYY-MM-DD");
    setsDate(dayStart);
    seteDate(dayEnd);
    dispatch(getUserChart(dayStart, dayEnd));
  };

  const handleCancel = (event, picker) => {
    picker.element.val("");
    setsDate("All");
    seteDate("All");
    dispatch(getUserChart("All", "All"));
  };

  if (
    analyticTotal?.length > 0 ||
    analyticWith?.length > 0 ||
    analyticWithOut?.length > 0
  ) {
    analyticTotal.map((data_) => {
      const newDate = data_._id;
      var date;
      if (newDate._id) {
        data = dayjs(newDate?._id).format("DD MMM YYYY");
      } else {
        date = dayjs(newDate).format("DD MMM YYYY");
      }
      date?.length > 0 && label.push(date);
      dataTotal.push(data_?.totalCommission);
    });
  }

  if (analyticWith?.length > 0 || analyticWithOut?.length > 0) {
    analyticWith.map((data_, index) => {
      const newDate = data_._id;
      var date;
      if (newDate._id) {
        date = newDate?._id.split("T");
      } else {
        date = newDate.split("T");
      }
      dataWith.push(data_?.totalEarningWithCommission);
    });
  }

  if (analyticWithOut?.length > 0) {
    analyticWithOut.map((data_, index) => {
      const newDate = data_._id;
      var date;
      if (newDate._id) {
        date = newDate?._id.split("T");
      } else {
        date = newDate.split("T");
      }
      dataWithOut.push(data_?.totalEarningWithoutCommission);
    });
  }

  const chartData1 = {
    labels: label,
    datasets: [
      {
        type: "line",
        label: "Total Earning",
        data: dataTotal,
        fill: false,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        borderColor: "#000000",
        lineTension: 0.4,
        pointBorderWidth: 2,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#000000",
      },
      {
        type: "line",
        label: "Earning With Commission",
        data: dataWith,
        fill: false,
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "#3b82f6",
        lineTension: 0.4,
        pointBorderWidth: 2,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#3b82f6",
      },
      {
        type: "line",
        label: "Earning Without Commission",
        data: dataWithOut,
        fill: false,
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderColor: "#10b981",
        lineTension: 0.4,
        pointBorderWidth: 2,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#10b981",
      },
    ],
  };

  const handleApply1 = (event, picker) => {
    picker.element.val(
      picker.startDate.format("YYYY-MM-DD") +
        " / " +
        picker.endDate.format("YYYY-MM-DD")
    );
    const dayStart = dayjs(picker.startDate).format("YYYY-MM-DD");
    const dayEnd = dayjs(picker.endDate).format("YYYY-MM-DD");
    setSDate1(dayStart);
    setEDate1(dayEnd);
    dispatch(getRevenueChart(dayStart, dayEnd));
  };

  const handleCancel1 = (event, picker) => {
    picker.element.val("");
    setSDate1(sDate1);
    setEDate1(eDate1);
    dispatch(getRevenueChart(sDate1, eDate1));
  };

  const mapData = [
    {
      Header: "No",
      width: "60px",
      Cell: ({ index }) => <span className="fw-normal">{index + 1}</span>,
    },
    {
      Header: "Order Id",
      body: "orderId",
      Cell: ({ row }) => (
        <span
          className="orderIdText"
          style={{ cursor: "pointer" }}
          onClick={() => handleOpen(row._id)}
        >
          <b className="fw-medium">{row?.orderId}</b>
        </span>
      ),
    },
    {
      Header: "User",
      body: "user",
      Cell: ({ row }) => (
        <div>
          <span className="fw-normal">
            {row?.userId?.firstName ? row?.userId?.firstName + " " : " "}
            {row?.userId?.lastName ? row?.userId?.lastName : "User"}
          </span>
        </div>
      ),
    },
    {
      Header: "Payment Gateway",
      body: "paymentGateway",
      Cell: ({ row }) => <span className="fw-normal">{row?.paymentGateway}</span>,
    },
    {
      Header: `Total (${defaultCurrency?.symbol})`,
      body: "totalPrice",
      Cell: ({ row }) => <span className="fw-medium">{row?.subTotal}</span>,
    },
  ];

  const mapData1 = [
    {
      Header: "No",
      width: "60px",
      Cell: ({ index }) => <span className="fw-normal">{index + 1}</span>,
    },
    {
      Header: "User",
      body: "firstName",
      Cell: ({ row }) => (
        <div
          className="d-flex align-items-center"
          onClick={() => navigate("/admin/userProfile", { state: row._id })}
          style={{ cursor: "pointer" }}
        >
          <img
            src={formatImageUrl(row?.image)}
            style={{ borderRadius: "8px", objectFit: "cover" }}
            height={40}
            width={40}
            alt=""
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImage;
            }}
          />
          <span className="fw-medium ms-3 text-capitalize">
            {row.firstName + " " + row.lastName}
          </span>
        </div>
      ),
    },
    {
      Header: "Country",
      body: "location",
      Cell: ({ row }) => (
        <span className="fw-normal text-uppercase">{row?.location}</span>
      ),
    },
    {
      Header: "Total Orders",
      body: "orderCount",
      Cell: ({ row }) => (
        <span className="fw-medium">
          {row.orderCount ? row.orderCount : 0}
        </span>
      ),
    },
  ];

  const mapData2 = [
    {
      Header: "No",
      width: "60px",
      Cell: ({ index }) => <span className="fw-normal">{index + 1}</span>,
    },
    {
      Header: "Seller",
      body: "firstName",
      Cell: ({ row }) => (
        <div
          className="d-flex align-items-center"
          onClick={() => navigate("/admin/sellerProfile", { state: row._id })}
          style={{ cursor: "pointer" }}
        >
          <img
            src={row?.image}
            style={{ borderRadius: "8px", objectFit: "cover" }}
            height={40}
            width={40}
            alt=""
          />
          <span className="fw-medium ms-3">
            {row?.firstName + " " + row?.lastName}
          </span>
        </div>
      ),
    },
    {
      Header: "Total Product",
      body: "totalProduct",
      Cell: ({ row }) => (
        <span className="status-badge" style={{ background: "#e0f2fe", color: "#0369a1" }}>
          {row.totalProduct ? row.totalProduct : 0}
        </span>
      ),
    },
    {
      Header: "Total Sold",
      body: "totalSales",
      Cell: ({ row }) => (
        <span className="fw-medium">
          {row.totalProductsSold ? row.totalProductsSold : "0"}
        </span>
      ),
    },
  ];

  const mapData3 = [
    {
      Header: "No",
      width: "60px",
      Cell: ({ index }) => <span className="fw-normal">{parseInt(index) + 1}</span>,
    },
    {
      Header: "Product",
      body: "images",
      Cell: ({ row }) => (
        <div
          className="d-flex align-items-center"
          onClick={() => navigate("/admin/productDetail", { state: row?._id })}
          style={{ cursor: "pointer" }}
        >
          <img
            src={row?.mainImage}
            height={40}
            width={40}
            style={{ borderRadius: "8px", objectFit: "cover" }}
            alt=""
          />
          <span className="fw-medium ms-3">{row?.productName}</span>
        </div>
      ),
    },
    {
      Header: "Sold",
      Cell: ({ row }) => <span className="fw-medium">{row?.sold}</span>,
    },
    {
      Header: "Rating",
      Cell: ({ row }) => (
        <span className="d-flex align-items-center">
          <i className="bi bi-star-fill text-warning me-1"></i>
          <span className="fw-medium">{row?.rating}</span>
        </span>
      ),
    },
  ];

  const mapData4 = [
    {
      Header: "No",
      width: "60px",
      Cell: ({ index }) => <span className="fw-normal">{parseInt(index) + 1}</span>,
    },
    {
      Header: "Product",
      body: "images",
      Cell: ({ row }) => (
        <div
          className="d-flex align-items-center"
          onClick={() => navigate("/admin/productDetail", { state: row?._id })}
          style={{ cursor: "pointer" }}
        >
          <img
            src={row?.mainImage}
            height={40}
            width={40}
            style={{ borderRadius: "8px", objectFit: "cover" }}
            alt=""
          />
          <span className="fw-medium ms-3">{row?.productName}</span>
        </div>
      ),
    },
    {
      Header: "Category",
      Cell: ({ row }) => <span className="fw-normal">{row?.categoryName}</span>,
    },
    {
      Header: "Rating",
      Cell: ({ row }) => (
        <span className="d-flex align-items-center">
          <i className="bi bi-star-fill text-warning me-1"></i>
          <span className="fw-medium">{row?.rating}</span>
        </span>
      ),
    },
  ];

  return (
    <>
      <style jsx>{`
        .mainDashboard {
          background: #f8f9fa;
          min-height: 100vh;
          padding: 24px;
        }

        .card {
          background: #ffffff;
          border-radius: 16px !important;
          border: 1px solid #e8eaed !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06) !important;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
        }

        .bcard {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          border: 1px solid #e8eaed;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .bcard:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .sellerMenuHeader {
          border-bottom: 1px solid #f1f3f4;
          padding: 16px 20px;
        }

        .dashboardMen {
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 32px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .dashboardMen::-webkit-scrollbar {
          display: none;
        }

        .dashboardMen li {
          white-space: nowrap;
          position: relative;
        }

        .profileDash {
          color: #374151 !important;
          font-weight: 500 !important;
          font-size: 15px !important;
          cursor: pointer;
          text-decoration: none;
          padding-bottom: 16px;
          display: inline-block;
          transition: color 0.2s ease;
          border-bottom: 3px solid transparent;
        }

        .profileDash:hover {
          color: #3b82f6 !important;
          border-bottom: 3px solid #bfdbfe;
        }

        .activeLineDashd {
          color: #3b82f6 !important;
          font-weight: 600 !important;
          border-bottom: 3px solid #3b82f6 !important;
        }

        .activeLineDashf {
          border-bottom: 3px solid #3b82f6;
        }

        .orderIdText {
          color: #0066cc !important;
          font-weight: 500 !important;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .orderIdText:hover {
          color: #0052a3 !important;
          text-decoration: underline;
        }

        .datedash {
          border: 1px solid #e5e7eb !important;
          border-radius: 8px !important;
          padding: 10px 16px !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          color: #1a1a1a !important;
          background-color: #ffffff !important;
          transition: all 0.2s ease;
        }

        .datedash:focus {
          border-color: #000 !important;
          outline: none;
          box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05) !important;
        }

        .datedash::placeholder {
          color: #9ca3af !important;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .wow-card1,
        .wow-card2,
        .wow-card3,
        .wow-card4,
        .wow-card-category,
        .wow-card-subcategory,
        .wow-card-commission {
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .wow-card1:hover,
        .wow-card2:hover,
        .wow-card3:hover,
        .wow-card4:hover,
        .wow-card-category:hover,
        .wow-card-subcategory:hover,
        .wow-card-commission:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
        }

        .wow-card4 {
          background: linear-gradient(145deg, #ffffff, rgb(231, 245, 252));
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .metric-title4 {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        .metric-value4 {
          font-size: 32px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .metric-icon4 {
          background: radial-gradient(circle at 30% 30%, rgb(71, 165, 228), #3b82f6);
          border-radius: 50%;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 26px;
        }

        .metric-link4 {
          font-size: 14px;
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
          cursor: pointer;
        }

        .wow-card2 {
          background: linear-gradient(145deg, #ffffff, rgb(253, 251, 236));
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .metric-title2 {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        .metric-value2 {
          font-size: 32px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .metric-icon2 {
          background: radial-gradient(circle at 30% 30%, #f59e0b, #fbbf24);
          border-radius: 50%;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 26px;
        }

        .metric-link2 {
          font-size: 14px;
          color: #f59e0b;
          text-decoration: none;
          font-weight: 500;
          cursor: pointer;
        }

        .wow-card1 {
          background: linear-gradient(145deg, #ffffff, rgb(255, 234, 230));
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .metric-title1 {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        .metric-value1 {
          font-size: 32px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .metric-icon1 {
          background: radial-gradient(circle at 30% 30%, #ef4444, #f87171);
          border-radius: 50%;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 26px;
        }

        .metric-link1 {
          font-size: 14px;
          color: #ef4444;
          text-decoration: none;
          font-weight: 500;
          cursor: pointer;
        }

        .wow-card3 {
          background: linear-gradient(145deg, #ffffff, #fff7ed);
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .metric-title3 {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        .metric-value3 {
          font-size: 32px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .metric-icon3 {
          background: radial-gradient(circle at 30% 30%, #f97316, #fb923c);
          border-radius: 50%;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 26px;
        }

        .metric-link3 {
          font-size: 14px;
          color: #f97316;
          text-decoration: none;
          font-weight: 500;
          cursor: pointer;
        }

        .wow-card-category {
          background: linear-gradient(145deg, #ffffff, rgb(252, 231, 243));
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .metric-title-category {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        .metric-value-category {
          font-size: 32px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .metric-icon-category {
          background: radial-gradient(circle at 30% 30%, rgb(228, 71, 165), #e91e63);
          border-radius: 50%;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 26px;
        }

        .metric-link-category {
          font-size: 14px;
          color: #e91e63;
          text-decoration: none;
          font-weight: 500;
          cursor: pointer;
        }

        .wow-card-subcategory {
          background: linear-gradient(145deg, #ffffff, rgb(231, 252, 239));
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .metric-title-subcategory {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        .metric-value-subcategory {
          font-size: 32px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .metric-icon-subcategory {
          background: radial-gradient(circle at 30% 30%, rgb(71, 228, 131), #10b981);
          border-radius: 50%;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 26px;
        }

        .metric-link-subcategory {
          font-size: 14px;
          color: #10b981;
          text-decoration: none;
          font-weight: 500;
          cursor: pointer;
        }

        .wow-card-commission {
          background: linear-gradient(145deg, #ffffff, rgb(252, 243, 231));
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .metric-title-commission {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        .metric-value-commission {
          font-size: 32px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .metric-icon-commission {
          background: radial-gradient(circle at 30% 30%, rgb(228, 165, 71), #f59e0b);
          border-radius: 50%;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 26px;
        }

        .metric-link-commission {
          font-size: 14px;
          color: #f59e0b;
          text-decoration: none;
          font-weight: 500;
          cursor: pointer;
        }
      `}</style>

      <div className="mainDashboard">
        <div className="dashboard">
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 col-12 mb-4">
              <div
                className="wow-card4 p-4 d-flex flex-column justify-content-between h-100"
                onClick={() => navigate("/admin/user")}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="mb-1 metric-title4">Total Users</p>
                    <h2 className="mb-0 metric-value4">
                      {sDate3 === "Today" ? userCount?.todayUsers : userCount?.totalUsers}
                    </h2>
                  </div>
                  <div className="metric-icon4">
                    <i className="bi bi-people-fill"></i>
                  </div>
                </div>
                <div className="border-top mt-3 pt-3">
                  <span className="metric-link4">View All Details</span>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 col-12 mb-4">
              <div
                className="wow-card2 p-4 d-flex flex-column justify-content-between h-100"
                onClick={() => navigate("/admin/order")}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="mb-1 metric-title2">Total Orders</p>
                    <h2 className="mb-0 metric-value2">{orderData?.totalOrders}</h2>
                  </div>
                  <div className="metric-icon2">
                    <i className="bi bi-bag-fill"></i>
                  </div>
                </div>
                <div className="border-top mt-3 pt-3">
                  <span className="metric-link2">View All Details</span>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 col-12 mb-4">
              <div
                className="wow-card1 p-4 d-flex flex-column justify-content-between h-100"
                onClick={() => navigate("/admin/liveSeller")}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="mb-1 metric-title1">Live Sellers</p>
                    <h2 className="mb-0 metric-value1">{dashboard?.totalLiveSeller}</h2>
                  </div>
                  <div className="metric-icon1">
                    <i className="bi bi-broadcast"></i>
                  </div>
                </div>
                <div className="border-top mt-3 pt-3">
                  <span className="metric-link1">View All Details</span>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 col-12 mb-4">
              <div
                className="wow-card3 p-4 d-flex flex-column justify-content-between h-100"
                onClick={() => navigate("/admin/product")}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="mb-1 metric-title3">Total Products</p>
                    <h2 className="mb-0 metric-value3">{dashboard?.totalProducts}</h2>
                  </div>
                  <div className="metric-icon3">
                    <i className="bi bi-box-seam"></i>
                  </div>
                </div>
                <div className="border-top mt-3 pt-3">
                  <span className="metric-link3">View All Details</span>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 col-12 mb-4">
              <div
                className="wow-card-category p-4 d-flex flex-column justify-content-between h-100"
                onClick={() => navigate("/admin/category")}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="mb-1 metric-title-category">Total Categories</p>
                    <h2 className="mb-0 metric-value-category">{category?.length}</h2>
                  </div>
                  <div className="metric-icon-category">
                    <i className="bi bi-grid-3x3-gap-fill"></i>
                  </div>
                </div>
                <div className="border-top mt-3 pt-3">
                  <span className="metric-link-category">View All Details</span>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 col-12 mb-4">
              <div
                className="wow-card-subcategory p-4 d-flex flex-column justify-content-between h-100"
                onClick={() => navigate("/admin/category/subCategory")}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="mb-1 metric-title-subcategory">Total Sub Categories</p>
                    <h2 className="mb-0 metric-value-subcategory">{subcategory?.length}</h2>
                  </div>
                  <div className="metric-icon-subcategory">
                    <i className="bi bi-list-nested"></i>
                  </div>
                </div>
                <div className="border-top mt-3 pt-3">
                  <span className="metric-link-subcategory">View All Details</span>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 col-12 mb-4">
              <div
                className="wow-card-commission p-4 d-flex flex-column justify-content-between h-100"
                onClick={() => navigate("/admin/wallet")}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="mb-1 metric-title-commission">Admin Commission</p>
                    <h2 className="mb-0 metric-value-commission">{adminTotalEarnings}</h2>
                  </div>
                  <div className="metric-icon-commission">
                    <i className="bi bi-currency-dollar"></i>
                  </div>
                </div>
                <div className="border-top mt-3 pt-3">
                  <span className="metric-link-commission">View All Details</span>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-6 col-12">
              <div className="card">
                <div className="heading">
                  <div className="sellerMenuHeader mt-0">
                    <ul className="dashboardMen d-flex justify-content-between">
                      <li className={`pb-0 ${type === "Product" && "activeLineDashf"}`}>
                        <a
                          className={`profileDash mb-0 ${type === "Product" && "activeLineDashd"}`}
                          onClick={() => setType("Product")}
                        >
                          Top Selling Product
                        </a>
                      </li>
                      <li className={`pb-0 ${type === "Popular" && "activeLineDashf"}`}>
                        <a
                          className={`profileDash mb-0 ${type === "Popular" && "activeLineDashd"}`}
                          onClick={() => setType("Popular")}
                        >
                          Most Popular Product
                        </a>
                      </li>
                      <li className={`pb-0 ${type === "Seller" && "activeLineDashf"}`}>
                        <a
                          className={`profileDash mb-0 ${type === "Seller" && "activeLineDashd"}`}
                          onClick={() => setType("Seller")}
                        >
                          Top Seller
                        </a>
                      </li>
                      <li className={`pb-0 ${type === "Customer" && "activeLineDashf"}`}>
                        <a
                          className={`profileDash mb-0 ${type === "Customer" && "activeLineDashd"}`}
                          onClick={() => setType("Customer")}
                        >
                          Top Buyer
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card-body p-0">
                  <div className="p-0 dashBoardTable">
                    <div className="tableMain m-0">
                      {type === "Customer" && (
                        <Table2
                          data={user}
                          mapData={mapData1}
                          serverPerPage={rowsPerPage}
                          serverPage={page}
                          type={"server"}
                        />
                      )}
                      {type === "Seller" && (
                        <Table2
                          data={seller}
                          mapData={mapData2}
                          serverPerPage={rowsPerPage}
                          serverPage={page}
                          type={"server"}
                        />
                      )}
                      {type === "Product" && (
                        <Table2
                          data={product}
                          mapData={mapData3}
                          serverPerPage={rowsPerPage}
                          serverPage={page}
                          type={"server"}
                        />
                      )}
                      {type === "Popular" && (
                        <Table2
                          data={popularProduct}
                          mapData={mapData4}
                          serverPerPage={rowsPerPage}
                          serverPage={page}
                          type={"server"}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-6 col-12 mt-xl-0 mt-md-3 mt-2">
              <div className="card">
                <div className="heading">
                  <div className="sellerMenuHeader mt-0">
                    <h6 className="mb-0" style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a1a" }}>
                      Recent Orders
                    </h6>
                  </div>
                </div>
                <div className="card-body p-0">
                  <div className="p-0 dashBoardTable">
                    <div className="tableMain m-0">
                      <Table2
                        data={order}
                        mapData={mapData}
                        serverPerPage={rowsPerPage}
                        serverPage={page}
                        type={"server"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-6 col-12 mt-4">
              <div className="bcard">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <h6 className="mb-0" style={{ fontSize: "18px", fontWeight: "600", color: "#1a1a1a" }}>
                      User Analytics
                    </h6>
                    <div>
                      <DateRangePicker1
                        initialSettings={{
                          applyButtonClasses: "btn-default",
                          autoUpdateInput: false,
                          locale: {
                            cancelLabel: "Clear",
                          },
                          maxDate: new Date(),
                        }}
                        onApply={handleApply}
                        onCancel={handleCancel}
                      >
                        <input
                          type="text"
                          className="form-control text-center datedash"
                          placeholder="Select Date"
                          readOnly
                          style={{ width: "200px" }}
                        />
                      </DateRangePicker1>
                    </div>
                  </div>
                  <div style={{ height: "400px" }}>
                    <Line
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: true,
                            position: "bottom",
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: {
                              color: "#f1f3f4",
                            },
                          },
                          x: {
                            grid: {
                              display: false,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-6 col-12 mt-4">
              <div className="bcard">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <h6 className="mb-0" style={{ fontSize: "18px", fontWeight: "600", color: "#1a1a1a" }}>
                      Revenue Analytics
                    </h6>
                    <div>
                      <DateRangePicker2
                        initialSettings={{
                          applyButtonClasses: "btn-default",
                          autoUpdateInput: false,
                          locale: {
                            cancelLabel: "Clear",
                          },
                          maxDate: new Date(),
                        }}
                        onApply={handleApply1}
                        onCancel={handleCancel1}
                      >
                        <input
                          type="text"
                          className="form-control text-center datedash"
                          placeholder="Select Date"
                          readOnly
                          style={{ width: "200px" }}
                        />
                      </DateRangePicker2>
                    </div>
                  </div>
                  <div style={{ height: "400px" }}>
                    <Line
                      data={chartData1}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: true,
                            position: "bottom",
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: {
                              color: "#f1f3f4",
                            },
                          },
                          x: {
                            grid: {
                              display: false,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

ChartJS.register(...registerables);

export default connect(null, {
  getDashboard,
  getTopSellingProduct,
  getTopSellingSeller,
  getTopUser,
  getUser,
  getOrder,
  getPopularProduct,
  getRecenetOrder,
  getUserChart,
  getRevenueChart,
})(Dashboard);