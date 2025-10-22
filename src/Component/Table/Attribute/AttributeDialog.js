import React, { useEffect, useState } from "react";
import Button from "../../extra/Button";
import { CLOSE_DIALOGUE } from "../../store/dialogue/dialogue.type";
import Input from "../../extra/Input";
import ToggleSwitch from "../../extra/ToggleSwitch";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  createAttribute,
  updateAttribute,
} from "../../store/attribute/attribute.action";
import { baseURL } from "../../../util/config";
import { getCategory } from "../../store/category/category.action";
import { getCategoryWiseSubCategory } from "../../store/subCategory/subCategory.action";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

const AttributeDialog = (props) => {
  const { dialogueData } = useSelector((state) => state.dialogue);
  const { subcategory } = useSelector((state) => state.attribute);
  const { category } = useSelector((state) => state.category);
  const { categoryWiseSubCategory } = useSelector((state) => state.subCategory);

  const dispatch = useDispatch();

  const [selectedcategoryOptions, setSelectedCategoryOptions] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [mongoId, setMongoId] = useState("");
  const [name, setName] = useState("");
  const [fieldType, setFieldType] = useState("");
  const [fieldValues, setFieldValues] = useState([]);
  const [icon, setIcon] = useState(null);
  const [isRequired, setIsRequired] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [preview, setPreview] = useState("");

  const [error, setError] = useState({
    category: "",
    subcategories: "",
    name: "",
    fieldType: "",
    fieldValues: "",
    icon: "",
  });

  useEffect(() => {
    setSelectedCategoryOptions(
      dialogueData?.subCategory?.category
        ? {
          value: dialogueData.subCategory?.category._id,
          label: dialogueData.subCategory?.category.name,
        }
        : ""
    );
    setSelectedOptions(
      dialogueData?.subCategory
        ? [
          {
            value: dialogueData.subCategory._id,
            label: dialogueData.subCategory.name,
          },
        ]
        : []
    );
    const attr = dialogueData?.attributes?.[0];
    setMongoId(attr?._id || "");
    setName(attr?.name || "");
    setFieldType(attr?.fieldType?.toString() || "");
    if (["4", "5", "6"].includes(attr?.fieldType?.toString())) {
      setFieldValues(attr?.values?.map((v) => ({ value: v, label: v })) || []);
    } else {
      setFieldValues([]);
    }
    setIcon(attr?.image ? baseURL + attr.image : null);
    setPreview(attr?.image ? baseURL + attr.image : "");
    setIsRequired(attr?.isRequired || false);
    setIsActive(attr?.isActive || false);
  }, [dialogueData]);

  const categoryOptions = category ? category.map((item) => ({
    value: item._id,
    label: item.name,
  })) : [];

  const options = categoryWiseSubCategory ? categoryWiseSubCategory.map((item) => ({
    value: item.subCategoryId,
    label: item.name,
  })) : [];

  const handleChangeCategory = (selected) => {
    setSelectedCategoryOptions(selected);
    setSelectedOptions([]);
    if (selected && selected.value) {
      dispatch(getCategoryWiseSubCategory(selected.value));
    }
    if (error.category) {
      setError((prev) => ({ ...prev, category: "" }));
    }
  }

  const handleChange = (selected) => {
    setSelectedOptions(selected);
    if (error.subcategories) {
      setError((prev) => ({ ...prev, subcategories: "" }));
    }
  };

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  useEffect(() => {
    if (selectedcategoryOptions && selectedcategoryOptions.value) {
      dispatch(getCategoryWiseSubCategory(selectedcategoryOptions.value));
    }
  }, [dispatch, selectedcategoryOptions]);

  const validateForm = () => {
    let newErrors = {
      category: "",
      subcategories: "",
      name: "",
      fieldType: "",
      fieldValues: "",
      icon: "",
    };
    let isValid = true;
    if (!selectedcategoryOptions || !selectedcategoryOptions.value) {
      newErrors.category = "Please select a category.";
      isValid = false;
    }
    if (!selectedOptions || selectedOptions.length === 0) {
      newErrors.subcategories = "Please select at least one subcategory.";
      isValid = false;
    }
    if (!name || !name.trim()) {
      newErrors.name = "Field name is required.";
      isValid = false;
    }
    if (!fieldType) {
      newErrors.fieldType = "Please select a field type.";
      isValid = false;
    }
    if (["4", "5", "6"].includes(fieldType)) {
      if (!fieldValues || fieldValues.length === 0) {
        newErrors.fieldValues = "Please provide at least one field value.";
        isValid = false;
      }
    }
    if (!icon) {
      newErrors.icon = "Please upload an icon image.";
      isValid = false;
    }
    setError(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const fieldTypeNumber = parseInt(fieldType, 10);
    if (isNaN(fieldTypeNumber) || fieldTypeNumber < 1 || fieldTypeNumber > 6) {
      setError((prev) => ({ ...prev, fieldType: "Invalid field type selected" }));
      return;
    }
    const isChoiceType = ["4", "5", "6"].includes(fieldType);
    const formData = new FormData();
    if (mongoId) {
      formData.append("attributeId", mongoId);
    }
    formData.append("name", name.trim());
    formData.append("fieldType", fieldTypeNumber);
    formData.append("isRequired", isRequired);
    formData.append("isActive", isActive);
    if (isChoiceType) {
      fieldValues.forEach((v) => {
        formData.append("values", v.value);
      });
    }
    if (!mongoId && selectedOptions.length > 0) {
      selectedOptions.forEach((item) => {
        formData.append("subCategoryIds[]", item.value);
      });
    }
    if (icon && typeof icon !== "string") {
      formData.append("image", icon);
    }
    if (mongoId) {
      dispatch(updateAttribute(formData));
    } else {
      dispatch(createAttribute(formData));
    }
    dispatch({ type: CLOSE_DIALOGUE });
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIcon(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      if (error.icon) {
        setError((prev) => ({ ...prev, icon: "" }));
      }
    }
  };

  useEffect(() => {
    return () => {
      if (preview && typeof preview === "string" && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

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
        .col-12 {
          margin-bottom: 20px;
        }
        .col-12:last-child {
          margin-bottom: 0;
        }
        .errorText {
          color: #ef4444;
          font-size: 12px;
          margin-top: 4px;
          font-weight: 500;
        }
        .selectWrapper label,
        .fieldValuesLabel,
        .iconSection label {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
          font-size: 14px;
        }
        .toggleSection {
          display: flex;
          gap: 24px;
          margin-top: 20px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
        }
        .toggleItem {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex: 1;
        }
        .toggleItem label {
          font-weight: 600;
          color: #374151;
          font-size: 14px;
          margin: 0;
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
          .toggleSection {
            flex-direction: column;
            gap: 16px;
          }
        }
      `}</style>

      <div className="mainDialogue fade-in">
        <div className="Dialogue">
          <div className="dialogueHeader">
            <div className="headerTitle">
              {mongoId ? "Edit Attribute" : "Add Attribute"}
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
              <div className="col-12 selectWrapper">
                <label>Select Category</label>
                <Select
                  options={categoryOptions}
                  value={selectedcategoryOptions}
                  onChange={handleChangeCategory}
                  placeholder="Select Category..."
                  isDisabled={Boolean(mongoId)}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: 8,
                      minHeight: 48,
                      borderColor: error.category ? '#ef4444' : '#d1d5db',
                      '&:hover': {
                        borderColor: error.category ? '#ef4444' : '#9ca3af',
                      }
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 100,
                    }),
                  }}
                />
                {error.category && <div className="errorText">{error.category}</div>}
              </div>

              <div className="col-12 selectWrapper">
                <label>Select Subcategories</label>
                <Select
                  isMulti
                  options={options}
                  value={selectedOptions}
                  onChange={handleChange}
                  placeholder="Select subcategories..."
                  isDisabled={Boolean(mongoId)}
                  styles={{
                    menu: (base) => ({
                      ...base,
                      backgroundColor: '#fff',
                      zIndex: 100,
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: '#3b82f6',
                      borderRadius: 20,
                      padding: '0 6px 0 12px',
                      display: 'flex',
                      alignItems: 'center'
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '14px',
                      padding: '2px 8px 2px 0',
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      backgroundColor: '#fff',
                      color: '#3b82f6',
                      borderRadius: '50%',
                      minWidth: 22,
                      minHeight: 22,
                      width: 22,
                      height: 22,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: 5,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                      border: 'none',
                      fontSize: 16,
                      cursor: 'pointer',
                      padding: 0,
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: '#fee2e2',
                        color: '#ef4444',
                      }
                    }),
                    control: (base) => ({
                      ...base,
                      borderRadius: 8,
                      minHeight: 48,
                      borderColor: error.subcategories ? '#ef4444' : '#d1d5db',
                      '&:hover': {
                        borderColor: error.subcategories ? '#ef4444' : '#9ca3af',
                      }
                    }),
                  }}
                />
                {error.subcategories && <div className="errorText">{error.subcategories}</div>}
              </div>

              <div className="col-12">
                <Input
                  label="Field Name"
                  id="name"
                  type="text"
                  value={name}
                  placeholder="Enter field name"
                  errorMessage={error.name && error.name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!e.target.value || !e.target.value.trim()) {
                      return setError({
                        ...error,
                        name: "Field name is required",
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
                  label="Field Type"
                  id="fieldType"
                  type="select"
                  value={fieldType}
                  placeholder="Select field type"
                  errorMessage={error.fieldType && error.fieldType}
                  onChange={(e) => {
                    setFieldType(e.target.value);
                    if (!e.target.value) {
                      setError({
                        ...error,
                        fieldType: "Please select a field type.",
                      });
                    } else {
                      setError({
                        ...error,
                        fieldType: "",
                      });
                    }
                    if (!["4", "5", "6"].includes(e.target.value)) {
                      setFieldValues([]);
                      setError((prev) => ({ ...prev, fieldValues: "" }));
                    }
                  }}
                >
                  <option value="">Select field type</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                </Input>
              </div>

              {["4", "5", "6"].includes(fieldType) && (
                <div className="col-12">
                  <label className="fieldValuesLabel">Field Values</label>
                  <CreatableSelect
                    isMulti
                    value={fieldValues}
                    onChange={(selected) => {
                      setFieldValues(selected || []);
                      if (error.fieldValues) {
                        setError((prev) => ({ ...prev, fieldValues: "" }));
                      }
                    }}
                    onCreateOption={(inputValue) => {
                      const newValue = { value: inputValue, label: inputValue };
                      setFieldValues([...fieldValues, newValue]);
                      if (error.fieldValues) {
                        setError((prev) => ({ ...prev, fieldValues: "" }));
                      }
                    }}
                    placeholder="Type and press enter to add values..."
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: 8,
                        minHeight: 48,
                        borderColor: error.fieldValues ? '#ef4444' : '#d1d5db',
                        '&:hover': {
                          borderColor: error.fieldValues ? '#ef4444' : '#9ca3af',
                        }
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 100,
                      }),
                      multiValue: (base) => ({
                        ...base,
                        backgroundColor: '#e0e7ff',
                        borderRadius: 6,
                      }),
                      multiValueLabel: (base) => ({
                        ...base,
                        color: '#3730a3',
                        fontWeight: 500,
                      }),
                      multiValueRemove: (base) => ({
                        ...base,
                        color: '#6366f1',
                        '&:hover': {
                          backgroundColor: '#fecaca',
                          color: '#dc2626',
                        }
                      }),
                    }}
                  />
                  {error.fieldValues && <div className="errorText">{error.fieldValues}</div>}
                </div>
              )}

              <div className="col-12 iconSection">
                <label>Icon Image</label>
                <Input
                  type="file"
                  id="icon"
                  accept="image/*"
                  errorMessage={error.icon && error.icon}
                  onChange={handleIconChange}
                />
                {preview && (
                  <div className="image-start">
                    <img src={preview} alt="Icon preview" width="100" height="100" />
                  </div>
                )}
              </div>

              <div className="toggleSection">
                <div className="toggleItem">
                  <label>Required Field</label>
                  <ToggleSwitch
                    value={isRequired}
                    onChange={() => setIsRequired(!isRequired)}
                  />
                </div>
                <div className="toggleItem">
                  <label>Active</label>
                  <ToggleSwitch
                    value={isActive}
                    onChange={() => setIsActive(!isActive)}
                  />
                </div>
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

export default AttributeDialog;