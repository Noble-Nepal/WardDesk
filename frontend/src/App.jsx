import { Routes, Route, Navigate } from "react-router-dom";
// Layouts
import CitizenLayout from "./layouts/CitizenLayout";
import AdminLayout from "./layouts/AdminLayout";
import TechnicianLayout from "./layouts/TechnicianLayout";
import SuperadminLayout from "./layouts/SuperadminLayout";

//Public Pages
import Login from "./pages/auth/Login";
import Registration from "./pages/auth/Registration";
import ResetPassword from "./pages/auth/ResetPassword";
import Home from "./pages/Home";
import TrackComplaint from "./pages/public/TrackComplaint";
import TermsAndConditions from "./pages/public/TermsAndConditions";
import PrivacyPolicy from "./pages/public/PrivacyPolicy";

//Citizen Pages
import ComplaintDashboard from "./pages/citizen/ComplaintDashboard";
import ReportIssue from "./pages/citizen/ReportIssue";
import MyComplaints from "./pages/citizen/MyComplaints";
import CitizenProfileSettings from "./pages/citizen/ProfileSettings";
//Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import TechnicianManagementDashboard from "./pages/admin/TechnicianManagementDashboard";
import ComplaintManagementDashboard from "./pages/admin/ComplaintManagementDashboard";
import AdminProfileSettings from "./pages/admin/ProfileSettings";
//Technician Pages
import TechnicianDashboard from "./pages/technician/TechnicianDashboard";
import UserManagementDashboard from "./pages/admin/UserManagementDashboard";
import TechnicianProfileSettings from "./pages/technician/ProfileSettings";
//Superadmin Pages
import AdminManagementDashboard from "./pages/superadmin/AdminManagementDashboard";
import AddressManagementDashboard from "./pages/superadmin/AddressManagementDashboard";
import SuperadminProfileSettings from "./pages/superadmin/ProfileSettings";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/track/:trackingId" element={<TrackComplaint />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />

      {/* -------- CITIZEN ROUTES -------- */}
      <Route path="/citizen" element={<CitizenLayout />}>
        <Route path="dashboard" element={<ComplaintDashboard />} />
        <Route path="my-complaints" element={<MyComplaints />} />
        <Route path="report-issue" element={<ReportIssue />} />
        <Route path="profile-settings" element={<CitizenProfileSettings />} />
      </Route>

      {/* -------- ADMIN ROUTES -------- */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route
          path="technician-management"
          element={<TechnicianManagementDashboard />}
        />
        <Route path="user-management" element={<UserManagementDashboard />} />
        <Route
          path="complaint-management"
          element={<ComplaintManagementDashboard />}
        />
        <Route path="profile-settings" element={<AdminProfileSettings />} />
      </Route>

      {/* -------- SUPERADMIN ROUTES -------- */}
      <Route path="/superadmin" element={<SuperadminLayout />}>
        <Route index element={<Navigate to="/superadmin/admin-management" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="admin-management" element={<AdminManagementDashboard />} />
        <Route path="address-management" element={<AddressManagementDashboard />} />
        <Route path="technician-management" element={<TechnicianManagementDashboard />} />
        <Route path="user-management" element={<UserManagementDashboard />} />
        <Route path="complaint-management" element={<ComplaintManagementDashboard />} />
        <Route path="profile-settings" element={<SuperadminProfileSettings />} />
      </Route>

      {/* -------- TECHNICIAN ROUTES -------- */}
      <Route path="/technician" element={<TechnicianLayout />}>
        <Route path="dashboard" element={<TechnicianDashboard />} />
        <Route
          path="profile-settings"
          element={<TechnicianProfileSettings />}
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
