import { useEffect, useState } from "react";
import Button from "../extra/Button";
import Input from "../extra/Input";
import { useNavigate } from "react-router-dom";
import { forgotPassword, loginAdmin } from "../store/admin/admin.action";
import { connect, useDispatch, useSelector } from "react-redux";

const ForgotPassword = (props) => {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuth = useSelector((state) => state.admin.isAuth);

  useEffect(() => {
    isAuth && navigate("/admin");
  }, [isAuth, navigate]);

  const [email, setEmail] = useState("");

  const [error, setError] = useState({
    email: "",
  });

  const handleSubmit = () => {
    if (!email) {
      let error = {};
      if (!email) error.email = "Email Is Required !";
      return setError({ ...error });
    } else {
      let login = {
        email: email,
      };

      dispatch(forgotPassword(login));
    }
  };

  return (
    <>
      <div 
        className="mainLoginPage"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fafafa"
        }}
      >
        <div 
          style={{
            maxWidth: "440px",
            width: "100%",
            padding: "20px"
          }}
        >
          {/* Form Card */}
          <div
            style={{
              background: "#fff",
              borderRadius: "24px",
              padding: "48px 40px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)"
            }}
          >
            {/* Logo */}
            <div 
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "40px"
              }}
            >
              <img
                src={require("../../assets/images/Eralogo22.png")}
                alt="Era Shop"
                style={{
                  width: "80px",
                  height: "auto"
                }}
              />
            </div>

            <div className="mb-5 text-center">
              <h1
                style={{ 
                  fontSize: "32px", 
                  fontWeight: "700",
                  color: "#000",
                  letterSpacing: "-0.5px",
                  marginBottom: "8px"
                }}
              >
                Forgot Password?
              </h1>
              
              <p
                style={{
                  color: "#737373",
                  fontSize: "15px",
                  fontWeight: "400",
                  margin: 0,
                  lineHeight: "1.6"
                }}
              >
                Enter your email and we'll send you a reset link
              </p>
            </div>
            
            <div className="loginInput" style={{ marginBottom: "24px" }}>
              <Input
                label={`Email`}
                id={`loginEmail`}
                type={`email`}
                value={email}
                style={{ 
                  background: "#fafafa",
                  border: "1px solid #e5e5e5",
                  borderRadius: "12px",
                  padding: "14px 16px",
                  fontSize: "15px",
                  transition: "all 0.2s"
                }}
                errorMessage={error.email && error.email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      email: `Email Is Required`,
                    });
                  } else {
                    return setError({
                      ...error,
                      email: "",
                    });
                  }
                }}
              />
            </div>

            <div className="loginButton mb-4">
              <Button
                newClass={`w-100`}
                btnColor={`btnBlackPrime`}
                style={{
                  background: "#000",
                  border: "none",
                  borderRadius: "12px",
                  width: "100%",
                  height: "52px",
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                btnName={`Send Reset Link`}
                onClick={handleSubmit}
              />
            </div>

            <div className="text-center">
              <a 
                href="/" 
                style={{ 
                  color: "#737373",
                  fontSize: "14px",
                  fontWeight: "500",
                  textDecoration: "none",
                  transition: "color 0.2s"
                }}
              >
                ← Back to login
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { loginAdmin })(ForgotPassword);