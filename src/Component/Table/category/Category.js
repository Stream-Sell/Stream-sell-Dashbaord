import React from "react";
import Button from "../../extra/Button";
import { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import Table from "../../extra/Table";
import {
  getCategory,
  deleteCategory,
} from "../../store/category/category.action";
import { OPEN_DIALOGUE } from "../../store/dialogue/dialogue.type";
import CategoryDialog from "./CategoryDialog";
import { warning } from "../../../util/Alert";
import { useNavigate } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";
import { colors } from "../../../util/SkeletonColor";
import { useState } from "react";
import Iconb from "../../extra/Iconb";
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoOutlined from '@mui/icons-material/InfoOutlined';

const Category = (props) => {
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const { category } = useSelector((state) => state.category);
  const { dialogue, dialogueType } = useSelector((state) => state.dialogue);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setData(category);
  }, [category]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  const handleDelete = (id) => {
    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          dispatch(deleteCategory(id));
        }
      })
      .catch((err) => console.log(err));
  };

  const mapData = [
    {
      Header: "No",
      width: "60px",
      Cell: ({ index }) => <span className="fw-normal">{index + 1}</span>,
    },
    {
      Header: "Image",
      body: "image",
      Cell: ({ row }) => (
        <>
          {loading ? (
            <Skeleton
              height={50}
              width={50}
              circle={true}
              className="StripeElement"
              baseColor={colors?.baseColor}
              highlightColor={colors?.highlightColor}
            />
          ) : (
            <img
              src={row.image}
              style={{
                borderRadius: "12px",
                cursor: "pointer",
                objectFit: "cover",
                border: "2px solid #f1f3f4",
              }}
              height={50}
              width={50}
              alt="category"
              onClick={() =>
                navigate("/admin/category/subCategory", {
                  state: { id: row?._id },
                })
              }
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/dummy.png";
              }}
            />
          )}
        </>
      ),
    },
    {
      Header: "Category Name",
      body: "name",
      Cell: ({ row }) => (
        <div>
          <p className="mb-0 text-capitalize fw-medium" style={{ color: "#1a1a1a" }}>
            {row.name}
          </p>
        </div>
      ),
    },
    {
      Header: "Products",
      body: "categoryProduct",
      Cell: ({ row }) => (
        <div>
          <span
            className="badge"
            style={{
              background: "#e0f2fe",
              color: "#0369a1",
              padding: "6px 12px",
              borderRadius: "6px",
              fontWeight: "600",
              fontSize: "13px",
            }}
          >
            {row.categoryProduct ? row.categoryProduct : 0}
          </span>
        </div>
      ),
    },
    {
      Header: "Sub Categories",
      body: "totalSubcategory",
      Cell: ({ row }) => (
        <div>
          <span
            className="badge"
            style={{
              background: "#f0fdf4",
              color: "#15803d",
              padding: "6px 12px",
              borderRadius: "6px",
              fontWeight: "600",
              fontSize: "13px",
            }}
          >
            {row?.totalSubcategory ? row?.totalSubcategory : 0}
          </span>
        </div>
      ),
    },
    {
      Header: "Actions",
      body: "",
      Cell: ({ row }) => (
        <div className="d-flex gap-2 align-items-center">
          <Iconb
            newClass="themeFont boxCenter"
            btnIcon={
              <CreateOutlinedIcon
                sx={{ color: "#3b82f6", fontSize: "20px" }}
              />
            }
            style={{
              borderRadius: "8px",
              height: "38px",
              width: "38px",
              background: "#eff6ff",
              border: "1px solid #dbeafe",
              transition: "all 0.2s ease",
            }}
            isImage={true}
            onClick={() => {
              dispatch({
                type: OPEN_DIALOGUE,
                payload: { data: row, type: "Category" },
              });
            }}
          />

          <Iconb
            newClass="themeFont boxCenter"
            btnIcon={
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            }
            style={{
              borderRadius: "8px",
              height: "38px",
              width: "38px",
              background: "#f0fdf4",
              border: "1px solid #dcfce7",
              transition: "all 0.2s ease",
            }}
            isImage={true}
            onClick={() =>
              navigate("/admin/category/subCategory", {
                state: { id: row?._id },
              })
            }
          />

          <Iconb
            newClass="themeFont boxCenter"
            btnIcon={
              <InfoOutlined sx={{ color: "#6b7280", fontSize: "20px" }} />
            }
            style={{
              borderRadius: "8px",
              height: "38px",
              width: "38px",
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              transition: "all 0.2s ease",
            }}
            isImage={true}
            onClick={() =>
              navigate("/admin/category/subCategory", {
                state: { id: row?._id },
              })
            }
          />

          <Iconb
            newClass="themeFont boxCenter"
            btnIcon={<DeleteIcon sx={{ color: "#ef4444", fontSize: "20px" }} />}
            style={{
              borderRadius: "8px",
              height: "38px",
              width: "38px",
              background: "#fef2f2",
              border: "1px solid #fee2e2",
              transition: "all 0.2s ease",
            }}
            isImage={true}
            isDeleted={true}
            onClick={() => handleDelete(row?._id)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <style jsx>{`
        .mainSellerTable {
          background: #f8f9fa;
          min-height: 100vh;
          padding: 24px;
        }

        .sellerTable {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          border: 1px solid #e8eaed;
          overflow: hidden;
        }

        .headname {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          padding: 24px 24px 0 24px;
          letter-spacing: -0.5px;
        }

        .sellerMain {
          padding: 0;
        }

        .tableMain {
          padding: 0;
        }

        .sellerHeader {
          padding: 20px 24px;
          border-bottom: 1px solid #f1f3f4;
          background: #fafbfc;
        }

        .primeHeader {
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }

        .btnBlackPrime {
          background: #3b82f6 !important;
          color: #ffffff !important;
          border: none !important;
          padding: 10px 24px !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          transition: all 0.2s ease !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 8px !important;
        }

        .btnBlackPrime:hover {
          background: #2563eb !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
        }

        .btnBlackPrime i {
          font-size: 14px;
        }

        .categoryTable table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        .categoryTable thead th {
          background: #fafbfc;
          color: #6b7280;
          font-weight: 600;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 16px 20px;
          border-bottom: 2px solid #e8eaed;
          white-space: nowrap;
        }

        .categoryTable tbody td {
          padding: 16px 20px;
          border-bottom: 1px solid #f1f3f4;
          color: #1a1a1a;
          font-size: 14px;
          vertical-align: middle;
        }

        .categoryTable tbody tr:last-child td {
          border-bottom: none;
        }

        .categoryTable tbody tr:hover {
          background: #fafbfc;
          transition: background 0.2s ease;
        }

        .themeFont.boxCenter:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
        }

        .badge {
          display: inline-block;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .mainSellerTable {
            padding: 16px;
          }

          .headname {
            font-size: 20px;
            padding: 20px 16px 0 16px;
          }

          .sellerHeader {
            padding: 16px;
          }

          .categoryTable thead th,
          .categoryTable tbody td {
            padding: 12px 16px;
            font-size: 13px;
          }
        }
      `}</style>

      <div className="mainSellerTable">
        <div className="sellerTable">
          <div className="col-12 headname">Categories</div>
          <div className="sellerMain">
            <div className="tableMain mt-2 categoryTable">
              <div className="sellerHeader primeHeader">
                <div className="row w-100">
                  <div className="col-12 d-flex justify-content-end">
                    <Button
                      newClass="whiteFont"
                      btnColor="btnBlackPrime"
                      btnIcon="fa-solid fa-plus"
                      btnName="Add Category"
                      onClick={() => {
                        dispatch({
                          type: OPEN_DIALOGUE,
                          payload: { type: "Category" },
                        });
                      }}
                    />
                    {dialogue && dialogueType === "Category" && <CategoryDialog />}
                  </div>
                </div>
              </div>
              <Table
                data={data}
                mapData={mapData}
                PerPage={rowsPerPage}
                Page={page}
                type={"client"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, {
  getCategory,
  deleteCategory,
})(Category);