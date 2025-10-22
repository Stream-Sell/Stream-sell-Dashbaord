import { useEffect, useState } from "react";
import Input from "../../extra/Input";
import SettingBox from "./SettingBox";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  getSetting,
  updateSetting,
  handleToggleSwitch,
} from "../../store/setting/setting.action";
import { getWithdraw } from "../../store/withdraw/withdraw.action";
import Button from "../../extra/Button";

const Setting = (props) => {
  const { setting } = useSelector((state) => state.setting);
  console.log("setting", setting);


  const dispatch = useDispatch();
  // box 1
  const [, setSettingId] = useState("");
  const [zegoAppId, setZegoAppId] = useState("");
  const [minPayout, setMinPayout] = useState("");
  const [zegoAppSignIn, setZegoAppSignIn] = useState("");
  // box 2
  const [privacyPolicyLink, setPrivacyPolicyLink] = useState("");
  const [privacyPolicyText, setPrivacyPolicyText] = useState("");
  const [resendkey, setResendKey] = useState("");
  const [openaiApiKey, setOpenaiApiKey] = useState('');


  const [cancelOrderCharges, setCancelOrderCharges] = useState();
  const [adminCommissionCharges, setAdminCommissionCharges] = useState();

  const [isFakeData, setIsFakeData] = useState(false);

  // box 3

  // box 7
  const [isAddProductRequest, setIsAddProductRequest] = useState(false);
  const [isUpdateProductRequest, setIsUpdateProductRequest] = useState(false);
  const [privateKey, setPrivateKey] = useState();

  // error

  const [error, setError] = useState({
    zegoAppId: "",
    minPayout: "",
    zegoAppSignIn: "",
    privacyPolicyLink: "",
    resendKey: "",
    openaiApiKey: "",
    privacyPolicyText: "",
    // shippingCharges: "",
    withdrawCharges: "",
    withdrawLimit: "",
    cancelOrderCharges: "",
    adminCommissionCharges: "",
    razorPayId: "",
    razorSecretKey: "",
    stripePublishableKey: "",
    stripeSecretKey: "",
    privateKey,
  });

  useEffect(() => {
    dispatch(getSetting());
    dispatch(getWithdraw());
  }, [dispatch]);

  //onselect function of selecting multiple values

  //onRemove function for remove multiple values

  useEffect(() => {
    setSettingId(setting?._id);
    // box 1
    setZegoAppId(setting?.zegoAppId);
    setMinPayout(setting?.minPayout);
    setZegoAppSignIn(setting?.zegoAppSignIn);
    // box 2
    setPrivacyPolicyLink(setting?.privacyPolicyLink);
    setPrivacyPolicyText(setting?.privacyPolicyText);
    setIsFakeData(setting?.isFakeData);

    // box 7
    setIsAddProductRequest(setting?.isAddProductRequest);
    setIsUpdateProductRequest(setting?.isUpdateProductRequest);
    setPrivateKey(JSON.stringify(setting?.privateKey));
    setAdminCommissionCharges(setting?.adminCommissionCharges);
    setCancelOrderCharges(setting?.cancelOrderCharges);
    setResendKey(setting?.resendApiKey);
    setOpenaiApiKey(setting?.openaiApiKey);
  }, [setting]);

  const handleSubmit = () => {
    if (
      !zegoAppId ||
      !minPayout ||
      !zegoAppSignIn ||
      !privacyPolicyLink ||
      !resendkey ||
      !openaiApiKey ||
      !privacyPolicyText ||

      !cancelOrderCharges ||
      cancelOrderCharges <= 0 ||
      !adminCommissionCharges ||
      adminCommissionCharges <= 0
    ) {
      let error = {};
      if (!zegoAppId) error.zegoAppId = "ZegoAppId Is Required ";

      if (!minPayout) error.minPayout = "Min Payout Is Required ";

      if (!zegoAppSignIn) error.zegoAppSignIn = "ZegoAppSignIn Is Required ";
      if (!privacyPolicyLink)
        error.privacyPolicyLink = "Privacy Policy Link Is Required ";
      if (!resendkey)
        error.resendKey = "Resend Api Key Is Required ";
      if (!openaiApiKey)
        error.openaiApiKey = "Openai Api Key Is Required ";
      if (!privacyPolicyText)
        error.privacyPolicyText = "Privacy Policy Text Is Required ";

      if (!cancelOrderCharges)
        error.cancelOrderCharges = "Cancel Order Charges Is Required";
      if (cancelOrderCharges <= 0)
        error.cancelOrderCharges = "Enter Correct Cancel Order Charges";

      if (!adminCommissionCharges)
        error.adminCommissionCharges = "Admin Commission Charges Is Required";
      if (adminCommissionCharges <= 0)
        error.adminCommissionCharges =
          "Enter Correct Admin Commission Charges ";

      return setError({ ...error });
    } else {

      let settingData = {
        zegoAppId,
        minPayout,
        zegoAppSignIn,
        privacyPolicyLink,
        resendApiKey: resendkey,
        openaiApiKey,
        privacyPolicyText,
        privateKey,
        adminCommissionCharges,
        cancelOrderCharges
      };

      props.updateSetting(settingData, setting?._id);
    }
  };

  const handleClick = (type) => {
    //Handle Update Switch Value

    props.handleToggleSwitch(setting._id, type, setting);
  };

  return (
    <>
      <div className="mainup">


        <div className="settingHeader primeHeader">
          <div className="col-12 headname" style={{ marginTop: "15px", marginBottom: "-5px", marginLeft: "2px" }}>App Setting </div>
        </div>
        <div className="settingMain">
          <div className="row" style={{ margin: "0px 2px" }}>
            {/*-------------- Box 1 --------------*/}
            <SettingBox title={`Zegocloud Setting`}>
              <Input
                type={`text`}
                label={`Zegocloud App Id`}
                value={zegoAppId}
                newClass={`col-12`}
                placeholder={`Enter Your Zegocloud App Id....`}
                errorMessage={error.zegoAppId && error.zegoAppId}
                onChange={(e) => {
                  setZegoAppId(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      zegoAppId: `Zegocloud App Id Is Required`,
                    });
                  } else {
                    return setError({
                      ...error,
                      zegoAppId: "",
                    });
                  }
                }}
              />
              <Input
                type={`text`}
                label={`Zegocloud App Sign In`}
                value={zegoAppSignIn}
                newClass={`col-12`}
                errorMessage={error.zegoAppSignIn && error.zegoAppSignIn}
                onChange={(e) => {
                  setZegoAppSignIn(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      zegoAppSignIn: `Zegocloud App Sign In Is Required`,
                    });
                  } else {
                    return setError({
                      ...error,
                      zegoAppSignIn: "",
                    });
                  }
                }}
              />
            </SettingBox>



            {/*-------------- Box 2 --------------*/}
            <SettingBox title={`App Setting`}>
              <Input
                type={`text`}
                label={`Privacy Policy Link ( redirect user to this link in app )`}
                value={privacyPolicyLink}
                newClass={`col-12`}
                placeholder={`Enter You Privacy Policy Link....`}
                errorMessage={
                  error.privacyPolicyLink && error.privacyPolicyLink
                }
                onChange={(e) => {
                  setPrivacyPolicyLink(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      privacyPolicyLink: `Privacy Policy Link Is Required`,
                    });
                  } else {
                    return setError({
                      ...error,
                      privacyPolicyLink: "",
                    });
                  }
                }}
              />

              <Input
                type={`text`}
                label={`Privacy Policy Text`}
                value={privacyPolicyText}
                newClass={`col-12`}
                placeholder={`Enter You Privacy Policy Text....`}
                errorMessage={
                  error.privacyPolicyText && error.privacyPolicyText
                }
                onChange={(e) => {
                  setPrivacyPolicyText(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      privacyPolicyText: `Privacy Policy Text Is Required`,
                    });
                  } else {
                    return setError({
                      ...error,
                      privacyPolicyText: "",
                    });
                  }
                }}
              />
            </SettingBox>

            {/* Box 7 */}
            <SettingBox
              title={`Add Product Request`}
              title2={`New product request enable/disable for seller`}
              toggleSwitch={{
                switchValue: isAddProductRequest,
                handleClick: () => {
                  handleClick("productRequest");
                },
              }}
            ></SettingBox>
            <SettingBox
              title={`Update Product Request`}
              title2={`Enable/disable product request update for seller`}
              toggleSwitch={{
                switchValue: isUpdateProductRequest,
                handleClick: () => {
                  handleClick("updateProductRequest");
                },
              }}
            ></SettingBox>



            <SettingBox title={`Charges Setting`}>
              <Input
                type={`number`}
                label={`Cancel Order Charges (%)`}
                value={cancelOrderCharges}
                newClass={`col-6 pb-2`}
                placeholder={`Enter You Cancle Order Charge....`}
                errorMessage={
                  error.cancelOrderCharges && error.cancelOrderCharges
                }
                onChange={(e) => {
                  setCancelOrderCharges(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      cancelOrderCharges: `Cancle Order ChargeIs Required`,
                    });
                  } else {
                    return setError({
                      ...error,
                      cancelOrderCharges: "",
                    });
                  }
                }}
              />

              <Input
                type={`number`}
                label={`Admin Commission Charges (%)`}
                value={adminCommissionCharges}
                newClass={`col-6`}
                placeholder={`Enter You Admin Commission Charges`}
                errorMessage={
                  error.adminCommissionCharges && error.adminCommissionCharges
                }
                onChange={(e) => {
                  setAdminCommissionCharges(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      adminCommissionCharges: `Admin Commission Charges Is Required`,
                    });
                  } else {
                    return setError({
                      ...error,
                      adminCommissionCharges: "",
                    });
                  }
                }}
              />
            </SettingBox>


            <SettingBox title={`Resend API Setting`}>
              <Input
                type={`text`}
                label={`Resend Api Key`}
                value={resendkey}
                newClass={`col-12`}
                placeholder={`Enter You Resend Api Key here`}
                errorMessage={
                  error.resendKey && error.resendKey
                }
                onChange={(e) => {
                  setResendKey(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      resendKey: `Resend Api Key Is Required`,
                    });
                  } else {
                    return setError({
                      ...error,
                      resendKey: "",
                    });
                  }
                }}
              />
            </SettingBox>



            <SettingBox title={`Minimum Withdrawal Limit (Seller) (${setting?.currency?.currencyCode})`}>
              <Input
                type={`number`}
                label={`Minimum Withdrawal Amount`}
                value={minPayout}
                newClass={`col-12`}
                placeholder={`Enter Amount....`}
                errorMessage={error.minPayout && error.minPayout}
                onChange={(e) => {
                  setMinPayout(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      minPayout: `Minimum Withdrawal Amount Is Required`,
                    });
                  } else {
                    return setError({
                      ...error,
                      minPayout: "",
                    });
                  }
                }}
              />

            </SettingBox>

            <SettingBox title={`Open AI Key Setting`}>
              <Input
                type={`text`}
                label={`Open AI Key`}
                value={openaiApiKey}
                newClass={`col-12`}
                placeholder={`Enter You Open AI Key here`}
                errorMessage={
                  error.openaiApiKey && error.openaiApiKey
                }
                onChange={(e) => {
                  setOpenaiApiKey(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      openaiApiKey: `Open AI Key Is Required`,
                    });
                  } else {
                    return setError({
                      ...error,
                      openaiApiKey: "",
                    });
                  }
                }}
              />
            </SettingBox>

            <SettingBox title={`Firebase Notification Setting `}>
              <div className="prime-input">
                <label
                  className="float-left styleForTitle"
                  style={{
                    color: "#999AA4"
                  }}
                  htmlFor="privateKey"
                >
                  Private Key JSON ( To handle firebase push notification )
                </label>
                <textarea
                  name=""
                  className="form-control mt-2"
                  id="privateKey"
                  rows={10}
                  value={privateKey}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    try {
                      JSON.parse(newValue);
                      setPrivateKey(newValue);
                      setError("");
                    } catch (error) {
                      // Handle invalid JSON input
                      console.error("Invalid JSON input:", error);
                      setPrivateKey(newValue);
                      return setError({
                        ...error,
                        privateKey: "Invalid JSON input",
                      });
                    }
                  }}
                ></textarea>

                {error.privateKey && (
                  <div className="pl-1 text-left">
                    <p className="errorMessage">{error.privateKey}</p>
                  </div>
                )}
              </div>
            </SettingBox>

            <SettingBox
              title={`Fake Data`}
              title2={`Disable/Enable fake data in app`}
              toggleSwitch={{
                switchName: " ",
                switchValue: isFakeData,
                handleClick: () => {
                  handleClick("isFakeData");
                },
              }}
            >
            </SettingBox>





          </div>
          <div className="row mt-3">
            <div className="col-12 d-flex justify-content-end">
              <Button
                newClass={`whiteFont`}
                btnName={`Submit`}
                btnColor={`#5C3AEB`}
                style={{ width: "90px", borderRadius: "6px", color: "#fff", backgroundColor: "#5C3AEB", marginBottom: "20px" }}
                onClick={(e) => handleSubmit(e)}
              />
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default connect(null, {
  getSetting,
  updateSetting,
  handleToggleSwitch,
  getWithdraw,
})(Setting);
