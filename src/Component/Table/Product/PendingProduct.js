import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import Button from "../../extra/Button";
import Searching from "../../extra/Searching";
import {
  getProductRequest,
  productAction,
  getUpdateProductRequest,
  updateProductAction,
} from "../../store/product/product.action";
import Table from "../../extra/Table";
import Pagination from "../../extra/Pagination";
import Skeleton from "react-loading-skeleton";
import { colors } from "../../../util/SkeletonColor";
import "react-loading-skeleton/dist/skeleton.css";
import { getDefaultCurrency } from "../../store/currency/currency.action";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Iconb from "../../extra/Iconb";

const PendingProduct = (props) => {
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const [updateData, setupdateData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [type, setType] = useState("Pending");
  const [status, setStatus] = useState("Create");

  const { productRequest, updateProductRequest } = useSelector(
    (state) => state.product
  );
  const { defaultCurrency } = useSelector((state) => state.currency);

  useEffect(() => {
    if (status === "Create") {
      dispatch(getProductRequest(type));
      setData([]);
    } else {
      dispatch(getUpdateProductRequest(type));
      setData([]);
    }
  }, [dispatch, type, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (status === "Create") {
      setData(productRequest);
    } else {
      setupdateData(updateProductRequest);
    }
  }, [productRequest, updateProductRequest, status]);

  useEffect(() => {
    dispatch(getDefaultCurrency());
  }, [dispatch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  const handleApproved = (productId) => {
    if (status === "Create") {
      props.productAction(productId, "Approved");
    } else {
      props.updateProductAction(productId, "Approved");
    }
  };

  const handleRejected = (productId) => {
    if (status === "Create") {
      props.productAction(productId, "Rejected");
    } else {
      props.updateProductAction(productId, "Rejected");
    }
  };

  const mapData = [
    {
      Header: "No",
      width: "20px",
      Cell: ({ index }) => (
        <span className="text-white fw-normal">{parseInt(index) + 1}</span>
      ),
    },
    {
      Header: "Product",
      body: "image",
      Cell: ({ row }) => (
        <div className="d-flex align-items-center">
          <div className="position-relative">
            {loading ? (
              <Skeleton
                height={60}
                width={60}
                className="StripeElement"
                baseColor={colors?.baseColor}
                highlightColor={colors?.highlightColor}
                style={{ borderRadius: "10px" }}
              />
            ) : (
              <img
                src={row?.mainImage}
                height={60}
                width={60}
                style={{
                  borderRadius: "10px",
                  objectFit: "cover",
                  border: "2px solid #e5e7eb",
                }}
                alt={row.productName}
              />
            )}
          </div>
          <div className="ms-3">
            <div className="text-white fw-semibold" style={{ fontSize: "14px" }}>
              {row.productName}
            </div>
            <div className="text-white" style={{ fontSize: "12px", opacity: 0.7 }}>
              Code: {row.productCode}
            </div>
          </div>
        </div>
      ),
    },
    {
      Header: `Price ${defaultCurrency?.symbol || ""}`,
      body: "price",
      Cell: ({ row }) => (
        <span className="fw-semibold text-white" style={{ fontSize: "14px" }}>
          {defaultCurrency?.symbol}{row.price}
        </span>
      ),
    },
    {
      Header: `Shipping ${defaultCurrency?.symbol || ""}`,
      body: "shippingCharges",
      Cell: ({ row }) => (
        <span className="text-white fw-normal" style={{ fontSize: "14px" }}>
          {defaultCurrency?.symbol}{row.shippingCharges}
        </span>
      ),
    },
    {
      Header: "Created Date",
      body: "createdAt",
      Cell: ({ row }) => (
        <span className="text-white fw-normal" style={{ fontSize: "13px" }}>
          {dayjs(row.createdAt).format("DD MMM YYYY")}
        </span>
      ),
    },
    {
      Header: "Status",
      body: "status",
      Cell: ({ row }) => {
        const statusText = status === "Create" ? row.createStatus : row.updateStatus;
        const statusColor = 
          statusText === "Pending" ? "#fbbf24" :
          statusText === "Approved" ? "#10b981" :
          statusText === "Rejected" ? "#ef4444" : "#6b7280";
        
        return (
          <div className="boxCenter">
            <span
              className="badge"
              style={{
                backgroundColor: statusColor,
                color: "#ffffff",
                padding: "6px 14px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              {statusText}
            </span>
          </div>
        );
      },
    },
    {
      Header: "Accept",
      body: "",
      Cell: ({ row }) => (
        <Iconb
          newClass="themeFont boxCenter acptbtn userBtn"
          btnIcon={<CheckCircleIcon sx={{ color: "#10b981", fontSize: 28 }} />}
          style={{
            borderRadius: "50%",
            margin: "auto",
            width: "45px",
            height: "45px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
          isImage={true}
          onClick={() => handleApproved(row?._id)}
        />
      ),
    },
    {
      Header: "Reject",
      body: "",
      Cell: ({ row }) => (
        <Iconb
          newClass="themeFont boxCenter killbtn userBtn"
          btnIcon={<CancelIcon sx={{ color: "#ef4444", fontSize: 28 }} />}
          style={{
            borderRadius: "50%",
            margin: "auto",
            width: "45px",
            height: "45px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
          isImage={true}
          onClick={() => handleRejected(row?._id)}
        />
      ),
    },
  ];

  const handleFilterData = (filteredData) => {
    if (typeof filteredData === "string") {
      setSearch(filteredData);
    } else {
      setData(filteredData);
    }
  };

  return (
    <>
      <style jsx>{`
        .toggleButton {
          position: relative;
          overflow: hidden;
        }
        .toggleButton::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }
        .toggleButton.active::after {
          transform: scaleX(1);
        }
        .statsCard {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border-radius: 12px;
          padding: 16px 20px;
          color: white;
          margin: 10px 0;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }
        .statsCard h3 {
          font-size: 28px;
          font-weight: 700;
          margin: 0;
        }
        .statsCard p {
          font-size: 13px;
          margin: 4px 0 0 0;
          opacity: 0.9;
        }
      `}</style>

      <div className="mainSellerTable">
        <div className="sellerTable">
          <div className="col-12 headname">Pending Product Requests</div>
          <div className="sellerHeader primeHeader">
            <div className="row align-items-center">
              <div className="col-12 col-md-6">
                <div
                  style={{
                    display: "flex",
                    borderRadius: "8px",
                    backgroundColor: "#f9fafb",
                    padding: "4px",
                    width: "fit-content",
                    margin: "10px 0",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <Button
                    newClass={`themeFont toggleButton ${status === "Create" ? "active" : ""}`}
                    btnName="New Items"
                    style={{
                      borderRadius: "6px",
                      backgroundColor: status === "Create" ? "#3b82f6" : "transparent",
                      color: status === "Create" ? "#ffffff" : "#6b7280",
                      cursor: "pointer",
                      fontWeight: "600",
                      padding: "10px 24px",
                      border: "none",
                      transition: "all 0.2s ease",
                      fontSize: "14px",
                    }}
                    onClick={() => setStatus("Create")}
                  />
                  <Button
                    newClass={`themeFont toggleButton ${status === "Update" ? "active" : ""}`}
                    btnName="Updated Items"
                    style={{
                      borderRadius: "6px",
                      backgroundColor: status === "Update" ? "#3b82f6" : "transparent",
                      color: status === "Update" ? "#ffffff" : "#6b7280",
                      cursor: "pointer",
                      fontWeight: "600",
                      padding: "10px 24px",
                      border: "none",
                      transition: "all 0.2s ease",
                      fontSize: "14px",
                    }}
                    onClick={() => setStatus("Update")}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="statsCard">
                  <h3>{status === "Create" ? data?.length || 0 : updateData?.length || 0}</h3>
                  <p>Pending {status === "Create" ? "New" : "Update"} Requests</p>
                </div>
              </div>
            </div>
          </div>
          <div className="sellerMain">
            <div className="tableMain" style={{ marginTop: "15px" }}>
              <div className="row">
                <div
                  className="col-12 d-flex justify-content-end"
                  style={{ padding: "10px 20px" }}
                >
                  <Searching
                    type="client"
                    data={productRequest}
                    setData={setData}
                    column={data}
                    onFilterData={handleFilterData}
                    serverSearching={handleFilterData}
                    button={true}
                    setSearchValue={setSearch}
                    searchValue={search}
                  />
                </div>
              </div>
              {type === "Pending" && (
                <Table
                  data={status === "Create" ? data : updateData}
                  mapData={mapData}
                  PerPage={rowsPerPage}
                  Page={page}
                  type="client"
                />
              )}
              <Pagination
                component="div"
                count={status === "Create" ? data?.length : updateData?.length}
                serverPage={page}
                type="client"
                onPageChange={handleChangePage}
                serverPerPage={rowsPerPage}
                totalData={status === "Create" ? data?.length : updateData?.length}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
          </div>
          <div className="sellerFooter primeFooter"></div>
        </div>
      </div>
    </>
  );
};

export default connect(null, {
  getProductRequest,
  productAction,
  getUpdateProductRequest,
  updateProductAction,
})(PendingProduct);