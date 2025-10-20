import React, { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton';
import "react-loading-skeleton/dist/skeleton.css";
import { colors } from "../../../util/SkeletonColor";
import Table from '../../extra/Table';
import { deleteVideoReport, getVideoReport, resolveReport } from '../../store/videoReport/videoReport.action';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../../extra/Pagination';
import { warning, warningAccept } from '../../../util/Alert';

const VideoReport = () => {

    const dispatch = useDispatch();

    const { videoReport } = useSelector((state) => state.videoReport);
    

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        dispatch(getVideoReport(type, currentPage, rowsPerPage));
    }, [type, currentPage, rowsPerPage])

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        setData(videoReport);
    }, [videoReport]);

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event, 10);
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(1);
    };

    const handleClick = (reportId) => {
        

        const data = warningAccept();
        data
            .then((isDeleted) => {
                if (isDeleted) {

                    dispatch(resolveReport(reportId));
                }
            })
            .catch((err) => console.log(err));
    };

    const handleDecline = (reportId, reelId) => {
        

        const data = warning();
        data
            .then((isDeleted) => {
                if (isDeleted) {

                    dispatch(deleteVideoReport(reportId, reelId));
                }
            })
            .catch((err) => console.log(err));
    };

    const mapData = [
        {
            Header: "No",
            width: "20px",
            Cell: ({ index }) => (
                <span className="text-white">
                    {(currentPage - 1) * rowsPerPage + index + 1}
                </span>
            ),
        },

        {
            Header: "Video",
            body: "video",
            Cell: ({ row }) => (
                <div className="">
                    <div className="">
                        {loading ? (
                            <>
                                <Skeleton
                                    height={54}
                                    width={51}
                                    className="StripeElement "
                                    baseColor={colors?.baseColor}
                                    highlightColor={colors?.highlightColor}
                                />
                            </>
                        ) : (
                            <>
                                <video
                                    src={row?.reelId?.video}
                                    style={{
                                        borderRadius: "10px",
                                        objectFit: "cover",
                                        boxSizing: "border-box",
                                    }}
                                    controls
                                    height={50}
                                    width={50}
                                    alt=""
                                />
                            </>
                        )}
                    </div>
                </div>
            ),
        },
        {
            Header: "Thumbnail",
            body: "thumbnail",
            Cell: ({ row }) => (
                <div className="">
                    <div className="">
                        {loading ? (
                            <>
                                <Skeleton
                                    height={54}
                                    width={54}
                                    className="StripeElement "
                                    baseColor={colors?.baseColor}
                                    highlightColor={colors?.highlightColor}
                                />
                            </>
                        ) : (
                            <>
                                <img
                                    src={row?.reelId?.thumbnail}
                                    style={{
                                        borderRadius: "10px",
                                        objectFit: "cover",
                                        boxSizing: "border-box",
                                    }}
                                    height={50}
                                    width={50}
                                    alt=""
                                />
                            </>
                        )}
                    </div>
                </div>
            ),
        },

        {
            Header: "Video report reason",
            body: "videoReportReason",
            Cell: ({ row }) => (
                <div className="">
                    <p className="mb-0 fw-normal text-white">
                        {row?.description
                        }
                    </p>
                </div>
            ),
        },

        {
            Header: "Status",
            body: "status",
            Cell: ({ row }) => (
                <div className="">
                    <p className="mb-0 fw-normal text-white">{row?.reelId?.videoType === 1 ? "Pending" : "Solved"}</p>
                </div>
            ),
        },

        {
            Header: "Video reported",
            body: "videoReported",
            Cell: ({ row }) => (
                <div className="">
                    <p className="mb-0 fw-normal text-white">{row?.reportDate?.split(",")[0]}</p>
                </div>
            ),
        },

        {
            Header: "Action",
            body: "",
            Cell: ({ row }) => (
                <div className="d-flex justify-content-center align-items-center gap-2">
                    <button
                        className="action-btn accept-btn"
                        onClick={() => handleClick(row?._id)}
                        title="Accept Request"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </button>

                    <button
                        className="action-btn decline-btn"
                        title="Decline Request"
                        onClick={() => {
                            handleDecline(row?._id, row?.reelId?._id);
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M3 6h18M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                            />
                            <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>

                    </button>
                </div>
            ),
        }
    ];


    return (

        <>
            <div className="mainSellerTable">
                <div className="sellerTable">
                    <div className="col-12 headname">Video Report</div>
                    <div className="sellerMain">
                        <div className="tableMain mt-2 categoryTable">
                            <div className="sellerHeader primeHeader">
                                <div className="row mb-3" >
                                    {/* Left side - Transaction Type Dropdown */}
                                    <div className="col-6" style={{ display: "flex", alignItems: "center" }}>
                                        <div className="btn-group">
                                            <button
                                                type="button"
                                                className="btn btnnewPrime dropdown-toggle"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                                style={{
                                                    borderRadius: "5px",
                                                    padding: "8px 40px",
                                                    background: "#fff",
                                                    marginLeft: "5px"
                                                }}
                                            >
                                                {type ? (
                                                    <span className="caret text-black">{type === "All"
                                                        ? "All"
                                                        : type === "1"
                                                            ? "Pending"
                                                            : type === "2"
                                                                ? "Solved"
                                                                : "Type"
                                                    }
                                                    </span>
                                                ) : (
                                                    <span className="caret text-capitalize">Type</span>
                                                )}
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li style={{ cursor: "pointer" }}>
                                                    <a
                                                        className="dropdown-item"
                                                        href={() => false}
                                                        onClick={() => setType("All")}
                                                    >
                                                        All
                                                    </a>
                                                </li>
                                                <li style={{ cursor: "pointer" }}>
                                                    <a
                                                        className="dropdown-item"
                                                        href={() => false}
                                                        onClick={() => setType("1")}
                                                    >
                                                        Pending
                                                    </a>
                                                </li>
                                                <li style={{ cursor: "pointer" }}>
                                                    <a
                                                        className="dropdown-item"
                                                        href={() => false}
                                                        onClick={() => setType("2")}
                                                    >
                                                        Solved
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <Table
                                data={data}
                                mapData={mapData}
                                serverPerPage={rowsPerPage}      // Direct use
                                serverPage={currentPage}        // Direct use
                                type={"server"}
                            />
                            <Pagination
                                component="div"
                                count={videoReport.length}
                                type={"server"}
                                onPageChange={handleChangePage}
                                serverPerPage={rowsPerPage}
                                totalData={videoReport.length}
                                serverPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </div>
                    </div>
                    <div className="sellerFooter primeFooter"></div>
                </div>
            </div>
        </>
    )
}

export default VideoReport