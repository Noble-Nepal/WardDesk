import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Registration from "./pages/auth/Registration";
import Home from "./pages/Home";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />

      {/* Protected Routes - add later */}
      {/*
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={["citizen"]}>
          <CitizenDashboard />
        </ProtectedRoute>
      } />
      */}
    </Routes>
  );
};

export default App;
