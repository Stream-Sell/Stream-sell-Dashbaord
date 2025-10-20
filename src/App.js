// App.js
import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./Component/Pages/Login";
import Registration from "./Component/Pages/Registration";
import UpdateCode from "./Component/Pages/UpdateCode";
import ForgotPassword from "./Component/Pages/ForgetPassword";
import ChangePassword from "./Component/Pages/ChangePassword";
import Admin from "./Component/Pages/Admin";
import PublicRoute from "./util/PublicRoute";
import AuthRoute from "./util/AuthRoute";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* PUBLIC AREA (guarded) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/register" element={<Registration />} />
        </Route>

        {/* NON-AUTH UTILITY ROUTE (if needed) */}
        <Route path="/code" element={<UpdateCode />} />

        {/* PROTECTED AREA (guarded) */}
        <Route element={<AuthRoute />}>
          <Route path="/admin/*" element={<Admin />} />
          {/* optional: make / go to /admin */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
