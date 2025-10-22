import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import Button from "../../extra/Button";
import Input from "../../extra/Input";
import { CLOSE_DIALOGUE } from "../../store/dialogue/dialogue.type";
import {
  createPromoCode,
  updatePromoCode,
} from "../../store/PromoCode/promoCode.action";

const PromoDialog = (props) => {
  const { dialogueData } = useSelector((state) => state.dialogue);
  const dispatch = useDispatch();

  const [mongoId, setMongoId] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [minOrderValue, setMinOrderValue] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [conditions, setConditions] = useState("");
  const [discountType, setDiscountType] = useState("");
  const [error, setError] = useState({
    discountAmount: "",
    conditions: "",
    promoCode: "",
    discountType: "",
    minOrderValue: "",
  });

  useEffect(() => {
    setMongoId(dialogueData?._id);
    setConditions(dialogueData?.conditions?.join(", ") || "");
    setPromoCode(dialogueData?.promoCode || "");
    setMinOrderValue(dialogueData?.minOrderValue || "");
    setDiscountAmount(dialogueData?.discountAmount || "");
    setDiscountType(dialogueData?.discountType?.toString() || "");
  }, [dialogueData]);

  const handleSubmit = () => {
    const parsedMinOrder = parseFloat(minOrderValue);
    const parsedDiscountAmount = parseFloat(discountAmount);

    let validationError = {};
    if (!promoCode || !promoCode.trim()) {
      validationError.promoCode = "Promo code is required";
    }
    if (!conditions || !conditions.trim()) {
      validationError.conditions = "Conditions are required";
    }
    if (!minOrderValue) {
      validationError.minOrderValue = "Minimum order value is required";
    } else if (isNaN(parsedMinOrder) || parsedMinOrder <= 0) {
      validationError.minOrderValue = "Enter a valid minimum order value";
    }
    if (!discountAmount) {
      validationError.discountAmount = "Discount amount is required";
    } else if (isNaN(parsedDiscountAmount) || parsedDiscountAmount <= 0) {
      validationError.discountAmount = "Enter a valid discount amount";
    }
    if (discountType === "") {
      validationError.discountType = "Please select a discount type";
    }

    if (Object.keys(validationError).length > 0) {
      return setError(validationError);
    }

    const conditionsArray = conditions.split(",").map((c) => c.trim()).filter((c) => c);

    const data = {
      promoCode: promoCode.trim(),
      conditions: conditionsArray,
      discountAmount: parsedDiscountAmount,
      discountType: parseInt(discountType, 10),
      minOrderValue: parsedMinOrder,
    };

    if (mongoId) {
      props.updatePromoCode(data, mongoId);
    } else {
      props.createPromoCode(data);
    }

    dispatch({ type: CLOSE_DIALOGUE });
  };

  return (
    <>
      <style jsx>{`
        .mainDialogue {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.2s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .Dialogue {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow: hidden;
          animation: slideUp 0.3s ease-out;
        }
        .dialogueHeader {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          padding: 24px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .headerTitle {
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.3px;
        }
        .closeBtn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #ffffff;
          font-size: 18px;
        }
        .closeBtn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }
        .dialogueMain {
          padding: 28px;
          max-height: calc(90vh - 180px);
          overflow-y: auto;
        }
        .dialogueMain::-webkit-scrollbar {
          width: 6px;
        }
        .dialogueMain::-webkit-scrollbar-track {
          background: #f9fafb;
        }
        .dialogueMain::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .dialogueMain::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .dialogueFooter {
          padding: 20px 28px;
          background: #fafbfc;
          border-top: 1px solid #e8eaed;
        }
        .dialogueBtn {
          display: flex;
          gap: 12px;
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
          min-width: 100px !important;
        }
        .btnBlackPrime:hover {
          background: #2563eb !important;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2) !important;
        }
        .myCustomButton {
          background: #ffffff !important;
          color: #6b7280 !important;
          border: 1px solid #e5e7eb !important;
          padding: 10px 24px !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          transition: all 0.2s ease !important;
          min-width: 100px !important;
        }
        .myCustomButton:hover {
          background: #f9fafb !important;
          border-color: #d1d5db !important;
        }
        .col-12,
        .col-6 {
          margin-bottom: 20px;
        }
        .styleForTitle {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
          font-size: 14px;
        }
        .form-control {
          border-radius: 8px;
          border: 1px solid #d1d5db;
          padding: 10px 14px;
          font-size: 14px;
          transition: all 0.2s ease;
        }
        .form-control:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .form-control.error {
          border-color: #ef4444;
        }
        .errorMessage {
          color: #ef4444;
          font-size: 12px;
          margin-top: 4px;
          font-weight: 500;
        }
        select.form-control {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23374151' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 12px;
          padding-right: 36px;
        }
        textarea.form-control {
          resize: vertical;
          min-height: 120px;
        }
        .noteBox {
          padding: 12px 16px;
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          border-radius: 8px;
          margin-top: 12px;
        }
        .noteBox p {
          margin: 0;
          font-size: 13px;
          color: #92400e;
        }
        .noteBox b {
          color: #78350f;
          font-weight: 600;
        }
        @media (max-width: 576px) {
          .Dialogue {
            width: 95%;
            max-width: 95%;
          }
          .dialogueHeader {
            padding: 20px;
          }
          .headerTitle {
            font-size: 18px;
          }
          .dialogueMain {
            padding: 20px;
          }
          .dialogueFooter {
            padding: 16px 20px;
          }
          .dialogueBtn {
            flex-direction: column-reverse;
          }
          .btnBlackPrime,
          .myCustomButton {
            width: 100% !important;
            min-width: 100% !important;
          }
          .col-6 {
            flex: 0 0 100%;
            max-width: 100%;
          }
        }
      `}</style>

      <div className="mainDialogue fade-in">
        <div className="Dialogue">
          <div className="dialogueHeader">
            <div className="headerTitle">
              {mongoId ? "Edit Promo Code" : "Add Promo Code"}
            </div>
            <div
              className="closeBtn"
              onClick={() => dispatch({ type: CLOSE_DIALOGUE })}
            >
              <i className="fa-solid fa-xmark"></i>
            </div>
          </div>

          <div className="dialogueMain">
            <div className="row">
              <div className="col-12">
                <Input
                  label="Promo Code"
                  id="promoCode"
                  type="text"
                  value={promoCode}
                  placeholder="Enter promo code (e.g., SAVE20)"
                  errorMessage={error.promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value.toUpperCase());
                    if (error.promoCode) {
                      setError({ ...error, promoCode: "" });
                    }
                  }}
                />
              </div>

              <div className="col-6">
                <label className="styleForTitle">Discount Type</label>
                <select
                  className={`form-control ${error.discountType ? "error" : ""}`}
                  value={discountType}
                  onChange={(e) => {
                    setDiscountType(e.target.value);
                    if (error.discountType) {
                      setError({ ...error, discountType: "" });
                    }
                  }}
                >
                  <option value="">Select discount type</option>
                  <option value="0">Flat Amount ($)</option>
                  <option value="1">Percentage (%)</option>
                </select>
                {error.discountType && (
                  <p className="errorMessage">{error.discountType}</p>
                )}
              </div>

              <div className="col-6">
                <Input
                  label="Discount Amount"
                  id="discountAmount"
                  type="number"
                  value={discountAmount}
                  placeholder={discountType === "1" ? "e.g., 20" : "e.g., 10"}
                  errorMessage={error.discountAmount}
                  onChange={(e) => {
                    setDiscountAmount(e.target.value);
                    if (error.discountAmount) {
                      setError({ ...error, discountAmount: "" });
                    }
                  }}
                />
              </div>

              <div className="col-12">
                <Input
                  label="Minimum Order Value ($)"
                  id="minOrderValue"
                  type="number"
                  value={minOrderValue}
                  placeholder="e.g., 50"
                  errorMessage={error.minOrderValue}
                  onChange={(e) => {
                    setMinOrderValue(e.target.value);
                    if (error.minOrderValue) {
                      setError({ ...error, minOrderValue: "" });
                    }
                  }}
                />
              </div>

              <div className="col-12">
                <label className="styleForTitle">Conditions</label>
                <textarea
                  className={`form-control ${error.conditions ? "error" : ""}`}
                  placeholder="Enter conditions separated by commas..."
                  value={conditions}
                  onChange={(e) => {
                    setConditions(e.target.value);
                    if (error.conditions) {
                      setError({ ...error, conditions: "" });
                    }
                  }}
                />
                <div className="noteBox">
                  <p>
                    <b>Note:</b> Add multiple conditions separated by commas. Example: Valid for first-time users, Cannot be combined with other offers, Expires in 30 days
                  </p>
                </div>
                {error.conditions && (
                  <p className="errorMessage">{error.conditions}</p>
                )}
              </div>
            </div>
          </div>

          <div className="dialogueFooter">
            <div className="dialogueBtn">
              <Button
                btnName="Cancel"
                btnColor="myCustomButton"
                type="button"
                onClick={() => dispatch({ type: CLOSE_DIALOGUE })}
              />
              <Button
                btnName={mongoId ? "Update" : "Create"}
                btnColor="btnBlackPrime text-light"
                type="button"
                onClick={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { createPromoCode, updatePromoCode })(PromoDialog);