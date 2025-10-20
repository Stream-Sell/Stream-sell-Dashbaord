import { Link, Navigate, useNavigate } from "react-router-dom";
import Table from "../../extra/Table";
import Button from "../../extra/Button";
import Title from "../../extra/Title";
import { connect, useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { OPEN_DIALOGUE } from "../../store/dialogue/dialogue.type";
import {
  getSellerRequest,
  acceptSellerRequest,
} from "../../store/sellerRequest/sellerRequest.action";
import ToggleSwitch from "../../extra/ToggleSwitch";
import dayjs from "dayjs";
import EditSellerRequest from "./EditSellerRequest";
import Pagination from "../../extra/Pagination";
import Searching from "../../extra/Searching";
import { warning, warningAccept } from "../../../util/Alert";

const SellerRequest = (props) => {
  

  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { sellerRequest } = useSelector((state) => state.sellerRequest);
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );

  useEffect(() => {
    dispatch(getSellerRequest());
  }, [dispatch]);
  useEffect(() => {
    setData(sellerRequest);
  }, [sellerRequest]);

  // // pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  const handleClick = (id) => {
    
   
    const data = warningAccept();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          dispatch(acceptSellerRequest(id));
        }
      })
      .catch((err) => console.log(err));
  };

  // searching
  const handleFilterData = (filteredData) => {
    if (typeof filteredData === "string") {
      setSearch(filteredData);
    } else {
      setData(filteredData);
    }
  };

  const handleEdit = (id) => {
    console.log("id::::", id);

    navigate("/admin/sellerRequestEdit", {
      state: id,
    });
  };

  const mapData = [
    {
      Header: "No",
      width: "20px",
      Cell: ({ index }) => <span className="text-white">{parseInt(index) + 1}</span>,
    },
    {
      Header: "User",
      body: "image",
      Cell: ({ row }) => (
        <div className="d-flex">
          <div className="position-relative">
            <img src={row.image} height={45} width={45} style={{ borderRadius: "90px" }} alt="" />
            {row?.isOnline && (
              <span
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "green",
                  bottom: "-4px",
                  right: "8px",
                  border: "3px solid #ffff",
                }}
                className="d-block position-absolute"
              ></span>
            )}
          </div>
          <span className="ms-3 text-start boxCenter">
            <b className="fw-normal text-white">{row?.firstName + " " + row?.lastName}</b>
          </span>
        </div>
      ),
    },

    {
      Header: "Business Name",
      body: "businessName",
      Cell: ({ row }) => (
        <span className="mb-0 text-white">
          {row?.businessName ? row?.businessName : "-"}
        </span>
      ),
    },
    {
      Header: "Gender",
      body: "gender",
      Cell: ({ row }) => (
        <span className="mb-0 text-white">{row?.gender ? row?.gender : "-"}</span>
      ),
    },
    {
      Header: "Country",
      body: "country",
      Cell: ({ row }) => <span className="text-white">{row?.address?.country}</span>,
    },

    {
      Header: "Accept",
      body: "isAccepted",
      Cell: ({ row }) => (
        <div className="">
          <ToggleSwitch
            value={row?.isAccepted}
            onClick={() => handleClick(row._id)}
          />
        </div>
      ),
    },
    {
      Header: "Created Date",
      body: "createdAt",
      Cell: ({ row }) => (
        <span className="text-white">{dayjs(row.createdAt).format("DD MMM YYYY")}</span>
      ),
    },
    // {
    //   Header: "Edit",
    //   body: "",
    //   Cell: ({ row }) => (
    //     <>
    //       <Button
    //         newClass={`themeFont boxCenter userBtn fs-5`}

    //         btnIcon={`far fa-edit`}
    //         style={{
    //           borderRadius: "5px",
    //           margin: "auto",
    //           width: "40px",
    //           backgroundColor: "#fff",
    //           color: "#160d98",
    //         }}
    //         onClick={() => handleEdit(row)}
    //       />

    //     </>
    //   ),
    // },

    // add more columns as needed
  ];
  return (
    <>
      <div className="mainSellerTable">
        <div className="sellerTable">

    <div className="col-12 headname">Pending Seller </div>
          <div className="sellerMain">
            <div className="tableMain mt-2">
              <div className="sellerHeader primeHeader">
                <div className="row">
                  <div className="col-2"></div>

                  <div className="col-10">
                    <Searching
                      type={"client"}
                      data={sellerRequest}
                      setData={setData}
                      onFilterData={handleFilterData}
                      serverSearching={handleFilterData}
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
              <Pagination
                component="div"
                count={sellerRequest?.length}
                serverPage={page}
                type={"client"}
                onPageChange={handleChangePage}
                serverPerPage={rowsPerPage}
                totalData={sellerRequest?.length}
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

export default connect(null, { getSellerRequest, acceptSellerRequest })(
  SellerRequest
);
// export default Seller;
