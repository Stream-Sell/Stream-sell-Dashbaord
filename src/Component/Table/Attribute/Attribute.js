import React, { useEffect, useState } from "react";
import Button from "../../extra/Button";
import { connect, useDispatch, useSelector } from "react-redux";
import Table from "../../extra/Table";
import {
  getAttribute,
  deleteAttribute,
  getAllSubcategory,
} from "../../store/attribute/attribute.action";
import { OPEN_DIALOGUE } from "../../store/dialogue/dialogue.type";
import AttributeDialog from "./AttributeDialog";
import { warning } from "../../../util/Alert";
import dayjs from "dayjs";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";
import { colors } from "../../../util/SkeletonColor";
import Iconb from "../../extra/Iconb";
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import Select from 'react-select';
import { baseURL } from "../../../util/config";

const Attribute = (props) => {
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedOptions, setSelectedOptions] = useState({ value: "All", label: "All" });
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const fieldTypeOptions = [
    { value: "All", label: "All" }, // Default option
    { value: "5", label: "Dropdown" },
    { value: "6", label: "Checkboxes" },
  ];
  const [fieldType, setFieldType] = useState({ value: "All", label: "All" });


  const { attribute } = useSelector((state) => state.attribute);

  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );
  const { subcategory } = useSelector((state) => state.attribute);
  

  useEffect(() => {
    dispatch(getAttribute({
      subCategoryId: selectedOptions.value || "All",
      fieldType: fieldType.value || "All"
    }));
  }, [dispatch, selectedOptions, fieldType]);

  useEffect(() => {
    setData(attribute);
  }, [attribute]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  // Delete PromoCode
  const handleDelete = (id) => {
    console.log("id", id);
    

    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          dispatch(deleteAttribute(id));
        }
      })
      .catch((err) => console.log(err));
  };



  const options = [
    { value: "All", label: "All" },  // manual "All" entry
    ...subcategory.map((item) => ({
      value: item._id,
      label: item.name
    }))
  ];




  const handleChange = (selected) => {
    setSelectedOptions(selected);  // selected item ko state me daal do

    if (selected?.value === "All") {
      // agar "All" selected hai, toh pura data dikhao
      setData(attribute);
    } else {
      // specific subcategory filter kar ke dikhao
      const filtered = attribute.filter((attr) =>
        attr?.subcategories?.includes(selected.value)
      );
      setData(filtered);
    }
  };


  useEffect(() => {
    dispatch(getAllSubcategory());
  }, [])



  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Adjust the delay time as needed

    return () => clearTimeout(timer);
  }, []);



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
              src={row.attributes ? row.attributes[0]?.image.includes("http") ? row.attributes[0]?.image : baseURL + row.attributes[0]?.image : "/dummy.png"}
              style={{
                borderRadius: "12px",
                cursor: "pointer",
                objectFit: "cover",
                border: "2px solid #f1f3f4",
              }}
              height={50}
              width={50}
              alt="attribute"
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
      Header: "Attribute Name",
      body: "name",
      Cell: ({ row }) => {
        const attribute = row?.attributes && row?.attributes.length > 0 ? row.attributes[0] : null;
        return (
          <div>
            <p className="mb-0 text-capitalize fw-medium" style={{ color: "#1a1a1a" }}>
              {attribute ? attribute.name : "-"}
            </p>
          </div>
        );
      },
    },
    {
      Header: "Subcategory",
      body: "subcategory",
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
            {row?.subCategory?.name ? row?.subCategory?.name : "-"}
          </span>
        </div>
      ),
    },
    {
      Header: "Type",
      body: "type",
      Cell: ({ row }) => {
        const typeMap = {
          1: "Text Input",
          2: "Number Input",
          3: "File Input",
          4: "Radio",
          5: "Dropdown",
          6: "Checkboxes",
        };
        const fieldType = row?.attributes?.[0]?.fieldType;
        return (
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
              {typeMap[fieldType] || "Unknown"}
            </span>
          </div>
        );
      },
    },
    {
      Header: "Created Date",
      body: "createdAt",
      Cell: ({ row }) => (
        <span className="fw-normal" style={{ color: "#6b7280" }}>
          {dayjs(row?.createdAt).format("DD MMM YYYY")}
        </span>
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
                payload: { data: row, type: "attribute" },
              });
            }}
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

        .attributeTable table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        .attributeTable thead th {
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

        .attributeTable tbody td {
          padding: 16px 20px;
          border-bottom: 1px solid #f1f3f4;
          color: #1a1a1a;
          font-size: 14px;
          vertical-align: middle;
        }

        .attributeTable tbody tr:last-child td {
          border-bottom: none;
        }

        .attributeTable tbody tr:hover {
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

        .filters {
          padding: 20px 24px;
          border-bottom: 1px solid #f1f3f4;
          background: #fafbfc;
        }

        .filters .d-flex {
          gap: 20px;
          align-items: end;
        }

        .filters label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #374151;
          font-size: 14px;
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

          .attributeTable thead th,
          .attributeTable tbody td {
            padding: 12px 16px;
            font-size: 13px;
          }

          .filters .d-flex {
            flex-direction: column;
            gap: 16px;
          }
        }
      `}</style>

      <div className="mainSellerTable">
        <div className="sellerTable">
          <div className="col-12 headname">Attributes</div>
          <div className="sellerMain">
            <div className="tableMain mt-2 attributeTable">
              <div className="sellerHeader primeHeader">
                <div className="row w-100">
                  <div className="col-12 d-flex justify-content-end">
                    <Button
                      newClass="whiteFont"
                      btnColor="btnBlackPrime"
                      btnIcon="fa-solid fa-plus"
                      btnName="Add Attribute"
                      onClick={() => {
                        dispatch({
                          type: OPEN_DIALOGUE,
                          payload: { type: "attribute" },
                        });
                      }}
                    />
                    {dialogue && dialogueType === "attribute" && <AttributeDialog />}
                  </div>
                </div>
              </div>
              <div className="filters">
                <div className="d-flex">
                  <div className="col-3">
                    <label>Subcategory</label>
                    <Select
                      options={options}
                      value={selectedOptions}
                      onChange={handleChange}
                      placeholder="Select Subcategory..."
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: 8,
                          minHeight: 48,
                          borderColor: '#d1d5db',
                        }),
                      }}
                    />
                  </div>
                  <div className="col-3">
                    <label>Field Type</label>
                    <Select
                      options={fieldTypeOptions}
                      value={fieldType}
                      onChange={(selected) => setFieldType(selected)}
                      placeholder="Select field type..."
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: 8,
                          minHeight: 48,
                          borderColor: '#d1d5db',
                        }),
                      }}
                    />
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

export default connect(null, { getAttribute, deleteAttribute })(Attribute);
