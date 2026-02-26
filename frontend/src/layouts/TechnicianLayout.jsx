import { Outlet } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";

const TechnicianLayout = () => {
  return (
    <ProtectedRoute allowedRoles={["technician"]}>
      <div className="flex min-h-screen">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default TechnicianLayout;
