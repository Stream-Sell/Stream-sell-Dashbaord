import React, { useEffect, useState } from "react";
import Button from "../../extra/Button";
import { CLOSE_DIALOGUE } from "../../store/dialogue/dialogue.type";
import Input from "../../extra/Input";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  createCategory,
  updateCategory,
} from "../../store/category/category.action";

const CategoryDialog = (props) => {
  const { dialogueData } = useSelector((state) => state.dialogue);

  const [mongoId, setMongoId] = useState(0);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [imagePath, setImagePath] = useState("");
  const [error, setError] = useState({
    name: "",
    image: "",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    setMongoId(dialogueData?._id);
    setName(dialogueData?.name);
    setImagePath(dialogueData?.image);
  }, [dialogueData]);

  const handleImage = (e) => {
    setError((prevErrors) => ({
      ...prevErrors,
      image: "",
    }));
    setImage(e.target.files[0]);
    setImagePath(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = () => {
    if (!name || !imagePath) {
      let error = {};
      if (!name) error.name = "Name is Required !";
      if (!imagePath) error.image = "Image is required!";

      return setError({ ...error });
    } else {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image);

      if (mongoId) {
        dispatch(updateCategory(formData, mongoId));
      } else {
        dispatch(createCategory(formData));
      }
      dispatch({ type: CLOSE_DIALOGUE });
    }
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
          max-width: 500px;
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

        .image-start {
          margin-top: 16px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 12px;
          border: 2px dashed #e5e7eb;
          display: inline-block;
        }

        .image-start img {
          border-radius: 8px;
          object-fit: cover;
          display: block;
          border: 2px solid #e5e7eb;
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
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
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
          transform: translateY(-1px);
        }

        .col-12 {
          margin-bottom: 20px;
        }

        .col-12:last-child {
          margin-bottom: 0;
        }

        @media (max-width: 576px) {
          .Dialogue {
            width: 95%;
            max-width: 95%;
          }

          .dialogueHeader {
            padding: 20px 20px;
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
            flex-direction: column;
          }

          .btnBlackPrime,
          .myCustomButton {
            width: 100% !important;
            min-width: 100% !important;
          }
        }
      `}</style>

      <div className="mainDialogue fade-in">
        <div className="Dialogue">
          <div className="dialogueHeader">
            <div className="headerTitle">
              {mongoId ? "Edit Category" : "Add Category"}
            </div>
            <div
              className="closeBtn"
              onClick={() => {
                dispatch({ type: CLOSE_DIALOGUE });
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </div>
          </div>
          <div className="dialogueMain">
            <div className="row">
              <div className="col-12">
                <Input
                  label="Category Name"
                  id="name"
                  newClass="text-capitalize"
                  type="text"
                  value={name}
                  placeholder="Enter category name"
                  errorMessage={error.name && error.name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!e.target.value) {
                      return setError({
                        ...error,
                        name: "Name Is Required",
                      });
                    } else {
                      return setError({
                        ...error,
                        name: "",
                      });
                    }
                  }}
                />
              </div>
              <div className="col-12">
                <Input
                  label="Category Image"
                  id="image"
                  type="file"
                  accept="image/*"
                  errorMessage={error.image && error.image}
                  onChange={(e) => handleImage(e)}
                />
                {imagePath && (
                  <div className="image-start">
                    <img
                      src={imagePath}
                      alt="category preview"
                      draggable="false"
                      width={120}
                      height={120}
                      className="m-0"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="dialogueFooter">
            <div className="dialogueBtn">
              <Button
                btnName="Cancel"
                btnColor="myCustomButton"
                onClick={() => {
                  dispatch({ type: CLOSE_DIALOGUE });
                }}
              />
              {!mongoId ? (
                <Button
                  btnName="Create"
                  btnColor="btnBlackPrime text-light"
                  onClick={handleSubmit}
                />
              ) : (
                <Button
                  btnName="Update"
                  btnColor="btnBlackPrime text-light"
                  onClick={handleSubmit}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { createCategory, updateCategory })(
  CategoryDialog
);