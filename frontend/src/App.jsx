import { Routes, Route } from "react-router-dom";
// Layouts
import CitizenLayout from "./layouts/CitizenLayout";
import AdminLayout from "./layouts/AdminLayout";
import TechnicianLayout from "./layouts/TechnicianLayout";

//Public Pages
import Login from "./pages/auth/Login";
import Registration from "./pages/auth/Registration";
import Home from "./pages/Home";

//Citizen Pages
import ComplaintDashboard from "./pages/citizen/ComplaintDashboard";
//Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
//Technician Pages
import TechnicianDashboard from "./pages/technician/TechnicianDashboard";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />

      {/* -------- CITIZEN ROUTES -------- */}
      <Route path="/citizen" element={<CitizenLayout />}>
        <Route path="dashboard" element={<ComplaintDashboard />} />
      </Route>

      {/* -------- ADMIN ROUTES -------- */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>

      {/* -------- TECHNICIAN ROUTES -------- */}
      <Route path="/technician" element={<TechnicianLayout />}>
        <Route path="dashboard" element={<TechnicianDashboard />} />
      </Route>
    </Routes>
  );
};

export default App;
