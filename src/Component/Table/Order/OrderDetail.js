import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { getOrderDetail, orderUpdate } from "../../store/order/order.action";
import { useLocation, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { colors } from "../../../util/SkeletonColor";
import { getSetting } from "../../store/setting/setting.action";
import { baseURL } from "../../../util/config";

const OrderDetail = () => {
  const { orderDetail } = useSelector((state) => state.order);
  console.log("orderDetail******", orderDetail);

  const { setting } = useSelector((state) => state.setting);
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // console.log("Order Detail:", orderDetail);


  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getSetting());
    dispatch(getOrderDetail(state?._id || state));
  }, [dispatch, state]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const getBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "badge-success";
      case "pending":
        return "badge-warning";
      case "confirmed":
        return "badge-primary"; // or "badge-info"
      case "out for delivery":
      case "out_of_delivery":
        return "badge-info";
      case "cancel":
      case "cancelled":
        return "badge-danger";
      default:
        return "badge-secondary";
    }
  };

  return (
    <div className=" mt-4 shadow-md  " style={{ margin: "0px 35px" }}>
      <div className="row flex-column-reverse flex-md-row">
        <div className="d-flex justify-content-between flex-wrap mb-3">
          <div>
            <h4 className="fw-semibold mb-2">Order {orderDetail?.orderId}</h4>
            <h6 className="text-muted">({orderDetail?.items?.length} items)</h6>
          </div>

          <div>
            <button
              onClick={() => navigate(-1)}
              className="btn   rounded-pill px-4 mb-4"
              style={{ border: "1px solid #5C3AEB", backgroundColor: "#5C3AEB", color: "#fff" }}
            >
              ← Back
            </button>
          </div>
        </div>

        {/* LEFT SIDE: Product Items */}
        <div className="col-12 col-md-8">
          {orderDetail?.items?.map((item, idx) => (
            <div className="d-flex flex-column flex-sm-row mb-4 p-3 border  bg-white shadow-sm" style={{ borderRadius: "5px" }} key={idx}>
              {loading ? (
                <>
                  <Skeleton
                    height={120}
                    width={100}
                    className="rounded me-3"
                    baseColor={colors?.baseColor}
                    highlightColor={colors?.highlightColor}
                  />
                  <div className="flex-grow-1 mt-3 mt-sm-0 w-100">
                    <Skeleton height={20} width="60%" className="mb-2" />
                    <Skeleton height={15} width="80%" className="mb-1" />
                    <Skeleton height={15} width="70%" className="mb-3" />
                    <div className="d-flex justify-content-between">
                      <Skeleton height={20} width="30%" />
                      <Skeleton height={20} width="20%" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={item.productId?.mainImage}
                    alt=""
                    className="me-3 img-fluid"
                    style={{
                      width: "100px",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "8px"
                    }}
                  />
                  <div className="flex-grow-1 mt-3 mt-sm-0">
                    <h6 className="fw-semibold mb-1">{item.productId?.productName}</h6>
                    {/* <div className="text-muted small mb-2">
                      {item.attributesArray?.map((att, i) => (
                        <span key={i} className="me-3">
                          {att.name}:
                          <strong>
                            {att.name.toLowerCase().includes("color") ? (
                              <span
                                style={{
                                  display: "inline-block",
                                  width: "10px",
                                  height: "10px",
                                  backgroundColor: att.value,
                                  borderRadius: "10%",
                                  marginLeft: "5px"
                                }}
                              />
                            ) : (
                              att.value
                            )}
                          </strong>
                        </span>
                      ))}
                    </div> */}

                    {/* <div className="text-muted small mb-2">
                      {item.attributesArray?.map((att, i) => (
                        <span key={i} className="me-3">
                          <span className="fw-semibold">{att.name}:</span>{" "}
                          {att.fieldType === 1 || att.fieldType === 2 ? (
                            // Show minLength and maxLength for fieldType 1 or 2
                            <span>
                              <span className="badge bg-light text-dark border me-1">
                                Min: <b>{att.minLength}</b>
                              </span>
                              <span className="badge bg-light text-dark border">
                                Max: <b>{att.maxLength}</b>
                              </span>
                            </span>
                          ) : (att.fieldType === 4 || att.fieldType === 5 || att.fieldType === 6) && Array.isArray(att.values) ? (
                            // Show values as list of tags for fieldType 4, 5, 6
                            <span>
                              {att.values.map((val, vi) => (
                                <span
                                  key={vi}
                                  className="badge bg-light text-dark border me-1"
                                  style={{ borderRadius: "8px", fontWeight: 500, fontSize: 13 }}
                                >
                                  {typeof val === "object" && val !== null
                                    ? (val.value || val.name || Object.values(val)[0])
                                    : String(val)}
                                </span>
                              ))}
                            </span>
                          ) : (
                            // Default: show att.value (like old code)
                            <span className="ms-1 fw-semibold">{att.value ?? "-"}</span>
                          )}
                        </span>
                      ))}
                    </div> */}

                    <div className="fw-bold mt-2">
                      Seller : {item?.sellerId?.firstName || "-" + " " + item?.sellerId?.lastName || "-"}
                    </div>

                    <div className="fw-bold mt-2">
                      Quantity : {item?.productQuantity || "-"}
                    </div>

                    <div className="text-muted small mb-2">
                      <div className="fw-bold mt-2 mb-1">
                        Attributes
                      </div>
                      {item.attributesArray?.map((att, i) => (
                        <span key={i} className="me-3">
                          <img src={att.image ? att.image.includes("http") ? att.image : `${baseURL}${att.image}` : ""} alt="" className="me-3 img-fluid" style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }} />
                          <span className="fw-semibold">{att.name}:</span>{" "}
                          {/* Show values as tags if 'values' is an array, otherwise show "-" */}
                          {Array.isArray(att.values) && att.values.length > 0 ? (
                            <span>
                              {att.values.map((val, vi) => (
                                <span
                                  key={vi}
                                  // className="badge bg-light text-dark border me-1"
                                  style={{ borderRadius: "8px", fontWeight: 500, fontSize: 13 }}
                                >
                                  {typeof val === "object" && val !== null
                                    ? (val.value || val.name || Object.values(val)[0])
                                    : String(val)}
                                </span>
                              ))}
                            </span>
                          ) : (
                            <span className="ms-1 fw-semibold">-</span>
                          )}
                        </span>
                      ))}
                    </div>




                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
                      <div className="fw-bold mt-2">
                        {item.purchasedTimeProductPrice.toFixed(2)}({setting?.currency?.symbol})
                      </div>
                      <div className="mt-2">
                        <span className={`badge ${getBadgeClass(item.status)}`}>
                          {item.status}
                        </span>

                      </div>
                    </div>
                  </div>


                </>
              )}
            </div>
          ))}
        </div>


        {/* RIGHT SIDE: Summary + Address + Logistics */}
        <div className="col-12 col-md-4 mt-4 mt-md-0" >
          {/* Cart Total */}
          <div className="border p-4 rounded bg-light mb-4" style={{ borderRadius: "5px" }}>
            <h5 className="mb-3 fw-bold">CART TOTAL</h5>
            <p className="mb-1 fw-semibold">Special Instructions For Seller</p>
            <div className="d-flex justify-content-between mb-1">
              <span>Subtotal</span>
              <strong>{setting?.currency?.symbol}{orderDetail?.subTotal}</strong>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <span>Discount</span>
              <strong className="text-danger">{setting?.currency?.symbol} {orderDetail?.discount}</strong>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <span>Shipping</span>
              <strong className="text-success">+{setting?.currency?.symbol} {orderDetail?.totalShippingCharges}</strong>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-1">
              <span>Total</span>
              <strong className="fs-5">{setting?.currency?.symbol} {orderDetail?.finalTotal}</strong>
            </div>
          </div>

          {/* Shipping Address */}
          {orderDetail?.shippingAddress && (
            <div className="border p-4 rounded bg-light mb-4" style={{ borderRadius: "5px" }}>
              <h5 className="mb-3 fw-bold">SHIPPING ADDRESS</h5>
              <p className="mb-1"><strong>Name : </strong> {orderDetail?.shippingAddress?.name ? orderDetail?.shippingAddress?.name : "-"}</p>
              <p className="mb-1"><strong>Address : </strong> {orderDetail?.shippingAddress?.address ? orderDetail?.shippingAddress?.address : "-"}</p>
              <p className="mb-1"><strong>City : </strong> {orderDetail?.shippingAddress?.city ? orderDetail?.shippingAddress?.city : "-"}</p>
              <p className="mb-1"><strong>State : </strong> {orderDetail?.shippingAddress?.state ? orderDetail?.shippingAddress?.state : "-"}</p>
              <p className="mb-1"><strong>Zip Code : </strong> {orderDetail?.shippingAddress?.zipCode ? orderDetail?.shippingAddress?.zipCode : "-"}</p>
              <p className="mb-1"><strong>Country : </strong> {orderDetail?.shippingAddress?.country ? orderDetail?.shippingAddress?.country : "-"}</p>
            </div>
          )}

          {/* Promo Code */}
          <div className="border p-4 rounded bg-light mb-4" style={{ borderRadius: "5px" }}>
            <h5 className="mb-3 fw-bold">Promo Code</h5>
            {orderDetail?.promoCode ? (
              <>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Promo Code : </span>
                  <strong className="text-success">{orderDetail?.promoCode?.promoCode ? orderDetail?.promoCode?.promoCode : "-"}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Discount Amount : </span>
                  <strong className="text-danger">{orderDetail?.promoCode?.discountAmount ? orderDetail?.promoCode?.discountAmount : "-"}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Discount Type : </span>
                  <strong>{orderDetail?.promoCode?.discountType ? orderDetail?.promoCode?.discountType : "-"}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Conditions : </span>
                  <strong>{orderDetail?.promoCode?.conditions ? orderDetail?.promoCode?.conditions : "-"}</strong>
                </div>
              </>
            ) : (
              <div className="text-muted">No Promo Code Applied</div>
            )}
          </div>

          {/* Logistics */}
          {orderDetail?.logistics && (
            <div className="border p-4 rounded bg-light mb-4" style={{ borderRadius: "5px" }}>
              <h5 className="mb-3 fw-bold">LOGISTICS DETAILS</h5>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Tracking Link:</span>
                <a href={orderDetail?.logistics?.trackingLink} target="_blank" rel="noopener noreferrer" className="text-decoration-underline">
                  {orderDetail?.logistics?.trackingLink ? "Track Order" : "Not Available"}
                </a>
              </div>
              <div className="mt-3 text-muted">
                <strong>Status: </strong>
                <span className={orderDetail?.logistics?.status === "Delivered" ? "text-success" : "text-danger"}>
                  {orderDetail?.logistics?.status}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default connect(null, { getOrderDetail, orderUpdate })(OrderDetail);
