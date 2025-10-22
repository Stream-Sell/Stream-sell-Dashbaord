import { useNavigate } from "react-router-dom";
import Table from "../../extra/Table";
import Button from "../../extra/Button";
import Iconb from "../../extra/Iconb";
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import { connect, useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { OPEN_DIALOGUE } from "../../store/dialogue/dialogue.type";
import {
  getPromoCode,
  deletePromoCode,
} from "../../store/PromoCode/promoCode.action";
import dayjs from "dayjs";
import PromoDialog from "./PromoDialog";
import { warning } from "../../../util/Alert";

const PromoCode = (props) => {
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { promoCode } = useSelector((state) => state.promoCode);
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );

  useEffect(() => {
    dispatch(getPromoCode());
  }, [dispatch]);

  useEffect(() => {
    setData(promoCode);
  }, [promoCode]);

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
          props.deletePromoCode(id);
        }
      })
      .catch((err) => console.log(err));
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
      Header: "Promo Code",
      body: "promoCode",
      Cell: ({ row }) => (
        <span className="text-white fw-bold" style={{ 
          backgroundColor: '#3b82f6', 
          padding: '4px 12px', 
          borderRadius: '6px',
          fontSize: '13px',
          letterSpacing: '0.5px'
        }}>
          {row.promoCode}
        </span>
      ),
    },
    {
      Header: "Discount",
      body: "discountAmount",
      Cell: ({ row }) => (
        <span className="text-white fw-normal">
          {row.discountType === 0 
            ? `$${row.discountAmount}` 
            : `${row.discountAmount}%`
          }
        </span>
      ),
    },
    {
      Header: "Min. Order Value",
      body: "minOrderValue",
      Cell: ({ row }) => (
        <span className="text-white fw-normal">
          ${row.minOrderValue}
        </span>
      ),
    },
    {
      Header: "Conditions",
      body: "conditions",
      Cell: ({ row }) => {
        return (
          <div style={{ maxWidth: '300px' }}>
            {row.conditions && row.conditions.length > 0 ? (
              row.conditions.slice(0, 2).map((condition, i) => (
                <div key={i} className="text-start d-flex align-items-start mb-1">
                  <div style={{ 
                    color: "#10b981", 
                    fontSize: '12px', 
                    marginTop: '2px',
                    minWidth: '16px'
                  }}>
                    ✓
                  </div>
                  <span className="ms-2 text-white fw-normal" style={{ fontSize: '13px' }}>
                    {condition}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-white fw-normal" style={{ fontSize: '13px', opacity: 0.6 }}>
                No conditions
              </span>
            )}
            {row.conditions && row.conditions.length > 2 && (
              <div className="text-white fw-normal" style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>
                +{row.conditions.length - 2} more...
              </div>
            )}
          </div>
        );
      },
    },
    {
      Header: "Created Date",
      body: "createdAt",
      Cell: ({ row }) => (
        <span className="text-white fw-normal">
          {dayjs(row.createdAt).format("DD MMM YYYY")}
        </span>
      ),
    },
    {
      Header: "Edit",
      body: "",
      Cell: ({ row }) => (
        <Iconb
          newClass="themeFont boxCenter infobtn userBtn fs-5"
          btnIcon={<CreateOutlinedIcon sx={{ color: '#737272' }} />}
          style={{
            borderRadius: "50px",
            margin: "auto",
            height: "45px",
            width: "45px",
            color: "#160d98",
          }}
          isImage={true}
          onClick={() =>
            dispatch({
              type: OPEN_DIALOGUE,
              payload: { data: row, type: "promoCode" },
            })
          }
        />
      ),
    },
    {
      Header: "Delete",
      body: "",
      Cell: ({ row }) => (
        <Iconb
          newClass="themeFont boxCenter killbtn userBtn fs-5"
          btnIcon={<DeleteIcon sx={{ color: '#FF4C51' }} />}
          style={{
            borderRadius: "50px",
            margin: "auto",
            height: "45px",
            width: "45px",
            color: "#160d98",
            padding: "0px",
          }}
          isImage={true}
          isDeleted={true}
          onClick={() => handleDelete(row._id)}
        />
      ),
    },
  ];

  return (
    <>
      <div className="mainSellerTable">
        <div className="sellerTable">
          <div className="col-12 headname">Promo Codes</div>
          <div className="sellerMain">
            <div className="tableMain mt-2">
              <div className="row">
                <div className="col-12" style={{ margin: "12px" }}>
                  <Button
                    newClass="whiteFont"
                    btnColor="btnBlackPrime"
                    btnIcon="fa-solid fa-plus"
                    btnName="Add Promo Code"
                    onClick={() => {
                      dispatch({
                        type: OPEN_DIALOGUE,
                        payload: { type: "promoCode" },
                      });
                    }}
                    style={{
                      borderRadius: "8px",
                      padding: "10px 24px",
                      background: "#3b82f6",
                      border: "none",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  />
                  {dialogue && dialogueType === "promoCode" && <PromoDialog />}
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
          <div className="sellerFooter primeFooter"></div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { getPromoCode, deletePromoCode })(PromoCode);