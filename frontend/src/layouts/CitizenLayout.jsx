import { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import DashboardHeader from "../components/common/header/DashboardHeader";
import Sidebar from "../components/common/sidebar/SideBar";
import Footer from "../components/common/footer/Footer";

const CitizenLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleMenuToggle = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  return (
    <ProtectedRoute allowedRoles={["citizen"]}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <DashboardHeader
          onMenuToggle={handleMenuToggle}
          onSearch={setSearchQuery}
        />
        <div className="flex flex-1 pt-16">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 min-w-0 p-4 sm:p-6">
            <Outlet context={{ searchQuery }} />
          </main>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default CitizenLayout;
