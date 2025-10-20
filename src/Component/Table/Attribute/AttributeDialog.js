import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  // Switch,
  FormControlLabel,
  Typography,
  Box,
  Divider,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { useDispatch, useSelector } from "react-redux";

import {
  createAttribute,
  getAllSubcategory,
  updateAttribute,
} from "../../store/attribute/attribute.action";
import { CLOSE_DIALOGUE } from "../../store/dialogue/dialogue.type";
import { baseURL } from "../../../util/config";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { getCategory } from "../../store/category/category.action";
import { getCategoryWiseSubCategory } from "../../store/subCategory/subCategory.action";

const CustomSwitch = styled(Switch)(({ theme }) => ({
  width: 46,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(20px)",
      "& + .MuiSwitch-track": {
        backgroundColor: "#b93160",
        opacity: 1,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "#fff",
    width: 18,
    height: 18,
    boxShadow: "none",
  },
  "& .MuiSwitch-track": {
    backgroundColor: "#cccccc",
    borderRadius: 26 / 2,
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const AttributeDialog = () => {
  const dialogueDataFromStore = useSelector(
    (state) => state.dialogue.dialogueData
  );

  // For temporary testing override
  const dialogueData = dialogueDataFromStore ?? true; // fallback to true if undefined

  console.log("dialogueData", dialogueData);

  const { subcategory } = useSelector((state) => state.attribute);

  const { category } = useSelector((state) => state.category);
  const { categoryWiseSubCategory } = useSelector((state) => state.subCategory);
  console.log("categoryWiseSubCategory**", categoryWiseSubCategory);

  
  const dispatch = useDispatch();


  const [selectedcategoryOptions, setSelectedCategoryOptions] = useState('');
  console.log("selectedcategoryOptions", selectedcategoryOptions);
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
    if (!dialogueData) return;

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

  const categoryOptions = category.map((item) => ({
    value: item._id,
    label: item.name,
  }));


  const options = categoryWiseSubCategory.map((item) => ({
    value: item.subCategoryId,
    label: item.name,
  }));

  // const handleChangeCategory = (selected) => {
  //   console.log("selected", selected);
  //    setSelectedCategoryOptions(selected);
  //   if (error.category) {
  //     setError((prev) => ({ ...prev, category: "" }));
  //   }
  // }

  const handleChangeCategory = (selected) => {
    setSelectedCategoryOptions(selected);
    setSelectedOptions([]); // Clear subcategories selection when category changes
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
    console.log("pehle challa");
    // dispatch(getAllSubcategory());
  }, [dispatch]);

  useEffect(() => {
    if (selectedcategoryOptions !== "") {
      console.log("Bad me chalaaaaa");
      dispatch(getCategoryWiseSubCategory(selectedcategoryOptions?.value));
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
    if (!selectedcategoryOptions || selectedcategoryOptions.length === 0) {
      newErrors.category = "Please select at least one category.";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // 
    if (!validateForm()) return;
    const isChoiceType = ["4", "5", "6"].includes(fieldType);
    const formData = new FormData();
    if (mongoId) {
      formData.append("attributeId", mongoId);
    } else {
      console.error("Error: mongoId is not set");
    }
    formData.append("name", name.trim());
    formData.append("fieldType", Number(fieldType));
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
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    if (mongoId) {
      dispatch(updateAttribute(formData));
    } else {
      dispatch(createAttribute(formData));
    }
    dispatch({ type: CLOSE_DIALOGUE });
  };

  useEffect(() => {
    return () => {
      if (
        preview &&
        typeof preview === "string" &&
        preview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <Dialog
      open={Boolean(dialogueData)}
      onClose={() => dispatch({ type: CLOSE_DIALOGUE })}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "18px",
          width: "600px",
          maxWidth: "100vw",
          padding: "6px 5px",
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" component="span">
          {mongoId ? "Edit Attribute" : "Create Attribute"}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 1 }}>


            {/* category */}

            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 0.5 }}>
                Select Category
              </Typography>
              <Select
                options={categoryOptions}
                value={selectedcategoryOptions}
                onChange={handleChangeCategory}
                placeholder="Select Category..."
                isDisabled={Boolean(mongoId)} // Disable when editing
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: 8,
                    minHeight: 48,
                  }),
                }}
              />
              {error.category && (
                <Typography variant="caption" color="error">
                  {error.category}
                </Typography>
              )}
            </Grid>



            {/* category */}

            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 0.5 }}>
                Select Subcategories
              </Typography>
              {/* <Select
                isMulti
                options={options}
                value={selectedOptions}
                onChange={handleChange}
                placeholder="Select subcategories..."
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: 8,
                    minHeight: 48,
                  }),
                }}
              /> */}

              <Select
                isMulti
                options={options}
                value={selectedOptions}
                onChange={handleChange}
                placeholder="Select subcategories..."
                isDisabled={Boolean(mongoId)} // Disable when editing
                styles={{

                  menu: (base) => ({
                    ...base,
                    backgroundColor: '#fff', // Ensures the dropdown is solid white
                    zIndex: 100, // Improves stacking above fields if needed
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: '#b93160',
                    borderRadius: 20,
                    padding: '0 6px 0 12px',
                    display: 'flex',
                    alignItems: 'center'
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '1rem',
                    padding: '2px 8px 2px 0',
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    backgroundColor: '#fff',
                    color: '#b93160',
                    borderRadius: '50%',
                    minWidth: 22,
                    minHeight: 22,
                    width: 22,
                    height: 22,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 5,
                    boxShadow: '0 1px 4px rgba(185,49,96,0.09)',
                    border: 'none',
                    fontSize: 18,
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.1s',
                    // Optionally uncomment below for hover effect
                    // ':hover': {
                    //   backgroundColor: '#b93160',
                    //   color: '#fff',
                    // },
                  }),
                  control: (base) => ({
                    ...base,
                    borderRadius: 8,
                    minHeight: 48,
                  }),
                }}
              />



              {error.subcategories && (
                <Typography variant="caption" color="error">
                  {error.subcategories}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Field Name"
                value={name}
                fullWidth
                onChange={(e) => {
                  setName(e.target.value);
                  if (error.name) setError((prev) => ({ ...prev, name: "" }));
                }}
                error={Boolean(error.name)}
                helperText={error.name}
                sx={{
                  borderRadius: 1,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Field Type"
                value={fieldType}
                fullWidth
                onChange={(e) => {
                  setFieldType(e.target.value);
                  if (error.fieldType)
                    setError((prev) => ({ ...prev, fieldType: "" }));
                }}
                error={Boolean(error.fieldType)}
                helperText={error.fieldType}
                sx={{ borderRadius: 1 }}
              >
                <MenuItem value="5">Dropdown</MenuItem>
                <MenuItem value="6">Checkboxes</MenuItem>
              </TextField>
            </Grid>
            {["4", "5", "6"].includes(fieldType) && (
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Field Values
                </Typography>
                {/* <CreatableSelect
                  isMulti
                  value={fieldValues}
                  onChange={(newValue) => {
                    setFieldValues(newValue);
                    if (error.fieldValues)
                      setError((prev) => ({ ...prev, fieldValues: "" }));
                  }}
                  placeholder="Type and press enter..."
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: 8,
                      minHeight: 48,
                    }),
                  }}
                /> */}
                <CreatableSelect
                  isMulti
                  value={fieldValues}
                  onChange={setFieldValues}
                  placeholder="Type and press enter..."
                  styles={{
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: '#b93160',
                      borderRadius: 20,
                      padding: '0 6px 0 12px',
                      display: 'flex',
                      alignItems: 'center'
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '1rem',
                      padding: '2px 8px 2px 0',
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      backgroundColor: '#fff',
                      color: '#b93160',                 // cross visible always
                      borderRadius: '50%',
                      minWidth: 22,
                      minHeight: 22,
                      width: 22,
                      height: 22,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: 5,
                      boxShadow: '0 1px 4px rgba(185,49,96,0.09)',
                      border: 'none',
                      fontSize: 18,
                      cursor: 'pointer',
                      padding: 0,
                      transition: 'all 0.1s',
                      ':hover': {
                        // backgroundColor: '#b93160',
                        // color: '#fff',             // reverse color on hover
                      },
                    }),
                  }}
                />

                {error.fieldValues && (
                  <Typography variant="caption" color="error">
                    {error.fieldValues}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary">
                  This will be applied only for: <strong>Checkboxes</strong> and{" "}
                  <strong>Dropdown</strong>.
                </Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                Attribute Icon
              </Typography>
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: 1,
                  border: "1px dashed",
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  position: "relative",
                  mb: 1,
                  mt: 1,
                }}
              >
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Attribute Icon"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 0.2s",
                        cursor: "pointer",
                        "&:hover": { opacity: 1 },
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="white"
                        align="center"
                      >
                        Click to change
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <PhotoCameraIcon color="action" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                  }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setIcon(file);
                      const objectUrl = URL.createObjectURL(file);
                      setPreview(objectUrl);
                    }
                    if (error.icon) setError((prev) => ({ ...prev, icon: "" }));
                  }}
                />
              </Box>
              <Button
                variant="outlined"
                startIcon={<PhotoCameraIcon />}
                component="label"
                size="small"
                sx={{ width: "fit-content", mb: 2 }}
              >
                {preview ? "Change Icon" : "Upload Icon"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setIcon(file);
                      const objectUrl = URL.createObjectURL(file);
                      setPreview(objectUrl);
                    }
                    if (error.icon) setError((prev) => ({ ...prev, icon: "" }));
                  }}
                />
              </Button>
              <Typography
                variant="body2"
                color="text.secondary"
                className="mt-2"
              >
                Recommended size: 256x256 pixels. Maximum file size: 2MB.
                <br />
                Formats: JPG, PNG, GIF
              </Typography>
              {error.icon && (
                <Typography variant="caption" color="error" display="block">
                  {error.icon}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", gap: 2 }}>
              <FormControlLabel
                control={
                  <CustomSwitch
                    checked={isRequired}
                    onChange={() => setIsRequired(!isRequired)}
                  />
                }
                label="Required"
              />
              <FormControlLabel
                control={
                  <CustomSwitch
                    checked={isActive}
                    onChange={() => setIsActive(!isActive)}
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => dispatch({ type: CLOSE_DIALOGUE })}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {mongoId ? "Update" : "Submit"}
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AttributeDialog;





// import React, { useEffect, useState } from "react";
// import Select from "react-select";
// import CreatableSelect from "react-select/creatable";
// import Button from "../../extra/Button";
// import Input from "../../extra/Input";
// import { CLOSE_DIALOGUE } from "../../store/dialogue/dialogue.type";
// import { connect, useDispatch, useSelector } from "react-redux";
// 
// import {
//   createAttribute,
//   getAllSubcategory,
//   updateAttribute,
// } from "../../store/attribute/attribute.action";
// import { baseURL } from "../../../util/config";

// const AttributeDialog = () => {
//   const { dialogueData } = useSelector((state) => state.dialogue);
//   console.log("dialogueData", dialogueData);

//   const { subcategory } = useSelector((state) => state.attribute);

//   
//   const dispatch = useDispatch();

//   const [selectedOptions, setSelectedOptions] = useState([]);

//   const [mongoId, setMongoId] = useState("");
//   const [name, setName] = useState();

//   const [fieldType, setFieldType] = useState();
//   // const [minLength, setMinLength] = useState("");
//   // const [maxLength, setMaxLength] = useState("");
//   const [fieldValues, setFieldValues] = useState([]);
//   const [icon, setIcon] = useState(null);
//   const [isRequired, setIsRequired] = useState(false);
//   const [isActive, setIsActive] = useState(false);
//   const [preview, setPreview] = useState("");


//   const [error, setError] = useState({
//     subcategories: "",
//     name: "",
//     fieldType: "",
//     // minLength: "",
//     // maxLength: "",
//     fieldValues: "",
//     icon: "",
//   });

//   useEffect(() => {
//     if (!dialogueData) return;


//     setSelectedOptions(
//       dialogueData?.subCategory
//         ? [{
//           value: dialogueData.subCategory._id,
//           label: dialogueData.subCategory.name,
//         }]
//         : []
//     );

//     const attr = dialogueData?.attributes?.[0];

//     setMongoId(attr?._id || "");
//     setName(attr?.name || "");
//     setFieldType(attr?.fieldType?.toString() || "");

//     // Set Input Lengths (only for text/number)
//     // if (["1", "2"].includes(attr?.fieldType?.toString())) {
//     //   setMinLength(attr?.minLength?.toString() || "");
//     //   setMaxLength(attr?.maxLength?.toString() || "");
//     // } else {
//     //   setMinLength("");
//     //   setMaxLength("");
//     // }

//     // Set Values for Choice fields (radio, dropdown, checkbox)
//     if (["4", "5", "6"].includes(attr?.fieldType?.toString())) {
//       setFieldValues(attr?.values?.map((v) => ({ value: v, label: v })) || []);
//     } else {
//       setFieldValues([]);
//     }

//     setIcon(attr?.image ? baseURL + attr.image : "");
//     setPreview(attr?.image ? baseURL + attr.image : "");
//     setIsRequired(attr?.isRequired || false);
//     setIsActive(attr?.isActive || false);
//   }, [dialogueData]);


//   const options = subcategory.map((item) => ({
//     value: item._id,
//     label: item.name,
//   }));

//   const handleChange = (selected) => {
//     setSelectedOptions(selected);
//     if (error.subcategories) {
//       setError((prev) => ({ ...prev, subcategories: "" }));
//     }
//   };

//   useEffect(() => {
//     dispatch(getAllSubcategory());
//   }, []);


//   const validateForm = () => {
//     let newErrors = {
//       subcategories: "",
//       name: "",
//       fieldType: "",
//       // minLength: "",
//       // maxLength: "",
//       fieldValues: "",
//       icon: "",
//     };
//     let isValid = true;

//     if (!selectedOptions || selectedOptions.length === 0) {
//       newErrors.subcategories = "Please select at least one subcategory.";
//       isValid = false;
//     }

//     if (!name || !name.trim()) {
//       newErrors.name = "Field name is required.";
//       isValid = false;
//     }

//     if (!fieldType) {
//       newErrors.fieldType = "Please select a field type.";
//       isValid = false;
//     }

//     // if (fieldType === "1" || fieldType === "2") {
//     //   if (!minLength) {
//     //     newErrors.minLength = "Min length is required.";
//     //     isValid = false;
//     //   }
//     //   if (!maxLength) {
//     //     newErrors.maxLength = "Max length is required.";
//     //     isValid = false;
//     //   }
//     //   if (Number(minLength) > Number(maxLength)) {
//     //     newErrors.maxLength = "Max length must be greater than Min length.";
//     //     isValid = false;
//     //   }
//     // }

//     if (["4", "5", "6"].includes(fieldType)) {
//       if (!fieldValues || fieldValues.length === 0) {
//         newErrors.fieldValues = "Please provide at least one field value.";
//         isValid = false;
//       }
//     }

//     if (!icon) {
//       newErrors.icon = "Please upload an icon image.";
//       isValid = false;
//     }

//     setError(newErrors);
//     return isValid;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     

//     if (!validateForm()) return;

//     // const isInputType = fieldType === "1" || fieldType === "2";
//     const isChoiceType = ["4", "5", "6"].includes(fieldType);

//     const formData = new FormData();

//     // Check if mongoId exists (this should be the 'attributeId' for update)
//     if (mongoId) {
//       formData.append("attributeId", mongoId);  // Make sure mongoId is correctly set
//     } else {
//       console.log("Error: mongoId is not set");
//     }

//     formData.append("name", name?.trim());
//     formData.append("fieldType", Number(fieldType));
//     formData.append("isRequired", isRequired);
//     formData.append("isActive", isActive);

//     // if (isInputType) {
//     //   formData.append("minLength", Number(minLength));
//     //   formData.append("maxLength", Number(maxLength));
//     // }

//     if (isChoiceType) {
//       fieldValues.forEach((v) => {
//         formData.append("values", v.value);
//       });
//     }

//     // For creation, append selected subcategories as an array
//     if (!mongoId && selectedOptions.length > 0) {
//       selectedOptions.forEach((item) => {
//         formData.append("subCategoryIds[]", item.value); // Use the array syntax here
//       });
//     }

//     if (icon && typeof icon !== "string") {
//       // Only append if it's a new File
//       formData.append("image", icon);
//     }

//     // Log formData for debugging
//     for (let [key, value] of formData.entries()) {
//       console.log(`${key}:`, value);  // Ensure that attributeId is appended
//     }

//     if (mongoId) {
//       dispatch(updateAttribute(formData)); // Dispatch update when mongoId is present
//     } else {
//       dispatch(createAttribute(formData)); // Dispatch create when mongoId is not present
//     }

//     dispatch({ type: CLOSE_DIALOGUE });
//   };




//   useEffect(() => {
//     return () => {
//       if (preview && typeof preview === "string" && preview.startsWith("blob:")) {
//         URL.revokeObjectURL(preview);
//       }
//     };
//   }, [preview]);

//   return (
//     <form onSubmit={handleSubmit}>
//       <div className="mainDialogue fade-in">
//         <div className="Dialogue">
//           <div className="dialogueHeader">
//             <div className="headerTitle text-dark fw-bold">Attribute</div>
//             <div
//               className="closeBtn "
//               onClick={() => {
//                 dispatch({ type: CLOSE_DIALOGUE });
//               }}
//             >
//               <i class="fa-solid fa-xmark"></i>
//             </div>
//           </div>

//           <div className="dialogueMain" style={{ padding: "0px 20px" }}>
//             <div className="row">
//               <div className="col-12">
//                 <label>Select Subcategories</label>
//                 <Select
//                   isMulti
//                   options={options}
//                   value={selectedOptions}
//                   onChange={handleChange}
//                   isDisabled={dialogueData}
//                   placeholder="Select subcategories..."
//                 />
//                 {error.subcategories && (
//                   <small className="text-danger">{error.subcategories}</small>
//                 )}
//               </div>

//               <div className="col-12 mt-4">
//                 <label htmlFor="fieldName">
//                   Field Name <span className="text-muted" style={{ fontSize: "14px" }}>(e.g. "Color", "Size", "Material")</span>
//                 </label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={name}
//                   placeholder="Enter Name..."
//                   onChange={(e) => {
//                     setName(e.target.value);
//                     if (error.name) {
//                       setError((prev) => ({ ...prev, name: "" }));
//                     }
//                   }}
//                 />
//                 {error.name && (
//                   <small className="text-danger">{error.name}</small>
//                 )}
//               </div>

//               <div className="col-12 mt-4">
//                 <label>
//                   Field Type
//                 </label>
//                 <select
//                   className="form-control"
//                   value={fieldType}
//                   onChange={(e) => {
//                     setFieldType(e.target.value);

//                     if (error.fieldType) {
//                       setError((prev) => ({ ...prev, fieldType: "" }));
//                     }
//                   }}
//                 >
//                   <option value="" hidden>
//                     Select field type
//                   </option>
//                   {/* <option value="1">Text Input</option>
//                   <option value="2">Number Input</option>
//                   <option value="3">File Input</option>
//                   <option value="4">Radio</option> */}
//                   <option value="5">Dropdown</option>
//                   <option value="6">Checkboxes</option>
//                 </select>
//                 {error.fieldType && (
//                   <small className="text-danger">{error.fieldType}</small>
//                 )}
//               </div>

//               {/* Field Length (Min/Max) - for Text/Number Input */}
//               {/* {(fieldType === "1" || fieldType === "2") && (
//                 <div className="row mt-4">
//                   <div className="col-md-6">
//                     <label>Field Length (Min)</label>
//                     <input
//                       type="number"
//                       className="form-control"
//                       value={minLength}
//                       onChange={(e) => {
//                         setMinLength(e.target.value);
//                         if (error.minLength) {
//                           setError((prev) => ({ ...prev, minLength: "" }));
//                         }
//                       }}
//                     />
//                     {error.minLength && (
//                       <small className="text-danger">{error.minLength}</small>
//                     )}
//                     <small className="text-muted">
//                       This will be applied only for:{" "}
//                       <span className="text-danger">number</span> .
//                     </small>
//                   </div>

//                   <div className="col-md-6">
//                     <label>Field Length (Max)</label>
//                     <input
//                       type="number"
//                       className="form-control"
//                       value={maxLength}
//                       onChange={(e) => {
//                         setMaxLength(e.target.value);
//                         if (error.maxLength) {
//                           setError((prev) => ({ ...prev, maxLength: "" }));
//                         }
//                       }}
//                     />
//                     {error.maxLength && (
//                       <small className="text-danger">{error.maxLength}</small>
//                     )}
//                     <small className="text-muted">
//                       This will be applied only for:{" "}
//                       <span className="text-danger">number</span> .
//                     </small>
//                   </div>
//                 </div>
//               )} */}

//               {["4", "5", "6"].includes(fieldType) && (
//                 <div className="col-12 mt-4">
//                   <label>Field Values</label>
//                   <CreatableSelect
//                     isMulti
//                     value={fieldValues}
//                     onChange={(newValue) => {
//                       setFieldValues(newValue);

//                       if (error.fieldValues) {
//                         setError((prev) => ({ ...prev, fieldValues: "" }));
//                       }
//                     }}
//                     placeholder="Type and press enter..."
//                     classNamePrefix="react-select"
//                   />
//                   {error.fieldValues && (
//                     <small className="text-danger">{error.fieldValues}</small>
//                   )}
//                   <small className="text-muted">
//                     This will be applied only for:{" "}
//                     <span className="text-danger">Checkboxes</span>,{" "}
//                     <span className="text-danger">Radio</span> and{" "}
//                     <span className="text-danger">Dropdown</span>.
//                   </small>
//                 </div>
//               )}

//               <div className="col-12 mt-3">
//                 <label>Icon</label>
//                 <input
//                   type="file"
//                   className="form-control"
//                   accept="image/*"
//                   onChange={(e) => {
//                     const file = e.target.files[0];
//                     if (file) {
//                       setIcon(file);
//                       const objectUrl = URL.createObjectURL(file);
//                       setPreview(objectUrl);
//                     }
//                     if (error.icon) {
//                       setError((prev) => ({ ...prev, icon: "" }));
//                     }
//                   }}
//                 />
//                 <p style={{ color: '#ff2e2e', marginTop: '6px', fontSize: '12px' }}>
//                   Please select an image file (JPG, JPEG, PNG, WebP).
//                 </p>
//                 {error.icon && (
//                   <small className="text-danger">{error.icon}</small>
//                 )}
//                 <small className="text-muted">(use 256 × 256 size for better view)</small>

//                 {preview && (
//                   <div className="mt-2">
//                     <label className="fw-semibold">Preview:</label>
//                     <br />
//                     <img
//                       src={preview}
//                       alt="Selected Icon"
//                       style={{
//                         width: "64px",
//                         height: "64px",
//                         objectFit: "contain",
//                         border: "1px solid #ccc",
//                         borderRadius: "4px",
//                       }}
//                     />
//                   </div>
//                 )}
//               </div>


//               <div className="col-12 mt-3 d-flex align-items-center gap-4">
//                 <div className="form-check form-switch">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     checked={isRequired}
//                     onChange={() => setIsRequired(!isRequired)}
//                     id="requiredSwitch"
//                     style={{
//                       backgroundColor: isRequired ? "#b93160" : "",
//                       borderColor: "#b93160",
//                     }}
//                   />

//                   <label className="form-check-label" htmlFor="requiredSwitch">
//                     Required
//                   </label>
//                 </div>

//                 <div className="form-check form-switch">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     checked={isActive}
//                     onChange={() => setIsActive(!isActive)}
//                     id="activeSwitch"
//                     style={{
//                       backgroundColor: isActive ? "#b93160" : "",
//                       borderColor: "#b93160",
//                     }}
//                   />

//                   <label className="form-check-label" htmlFor="activeSwitch">
//                     Active
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="dialogueFooter">
//             <div className="dialogueBtn">
//               {!mongoId ? (
//                 <>
//                   <Button
//                     btnName={`Submit`}
//                     btnColor={`btnBlackPrime text-light`}
//                     style={{
//                       borderRadius: "5px",
//                       backgroundColor: "#b93160",
//                       width: "80px",
//                     }}
//                     newClass={`me-2`}
//                     onClick={handleSubmit}
//                   />
//                 </>
//               ) : (
//                 <>
//                   <Button
//                     btnName={`Update`}
//                     btnColor={`btnBlackPrime text-light`}
//                     style={{ borderRadius: "5px", width: "80px" }}
//                     newClass={`me-2`}
//                     onClick={handleSubmit}
//                   />
//                 </>
//               )}
//               <Button
//                 btnName={`Close`}
//                 btnColor="myCustomButton"
//                 style={{ borderRadius: "5px", width: "80px" }}
//                 onClick={() => {
//                   dispatch({ type: CLOSE_DIALOGUE });
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default connect(null, { createAttribute, updateAttribute })(
//   AttributeDialog
// );
