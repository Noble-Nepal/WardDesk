import { Outlet } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import DashboardHeader from "../components/common/header/DashboardHeader";
import Footer from "../components/common/footer/Footer";
const TechnicianLayout = () => {
  return (
    <ProtectedRoute allowedRoles={["technician"]}>
      <div className="flex min-h-screen">
        <DashboardHeader onMenuToggle={() => setMenuOpen(!menuOpen)} />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <Footer />
    </ProtectedRoute>
  );
};

export default TechnicianLayout;
