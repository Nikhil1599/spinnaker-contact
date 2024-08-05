import { Route, Routes } from "react-router-dom";
import HomePage from "../Main/Home";
import Login from "../Pages/Login";
import SignUpPage from "../Pages/Signup";
import Home from "../Dashboard/Home";
import ProtectedRoute from "./ProtectedRoutes";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUpPage />} />

      <Route
        path="/user/*"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default Routers;
