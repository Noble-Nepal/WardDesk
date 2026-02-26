import { Outlet } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";

const AdminLayout = () => {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex min-h-screen">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default AdminLayout;
