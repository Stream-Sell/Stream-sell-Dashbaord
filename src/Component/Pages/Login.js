import { useEffect, useState } from "react";
import Button from "../extra/Button";
import Input from "../extra/Input";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../store/admin/admin.action";
import { connect, useSelector } from "react-redux";
import { secretKey } from "../../util/config";

const Login = (props) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = () => {
    if (!email || !password) {
      let error = {};
      if (!email) error.email = "Email Is Required !";
      if (!password) error.password = "password is required !";
      return setError({ ...error });
    } else {
      let login = {
        email,
        password,
      };

      props.loginAdmin(login, navigate);
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
                Welcome back
              </h1>
              
              <p
                style={{
                  color: "#737373",
                  fontSize: "15px",
                  fontWeight: "400",
                  margin: 0
                }}
              >
                Enter your credentials to continue
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

              <Input
                label={`Password`}
                id={`loginPassword`}
                type={`password`}
                value={password}
                style={{ 
                  background: "#fafafa",
                  border: "1px solid #e5e5e5",
                  borderRadius: "12px",
                  padding: "14px 16px",
                  fontSize: "15px",
                  transition: "all 0.2s"
                }}
                errorMessage={error.password && error.password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      password: `Password Is Required`,
                    });
                  } else {
                    return setError({
                      ...error,
                      password: "",
                    });
                  }
                }}
              />
            </div>

            <div className="text-end mb-4">
              <a 
                href="/forgotPassword" 
                style={{ 
                  color: "#737373",
                  fontSize: "14px",
                  fontWeight: "500",
                  textDecoration: "none",
                  transition: "color 0.2s"
                }}
              >
                Forgot password?
              </a>
            </div>

            <div className="loginButton">
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
                btnName={`Sign In`}
                onClick={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { loginAdmin })(Login);